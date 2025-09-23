from fastapi import APIRouter, HTTPException
from app.db import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import Photo, Tenant, User
from app.routers.tenants import resolve_tenant
from app.schemas import PhotoCreate
from app.routers.auth import get_current_user

router = APIRouter(prefix='/api/v2/tenants/{slug}/photos')

@router.post('/')
def create_photo(body: PhotoCreate, tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    photo = Photo(
        image_url=body.image_url,
        tenant_id=tenant.id
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo

@router.get('/')
def get_all_photos(tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    photos = db.query(Photo).filter(Photo.tenant_id == tenant.id).all()
    return photos

@router.delete('/{photo_id}')
def delete_photo(photo_id: str, tenant: Tenant = Depends(resolve_tenant), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != 'staff':
        raise HTTPException(status_code=403, detail="Forbidden")
    photo = db.query(Photo).filter(Photo.id == photo_id, Photo.tenant_id == tenant.id).one_or_none()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    db.delete(photo)
    db.commit()
    return {"message": "Photo deleted successfully"}
