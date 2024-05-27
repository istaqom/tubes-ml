from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
import pickle

app = Flask(__name__)
cors = CORS(app)

with open("regression_model_v1.pkl", "rb") as f:
    regression_v1 = pickle.load(f)

with open("regression_model_v2.pkl", "rb") as f:
    regression_v2 = pickle.load(f)


def predict_v1(age, sleep_duration, stress_level, heart_rate):
    temp_data = {
        "Age": age,
        "Sleep Duration": sleep_duration,
        "Stress Level": stress_level,
        "Heart Rate": heart_rate,
    }

    temp_df = pd.DataFrame([temp_data])

    y_predict = regression_v1.predict(temp_df)

    return y_predict[0]


def buat_data(**kwargs):
    new_data = {
        "age": kwargs.get("age", None),
        "sleep_duration": kwargs.get("sleep_duration", None),
        "physical_activity_level": kwargs.get("physical_activity_level", None),
        "stress_level": kwargs.get("stress_level", None),
        "heart_rate": kwargs.get("heart_rate", None),
        "daily_steps": kwargs.get("daily_steps", None),
        "gender_male": kwargs.get("gender_male", None),
        "occupation_doctor": False,
        "occupation_engineer": False,
        "occupation_lawyer": False,
        "occupation_manager": False,
        "occupation_nurse": False,
        "occupation_sales_representative": False,
        "occupation_salesperson": False,
        "occupation_scientist": False,
        "occupation_software_engineer": False,
        "occupation_teacher": False,
        "sleep_disorder_none": False,
        "sleep_disorder_sleep_apnea": False,
        "bmi_category_normal_weight": False,
        "bmi_category_obese": False,
        "bmi_category_overweight": False,
    }

    # Set occupation
    occupation = kwargs.get("occupation", None)
    if occupation:
        if occupation.lower() == "doctor":
            new_data["occupation_doctor"] = True
        elif occupation.lower() == "engineer":
            new_data["occupation_engineer"] = True
        elif occupation.lower() == "lawyer":
            new_data["occupation_lawyer"] = True
        elif occupation.lower() == "manager":
            new_data["occupation_manager"] = True
        elif occupation.lower() == "nurse":
            new_data["occupation_nurse"] = True
        elif occupation.lower() == "sales_representative":
            new_data["occupation_sales_representative"] = True
        elif occupation.lower() == "salesperson":
            new_data["occupation_salesperson"] = True
        elif occupation.lower() == "scientist":
            new_data["occupation_scientist"] = True
        elif occupation.lower() == "software_engineer":
            new_data["occupation_software_engineer"] = True
        elif occupation.lower() == "teacher":
            new_data["occupation_teacher"] = True

    # Set sleep disorder
    sleep_disorder = kwargs.get("sleep_disorder", None)
    if sleep_disorder:
        if sleep_disorder.lower() == "none":
            new_data["sleep_disorder_none"] = True
        elif sleep_disorder.lower() == "sleep_apnea":
            new_data["sleep_disorder_sleep_apnea"] = True

    # Set BMI category
    bmi_category = kwargs.get("bmi_category", None)
    if bmi_category:
        if bmi_category.lower() == "normal_weight":
            new_data["bmi_category_normal_weight"] = True
        elif bmi_category.lower() == "obese":
            new_data["bmi_category_obese"] = True
        elif bmi_category.lower() == "overweight":
            new_data["bmi_category_overweight"] = True

    return new_data


def predict_v2(
    age,
    sleep_duration,
    physical_activity_level,
    stress_level,
    heart_rate,
    daily_steps,
    gender_male,
    occupation,
    sleep_disorder,
    bmi_category,
):
    temp_df = pd.DataFrame(
        [
            buat_data(
                age=age,
                sleep_duration=sleep_duration,
                physical_activity_level=physical_activity_level,
                stress_level=stress_level,
                heart_rate=heart_rate,
                daily_steps=daily_steps,
                gender_male=gender_male,
                occupation=occupation,
                sleep_disorder=sleep_disorder,
                bmi_category=bmi_category,
            )
        ]
    )

    y_predict = regression_v2.predict(temp_df)

    return y_predict[0]


@app.route("/v1/predict", methods=["POST"])
def predict_endpoint():
    data = request.json

    required_fields = ["age", "sleep_duration", "stress_level", "heart_rate"]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"msg": f"Missing fields: {', '.join(missing_fields)}"}), 400

    empty_fields = [field for field in required_fields if not data[field]]
    if empty_fields:
        return jsonify({"msg": f"Empty fields: {', '.join(empty_fields)}"}), 400

    age = data["age"]
    sleep_duration = data["sleep_duration"]
    stress_level = data["stress_level"]
    heart_rate = data["heart_rate"]

    try:
        prediction = predict_v1(age, sleep_duration, stress_level, heart_rate)
        return (
            jsonify(
                {"msg": "Successfully predict", "sleep_quality": round(prediction, 2)}
            ),
            200,
        )
    except Exception as e:
        return jsonify({"msg": f"Prediction failed: {str(e)}"}), 500


@app.route("/v2/predict", methods=["POST"])
def predict_v2_endpoint():
    data = request.json

    required_fields = [
        "age",
        "sleep_duration",
        "physical_activity_level",
        "stress_level",
        "heart_rate",
        "daily_steps",
        "gender_male",
        "occupation",
        "sleep_disorder",
        "bmi_category",
    ]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"msg": f"Missing fields: {', '.join(missing_fields)}"}), 400

    empty_fields = [field for field in required_fields if data.get(field) is None]
    if empty_fields:
        return jsonify({"msg": f"Empty fields: {', '.join(empty_fields)}"}), 400

    age = data["age"]
    sleep_duration = data["sleep_duration"]
    physical_activity_level = data["physical_activity_level"]
    stress_level = data["stress_level"]
    heart_rate = data["heart_rate"]
    daily_steps = data["daily_steps"]
    gender_male = data["gender_male"]
    occupation = data["occupation"]
    sleep_disorder = data["sleep_disorder"]
    bmi_category = data["bmi_category"]

    try:
        prediction = predict_v2(
            age,
            sleep_duration,
            physical_activity_level,
            stress_level,
            heart_rate,
            daily_steps,
            gender_male,
            occupation,
            sleep_disorder,
            bmi_category,
        )
        return (
            jsonify(
                {"msg": "Successfully predict", "sleep_quality": round(prediction, 2)}
            ),
            200,
        )
    except Exception as e:
        return jsonify({"msg": f"Prediction failed: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=False, port=8081)
