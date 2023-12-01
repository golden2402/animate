def ResponseModel(data, message):
    return {
        "data": [data],
        "message": message,
    }


def ErrorResponseModel(error, message):
    return {"error": error, "message": message}
