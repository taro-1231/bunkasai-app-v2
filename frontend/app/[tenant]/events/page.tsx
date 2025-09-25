export default async function events(
  {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    return (
      <div>
        <h1 className="text-8xl font-bold">Events {tenant} </h1>

        
      
      </div>
    );
  }
  