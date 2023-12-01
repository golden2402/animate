import db
from models.watched_episode_model import UpdateWatchedEpisode
from models.rating_model import UpdateRating
from models.review_model import UpdateReview

##################### FOLLOW #####################################


async def is_user_following(followee_id: str, follower_id: str):
    return await db.run_statements(
        f"select * from follow where followee_id = '{followee_id}' and follower_id = '{follower_id}'"
    )


async def create_follow_relation(followee_id: str, follower_id: str):
    return (
        await db.run_statements(
            f"insert into follow (followee_id, follower_id) values ( '{followee_id}', '{follower_id}')"
        )
    )[0]


async def delete_follow_relation(followee_id: str, follower_id: str):
    return await db.run_statements(
        f"delete from follow where followee_id = '{followee_id}' and follower_id = '{follower_id}'"
    )


async def delete_all_follow_by_user(user_id: str):
    return await db.run_statements(f"delete from follow where user_id = '{user_id}'")


async def get_all_relationships():
    return (await db.run_statements(f"select * from follow"))[0]


##################### favorite #####################################


async def is_user_favoriting(user_id: str, anime_id: str):
    return await db.run_statements(
        f"select * from favorite where user_id = '{user_id}' and anime_id = '{anime_id}'"
    )


async def create_favorite_relation(user_id: str, anime_id: str):
    return (
        await db.run_statements(
            f"insert into favorite (user_id, anime_id) values ( '{user_id}', '{anime_id}')"
        )
    )[0]


async def delete_favorite_relation(user_id: str, anime_id: str):
    return await db.run_statements(
        f"delete from favorite where user_id = '{user_id}' and anime_id = '{anime_id}'"
    )


async def delete_all_favorites_by_user(user_id: str):
    return await db.run_statements(f"delete from favorite where user_id = '{user_id}'")


async def get_all_favorites_by_user(user_id: str):
    return (
        await db.run_statements(f"select * from favorite where user_id = '{user_id}'")
    )[0]


async def get_all_favorites():
    return (await db.run_statements(f"select * from favorite"))[0]


##################### WATCHED EPISODE #####################################


async def has_user_watched(user_id: str, episode_id: str):
    return await db.run_statements(
        f"select * from watched_episodes where user_id = '{user_id}' and episode_id = '{episode_id}'"
    )


async def create_watched_episode_relation(wacthed_episode: UpdateWatchedEpisode):
    return (
        await db.run_statements(
            f"insert into watched_episodes (user_id, episode_id, watch_date) values ( '{wacthed_episode['user_id']}', '{wacthed_episode['episode_id']}', '{wacthed_episode['watch_date']}')"
        )
    )[0]


async def delete_watched_episode_relation(user_id: str, episode_id: str):
    return await db.run_statements(
        f"delete from watched_episodes where user_id = '{user_id}' and episode_id = '{episode_id}'"
    )


async def get_all_watched_episodes_by_user(user_id: str):
    return (
        await db.run_statements(
            f"select * from watched_episodes where user_id = '{user_id}'"
        )
    )[0]


async def get_all_watched_episodes():
    return (await db.run_statements(f"select * from watched_episodes"))[0]


##################### RATING #####################################


async def has_user_rated_episode(user_id: str, episode_id: str):
    return await db.run_statements(
        f"select * from rating where user_id = '{user_id}' and episode_id = '{episode_id}'"
    )


async def create_rating_raltion(rating: UpdateRating):
    return (
        await db.run_statements(
            f"insert into rating (user_id, episode_id, rate_score, rate_date) values ( '{rating['user_id']}', '{rating['episode_id']}', '{rating['rate_score']}', '{rating['rate_date']}')"
        )
    )[0]


async def delete_rating_relation(user_id: str, episode_id: str):
    return await db.run_statements(
        f"delete from rating where user_id = '{user_id}' and episode_id = '{episode_id}'"
    )


async def get_ratings_by_user(user_id: str):
    return (
        await db.run_statements(f"select * from rating where user_id = '{user_id}'")
    )[0]


async def get_ratings_by_episode(episode_id: str):
    return (
        await db.run_statements(
            f"select * from rating where episode_id = '{episode_id}'"
        )
    )[0]


async def get_ratings_by_score(score: int):
    return (
        await db.run_statements(f"select * from rating where rate_score = '{score}'")
    )[0]


async def get_all_ratings():
    return (await db.run_statements(f"select * from rating"))[0]


##################### REVIEW #####################################


async def has_user_reviewd_episode(user_id: str, episode_id: str):
    return await db.run_statements(
        f"select * from review where user_id = '{user_id}' and episode_id = '{episode_id}'"
    )


async def create_review_relation(review: UpdateReview):
    return (
        await db.run_statements(
            f"insert into review (user_id, episode_id, post) values ( '{review['user_id']}', '{review['episode_id']}', '{review['post']}')"
        )
    )[0]


async def delete_review_relation(user_id: str, episode_id: str):
    return await db.run_statements(
        f"delete from review where user_id = '{user_id}' and episode_id = '{episode_id}'"
    )


async def get_reviews_by_user(user_id: str):
    return (
        await db.run_statements(f"select * from review where user_id = '{user_id}'")
    )[0]


async def get_reviews_by_episode(episode_id: str):
    return (
        await db.run_statements(
            f"select * from review where episode_id = '{episode_id}'"
        )
    )[0]


async def get_all_reviews():
    return (await db.run_statements(f"select * from review"))[0]
