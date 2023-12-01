from pydantic import BaseModel, Field
from typing import Optional


class Favorite(BaseModel):
    user_id: int
    anime_id: int


class UpdateFavorite(BaseModel):
    user_id: Optional[int] = None
    anime_id: Optional[int] = None

    class Config:
        json_schema_extra = {"example": {"user_id": 1, "anime_id": 57356}}
