from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

SECRET_KEY = "supersecret"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"])

# hardcoded admin
USERNAME = "admin"
PASSWORD_HASH = "$2b$12$hwE7gnaJNCXIDsC2DyZNGumiXQYWtfeQt1xKJSKXB3OSSWJ33PdKm"


def verify(username, password):
    if username != USERNAME:
        return False
    return pwd_context.verify(password, PASSWORD_HASH)


def create_token():
    payload = {
        "sub": USERNAME,
        "exp": datetime.utcnow() + timedelta(hours=8)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)