from datetime import datetime, timedelta
from models.response_models import ErrorResponseModel, ResponseModel
from models.user_account_model import UpdateUserAccount
from jose import JWTError, jwt
import db
import bcrypt
from fastapi import APIRouter, status, HTTPException, Request
from db.user_account import (
    create_user_account,
    does_username_exist,
    does_email_exist,
    get_user_by_id,
    updater_user_account,
    delete_user_account,
)


SALT_ROUNDS = 12
ALGORITHM = "HS256"
# 7 Days in mins
ACCESS_TOKEN_EXPIRE_MINUTES = 10080
# TODO: Move this to env, maybe .secrets?
SECRET_KEY = "71a339833c93220552562ef61498fe8ab6fdbb8d8447694525dda84bd0602e36"

router = APIRouter()


@router.post("/register")
async def register_user(user: UpdateUserAccount):
    if user.display_name:
        user.display_name = user.display_name.replace("'", "''")
    if user.blurb:
        user.blurb = user.blurb.replace("'", "''")
    return await try_register(user)


@router.post("/login")
async def login_user(user: UpdateUserAccount):
    return await try_login(user)


@router.get("/login")
async def login_user(request: Request):
    authorize_user(request)
    return ResponseModel(None, "User is Authorized")


@router.get("/me")
async def login_user(request: Request):
    id = authorize_user(request)
    return await get_current_user(id)


@router.post("/me/update")
async def update_account(user: UpdateUserAccount, request: Request):
    id = authorize_user(request)
    auth_user = await get_current_user(id)
    if user.display_name:
        user.display_name = user.display_name.replace("'", "''")
    if user.blurb:
        user.blurb = user.blurb.replace("'", "''")
    if user.user_password:
        user.user_password = await hash_password(user.user_password)

    try:
        await updater_user_account(user, auth_user["id"])
    except:
        return ErrorResponseModel(None, 500, "Error Updating User Account")

    return ResponseModel(None, "Successfully Updated User Account")


@router.post("/me/delete")
async def update_account(request: Request):
    id = authorize_user(request)
    return await delete_user_account(id)


def authorize_user(request: Request):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = request.headers.get("Authorization")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = payload.get("sub")
        if id is None:
            raise credentials_exception
        return id
    except:
        raise credentials_exception


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
            data={"sub": str(authenticated_user["id"])},
            expires_delta=access_token_expires,
        )
        return {"access_token": access_token, "token_type": "bearer"}


async def get_user_by_credentials(username: str, unhashed_password: str):
    print(f"Looking for User with username {username}")

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
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect username or password",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        except:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
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
    # TODO: Is this needed?
    to_encode.update({"iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(id: str):
    try:
        user = await get_user_by_id(id)
    except:
        return ErrorResponseModel(
            "User Lookup", 404, "Could Not find User with specified ID"
        )
    return user
