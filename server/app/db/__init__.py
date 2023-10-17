import asyncpg


DB_DSN = "postgresql://postgres:postgres@database/animate"


async def run_statements(*statements: str):
    results = []

    async with asyncpg.create_pool(dsn=DB_DSN, command_timeout=60) as pool:
        async with pool.acquire() as connection:
            for statement in statements:
                results.append(await connection.fetch(statement))

    return results
