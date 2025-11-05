import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function XPGainAnimation({ amount, level, onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 animate-float-up" style={{ animation: 'floatUp 2s ease-out forwards' }}>
        <div
          className={cn(
            "text-6xl font-bold",
            "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500",
            "drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]"
          )}
        >
          +{amount.toLocaleString()} XP
        </div>
        <div className="text-2xl font-semibold text-white drop-shadow-lg">
          Level {level}
        </div>
      </div>
    </div>
  );
}

