'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteEvent } from "@/lib/api/events";


export default function EventCard(
  { event_id, event_name, location, start_at, end_at, description, user_role, tenant }: 
  { event_id : string; event_name: string; location: string; start_at: string; end_at: string; description: string ; user_role:string; tenant:string}) {
    
    const start_date = new Date(start_at)
    start_at = start_date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    const end_date = new Date(end_at)
    end_at = end_date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })

    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
  
    async function handleDelete(){
      try {
        setLoading(true);
        await deleteEvent(tenant, event_id)
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
        <h3 className="text-lg font-semibold">イベント名： {event_name}</h3>
        <p className="text-sm text-gray-600 mt-1">詳細： {description}</p>
        <p className="text-sm text-gray-600 mt-1">場所： {location}</p>
        {start_at !== '1970/1/1 9:00:00' && (
          <p className="text-sm text-gray-600 mt-1">開始時間： {start_at}</p>

        )}
        {end_at !== '1970/1/1 9:00:00' && (
          <p className="text-sm text-gray-600 mt-1">終了時間： {end_at}</p>

        )}

        {/* <p className="text-sm text-gray-600 mt-1">{start_at}</p>
        <p className="text-sm text-gray-600 mt-1">{end_at}</p> */}
        {(user_role === "owner" || user_role === "staff") && (
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