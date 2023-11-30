from pydantic import BaseModel, Field
from typing import Optional


class Review(BaseModel):
    user_id: str
    post: str


class UpdateReview(BaseModel):
    user_id: Optional[str] = None
    post: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {"user_id": "1", "post": "Some Info about the review"}
        }
