from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError

from routes.student_routes import router as student_router
from routes.weather_routes import router as weather_router

from exceptions.handlers import (
    student_not_found_handler,
    validation_exception_handler,
    api_failure_handler,
    weather_exception_handler
)

from exceptions.custom_exceptions import (
    StudentNotFoundException,
    ExternalAPIException,
    WeatherAPIException
)
from routes.crypto_routes import (
    router as crypto_router
)

from exceptions.custom_exceptions import (
    CryptoAPIException
)

from exceptions.handlers import (
    crypto_exception_handler
)



app = FastAPI(
    title="Student Management API",
    version="1.0"
)

# Routers
app.include_router(student_router)
app.include_router(weather_router)
app.include_router(crypto_router)

# Exception Handlers
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

app.add_exception_handler(
    WeatherAPIException,
    weather_exception_handler
)

app.add_exception_handler(
    CryptoAPIException,
    crypto_exception_handler
)

@app.get("/")
def home():
    return {
        "message": "FastAPI Application Running"
    }