from uuid import uuid4
from .db import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import func
from sqlalchemy import Column, String, Text, DateTime, Boolean, ForeignKey
from datetime import datetime, timezone

def uuid_str() -> str:
    return str(uuid4())

# 検索はslugからidを取得してidを使用する
class Tenant(Base):
    __tablename__ = "tenants"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    school_name: Mapped[str] = mapped_column(String)
    slug: Mapped[str] = mapped_column(String, unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    tenant_id: Mapped[str] = mapped_column(ForeignKey('tenants.id',ondelete='CASCADE'), index=True)
    username: Mapped[str] = mapped_column(String)
    email: Mapped[str | None] = mapped_column(String, nullable=True)
    role: Mapped[str] = mapped_column(String)  # owner/staff/vendor
    belong: Mapped[str | None] = mapped_column(String, nullable=True)  # class/club/team
    password_hash: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class Booth(Base):
    __tablename__ = "booths"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    tenant_id: Mapped[str] = mapped_column(ForeignKey('tenants.id',ondelete='CASCADE'), index=True)
    booth_name: Mapped[str] = mapped_column(String)
    belong: Mapped[str] = mapped_column(String)
    location: Mapped[str] = mapped_column(String)
    summary: Mapped[str] = mapped_column(Text)
    # category: Mapped[str | None] = mapped_column(String, nullable=True)
    # image_url: Mapped[str | None] = mapped_column(String, nullable=True)
    open_from: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    open_to: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    description_md: Mapped[str | None] = mapped_column(Text, nullable=True)

class Event(Base):
    __tablename__ = "events"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    tenant_id: Mapped[str] = mapped_column(ForeignKey('tenants.id',ondelete='CASCADE'), index=True)
    event_name: Mapped[str] = mapped_column(String)
    location: Mapped[str] = mapped_column(String)
    start_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    end_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

class Announcement(Base):
    __tablename__ = "announcements"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    tenant_id: Mapped[str] = mapped_column(ForeignKey('tenants.id',ondelete='CASCADE'), index=True)
    title: Mapped[str] = mapped_column(String)
    body: Mapped[str] = mapped_column(Text)
    # pinned: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),nullable=False)

class Photo(Base):
    __tablename__ = "photos"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    tenant_id: Mapped[str] = mapped_column(ForeignKey('tenants.id',ondelete='CASCADE'), index=True)
    image_root: Mapped[str] = mapped_column(String)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),nullable=False)
    ext: Mapped[str] = mapped_column(String)
