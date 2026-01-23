import BoothCard from "../_components/BoothCard";
import { listBooths } from "@/lib/api/booths";
import { apime } from "@/lib/api/auth";


export default async function booths(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    const user = await apime(tenant);


    // このテナント名でboothを取得
    // const booths = await fetch(`/api/v2/tenants/${tenant}/booths`);
    // const boothsData: Booth[] = await booths.json();

    const booths = await listBooths(tenant);
  
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="mb-6 mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {booths.length} booths
              </div>
    
              <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                出店一覧
              </h1>
    
              <p className="mt-2 text-sm text-gray-600">
                場所や団体名で探したり、気になる出店の詳細をチェックできます。
              </p>
            </div>
    
          </div>
        </div>
    
        <div className="rounded-2xl bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {booths.map((b) => (
              <div
                key={b.id}
                className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <BoothCard
                  booth_id={b.id}
                  name={b.booth_name}
                  location={b.location}
                  belong={b.belong}
                  summary={b.summary}
                  open_from={b.open_from ? new Date(b.open_from).toISOString() : ""}
                  open_to={b.open_to ? new Date(b.open_to).toISOString() : ""}
                  desc={b.description_md ?? ""}
                  user_role={user ? user.role : ""}
                  tenant={tenant}
                />
    
                <div className="h-1 w-full rounded-b-2xl bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
    
  }
  