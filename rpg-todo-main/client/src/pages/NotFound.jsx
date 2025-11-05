import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      "bg-white dark:bg-primary-dark",
      "px-4 py-8"
    )}>
      <div className="text-center max-w-md">
        <div className="text-8xl mb-4">🗺️</div>
        <h1 className={cn(
          "text-6xl font-bold mb-4",
          "text-primary dark:text-white"
        )}>
          404
        </h1>
        <h2 className={cn(
          "text-2xl font-semibold mb-4",
          "text-primary dark:text-white"
        )}>
          Page Not Found
        </h2>
        <p className={cn(
          "text-lg mb-8",
          "text-gray-600 dark:text-gray-400"
        )}>
          The page you're looking for doesn't exist. Perhaps you took a wrong turn on your quest?
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate('/dashboard')}
            size="lg"
          >
            🏠 Go to Dashboard
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
          >
            ← Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

