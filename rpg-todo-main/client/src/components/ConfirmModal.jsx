import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'destructive' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative z-10 w-full max-w-md rounded-2xl shadow-2xl",
        "bg-white dark:bg-primary-dark",
        "border-2 border-primary dark:border-primary-light",
        "p-6 space-y-4",
        "animate-in fade-in zoom-in duration-200"
      )}>
        <h2 className={cn(
          "text-2xl font-bold",
          "text-primary dark:text-white"
        )}>
          {title}
        </h2>
        
        <p className={cn(
          "text-base",
          "text-gray-700 dark:text-gray-300"
        )}>
          {message}
        </p>
        
        <div className="flex gap-3 justify-end pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            size="lg"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant={variant}
            size="lg"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

