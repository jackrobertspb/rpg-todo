import express from 'express';
import { supabase } from '../config/supabase.js';
import { requireSupabaseAuth } from '../middleware/supabaseAuth.js';

const router = express.Router();

// All achievement routes require authentication
router.use(requireSupabaseAuth);

// Get all achievements (PRD line 97: display all achievements from the start)
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;

    // Get all achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .order('name', { ascending: true });

    if (achievementsError) {
      return res.status(500).json({ error: achievementsError.message });
    }

    // Get user's earned achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id, earned_at')
      .eq('user_id', userId);

    if (userAchievementsError) {
      return res.status(500).json({ error: userAchievementsError.message });
    }

    const earnedAchievementIds = new Set(
      userAchievements.map(ua => ua.achievement_id)
    );

    // Mark which achievements the user has earned
    const achievementsWithStatus = achievements.map(achievement => ({
      ...achievement,
      earned: earnedAchievementIds.has(achievement.id),
      earned_at: userAchievements.find(
        ua => ua.achievement_id === achievement.id
      )?.earned_at || null
    }));

    res.json({ achievements: achievementsWithStatus });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's earned achievements
router.get('/earned', async (req, res) => {
  try {
    const userId = req.userId;

    const { data: userAchievements, error } = await supabase
      .from('user_achievements')
      .select(`
        earned_at,
        achievements (
          id,
          name,
          description,
          xp_bonus
        )
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ achievements: userAchievements });
  } catch (error) {
    console.error('Get earned achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

