import BoothCard from "../_components/BoothCard";
import { listBooths } from "@/lib/api/booths";
import { apime } from "@/lib/api/auth";



// interface Booth {
//   id:number;
//   name:string;
//   location:string;
//   belong:string;
//   summary:string;
//   open_from:string;
//   open_to:string;
//   desc:string;
// }

export default async function booths(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    const user = await apime(tenant);


    // このテナント名でboothを取得
    // const booths = await fetch(`/api/v2/tenants/${tenant}/booths`);
    // const boothsData: Booth[] = await booths.json();

    const booths = await listBooths(tenant);
  
    return (
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          出店一覧
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {booths.map(b => <BoothCard 
          key={b.id} 
          booth_id={b.id} 
          name={b.booth_name} 
          location={b.location} 
          belong={b.belong} 
          summary={b.summary} 
          open_from={b.open_from? new Date(b.open_from).toISOString() : ""} 
          open_to={b.open_to? new Date(b.open_to).toISOString() : ""} 
          desc={b.description_md ?? ""}
          user_role= {user ? user.role : ''}
          tenant = {tenant}
           />)}
        </div>
      </div>
    );
  }
  