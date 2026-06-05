import argparse
from datetime import datetime

from crypto_api import fetch_crypto_data
from storage import save_data
from logger import logger

def transform_data(data):

    transformed = []

    for coin in data:

        transformed.append({
            "name": coin["name"],
            "symbol": coin["symbol"].upper(),
            "rank": coin["market_cap_rank"],
            "price_usd": coin["current_price"],
            "market_cap": coin["market_cap"],
            "price_change_24h":
                coin.get(
                    "price_change_percentage_24h",
                    0
                )
        })

    return transformed

def top_n(data, n):

    return data[:n]

def sort_by_price(data):

    return sorted(
        data,
        key=lambda x: x["price_usd"],
        reverse=True
    )

def sort_by_market_cap(data):

    return sorted(
        data,
        key=lambda x: x["market_cap"],
        reverse=True
    )

def generate_insights(data):

    highest_price = max(
        data,
        key=lambda x: x["price_usd"]
    )

    largest_market_cap = max(
        data,
        key=lambda x: x["market_cap"]
    )

    biggest_gainer = max(
        data,
        key=lambda x: x["price_change_24h"]
    )

    biggest_loser = min(
        data,
        key=lambda x: x["price_change_24h"]
    )

    return {
        "highest_price_coin":
            highest_price["name"],

        "largest_market_cap_coin":
            largest_market_cap["name"],

        "biggest_gainer":
            biggest_gainer["name"],

        "biggest_loser":
            biggest_loser["name"]
    }

def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--top",
        type=int,
        default=10,
        help="Number of top coins"
    )

    args = parser.parse_args()

    logger.info(
        f"Fetching top {args.top} coins"
    )

    raw_data = fetch_crypto_data()

    if not raw_data:

        print("API fetch failed")
        return
    
    transformed = transform_data(raw_data)

    selected = top_n(
        transformed,
        args.top
    )

    output = {
        "generated_at":
            datetime.now().isoformat(),

        "top_coins":
            selected,

        "sorted_by_price":
            sort_by_price(selected),

        "sorted_by_market_cap":
            sort_by_market_cap(selected),

        "insights":
            generate_insights(selected)
    }

    filename = save_data(output)

    logger.info(
        f"Analysis saved to {filename}"
    )

    print("\nAnalysis Complete")
    print(
        f"Saved to {filename}"
    )

    print("\nInsights")

    for key, value in output[
        "insights"
    ].items():

        print(
            f"{key}: {value}"
        )


if __name__ == "__main__":
    main()
