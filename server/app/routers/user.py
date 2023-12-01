from fastapi import APIRouter, Request, Response
from db.user_account import *
from db.user import *

router = APIRouter()


@router.get("/")
async def get_all(response: Response):
    return await get_all_users()


@router.get("/{user_id}")
async def get_all(user_id: str, response: Response):
    return await get_user_by_id(user_id)
