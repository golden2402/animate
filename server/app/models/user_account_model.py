from pydantic import BaseModel, Field
from typing import Optional

class UserAccount(BaseModel):
    email: str
    username: str
    user_password: str
    display_name: str
    user_color: str
    blurb: str

class UpdateUserAccount(BaseModel):
    email: Optional[str]
    username: Optional[str]
    user_password: Optional[str]
    display_name: Optional[str]
    user_color: Optional[str]
    blurb: Optional[str]


    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@vt.edu",
                "username": "john",
                "user_password": "12345678",
                "display_name": "golden2402",
                "user_color": "#11",
                "blurb": "Some Info"
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