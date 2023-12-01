import db
from models.watched_anime_model import UpdateWatchedAnime
from models.rating_model import UpdateRating
from models.review_model import UpdateReview

##################### FOLLOW #####################################


async def is_user_following(followee_id: str, follower_id: str):
    return (
        await db.run_statements(
            f"select * from follow where followee_id = '{followee_id}' and follower_id = '{follower_id}'"
        )
    )[0]


async def create_follow_relation(followee_id: str, follower_id: str):
    return (
        await db.run_statements(
            f"insert into follow (followee_id, follower_id) values ( '{followee_id}', '{follower_id}') RETURNING followee_id, follower_id"
        )
    )[0]


async def delete_follow_relation(followee_id: str, follower_id: str):
    return await db.run_statements(
        f"delete from follow where followee_id = '{followee_id}' and follower_id = '{follower_id}'"
    )


async def delete_all_follow_by_user_db(followee_id: str):
    return await db.run_statements(
        f"delete from follow where followee_id = '{followee_id}'"
    )


async def get_all_followees_db(followee_id: str):
    return (
        await db.run_statements(
            f"select * from follow where followee_id = '{followee_id}'"
        )
    )[0]


async def get_all_followers_db(follower_id: str):
    return (
        await db.run_statements(
            f"select * from follow where follower_id = '{follower_id}'"
        )
    )[0]


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


##################### WATCHED ANIME #####################################


async def has_user_watched(user_id: str, anime_id: str):
    return await db.run_statements(
        f"select * from watched_anime where user_id = '{user_id}' and anime_id = '{anime_id}'"
    )


async def create_watched_anime_relation(watched_anime: UpdateWatchedAnime):
    return (
        await db.run_statements(
            f"insert into watched_anime (user_id, anime_id, watch_count, watch_date) values ( '{watched_anime['user_id']}', '{watched_anime['anime_id']}', '{watched_anime['watch_count']}', '{watched_anime['watch_date']}')"
        )
    )[0]


async def delete_watched_anime_relation(user_id: str, anime_id: str):
    return await db.run_statements(
        f"delete from watched_anime where user_id = '{user_id}' and anime_id = '{anime_id}'"
    )


async def delete_all_watched_anime(user_id: str):
    return await db.run_statements(
        f"delete from watched_anime where user_id = '{user_id}'"
    )


async def get_all_watched_anime_by_user(user_id: str):
    return (
        await db.run_statements(
            f"select * from watched_anime where user_id = '{user_id}'"
        )
    )[0]


async def get_all_watched_anime():
    return (await db.run_statements(f"select * from watched_anime"))[0]


##################### RATING #####################################


async def has_user_rated_anime(user_id: str, anime_id: str):
    return await db.run_statements(
        f"select * from rating where user_id = '{user_id}' and anime_id = '{anime_id}'"
    )


async def create_rating_raltion(rating: UpdateRating):
    return (
        await db.run_statements(
            f"insert into rating (user_id, anime_id, rate_score, rate_date) values ( '{rating['user_id']}', '{rating['anime_id']}', '{rating['rate_score']}', '{rating['rate_date']}')"
        )
    )[0]


async def delete_rating_relation(user_id: str, anime_id: str):
    return await db.run_statements(
        f"delete from rating where user_id = '{user_id}' and anime_id = '{anime_id}'"
    )


async def get_ratings_by_user(user_id: str):
    return (
        await db.run_statements(f"select * from rating where user_id = '{user_id}'")
    )[0]


async def get_ratings_by_anime(anime_id: str):
    return (
        await db.run_statements(f"select * from rating where anime_id = '{anime_id}'")
    )[0]


async def get_ratings_by_score(score: int):
    return (
        await db.run_statements(f"select * from rating where rate_score = '{score}'")
    )[0]


async def get_all_ratings():
    return (await db.run_statements(f"select * from rating"))[0]


##################### REVIEW #####################################


async def has_user_reviewd_anime(user_id: str, anime_id: str):
    return await db.run_statements(
        f"select * from review where user_id = '{user_id}' and anime_id = '{anime_id}'"
    )


async def create_review_relation(review: UpdateReview):
    return (
        await db.run_statements(
            f"insert into review (user_id, anime_id, post) values ( '{review['user_id']}', '{review['anime_id']}', '{review['post']}')"
        )
    )[0]


async def delete_review_relation(user_id: str, anime_id: str):
    return await db.run_statements(
        f"delete from review where user_id = '{user_id}' and anime_id = '{anime_id}'"
    )


async def get_reviews_by_user(user_id: str):
    return (
        await db.run_statements(f"select * from review where user_id = '{user_id}'")
    )[0]


async def get_reviews_by_anime(anime_id: str):
    return (
        await db.run_statements(f"select * from review where anime_id = '{anime_id}'")
    )[0]


async def get_all_reviews():
    return (await db.run_statements(f"select * from review"))[0]


############################ MISC ##################
