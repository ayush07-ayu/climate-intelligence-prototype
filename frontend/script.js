// ==========================================
// CLIMATE INTELLIGENCE - FRONTEND
// ==========================================

// Flask backend API
const API_URL = "http://127.0.0.1:5000";


// ==========================================
// DOM ELEMENTS
// ==========================================

const form = document.getElementById("predictionForm");
const predictBtn = document.getElementById("predictBtn");

const buttonText = document.getElementById("buttonText");
const loadingText = document.getElementById("loadingText");

const errorMessage = document.getElementById("errorMessage");

const resultPlaceholder =
    document.getElementById("resultPlaceholder");

const predictionResult =
    document.getElementById("predictionResult");

const predictionClass =
    document.getElementById("predictionClass");

const predictionDescription =
    document.getElementById("predictionDescription");


// ==========================================
// INPUT ELEMENTS
// ==========================================

const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");

const tempMaxInput = document.getElementById("tempMax");
const tempMinInput = document.getElementById("tempMin");
const tempAvgInput = document.getElementById("tempAvg");

const humidityInput = document.getElementById("humidity");
const rainfallInput = document.getElementById("rainfall");

const windSpeedInput = document.getElementById("windSpeed");
const pressureInput = document.getElementById("pressure");

const cloudCoverInput = document.getElementById("cloudCover");

const dateInput = document.getElementById("date");


// ==========================================
// DERIVED FEATURE ELEMENTS
// ==========================================

const rangePreview =
    document.getElementById("rangePreview");

const htiPreview =
    document.getElementById("htiPreview");


// ==========================================
// SUMMARY ELEMENTS
// ==========================================

const summaryTemp =
    document.getElementById("summaryTemp");

const summaryHumidity =
    document.getElementById("summaryHumidity");

const summaryRainfall =
    document.getElementById("summaryRainfall");

const summaryWind =
    document.getElementById("summaryWind");

const summaryPressure =
    document.getElementById("summaryPressure");

const summaryCloud =
    document.getElementById("summaryCloud");


// ==========================================
// HERO ELEMENTS
// ==========================================

const heroTemp =
    document.getElementById("heroTemp");

const heroHumidity =
    document.getElementById("heroHumidity");


// ==========================================
// HUMIDITY TEMPERATURE INDEX
// ==========================================

/*
IMPORTANT:

The exact formula used during backend feature engineering
must be confirmed from the project's preprocessing notebook.

For now, this function uses the same feature name expected
by the backend.

DO NOT silently treat this as a scientifically validated formula.
Replace this calculation if the backend notebook uses another formula.
*/

function calculateHumidityTemperatureIndex(
    temperature,
    humidity
) {

    if (
        Number.isNaN(temperature) ||
        Number.isNaN(humidity)
    ) {
        return null;
    }

    // Temporary calculation.
    // Confirm with backend feature-engineering logic.
    return Number(
           (humidity * temperature).toFixed(2)
    );
}


// ==========================================
// CALCULATE DERIVED FEATURES
// ==========================================

function updateDerivedValues() {

    const maxTemp = parseFloat(tempMaxInput.value);
    const minTemp = parseFloat(tempMinInput.value);
    const avgTemp = parseFloat(tempAvgInput.value);
    const humidity = parseFloat(humidityInput.value);

    // Temperature Range

    if (
        !Number.isNaN(maxTemp) &&
        !Number.isNaN(minTemp)
    ) {

        const temperatureRange =
            maxTemp - minTemp;

        rangePreview.textContent =
            `${temperatureRange.toFixed(2)} °C`;

    } else {

        rangePreview.textContent = "-- °C";
    }


    // Humidity Temperature Index

    if (
        !Number.isNaN(avgTemp) &&
        !Number.isNaN(humidity)
    ) {

        const hti =
            calculateHumidityTemperatureIndex(
                avgTemp,
                humidity
            );

        if (hti !== null) {

            htiPreview.textContent = hti;

        }

    } else {

        htiPreview.textContent = "--";
    }
}


// ==========================================
// LISTEN FOR INPUT CHANGES
// ==========================================

[
    tempMaxInput,
    tempMinInput,
    tempAvgInput,
    humidityInput
].forEach(input => {

    input.addEventListener(
        "input",
        updateDerivedValues
    );

});


// ==========================================
// DATE DEFAULT
// ==========================================

const today =
    new Date().toISOString().split("T")[0];

dateInput.value = today;


// ==========================================
// ERROR HANDLING
// ==========================================

function showError(message) {

    errorMessage.classList.remove("hidden");

    errorMessage.querySelector("span").textContent =
        message;
}


function hideError() {

    errorMessage.classList.add("hidden");

    errorMessage.querySelector("span").textContent =
        "";
}


// ==========================================
// LOADING STATE
// ==========================================

function setLoading(isLoading) {

    predictBtn.disabled = isLoading;

    if (isLoading) {

        buttonText.classList.add("hidden");

        loadingText.classList.remove("hidden");

    } else {

        buttonText.classList.remove("hidden");

        loadingText.classList.add("hidden");
    }
}


// ==========================================
// DATE FEATURES
// ==========================================

function extractDateFeatures(dateValue) {

    const date = new Date(dateValue + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return {

        Year: date.getFullYear(),

        Month: date.getMonth() + 1,

        Day: date.getDate(),

        Day_of_Week: date.getDay()

    };
}


// ==========================================
// VALIDATION
// ==========================================

function validateInputs() {

    const requiredInputs = form.querySelectorAll(
        "input[required]"
    );

    for (const input of requiredInputs) {

        if (!input.value.trim()) {

            input.focus();

            showError(
                "Please fill in all required fields."
            );

            return false;
        }
    }


    const maxTemp =
        parseFloat(tempMaxInput.value);

    const minTemp =
        parseFloat(tempMinInput.value);


    if (maxTemp < minTemp) {

        showError(
            "Maximum temperature cannot be lower than minimum temperature."
        );

        tempMaxInput.focus();

        return false;
    }


    const humidity =
        parseFloat(humidityInput.value);

    if (humidity < 0 || humidity > 100) {

        showError(
            "Humidity must be between 0 and 100%."
        );

        humidityInput.focus();

        return false;
    }


    const cloudCover =
        parseFloat(cloudCoverInput.value);

    if (cloudCover < 0 || cloudCover > 100) {

        showError(
            "Cloud cover must be between 0 and 100%."
        );

        cloudCoverInput.focus();

        return false;
    }


    return true;
}


// ==========================================
// WEATHER SUMMARY
// ==========================================

function updateWeatherSummary() {

    const avgTemp =
        parseFloat(tempAvgInput.value);

    const humidity =
        parseFloat(humidityInput.value);

    const rainfall =
        parseFloat(rainfallInput.value);

    const wind =
        parseFloat(windSpeedInput.value);

    const pressure =
        parseFloat(pressureInput.value);

    const cloud =
        parseFloat(cloudCoverInput.value);


    summaryTemp.textContent =
        `${avgTemp} °C`;

    summaryHumidity.textContent =
        `${humidity} %`;

    summaryRainfall.textContent =
        `${rainfall} mm`;

    summaryWind.textContent =
        `${wind} km/h`;

    summaryPressure.textContent =
        `${pressure} hPa`;

    summaryCloud.textContent =
        `${cloud} %`;


    heroTemp.textContent =
        `${avgTemp} °C`;

    heroHumidity.textContent =
        `${humidity} %`;
}


// ==========================================
// RISK INDICATOR
// ==========================================

function updateRiskIndicator(prediction) {

    const riskElements =
        document.querySelectorAll(
            ".risk-bar span"
        );


    riskElements.forEach(element => {

        element.classList.remove("active");

        if (
            element.dataset.risk.toLowerCase() ===
            prediction.toLowerCase()
        ) {

            element.classList.add("active");
        }

    });
}


// ==========================================
// PREDICTION DESCRIPTION
// ==========================================

function getPredictionDescription(prediction) {

    const descriptions = {

        "Good":
            "The predicted climate category is Good.",

        "Satisfactory":
            "The predicted climate category is Satisfactory.",

        "Moderate":
            "The predicted climate category is Moderate.",

        "Poor":
            "The predicted climate category is Poor.",

        "Very Poor":
            "The predicted climate category is Very Poor."

    };


    return (
        descriptions[prediction] ||
        "The model returned a climate category."
    );
}


// ==========================================
// DISPLAY RESULT
// ==========================================

function displayPrediction(prediction) {

    resultPlaceholder.classList.add("hidden");

    predictionResult.classList.remove("hidden");


    predictionClass.textContent =
        prediction.toUpperCase();


    predictionDescription.textContent =
        getPredictionDescription(prediction);


    updateRiskIndicator(prediction);
}


// ==========================================
// FORM SUBMISSION
// ==========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        hideError();


        // Validate
        if (!validateInputs()) {
            return;
        }


        // Date features
        const dateFeatures =
            extractDateFeatures(
                dateInput.value
            );


        if (!dateFeatures) {

            showError(
                "Please enter a valid date."
            );

            return;
        }


        // Numeric values

        const maxTemp =
            parseFloat(tempMaxInput.value);

        const minTemp =
            parseFloat(tempMinInput.value);

        const avgTemp =
            parseFloat(tempAvgInput.value);

        const humidity =
            parseFloat(humidityInput.value);

        const rainfall =
            parseFloat(rainfallInput.value);

        const windSpeed =
            parseFloat(windSpeedInput.value);

        const pressure =
            parseFloat(pressureInput.value);

        const cloudCover =
            parseFloat(cloudCoverInput.value);


        // Derived features

        const temperatureRange =
            maxTemp - minTemp;


        const humidityTemperatureIndex =
            calculateHumidityTemperatureIndex(
                avgTemp,
                humidity
            );


        if (
            humidityTemperatureIndex === null
        ) {

            showError(
                "Unable to calculate derived climate features."
            );

            return;
        }


        // ==========================================
        // EXACT BACKEND JSON
        // ==========================================

        const requestData = {

            City:
                cityInput.value.trim(),

            State:
                stateInput.value.trim(),

            "Temperature_Max (°C)":
                maxTemp,

            "Temperature_Min (°C)":
                minTemp,

            "Temperature_Avg (°C)":
                avgTemp,

            "Humidity (%)":
                humidity,

            "Rainfall (mm)":
                rainfall,

            "Wind_Speed (km/h)":
                windSpeed,

            "Pressure (hPa)":
                pressure,

            "Cloud_Cover (%)":
                cloudCover,

            Year:
                dateFeatures.Year,

            Month:
                dateFeatures.Month,

            Day:
                dateFeatures.Day,

            Day_of_Week:
                dateFeatures.Day_of_Week,

            "Temperature_Range (°C)":
                temperatureRange,

            Humidity_Temperature_Index:
                humidityTemperatureIndex
        };


        // Update UI
        updateWeatherSummary();

        setLoading(true);


        try {

            // ==========================================
            // CALL FLASK API
            // ==========================================

            const response =
                await fetch(
                    `${API_URL}/predict`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                requestData
                            )
                    }
                );


            // Try to read JSON
            const data =
                await response.json();


            // Backend error
            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Prediction request failed."
                );
            }


            // Prediction missing
            if (!data.prediction) {

                throw new Error(
                    "Backend did not return a prediction."
                );
            }


            // ==========================================
            // SHOW RESULT
            // ==========================================

            displayPrediction(
                data.prediction
            );

        }

        catch (error) {

            console.error(
                "Prediction Error:",
                error
            );


            showError(
                error.message.includes(
                    "Failed to fetch"
                )
                    ? "Backend is unavailable. Please make sure the Flask server is running on http://127.0.0.1:5000."
                    : error.message
            );

        }

        finally {

            setLoading(false);
        }

    }
);


// ==========================================
// INITIALIZATION
// ==========================================

updateDerivedValues();