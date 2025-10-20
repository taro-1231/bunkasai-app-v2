from fastapi import APIRouter, HTTPException, Depends
from app.db import get_db
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import LoginRequest, UserRead
from starlette.responses import Response

from datetime import timedelta
from jose import JWTError, jwt
from datetime import datetime, timezone
from fastapi.security import OAuth2PasswordBearer
from starlette.status import HTTP_401_UNAUTHORIZED
from app.routers.tenants import resolve_tenant
from app.models import Tenant

SECRET_KEY = "your_secret_key" #ひみつ
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120 #いったんリフレッシュなしで長めにしておく

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# ユーザー情報に有効期限を追加したdictを作り、JWTを作成す
#user_id,tenant_id,role
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({'exp': expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

#これを依存関数にすることで、「ユーザー登録してない」、「有効期限切れ」とかをチェックできる
# これを依存関数にしてuserに入れることで,HTTPリクエストのヘッダーにtokenが入っているならそのuserを取得できる
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        #JWT.decodeでexpireを自動でチェック
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        tenant_id = payload.get("tenant_id")
        role = payload.get("role")
        user = db.query(User).filter(User.id == user_id, User.tenant_id == tenant_id).one_or_none()
        if user is None:
            return credentials_exception
        return user
    except JWTError:
        raise credentials_exception

def authenticate_user(username:str, password:str, tenant_id:str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username, User.tenant_id == tenant_id).one_or_none()
    if not user:
        return None
    if user.password_hash != password:
        return None
    # いったんこっちで
    # if not verify_password(password, user.password_hash):
    #     return None
    return user

router = APIRouter(prefix='/api/v2/tenants/{slug}/auth')

@router.post('/login')
def login(body: LoginRequest, tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    user = authenticate_user(body.username, body.password, tenant.id, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"user_id": user.id, "tenant_id": user.tenant_id, "role": user.role},
        expires_delta=access_token_expires
        )
    return {"access_token": access_token, "token_type": "bearer"}

# つかわないかな
@router.post('/logout')
def logout(response: Response):
    response.delete_cookie(key="access_token")
    print("Logged out successfully")
    return {"message": "Logged out successfully"}


@router.get('/me', response_model=UserRead)
def me(tenant: Tenant = Depends(resolve_tenant), user: User = Depends(get_current_user)):
    if user is None:
        return None
    if user.tenant_id != tenant.id:
        return None
    return user