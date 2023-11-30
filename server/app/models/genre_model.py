from pydantic import BaseModel, Field
from typing import Optional


class Genre(BaseModel):
    id: str
    genre_name: str


class UpdateGenre(BaseModel):
    id: Optional[str] = None
    genre_name: Optional[str] = None

    class Config:
        json_schema_extra = {"example": {"id": "1", "genre_name": "Genre"}}
