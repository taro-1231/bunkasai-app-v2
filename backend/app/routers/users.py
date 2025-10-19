from fastapi import APIRouter, HTTPException, Request, Depends
from app.db import get_db
from sqlalchemy.orm import Session
# from fastapi import Depends
from app.models import User, Tenant
from app.schemas import UserCreate, UserRead
from app.routers.tenants import resolve_tenant
from app.routers.auth import get_current_user


router = APIRouter(prefix='/api/v2/tenants/{slug}/users')

@router.get('/')
def get_all_users(tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    users = db.query(User).filter(User.tenant_id == tenant.id).all()
    return users

@router.post('/', response_model=UserRead)
def create_user(body: UserCreate, tenant: Tenant = Depends(resolve_tenant), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role == 'owner':
        pass
    else:
        raise HTTPException(status_code=403, detail="Forbidden")
    print('create_user!!!')
    user = User(
        username=body.username,
        password_hash=body.password,
        role=body.role,
        belong=body.belong,
        tenant_id=tenant.id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.delete('/{user_id}')
def delete_user(user_id: str, tenant: Tenant = Depends(resolve_tenant), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role == 'owner':
        pass
    else:
        raise HTTPException(status_code=403, detail="Forbidden")
    user = db.query(User).filter(User.id == user_id, User.tenant_id == tenant.id).one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


@router.get('/{user_id}')
def get_user(user_id: str, tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.tenant_id == tenant.id).one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

