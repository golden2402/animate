from datetime import datetime, timedelta
from fastapi import APIRouter, Request
from db.anime import *

router = APIRouter()


@router.get("/")
async def get_all(request: Request):
    return await get_all_seasons()
