import json
import os
from datetime import datetime

os.makedirs("data", exist_ok=True)

def save_data(data):
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    filename = (f"data/crypto_analysis_{timestamp}.json")

    with open(filename, "w") as file:
        json.dump(
            data,
            file,
            indent=4
        )

    return filename