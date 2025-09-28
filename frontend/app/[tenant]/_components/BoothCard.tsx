export default function BoothCard({ name, location, belong, summary, open_from, open_to, desc }: { name: string; location: string; belong: string; summary: string; open_from: string; open_to: string; desc: string }) {
    
    
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-4 hover:shadow-md transition">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600 mt-1">{location}</p>
        <p className="text-sm text-gray-600 mt-1">{belong}</p>
        <p className="text-sm text-gray-600 mt-1">{summary}</p>
        <p className="text-sm text-gray-600 mt-1">{open_from}</p>
        <p className="text-sm text-gray-600 mt-1">{open_to}</p>
        <p className="text-sm text-gray-600 mt-1">{desc}</p>
        <button className="mt-3 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
          詳細を見る
        </button>
      </div>
    );
  }

