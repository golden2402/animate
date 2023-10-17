import os
import asyncpg


PG_USER = os.environ["PG_USER"]
PG_PASSWORD = os.environ["POSTGRES_PASSWORD"]
PG_DATABASE = os.environ["POSTGRES_DB"]

DB_DSN = f"postgresql://{PG_USER}:{PG_PASSWORD}@database/{PG_DATABASE}"


async def run_statements(*statements: str):
    results = []

    async with asyncpg.create_pool(dsn=DB_DSN, command_timeout=60) as pool:
        async with pool.acquire() as connection:
            for statement in statements:
                results.append(await connection.fetch(statement))

    return results
