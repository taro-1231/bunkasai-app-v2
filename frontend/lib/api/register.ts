import { z } from "zod";
import { apiFetch } from "./client";
// import { getTenantFromBrowser } from "./client";


const RegisterSchema = z.object({
//   id: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string(),
  school_name: z.string(),
  school_slug: z.string(),
});

// const LoginResponseSchema = z.object({
//   access_token: z.string(),
//   token_type: z.string(),
// });

export type RegisterModel = z.infer<typeof RegisterSchema>;
// export type LoginResponseModel = z.infer<typeof LoginResponseSchema>;

export async function apiregister(payload: RegisterModel){
    const body = {
        tenant: payload.school_slug,
        tenant_slug: payload.school_slug,
        owner: payload.username,
        password: payload.password,
        email: payload.email
    }
    // console.log('payloadpayload',payload);
  const data = await apiFetch<unknown>(`/`, {
    method: "POST",
    body: JSON.stringify(body),
  });
//   const token = LoginResponseSchema.parse(data);
//   // 念のため交差テナント混入を検知 
//   //一旦後で
//   // if (arr.some(e => e.tenant !==  tenant)) {
//   //   throw new Error("Cross-tenant data detected");
//   // }
//   return token;
}

