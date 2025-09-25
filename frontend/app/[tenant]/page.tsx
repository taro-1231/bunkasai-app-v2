export default async function Home(
    {params}: {params: Promise<{tenant: string}>}) {
    const { tenant }= await params;
    
    return (

      // <div className="relative z-10 text-center text-white px-4 flex items-center justify-center h-full">
      //     <div className="transform translate-y-16">
      //       <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 tracking-tight">
      //         ぶんかさい
      //       </h1>
      //       <div className="text-lg md:text-2xl lg:text-3xl font-light opacity-90">
      //         2024年度
      //       </div>
      //     </div>

      //     <div>
      //         <h1>{tenant}</h1>
      //     </div>
      // </div>

      // <div className="relative z-10 text-center px-4 flex items-center justify-center h-full">
      <div>
          
        <div className="text-8xl font-bold">
          <h1>{tenant} 文化祭</h1>
        </div>
          <div>
            アナウンス１
          </div>
          <div>
            アナウンス２
          </div>

      </div>
    );
  }
