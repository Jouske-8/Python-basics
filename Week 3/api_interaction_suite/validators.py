def validate_post(post):

    required_fields = [
        "userId",
        "id",
        "title",
        "body"
    ]

    return all(
        field in post
        for field in required_fields
    )

def validate_created_post(post):

    required_fields = [
        "title",
        "body",
        "userId"
    ]

    return all(
        field in post
        for field in required_fields
    )