from models.rating_model import UpdateRating
from models.response_models import ResponseModel, ErrorResponseModel
from fastapi import APIRouter, Response
from db.user import *

router = APIRouter()


@router.get("/ratings/{user_id}")
async def get_all(user_id: str, response: Response):
    return await get_ratings_by_user(user_id=user_id)


@router.get("/ratings/{score}")
async def get_all(score: int, response: Response):
    return await get_ratings_by_score(score=score)


@router.get("/ratings/{episode_id}")
async def get_all(episode_id: str, response: Response):
    return await get_ratings_by_episode(episode_id=episode_id)


@router.delete("/rate")
async def get_all(rating: UpdateRating, response: Response):
    await delete_rating_relation(user_id=rating.user_id, episode_id=rating.episode_id)
    response.status = 200
    return response


@router.post("/rate")
async def create_rating(rating: UpdateRating, response: Response):
    if not await has_user_rated_episode(
        user_id=rating.user_id, episode_id=rating.episode_id
    ):
        created_obj = await create_rating_raltion(rating=rating)
        if created_obj:
            response.status_code = 201
            return created_obj
        else:
            response.status_code = 500
    else:
        response.status_code = 409
        return ErrorResponseModel(
            "User has already rated episode",
        )