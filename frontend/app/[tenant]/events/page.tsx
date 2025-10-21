import { listEvents } from "@/lib/api/events";
import EventCard from "../_components/EventCard";

interface Event {
  id:string;
  event_name:string;
  location:string;
  start_at?:string;
  end_at?:string;
  description?:string;
}

export default async function events(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    // const events: Event[] = [
    //   { id: 1, name: "Event 1", desc: "Event 1 description" },
    //   { id: 2, name: "Event 2", desc: "Event 2 description" },
    //   { id: 3, name: "Event 3", desc: "Event 3 description" },
    //   { id: 4, name: "Event 4", desc: "Event 4 description" },
    // ];
    const events = await listEvents(tenant);
    return (
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          イベント一覧
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(e => 
          <EventCard 
          key={e.id} 
          event_name={e.event_name} 
          location={e.location} 
          start_at={e.start_at ? new Date(e.start_at).toISOString() : ""} 
          end_at={e.end_at ? new Date(e.end_at).toISOString() : ""} 
          description={e.description ?? ""} />)}
        </div>
      </div>
    );
  }
  