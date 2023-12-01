from pydantic import BaseModel, Field
from typing import Optional


class WatchedAnime(BaseModel):
    user_id: str
    anime_id: str
    watch_date: str
    watch_count: int
    watch_status: str


class UpdateWatchedAnime(BaseModel):
    user_id: Optional[str] = None
    anime_id: Optional[str] = None
    watch_date: Optional[str] = None
    watch_count: Optional[int] = None
    watch_status: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "1",
                "anime_id": "57356",
                "watch_date": "11/27/2023",
                "watch_count": 28,
                "watch_status": "watching",
            }
        }
