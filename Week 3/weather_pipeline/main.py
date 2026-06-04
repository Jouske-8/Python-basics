from datetime import datetime

from weather_api import (
    get_coordinates,
    get_weather
)

from storage import (
    save_weather,
    update_history
)

from logger import logger

WEATHER_CODES = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Rain Showers",
    95: "Thunderstorm"
}

def transform_weather(city, weather_data):

    current = weather_data["current"]

    return {
        "city": city,
        "timestamp": datetime.now().isoformat(),

        "temperature_celsius":
            current["temperature_2m"],

        "humidity":
            current["relative_humidity_2m"],

        "pressure":
            current["pressure_msl"],

        "weather_condition":
            WEATHER_CODES.get(
                current["weather_code"],
                "Unknown"
            )
    }

def main():

    city = input(
        "Enter city name: "
    ).strip()

    coordinates = get_coordinates(city)

    if not coordinates:

        logger.error(
            "Unable to fetch coordinates"
        )

        print(
            "Error: City not found."
        )

        return
    
    latitude, longitude, city_name = coordinates

    weather_data = get_weather(
        latitude,
        longitude
    )

    if not weather_data:

        logger.error(
            "Unable to fetch weather data"
        )

        print(
            "Error fetching weather."
        )

        return
    
    transformed = transform_weather(
        city_name,
        weather_data
    )

    save_weather(transformed)

    update_history(transformed)



    print("\n===== Weather Report =====")
    print(
        f"City: {transformed['city']}"
    )
    print(
        f"Temperature: {transformed['temperature_celsius']} °C"
    )
    print(
        f"Humidity: {transformed['humidity']}%"
    )
    print(
        f"Pressure: {transformed['pressure']} hPa"
    )
    print(
        f"Condition: {transformed['weather_condition']}"
    )

    logger.info(
        f"Weather fetched for {city_name}"
    )

if __name__ == "__main__":
    main()