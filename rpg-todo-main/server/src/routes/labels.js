import express from 'express';
import { supabase } from '../config/supabase.js';
import { requireSupabaseAuth } from '../middleware/supabaseAuth.js';
import { checkAchievements } from '../services/achievementService.js';

const router = express.Router();

// All label routes require authentication
router.use(requireSupabaseAuth);

// Get all labels for current user
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;

    const { data: labels, error } = await supabase
      .from('labels')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ labels });
  } catch (error) {
    console.error('Get labels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create label
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Label name is required' });
    }

    // Check if label already exists for this user
    const { data: existing } = await supabase
      .from('labels')
      .select('*')
      .eq('user_id', userId)
      .eq('name', name.trim())
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Label with this name already exists' });
    }

    // Create label (PRD line 112: unlimited custom labels)
    const { data: label, error: createError } = await supabase
      .from('labels')
      .insert({
        user_id: userId,
        name: name.trim()
      })
      .select()
      .single();

    if (createError) {
      return res.status(500).json({ error: createError.message });
    }

    // Check for label creation achievements
    const achievements = await checkAchievements(userId, 'label_creation');

    res.status(201).json({
      label,
      new_achievements: achievements
    });
  } catch (error) {
    console.error('Create label error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update label
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.userId;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Label name is required' });
    }

    // Verify label belongs to user
    const { data: existing } = await supabase
      .from('labels')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Label not found' });
    }

    // Check if new name conflicts with existing label
    const { data: conflict } = await supabase
      .from('labels')
      .select('*')
      .eq('user_id', userId)
      .eq('name', name.trim())
      .neq('id', id)
      .single();

    if (conflict) {
      return res.status(400).json({ error: 'Label with this name already exists' });
    }

    // Update label
    const { data: label, error: updateError } = await supabase
      .from('labels')
      .update({
        name: name.trim()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    res.json({ label });
  } catch (error) {
    console.error('Update label error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete label
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify label belongs to user
    const { data: label } = await supabase
      .from('labels')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!label) {
      return res.status(404).json({ error: 'Label not found' });
    }

    // Delete label (cascades to task_labels due to foreign key)
    const { error } = await supabase
      .from('labels')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Label deleted successfully' });
  } catch (error) {
    console.error('Delete label error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

