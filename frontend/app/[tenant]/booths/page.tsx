export default async function booths(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    return (
      <div>
        <h1>Booths {tenant}</h1>
      </div>
    );
  }
  