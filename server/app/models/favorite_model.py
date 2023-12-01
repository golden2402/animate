from pydantic import BaseModel, Field
from typing import Optional


class Favorite(BaseModel):
    user_id: str
    anime_id: str


class UpdateFavorite(BaseModel):
    user_id: Optional[str] = None
    anime_id: Optional[str] = None

    class Config:
        json_schema_extra = {"example": {"user_id": "1", "anime_id": "57356"}}
