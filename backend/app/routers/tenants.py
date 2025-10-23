from sqlite3 import IntegrityError
from fastapi import APIRouter, HTTPException, Request
from app.schemas import TenantCreate, TenantRead, TenantOwnerCreate
from app.db import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import Tenant, User

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

    tenant = Tenant(slug=body.tenant_slug, school_name=body.tenant)
    db.add(tenant)
    db.commit()
    db.refresh(tenant)

    owner = User(
        username=body.owner,
        password_hash=body.password, #ハッシュ化はあとで
        email=body.email,
        role='owner',
        belong='owner',
        tenant_id=tenant.id
    )

    db.add(owner)
    db.commit()
    db.refresh(owner)
    return tenant.slug

@router.get('/{tenant_id}')
def get_tenant(tenant_id: str):
    return {"tenant_id": tenant_id }

@router.get('/')
def get_all_tenants(db: Session = Depends(get_db)):
    tenants = db.query(Tenant).all()
    return tenants

@router.delete('/{tenant_id}')
def delete_tenant(tenant_id: str, db: Session = Depends(get_db)):
    db.query(Tenant).filter(Tenant.id == tenant_id).delete()
    db.commit()
    return {"message": "Tenant deleted successfully"}