from models.response_models import ResponseModel, ErrorResponseModel
from models.watched_anime_model import UpdateWatchedAnime
from routers.auth import authorize_user
from fastapi import APIRouter, Request, Response, status, HTTPException
from db.user import *

router = APIRouter()


@router.get("/{user_id}")
async def get_all_watched_anime_by_user(user_id: str, response: Response):
    return await get_all_watched_anime_by_user_db(user_id=user_id)


@router.delete("/")
async def delete_watched_anime_for_user_by_anime(
    watch: UpdateWatchedAnime, response: Response, request: Request
):
    id = authorize_user(request)
    if not id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You must be logged in to do this.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    await delete_watched_anime_relation(user_id=id, anime_id=watch.anime_id)
    response.status = 200
    return response


@router.delete("/all/{user_id}")
async def delete_all_watched_anime_by_user(user_id: str, response: Response):
    await delete_all_watched_anime(user_id=user_id)
    response.status = 200
    return response


@router.post("/")
async def watch_anime(watch: UpdateWatchedAnime, request: Request, response: Response):
    id = authorize_user(request)
    if not id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You must be logged in to do this.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    watch.user_id = id

    print(watch)

    if not await has_user_watched(user_id=watch.user_id, anime_id=watch.anime_id):
        created_obj = await create_watched_anime_relation(watched_anime=watch)
        return ResponseModel(created_obj, "Successfully Created Watch status")
    else:
        response.status_code = 409
        return ErrorResponseModel(
            await has_user_watched(user_id=watch.user_id, anime_id=watch.anime_id),
            "User has already marked episode as watched",
        )


@router.put("/")
async def watch_anime(watch: UpdateWatchedAnime, response: Response):
    if not await has_user_watched(user_id=watch.user_id, anime_id=watch.anime_id):
        response.status_code = 404
        return ErrorResponseModel(
            "User has not created a watched relationship yet",
        )
    else:
        try:
            await update_watched_anime_relation(watched_anime=watch)
        except:
            return ErrorResponseModel(None, 500, "Error Updating User Account")
