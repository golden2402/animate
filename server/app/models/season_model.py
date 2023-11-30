from pydantic import BaseModel, Field
from typing import Optional


class Season(BaseModel):
    id: str
    season_year: str
    season_name: str


class UpdateSeason(BaseModel):
    id: Optional[str] = None
    season_year: Optional[str] = None
    season_name: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1",
                "season_year": "2023",
                "season_name": "Season Name",
            }
        }


def ResponseModel(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }


def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}
