import Link from 'next/link';
import { apime } from '@/lib/api/auth';
import { cookies } from 'next/headers';

interface NavigationProps {
    tenant: string;
}

export default async function Navigation({ tenant }: NavigationProps) {
    const user = await apime(tenant);


    return (
        <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <span className="text-lg font-bold">文化祭アプリ</span>
                <div className="flex space-x-1">
                    <Link href={`/${tenant}`} className="p-2 rounded-md bg-white text-gray-900 hover:bg-gray-800 hover:text-white transition">Home</Link>
                    <Link href={`/${tenant}/events`} className="p-2 rounded-md bg-white text-gray-900 hover:bg-gray-800 hover:text-white transition">Events</Link>
                    <Link href={`/${tenant}/booths`} className="p-2 rounded-md bg-white text-gray-900 hover:bg-gray-800 hover:text-white transition">Booths</Link>
                    <Link href={`/${tenant}/photos`} className="p-2 rounded-md bg-white text-gray-900 hover:bg-gray-800 hover:text-white transition">Photos</Link>
                    {user ? (<Link href={`/${tenant}/maintenance`} className="p-2 rounded-md bg-white text-gray-900 hover:bg-gray-800 hover:text-white transition"
                        >{user.username}</Link>) : (
                        <Link href={`/${tenant}/login`} className="p-2 rounded-md bg-white text-gray-900 hover:bg-gray-800 hover:text-white transition">Login</Link>
                    )}
                    
                </div>
            </div>
            
        </nav>
    )
}