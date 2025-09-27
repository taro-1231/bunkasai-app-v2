import { z } from "zod";
import { apiFetch } from "./client";
import { getTenantFromBrowser } from "./client";

// zodは型定義とバリデーションを行うためのライブラリ
const UserSchema = z.object({
  id: z.string(),
  // tenant: z.string(),
  username: z.string(),
  email: z.string().optional(),
  role: z.string(),
  belong: z.string().optional(),
  password_hash: z.string(),
});
export type UserModel = z.infer<typeof UserSchema>;

export async function listUsers(tenant: string | null) {
  if (!tenant) 
    tenant = getTenantFromBrowser();

  const data = await apiFetch<unknown>(`/${tenant}/users`);
  console.log(data);
  const arr = z.array(UserSchema).parse(data);
  // 念のため交差テナント混入を検知 
  //一旦後で
  // if (arr.some(e => e.tenant !== tenant)) {
  //   throw new Error("Cross-tenant data detected");
  // }
  console.log(arr);
  return arr;
}

export async function getUser(tenant: string, id: string | number) {
  const data = await apiFetch<unknown>(`/${tenant}/users/${id}`);
  const us = UserSchema.parse(data);
// if (bo.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return bo;
}

export async function createUser(
  tenant: string,
  payload: Omit<UserModel, "id" | "tenant">
) {
  const data = await apiFetch<unknown>(`/${tenant}/users`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const us = UserSchema.parse(data);
  // if (bo.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return bo;
}
