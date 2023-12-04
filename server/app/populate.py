from datetime import datetime, date
import requests
from models.anime_model import UpdateAnime
from models.season_model import UpdateSeason
from models.producer_model import UpdateProducer
from db.anime import *


async def populate_anime(current_page):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(
        "https://api.jikan.moe/v4/anime/?page=" + str(current_page), headers=headers
    )
    response.raise_for_status()

    if not response.content:
        print("ERRROORRR")

    page_data = response.json()["data"]
    print(f"Starting PAGE: '{current_page}': '{datetime.now()}'")
    count = 0
    for anime in page_data:
        if anime["title"]:
            anime["title"] = anime["title"].replace("'", "''")
            
        if anime["synopsis"]:
            anime["synopsis"] = anime["synopsis"].replace("'", "''")

        ## season stuffz
        season_dict: UpdateSeason = {
            "season_year": anime["year"],
            "season_name": anime["season"],
        }

        if (
            anime["year"] != None and anime["season"] != None
        ) and not await does_season_exists(season_dict):
            await create_season(season_dict)

        season = (
            (
                await get_season_by_all_info(
                    season_dict["season_name"], season_dict["season_year"]
                )
            )[0]
            if season_dict["season_name"] and season_dict["season_year"]
            else None
        )

        anime_dict: UpdateAnime = {
            "id": anime["mal_id"],
            "title": anime["title"],
            "blurb": anime["synopsis"],
            "episodes": anime["episodes"] if anime["episodes"] else 0,
            "season_id": season["id"] if season and season["id"] else None,
        }
        if not await get_anime_by_id(anime["mal_id"]):
            count += 1
            await create_anime(anime_dict)

        # get newly created anime
        created_anime = await get_anime_by_id(anime["mal_id"])

        # Genre stuffz
        genres = anime["genres"]
        for genre in genres:
            if genre["name"]:
                genre["name"] = genre["name"].replace("'", "''")
            genre_dict: UpdateGenre = {
                "id": genre["mal_id"],
                "genre_name": genre["name"],
            }
            if not await does_genre_exists(genre_dict):
                # create da genre
                await create_genre(genre_dict)

            # get da genre
            genre_from_db = await get_genre_by_name(genre_dict["genre_name"])
            if genre_from_db and genre_from_db[0]:
                await create_anime_genre_relationship(
                    anime=created_anime[0], genre=genre_from_db[0]
                )

        # Episode stuff
        # if anime["episodes"]:
        #     for x in range(1, anime["episodes"] + 1):
        #         new_episode = await create_episode(x)
        #         if new_episode and new_episode[0]:
        #             created_episode = await get_episode_by_id(new_episode[0]["id"])
        #             await create_anime_episode_relationship(
        #                 anime=created_anime[0], episode=created_episode
        #             )

        # Studio/producer
        for studio in anime["studios"]:
            # https://api.jikan.moe/v4/producers/{id}
            if not await does_producer_exists(studio["mal_id"]):
                studio_url = "https://api.jikan.moe/v4/producers/" + str(
                    studio["mal_id"]
                )
                studio_response = requests.get(
                    studio_url,
                    headers=headers,
                )
                studio_response.raise_for_status()

                if not studio_response.content:
                    return

                studio_response_page_data = studio_response.json()["data"]
                studio_dict: UpdateProducer = {
                    "id": studio["mal_id"],
                    "studio_name": studio["name"],
                    "studio_blurb": studio_response_page_data["about"]
                    if studio_response_page_data["about"]
                    else "None",
                    "studio_year": studio_response_page_data["established"]
                    if studio_response_page_data["established"]
                    else date.today(),
                }
                if studio_dict["studio_blurb"]:
                    studio_dict["studio_blurb"] = studio_dict["studio_blurb"].replace(
                        "'", "''"
                    )
                if studio_dict["studio_name"]:
                    studio_dict["studio_name"] = studio_dict["studio_name"].replace(
                        "'", "''"
                    )
                # create da producer
                await create_producer(studio_dict)

            created_producer = await get_producer_by_id(studio["mal_id"])
            if created_producer:
                await create_anime_producer_relationship(
                    anime=created_anime[0], producer=created_producer
                )
    print(f"Ending PAGE: '{current_page}': '{datetime.now()}' added: '{count}'")
