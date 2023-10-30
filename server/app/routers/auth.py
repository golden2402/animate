from jwcrypto import jwt, jwk
from models.user_account_model import ErrorResponseModel, ResponseModel, UserAccount, UpdateUserAccount
import db
import bcrypt

from fastapi import APIRouter

router = APIRouter()

SALT_ROUNDS = 12


@router.post("/auth/register")
async def register_user(user: UpdateUserAccount):
    user: UpdateUserAccount = {
        "username": "Joey562",
        "email": "pranky562@gmail.com",
        "user_password": "123456",
        "display_name": "Joey"
    }

    return await try_register(user)

@router.post("/auth/login")
async def login_user(user: UpdateUserAccount):

    user: UpdateUserAccount = {
        "username": "Joey56",
        "email": "pranky56@gmail.com",
        "user_password": "123456",
        "display_name": "Joey"
    }

    return await try_login(user)


async def try_register(user: UpdateUserAccount):
    # handling anything that could give us DB or Null Errors
    if ( not user["username"] or not user["user_password"]):
        return ErrorResponseModel("Invalid Credentials", 400, "Username or Password is not properly filled out.")
    
    if (await does_email_exist(user["email"])):
        return ErrorResponseModel("Invalid Email", 400, "Email Already exist")

    if (await does_username_exist(user["username"])):
        return ErrorResponseModel("Invalid Username", 400, "Username Already exist")

    # Now that we have passed checks lets try to register account
    user["user_password"] = await hash_password(user["user_password"])
    print(user["user_password"])

    try: 
        await create_user_account(user)
        print("Successfully created account")
        return ResponseModel({}, "Account Created Successfully")
    except Exception as e:
        print(e)
        print("Error Creating User account")
        return ErrorResponseModel("An error occurred.", 400, "Could not create User Account")


def try_login(user: User):
    return

async def create_user_account(user: UserAccount): 
    return (await db.run_statements(f"insert into user_account (email, username, user_password, display_name) values ('{user['email']}', '{user['username']}', '{user['user_password']}', '{user['display_name']}')"))


async def does_username_exist(username: str):
    return (await db.run_statements(f"select * from user_account where username = '{username}'"))[0]

async def does_email_exist(email: str):
    return (await db.run_statements(f"select * from user_account where email = '{email}'"))[0]

# TODO: Should this function be async?
async def hash_password(password: str): 
    # convert password str to bytes
    bytes = password.encode('utf-8') 
    salt = bcrypt.gensalt(rounds=SALT_ROUNDS) 
    # Hashing the password 
    hash = bcrypt.hashpw(bytes, salt) 
    
    return hash.decode('utf-8')

def compare_password(password: str, hashed_password: str):
    encoded_password = password.encode('utf-8') 
    # Check that an unhashed password matches one that has previously been hashed
    return  bcrypt.checkpw(encoded_password, hashed_password)


def create_token():
    key = jwk.JWK(generate='oct', size=256)
    print(key.export())
    Token = jwt.JWT(header={"alg": "HS256"},
    claims={"info": "I'm a signed token"})
    Token.make_signed_token(key)
    print(Token.serialize())
