from models.follow_model import UpdateFollow
from models.response_models import ResponseModel, ErrorResponseModel
from fastapi import APIRouter, Request, Response, status
from db.user_account import *
from db.user import *

router = APIRouter()


@router.get("/")
async def get_all(response: Response):
    return await get_all_users()


@router.get("/{user_id}")
async def get_all(user_id: str, response: Response):
    return await get_user_by_id(user_id)


@router.get("/followers/{user_id}")
async def get_all(user_id: str, response: Response):
    return await get_all_followers(follower_id=user_id)


@router.get("/followees/{user_id}")
async def get_all(user_id: str, response: Response):
    return await get_all_followees(followee_id=user_id)


@router.post("/follow")
async def update_account(follow: UpdateFollow, response: Response):
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


@router.delete("/unfollow")
async def update_account(follow: UpdateFollow, response: Response):
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


@router.delete("/unfollow/all{followee_id}")
async def update_account(followee_id: str, response: Response):
    await delete_all_follow_by_user(followee_id=followee_id)
    response.status = 200
    return response
