import { z } from "zod";
import { apiFetch } from "./client";
import { getTenantFromBrowser } from "./client";
import { cookies } from "next/headers";
import { error } from "console";


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
  const data = await apiFetch<unknown>(`/${tenant}/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),

  });
  const token = LoginResponseSchema.parse(data);
  // 念のため交差テナント混入を検知 
  //一旦後で
  // if (arr.some(e => e.tenant !==  tenant)) {
  //   throw new Error("Cross-tenant data detected");
  // }
  return token;
}


// const UserModelSchema = z.object({
//     id: z.string(),
//     username: z.string(),
//     role: z.string(),
//     belong: z.string(),
// });

// export type UserModel = z.infer<typeof UserModelSchema>;

export type SessionUserModel = {
    // id: string;
    username: string;
    role: string;
    belong: string;
}

export type SessionUserModelResponse = {
    // id: string;
    username: string;
    role: string;
    belong: string;
}
export async function apime(tenant: string): Promise<SessionUserModel | null> {
  // let res : Response;
  let res : SessionUserModel | null;
  try{
    const token = (await cookies()).get("access_token")?.value;

    // if(!token) {
    //     return null;
    // }
    res = await apiFetch<SessionUserModel>(`/${tenant}/auth/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        },  
    });
    return res
  }catch(err){
    // console.log(err)
    if (err instanceof Error) {
      if (err.message.includes("498")) {
        console.log("このエラー処理ができない");
        // console.log(err)
        throw err
        // console.log('')
      } else {
        // console.log('うれしくない');
      }
    // console.log('エラー');
    // console.log()
    return null;
  }
  return null;
}
  // console.log('AAAAAAAAAAA')
  // console.log(res)
  
  // return res;
}

export async function apilogout(tenant: string | null) {
    const res = await apiFetch<unknown>(`/${tenant}/auth/logout`, {
        method: "POST",
    });
    return (await res) as { message: string } | null;
}

export async function apigetTenant(tenant_slug: string): Promise<string>{
  const res = await apiFetch<string>(`/${tenant_slug}`, {
    // method: "GET",
    method: 'DELETE',
});
// console.log('res')
// console.log(res)
return res;
}