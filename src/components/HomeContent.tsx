'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChainAnimation } from '@/components/ChainAnimation';
import { InvitationCode } from '@/components/InvitationCode';

export function HomeContent() {
  const { data: session, status } = useSession();
  const [invitationCode, setInvitationCode] = useState('');
  const [chainNodes, setChainNodes] = useState<any[]>([]);
  const [hasInvited, setHasInvited] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/chain')
        .then(res => res.json())
        .then(data => {
          setChainNodes(data.chain || []);
          const me = (data.chain || []).find((n: any) => n.id === session?.user?.id);
          setHasInvited(!!me?.hasInvited);
        });
    }
  }, [status, session]);

  if (status === 'loading') {
    return null; // wooowww suspense is so cool, (not really it makes me want to kill myself)
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-8xl font-black text-white tracking-tighter">
            1by1
          </h1>
          <p className="text-xl mt-4 text-gray-400 font-mono">The Social Chain</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md space-y-4"
        >
          <div className="relative">
            <div className="absolute -inset-0.5 bg-white rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <input
              type="text"
              placeholder="Enter invitation code"
              className="relative w-full p-4 rounded-lg bg-black text-white border-2 border-white font-mono focus:outline-none"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
            />
          </div>
          <Link
            href={`/auth/signin?invitation=${invitationCode}`}
            className="block w-full p-4 text-center rounded-lg bg-white text-black font-black hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
          >
            JOIN THE CHAIN
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-black">
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-6xl font-black text-white tracking-tighter">
              1by1
            </h1>
            <p className="text-gray-400 font-mono">The Social Chain</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 font-mono">Welcome, {session.user?.name}</span>
            <Link
              href="/api/auth/signout"
              className="px-6 py-3 rounded-lg bg-white text-black font-black hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              SIGN OUT
            </Link>
          </div>
        </motion.header>

        <main className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <InvitationCode code={session.user?.invitationCode || 'Loading...'} used={hasInvited} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black rounded-xl p-6 border-2 border-white"
          >
            <h2 className="text-4xl font-black text-white tracking-tighter mb-8">
              YOUR CHAIN
            </h2>
            <ChainAnimation
              nodes={chainNodes}
              currentUserId={session.user?.id || ''}
            />
          </motion.section>
        </main>
      </div>
    </div>
  );
} 