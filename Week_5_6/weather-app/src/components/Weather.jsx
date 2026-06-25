import { useState } from "react";
import "./Weather.css";

function Weather() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getWeather = async () => {

        if (!city.trim()) {
            setError("Enter a city");
            return;
        }

        setLoading(true);
        setError("");
        setWeather(null);

        try {

            // Get coordinates
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
            );

            const geoData = await geoRes.json();

            if (!geoData.results) {
                throw new Error("City not found");
            }

            const { latitude, longitude, name } =
                geoData.results[0];

            // Get weather
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`
            );

            const weatherData = await weatherRes.json();

            setWeather({
                city: name,
                temperature:
                    weatherData.current.temperature_2m,
                humidity:
                    weatherData.current.relative_humidity_2m
            });

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="container">
            <div className="card">

            <h1>🌤 Weather</h1>

            <div className="search-box">
                <input
                type="text"
                placeholder="Enter city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && getWeather()}
                />

                <button onClick={getWeather}>
                Search
                </button>
            </div>

            {loading && <p className="loading">Loading...</p>}

            {error && <p className="error">{error}</p>}

            {weather && (
                <div className="weather-card">

                <div className="icon">☀️</div>

                <h2>{weather.city}</h2>

                <h1>{weather.temperature}°C</h1>

                <div className="stats">

                    <div className="stat">
                    <span>🌡 Temperature</span>
                    <strong>{weather.temperature}°C</strong>
                    </div>

                    <div className="stat">
                    <span>💧 Humidity</span>
                    <strong>{weather.humidity}%</strong>
                    </div>

                </div>

                </div>
            )}

            </div>
        </div>
        );
}

export default Weather;