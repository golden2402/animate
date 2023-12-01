from fastapi import FastAPI
import db
from routers import auth
from routers.anime import router as AnimeRouter
from routers.genre import router as GenreRouter
from routers.episodes import router as EpisodeRouter
from routers.producer import router as ProducerRouter
from routers.season import router as SeasonRouter
from routers.user import router as UserRouter

from fastapi import FastAPI
import asyncio

from db.anime import *
from populate import populate_anime

app = FastAPI()

app.include_router(auth.router)
app.include_router(AnimeRouter, tags=["anime"], prefix="/anime")
app.include_router(GenreRouter, tags=["genre"], prefix="/genre")
app.include_router(EpisodeRouter, tags=["episode"], prefix="/episode")
app.include_router(ProducerRouter, tags=["producer"], prefix="/producer")
app.include_router(SeasonRouter, tags=["season"], prefix="/season")
app.include_router(UserRouter, tags=["user"], prefix="/user")


@app.get("/")
async def root():
    return {"message": "I'm up and running!"}


@app.get("/anime")
async def get_anime():
    return (await db.run_statements("select * from anime;"))[0]


@app.get("/users")
async def get_users():
    return (await db.run_statements("select * from user_account;"))[0]


@app.on_event("startup")
async def startup_event():
    if not await get_all_anime():
        asyncio.create_task(populate_anime(1031))
        asyncio.create_task(populate_anime(1030))
        asyncio.create_task(populate_anime(1029))
        asyncio.create_task(populate_anime(1028))
        asyncio.create_task(populate_anime(1027))
