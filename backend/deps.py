from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

from backend.auth import SECRET_KEY
from jose import jwt

security = HTTPBearer()


def verify_token_dep(credentials=Depends(security)):
    token = credentials.credentials
    try:
        jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
