export default async function login(
    {params}: {params: Promise<{tenant: string}>}) {
      const { tenant }= await params;
      return (
        <div>
          <h1 className="text-8xl font-bold">login {tenant} </h1>
  
          
        
        </div>
      );
    }
    