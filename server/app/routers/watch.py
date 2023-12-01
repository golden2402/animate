from models.response_models import ResponseModel, ErrorResponseModel
from models.watched_anime_model import UpdateWatchedAnime
from fastapi import APIRouter, Response
from db.user import *

router = APIRouter()


@router.get("/{user_id}")
async def get_all_watched_anime_by_user(user_id: str, response: Response):
    return await get_all_watched_anime_by_user_db(user_id=user_id)


@router.delete("/")
async def delete_watched_anime_for_user_by_anime(
    watch: UpdateWatchedAnime, response: Response
):
    await delete_watched_anime_relation(user_id=watch.user_id, anime_id=watch.anime_id)
    response.status = 200
    return response


@router.delete("/all/{user_id}")
async def delete_all_watched_anime_by_user(user_id: str, response: Response):
    await delete_all_watched_anime(user_id=user_id)
    response.status = 200
    return response


@router.post("/")
async def watch_anime(watch: UpdateWatchedAnime, response: Response):
    if not await has_user_watched(user_id=watch.user_id, anime_id=watch.anime_id):
        created_obj = await create_watched_anime_relation(watched_anime=watch)
        if created_obj:
            response.status_code = 201
            return created_obj
        else:
            response.status_code = 500
    else:
        response.status_code = 409
        return ErrorResponseModel(
            "User has already marked episode as watched",
        )
