"use client";

import Link from 'next/link';

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md space-y-8 text-center border-2 border-white rounded-2xl bg-black p-8 shadow-2xl">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">CHECK YOUR EMAIL</h1>
          <p className="text-lg text-gray-400 font-mono mb-6">A sign-in link has been sent to your email address.<br />Click the link to continue.</p>
        </div>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-2 border-white shadow-lg">
            <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v4m0-4V8" /></svg>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center font-mono mb-6">Didn&apos;t get the email? Check your spam folder or try again.</div>
        <Link
          href="/auth/signin"
          className="block w-full px-6 py-4 text-center text-black bg-white font-black rounded-lg hover:bg-gray-200 transition-all duration-200"
        >
          RETURN TO SIGN IN
        </Link>
      </div>
    </div>
  );
} 