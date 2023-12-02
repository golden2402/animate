from datetime import datetime, timedelta
from fastapi import APIRouter, status, HTTPException, Request
from db.anime import *
from populate import populate_anime

router = APIRouter()


@router.get("/")
async def get_all(request: Request):
    return await get_all_genres()


@router.get("/anime/{anime_id}")
async def get_all(anime_id: int, request: Request):
    return await get_all_genres_by_anime(anime_id=anime_id)


@router.get("/{genre_id}")
async def get_all(genre_id: int, request: Request):
    return await get_all_anime_by_genre(genre_id=genre_id)


@router.get("/relationships")
async def get_all_ag_relationship():
    return await get_all_anime_genre_relationships()
