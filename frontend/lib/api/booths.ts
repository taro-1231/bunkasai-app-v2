import { z } from "zod";
import { apiFetch } from "./client";
import { getTenantFromBrowser } from "./client";

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
  console.log(data);
  const arr = z.array(BoothSchema).parse(data);
  // 念のため交差テナント混入を検知 
  //一旦後で
  // if (arr.some(e => e.tenant !== tenant)) {
  //   throw new Error("Cross-tenant data detected");
  // }
  console.log(arr);
  return arr;
}

export async function getBooth(tenant: string, id: string | number) {
  const data = await apiFetch<unknown>(`/${tenant}/booths/${id}`);
  const bo = BoothSchema.parse(data);
  // if (bo.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return bo;
}

export async function createBooth(
  tenant: string,
  payload: Omit<BoothModel, "id" | "tenant">
) {
  const data = await apiFetch<unknown>(`/${tenant}/booths`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const bo = BoothSchema.parse(data);
  // if (bo.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return bo;
}
