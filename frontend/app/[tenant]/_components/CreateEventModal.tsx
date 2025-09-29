'use client';

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { createEventAction } from "@/lib/modalAction/action";

export default function CreateEventModal({ tenant }: { tenant: string }) {
  const [open, setOpen] = useState(false);
  type Role = "owner" | "vender" | "staff";
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);
//   const router = useRouter();

  async function onSubmit(formData: FormData) {
    const res = await createEventAction(tenant, formData);
    // console.log('res',res);
    setOpen(false);
    //     const res = await createUserAction();
//     console.log('res',res);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border px-4 py-2 hover:bg-gray-50"
      >
        + Create Event
      </button>

      {open && (
        <div
          aria-modal
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Event</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-1">
                ✕
              </button>
            </div>

            <form action={onSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm">Event Name</label>
                <input name="event_name" required className="w-full rounded border px-3 py-2" />
              </div>

              <div>
                <label className="mb-1 block text-sm">Location</label>
                <input type="text" name="location" required className="w-full rounded border px-3 py-2" />
              </div>

              <div>
                <label className="mb-1 block text-sm">Start at</label>
                <input type="text" name="start_at"  className="w-full rounded border px-3 py-2" />
              </div>

              <div>
                <label className="mb-1 block text-sm">End at</label>
                <input type="text" name="end_at"  className="w-full rounded border px-3 py-2" />
              </div>

              <div>
                <label className="mb-1 block text-sm">Description</label>
                <input type="text" name="description"  className="w-full rounded border px-3 py-2" />
              </div>

              {/* {err && <p className="text-sm text-red-600">{err}</p>} */}

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
                //   type="button"
                //   onClick={() => console.log('submit button clicked')}
                  className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
