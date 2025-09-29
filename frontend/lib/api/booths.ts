'use server';
import { z } from "zod";
import { apiFetch } from "./client";
import { getTenantFromBrowser } from "./client";
import { cookies } from "next/headers";

// zodは型定義とバリデーションを行うためのライブラリ
const BoothSchema = z.object({
  id: z.string(),
  // tenant: z.string(),
  booth_name: z.string(),
  location: z.string(),
  belong: z.string(),
  summary: z.string(),
  description_md: z.string().optional(),
  open_from: z.coerce.date().optional(),
  open_to: z.coerce.date().optional(),
});
export type BoothModel = z.infer<typeof BoothSchema>;

export async function listBooths(tenant: string | null) {
  if (!tenant) 
    tenant = getTenantFromBrowser();

  const data = await apiFetch<unknown>(`/${tenant}/booths`);
  const arr = z.array(BoothSchema).parse(data);
  // 念のため交差テナント混入を検知 
  //一旦後で
  // if (arr.some(e => e.tenant !== tenant)) {
  //   throw new Error("Cross-tenant data detected");
  // }
  return arr;
}

export async function getBooth(tenant: string, id: string | number) {
  const data = await apiFetch<unknown>(`/${tenant}/booths/${id}`);
  const bo = BoothSchema.parse(data);
  // if (bo.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return bo;
}

const createBoothSchema = z.object({
  // id: z.string(),
  // tenant: z.string(),
  booth_name: z.string(),
  location: z.string(),
  belong: z.string(),
  summary: z.string(),
  description_md: z.string().optional(),
  open_from: z.coerce.date().optional(),
  open_to: z.coerce.date().optional(),
});
export type createBoothModel = z.infer<typeof createBoothSchema>;

export async function createBooth(
  tenant: string,
  payload: createBoothModel
) {
  try{
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      return null;
    }
    const data = await apiFetch<unknown>(`/${tenant}/booths`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    // if (!data.ok) {
    //   const text = await data.text();
    //   console.error("[booths upstream]", data.status, text); // ← ここに detail が出る
    //   throw new Error(text);
    // }
    console.log('data',data);
    // return data;
    const booth = createBoothSchema.parse(data);
    return booth;
  }catch(error){
    console.error('error',error);
    return null;

  }
}
