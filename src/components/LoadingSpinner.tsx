'use client';

import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 border-4 border-white border-t-transparent rounded-lg"
      />
    </div>
  );
} 