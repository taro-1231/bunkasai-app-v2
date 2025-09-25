import BoothCard from "../_components/BoothCard";

interface Booth {
  id:number;
  name:string;
  desc:string;
}

export default async function booths(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;

    // このテナント名でboothを取得
    // const booths = await fetch(`/api/v2/tenants/${tenant}/booths`);
    // const boothsData: Booth[] = await booths.json();

    const booths: Booth[] = [
      { id: 1, name: "Booth 1", desc: "Booth 1 description" },
      { id: 2, name: "Booth 2", desc: "Booth 2 description" },
      { id: 3, name: "Booth 3", desc: "Booth 3 description" },
      { id: 4, name: "Booth 4", desc: "Booth 4 description" },
    ];
    return (
      <div>
        <div className="text-4xl font-bold">
          <h1>booths </h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {booths.map(b => <BoothCard key={b.id} {...b} />)}
        </div>
      </div>
    );
  }
  