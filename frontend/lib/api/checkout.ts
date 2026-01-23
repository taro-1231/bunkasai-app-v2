'use server';
import { z } from "zod";
import { apiFetch } from "./client";
import { getTenantFromBrowser } from "./client";
import { cookies } from "next/headers";

const checkoutSchema = z.object({
  plan: z.enum(['free','plus','unlimited']),
  days: z.number(),
});
export type checkoutModel = z.infer<typeof checkoutSchema>;

export async function checkout(
  tenant: string,
  payload: checkoutModel
) {
  try{
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      throw new Error("認証トークンが見つかりません。ログインしてください。");
    }
    const data = await apiFetch<unknown>(`/${tenant}/checkout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    // const res = 
    return data;
  }catch(error){
    console.error('checkout error:', error);
    throw error;
  }
}