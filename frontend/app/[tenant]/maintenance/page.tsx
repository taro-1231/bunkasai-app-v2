import { apime, LoginResponseModel } from "@/lib/api/auth";
import { apilogin, apilogout } from "@/lib/api/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CreateUserModal from "../_components/CreateUserModal";
import CreateAnnouncementModal from "../_components/CreateAnnouncementModal";
import CreateBoothModal from "../_components/CreateBoothModal";
import CreateEventModal from "../_components/CreateEventModal";
import { listUsers } from "@/lib/api/users";
import { UserModel } from "@/lib/api/users";



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

      const users = await listUsers(tenant) as UserModel[];
      // console.log('users',users);

      return (
          <main className="min-h-[calc(100svh-4rem)] grid place-items-center px-4">
            <h1>{user.role}</h1>
            {user.role == 'owner' ? (
              <div>
                <div>
                  <CreateUserModal tenant={tenant} />
                  {/* {users} */}
                  {users.map((user) => (
                    <div key={user.id}>
                      {user.username}
                    </div>
                  ))}
                </div>
                <div>
                  <CreateBoothModal tenant={tenant} />
                </div>
                <div>
                  <CreateEventModal tenant={tenant} />
                </div>
                <div>
                  <CreateAnnouncementModal tenant={tenant} />
                </div>
              </div>

            ) : user.role == 'staff' ? (
              <div>
                <div>
                  <CreateAnnouncementModal tenant={tenant} />
                </div>
                <div>
                  <CreateEventModal tenant={tenant} />
                </div>
              </div>
            ) : user.role == 'vendor' ? (
              <div>
                <div>
                  <CreateBoothModal tenant={tenant} />
                </div>
              </div>
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