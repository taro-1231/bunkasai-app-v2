from fastapi import APIRouter, HTTPException, Request
from app.db import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import Event
# from app.schemas import 


router = APIRouter(prefix='/api/v2/tenants/{slug}/events')
# router = APIRouter(prefix='/api/v2/events')

@router.get('/')
def get_all_events(db: Session = Depends(get_db)):
    return {"message": "Events get successfully"}

@router.post('/')
def create_event(db: Session = Depends(get_db)):
    return {"message": "Event created successfully"}

@router.delete('/{event_id}')
def delete_event(event_id: str, db: Session = Depends(get_db)):
    return {"message": "Event deleted successfully"}

@router.get('/{event_id}')
def get_event(event_id: str, db: Session = Depends(get_db)):
    return {"message": "Event get successfully"}

