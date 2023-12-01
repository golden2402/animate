from pydantic import BaseModel, Field
from typing import Optional


class Follow(BaseModel):
    followee_id: int
    follower_id: int


class UpdateFollow(BaseModel):
    followee_id: Optional[int] = None
    follower_id: Optional[int] = None

    class Config:
        json_schema_extra = {"example": {"followee_id": 1, "follower_id": 2}}
