import AnnouncementCard from "./_components/AnnouncementCard";
import { listAnnouncements } from "@/lib/api/announcements";
import { apime, apigetTenant } from  "@/lib/api/auth";

interface Announcement {
  id:string;
  title:string;
  body:string;
}

export default async function announcements(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    const announcements = await listAnnouncements(tenant);
    const user = await apime(tenant);
    const school_name = await apigetTenant(tenant)


    return (
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">

            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gray-100 blur-2xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-gray-100 blur-2xl" />
    
            <div className="relative">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    {announcements.length} announcements
                  </div>
    
                  <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                    {school_name} <span className="text-gray-500">文化祭</span>
                  </h1>
    
                  <p className="mt-3 text-base sm:text-lg text-gray-600">
                    最新のお知らせをまとめてチェックできます。
                  </p>
                </div>
    
              </div>
            </div>
          </div>
    
          <div className="mt-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6">
            {announcements.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <p className="text-sm text-gray-600">お知らせはまだありません。</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {announcements.map((a: Announcement) => (
                  <div
                    key={a.id}
                    className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200" />
    
                    <AnnouncementCard
                      title={a.title}
                      body={a.body}
                      tenant={tenant}
                      user_role={user ? user.role : ""}
                      announcement_id={a.id}
                    />
    
                    <div className="h-1 w-full rounded-b-2xl bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
    
  }
  