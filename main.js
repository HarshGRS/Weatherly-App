const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  weatherResult.innerHTML = '<p class="text-lg text-white animate-pulse">Loading...</p>';
  try {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    if (!geoResponse.ok) throw new Error('Failed to fetch location data.');
    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) throw new Error('City not found.');

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    if (!weatherResponse.ok) throw new Error('Failed to fetch weather data.');

    const weatherData = await weatherResponse.json();
    displayWeather(name, country, weatherData.current_weather);
  } catch (error) {
    weatherResult.innerHTML = `<p class="text-red-400 text-lg">${error.message}</p>`;
  }
}

function displayWeather(cityName, country, weather) {
  const weatherIcon = getWeatherIcon(weather.weathercode);
  const description = getWeatherDescription(weather.weathercode);

  weatherResult.innerHTML = `
    <div class="fade-in">
      <h2 class="text-2xl font-bold">${cityName}, ${country}</h2>
      <div class="flex justify-center items-center mt-4">
        <div class="icon mr-4">${weatherIcon}</div>
        <div>
          <p class="text-xl">🌡 Temperature: <strong>${weather.temperature}°C</strong></p>
          <p class="text-lg">💨 Wind: ${weather.windspeed} km/h (${weather.winddirection}°)</p>
          <p class="text-md italic mt-2 text-indigo-100">${description}</p>
        </div>
      </div>
    </div>
  `;
}

function getWeatherIcon(code) {
  // Basic mapping (can be expanded)
  if ([0].includes(code)) return '☀️';
  if ([1, 2].includes(code)) return '⛅';
  if ([3].includes(code)) return '☁️';
  if ([45, 48].includes(code)) return '🌫️';
  if ([51, 53, 55].includes(code)) return '🌦️';
  if ([61, 63, 65].includes(code)) return '🌧️';
  if ([66, 67].includes(code)) return '🌨️';
  if ([71, 73, 75].includes(code)) return '❄️';
  if ([80, 81, 82].includes(code)) return '🌧️';
  if ([95].includes(code)) return '⛈️';
  return '🌍';
}

function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate showers",
    82: "Violent showers",
    95: "Thunderstorm"
  };
  return descriptions[code] || "Weather condition unavailable.";
}
