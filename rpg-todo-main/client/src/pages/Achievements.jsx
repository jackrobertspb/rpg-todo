import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Tooltip from '../components/Tooltip';
import TrophyIcon from '../components/icons/TrophyIcon';
import LockIcon from '../components/icons/LockIcon';
import StarIcon from '../components/icons/StarIcon';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Achievements() {
  const { checkAuth } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await apiClient.get('/achievements');
      const allAchievements = response.data.achievements || [];
      
      // Helper function to extract achievement category and order
      const getAchievementCategory = (name) => {
        // Extract the base category (everything before numbers/priority)
        if (name.includes('Task Creator')) return { category: 'Task Creator', order: parseInt(name.match(/\d+/)?.[0] || '0') };
        if (name.includes('Level') && name.includes('Achiever')) return { category: 'Level Achiever', order: parseInt(name.match(/\d+/)?.[0] || '0') };
        if (name.includes('Label Master')) return { category: 'Label Master', order: parseInt(name.match(/\d+/)?.[0] || '0') };
        if (name.includes('Priority')) {
          const priorities = { 'Low': 1, 'Medium': 2, 'High': 3 };
          const priority = name.includes('High') ? 'High' : name.includes('Medium') ? 'Medium' : 'Low';
          return { category: 'Priority Task', order: priorities[priority] };
        }
        // Default fallback
        return { category: name, order: 0 };
      };
      
      // Sort: Earned first, then by category and order within category
      const sorted = allAchievements.sort((a, b) => {
        // First: earned vs locked
        if (a.earned && !b.earned) return -1;
        if (!a.earned && b.earned) return 1;
        
        // Second: group by category
        const catA = getAchievementCategory(a.name);
        const catB = getAchievementCategory(b.name);
        
        if (catA.category !== catB.category) {
          return catA.category.localeCompare(catB.category);
        }
        
        // Third: sort by order within category
        return catA.order - catB.order;
      });
      
      setAchievements(sorted);
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
          "text-3xl font-sans font-bold mb-6",
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
        
        {/* Earned Achievements */}
        {achievements.some(a => a.earned) && (
          <>
            <h2 className={cn(
              "text-2xl font-sans font-bold mb-4 mt-8",
              "text-primary dark:text-white"
            )}>
              Earned ({achievements.filter(a => a.earned).length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {achievements.filter(a => a.earned).map((achievement) => (
                <Tooltip
                  key={achievement.id}
                  content={`Earned on ${new Date(achievement.earned_at).toLocaleDateString()} - ${achievement.description}`}
                  position="top"
                >
                  <Card
                    className={cn(
                      "p-6 cursor-help",
                      "bg-secondary dark:bg-secondary-light text-white"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex items-center justify-center">
                        <TrophyIcon className="w-8 h-8" color="#f59e0b" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 text-white">
                          {achievement.name}
                        </h3>
                        <p className="text-sm mb-2 text-white opacity-90">
                          {achievement.description}
                        </p>
                        {achievement.xp_bonus > 0 && (
                          <Badge variant="default" className="flex items-center gap-2 w-fit bg-black/30 py-2">
                            <StarIcon className="w-[30px] h-[30px]" color="#fbbf24" />
                            +{achievement.xp_bonus.toLocaleString()} XP Bonus
                          </Badge>
                        )}
                        {achievement.earned_at && (
                          <p className="text-xs mt-2 text-white opacity-75">
                            Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Tooltip>
              ))}
            </div>
          </>
        )}
        
        {/* Locked Achievements */}
        {achievements.some(a => !a.earned) && (
          <>
            <h2 className={cn(
              "text-2xl font-sans font-bold mb-4 mt-8",
              "text-primary dark:text-white"
            )}>
              Locked ({achievements.filter(a => !a.earned).length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.filter(a => !a.earned).map((achievement) => (
                <Tooltip
                  key={achievement.id}
                  content={`How to earn: ${achievement.description} - Reward: +${achievement.xp_bonus.toLocaleString()} XP`}
                  position="top"
                >
                  <Card className="p-6 cursor-help opacity-60">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex items-center justify-center">
                        <LockIcon className="w-8 h-8" color="#888888" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 text-primary dark:text-white">
                          {achievement.name}
                        </h3>
                        <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                          {achievement.description}
                        </p>
                        {achievement.xp_bonus > 0 && (
                          <Badge variant="secondary" className="flex items-center gap-2 w-fit py-2">
                            <StarIcon className="w-[30px] h-[30px]" color="#888888" />
                            +{achievement.xp_bonus.toLocaleString()} XP Bonus
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </Tooltip>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


