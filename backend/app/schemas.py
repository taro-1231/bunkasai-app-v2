from pydantic import BaseModel, EmailStr

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
    password: str

class UserCreate(UserBase):
    role: str
    belong: str


class UserRead(UserBase):

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
    tenant_id: str
    