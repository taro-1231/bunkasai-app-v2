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
          redirect(`/${tenant}`);
      
      }

      const users = await listUsers(tenant) as UserModel[];

      return (
        <main className="min-h-[calc(100svh-4rem)] bg-gray-50 px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* ユーザー情報 */}
            <div className="rounded-2xl bg-white shadow p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                ロール: <span className="text-blue-600">{user.role}</span>
              </h1>
      
              {user.role === "owner" ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="font-semibold text-lg text-gray-700">ユーザー管理</h2>
                    <CreateUserModal tenant={tenant} />
                    <div className="mt-2 space-y-1">
                      {users.map((u) => (
                        <div
                          key={u.id}
                          className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-gray-50"
                        >
                          <span className="text-gray-800">{u.username}</span>
                          <span className='ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700'>
                            {u.role}
                          </span>
                        </div>

                      ))}
                    </div>
                  </div>
      
                  <div>
                    <h2 className="font-semibold text-lg text-gray-700 mb-2">
                      ブース作成
                    </h2>
                    <CreateBoothModal tenant={tenant} />
                  </div>
      
                  <div>
                    <h2 className="font-semibold text-lg text-gray-700 mb-2">
                      イベント作成
                    </h2>
                    <CreateEventModal tenant={tenant} />
                  </div>
      
                  <div>
                    <h2 className="font-semibold text-lg text-gray-700 mb-2">
                      お知らせ作成
                    </h2>
                    <CreateAnnouncementModal tenant={tenant} />
                  </div>
                </div>
              ) : user.role === "staff" ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-700 mb-2">
                      お知らせ作成
                    </h2>
                    <CreateAnnouncementModal tenant={tenant} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-gray-700 mb-2">
                      イベント作成
                    </h2>
                    <CreateEventModal tenant={tenant} />
                  </div>
                </div>
              ) : user.role === "vendor" ? (
                <div>
                  <h2 className="font-semibold text-lg text-gray-700 mb-2">
                    ブース作成
                  </h2>
                  <CreateBoothModal tenant={tenant} />
                </div>
              ) : (
                <div className="text-gray-500">権限がありません</div>
              )}
            </div>
      
            {/* ログアウト */}
            <div className="w-full max-w-md mx-auto rounded-2xl border bg-white shadow-sm p-6">
              <h1 className="text-xl font-semibold mb-6">ログアウト</h1>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full h-10 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-60"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </main>
      );
      
      // return (
      //     <main className="min-h-[calc(100svh-4rem)] grid place-items-center px-4">
      //       <h1>{user.role}</h1>
      //       {user.role == 'owner' ? (
      //         <div>
      //           <div>
      //             <CreateUserModal tenant={tenant} />
      //             {/* {users} */}
      //             {users.map((user) => (
      //               <div key={user.id}>
      //                 {user.username}
      //               </div>
      //             ))}
      //           </div>
      //           <div>
      //             <CreateBoothModal tenant={tenant} />
      //           </div>
      //           <div>
      //             <CreateEventModal tenant={tenant} />
      //           </div>
      //           <div>
      //             <CreateAnnouncementModal tenant={tenant} />
      //           </div>
      //         </div>

      //       ) : user.role == 'staff' ? (
      //         <div>
      //           <div>
      //             <CreateAnnouncementModal tenant={tenant} />
      //           </div>
      //           <div>
      //             <CreateEventModal tenant={tenant} />
      //           </div>
      //         </div>
      //       ) : user.role == 'vendor' ? (
      //         <div>
      //           <div>
      //             <CreateBoothModal tenant={tenant} />
      //           </div>
      //         </div>
      //       ) : (
      //         <div></div>
      //       )}  
      //       <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-6">
      //         <h1 className="text-xl font-semibold mb-6">ログアウト</h1>
      //         <form action={logoutAction}>
                
      //           <div>
      //             <button type="submit" className="w-full mt-4 h-10 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">Logout</button>
      //           </div>
      //         </form>
      //       </div>
      //     </main>

      // );
    
    }