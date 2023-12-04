from datetime import datetime, timedelta
from fastapi import APIRouter, Request
from db.anime import *

router = APIRouter()


@router.get("/")
async def get_all(request: Request):
    return await get_all_seasons()


@router.post("/info")
async def get_season_by_info(season: UpdateSeason, request: Request):
    return await get_season_by_all_info(
        season_name=season.season_name, season_year=season.season_year
    )
