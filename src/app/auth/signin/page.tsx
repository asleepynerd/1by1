'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [invitation, setInvitation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [hasInvitation, setHasInvitation] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('invitation');
    if (code) setInvitation(code);
    fetch('/api/auth/first-user')
      .then(res => res.json())
      .then(data => {
        setIsFirstUser(data.isFirstUser);
        setHasInvitation(!data.isFirstUser);
      })
      .catch(console.error);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn('email', {
        email,
        callbackUrl: '/',
        invitation: hasInvitation ? invitation : undefined,
      });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-8xl font-black text-white tracking-tighter">
            1by1
          </h1>
          <p className="text-xl mt-4 text-gray-400 font-mono">The Social Chain</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-mono text-gray-400">
              EMAIL ADDRESS
            </label>
            <div className="relative mt-1">
              <div className="absolute -inset-0.5 bg-white rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative w-full px-4 py-3 bg-black border-2 border-white rounded-lg text-white placeholder-gray-400 font-mono focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>
          {!isFirstUser && (
            <div className="flex items-center mt-4 mb-2">
              <input
                id="has-invitation"
                type="checkbox"
                checked={hasInvitation}
                onChange={e => setHasInvitation(e.target.checked)}
                className="mr-2 accent-black"
              />
              <label htmlFor="has-invitation" className="text-sm font-mono text-gray-400 select-none">
                Have an invitation code?
              </label>
            </div>
          )}
          {!isFirstUser && hasInvitation && (
            <div>
              <label htmlFor="invitation" className="block text-sm font-mono text-gray-400">
                INVITATION CODE
              </label>
              <div className="relative mt-1">
                <div className="absolute -inset-0.5 bg-white rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <input
                  id="invitation"
                  name="invitation"
                  type="text"
                  required={hasInvitation}
                  value={invitation}
                  onChange={e => setInvitation(e.target.value)}
                  className="relative w-full px-4 py-3 bg-black border-2 border-white rounded-lg text-white placeholder-gray-400 font-mono focus:outline-none"
                  placeholder="Enter your invitation code"
                />
              </div>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-6 border-2 border-white rounded-lg text-base font-black text-black bg-white hover:bg-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-5 h-5 border-2 border-black border-t-transparent rounded-lg"
              />
            ) : (
              'SIGN IN WITH EMAIL'
            )}
          </motion.button>
        </motion.form>

        {!isFirstUser && hasInvitation && !invitation && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-red-500 font-mono"
          >
            YOU NEED AN INVITATION CODE TO JOIN. PLEASE GET ONE FROM AN EXISTING MEMBER.
          </motion.p>
        )}

        {isFirstUser && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-green-500 font-mono"
          >
            WELCOME! YOU ARE THE FIRST USER. YOU WILL BE ABLE TO INVITE OTHERS AFTER SIGNING UP.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
} 