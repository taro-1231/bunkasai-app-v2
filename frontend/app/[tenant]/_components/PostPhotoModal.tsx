// 'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postPhotoAction } from "@/lib/modalAction/action";

export default function PostPhotoModal({ tenant }: { tenant: string }) {
  const [open, setOpen] = useState(false);
  type Role = "owner" | "vender" | "staff";
  const [loading, setLoading] = useState(false);


  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();                    // ← 重要
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const file = fd.get('file') as File | null;
      if (!file) throw new Error('ファイルを選択してください。');

      await postPhotoAction(tenant, file); // ← これは通常のAPI/Server関数呼び出し
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message ?? '投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  // async function onSubmit(formData: FormData) {
  //   setLoading(true);

  //   const res = await postPhotoAction(tenant, formData.get('file') as File);

  //   setOpen(false);

  //   router.refresh();
  //   setLoading(false)
  // }


  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border px-4 py-2 hover:bg-gray-50"
      >
        Post Photo
      </button>

      {open && (
        <div
          aria-modal
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => !loading && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Post Photo</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-1">
                ✕
              </button>
            </div>

            {/* <form action={onSubmit} className="space-y-4"> */}
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    {/* className="rounded-lg border px-4 py-2 hover:bg-gray-50" */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">画像ファイル</label>
                  <input type="file"  
                  name="file"
                  className="w-full rounded border px-3 py-2" />
                </div>              


              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded border px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled  = {loading}

                  className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
