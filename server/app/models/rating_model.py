from pydantic import BaseModel, Field
from typing import Optional


class Rating(BaseModel):
    user_id: int
    anime_id: int
    rate_score: int
    rate_date: str


class UpdateRating(BaseModel):
    user_id: Optional[int] = None
    anime_id: Optional[int] = None
    rate_score: Optional[int] = None
    rate_date: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "anime_id": 57356,
                "rate_score": 2,
                "rate_date": "11/27/2023",
            }
        }
