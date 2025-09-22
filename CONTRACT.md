Base URL: https://bunkasai.app/api/v2

テナント作成
POST /tenants/register
GET /tenants/{tenant_id}

認証
POST /tenants/{tenant_id}/auth/login #JWTにtenant_id/roleを含める
POST /tenants/{tenant_id}/auth/{tenant_id}/refresh
POST /tenants/{tenant_id}/auth/{tenant_id}/logout

ユーザー
POST /tenants/{tenant_id}/users
GET /tenants/{tenant_id}/users/{user_id} 
DELETE /tenants/{tenant_id}/users/{user_id}

ブース
GET /tenants/{tenantsId}/booth　#ランダムソート
POST /tenants/{tenant_id}/booth
GET /tenants/{tenant_id}/booth/{booth_id}
DELETE /tenants/{tenant_id}/booth/{booth_id}
PUT /tenants/{tenant_id}/booth/{booth_id}

イベント
GET /tenants/{tenant_id}/events  #start_at:ascソート
POST /tenants/{tenant_id}/events
GET/tenants/{tenant_id}/events/{event_id}
DELETE /tenants/{tenant_id}/events/{event_id}
PUT /tenants/{tenant_id}/events/{event_id}


お知らせ
GET /tenants/{tenant_id}/announcements
POST /tenants/{tenant_id}/announcements
GET/tenants/{tenant_id}/announcements/{announcement_id}
DELETE /tenants/{tenant_id}/announcements/{announcement_id}

写真
GET /tenants/{tenant_id}/photos #published_at:descソート
POST /tenants/{tenant_id}/photos
GET/tenants/{tenant_id}/photos/{photo_id}　#いらないかも
DELETE /tenants/{tenant_id}/photos/{photo_id}



