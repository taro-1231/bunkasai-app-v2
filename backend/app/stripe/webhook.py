import os
import stripe
from fastapi import FastAPI, Request, HTTPException, APIRouter
from app.config import WEBHOOK_SECRET
from app.db import get_db
from sqlalchemy.orm import Session as Se
from fastapi import Depends
from app.models import Tenant
from datetime import datetime, timezone, timedelta, time
from app.schemas import tenant_plan_type

router = APIRouter()

# 別のアプリのwebhookも来るかもだけど,metadataとかエンドポイントで識別できる

@router.post("/api/stripe/webhook")
async def stripe_webhook(request: Request, db: Se = Depends(get_db)):
    # print('OK')

    if not WEBHOOK_SECRET:
        # 署名検証ができないので明示的に落とす（Stripe 側でリトライされる）
        raise HTTPException(status_code=500, detail="STRIPE_WEBHOOK_SECRET が設定されていません")

    # raw body を取得（request.json()にしない）
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing Stripe-Signature header")

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=WEBHOOK_SECRET,
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")

    event_type = event["type"]
    
        # metadata={
        #     "tenantId": tenant_id,
        #     "days": str(days),
        #     "tier": plan_type,
        # },

    if event_type == "checkout.session.completed":

        # 今の時間取るだけ
        JST = timezone(timedelta(hours=9))
        now_jst = datetime.now(JST)

        # metadata取得
        session = event["data"]["object"]
        checkout_session_id = session["id"]
        metadata = session.get('metadata') or {}

        tenant_id_raw = metadata.get('tenantId')
        plan = metadata.get('tier')
        days_raw = metadata.get('days')

        if not tenant_id_raw or not plan or not days_raw:
        # 別アプリのwebhookや想定外のcheckoutでも 2xx 返しつつ無視、でもログは欲しい
            return {"received": True}

        try:
            tenant_id = str(tenant_id_raw)
            days = int(days_raw)
        except ValueError:
            return {"received": True}
        
        if days <= 0:
            return {"received": True}
        
        tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
        if not tenant:
            return {"received": True}
        
        if checkout_session_id == tenant.last_checkout_session_id:
            return {"received": True}

        start_date = now_jst.date()
        end_date = start_date + timedelta(days=days - 1)

        tenant.plan_type = tenant_plan_type(plan)
        tenant.valid_from = now_jst
        tenant.valid_until = datetime.combine(end_date, time(23, 59, 59), tzinfo=JST)
        tenant.last_checkout_session_id = checkout_session_id

        # print(now_jst)
        # print(datetime.combine(end_date, time(23, 59, 59), tzinfo=JST))

        db.commit()

        
    else:
        # 未対応イベント
        pass

    # Stripe には 2xx を返す
    return {"received": True}
