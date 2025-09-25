import "../globals.css";
import Navigation from "@/app/[tenant]/_components/Navigation";

export default async function TenantLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: Promise<{ tenant: string }>;
  }) {
    const { tenant } = await params;        // v15: await 必須
    // 例: サーバーでテナント情報をfetch（RSCなのでOK）
    // const info = await fetch(`${API}/tenants/${tenant}`, { cache: "no-store" }).then(r => r.json());
  
    return (
      <section>
        <Navigation tenant={tenant} />
        {children}
      </section>
    );
  }
  