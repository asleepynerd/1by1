'use client';

import Link from 'next/link';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="py-8 flex justify-between items-center">
          <h1 className="text-5xl font-black text-white tracking-tighter">1by1</h1>
          <Link
            href="/auth/signin"
            className="text-lg font-black text-black bg-white px-6 py-3 rounded-xl border-2 border-white hover:bg-gray-200 transition-all shadow-md"
          >
            Sign in
          </Link>
        </nav>

        <div className="py-20 flex flex-col items-center">
          <h2 className="text-6xl font-black text-white tracking-tighter text-center mb-6">The Social Chain</h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-300 font-mono text-center mb-10">
            Join an exclusive social network where each member can invite exactly one person.<br />Create your own unique chain of connections.
          </p>
          <Link
            href="/auth/signin"
            className="px-10 py-4 rounded-xl bg-white text-black font-black text-2xl border-2 border-white hover:bg-gray-200 transition-all shadow-lg tracking-tight"
          >
            Get started
          </Link>
        </div>

        <div className="py-16">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black border-2 border-white rounded-2xl p-8 flex flex-col items-center shadow-xl" style={{ boxShadow: '0 0 24px 2px #fff3' }}>
              <div className="text-4xl mb-4">🎟️</div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Get Invited</h3>
              <p className="text-base text-gray-400 font-mono text-center">Receive a unique invitation code from someone in the network.</p>
            </div>
            <div className="bg-black border-2 border-white rounded-2xl p-8 flex flex-col items-center shadow-xl" style={{ boxShadow: '0 0 24px 2px #fff3' }}>
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Join the Chain</h3>
              <p className="text-base text-gray-400 font-mono text-center">Create your profile and receive your own invitation code.</p>
            </div>
            <div className="bg-black border-2 border-white rounded-2xl p-8 flex flex-col items-center shadow-xl" style={{ boxShadow: '0 0 24px 2px #fff3' }}>
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Invite One</h3>
              <p className="text-base text-gray-400 font-mono text-center">Share your invitation code with exactly one person.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-black border-t-2 border-white mt-16">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500 font-mono">
            © 2025 1by1. no rights reserved. (bc i suck)
          </p>
        </div>
      </footer>
    </div>
  );
} 