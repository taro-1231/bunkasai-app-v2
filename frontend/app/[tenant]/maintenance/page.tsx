import { apime, LoginResponseModel } from "@/lib/api/auth";
import { apilogin, apilogout } from "@/lib/api/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function logout(
    {params}: {params: Promise<{tenant: string}>}) {
      const { tenant }= await params;
      const user = await apime(tenant);
      if (!user) {
        redirect(`/${tenant}/login`);
      }

      async function logoutAction(): Promise<void> {
        'use server';

        const cookieStore = await cookies();
        cookieStore.delete('access_token');
        // await apilogout(tenant);
          redirect(`/${tenant}`);
        

        // console.log('login_token',login_token);
        // return login_token;
      }

      return (
          <main className="min-h-[calc(100svh-4rem)] grid place-items-center px-4">
            {user.role == 'owner' ? (
              <div>
                <h1 className="text-xl font-semibold mb-6">owner</h1>
                <form action={logoutAction} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm">Name</label>
                    <input name="name" required className="border rounded px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm">Description</label>
                    <textarea name="description" className="border rounded px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm">Capacity</label>
                    <input name="capacity" type="number" min={0} step={1} className="border rounded px-3 py-2 w-full" />
                  </div>
                  <button type="submit" className="rounded px-4 py-2 border">Create</button>
                </form>
              </div>

            ) : user.role == 'staff' ? (
              <div>staff</div>
            ) : user.role == 'vendor' ? (
              <div>vendor</div>
            ) : (
              <div></div>
            )}  
            <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-6">
              <h1 className="text-xl font-semibold mb-6">ログアウト</h1>
              <form action={logoutAction}>
                
                <div>
                  <button type="submit" className="w-full mt-4 h-10 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">Logout</button>
                </div>
              </form>
            </div>
          </main>

      );
    
    }