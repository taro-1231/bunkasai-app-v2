'use server';
import { z } from "zod";
import { apiFetch } from "./client";
import { getTenantFromBrowser } from "./client";
import { cookies } from "next/headers";

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
  // console.log('data',data);
  // const arr = z.array(UserSchema).parse(data);
  // 念のため交差テナント混入を検知 
  //一旦後で
  // if (arr.some(e => e.tenant !== tenant)) {
  //   throw new Error("Cross-tenant data detected");
  // }
  // console.log(arr);
  return data;
}

export async function getUser(tenant: string, id: string | number) {
  const data = await apiFetch<unknown>(`/${tenant}/users/${id}`);
  const us = UserSchema.parse(data);
// if (bo.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return bo;
}

const createUserSchema = z.object({
  // id: z.string(),
  // tenant: z.string(),
  username: z.string(),
  // email: z.string().optional(),
  role: z.string(),
  belong: z.string(),
  password: z.string(),
});
export type createUserModel = z.infer<typeof createUserSchema>;

export async function createUser(
  tenant: string,
  payload: createUserModel, 
) {
  try{
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      return null;
    }
    const data = await apiFetch(`/${tenant}/users`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    // console.log('data',data);
    return data;
    // const user = createUserSchema.parse(data);
    // return user;
  }catch(error){
    console.error('error',error);
    return null;

  }
  // console.log('createUser!!!');
  // const data = await apiFetch(`/${tenant}/users`, {
  //   method: "POST",
  //   // headers: {
  //   //   "Authorization": `Bearer ${token}`,
  //   // },
  //   body: JSON.stringify(payload),
  // });
  // const user = createUserSchema.parse(data);
  // if (user.tenant !== tenant) throw new Error("Cross-tenant data detected");
  // return user;
}


// export async function createUserAction(tenant: string, formData: FormData) {
//   const username = formData.get('username') as string;
//   const password = formData.get('password') as string;
//   const role = formData.get('role') as string;
//   const belong = formData.get('belong') as string;
//   const payload = {username, password, role, belong};
//   console.log('payload',payload);
//   try {
//     const user = await createUser(tenant, payload);
//     console.log('user',user);
//     return user;
//   } catch (error) {
//     console.error('createUserAction error:', error);
//     return {error: 'createUserAction error:' + error};
//   }

  // console.log('createUserAction!!!');
  // return {message: 'createUserAction!!!'};
// }
