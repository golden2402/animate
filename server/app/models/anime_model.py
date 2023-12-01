from pydantic import BaseModel, Field
from typing import Optional


class Anime(BaseModel):
    id: str
    title: str
    episodes: int
    season_id: str


class UpdateAnime(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    episodes: Optional[int] = None
    season_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1",
                "title": "This is a title",
                "episodes": 5,
                "season_id": "2",
            }
        }
