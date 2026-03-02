from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")
jwt_secret_key = "change_me_to_a_long_random_secret"
jwt_algorithm = "HS256"
access_token_expire_minutes = 60

def hash_password(password:str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)

def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=access_token_expire_minutes)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, jwt_secret_key, algorithm=jwt_algorithm)
