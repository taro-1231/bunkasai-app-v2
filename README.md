git clone https://github.com/taro-1231/bunkasai-app-v2.git

cd bunkasai-app-v2/

python -m venv venv

venv\Scripts\Activate.ps1

pip install -r requirements.txt

cd backend

uvicorn app.main:app --reload

