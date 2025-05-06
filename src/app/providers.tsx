'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  if (status === 'loading') return null;
  if (!session) return <>{children}</>;
  return (
    <div className="flex min-h-screen relative">
      {!sidebarVisible && (
        <button
          onClick={() => setSidebarVisible(true)}
          className="fixed top-4 left-4 z-50 bg-black border-2 border-white text-white font-black rounded p-2 shadow-lg hover:bg-white hover:text-black transition-all flex items-center justify-center"
          aria-label="Show sidebar"
        >
          <span className="block" style={{lineHeight: 1}}>
            <span style={{display: 'block', width: 24, height: 3, background: 'currentColor', marginBottom: 4, borderRadius: 2}}></span>
            <span style={{display: 'block', width: 24, height: 3, background: 'currentColor', marginBottom: 4, borderRadius: 2}}></span>
            <span style={{display: 'block', width: 24, height: 3, background: 'currentColor', borderRadius: 2}}></span>
          </span>
        </button>
      )}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-auto`}
        style={{ width: '240px', minWidth: '240px' }}
      >
        <Sidebar onHide={() => setSidebarVisible(false)} />
      </div>
      <main className={`bg-black transition-all flex-1 ${sidebarVisible ? 'md:ml-60' : 'w-full'}`}>{children}</main>
    </div>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SessionProvider>
  );
} 