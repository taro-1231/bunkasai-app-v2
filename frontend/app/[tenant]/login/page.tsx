// 'use server';
import { apime, LoginResponseModel } from "@/lib/api/auth";
import { apilogin } from "@/lib/api/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function login(
    {params}: {params: Promise<{tenant: string}>}) {
      const { tenant }= await params;
      const user = await apime(tenant);
      // console.log('user',user);

      async function loginAction(formData: FormData): Promise<void> {
        'use server';

        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const login_token = await apilogin(tenant, { username, password });
        // console.log('login_token',login_token);

        if (login_token) {
          const jar = await cookies();
          jar.set('access_token', login_token.access_token,{httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 7,path: '/',sameSite: 'lax'});

          redirect(`/${tenant}/maintenance`);
        }

        // console.log('login_token',login_token);
        // return login_token;
      }

      return (
        <>
          <main className="min-h-[calc(100svh-4rem)] grid place-items-center px-4">
            <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-6">
              <h1 className="text-xl font-semibold mb-6">ログイン</h1>
              <form action={loginAction}>
                <div>          
                  <label className="block text-sm text-gray-700">Username</label>
                  <input className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required type="text" name="username" placeholder="Username" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Password</label>
                  <input className="mt-1 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required type="password" name="password" placeholder="Password" />
                </div>
                <div>
                  <button type="submit" className="w-full mt-4 h-10 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">Login</button>
                </div>
              </form>
            </div>
            <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-6">
              <h1 className="text-xl font-semibold mb-6">テストユーザー</h1>
              <p className="text-xl font-semibold mb-6">username = 'ryota'</p>
              <p className="text-xl font-semibold mb-6">password = '1231'</p>

            </div>

          </main>
          {/* <main className="min-h-[calc(100svh-4rem)] grid place-items-center px-4">
          </main> */}
        </>
      );
    }
    