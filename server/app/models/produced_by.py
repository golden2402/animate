from pydantic import BaseModel, Field
from typing import Optional


class ProducedBy(BaseModel):
    anime_id: str
    producer_id: str


class UpdateProducedBy(BaseModel):
    anime_id: Optional[str] = None
    producer_id: Optional[str] = None

    class Config:
        json_schema_extra = {"example": {"anime_id": "1", "producer_id": "2"}}
