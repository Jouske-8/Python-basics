import requests

from config import *
from logger import logger

class APIClient:


    def __init__(self):
        self.base_url = BASE_URL
    
    def get_post(self, post_id):

        try:

            response = requests.get(
                f"{self.base_url}/{post_id}"
            )

            logger.info(f"GET request for post {post_id}")

            return response
        
        except Exception as e:

            logger.error(
                f"GET failed: {e}"
            )

            return None
    
    def create_post(self, payload):

        try:

            response = requests.post(
                self.base_url,
                json=payload,
                timeout=REQUEST_TIMEOUT
            )

            logger.info(
                "POST request executed"
            )

            return response
        
        except Exception as e:

            logger.error(
                f"POST failed: {e}"
            )

            return None
        
    def update_post(self, post_id, payload):

        try:

            response = requests.put(
                f"{self.base_url}/{post_id}",
                json=payload,
                timeout=REQUEST_TIMEOUT
            )

            logger.info(
                f"PUT request for {post_id}"
            )

            return response
        
        except Exception as e:

            logger.error(
                f"PUT failed: {e}"
            )

            return None
    
    def patch_post(self, post_id, payload):

        try:

            response = requests.patch(
                f"{self.base_url}/{post_id}",
                json=payload,
                timeout=REQUEST_TIMEOUT
            )

            logger.info(
                f"PATCH request for {post_id}"
            )

            return response

        except Exception as e:

            logger.error(
                f"PATCH failed: {e}"
            )

            return None

    def delete_post(self, post_id):

        try:

            response = requests.delete(
                f"{self.base_url}/{post_id}",
                timeout=REQUEST_TIMEOUT
            )

            logger.info(
                f"DELETE request for {post_id}"
            )

            return response

        except Exception as e:

            logger.error(
                f"DELETE failed: {e}"
            )

            return None
