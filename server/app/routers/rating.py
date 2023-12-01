from models.rating_model import UpdateRating
from models.response_models import ResponseModel, ErrorResponseModel
from fastapi import APIRouter, Response
from db.user import *

router = APIRouter()


@router.get("/{user_id}")
async def get_ratings_by_user(user_id: str, response: Response):
    return await get_ratings_by_user_db(user_id=user_id)


@router.get("/score/{score}")
async def get_ratings_by_score(score: str, response: Response):
    return await get_ratings_by_score_db(score=score)


@router.get("/anime/{anime_id}")
async def get_ratings_by_anime(anime_id: str, response: Response):
    return await get_ratings_by_anime_db(anime_id=anime_id)


@router.delete("/")
async def delete_rating(rating: UpdateRating, response: Response):
    return await delete_rating_relation(
        user_id=rating.user_id, anime_id=rating.anime_id
    )


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
