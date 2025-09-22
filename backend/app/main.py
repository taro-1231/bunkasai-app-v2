from fastapi import FastAPI, Request
from .routers import health, tenants, users, events, booths, auth
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from pathlib import Path
import re
from .db import Base, engine

app = FastAPI(title="bunkasai-app-API", version="0.1.0")
app.include_router(health.router)
app.include_router(tenants.router)
app.include_router(users.router)
app.include_router(events.router)
app.include_router(booths.router)
app.include_router(auth.router)

# URIのサブドメインをstate.tenantに入れるミドルウェア。なければdefaultとなる
# class TenantMiddleware(BaseHTTPMiddleware):
#     async def dispatch(self, request: Request, call_next):
#         host = request.headers.get("host", "")
#         hostname = host.split(":")[0]
#         m = re.match(r"^(?P<sub>[^.]+)\.(yourfest\.app|lvh\.me)$", hostname)
#         sub = m.group("sub") if m else None
#         tenant = sub or "default"
#         request.state.tenant = tenant
#         return await call_next(request)

# app.add_middleware(TenantMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://lvh.me:3000",
        "http://bunkasai.app:3000",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|192\.168\.[0-9]{1,3}\.[0-9]{1,3}|([a-zA-Z0-9-]+\.)?(yourfest\.app|lvh\.me))(\:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


BASE_DIR = Path(__file__).resolve().parent

