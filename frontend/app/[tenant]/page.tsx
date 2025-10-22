import AnnouncementCard from "./_components/AnnouncementCard";
import { listAnnouncements } from "@/lib/api/announcements";
import { apime } from  "@/lib/api/auth";

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
    const user = await apime(tenant);


    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900">
              {tenant} 文化祭
            </h1>
            <p className="mt-4 text-lg text-gray-600">最新のお知らせ一覧</p>
          </div>
        </div>
        {/* <div className="text-4xl font-bold">
          <h1>announcements </h1>
        </div> */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((a: Announcement) => 
            <AnnouncementCard 
            key={a.id} 
            title={a.title} 
            body={a.body} 
            tenant = {tenant}
            user_role= {user ? user.role : ''} 
            announcement_id={a.id}/>)}
        </div>
      </div>
    );
  }
  