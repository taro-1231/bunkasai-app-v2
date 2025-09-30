from fastapi import APIRouter, HTTPException, File, UploadFile
from app.db import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models import Photo, Tenant, User
from app.routers.tenants import resolve_tenant
from app.schemas import PhotoCreate
from app.routers.auth import get_current_user
import os
from pathlib import Path
from typing import Optional
from uuid import UUID
from fastapi.responses import FileResponse
import mimetypes
from typing import Literal
from tempfile import SpooledTemporaryFile
from datetime import datetime, timezone
import zipfile
from fastapi.responses import StreamingResponse
from fastapi import Request
from urllib.parse import urljoin
from app.config import MEDIA_ROOT



router = APIRouter(prefix='/api/v2/tenants/{slug}/photos')

# MEDIA_ROOT = Path(os.getenv("MEDIA_ROOT", "./media")).resolve()

async def save_upload(file: UploadFile, dest_path: str) -> None:
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(dest_path, "wb") as out:
        while True:
            chunk = await file.read(1024 * 1024)  # 1MBずつ
            if not chunk:
                break
            out.write(chunk)
    await file.close()


def get_media_src(request: Request, stored_path: str | None) -> str | None:
    if not stored_path:
        return None

    p = stored_path.strip()
    if p.startswith("http://") or p.startswith("https://"):
        return p

    base = str(request.base_url)
    # print('base', base)

    if p.startswith("/media/"):
        return urljoin(base, f"backend{p}")  # => http://host/backend/media/xxx.jpg
    else:
        return urljoin(base, f"backend/media/{p.lstrip('/')}")


@router.post('/')
async def create_photo(file: UploadFile = File(...), tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    await save_upload(file, MEDIA_ROOT / file.filename)
    photo = Photo(
        image_root=f"/media/{file.filename}",
        tenant_id=tenant.id,
        ext=file.filename.split(".")[-1]
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


@router.get('/')
def get_all_photos(request: Request, tenant: Tenant = Depends(resolve_tenant), db: Session = Depends(get_db)):
    q = db.query(Photo).filter(Photo.tenant_id == tenant.id)
    total = q.count()
    items = (q.order_by(Photo.published_at.desc()).all())
    return {
        'items': [
            {
                'id': item.id,
                'src': get_media_src(request, item.image_root),
                'published_at': item.published_at,
            } for item in items
        ], 
        'total': total,
    }



#     return [build_urls(photo) for photo in photos]

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







