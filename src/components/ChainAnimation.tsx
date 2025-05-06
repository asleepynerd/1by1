'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';

interface ChainNode {
  id: string;
  name: string;
  image?: string;
}

interface ChainAnimationProps {
  nodes: ChainNode[];
  currentUserId: string;
}

export function ChainAnimation({ nodes, currentUserId }: ChainAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const firstAvatarRef = useRef<HTMLDivElement>(null);
  const lastAvatarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineStyle, setLineStyle] = useState<{ left: number; width: number; top: number }>({ left: 0, width: 0, top: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useLayoutEffect(() => {
    if (firstAvatarRef.current && lastAvatarRef.current && containerRef.current) {
      const firstRect = firstAvatarRef.current.getBoundingClientRect();
      const lastRect = lastAvatarRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const overlap = 12; // probably should be dynamic but fuck it we ball
      const left = firstRect.right - containerRect.left - overlap;
      const right = lastRect.left - containerRect.left + overlap;
      const width = right - left;
      const top = firstRect.top - containerRect.top + firstRect.height / 2;
      setLineStyle({ left, width, top });
    }
  }, [nodes.length]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <div ref={containerRef} className="flex items-center justify-center w-full gap-12 min-h-[120px] relative">
        {/* please die, how do you fail to make a line*/}
        {nodes.length > 1 && lineStyle.width > 0 && (
          <div
            className="absolute z-0"
            style={{
              left: lineStyle.left,
              width: lineStyle.width,
              top: lineStyle.top,
              height: '8px',
              background: 'white',
              borderRadius: '9999px',
              transform: 'translateY(-50%)',
            }}
          />
        )}
        {nodes.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center z-10">
            <motion.div
              ref={index === 0 ? firstAvatarRef : index === nodes.length - 1 ? lastAvatarRef : undefined}
              whileHover={{ scale: 1.08 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mb-2 shadow-lg transition-all duration-200
                ${node.id === currentUserId
                  ? 'bg-white text-black ring-4 ring-white shadow-white/60'
                  : 'bg-gray-900 text-white border-2 border-white'}
              `}
              style={{ boxShadow: node.id === currentUserId ? '0 0 24px 4px #fff8' : undefined }}
            >
              {node.image ? (
                <img src={node.image} alt={node.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span>{node.name?.[0]?.toUpperCase() || '?'}</span>
              )}
            </motion.div>
            <div className="text-center text-base text-white font-bold max-w-[120px] truncate">
              {node.name || 'User'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 