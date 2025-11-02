# bunkasai-app
文化祭の出店・スタッフ管理を行うためのWebアプリケーションです。  
FastAPI（バックエンド）と Next.js（フロントエンド）で構築されています。

URL: https://bunkasai-app-v2.vercel.app  


## 機能
- 出店、イベント、アナウンス管理
- スタッフアカウント（オーナー、スタッフ、出店者）管理
- 写真アップロード
-  ログイン認証
-学校ごとの登録


## 使用技術と採用理由  
### Backend: python, FastAPI, SQLAlchemy, PostgreSQL
- FastAPIは高速で軽量なpythonフレームワーク
- 標準非同期、PydanticでAPI利用しやすい
### Frontend: TypeScript, Tailwind CSS, Next.js   
- 型定義で通信の失敗を防げるなど、リアルタイムでの通信をしやすい
- 画像アップロード中の状態遷移などを型で守れる
### Infra: Render/ Vercel  



## ローカル実行(powershell)
```powershell
git clone https://github.com/taro-1231/bunkasai-app-v2.git

cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload

cd frontend
npm run dev

