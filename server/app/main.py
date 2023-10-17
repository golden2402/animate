from fastapi import FastAPI

from .db import run_statements


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "I'm up and running!"}


@app.get("/anime")
async def get_anime():
    return (await run_statements("select * from anime;"))[0]


@app.get("/users")
async def get_users():
    return (await run_statements("select * from user_account;"))[0]
