export default function BillingCancel() {
    return (
      <main style={{ padding: 24 }}>
        <h1>お支払いはキャンセルされました</h1>
        <p>まだ課金は発生していません。</p>
  
        <div style={{ marginTop: 16 }}>
          <a href="/pricing">プラン選択に戻る</a>
          {"  |  "}
          <a href="/settings/billing">請求設定に戻る</a>
        </div>
  
        <div style={{ marginTop: 16 }}>
          <a href="/pricing">もう一度決済をやり直す</a>
        </div>
      </main>
    );
  }
  