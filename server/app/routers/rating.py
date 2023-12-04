from models.rating_model import UpdateRating
from models.response_models import ResponseModel, ErrorResponseModel
from routers.auth import authorize_user
from fastapi import APIRouter, Request, Response, status, HTTPException
from db.user import *

router = APIRouter()


@router.get("/")
async def get_all():
    return await get_all_ratings()


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


@router.post("/force")
async def force_create_rating(rating: UpdateRating, request: Request, response: Response):
    if not await has_user_rated_anime(user_id=rating.user_id, anime_id=rating.anime_id):
        created_obj = await create_rating_raltion(rating=rating)
        if created_obj:
            response.status_code = 201
            return created_obj
        else:
            response.status_code = 500
    else:
        # should this raise?:
        response.status_code = 202


@router.post("/")
async def create_rating(rating: UpdateRating, request: Request, response: Response):
    id = authorize_user(request)
    if not id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You must be logged in to do this.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    rating.user_id = id

    if not await has_user_rated_anime(user_id=rating.user_id, anime_id=rating.anime_id):
        created_obj = await create_rating_raltion(rating=rating)
        if created_obj:
            response.status_code = 201
            return created_obj
        else:
            response.status_code = 500
    else:
        # should this raise?:
        response.status_code = 202
