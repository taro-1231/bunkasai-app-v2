from fastapi import APIRouter, HTTPException, Request
from app.db import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import Booth, Tenant, User
from app.routers.auth import get_current_user
from app.routers.tenants import resolve_tenant
from app.schemas import BoothCreate


router = APIRouter(prefix='/api/v2/tenants/{slug}/booths')
# router = APIRouter(prefix='/api/v2/booths')

@router.get('/')
def get_all_booths(tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    booths = db.query(Booth).filter(Booth.tenant_id == tenant.id).all()
    return booths

@router.post('/')
def create_booth(body: BoothCreate, tenant: Tenant = Depends(resolve_tenant), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    print(body)

    if user.role == 'vendor' or user.role == 'owner':
        pass
    else:
        raise HTTPException(status_code=403, detail="Forbidden")
    booth = Booth(
        booth_name=body.booth_name,
        belong=body.belong,
        location=body.location,
        summary=body.summary,
        description_md=body.description_md,
        open_from=body.open_from,
        open_to=body.open_to,
        tenant_id=tenant.id
    )
    # print(booth)
    db.add(booth)
    db.commit()
    db.refresh(booth)
    return booth

@router.delete('/{booth_id}')
def delete_booth(booth_id: str, tenant: Tenant = Depends(resolve_tenant), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role == 'vendor' or user.role == 'owner':
        pass
    else:
        raise HTTPException(status_code=403, detail="Forbidden")
    booth = db.query(Booth).filter(Booth.id == booth_id, Booth.tenant_id == tenant.id).one_or_none()
    if not booth:
        raise HTTPException(status_code=404, detail="Booth not found")
    db.delete(booth)
    db.commit()
    return {"message": "Booth deleted successfully"}

@router.get('/{booth_id}')
def get_booth(booth_id: str, tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    booth = db.query(Booth).filter(Booth.id == booth_id, Booth.tenant_id == tenant.id).one_or_none()
    if not booth:
        raise HTTPException(status_code=404, detail="Booth not found")
    return booth


