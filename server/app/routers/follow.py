from models.follow_model import UpdateFollow
from models.response_models import ResponseModel, ErrorResponseModel
from fastapi import APIRouter, Response
from db.user import *

router = APIRouter()


@router.get("/{user_id}")
async def get_all_followers(user_id: str, response: Response):
    return await get_all_followers_db(follower_id=user_id)


@router.get("/followees/{user_id}")
async def get_all_followees(user_id: str, response: Response):
    return await get_all_followees_db(followee_id=user_id)


@router.post("/")
async def follow_user(follow: UpdateFollow, response: Response):
    if not await is_user_following(
        followee_id=follow.followee_id, follower_id=follow.follower_id
    ):
        created_obj = await create_follow_relation(
            followee_id=follow.followee_id, follower_id=follow.follower_id
        )
        if created_obj:
            response.status_code = 201
            return created_obj
        else:
            response.status_code = 500
    else:
        response.status_code = 409
        return ErrorResponseModel(
            "User is already Following",
        )


@router.delete("/")
async def delete_followee(follow: UpdateFollow, response: Response):
    if not await is_user_following(
        followee_id=follow.followee_id, follower_id=follow.follower_id
    ):
        await delete_follow_relation(
            followee_id=follow.followee_id, follower_id=follow.follower_id
        )
        response.status_code = 200
    else:
        response.status_code = 404
        return ErrorResponseModel(
            "User isnt following other User",
        )


@router.delete("/all/{followee_id}")
async def delete_all_follow_by_user(followee_id: str, response: Response):
    return await delete_all_follow_by_user_db(followee_id=followee_id)
