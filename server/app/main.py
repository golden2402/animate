from fastapi import FastAPI
import db
from routers import auth, anime
from routers.anime import router as AnimeRouter

app = FastAPI()

app.include_router(auth.router)
app.include_router(AnimeRouter, tags=["anime"], prefix="/anime")


@app.get("/")
async def root():
    return {"message": "I'm up and running!"}


@app.get("/anime")
async def get_anime():
    return (await db.run_statements("select * from anime;"))[0]


@app.get("/users")
async def get_users():
    return (await db.run_statements("select * from user_account;"))[0]
