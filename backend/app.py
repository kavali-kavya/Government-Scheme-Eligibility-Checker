"""Flask API for the Government Scheme Eligibility Checker.

The project intentionally uses the CSV file as its only data source for now.
There is no authentication or database in this initial version.
"""

import csv
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd


app = Flask(__name__)
# Allows the separate frontend application to call this API during development.
CORS(app)

# Build this path from this file's location so the API works no matter where it
# is started from (for example, from either the project root or backend folder).
CSV_PATH = Path(__file__).resolve().parent.parent / "data" / "government_schemes.csv"


def load_schemes():
    df = pd.read_csv(CSV_PATH)

    # Convert missing CSV values to empty strings
    df = df.fillna("")

    return df.to_dict(orient="records")


def normalise(value):
    """Make text comparisons case-insensitive and ignore extra spaces."""
    return str(value or "").strip().casefold()


def is_unrestricted(value):
    """Return True for blank CSV cells and values that mean every user qualifies."""
    return normalise(value) in {"", "any", "all", "all india"}


def matches_value(user_value, scheme_value):
    """Compare a user value to a scheme restriction safely.

    A blank or ``Any`` scheme cell is not a restriction. A slash-separated
    value (for example, ``Student/Professional``) accepts either option.
    """
    if is_unrestricted(scheme_value):
        return True

    allowed_values = [
        normalise(item) for item in str(scheme_value).split("/") if item.strip()
    ]
    return normalise(user_value) in allowed_values


def matches_optional_value(user_value, scheme_value):
    """Apply a new optional profile restriction only when the user sent it.

    This preserves compatibility with clients that do not yet collect the new
    fields. Once supplied, a specific CSV value is matched normally.
    """
    return normalise(user_value) == "" or matches_value(user_value, scheme_value)


def number_or_none(value):
    """Convert a CSV number when present; blank or invalid cells stay optional."""
    if normalise(value) == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def public_scheme(scheme):
    """Return the stable fields required by the frontend result cards."""
    fields = (
        "scheme_name",
        "category",
        "benefit",
        "eligibility",
        "official_website",
    )
    return {field: scheme.get(field, "") or "" for field in fields}


def is_eligible(user, scheme):
    """Return True when the supplied user details meet this scheme's basic rules.

    The CSV's long `eligibility` description is displayed to users but is not
    parsed here. This keeps the first version transparent and easy to extend.
    """
    try:
        age = int(user["age"])
        income = float(user["income"])
    except (KeyError, TypeError, ValueError):
        return False

    # Check numeric bounds only when the corresponding CSV cell has a value.
    age_minimum = number_or_none(scheme.get("age_min"))
    age_maximum = number_or_none(scheme.get("age_max"))
    income_limit = number_or_none(scheme.get("income_limit"))
    if age_minimum is not None and age < age_minimum:
        return False
    if age_maximum is not None and age > age_maximum:
        return False
    if income_limit is not None and income > income_limit:
        return False

    # Each profile field only filters results when the CSV specifies a value.
    required_profile_fields = ("gender", "state", "occupation")
    optional_profile_fields = (
        "student_status",
        "marital_status",
        "social_category",
        "farmer_status",
        "disability_status",
        "rural_urban",
    )
    return (
        all(matches_value(user.get(field), scheme.get(field)) for field in required_profile_fields)
        and all(matches_optional_value(user.get(field), scheme.get(field)) for field in optional_profile_fields)
    )


@app.get("/api/schemes")
def get_schemes():
    """Return every scheme from the CSV file."""
    return jsonify({"schemes": load_schemes()})


@app.post("/api/check-eligibility")
def check_eligibility():
    """Return schemes that match submitted age, income, and profile details.

    ``annual_income`` is the preferred field name. ``income`` is also
    accepted so the existing React frontend keeps working.
    """
    user = request.get_json(silent=True)
    if not isinstance(user, dict):
        return jsonify({"error": "Send user details as a JSON object."}), 400

    # These two user values are needed to evaluate present numeric rules.
    if "age" not in user or ("annual_income" not in user and "income" not in user):
        return jsonify({"error": "Both 'age' and 'annual_income' are required."}), 400

    # Keep the existing ``income`` input name internally and accept the new
    # public request field without changing the rest of the matching code.
    user = {**user, "income": user.get("annual_income", user.get("income"))}

    try:
        int(user["age"])
        float(user["income"])
    except (TypeError, ValueError):
        return jsonify({"error": "'age' and 'annual_income' must be numbers."}), 400

    matching_schemes = [
        public_scheme(scheme) for scheme in load_schemes() if is_eligible(user, scheme)
    ]
    response = {"matching_schemes": matching_schemes, "count": len(matching_schemes)}
    if not matching_schemes:
        response["message"] = "No schemes match the provided details."
    return jsonify(response)


if __name__ == "__main__":
    # debug=True is convenient during local development; do not use it in production.
    app.run(debug=True, port=5000)
