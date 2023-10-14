# animate

## Setup

### Omitted Files

For production environments, the compose files (both development and production) require the existence of a few secrets/misc. files omitted from version control:

- `client/.env`
- `server/.env`

- `pg/.env`&mdash;generic database credentials, sample:
    ```properties
    PG_USER=postgres
    POSTGRES_DB=animate
    # only used for development--replaced with a secret in production:
    POSTGRES_PASSWORD=postgres
    ```
- `.secrets/db/password`&mdash;(production) database admin password

## Startup

```bash
# -d flag runs containers in detached mode:
docker-compose up [-d]
# or, for development mode:
docker-compose -f compose.dev.yml up [-d]
```

For first, invocation when switching between invocation files (e.g. default `compose.yml` to `compose.dev.yml`), append the `--build` flag to invoke a full container rebuild.

## Teardown

```bash
docker-compose down
```

If you want to remove containers *and* their associated volumes, append the `-v` flag. **Purging volumes will result in the removal of all Postgres data.**
