import express from 'express';
import { supabase } from '../config/supabase.js';
import { requireSupabaseAuth } from '../middleware/supabaseAuth.js';

const router = express.Router();

// All profile routes require authentication
router.use(requireSupabaseAuth);

// Get user profile with stats
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;

    // Get user profile
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('id, username, email, current_level, total_xp, profile_picture_url, bio, role')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's earned achievements
    const { data: userAchievements, error: achievementsError } = await supabase
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
      .eq('user_id', userId);

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
    }

    // Get current level info
    const { data: currentLevel, error: levelError } = await supabase
      .from('levels')
      .select('*')
      .eq('level_number', user.current_level)
      .single();

    // Get next level info
    const { data: nextLevel } = await supabase
      .from('levels')
      .select('*')
      .eq('level_number', user.current_level + 1)
      .single();

    res.json({
      user: {
        ...user,
        achievements: userAchievements || [],
        currentLevelInfo: currentLevel,
        nextLevelInfo: nextLevel
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/', async (req, res) => {
  try {
    const userId = req.userId;
    const { username, profile_picture_url, bio } = req.body;

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (profile_picture_url !== undefined) updateData.profile_picture_url = profile_picture_url;
    if (bio !== undefined) updateData.bio = bio;

    // If updating username, check uniqueness
    if (username) {
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .neq('id', userId)
        .single();

      if (existing) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    const { data: user, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select('id, username, email, current_level, total_xp, profile_picture_url, bio, role')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

