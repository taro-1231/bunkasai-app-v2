import AnnouncementCard from "./_components/AnnouncementCard";
import { listAnnouncements } from "@/lib/api/announcements";

interface Announcement {
  id:string;
  title:string;
  body:string;
}

export default async function announcements(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    // const announcements: Announcement
    const announcements = await listAnnouncements(tenant);
    return (
      <div>
        <div className="text-8xl font-bold">
          <h1>{tenant} 文化祭</h1>
        </div>
        <div className="text-4xl font-bold">
          <h1>announcements </h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((a: Announcement) => <AnnouncementCard key={a.id} title={a.title} body={a.body} />)}
        </div>
      </div>
    );
  }
  