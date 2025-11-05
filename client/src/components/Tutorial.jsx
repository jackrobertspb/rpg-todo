import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Tutorial({ onComplete }) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    {
      title: 'Welcome to RPG Todo!',
      content: 'Complete tasks to earn XP and level up. Higher priority tasks give more XP.',
      button: 'Next',
    },
    {
      title: 'Create Your First Task',
      content: 'Click "Create New Task" to add tasks. Set priority (High=100 XP, Medium=50 XP, Low=25 XP).',
      button: 'Next',
    },
    {
      title: 'Use Labels',
      content: 'Organize tasks with labels like "Work", "Personal", "Errands", and "Goals". Create custom labels too!',
      button: 'Next',
    },
    {
      title: 'Unlock Achievements',
      content: 'Earn achievements by creating tasks, completing them, leveling up, and creating custom labels. Check the Achievements page to see all available achievements!',
      button: 'Next',
    },
    {
      title: 'Track Your Progress',
      content: 'Check your Profile to see your level, XP, and earned achievements. The progress bar in the header shows your journey to the next level. Now start completing tasks and level up!',
      button: 'Got it!',
    },
  ];

  const currentStep = steps[step];

  // Close tutorial if user navigates away from dashboard
  useEffect(() => {
    if (location.pathname !== '/dashboard') {
      onComplete();
    }
  }, [location.pathname, onComplete]);

  const handleNext = () => {
    if (currentStep.action) {
      currentStep.action();
    } else if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Final step - complete tutorial
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-black bg-opacity-50",
      "p-4"
    )}>
      <div className={cn(
        "w-full max-w-md p-6 rounded-lg",
        "bg-white dark:bg-primary",
        "shadow-xl"
      )}>
        <div className="flex justify-between items-start mb-4">
          <h2 className={cn(
            "text-2xl font-sans font-bold",
            "text-primary dark:text-white"
          )}>
            {currentStep.title}
          </h2>
          <button
            onClick={handleSkip}
            className={cn(
              "text-xl",
              "text-primary dark:text-white",
              "hover:text-secondary"
            )}
            aria-label="Skip tutorial"
          >
            ✕
          </button>
        </div>
        <p className={cn(
          "mb-6 text-lg",
          "text-primary dark:text-white"
        )}>
          {currentStep.content}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Step {step + 1} of {steps.length}
          </div>
          <button
            onClick={handleNext}
            className={cn(
              "px-6 py-2 rounded font-medium",
              "bg-secondary hover:bg-secondary-light",
              "text-white transition-colors"
            )}
          >
            {currentStep.button}
          </button>
        </div>
        <div className="mt-4 flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 flex-1 rounded",
                index === step
                  ? "bg-secondary"
                  : "bg-gray-300 dark:bg-gray-600"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


