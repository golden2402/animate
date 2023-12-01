from models.watched_episode_model import UpdateWatchedEpisode
from models.response_models import ResponseModel, ErrorResponseModel
from fastapi import APIRouter, Response
from db.user import *

router = APIRouter()


@router.get("/{user_id}")
async def get_all(user_id: str, response: Response):
    return await get_all_watched_episodes_by_user(user_id=user_id)


@router.delete("/")
async def get_all(watch: UpdateWatchedEpisode, response: Response):
    await delete_watched_episode_relation(
        user_id=watch.user_id, episode_id=watch.episode_id
    )
    response.status = 200
    return response


@router.delete("/all/{user_id}")
async def get_all(user_id: str, response: Response):
    await delete_all_watched_episodes(user_id=user_id)
    response.status = 200
    return response


@router.post("/")
async def update_account(watch: UpdateWatchedEpisode, response: Response):
    if not await has_user_watched(user_id=watch.user_id, episode_id=watch.episode_id):
        created_obj = await create_watched_episode_relation(wacthed_episode=watch)
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
