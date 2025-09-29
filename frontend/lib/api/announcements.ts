'use server';
import { z } from "zod";
import { apiFetch } from "./client";
import { getTenantFromBrowser } from "./client";
import { cookies } from "next/headers";

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
  // console.log(data);
  const arr = z.array(AnnouncementSchema).parse(data);
  // 念のため交差テナント混入を検知 
  //一旦後で
  // if (arr.some(e => e.tenant !== tenant)) {
  //   throw new Error("Cross-tenant data detected");
  // }
  // console.log(arr);
  return arr;
}

export async function getAnnouncement(tenant: string, id: string | number) {
  const data = await apiFetch<unknown>(`/${tenant}/announcements/${id}`);
  const an = AnnouncementSchema.parse(data);
  // if (an.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return an;
}

const createAnnouncementSchema = z.object({
  // id: z.string(),
  // tenant: z.string(),
  title: z.string(),
  body: z.string(),
});
export type createAnnouncementModel = z.infer<typeof createAnnouncementSchema>;

export async function createAnnouncement(
  tenant: string,
  payload: createAnnouncementModel
) {
  try{
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      return null;
    }
    const data = await apiFetch(`/${tenant}/announcements`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
    return data;
  }catch(error){
    console.error('error',error);
    return null;
  }
}
