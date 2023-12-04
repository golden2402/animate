from pydantic import BaseModel, Field
from typing import Optional


class WatchedAnime(BaseModel):
    user_id: int
    anime_id: int
    watch_date: str
    watch_count: int
    watch_status: str


class UpdateWatchedAnime(BaseModel):
    user_id: Optional[int] = None
    anime_id: Optional[int] = None
    watch_date: Optional[str] = "2023"
    watch_count: Optional[int] = 0
    watch_status: Optional[str] = "watching"

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "anime_id": 57356,
                "watch_date": "11/27/2023",
                "watch_count": 28,
                "watch_status": "watching",
            }
        }
