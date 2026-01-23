import { listEvents } from "@/lib/api/events";
import EventCard from "../_components/EventCard";
import { apime } from "@/lib/api/auth";


// interface Event {
//   id:string;
//   event_name:string;
//   location:string;
//   start_at?:string;
//   end_at?:string;
//   description?:string;
// }

export default async function events(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    const events = await listEvents(tenant);
    const user = await apime(tenant);

    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="mb-6 mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                {events.length} events
              </div>
    
              <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                イベント一覧
              </h1>
    
              <p className="mt-2 text-sm text-gray-600">
                開催場所や時間をチェックして、気になるイベントを見つけよう。
              </p>
            </div>
    
          </div>
        </div>
    
        <div className="rounded-2xl bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <div
                key={e.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200" />
    
                <EventCard
                  event_id={e.id}
                  event_name={e.event_name}
                  location={e.location}
                  start_at={e.start_at ? new Date(e.start_at).toISOString() : ""}
                  end_at={e.end_at ? new Date(e.end_at).toISOString() : ""}
                  description={e.description ?? ""}
                  user_role={user ? user.role : ""}
                  tenant={tenant}
                />
    
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gray-100 blur-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
    
  }
  