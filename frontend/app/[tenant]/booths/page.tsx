import BoothCard from "../_components/BoothCard";
import { listBooths } from "@/lib/api/booths";


interface Booth {
  id:number;
  name:string;
  location:string;
  belong:string;
  summary:string;
  open_from:string;
  open_to:string;
  desc:string;
}

export default async function booths(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;

    // このテナント名でboothを取得
    // const booths = await fetch(`/api/v2/tenants/${tenant}/booths`);
    // const boothsData: Booth[] = await booths.json();

    // const booths: Booth[] = [
    //   { id: 1, name: "Booth 1",location: "Booth 1 location",belong: "Booth 1 belong",summary: "Booth 1 summary",open_from: "Booth 1 open_from",open_to: "Booth 1 open_to",desc: "Booth 1 description" },
    //   { id: 2, name: "Booth 2",location: "Booth 2 location",belong: "Booth 2 belong",summary: "Booth 2 summary",open_from: "Booth 2 open_from",open_to: "Booth 2 open_to",desc: "Booth 2 description" },
    //   { id: 3, name: "Booth 3",location: "Booth 3 location",belong: "Booth 3 belong",summary: "Booth 3 summary",open_from: "Booth 3 open_from",open_to: "Booth 3 open_to",desc: "Booth 3 description" },
    //   { id: 4, name: "Booth 4",location: "Booth 4 location",belong: "Booth 4 belong",summary: "Booth 4 summary",open_from: "Booth 4 open_from",open_to: "Booth 4 open_to",desc: "Booth 4 description" },
    // ];
    const booths = await listBooths(tenant);
  
    return (
      <div>
        <div className="text-4xl font-bold">
          <h1>booths </h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {booths.map(b => <BoothCard key={b.id} name={b.booth_name} location={b.location} belong={b.belong} summary={b.summary} open_from={b.open_from?.toISOString() ?? ""} open_to={b.open_to?.toISOString() ?? ""} desc={b.description_md ?? ""} />)}
        </div>
      </div>
    );
  }
  