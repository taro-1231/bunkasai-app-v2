import EventCard from "../_components/EventCard";

interface Event {
  id:number;
  name:string;
  desc:string;
}

export default async function events(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    const events: Event[] = [
      { id: 1, name: "Event 1", desc: "Event 1 description" },
      { id: 2, name: "Event 2", desc: "Event 2 description" },
      { id: 3, name: "Event 3", desc: "Event 3 description" },
      { id: 4, name: "Event 4", desc: "Event 4 description" },
    ];
    return (
      <div>
        <div className="text-4xl font-bold">
          <h1>events </h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(e => <EventCard key={e.id} {...e} />)}
        </div>
      </div>
    );
  }
  