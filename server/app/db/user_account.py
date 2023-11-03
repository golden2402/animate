import db
from models.user_account_model import (
    UserAccount,
    UpdateUserAccount,
    AuthorizedUser,
)
from db.util import get_items_to_update


async def create_user_account(user: UserAccount):
    return await db.run_statements(
        f"insert into user_account (email, username, user_password, display_name) values ('{user.email}', '{user.username}', '{user.user_password}', '{user.display_name}')"
    )


async def does_username_exist(username: str):
    return (
        await db.run_statements(
            f"select * from user_account where username = '{username}'"
        )
    )[0]


async def does_email_exist(email: str):
    return (
        await db.run_statements(f"select * from user_account where email = '{email}'")
    )[0]


# Retrieving an authenticated user should only be called if JWT was succesffuly decoded.
async def get_user_by_id(id: str):
    return (await db.run_statements(f"select * from user_account where id = '{id}'"))[
        0
    ][0]


async def updater_user_account(user: UpdateUserAccount, id: str):
    print(f"Update user_account set {get_items_to_update(user)} where id = {id}")
    return await db.run_statements(
        f"Update user_account set {get_items_to_update(user)} where id = {id}"
    )


# DELETE FROM table_name WHERE condition;
async def delete_user_account(id: str):
    return await db.run_statements(f"delete from user_account where id = {id}")
