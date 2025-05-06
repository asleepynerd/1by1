"use client";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black border-2 border-white rounded-2xl p-8 flex flex-col items-center gap-6 w-full max-w-md shadow-2xl relative" style={{ boxShadow: "0 0 32px 4px #fff4" }}>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Check your email</h1>
        <p className="text-gray-400 text-center font-mono mb-4">A sign-in link has been sent to your email address.<br />Click the link to continue.</p>
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-2 border-2 border-white shadow-lg">
          <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v4m0-4V8" /></svg>
        </div>
        <div className="text-xs text-gray-500 text-center font-mono">Didn&apos;t get the email? Check your spam folder or try again.</div>
      </div>
    </div>
  );
} 