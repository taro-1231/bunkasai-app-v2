export default async function photos(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    return (
      <div>
        <h1>Photos {tenant}</h1>
      </div>
    );  
  }
  