import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function ProgressBar({ currentXP, currentLevel }) {
  // Hardcoded levels data to avoid API call - matches database seed
  const levelsData = useMemo(() => [
    { level_number: 1, xp_required: 0 },
    { level_number: 2, xp_required: 100 },
    { level_number: 3, xp_required: 250 },
    { level_number: 4, xp_required: 500 },
    { level_number: 5, xp_required: 1000 },
    { level_number: 6, xp_required: 2000 },
    { level_number: 7, xp_required: 3500 },
    { level_number: 8, xp_required: 5500 },
    { level_number: 9, xp_required: 8500 },
    { level_number: 10, xp_required: 13000 },
    { level_number: 11, xp_required: 20000 },
    { level_number: 12, xp_required: 30000 },
    { level_number: 13, xp_required: 45000 },
    { level_number: 14, xp_required: 65000 },
    { level_number: 15, xp_required: 95000 },
    { level_number: 16, xp_required: 140000 },
    { level_number: 17, xp_required: 200000 },
    { level_number: 18, xp_required: 285000 },
    { level_number: 19, xp_required: 400000 },
    { level_number: 20, xp_required: 550000 },
  ], []);

  const { currentLevelInfo, nextLevelInfo, progressPercent } = useMemo(() => {
    const current = levelsData.find(l => l.level_number === currentLevel) || levelsData[0];
    const next = levelsData.find(l => l.level_number === currentLevel + 1);
    
    if (!next) {
      // Max level reached
      return {
        currentLevelInfo: current,
        nextLevelInfo: current,
        progressPercent: 100
      };
    }

    const xpForCurrentLevel = current.xp_required;
    const xpForNextLevel = next.xp_required;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const xpProgress = currentXP - xpForCurrentLevel;
    const progressPercent = Math.min(100, Math.max(0, (xpProgress / xpNeeded) * 100));

    return {
      currentLevelInfo: current,
      nextLevelInfo: next,
      progressPercent
    };
  }, [currentLevel, currentXP, levelsData]);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-white mb-1">
        <span className="font-semibold">Level {currentLevelInfo.level_number}</span>
        <span className="font-semibold">
          {nextLevelInfo.level_number > currentLevelInfo.level_number 
            ? `${Math.max(0, Math.round(currentXP - currentLevelInfo.xp_required)).toLocaleString()} / ${(nextLevelInfo.xp_required - currentLevelInfo.xp_required).toLocaleString()} XP`
            : 'Max Level'}
        </span>
      </div>
      <div className={cn(
        "w-full h-3 bg-white/20 rounded-full overflow-hidden shadow-inner"
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 relative",
            "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500",
            "shadow-[0_0_10px_rgba(250,204,21,0.6)]"
          )}
          style={{ width: `${progressPercent}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
