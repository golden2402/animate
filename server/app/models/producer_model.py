from pydantic import BaseModel, Field
from typing import Optional


class Producer(BaseModel):
    id: int
    studio_name: str
    studio_year: str
    studio_blurb: str


class UpdateProducer(BaseModel):
    id: Optional[int] = None
    studio_name: Optional[str] = None
    studio_year: Optional[str] = None
    studio_blurb: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1",
                "studio_name": "Name",
                "studio_year": "1996",
                "studio_blurb": "some blurb",
            }
        }
