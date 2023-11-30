from pydantic import BaseModel, Field
from typing import Optional


class Anime(BaseModel):
    id: str
    title: str
    season_id: str


class UpdateAnime(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    season_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1",
                "title": "This is a title",
                "season_id": "2",
            }
        }
