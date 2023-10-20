from fastapi import FastAPI

import db


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "I'm up and running!"}


@app.get("/anime")
async def get_anime():
    return (await db.run_statements("select * from anime;"))[0]


@app.get("/users")
async def get_users():
    return (await db.run_statements("select * from user_account;"))[0]
