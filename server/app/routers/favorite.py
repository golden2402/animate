from models.favorite_model import UpdateFavorite
from models.response_models import ResponseModel, ErrorResponseModel
from fastapi import APIRouter, Response
from db.user_account import *
from db.user import *

router = APIRouter()


@router.get("/{user_id}")
async def get_all_favorites_by_user(user_id: str, response: Response):
    return await get_all_favorites_by_user(user_id=user_id)


@router.delete("/")
async def unfavorite_anime_by_user(favorite_obj: UpdateFavorite, response: Response):
    await delete_favorite_relation(
        user_id=favorite_obj.user_id, anime_id=favorite_obj.anime_id
    )
    response.status = 200
    return response


@router.delete("/all/{user_id}")
async def delete_all_favorites_by_user(user_id: str, response: Response):
    await delete_all_favorites_by_user(user_id=user_id)
    response.status = 200
    return response


@router.post("/")
async def favorite_anime(favorite_obj: UpdateFavorite, response: Response):
    if not await is_user_favoriting(
        user_id=favorite_obj.user_id, anime_id=favorite_obj.anime_id
    ):
        created_obj = await create_favorite_relation(
            user_id=favorite_obj.user_id, anime_id=favorite_obj.anime_id
        )
        if created_obj:
            response.status_code = 201
            return created_obj
        else:
            response.status_code = 500
    else:
        response.status_code = 409
        return ErrorResponseModel(
            "User is has already favorited anime",
        )
