import json
import os

from api_client import APIClient
from validators import (
    validate_post,
    validate_created_post
)

os.makedirs(
    "outputs",
    exist_ok=True
)

client = APIClient()

print("\n========== GET ==========")

response = client.get_post(1)

if response and response.status_code == 200:

    data = response.json()

    if validate_post(data):

        print("GET Success")

        with open(
            "outputs/get_response.json",
            "w"
        ) as file:

            json.dump(
                data,
                file,
                indent=4
            )

else:

    print("GET Failed")


print("\n========== POST ==========")

new_post = {
    "title": "Python API Project",
    "body": "Testing CRUD",
    "userId": 1
}

response = client.create_post(
    new_post
)

if response and response.status_code in [200, 201]:

    data = response.json()

    if validate_created_post(data):

        print("POST Success")

        with open(
            "outputs/post_response.json",
            "w"
        ) as file:

            json.dump(
                data,
                file,
                indent=4
            )

else:

    print("POST Failed")


print("\n========== PUT ==========")

updated_post = {
    "id": 1,
    "title": "Updated Title",
    "body": "Updated Body",
    "userId": 1
}

response = client.update_post(
    1,
    updated_post
)

if response and response.status_code == 200:

    print("PUT Success")

else:

    print("PUT Failed")


print("\n========== PATCH ==========")

partial_update = {
    "title": "Patched Title"
}

response = client.patch_post(
    1,
    partial_update
)

if response and response.status_code == 200:

    print("PATCH Success")

else:

    print("PATCH Failed")


print("\n========== DELETE ==========")

response = client.delete_post(1)

if response and response.status_code in [200, 204]:

    print("DELETE Success")

else:

    print("DELETE Failed")