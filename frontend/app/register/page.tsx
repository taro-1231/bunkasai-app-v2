// app/(auth)/register/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { registerAction, type RegisterState } from './actions';

const initialState: RegisterState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full mt-4 h-10 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
    >
      {pending ? '登録中…' : '登録'}
    </button>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(registerAction, initialState);

  // 成功したらここで遷移（redirectは使わない）
  useEffect(() => {
    if (state.ok && state.slug) {
      router.push(`/${state.slug}`);
    }
  }, [state, router]);

  return (
    <main className="min-h-[calc(100svh-4rem)] grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-6">
        <h1 className="text-xl font-semibold mb-6">学校登録</h1>

        {/* APIは Server Action に委譲 */}
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">学校名</label>
            <input
              className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              type="text"
              name="school_name"
              placeholder="School Name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">学校URL</label>
            <input
              className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              type="text"
              name="school_slug"
              placeholder="School URL"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">ユーザー名</label>
            <input
              className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              type="text"
              name="username"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">パスワード</label>
            <input
              className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              type="password"
              name="password"
              placeholder="Password"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">メールアドレス</label>
            <input
              className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              type="email"
              name="email"
              placeholder="Email"
            />
          </div>

          <SubmitButton />

          {/* エラー表示 */}
          {!state.ok && state.error && (
            <p className="mt-3 text-sm text-red-600">{state.error}</p>
          )}
        </form>
      </div>
    </main>
  );
}







// import { apime, LoginResponseModel } from "@/lib/api/auth";
// import { apilogin } from "@/lib/api/auth";
// import { apiregister } from "@/lib/api/register";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";


// export default async function register() {

//       async function registerAction(formData: FormData): Promise<void> {
//         'use server';
//         const school_name = formData.get('school_name') as string;
//         const school_slug = formData.get('school_slug') as string;
//         const username = formData.get('username') as string;
//         const password = formData.get('password') as string;
//         const email = formData.get('email') as string;

//         let result_slug: string = '';

//         try {
//           result_slug = await apiregister({ school_name, school_slug, username, password, email });
        
//         } catch (error) {
//           console.error('Registration failed:', error);
//           // エラーハンドリングを追加
//           throw error;
//         }

//         redirect(`/${result_slug}`);

//       }

//       return (
//           <main className="min-h-[calc(100svh-4rem)] grid place-items-center px-4">
//             <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-6">
//               <h1 className="text-xl font-semibold mb-6">学校登録</h1>
//               <form action={registerAction}>
//                 <div>          
//                   <label className="block text-sm text-gray-700">学校名</label>
//                   <input className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required type="text" name="school_name" placeholder="School Name" />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700">学校URL</label>
//                   <input className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required type="text" name="school_slug" placeholder="School URL" />
//                 </div>
//                 <div>          
//                   <label className="block text-sm text-gray-700">ユーザー名</label>
//                   <input className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required type="text" name="username" placeholder="Username" />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700">パスワード</label>
//                   <input className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required type="password" name="password" placeholder="Password" />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700">メールアドレス</label>
//                   <input className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required type="email" name="email" placeholder="Email" />
//                 </div>
//                 <div>
//                   <button type="submit" className="w-full mt-4 h-10 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">登録</button>
//                 </div>
//               </form>
//             </div>
//           </main>

//       );
//     }
    