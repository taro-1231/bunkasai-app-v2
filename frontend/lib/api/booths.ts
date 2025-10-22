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
  open_from: z.coerce.date(),
  open_to: z.coerce.date(),
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

// export async function getBooth(tenant: string, id: string | number) {
//   const data = await apiFetch<unknown>(`/${tenant}/booths/${id}`);
//   const bo = BoothSchema.parse(data);
  // if (bo.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return bo;
// }

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
      throw new Error("認証トークンが見つかりません。ログインしてください。");
    }
    const data = await apiFetch<unknown>(`/${tenant}/booths`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const booth = createBoothSchema.parse(data);
    return booth;
  }catch(error){
    console.error('createBooth error:', error);
    throw error;
  }
}

export async function deleteBooth(
  tenant: string,
  booth_id : string,
  // payload: createBoothModel
): Promise<void> {
  try{
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      throw new Error("認証トークンが見つかりません。ログインしてください。");
    }
    const data = await apiFetch<unknown>(`/${tenant}/booths/${booth_id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    // const booth = createBoothSchema.parse(data);
    
  }catch(error){
    console.error('createBooth error:', error);
    throw error;
  }
}

