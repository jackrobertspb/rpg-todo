import { supabase } from '../config/supabase.js';

// Check and award achievements based on action type
export async function checkAchievements(userId, actionType, context = {}) {
  const newAchievements = [];

  try {
    if (actionType === 'task_creation') {
      // Get task count for user
      const { count, error: countError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        console.error('Error counting tasks:', countError);
        return newAchievements; // Return empty array on error
      }

      // Check for task creation achievements (PRD line 93: 5, 10, 20 tasks)
      const taskMilestones = [5, 10, 20];
      for (const milestone of taskMilestones) {
        if (count === milestone) {
          const achievement = await awardAchievement(userId, 'task_creation', milestone);
          if (achievement) newAchievements.push(achievement);
        }
      }
    }

    if (actionType === 'task_completion' && context.priority) {
      // Check if user has completed this priority before
      const { count, error: countError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('priority', context.priority)
        .eq('is_complete', true);

      if (countError) {
        console.error('Error counting completed tasks:', countError);
        return newAchievements;
      }

      // First time completing this priority (PRD line 94: one task of each priority)
      if (count === 1) {
        const priorityMap = {
          'High': 1,
          'Medium': 2,
          'Low': 3
        };
        const achievement = await awardAchievement(userId, 'task_completion', priorityMap[context.priority]);
        if (achievement) newAchievements.push(achievement);
      }
    }

    if (actionType === 'level_milestone' && context.level) {
      // Check for level milestone achievements (PRD line 95: levels 5, 10, 15, 20)
      const levelMilestones = [5, 10, 15, 20];
      if (levelMilestones.includes(context.level)) {
        const achievement = await awardAchievement(userId, 'level_milestone', context.level);
        if (achievement) newAchievements.push(achievement);
      }
    }

    if (actionType === 'label_creation') {
      // Get label count for user
      const { count, error: countError } = await supabase
        .from('labels')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        console.error('Error counting labels:', countError);
        return newAchievements;
      }

      // Check for label creation achievements (PRD line 96: 3, 5, 10 labels)
      const labelMilestones = [3, 5, 10];
      for (const milestone of labelMilestones) {
        if (count === milestone) {
          const achievement = await awardAchievement(userId, 'label_creation', milestone);
          if (achievement) newAchievements.push(achievement);
        }
      }
    }
  } catch (error) {
    console.error('Error in checkAchievements:', error);
    // Return empty array on error - don't break task creation
  }

  return newAchievements;
}

// Award an achievement to a user if not already earned
async function awardAchievement(userId, criteriaType, criteriaValue) {
  // Find achievement matching criteria
  const { data: achievement } = await supabase
    .from('achievements')
    .select('*')
    .eq('criteria_type', criteriaType)
    .eq('criteria_value', criteriaValue)
    .single();

  if (!achievement) {
    return null;
  }

  // Check if user already has this achievement
  const { data: existing } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .eq('achievement_id', achievement.id)
    .single();

  if (existing) {
    return null; // Already earned
  }

  // Award achievement
  const { data: userAchievement, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievement.id
    })
    .select(`
      *,
      achievements (
        id,
        name,
        description,
        xp_bonus
      )
    `)
    .single();

  if (error) {
    console.error('Error awarding achievement:', error);
    return null;
  }

  // Add bonus XP to user if achievement has XP bonus
  if (achievement.xp_bonus > 0) {
    const { data: user } = await supabase
      .from('user_profiles')
      .select('total_xp')
      .eq('id', userId)
      .single();

    if (user) {
      await supabase
        .from('user_profiles')
        .update({
          total_xp: user.total_xp + achievement.xp_bonus
        })
        .eq('id', userId);
    }
  }

  return userAchievement.achievements;
}


