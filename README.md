git clone https://github.com/taro-1231/bunkasai-app-v2.git

bunkasai-app-v2/

python -m venv venv

venv\Scripts\Activate.ps1

pip install -r requirements.txt

uvicorn backend.app.main:app --reload

