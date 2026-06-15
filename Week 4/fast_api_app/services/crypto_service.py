import requests

from exceptions.custom_exceptions import (
    CryptoAPIException
)

from utils.logger import logger

def get_top_coins(
    limit: int = 10,
    sort_by: str = "market_cap"
):

    try:

        url = (
            "https://api.coingecko.com/api/v3/"
            "coins/markets"
        )

        response = requests.get(
            url,
            params={
                "vs_currency": "usd",
                "per_page": 100,
                "page": 1
            },
            timeout=5
        )

        response.raise_for_status()

        data = response.json()

        transformed = []

        for coin in data:

            transformed.append({
                "id": coin["id"],
                "symbol": coin["symbol"],
                "name": coin["name"],
                "current_price":
                    coin["current_price"],
                "market_cap":
                    coin["market_cap"]
            })

        if sort_by == "price":

            transformed.sort(
                key=lambda x:
                x["current_price"],
                reverse=True
            )

        else:

            transformed.sort(
                key=lambda x:
                x["market_cap"],
                reverse=True
            )

        return transformed[:limit]

    except Exception:

        raise CryptoAPIException(
            "Unable to fetch crypto data"
        )
    

def get_coin_details(coin: str):

    try:

        url = (
            f"https://api.coingecko.com/api/v3/"
            f"coins/{coin}"
        )

        response = requests.get(
            url,
            timeout=5
        )

        response.raise_for_status()

        data = response.json()

        return {
            "id": data["id"],
            "symbol": data["symbol"],
            "name": data["name"],
            "current_price":
                data["market_data"]
                ["current_price"]["usd"],
            "market_cap":
                data["market_data"]
                ["market_cap"]["usd"],
            "market_cap_rank":
                data["market_cap_rank"]
        }

    except Exception:

        raise CryptoAPIException(
            "Coin not found"
        )
    
