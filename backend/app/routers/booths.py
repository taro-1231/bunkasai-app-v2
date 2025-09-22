from fastapi import APIRouter, HTTPException, Request
from app.db import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import Booth, Tenant
from app.routers.tenants import resolve_tenant
# from app.schemas import 


router = APIRouter(prefix='/api/v2/tenants/{slug}/booths')
# router = APIRouter(prefix='/api/v2/booths')

@router.get('/')
def get_all_booths(tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    return {"message": "Booths get successfully"}

@router.post('/')
def create_booth(tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    return {"message": "Booth created successfully"}

@router.delete('/{booth_id}')
def delete_booth(booth_id: str, tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    return {"message": "Booth deleted successfully"}

@router.get('/{booth_id}')
def get_booth(booth_id: str, tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    return {"message": "Booth get successfully"}


