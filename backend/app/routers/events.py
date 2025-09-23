from fastapi import APIRouter, HTTPException, Request
from app.db import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import Event, Tenant, User
from app.routers.auth import get_current_user
from app.routers.tenants import resolve_tenant
from app.schemas import EventCreate


router = APIRouter(prefix='/api/v2/tenants/{slug}/events')
# router = APIRouter(prefix='/api/v2/events')

@router.get('/')
def get_all_events(tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    events = db.query(Event).filter(Event.tenant_id == tenant.id).all()
    return events

@router.post('/')
def create_event(body: EventCreate, tenant: Tenant = Depends(resolve_tenant), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != 'staff':
        raise HTTPException(status_code=403, detail="Forbidden")
    event = Event(
        event_name=body.event_name,
        location=body.location,
        start_at=body.start_at,
        end_at=body.end_at,
        description=body.description,
        tenant_id=tenant.id
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.delete('/{event_id}')
def delete_event(event_id: str, tenant: Tenant = Depends(resolve_tenant), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != 'staff':
        raise HTTPException(status_code=403, detail="Forbidden")
    event = db.query(Event).filter(Event.id == event_id, Event.tenant_id == tenant.id).one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}

@router.get('/{event_id}')
def get_event(event_id: str, tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id, Event.tenant_id == tenant.id).one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

