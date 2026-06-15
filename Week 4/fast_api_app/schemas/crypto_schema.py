from pydantic import BaseModel


class CoinResponse(BaseModel):
    id: str
    symbol: str
    name: str
    current_price: float
    market_cap: float


class CoinDetailResponse(BaseModel):
    id: str
    symbol: str
    name: str
    current_price: float
    market_cap: float
    market_cap_rank: int