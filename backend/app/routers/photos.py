from fastapi import APIRouter, HTTPException, Request

router = APIRouter(prefix='/api/v2/photos')

@router.get('/')
def register(request: Request):
    return {"message": "Tenant registered"}
