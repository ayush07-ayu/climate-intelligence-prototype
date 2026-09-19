
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os


# Create Flask application
app = Flask(__name__)

# Enable CORS for frontend connection
CORS(app)


# Project root directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Load trained ML model
MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "climate_risk_model.pkl"
)

model = joblib.load(MODEL_PATH)


# -------------------------
# Home Route
# -------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Climate Intelligence API is running"
    })


# -------------------------
# Prediction Route
# -------------------------

@app.route("/predict", methods=["POST"])
def predict():

    try:
        # Get JSON data from frontend
        data = request.get_json()

        # Check if JSON data was received
        if not data:
            return jsonify({
                "error": "No JSON data received"
            }), 400

        # Required input fields
        required_fields = [
            "City",
            "State",
            "Temperature_Max (°C)",
            "Temperature_Min (°C)",
            "Temperature_Avg (°C)",
            "Humidity (%)",
            "Rainfall (mm)",
            "Wind_Speed (km/h)",
            "Pressure (hPa)",
            "Cloud_Cover (%)",
            "Year",
            "Month",
            "Day",
            "Day_of_Week",
            "Temperature_Range (°C)",
            "Humidity_Temperature_Index"
        ]

        # Check for missing fields
        for field in required_fields:

            if field not in data:
                return jsonify({
                    "error": f"Required field missing: {field}"
                }), 400

        # Create DataFrame for ML model
        input_data = pd.DataFrame([{
            field: data[field]
            for field in required_fields
        }])

        # Make prediction
        prediction = model.predict(input_data)[0]

        # Send prediction to frontend
        return jsonify({
            "prediction": prediction
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# -------------------------
# Run Flask Server
# -------------------------
if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
