from models.rating_model import UpdateRating
from models.response_models import ResponseModel, ErrorResponseModel
from fastapi import APIRouter, Response
from db.user import *

router = APIRouter()


@router.get("/{user_id}")
async def get_ratings_by_user(user_id: str, response: Response):
    return await get_ratings_by_user(user_id=user_id)


@router.get("/{score}")
async def get_ratings_by_score(score: int, response: Response):
    return await get_ratings_by_score(score=score)


@router.get("/{anime_id}")
async def get_ratings_by_anime(anime_id: str, response: Response):
    return await get_ratings_by_anime(anime_id=anime_id)


@router.delete("/")
async def delete_rating(rating: UpdateRating, response: Response):
    await delete_rating_relation(user_id=rating.user_id, anime_id=rating.anime_id)
    response.status = 200
    return response


@router.post("/")
async def create_rating(rating: UpdateRating, response: Response):
    if not await has_user_rated_anime(user_id=rating.user_id, anime_id=rating.anime_id):
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
