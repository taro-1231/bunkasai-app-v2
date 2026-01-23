import "../globals.css";
import Navigation from "@/app/[tenant]/_components/Navigation";

export default async function TenantLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: Promise<{ tenant: string }>;
  }) {
    const { tenant } = await params;   
  
    return (
      <section>
        <Navigation tenant={tenant} />
        {children}
      </section>
    );
  }
  