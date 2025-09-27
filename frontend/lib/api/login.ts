import { z } from "zod";
import { apiFetch } from "./client";
import { getTenantFromBrowser } from "./client";


const LoginSchema = z.object({
//   id: z.string(),
  username: z.string(),
  password: z.string(),
});

const LoginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
});

export type LoginModel = z.infer<typeof LoginSchema>;
export type LoginResponseModel = z.infer<typeof LoginResponseSchema>;

export async function apilogin(tenant: string | null, payload: LoginModel): Promise<LoginResponseModel> {
  if (!tenant) 
    tenant = getTenantFromBrowser();
  console.log('tenant',tenant);
  console.log('payload',JSON.stringify(payload));
  const data = await apiFetch<unknown>(`/${tenant}/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  console.log('data',data);
  const token = LoginResponseSchema.parse(data);
  // 念のため交差テナント混入を検知 
  //一旦後で
  // if (arr.some(e => e.tenant !==  tenant)) {
  //   throw new Error("Cross-tenant data detected");
  // }
//   console.log('AAAAAAAAAAAAAAA');
  console.log(token);
  return token;
}

