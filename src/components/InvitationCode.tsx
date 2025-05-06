'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface InvitationCodeProps {
  code: string;
  used?: boolean;
}

export function InvitationCode({ code, used = false }: InvitationCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute -inset-0.5 bg-white rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x" />
      <div className="relative bg-black rounded-lg p-6 border-2 border-white flex flex-col items-center">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-2 font-mono">
              YOUR INVITATION CODE
            </div>
            <div
              className={`font-mono text-2xl tracking-wider text-white ${used ? 'line-through decoration-4 decoration-red-500' : ''}`}
              style={used ? { textDecorationThickness: '4px', textDecorationColor: '#ef4444' } : {}}
            >
              {code}
            </div>
            {used && (
              <div className="mt-2 text-xs font-black text-red-500 tracking-widest">USED</div>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="px-6 py-3 bg-white text-black font-black rounded-lg hover:bg-gray-200 transition-all duration-200"
            disabled={used}
          >
            {copied ? (
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>COPIED!</span>
              </span>
            ) : (
              used ? 'USED' : 'COPY'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 