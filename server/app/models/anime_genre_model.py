from pydantic import BaseModel, Field
from typing import Optional


class AnimeGenre(BaseModel):
    anime_id: str
    genre_id: str


class UpdateAnimeGenre(BaseModel):
    anime_id: Optional[str] = None
    genre_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {"anime_id": "1", "genre_id": "This is a title"}
        }
