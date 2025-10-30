import os

# DB_PATH = os.getenv("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "fest.db"))

# db_env = os.getenv("DATABASE_PATH")
# if db_env:
#     DB_PATH = db_env
# else:
#     DB_PATH = os.path.join(os.path.dirname(__file__), "fest.db")


# SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

MEDIA_ROOT = os.getenv("MEDIA_ROOT", "./media")

ALLOWED_ORIGINS = [s for s in os.getenv("ALLOWED_ORIGINS", "").split(",") if s]

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")  # 本番は環境変数で上書き

