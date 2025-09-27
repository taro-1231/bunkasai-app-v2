import { z } from "zod";
import { apiFetch } from "./client";
import { getTenantFromBrowser } from "./client";

// zodは型定義とバリデーションを行うためのライブラリ
const AnnouncementSchema = z.object({
  id: z.string(),
  // tenant: z.string(),
  title: z.string(),
  body: z.string(),
});
export type AnnouncementModel = z.infer<typeof AnnouncementSchema>;

export async function listAnnouncements(tenant: string | null) {
  if (!tenant) 
    tenant = getTenantFromBrowser();

  const data = await apiFetch<unknown>(`/${tenant}/announcements`);
  console.log(data);
  const arr = z.array(AnnouncementSchema).parse(data);
  // 念のため交差テナント混入を検知 
  //一旦後で
  // if (arr.some(e => e.tenant !== tenant)) {
  //   throw new Error("Cross-tenant data detected");
  // }
  console.log(arr);
  return arr;
}

export async function getAnnouncement(tenant: string, id: string | number) {
  const data = await apiFetch<unknown>(`/${tenant}/announcements/${id}`);
  const an = AnnouncementSchema.parse(data);
  // if (an.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return an;
}

export async function createAnnouncement(
  tenant: string,
  payload: Omit<AnnouncementModel, "id" | "tenant">
) {
  const data = await apiFetch<unknown>(`/${tenant}/announcements`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
const an = AnnouncementSchema.parse(data);
  // if (an.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return an;
}
