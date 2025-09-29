'use server';
import { z } from "zod";
import { apiFetch } from "./client";
import { getTenantFromBrowser } from "./client";
import { cookies } from "next/headers";

// zodは型定義とバリデーションを行うためのライブラリ
const PhotoSchema = z.object({
  id: z.string(),
  image_root: z.string(),
  image_url: z.string(),
  published_at: z.coerce.date(),
  ext: z.string(),
});
type PhotoModel = z.infer<typeof PhotoSchema>;

const PhotoItemSchema = z.object({
    id: z.string(),
    src: z.string(),
    published_at: z.string(),
  });
  
const PhotoListResponseSchema = z.object({
    items: z.array(PhotoItemSchema),
    total: z.number().int().nonnegative(),
  });
  
  export type PhotoItem = z.infer<typeof PhotoItemSchema>;
  export type PhotoListResponse = z.infer<typeof PhotoListResponseSchema>;

export async function listPhotos(tenant: string | null): Promise<PhotoListResponse> {
  if (!tenant) 
    tenant = getTenantFromBrowser();

  const data = await apiFetch<PhotoListResponse>(`/${tenant}/photos`);
//   console.log('photos data:', data);
  return data;
//   console.log('photos data:', data);
//   const arr = z.array(PhotoSchema).parse(data);
//   return arr;
}

// const postPhotoSchema = z.object({
//   image_url: z.string(),
// });
// export type postPhotoModel = z.infer<typeof postPhotoSchema>;

export async function postPhoto(
  tenant: string,
  formData: FormData
) {
  try{
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      return null;
    }
    const data = await apiFetch<unknown>(`/${tenant}/photos/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Content-TypeはFormDataの場合自動でmultipart/form-dataが設定される
      },
      body: formData,
    });
    // console.log('datadata',data);
    return data;
  }catch(error){
    console.error('error',error);
    return null;
  }
}
