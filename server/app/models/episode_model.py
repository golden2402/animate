from pydantic import BaseModel, Field
from typing import Optional


class Episode(BaseModel):
    id: str
    episode_number: str
    episode_name: str


class UpdateEpisode(BaseModel):
    id: Optional[str] = None
    episode_number: Optional[str] = None
    episode_name: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1",
                "episode_number": "2023",
                "episode_name": "Season Name",
            }
        }
