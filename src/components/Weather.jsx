import { useState } from "react";
import {
  WiHumidity,
  WiStrongWind,
  WiThermometer,
  WiSunrise,
  WiSunset,
  WiCloud,
  WiBarometer,
} from "react-icons/wi";

import {
  FaTemperatureHigh,
  FaTemperatureLow,
  FaEye,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Weather() {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  async function getWeather() {
    if (city.trim() === "") {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found.");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function getCurrentLocationWeather() {
  if (!navigator.geolocation) {
    setError("Geolocation is not supported by your browser.");
    return;
  }

  setLoading(true);
  setError("");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch weather.");
        }

        const data = await response.json();

        setWeather(data);
        setCity(data.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    () => {
      setLoading(false);
      setError("Location permission denied.");
    }
  );
}

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      getWeather();
    }
  }

  function getBackgroundClass() {
    if (!weather) return "default";

    const main = weather.weather[0].main.toLowerCase();

    if (main.includes("clear")) return "sunny";
    if (main.includes("cloud")) return "cloudy";
    if (main.includes("rain")) return "rainy";
    if (main.includes("snow")) return "snowy";

    return "default";
  }

  return (
    <div className={`weather-container ${getBackgroundClass()}`}>
      <h1>🌤 Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={getWeather}>🔍 Search</button>
      </div>

      <button
          className="location-btn"
          onClick={getCurrentLocationWeather}
        >
        <FaMapMarkerAlt/> Current Location
      </button>

      {
        loading &&
        <div className="spinner"></div>
      }

      {error && (
        <p className="error">{error}</p>
      )}

      {weather && (
        <div className="weather-card">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          {/* <br /> */}
          <p>
            Date: {new Date().toLocaleDateString()}
          </p>

          {/* <p>
            {new Date().toLocaleTimeString()}
          </p> */}

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />

          <h1>{Math.round(weather.main.temp)}°C</h1>

          <h3 style={{textTransform:"capitalize"}}>
            {weather.weather[0].description}
          </h3>

          <p className="updated">
            Updated at {new Date().toLocaleTimeString()}
          </p>

          <div className="details">
            <p>
              <WiThermometer size={35} />
              <strong>Feels Like</strong>
              {Math.round(weather.main.feels_like)}°C
            </p>

            <p>
              <WiHumidity size={35} />
              <strong>Humidity</strong>
              {weather.main.humidity}%
            </p>

            <p>
              <WiStrongWind size={35} />
              <strong>Wind Speed</strong>
              {weather.wind.speed} m/s
            </p>

            <p>
              <WiBarometer size={35} />
              <strong>Pressure</strong>
              {weather.main.pressure} hPa
            </p>

            <p>
              <FaTemperatureLow size={25} />
              <strong>Min Temp</strong>
              {Math.round(weather.main.temp_min)}°C
            </p>

            <p>
              <FaTemperatureHigh size={25} />
              <strong>Max Temp</strong>
              {Math.round(weather.main.temp_max)}°C
            </p>

            <p>
              <FaEye size={25} />
              <strong>Visibility</strong>
              {(weather.visibility / 1000).toFixed(1)} km
            </p>

            <p>
              <WiCloud size={35} />
              <strong>Clouds</strong>
              {weather.clouds.all}%
            </p>

            <p>
              <WiSunrise size={35} />
              <strong>Sunrise</strong>
              {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
            </p>

            <p>
              <WiSunset size={35} />
              <strong>Sunset</strong>
              {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
            </p>

            {/* <p>
              <strong>Latitude</strong><br/>
              {weather.coord.lat}
            </p>

            <p>
              <strong>Longitude</strong><br/>
              {weather.coord.lon}
            </p> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;