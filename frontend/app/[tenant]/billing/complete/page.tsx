"use server";

import Link from "next/link";
import { apime } from "@/lib/api/auth";


// eslint-disable-next-line @next/next/no-async-client-component
export default async function BillingComplete(
    {params}: {params: Promise<{tenant: string}>}){
      const { tenant }= await params;
//   const [bookUrl, setBookUrl] = useState(null);

//   const searchParams = useSearchParams();
//   const sessionId = searchParams.get("session_id");


  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          ご登録いただきありがとうございます
        </h1>
        <p className="text-center text-gray-600">
          
        </p>
        <div className="mt-6 text-center">
          <Link
            href={`/${tenant}/maintenance`}
            className="text-indigo-600 hover:text-indigo-800 transition duration-300"
          >
            管理画面に戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

