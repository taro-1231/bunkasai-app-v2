import Link from 'next/link';
import { apime } from '@/lib/api/auth';
import { cookies } from 'next/headers';

interface NavigationProps {
    tenant: string;
}

export default async function Navigation({ tenant }: NavigationProps) {
    // try{
    //     const user = await apime(tenant);

    // }catch(error){
    // }
    const user = await apime(tenant);

    // console.log('useruser')
    // console.log(user)
    // const cookieStore = await cookies();
    // cookieStore.delete('access_token');



    return (
        <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <span className="text-lg font-bold">{tenant}</span>
                <div className="flex space-x-4">
                    <Link href={`/${tenant}`}>Home</Link>
                    <Link href={`/${tenant}/events`}>Events</Link>
                    <Link href={`/${tenant}/booths`}>Booths</Link>
                    <Link href={`/${tenant}/photos`}>Photos</Link>
                    {user ? (<Link href={`/${tenant}/maintenance`}>{user.username}</Link>) : (
                        <Link href={`/${tenant}/login`}>Login</Link>
                    )}
                    
                </div>
            </div>
            
        </nav>
    )
}

