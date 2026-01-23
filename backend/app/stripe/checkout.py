from fastapi import APIRouter, HTTPException, Depends
from app.db import get_db
from sqlalchemy.orm import Session
from app.models import Tenant, User
from app.routers.auth import get_current_user
from app.routers.tenants import resolve_tenant
from app.schemas import checkoutModel, Checkouturl
import stripe
from typing import Literal
from app.config import BASE_PATH

PRICE_PER_DAY = {
    "plus": 100,        # 1日100円
    "unlimited": 300,   # 1日300円
}
Plan = Literal["free", "plus", "unlimited"]

router = APIRouter(prefix='/api/v2/tenants/{slug}/checkout')

def calc_amount_jpy(days: int, plan: str):
    return PRICE_PER_DAY[plan] * days

def stripe_checkout(plan: Plan, days:int, amount: int, tenant_id: str):
    session = stripe.checkout.Session.create(
        mode= 'payment',
        line_items = [{
            "price_data": {
                "currency": "jpy",
                "product_data": {"name": f"{plan} ({days} days)"},
                "unit_amount": amount,
            },
            "quantity": 1,
        }],
        metadata={
            "tenantId": tenant_id,
            "days": str(days),
            "tier": plan,
        },
        success_url= BASE_PATH +"/billing/complete?session_id={CHECKOUT_SESSION_ID}",
        cancel_url=f"{BASE_PATH}/billing/cancel",
    )
    return Checkouturl(url=session.url)

@router.post('/')
def checkout(body: checkoutModel, tenant: Tenant = Depends(resolve_tenant), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role == 'owner' and user.tenant_id == tenant.id:
        pass
    else:
        # print('create_event!!!')
        raise HTTPException(status_code=403, detail="Forbidden")

    if body.plan == 'free':
        return ;

    amount = calc_amount_jpy(body.days, body.plan)
    # stripe処理
    url = stripe_checkout(body.plan, body.days, amount, tenant.id)
    return url


    # # webhook後 
    # tenant.plan = body.plan
    # db.commit()
    # db.refresh(tenant)
    # return tenant
    
