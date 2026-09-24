"""Flask API for the Government Scheme Eligibility Checker."""

import csv
import math
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

CSV_PATH = Path(__file__).resolve().parent.parent / "data" / "government_schemes.csv"
SCHEME_FIELDS = (
    "scheme_name",
    "category",
    "state",
    "age_min",
    "age_max",
    "gender",
    "income_limit",
    "occupation",
    "student_status",
    "marital_status",
    "social_category",
    "farmer_status",
    "disability_status",
    "rural_urban",
    "benefit",
    "eligibility",
    "official_website",
    "last_verified",
)


def load_schemes():
    """Load all scheme fields while preserving blank CSV cells as empty strings."""
    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as schemes_file:
        reader = csv.DictReader(schemes_file)
        if tuple(reader.fieldnames or ()) != SCHEME_FIELDS:
            raise ValueError("The schemes CSV does not have the expected columns.")
        return [
            {field: (row.get(field) or "").strip() for field in SCHEME_FIELDS}
            for row in reader
        ]


def normalise(value):
    """Make text comparisons case-insensitive and ignore extra spaces."""
    return str(value or "").strip().casefold()


def is_unrestricted(value):
    """Return True when a scheme explicitly has no restriction for a field."""
    return normalise(value) == "any"


def matches_value(user_value, scheme_value):
    """Match a profile value to a scheme restriction or its Any marker."""
    if normalise(scheme_value) in {"", "any"}:
        return True

    allowed_values = [
        normalise(item) for item in str(scheme_value or "").split("/") if item.strip()
    ]
    return normalise(user_value) in allowed_values


def matches_state(user_state, scheme_state):
    """Treat the dataset's All India marker as matching every user state."""
    return (
        normalise(scheme_state) == "all india"
        or matches_value(user_state, scheme_state)
    )


def number_or_none(value):
    """Convert a CSV number; blank or Any numeric cells have no bound."""
    if normalise(value) in {"", "any"}:
        return None
    try:
        number = float(value)
        return number if math.isfinite(number) else None
    except (TypeError, ValueError):
        return None


def public_scheme(scheme):
    """Return the scheme card fields needed by the eligibility results page."""
    fields = (
        "scheme_name",
        "category",
        "state",
        "benefit",
        "eligibility",
        "official_website",
        "last_verified",
    )
    return {field: scheme.get(field, "") or "" for field in fields}


def normalise_user_profile(user):
    """Map values collected by the React form to the scheme dataset vocabulary."""
    profile = dict(user)

    state = normalise(profile.get("state"))
    if state == "other":
        profile["state"] = profile.get("custom_state", "")
    elif state == "central government":
        profile["state"] = "All India"

    occupation = normalise(profile.get("occupation"))
    occupation_map = {
        "school student": "Student",
        "college student": "Student",
        "business owner": "Business",
        "self-employed": "Business",
        "homemaker": "Unemployed",
    }
    if occupation == "other":
        profile["occupation"] = profile.get("custom_occupation", "")
    elif occupation in occupation_map:
        profile["occupation"] = occupation_map[occupation]

    if normalise(profile.get("social_category")) == "bc":
        profile["social_category"] = "OBC"

    # The form asks these follow-up questions only for the matching occupation.
    mapped_occupation = normalise(profile.get("occupation"))
    if normalise(profile.get("student_status")) == "":
        profile["student_status"] = "Yes" if mapped_occupation == "student" else "No"
    if normalise(profile.get("farmer_status")) == "":
        profile["farmer_status"] = "Yes" if mapped_occupation == "farmer" else "No"

    return profile


def format_rupees(amount):
    """Format an amount using the Indian digit grouping convention."""
    amount = float(amount)
    whole = int(abs(amount))
    digits = str(whole)
    if len(digits) > 3:
        trailing = digits[-3:]
        leading = digits[:-3]
        groups = []
        while leading:
            groups.insert(0, leading[-2:])
            leading = leading[:-2]
        digits = ",".join(groups + [trailing])
    if amount < 0:
        digits = f"-{digits}"
    if not amount.is_integer():
        fraction = f"{abs(amount):.2f}".split(".")[1]
        digits = f"{digits}.{fraction}"
    return digits


def criterion_results(user, scheme):
    """Return all independent pass/fail criteria and parsed numeric values."""
    try:
        age = float(user["age"])
        income = float(user.get("annual_income", user.get("income")))
    except (KeyError, TypeError, ValueError):
        return None
    if not math.isfinite(age) or not math.isfinite(income):
        return None

    age_minimum = number_or_none(scheme.get("age_min"))
    age_maximum = number_or_none(scheme.get("age_max"))
    income_limit = number_or_none(scheme.get("income_limit"))
    age_matches = (age_minimum is None or age >= age_minimum) and (
        age_maximum is None or age <= age_maximum
    )
    income_matches = income_limit is None or income <= income_limit

    profile_fields = (
        "gender",
        "occupation",
        "student_status",
        "marital_status",
        "social_category",
        "farmer_status",
        "disability_status",
        "rural_urban",
    )
    results = {
        "age": age_matches,
        "income": income_matches,
        "state": matches_state(user.get("state"), scheme.get("state")),
    }
    results.update(
        {
            field: matches_value(user.get(field), scheme.get(field))
            for field in profile_fields
        }
    )
    return {
        "results": results,
        "age": age,
        "income": income,
        "age_min": age_minimum,
        "age_max": age_maximum,
        "income_limit": income_limit,
    }


def is_eligible(user, scheme):
    """Return True only when every scheme restriction matches the user."""
    evaluation = criterion_results(user, scheme)
    return bool(evaluation and all(evaluation["results"].values()))


def match_reasons(user, scheme):
    """Describe the scheme fields that actually restricted a successful match."""
    reasons = []
    bounds = criterion_results(user, scheme)
    if not bounds:
        return reasons

    minimum = bounds["age_min"]
    maximum = bounds["age_max"]
    age = bounds["age"]
    if minimum is not None and maximum is not None:
        reasons.append(f"Age {minimum:g}-{maximum:g} (you are {age:g})")
    elif minimum is not None:
        reasons.append(f"Age {minimum:g}+ (you are {age:g})")
    elif maximum is not None:
        reasons.append(f"Age up to {maximum:g} (you are {age:g})")

    income_limit = bounds["income_limit"]
    if income_limit is not None:
        reasons.append(f"Family income up to Rs {format_rupees(income_limit)}")

    gender = scheme.get("gender", "")
    if normalise(gender) not in {"", "any"}:
        reasons.append(
            f"{gender.strip()} applicants"
            if normalise(gender) in {"female", "male"}
            else f"Gender: {gender.strip()}"
        )

    state = scheme.get("state", "")
    if normalise(state) not in {"", "any", "all india"}:
        reasons.append(f"Resident of {state.strip()}")

    reason_labels = {
        "occupation": "Occupation",
        "student_status": "Student status",
        "marital_status": "Marital status",
        "social_category": "Social category",
        "farmer_status": "Farmer status",
        "disability_status": "Disability status",
        "rural_urban": "Residence",
    }
    for field, label in reason_labels.items():
        value = scheme.get(field, "")
        if normalise(value) not in {"", "any"}:
            reasons.append(f"{label}: {value.strip()}")

    return reasons


def near_miss_reason(user, scheme, evaluation):
    """Return a small age/income miss explanation only if exactly one rule fails."""
    failures = [
        field
        for field, passed in evaluation["results"].items()
        if not passed
    ]
    if len(failures) != 1:
        return None

    failed_field = failures[0]
    if failed_field == "age":
        age = evaluation["age"]
        minimum = evaluation["age_min"]
        maximum = evaluation["age_max"]
        if minimum is not None and age < minimum and minimum - age <= 3:
            return f"You will qualify from age {minimum:g}"
        if maximum is not None and age > maximum and age - maximum <= 3:
            return f"You may qualify up to age {maximum:g}"
    elif failed_field == "income":
        income = evaluation["income"]
        limit = evaluation["income_limit"]
        if limit is not None and limit < income <= limit * 1.25:
            excess = income - limit
            return (
                f"Your income is about Rs {format_rupees(excess)} above the limit of "
                f"Rs {format_rupees(limit)}"
            )
    return None


@app.get("/api/schemes")
def get_schemes():
    """Return every scheme from the CSV file."""
    return jsonify({"schemes": load_schemes()})


@app.post("/api/check-eligibility")
def check_eligibility():
    """Return all schemes matching the submitted profile."""
    user = request.get_json(silent=True)
    if not isinstance(user, dict):
        return jsonify({"error": "Send user details as a JSON object."}), 400

    if "age" not in user or ("annual_income" not in user and "income" not in user):
        return jsonify({"error": "Both 'age' and 'annual_income' are required."}), 400

    user = normalise_user_profile(user)
    user = {**user, "income": user.get("annual_income", user.get("income"))}
    try:
        age = float(user["age"])
        income = float(user["income"])
        if not math.isfinite(age) or not math.isfinite(income):
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"error": "'age' and 'annual_income' must be numbers."}), 400

    eligible = []
    near_misses = []
    for scheme in load_schemes():
        evaluation = criterion_results(user, scheme)
        if evaluation is None:
            continue
        if all(evaluation["results"].values()):
            eligible.append(
                {
                    **public_scheme(scheme),
                    "match_reasons": match_reasons(user, scheme),
                }
            )
            continue

        reason = near_miss_reason(user, scheme, evaluation)
        if reason:
            near_misses.append(
                {**public_scheme(scheme), "miss_reason": reason}
            )

    response = {
        "eligible": eligible,
        # Preserve the current frontend's response key and count.
        "matching_schemes": eligible,
        "near_misses": near_misses,
        "count": len(eligible),
    }
    if not eligible:
        response["message"] = "No schemes match the provided details."
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
