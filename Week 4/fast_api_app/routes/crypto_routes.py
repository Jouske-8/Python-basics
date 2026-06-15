from fastapi import (
    APIRouter,
    Query
)

from typing import List

from schemas.crypto_schema import (
    CoinResponse,
    CoinDetailResponse
)

from services.crypto_service import (
    get_top_coins,
    get_coin_details
)

router = APIRouter(
    prefix="/crypto",
    tags=["Crypto"]
)

@router.get(
    "/",
    response_model=List[CoinResponse]
)
def list_coins(

    top: int = Query(
        10,
        ge=1,
        le=50
    ),

    sort_by: str = Query(
        "market_cap",
        pattern="^(price|market_cap)$"
    )
):

    return get_top_coins(
        limit=top,
        sort_by=sort_by
    )

@router.get(
    "/{coin}",
    response_model=CoinDetailResponse
)
def coin_details(coin: str):

    return get_coin_details(
        coin.lower()
    )

