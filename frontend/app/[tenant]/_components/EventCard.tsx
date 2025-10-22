export default function EventCard(
  { event_id, event_name, location, start_at, end_at, description, user_role }: { event_id : string,event_name: string; location: string; start_at: string; end_at: string; description: string , user_role:string}) {
    
    const start_date = new Date(start_at)
    start_at = start_date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    const end_date = new Date(end_at)
    end_at = end_date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-4 hover:shadow-md transition">
        <h3 className="text-lg font-semibold">{event_name}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-sm text-gray-600 mt-1">{location}</p>
        <p className="text-sm text-gray-600 mt-1">{start_at}</p>
        <p className="text-sm text-gray-600 mt-1">{end_at}</p>
        {user_role === "owner" ? (
          <button className="mt-3 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
            削除
          </button>
        ):(
          <div>ai</div>
          // <></>
        )}
      </div>
    );
  }