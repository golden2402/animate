from pydantic import BaseModel, Field
from typing import Optional


class Follow(BaseModel):
    followee_id: str
    follower_id: str


class UpdateFollow(BaseModel):
    followee_id: Optional[str] = None
    follower_id: Optional[str] = None

    class Config:
        json_schema_extra = {"example": {"followee_id": "1", "follower_id": "2"}}
