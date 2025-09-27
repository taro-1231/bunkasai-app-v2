from fastapi import APIRouter, HTTPException, Request
from app.db import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import Announcement, Tenant, User
from app.routers.auth import get_current_user
from app.routers.tenants import resolve_tenant
from app.schemas import AnnouncementCreate


router = APIRouter(prefix='/api/v2/tenants/{slug}/announcements')

@router.get('/')
def get_all_announcements(tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    announcements = db.query(Announcement).filter(Announcement.tenant_id == tenant.id).all()
    return announcements

@router.post('/')
def create_announcement(body: AnnouncementCreate, tenant: Tenant = Depends(resolve_tenant), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != 'staff' or user.role != 'owner':
        raise HTTPException(status_code=403, detail="Forbidden")
    announcement = Announcement(
        title=body.title,
        body=body.body,
        tenant_id=tenant.id
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement

@router.delete('/{announcement_id}')
def delete_announcement(announcement_id: str, tenant: Tenant = Depends(resolve_tenant), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != 'staff' or user.role != 'owner':
        raise HTTPException(status_code=403, detail="Forbidden")
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id, Announcement.tenant_id == tenant.id).one_or_none()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    db.delete(announcement)
    db.commit()
    return {"message": "Announcement deleted successfully"}

@router.get('/{announcement_id}')
def get_announcement(announcement_id: str, tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id, Announcement.tenant_id == tenant.id).one_or_none()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return announcement

