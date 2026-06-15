from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from exceptions.custom_exceptions import (
    StudentNotFoundException,
    ExternalAPIException
)

async def student_not_found_handler(
    request: Request,
    exc: StudentNotFoundException
):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error": {
                "code": 404,
                "message": exc.message
            }
        }
    )


async def api_failure_handler(
    request: Request,
    exc: ExternalAPIException
):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": 500,
                "message": exc.message
            }
        }
    )

async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": 422,
                "message": "Validation Failed",
                "details": exc.errors()
            }
        }
    )

from exceptions.custom_exceptions import (
    WeatherAPIException
)

async def weather_exception_handler(
    request,
    exc
):
    return JSONResponse(
        status_code=503,
        content={
            "success": False,
            "error": {
                "code": 503,
                "message": exc.message
            }
        }
    )

