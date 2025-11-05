import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-[100]",
      "bg-red-600 text-white",
      "py-2 px-4",
      "text-center font-semibold text-sm",
      "shadow-lg",
      "animate-slide-down"
    )}>
      <span className="mr-2">📡</span>
      You're offline. Some features may not be available.
    </div>
  );
}

