from fastapi import FastAPI
import db
from routers.auth import router as AuthRouter
from routers.anime import router as AnimeRouter
from routers.genre import router as GenreRouter
from routers.producer import router as ProducerRouter
from routers.season import router as SeasonRouter
from routers.user import router as UserRouter
from routers.follow import router as FollowRouter
from routers.favorite import router as FavoriteRouter
from routers.watch import router as WatchRouter
from routers.rating import router as RatingRouter
from routers.review import router as ReviewRouter

from fastapi import FastAPI
import asyncio

from db.anime import *
from populate import populate_anime

app = FastAPI()

app.include_router(AuthRouter, tags=["auth"], prefix="/auth")
app.include_router(AnimeRouter, tags=["anime"], prefix="/anime")
app.include_router(GenreRouter, tags=["genre"], prefix="/genre")
app.include_router(ProducerRouter, tags=["producer"], prefix="/producer")
app.include_router(SeasonRouter, tags=["season"], prefix="/season")
app.include_router(UserRouter, tags=["user"], prefix="/user")
app.include_router(FollowRouter, tags=["follow"], prefix="/follow")
app.include_router(FavoriteRouter, tags=["favorite"], prefix="/favorite")
app.include_router(WatchRouter, tags=["watch"], prefix="/watch")
app.include_router(RatingRouter, tags=["rating"], prefix="/rating")
app.include_router(ReviewRouter, tags=["review"], prefix="/review")


@app.get("/")
async def root():
    return {"message": "I'm up and running!"}


@app.get("/anime")
async def get_anime():
    return (await db.run_statements("select * from anime;"))[0]


@app.get("/users")
async def get_users():
    return (await db.run_statements("select * from user_account;"))[0]
