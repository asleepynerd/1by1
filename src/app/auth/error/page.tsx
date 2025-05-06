'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'AN ERROR OCCURRED DURING AUTHENTICATION.';
  
  if (error === 'AccessDenied') {
    errorMessage = 'INVALID OR ALREADY USED INVITATION CODE.';
  } else if (error === 'Configuration') {
    errorMessage = 'THERE IS A PROBLEM WITH THE SERVER CONFIGURATION.';
  } else if (error === 'Verification') {
    errorMessage = 'THE VERIFICATION LINK IS INVALID OR HAS EXPIRED.';
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-black text-white tracking-tighter">ERROR</h1>
          <p className="mt-4 text-xl text-gray-400 font-mono">{errorMessage}</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-6 py-4 text-center text-black bg-white font-black rounded-lg hover:bg-gray-200 transition-all duration-200"
          >
            RETURN HOME
          </Link>
          <Link
            href="/auth/signin"
            className="block w-full px-6 py-4 text-center text-white border-2 border-white font-black rounded-lg hover:bg-white hover:text-black transition-all duration-200"
          >
            TRY AGAIN
          </Link>
        </div>
      </div>
    </div>
  );
} 