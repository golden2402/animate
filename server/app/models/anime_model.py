from pydantic import BaseModel, Field
from typing import Optional


class Anime(BaseModel):
    id: int
    title: str
    episodes: int
    season_id: int


class UpdateAnime(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    episodes: Optional[int] = None
    season_id: Optional[int] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "title": "This is a title",
                "episodes": 5,
                "season_id": 1,
            }
        }
