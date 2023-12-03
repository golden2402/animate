import os
import asyncpg


PG_USER = os.environ["PG_USER"]
PG_PASSWORD = os.environ["POSTGRES_PASSWORD"]
PG_DATABASE = os.environ["POSTGRES_DB"]

DB_DSN = f"postgresql://{PG_USER}:{PG_PASSWORD}@database/{PG_DATABASE}"


async def run_statements(*statements: str):
    results = []

    connection = await asyncpg.connect(DB_DSN)

    for statement in statements:
        results.append(await connection.fetch(statement))

    await connection.close()

    return results
