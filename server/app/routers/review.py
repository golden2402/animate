from models.review_model import UpdateReview
from models.response_models import ResponseModel, ErrorResponseModel
from fastapi import APIRouter, Response
from db.user import *

router = APIRouter()


@router.get("/{user_id}")
async def get_reviews_by_user(user_id: str, response: Response):
    return await get_reviews_by_user_db(user_id=user_id)


@router.get("/anime/{anime_id}")
async def get_reviews_by_anime(anime_id: str, response: Response):
    return await get_reviews_by_anime_db(anime_id=anime_id)


@router.delete("/")
async def delete_review(review: UpdateReview, response: Response):
    return await delete_review_relation(
        user_id=review.user_id, anime_id=review.anime_id
    )


@router.post("/")
async def create_review(review: UpdateReview, response: Response):
    if not await has_user_reviewd_anime(
        user_id=review.user_id, anime_id=review.anime_id
    ):
        created_obj = await create_review_relation(review=review)
        response.status = 201
        return ResponseModel(
            created_obj, f"Successfully created review for user: '{review.user_id}'"
        )
    else:
        response.status_code = 409
        return ErrorResponseModel(
            "User has already reviewed episode",
        )
