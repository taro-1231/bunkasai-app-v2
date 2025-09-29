from pydantic import BaseModel, EmailStr
from datetime import datetime

# テナント
class TenantBase(BaseModel):
    slug: str

class TenantCreate(TenantBase):
    school_name: str

class TenantRead(TenantBase):
    school_name: str

    class Config:
        from_attributes = True
    

# ユーザー
class UserBase(BaseModel):
    username: str
    

class UserCreate(UserBase):
    role: str
    belong: str
    password: str


class UserRead(UserBase):
    role: str
    belong: str
    class Config:
        from_attributes = True

# テナント、ユーザー
class TenantOwnerCreate(BaseModel):
    tenant: TenantCreate
    owner: UserBase
    email: EmailStr


class LoginRequest(BaseModel):
    username: str
    password: str
    # tenant_id: str
    

# ブース
class BoothCreate(BaseModel):
    booth_name: str
    belong: str
    location: str
    summary: str
    description_md: str | None
    open_from: datetime | None
    open_to: datetime | None

# イベント
class EventCreate(BaseModel):
    event_name: str
    location: str
    start_at: datetime | None = None
    end_at: datetime | None = None
    description: str | None = None

# お知らせ
class AnnouncementCreate(BaseModel):
    title: str
    body: str

# 写真板
class PhotoCreate(BaseModel):
    image_url: str
