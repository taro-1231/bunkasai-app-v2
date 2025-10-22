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
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          イベント一覧
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(e => 
          <EventCard 
          key={e.id} 
          event_id = {e.id}
          event_name={e.event_name} 
          location={e.location} 
          start_at={e.start_at ? new Date(e.start_at).toISOString() : ""} 
          end_at={e.end_at ? new Date(e.end_at).toISOString() : ""} 
          description={e.description ?? ""} 
          user_role= {user ? user.role : ''}
          />)}
          
        </div>
      </div>
    );
  }
  