from datetime import datetime, timedelta
from models.user_account_model import (
    ErrorResponseModel,
    ResponseModel,
    UserAccount,
    UpdateUserAccount,
    AuthorizedUser,
)
from jose import JWTError, jwt
import db
import bcrypt
from fastapi import APIRouter, status, HTTPException, Request

router = APIRouter()

SALT_ROUNDS = 12
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
# TODO: Move this to env, maybe .secrets?
SECRET_KEY = "71a339833c93220552562ef61498fe8ab6fdbb8d8447694525dda84bd0602e36"


@router.post("/auth/register")
async def register_user(user: UpdateUserAccount):
    return await try_register(user)


@router.post("/auth/login")
async def login_user(user: UpdateUserAccount):
    return await try_login(user)


@router.get("/auth/me")
async def login_user(user: AuthorizedUser, request: Request):
    try:
        print(request.headers.get("Authorization"))
        token = request.headers.get("Authorization")
    except:
        return ErrorResponseModel("Invalid Access Token", 401, "Try loggin in again")

    return await get_current_user(token)


async def try_register(user: UpdateUserAccount):
    # handling anything that could give us DB or Null Errors
    if not user.username or not user.user_password:
        return ErrorResponseModel(
            "Invalid Credentials",
            400,
            "Username or Password is not properly filled out.",
        )

    if await does_email_exist(user.email):
        return ErrorResponseModel("Invalid Email", 400, "Email Already exist")

    if await does_username_exist(user.username):
        return ErrorResponseModel("Invalid Username", 400, "Username Already exist")

    # Now that we have passed checks lets try to register account
    user.user_password = await hash_password(user.user_password)

    try:
        await create_user_account(user)
        print("Successfully created account")
        return ResponseModel({}, "Account Created Successfully")
    except Exception as e:
        print(e)
        print("Error Creating User account")
        return ErrorResponseModel(
            "An error occurred.", 400, "Could not create User Account"
        )


async def try_login(user: UpdateUserAccount):
    if not user.username or not user.user_password:
        return ErrorResponseModel(
            "Invalid Credentials",
            400,
            "Username or Password is not properly filled out.",
        )

    if not await does_username_exist(user.username):
        return ErrorResponseModel("Invalid Username", 400, "Username Does Not Exist")

    authenticated_user = await get_user_by_credentials(
        user.username, user.user_password
    )

    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if authenticated_user:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}


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
async def get_user_by_username(username: str):
    return (
        await db.run_statements(
            f"select * from user_account where username = '{username}'"
        )
    )[0][0]


async def get_user_by_credentials(username: str, unhashed_password: str):
    print(f"Looking for User with username {username}")

    # TODO: Talk to John why this is returning [array][array]
    fetched_user = (
        await db.run_statements(
            f"select * from user_account where username = '{username}'"
        )
    )[0][0]

    if fetched_user:
        try:
            if compare_password(unhashed_password, fetched_user["user_password"]):
                return fetched_user
            else:
                return ErrorResponseModel(
                    "Invalid Credentials", 401, "Password is incorrect"
                )
        except:
            return ErrorResponseModel(
                "Invalid Credentials", 401, "Password is incorrect"
            )
    return None


async def hash_password(password: str):
    # convert password str to bytes
    bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=SALT_ROUNDS)
    # Hashing the password
    hash = bcrypt.hashpw(bytes, salt)

    return hash.decode("utf-8")


def compare_password(password: str, hashed_password: str):
    encoded_password = password.encode("utf-8")
    encoded_hased_password = hashed_password.encode("utf-8")
    # Check that an unhashed password matches one that has previously been hashed
    return bcrypt.checkpw(encoded_password, encoded_hased_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: dict):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = username
    except JWTError:
        raise credentials_exception
    user = await get_user_by_username(token_data)
    if user is None:
        raise credentials_exception
    return user
