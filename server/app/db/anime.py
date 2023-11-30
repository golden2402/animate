# from animate.server.app.models.genre_model import UpdateGenre
# from animate.server.app.models.producer_model import UpdateProducer
# from animate.server.app.models.season_model import UpdateSeason
import db
from models.anime_model import UpdateAnime
from models.anime_episode_model import UpdateAnimeEpisode
from models.anime_genre_model import UpdateAnimeGenre
from models.episode_model import UpdateEpisode
from models.genre_model import UpdateGenre
from models.season_model import UpdateSeason
from models.producer_model import UpdateProducer


##################### ANIME #####################################


async def does_anime_exists(anime: UpdateAnime):
    return await db.run_statements(f"select * from anime where title = '{anime.title}'")


async def create_anime(anime: UpdateAnime):
    if anime["season_id"]:
        return await db.run_statements(
            f"insert into anime (id, title, season_id) values ( '{anime['id']}', '{anime['title']}', '{anime['season_id']}')"
        )
    else:
        return await db.run_statements(
            f"insert into anime (id, title) values ( '{anime['id']}', '{anime['title']}')"
        )


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


async def create_episode(episode: UpdateEpisode):
    return await db.run_statements(
        f"insert into episode (episode_number, episode_name) values ( '{episode.episode_number}', '{episode.episode_name}')"
    )


async def get_episode_by_id(id: str):
    return (await db.run_statements(f"select * from episode where id = '{id}'"))[0][0]


async def delete_episode(id: str):
    return await db.run_statements(f"delete from episode where id = {id}")


##################### GENRE #####################################


async def does_genre_exists(genre: UpdateGenre):
    return await db.run_statements(
        f"select * from genre where genre_name = '{genre.genre_name}'"
    )


async def create_genre(genre: UpdateGenre):
    return await db.run_statements(
        f"insert into genre (genre_name) values ( '{genre.genre_name}')"
    )


async def get_genre_by_id(id: str):
    return (await db.run_statements(f"select * from genre where id = '{id}'"))[0][0]


async def get_genre_by_name(name: str):
    return (
        await db.run_statements(f"select * from genre where genre_name = '{name}'")
    )[0][0]


async def delete_genre(id: str):
    return await db.run_statements(f"delete from genre where id = {id}")


##################### SEASON #####################################


async def does_season_exists(season: UpdateSeason):
    val = await db.run_statements(
        f"select * from season where season_name = '{season['season_name']}' AND season_year = '{season['season_year']}'"
    )
    return val[0]
    return await db.run_statements(
        f"select * from season where season_name = '{season['season_name']}' AND season_year = '{season['season_year']}'"
    )[0][0]


async def create_season(season: UpdateSeason):
    val = await db.run_statements(
        f"insert into season (season_year, season_name) values ( '{season['season_year']}', '{season['season_name']}')"
    )
    return val


async def get_season_by_id(id: str):
    return (await db.run_statements(f"select * from season where id = '{id}'"))[0][0]


async def delete_season(id: str):
    return await db.run_statements(f"delete from season where id = {id}")


##################### PRODUCER #####################################


async def does_producer_exists(producer: UpdateProducer):
    return await db.run_statements(
        f"select * from producer where studio_name = '{producer.studio_name}'"
    )


async def create_producer(producer: UpdateProducer):
    return await db.run_statements(
        f"insert into producer (studio_name, studio_year, studio_blurb) values ( '{producer.studio_name}', '{producer.studio_year}', `{producer.studio_blurb})"
    )


async def get_producer_by_id(id: str):
    return (await db.run_statements(f"select * from producer where id = '{id}'"))[0][0]


async def get_producer_by_name(name: str):
    return (
        await db.run_statements(f"select * from producer where studio_name = '{name}'")
    )[0][0]


async def delete_producer(id: str):
    return await db.run_statements(f"delete from producer where id = {id}")
