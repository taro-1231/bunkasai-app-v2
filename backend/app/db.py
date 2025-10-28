from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from .config import DB_PATH, SQLALCHEMY_DATABASE_URL

# DB_PATH = os.getenv("FEST_DB_PATH", os.path.join(os.path.dirname(__file__), "fest.db"))
# SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# postgres用
SQLALCHEMY_DATABASE_URL = DB_PATH
SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
}
# engineはDBへの接続情報をもつオブジェクト
#SessionLocalはDBへの接続を実際に管理する
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    **SQLALCHEMY_ENGINE_OPTIONS
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Object-Relational MappingでclassとSQLのテーブルを紐づける
#BaseはORMの親　継承してclassにするとテーブル情報になる
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()