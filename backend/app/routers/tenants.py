from sqlite3 import IntegrityError
from fastapi import APIRouter, HTTPException, Request
from app.schemas import TenantCreate, TenantRead, TenantOwnerCreate
from app.db import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import Tenant, User
from .security import hash_password

router = APIRouter(prefix='/api/v2/tenants')

# URLのslugからtenantを取得する
def resolve_tenant(slug: str, db: Session = Depends(get_db)):
    # print(f"Looking for tenant with slug: {slug}")
    tenant = db.query(Tenant).filter(Tenant.slug == slug).one_or_none()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant


@router.post('/')#, response_model=TenantRead)
def register(body: TenantOwnerCreate, db: Session = Depends(get_db)):

    existing = db.query(Tenant).filter(Tenant.slug == body.tenant_slug).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail="このURLは既に使われています。"
        )
    print('tenant_name')
    print(body.tenant)
    tenant = Tenant(slug=body.tenant_slug, school_name=body.tenant)
    db.add(tenant)
    db.commit()
    db.refresh(tenant)

    owner = User(
        username=body.owner,
        password_hash= hash_password(body.password), 
        email=body.email,
        role='owner',
        belong='owner',
        tenant_id=tenant.id
    )

    db.add(owner)
    db.commit()
    db.refresh(owner)
    return tenant.slug

@router.get('/{tenant_slug}')
def get_tenant(tenant_slug: str,db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.slug == tenant_slug).first()
    # tenant.name
    print(tenant.school_name)
    print('aa')
    return tenant.school_name

@router.get('/')
def get_all_tenants(db: Session = Depends(get_db)):
    tenants = db.query(Tenant).all()
    return tenants

@router.delete('/{tenant_slug}')
def delete_tenant(tenant_slug: str, db: Session = Depends(get_db)):
    db.query(Tenant).filter(Tenant.slug == tenant_slug).delete()
    db.commit()
    return 