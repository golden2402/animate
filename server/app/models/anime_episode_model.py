from pydantic import BaseModel, Field
from typing import Optional


class AnimeEpisode(BaseModel):
    anime_id: str
    episode_id: str


class UpdateAnimeEpisode(BaseModel):
    anime_id: Optional[str] = None
    episode_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "anime_id": "1",
                "episode_id": "2",
            }
        }
