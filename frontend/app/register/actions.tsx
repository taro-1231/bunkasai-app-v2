'use server';

import { apiregister } from '@/lib/api/register';

export type RegisterState = {
  ok: boolean;
  slug?: string;
  error?: string;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const school_name = formData.get('school_name') as string | null;
  const school_slug = formData.get('school_slug') as string | null;
  const username    = formData.get('username') as string | null;
  const password    = formData.get('password') as string | null;
  const email       = formData.get('email') as string | null;

  if (!school_name || !school_slug || !username || !password || !email) {
    return { ok: false, error: 'Missing required fields' };
  }
  try {
    // FastAPI に登録を依頼。戻りで slug を受け取る想定
    const result_slug = await apiregister({
      school_name,
      school_slug,
      username,
      password,
      email,
    });

    return { ok: true, slug: result_slug };
  } catch (err: any) {
    // 409/422 などのAPIエラーを文字列化
    const msg = err.body?.detail ?? `API error ${err.status}`;
    
    // return { ok: false, error: err.detail };
    return { ok: false, error: msg };

  }
}
