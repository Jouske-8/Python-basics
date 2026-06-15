from fastapi import APIRouter
from services.weather_service import get_weather
from schemas.weather_schema import WeatherResponse

router = APIRouter(
    prefix="/weather",
    tags=["Weather"]
)

@router.get("/", response_model=WeatherResponse)
def weather(latitude: float, longitude: float):
    return get_weather(latitude, longitude)