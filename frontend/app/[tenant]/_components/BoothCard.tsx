'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteBooth } from "@/lib/api/booths";

export default function BoothCard({booth_id, name, location, belong, summary, open_from, open_to, desc ,user_role,tenant}: 
  {booth_id:string, name: string; location: string; belong: string; summary: string; open_from: string; open_to: string; desc: string; user_role:string; tenant: string}) {
  
  const open_from_date = new Date(open_from)
  open_from = open_from_date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
  const open_to_date = new Date(open_to)
  open_to = open_to_date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })

  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  async function handleDelete(){
    try {
      setLoading(true);
      await deleteBooth(tenant, booth_id)
      startTransition(() => {
        router.refresh();
      });

      }catch (e:any) {
        alert(e.message ?? '削除に失敗しました');
      } finally {
        setLoading(false);
      }
    }
  

    
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-4 hover:shadow-md transition">
        <h3 className="text-lg font-semibold">店舗名： {name}</h3>
        <p className="text-sm text-gray-600 mt-1">場所： {location}</p>
        <p className="text-sm text-gray-600 mt-1">所属： {belong}</p>
        <p className="text-sm text-gray-600 mt-1">{summary}</p>
        {open_from !== '1970/1/1 9:00:00' && (
          <p className="text-sm text-gray-600 mt-1">開始時間： {open_from}</p>

        )}
        {open_to !== '1970/1/1 9:00:00' && (
          <p className="text-sm text-gray-600 mt-1">終了時間： {open_to}</p>

        )}
        {desc !== '' && (
          <p className="text-sm text-gray-600 mt-1">詳細： {desc}</p>

        )}
        
        {(user_role === "owner" || user_role === "vender") && (
          <button className="mt-3 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleDelete}
            disabled  = {loading || pending}
            aria-disabled={loading || pending}>
            削除
          </button>
        )}
      </div>
    );
  }

  async function safeText(res: Response) {
    try { return await res.text(); } catch { return ''; }
  }