from pydantic import BaseModel


class WeatherResponse(BaseModel):
    city: str
    temperature: float
    wind_speed: float
    weather_code: int