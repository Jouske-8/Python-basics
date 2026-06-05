import requests
import time

from config import *
from logger import logger

def fetch_crypto_data():

    params = {
        "vs_currency": VS_CURRENCY,
        "order": "market_cap_desc",
        "per_page": 250,
        "page": 1,
        "sparkline": False,
        "price_change_percentage": "24h"
    }

    for attempt in range(MAX_RETRIES):

        try:

            response = requests.get(
                API_URL,
                params=params,
                timeout=20
            )

            response.raise_for_status()

            logger.info("Crypto data fetched successfully")

            return response.json()
        
        except Exception as e:
            logger.error(
                f"Attempt {attempt+1} failed: {e}"
            )

            time.sleep(RETRY_DELAY)

    return None

