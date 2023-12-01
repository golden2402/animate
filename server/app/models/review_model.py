from pydantic import BaseModel, Field
from typing import Optional


class Review(BaseModel):
    user_id: int
    post: str
    anime_id: int


class UpdateReview(BaseModel):
    user_id: Optional[int] = None
    post: Optional[str] = None
    anime_id: Optional[int] = None

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "post": "Some Info about the review",
                "anime_id": 57356,
            }
        }
