bunkasai-app
文化祭の出店・スタッフ管理を行うためのWebアプリケーションです。  
FastAPI（バックエンド）と Next.js（フロントエンド）で構築されています。

URL
https://bunkasai-app-v2.vercel.app

機能
出店、イベント、アナウンス管理
スタッフアカウント（オーナー、スタッフ、出店者）管理
写真アップロード
ログイン認証
学校ごとの登録


使用技術と採用理由
Backend: python, FastAPI, SQLAlchemy, PostgreSQL
- FastAPIは
Frontend: TypeScript, Tailwind CSS, Next.js 
- FastAPIのOpenAPIから型を生成し、API契約の破綻をコンパイル時に検出
- WebSocket/SSEイベントを型で表現し、リアルタイムUIの安全性を高める
- 画像アップロードや通知配信など状態遷移が多い処理を型で堅牢化

Infra: Render/ Vercel






ローカル実行 (powershell)
git clone https://github.com/taro-1231/bunkasai-app-v2.git

cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload

cd frontend
npm run dev

