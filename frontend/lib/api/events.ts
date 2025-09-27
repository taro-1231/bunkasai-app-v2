import { z } from "zod";
import { apiFetch } from "./client";
import { getTenantFromBrowser } from "./client";

// zodは型定義とバリデーションを行うためのライブラリ
const EventSchema = z.object({
  id: z.string(),
  // tenant: z.string(),
  event_name: z.string(),
  location: z.string(),
  start_at: z.coerce.date().optional(),
  end_at: z.coerce.date().optional(),
  description: z.string().optional(),
});
export type EventModel = z.infer<typeof EventSchema>;

export async function listEvents(tenant: string | null) {
  if (!tenant) 
    tenant = getTenantFromBrowser();

  const data = await apiFetch<unknown>(`/${tenant}/events`);
  console.log(data);
  const arr = z.array(EventSchema).parse(data);
  // 念のため交差テナント混入を検知 
  //一旦後で
  // if (arr.some(e => e.tenant !== tenant)) {
  //   throw new Error("Cross-tenant data detected");
  // }
  console.log(arr);
  return arr;
}

export async function getEvent(tenant: string, id: string | number) {
  const data = await apiFetch<unknown>(`/${tenant}/events/${id}`);
  const ev = EventSchema.parse(data);
  // if (ev.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return ev;
}

export async function createEvent(
  tenant: string,
  payload: Omit<EventModel, "id" | "tenant">
) {
  const data = await apiFetch<unknown>(`/${tenant}/events`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const ev = EventSchema.parse(data);
  // if (ev.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return ev;
}
