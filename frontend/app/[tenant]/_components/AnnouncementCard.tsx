'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAnnouncement } from "@/lib/api/announcements";


export default function AnnouncementCard({ title, body, announcement_id, tenant, user_role }: { title: string; body: string; announcement_id:string, tenant:string, user_role:string }) {
    
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  async function handleDelete(){
    try {
      setLoading(true);
      await deleteAnnouncement(tenant, announcement_id)
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
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{body}</p>

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