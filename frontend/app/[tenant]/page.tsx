import AnnouncementCard from "./_components/AnnouncementCard";

interface Announcement {
  id:number;
  name:string;
  desc:string;
}

export default async function announcements(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    const announcements: Announcement[] = [
      { id: 1, name: "Announcement 1", desc: "Announcement 1 description" },
      { id: 2, name: "Announcement 2", desc: "Announcement 2 description" },
      { id: 3, name: "Announcement 3", desc: "Announcement 3 description" },
      { id: 4, name: "Announcement 4", desc: "Announcement 4 description" },
    ];
    return (
      <div>
        <div className="text-8xl font-bold">
          <h1>{tenant} 文化祭</h1>
        </div>
        <div className="text-4xl font-bold">
          <h1>announcements </h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map(a => <AnnouncementCard key={a.id} {...a} />)}
        </div>
      </div>
    );
  }
  