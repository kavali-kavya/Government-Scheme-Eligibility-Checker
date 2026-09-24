"""Unit tests for the CSV loader and scheme eligibility filters."""

import unittest
from unittest.mock import patch

import app as scheme_app


def make_scheme(**overrides):
    scheme = {field: "Any" for field in scheme_app.SCHEME_FIELDS}
    scheme.update(
        {
            "scheme_name": "Test scheme",
            "category": "Test",
            "state": "Telangana",
            "age_min": "18",
            "age_max": "60",
            "income_limit": "",
            "benefit": "Test benefit",
            "eligibility": "Test eligibility",
            "official_website": "https://example.gov.in",
        }
    )
    scheme.update(overrides)
    return scheme


def make_user(**overrides):
    user = {
        "age": 30,
        "annual_income": 100000,
        "gender": "Male",
        "state": "Telangana",
        "occupation": "Student",
        "student_status": "Yes",
        "marital_status": "Unmarried",
        "social_category": "OBC",
        "farmer_status": "No",
        "disability_status": "No",
        "rural_urban": "Urban",
    }
    user.update(overrides)
    return user


class SchemeEligibilityTests(unittest.TestCase):
    def assert_matches(self, field, value, expected):
        scheme = make_scheme(**{field: value})
        self.assertEqual(scheme_app.is_eligible(make_user(), scheme), expected)

    def test_dataset_has_requested_columns_and_84_schemes(self):
        schemes = scheme_app.load_schemes()
        self.assertEqual(len(schemes), 84)
        self.assertEqual(tuple(schemes[0])[: len(scheme_app.SCHEME_FIELDS)], scheme_app.SCHEME_FIELDS)
        self.assertTrue(all(len(scheme) == 21 for scheme in schemes))
        self.assertTrue(all(scheme["last_verified"] == "2026-09" for scheme in schemes))

    def test_all_84_schemes_get_application_information(self):
        schemes = scheme_app.load_schemes()
        self.assertEqual(len(schemes), 84)
        self.assertTrue(
            all(
                scheme["documents_required"]
                and scheme["how_to_apply"]
                and scheme["apply_at"]
                for scheme in schemes
            )
        )
        self.assertTrue(
            all(isinstance(scheme["documents_required"], list) for scheme in schemes)
        )

    def test_age_min_and_max_are_inclusive(self):
        scheme = make_scheme(age_min="30", age_max="30")
        self.assertTrue(scheme_app.is_eligible(make_user(age=30), scheme))
        self.assertFalse(scheme_app.is_eligible(make_user(age=29), scheme))
        self.assertFalse(scheme_app.is_eligible(make_user(age=31), scheme))

    def test_any_age_bounds_are_unrestricted(self):
        scheme = make_scheme(age_min="Any", age_max="Any")
        self.assertTrue(scheme_app.is_eligible(make_user(age=0), scheme))
        self.assertTrue(scheme_app.is_eligible(make_user(age=120), scheme))

    def test_gender_restriction_and_any(self):
        self.assert_matches("gender", "Male", True)
        self.assert_matches("gender", "Female", False)
        self.assert_matches("gender", "Any", True)

    def test_income_limit_is_inclusive_and_blank_or_any_is_unlimited(self):
        scheme = make_scheme(income_limit="100000")
        self.assertTrue(scheme_app.is_eligible(make_user(annual_income=100000), scheme))
        self.assertFalse(scheme_app.is_eligible(make_user(annual_income=100001), scheme))
        self.assertTrue(
            scheme_app.is_eligible(make_user(annual_income=999999999), make_scheme(income_limit=""))
        )
        self.assertTrue(
            scheme_app.is_eligible(make_user(annual_income=999999999), make_scheme(income_limit="Any"))
        )

    def test_occupation_restriction_and_any(self):
        self.assert_matches("occupation", "Student", True)
        self.assert_matches("occupation", "Farmer", False)
        self.assert_matches("occupation", "Any", True)

    def test_each_profile_filter_and_any(self):
        filters = {
            "student_status": ("No", "Any"),
            "marital_status": ("Married", "Any"),
            "social_category": ("SC", "Any"),
            "farmer_status": ("Yes", "Any"),
            "disability_status": ("Yes", "Any"),
            "rural_urban": ("Rural", "Any"),
        }
        for field, (mismatch, unrestricted) in filters.items():
            with self.subTest(field=field):
                self.assert_matches(field, make_user()[field], True)
                self.assert_matches(field, mismatch, False)
                self.assert_matches(field, unrestricted, True)

    def test_state_exact_all_india_and_any(self):
        self.assert_matches("state", "Telangana", True)
        self.assert_matches("state", "Karnataka", False)
        self.assert_matches("state", "All India", True)
        self.assert_matches("state", "Any", True)

    def test_any_is_case_and_whitespace_insensitive(self):
        self.assert_matches("occupation", "  aNy  ", True)

    def test_form_values_map_to_dataset_values(self):
        mapped = scheme_app.normalise_user_profile(
            {
                "state": "Other",
                "custom_state": "Telangana",
                "occupation": "Homemaker",
                "social_category": "BC",
            }
        )
        self.assertEqual(mapped["state"], "Telangana")
        self.assertEqual(mapped["occupation"], "Unemployed")
        self.assertEqual(mapped["social_category"], "OBC")
        self.assertEqual(mapped["student_status"], "No")
        self.assertEqual(mapped["farmer_status"], "No")

        for occupation in ("Student", "School Student", "College Student"):
            with self.subTest(occupation=occupation):
                self.assertEqual(
                    scheme_app.normalise_user_profile({"occupation": occupation})[
                        "occupation"
                    ],
                    "Student",
                )
        for occupation in ("Business Owner", "Self-employed"):
            with self.subTest(occupation=occupation):
                self.assertEqual(
                    scheme_app.normalise_user_profile({"occupation": occupation})[
                        "occupation"
                    ],
                    "Business",
                )

    def test_loader_preserves_blank_income_limit(self):
        schemes = scheme_app.load_schemes()
        self.assertTrue(any(scheme["income_limit"] == "" for scheme in schemes))

    def test_match_reasons_describe_restrictive_fields(self):
        scheme = make_scheme(
            age_min="21",
            age_max="65",
            gender="Female",
            state="Maharashtra",
            income_limit="250000",
        )
        user = make_user(gender="Female", state="Maharashtra")
        with patch.object(scheme_app, "load_schemes", return_value=[scheme]):
            response = scheme_app.app.test_client().post(
                "/api/check-eligibility", json=user
            )

        self.assertEqual(response.status_code, 200)
        reasons = response.get_json()["eligible"][0]["match_reasons"]
        self.assertIn("Age 21-65 (you are 30)", reasons)
        self.assertIn("Female applicants", reasons)
        self.assertIn("Family income up to Rs 2,50,000", reasons)
        self.assertIn("Resident of Maharashtra", reasons)

    def test_age_near_miss_within_three_years(self):
        scheme = make_scheme(age_min="60", age_max="65")
        user = make_user(age=58)
        with patch.object(scheme_app, "load_schemes", return_value=[scheme]):
            response = scheme_app.app.test_client().post(
                "/api/check-eligibility", json=user
            )

        near_misses = response.get_json()["near_misses"]
        self.assertEqual(len(near_misses), 1)
        self.assertEqual(near_misses[0]["miss_reason"], "You will qualify from age 60")

    def test_income_near_miss_within_twenty_five_percent(self):
        scheme = make_scheme(income_limit="250000")
        user = make_user(annual_income=275000)
        with patch.object(scheme_app, "load_schemes", return_value=[scheme]):
            response = scheme_app.app.test_client().post(
                "/api/check-eligibility", json=user
            )

        near_misses = response.get_json()["near_misses"]
        self.assertEqual(len(near_misses), 1)
        self.assertEqual(
            near_misses[0]["miss_reason"],
            "Your income is about Rs 25,000 above the limit of Rs 2,50,000",
        )

    def test_state_mismatch_is_not_a_near_miss(self):
        scheme = make_scheme(state="Maharashtra")
        with patch.object(scheme_app, "load_schemes", return_value=[scheme]):
            response = scheme_app.app.test_client().post(
                "/api/check-eligibility", json=make_user(state="Telangana")
            )

        self.assertEqual(response.get_json()["near_misses"], [])

    def test_blank_income_limit_never_causes_income_near_miss(self):
        scheme = make_scheme(income_limit="")
        with patch.object(scheme_app, "load_schemes", return_value=[scheme]):
            response = scheme_app.app.test_client().post(
                "/api/check-eligibility", json=make_user(annual_income=9000000)
            )

        body = response.get_json()
        self.assertEqual(body["count"], 1)
        self.assertEqual(body["near_misses"], [])

    def test_results_api_returns_card_fields_and_matching_data(self):
        scheme = make_scheme(state="All India", income_limit="")
        user = make_user(state="Other", custom_state="Mizoram")
        with patch.object(scheme_app, "load_schemes", return_value=[scheme]):
            response = scheme_app.app.test_client().post(
                "/api/check-eligibility", json=user
            )

        self.assertEqual(response.status_code, 200)
        body = response.get_json()
        self.assertEqual(body["count"], 1)
        self.assertEqual(body["eligible"], body["matching_schemes"])
        card = body["matching_schemes"][0]
        self.assertEqual(
            set(card),
            {
                "scheme_name",
                "category",
                "state",
                "benefit",
                "eligibility",
                "official_website",
                "last_verified",
                "documents_required",
                "how_to_apply",
                "apply_at",
                "match_reasons",
            },
        )
        self.assertEqual(card["documents_required"], [])
        self.assertEqual(card["how_to_apply"], "")
        self.assertEqual(card["apply_at"], "")

    def test_schemes_api_includes_verification_date(self):
        response = scheme_app.app.test_client().get("/api/schemes")
        self.assertEqual(response.status_code, 200)
        schemes = response.get_json()["schemes"]
        self.assertEqual(len(schemes), 84)
        self.assertTrue(all(scheme["last_verified"] == "2026-09" for scheme in schemes))
        self.assertTrue(
            all(
                isinstance(scheme["documents_required"], list)
                and scheme["documents_required"]
                and scheme["how_to_apply"]
                and scheme["apply_at"]
                for scheme in schemes
            )
        )


if __name__ == "__main__":
    unittest.main()
