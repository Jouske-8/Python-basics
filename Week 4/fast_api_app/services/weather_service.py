import requests

from tenacity import (
    retry,
    stop_after_attempt,
    wait_fixed
)

from exceptions.custom_exceptions import (
    WeatherAPIException
)

from utils.logger import logger

@retry(
    stop=stop_after_attempt(3),
    wait=wait_fixed(2)
)
def fetch_weather_data(latitude, longitude):

    logger.info(
        f"Calling Weather API: {latitude},{longitude}"
    )

    response = requests.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,wind_speed_10m"
        },
        timeout=5
    )

    response.raise_for_status()

    return response.json()

def get_weather(latitude, longitude):

    try:

        data = fetch_weather_data(
            latitude,
            longitude
        )

        current = data["current"]

        transformed = {
            "city": f"{latitude},{longitude}",
            "temperature": current["temperature_2m"],
            "wind_speed": current["wind_speed_10m"],
            "weather_code": current.get(
                "weather_code",
                0
            )
        }

        logger.info(
            "Weather data transformed"
        )

        return transformed

    except requests.Timeout:

        logger.error("API Timeout")

        raise WeatherAPIException(
            "Weather service timeout"
        )

    except requests.RequestException:

        logger.error("Weather API unavailable")

        raise WeatherAPIException(
            "Weather API unavailable"
        )

    except KeyError:

        logger.error(
            "Unexpected API response"
        )

        raise WeatherAPIException(
            "Invalid API response"
        )
    
