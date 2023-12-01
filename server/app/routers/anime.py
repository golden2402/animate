from datetime import datetime, timedelta
from fastapi import APIRouter, status, HTTPException, Request
from db.anime import *
from populate import populate_anime

router = APIRouter()


@router.get("/")
async def get_all(request: Request):
    return await get_all_anime()


@router.get("/populate")
async def populate():
    return await populate_anime()


@router.get("/genres/relationships")
async def get_all_ag_relationship():
    return await get_all_anime_genre_relationships()
