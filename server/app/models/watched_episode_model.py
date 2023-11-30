from pydantic import BaseModel, Field
from typing import Optional


class WatchedEpisode(BaseModel):
    user_id: str
    episode_id: str
    watch_date: str


class UpdateWatchedEpisode(BaseModel):
    user_id: Optional[str] = None
    episode_id: Optional[str] = None
    watch_date: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "1",
                "episode_id": "2",
                "watch_date": "11/27/2023",
            }
        }
