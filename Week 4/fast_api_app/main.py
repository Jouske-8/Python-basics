from fastapi import FastAPI
from routes.student_routes import router
from fastapi.exceptions import RequestValidationError


from exceptions.handlers import (
    student_not_found_handler,
    validation_exception_handler,
    api_failure_handler
)

from exceptions.custom_exceptions import (
    StudentNotFoundException,
    ExternalAPIException
)

app = FastAPI(
    title="Student Management API",
    version="1.0"
)

app.include_router(router)

app.add_exception_handler(
    StudentNotFoundException,
    student_not_found_handler
)

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler
)

app.add_exception_handler(
    ExternalAPIException,
    api_failure_handler
)

@app.get("/")
def home():
    return {
        "message": "FastAPI Application Running"
    }