import requests
import time

from config import *
from logger import logger


def get_coordinates(city):

    params = {
        "name" : city,
        "count" : 1
    }

    for attempt in range(MAX_RETRIES):

        try:

            response = requests.get(
                BASE_GEOCODE_URL,
                params=params,
                timeout=10
            )

            response.raise_for_status()

            data = response.json()

            if "results" not in data:
                raise ValueError("City not found")
            
            result = data["results"][0]

            return (
                result["latitude"],
                result["longitude"],
                result["name"]
            )
        
        except Exception as e:
            logger.error(f"Geocoding attempt {attempt+1} failed: {e}")

            time.sleep(RETRY_DELAY)
    return None

def get_weather(latitude, longitude):

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": ",".join([
            "temperature_2m",
            "relative_humidity_2m",
            "pressure_msl",
            "weather_code"
        ])
    }

    for attempt in range(MAX_RETRIES):

        try:

            response = requests.get(
                BASE_WEATHER_URL,
                params=params,
                timeout=10
            )


            response.raise_for_status()

            return response.json()
        
        except Exception as e:

            logger.error(
                f"Weather API attempt {attempt+1} failed: {e}"
            )
            
            time.sleep(RETRY_DELAY)

    return None
