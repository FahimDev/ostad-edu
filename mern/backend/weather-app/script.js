const API_KEY = 'c3b944af7de66b5cc7ca413c277bf4b7';
const API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';

// Get ref from DOM elements. 
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const weatherInfo = document.getElementById('weatherInfo');

const loading  = document.getElementById('loading');

async function parseApiError(response) {
    try {
        const errorData = await response.json();

        if (errorData.cod && errorData.message) {
            return errorData.message;
        }

        return `Error ${errorData.cod || response.status} : ${errorData.message || response.statusText}`

    } catch (error) {
        return `Error ${response.status} : ${response.statusText}`
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden')
}

function hideError() {
    errorMessage.classList.add('hidden');
    
}

function showLoading() {
    loading.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    hideError();
}

function hideLoading() {
    loading.classList.add('hidden')
}

async function fetchWeather(cityName) {
    if (!cityName || cityName.trim() === '') {
        return;
    }
        showLoading();

    try {
        const weatherURL = `${API_ENDPOINT}?q=${cityName.trim()}&appid=${API_KEY}&units=metric`;
        const response = await fetch(weatherURL);

        if(!response.ok) {
            const errorMessage = parseApiError(response);

            if (response.status === 401) {
                throw new Error('Invalid API Key')
            } else if (response.status === 404) {
                throw new Error('City not found!')
            } else if (response.status === 429) {
                throw new Error('Too many request! Please wait for a while and try again.')
            } else if (response.status >= 500) {
                throw new Error('Weather service is temporarily unavailable. Please try again later.');
            } else {
                // Use the parsed error message from API response
                throw new Error(errorMessage);
            }
        }

        const weatherData = await response.json();

        displayWeather(weatherData);

    } catch (error) {
        if (error.name === 'TypeError') {
            showError('Network error! Please check your internet connection and try again.');
        } else if (error.name === 'TimeoutError') {
            showError('Request timed out. Please try again.'); 
        } else {
            showError('An unexpected error occurred. Please try again later.');
        }
    }

}

function displayWeather(data) {

    hideLoading();
    hideError();

    weatherInfo.classList.remove('hidden');

    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`

    const temp = Math.round(data.main.temp);
    document.getElementById('temp').textContent = temp;

    const feelsLike = Math.round(data.main.feels_like);
    document.getElementById('feelsLike').textContent = `${feelsLike}°C`;

    document.getElementById('humidity').textContent = `${data.main.humidity}%`;

    document.getElementById('description').textContent = data.weather[0].description;

    // Update wind speed (API returns in m/s, convert to km/h)
    const windKmh = Math.round(data.wind.speed * 3.6);
    document.getElementById('windSpeed').textContent = `${windKmh} km/h`;
    
    // Update pressure
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

}

searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value;
    fetchWeather(cityName);
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' ) {
        const cityName = cityInput.value;
        fetchWeather(cityName);
    }
});

cityInput.addEventListener('input', () => {
    if(!errorMessage.classList.contains('hidden')){
        hideError()
    }
})