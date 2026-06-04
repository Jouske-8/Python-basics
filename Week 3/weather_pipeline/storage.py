import json
import os
from datetime import datetime

from config import *
from logger import logger

os.makedirs(DATA_FOLDER, exist_ok=True)

def save_weather(data):

    timestamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S"
    )

    filename = os.path.join(
        DATA_FOLDER,
        f"weather_{timestamp}.json"
    )

    with open(filename, "w") as file:
        json.dump(data, file, indent=4)

    logger.info(
        f"Weather data stored in {filename}"
    )

    return filename

def update_history(record):
    
    history = []

    if os.path.exists(HISTORY_FILE):

        try:
            with open(HISTORY_FILE, 'r') as file:
                history = json.load(file)

        except Exception:
            history = []
        
    history.append(record)

    history = history[-5:]

    with open(HISTORY_FILE, "w") as file:
        json.dump(history, file, indent=4)
    
    logger.info("History updated")