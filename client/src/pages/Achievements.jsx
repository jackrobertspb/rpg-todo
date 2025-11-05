import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { cn } from '../utils/cn';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await apiClient.get('/achievements');
      setAchievements(response.data.achievements || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className={cn(
      "min-h-screen",
      "bg-white dark:bg-primary-dark"
    )}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={cn(
          "text-3xl font-rpg font-bold mb-6",
          "text-primary dark:text-white"
        )}>
          Achievements
        </h1>
        <p className={cn(
          "mb-6 text-lg",
          "text-primary dark:text-white"
        )}>
          View all available achievements. Complete tasks, level up, and create labels to earn them!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "p-6 rounded-lg border",
                achievement.earned
                  ? "bg-secondary dark:bg-secondary-dark border-secondary-dark dark:border-secondary text-white"
                  : "bg-white dark:bg-primary border-primary dark:border-primary-light text-primary dark:text-white opacity-60"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">
                  {achievement.earned ? '🏆' : '🔒'}
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    "font-bold text-lg mb-2",
                    achievement.earned ? "text-white" : "text-primary dark:text-white"
                  )}>
                    {achievement.name}
                  </h3>
                  <p className={cn(
                    "text-sm mb-2",
                    achievement.earned ? "text-white opacity-90" : "text-gray-600 dark:text-gray-400"
                  )}>
                    {achievement.description}
                  </p>
                  {achievement.xp_bonus > 0 && (
                    <p className={cn(
                      "text-xs font-medium",
                      achievement.earned ? "text-white opacity-75" : "text-gray-500 dark:text-gray-500"
                    )}>
                      +{achievement.xp_bonus} XP Bonus
                    </p>
                  )}
                  {achievement.earned && achievement.earned_at && (
                    <p className="text-xs mt-2 text-white opacity-75">
                      Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


