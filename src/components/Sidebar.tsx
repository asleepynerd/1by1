import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import React from 'react';

export function Sidebar({ onHide }: { onHide?: () => void }) {
  const { data: session } = useSession();
  return (
    <aside className="w-60 bg-black border-r-2 border-white flex flex-col items-center py-6 gap-4 min-h-screen relative">
      {onHide && (
        <button
          onClick={onHide}
          className="absolute top-4 right-4 z-50 bg-black border-2 border-white text-white font-black rounded p-2 shadow-lg hover:bg-white hover:text-black transition-all flex items-center justify-center md:hidden"
          aria-label="Hide sidebar"
        >
          <span className="block" style={{lineHeight: 1}}>
            <span style={{display: 'block', width: 24, height: 3, background: 'currentColor', marginBottom: 4, borderRadius: 2}}></span>
            <span style={{display: 'block', width: 24, height: 3, background: 'currentColor', marginBottom: 4, borderRadius: 2}}></span>
            <span style={{display: 'block', width: 24, height: 3, background: 'currentColor', borderRadius: 2}}></span>
          </span>
        </button>
      )}
      <div className="flex flex-col items-center gap-1 mb-6">
        <div className="w-14 h-14 rounded-full bg-white border-2 border-white shadow-lg overflow-hidden">
          {session?.user?.image ? (
            <img src={session.user.image} alt={session.user.name || 'Profile'} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl text-gray-400 font-black flex items-center justify-center h-full">?</span>
          )}
        </div>
        <div className="text-base font-bold text-white text-center max-w-[8rem] truncate">{session?.user?.name || 'No Name'}</div>
      </div>
      <nav className="flex flex-col gap-2 w-full px-2">
        <Link href="/home" className="block w-full py-2 px-3 rounded-lg font-bold text-base text-white border-2 border-white hover:bg-white hover:text-black transition-all text-left">Home</Link>
        <Link href="/feed" className="block w-full py-2 px-3 rounded-lg font-bold text-base text-white border-2 border-white hover:bg-white hover:text-black transition-all text-left">Feed</Link>
        <Link href="/settings" className="block w-full py-2 px-3 rounded-lg font-bold text-base text-white border-2 border-white hover:bg-white hover:text-black transition-all text-left">Settings</Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="block w-full py-2 px-3 rounded-lg font-bold text-base text-white border-2 border-white hover:bg-red-600 hover:text-white transition-all text-left mt-4"
        >
          Sign Out
        </button>
      </nav>
      <div className="mt-auto mb-4 w-full flex justify-center">
        <Link href="/feed" className="bg-white text-black font-black rounded-full w-12 h-12 flex items-center justify-center text-2xl border-2 border-white shadow-lg hover:bg-gray-200 transition-all">
          +
        </Link>
      </div>
    </aside>
  );
} 