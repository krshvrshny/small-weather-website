const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "0dbce8b379ed21e5bdce3fe3c1b43278";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Couldn't get weather data");
    }
    return await response.json();
}

function displayWeatherInfo(data) {
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }]
    } = data;

    // Reset the card content
    card.textContent = "";
    card.style.display = "flex";

    // Create the elements to display weather data
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.5).toFixed(0)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    // Append elements to the card
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    // Remove all previous weather classes
    document.body.classList.remove("sunny", "cloudy", "rainy", "snowy", "foggy");

    // Add the appropriate weather class based on the weather condition
    if (id >= 200 && id <= 299) {
        document.body.classList.add("stormy");
    } else if (id >= 300 && id <= 399) {
        document.body.classList.add("rainy");
    } else if (id >= 500 && id <= 599) {
        document.body.classList.add("rainy");
    } else if (id >= 600 && id <= 699) {
        document.body.classList.add("snowy");
    } else if (id >= 700 && id <= 799) {
        document.body.classList.add("foggy");
    } else if (id === 800) {
        document.body.classList.add("sunny");
    } else if (id >= 801 && id < 810) {
        document.body.classList.add("cloudy");
    } else {
        document.body.classList.add("cloudy");
    }
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case weatherId >= 200 && weatherId <= 299:
            return "⛈️";
        case weatherId >= 300 && weatherId <= 399:
            return "🌧️";
        case weatherId >= 500 && weatherId <= 599:
            return "🌧️";
        case weatherId >= 600 && weatherId <= 699:
            return "❄️";
        case weatherId >= 700 && weatherId <= 799:
            return "🌫️";
        case weatherId === 800:
            return "☀️";
        case weatherId >= 801 && weatherId < 810:
            return "☁️";
        default:
            return "🌈";  // Default to a rainbow emoji if the weather ID is unknown
    }
}

function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}