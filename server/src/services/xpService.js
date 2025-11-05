import { supabase } from '../config/supabase.js';
import { checkAchievements as checkAchievementsService } from './achievementService.js';

// Calculate XP based on task priority (PRD line 68)
export function calculateXP(priority) {
  const xpValues = {
    'High': 100,
    'Medium': 50,
    'Low': 25
  };
  return xpValues[priority] || 0;
}

// Update user XP and level, return new level and whether level up occurred
export async function updateUserXPAndLevel(userId, xpEarned) {
  // Get current user data
  const { data: user, error: userError } = await supabase
    .from('user_profiles')
    .select('total_xp, current_level')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    throw new Error('User not found');
  }

  // Add XP earned (only task XP, achievement bonuses are added separately when earned)
  let newTotalXP = user.total_xp + xpEarned;

  // Determine new level based on XP
  const { data: levels } = await supabase
    .from('levels')
    .select('level_number, xp_required')
    .order('level_number', { ascending: true });

  let newLevel = user.current_level;
  let levelUp = false;

  // Find the highest level the user qualifies for
  for (const level of levels) {
    if (newTotalXP >= level.xp_required && level.level_number > newLevel) {
      newLevel = level.level_number;
      levelUp = true;
    }
  }

  // Cap at level 20 (PRD line 69, 173)
  if (newLevel > 20) {
    newLevel = 20;
  }

  // Update user profile
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({
      total_xp: newTotalXP,
      current_level: newLevel
    })
    .eq('id', userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { newLevel, levelUp, newTotalXP };
}

// Re-export achievement checking
export { checkAchievementsService as checkAchievements };


