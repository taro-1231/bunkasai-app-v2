// events.ts テンプレ

// lib/api/events.ts
import { z } from "zod";
import { apiFetch } from "./client";

const EventSchema = z.object({
  id: z.union([z.string(), z.number()]),
  tenant: z.string(),
  title: z.string(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().optional(),
  venue: z.string().optional(),
  description: z.string().optional(),
  coverUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});
export type EventModel = z.infer<typeof EventSchema>;

export async function listEvents(tenant: string) {
  const data = await apiFetch<unknown>(`/${tenant}/events`);
  const arr = z.array(EventSchema).parse(data);
  // 念のため交差テナント混入を検知
  if (arr.some(e => e.tenant !== tenant)) {
    throw new Error("Cross-tenant data detected");
  }
  return arr;
}

export async function getEvent(tenant: string, id: string | number) {
  const data = await apiFetch<unknown>(`/${tenant}/events/${id}`);
  const ev = EventSchema.parse(data);
  if (ev.tenant !== tenant) throw new Error("Cross-tenant data detected");
  return ev;
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
  if (ev.tenant !== tenant) throw new Error("Cross-tenant data detected");
  return ev;
}
