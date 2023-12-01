import db
from models.anime_model import UpdateAnime
from models.episode_model import UpdateEpisode
from models.genre_model import UpdateGenre
from models.season_model import UpdateSeason
from models.producer_model import UpdateProducer


##################### ANIME #####################################


async def does_anime_exists(anime: UpdateAnime):
    return await db.run_statements(f"select * from anime where title = '{anime.title}'")


async def create_anime(anime: UpdateAnime):
    if anime["season_id"]:
        return (
            await db.run_statements(
                f"insert into anime (id, title, season_id) values ( '{anime['id']}', '{anime['title']}', '{anime['season_id']}')"
            )
        )[0]
    else:
        return (
            await db.run_statements(
                f"insert into anime (id, title) values ( '{anime['id']}', '{anime['title']}')"
            )
        )[0]


async def get_anime_by_id(id: str):
    return (await db.run_statements(f"select * from anime where id = '{id}'"))[0]


async def delete_anime(id: str):
    return await db.run_statements(f"delete from anime where id = {id}")


async def get_all_anime():
    return (await db.run_statements(f"select * from anime"))[0]


##################### EPISODE #####################################


async def does_episode_exists(episode: UpdateEpisode):
    return await db.run_statements(
        f"select * from episode where episode_name = '{episode.episode_name}'"
    )


async def create_episode(episode: int):
    return (
        await db.run_statements(
            f"insert into episode (episode_number) values ( '{episode}') RETURNING id"
        )
    )[0]


async def get_episode_by_id(id: str):
    return (await db.run_statements(f"select * from episode where id = '{id}'"))[0][0]


async def delete_episode(id: str):
    return await db.run_statements(f"delete from episode where id = {id}")


async def get_all_episodes():
    return (await db.run_statements(f"select * from episode"))[0]


##################### GENRE #####################################


async def does_genre_exists(genre: UpdateGenre):
    val = await db.run_statements(
        f"select * from genre where genre_name = '{genre['genre_name']}'"
    )
    return val[0]


async def create_genre(genre: UpdateGenre):
    return await db.run_statements(
        f"insert into genre (id, genre_name) values ('{genre['id']}', '{genre['genre_name']}')"
    )


async def get_genre_by_id(id: str):
    return (await db.run_statements(f"select * from genre where id = '{id}'"))[0][0]


async def get_genre_by_name(name: str):
    return (
        await db.run_statements(f"select * from genre where genre_name = '{name}'")
    )[0]


async def delete_genre(id: str):
    return await db.run_statements(f"delete from genre where id = {id}")


async def get_all_genres():
    return (await db.run_statements(f"select * from genre"))[0]


##################### SEASON #####################################


async def does_season_exists(season: UpdateSeason):
    val = await db.run_statements(
        f"select * from season where season_name = '{season['season_name']}' AND season_year = '{season['season_year']}'"
    )
    return val[0]


async def create_season(season: UpdateSeason):
    val = await db.run_statements(
        f"insert into season (season_year, season_name) values ( '{season['season_year']}', '{season['season_name']}') RETURNING id"
    )
    return val


async def get_season_by_id(id: str):
    return (await db.run_statements(f"select * from season where id = '{id}'"))[0][0]


async def get_season_by_all_info(season_name: str, season_year: str):
    return (
        await db.run_statements(
            f"select * from season where season_name = '{season_name}' and season_year = '{season_year}'"
        )
    )[0]


async def delete_season(id: str):
    return await db.run_statements(f"delete from season where id = {id}")


##################### PRODUCER #####################################


async def does_producer_exists(id: str):
    return (await db.run_statements(f"select * from producer where id = '{id}'"))[0]


async def create_producer(producer: UpdateProducer):
    return await db.run_statements(
        f"insert into producer (id, studio_name, studio_year, studio_blurb) values ('{producer['id']}', '{producer['studio_name']}', '{producer['studio_year']}', '{producer['studio_blurb']}')"
    )


async def get_producer_by_id(id: str):
    return (await db.run_statements(f"select * from producer where id = '{id}'"))[0][0]


async def get_producer_by_name(name: str):
    return (
        await db.run_statements(f"select * from producer where studio_name = '{name}'")
    )[0][0]


async def delete_producer(id: str):
    return await db.run_statements(f"delete from producer where id = {id}")


async def get_all_producers():
    return (await db.run_statements(f"select * from producer"))[0]


##################### ANIME GENRE RELATIONSHIP #####################################


async def get_all_anime_genre_relationships():
    return (await db.run_statements(f"select * from anime_genre"))[0]


async def create_anime_genre_relationship(anime: UpdateAnime, genre: UpdateGenre):
    return await db.run_statements(
        f"insert into anime_genre (anime_id, genre_id) values ( '{anime['id']}', '{genre['id']}')"
    )


##################### ANIME EPISODE RELATIONSHIP #####################################


async def get_all_anime_episode_relationships():
    return (await db.run_statements(f"select * from anime_episode"))[0]


async def create_anime_episode_relationship(anime: UpdateAnime, episode: UpdateEpisode):
    return await db.run_statements(
        f"insert into anime_episode (anime_id, episode_id) values ( '{anime['id']}', '{episode['id']}')"
    )


##################### ANIME PRODUCER RELATIONSHIP #####################################


async def get_all_anime_producer_relationship():
    return (await db.run_statements(f"select * from produced_by"))[0]


async def create_anime_producer_relationship(
    anime: UpdateAnime, producer: UpdateProducer
):
    return await db.run_statements(
        f"insert into produced_by (anime_id, producer_id) values ( '{anime['id']}', '{producer['id']}')"
    )
