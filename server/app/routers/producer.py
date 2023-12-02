from datetime import datetime, timedelta
from fastapi import APIRouter, status, HTTPException, Request
from db.anime import *
from populate import populate_anime

router = APIRouter()


@router.get("/")
async def get_all(request: Request):
    return await get_all_producers()


@router.get("/anime/{anime_id}")
async def get_all(anime_id: int, request: Request):
    return await get_all_producers_by_anime(anime_id=anime_id)


@router.get("/{producer_id}")
async def get_all(producer_id: int, request: Request):
    return await get_all_anime_by_genre(producer_id=producer_id)


@router.get("/relationships")
async def get_all_ag_relationship():
    return await get_all_anime_producer_relationship()
