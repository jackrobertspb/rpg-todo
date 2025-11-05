import express from 'express';
import { supabase } from '../config/supabase.js';
import { requireSupabaseAuth } from '../middleware/supabaseAuth.js';
import { calculateXP, updateUserXPAndLevel } from '../services/xpService.js';
import { checkAchievements } from '../services/achievementService.js';

const router = express.Router();

// All task routes require authentication via Supabase token
router.use(requireSupabaseAuth);

// Get all tasks for current user (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { is_complete, label_ids, priority } = req.query;
    const userId = req.userId;

    let query = supabase
      .from('tasks')
      .select(`
        *,
        task_labels (
          label_id,
          labels (
            id,
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    // Filter by completion status
    if (is_complete !== undefined) {
      query = query.eq('is_complete', is_complete === 'true');
    }

    // Filter by priority
    if (priority) {
      query = query.eq('priority', priority);
    }

    const { data: tasks, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Filter by labels if provided
    let filteredTasks = tasks;
    if (label_ids) {
      const labelIdsArray = Array.isArray(label_ids) ? label_ids : [label_ids];
      filteredTasks = tasks.filter(task => {
        const taskLabelIds = task.task_labels.map(tl => tl.label_id);
        return labelIdsArray.some(lid => taskLabelIds.includes(lid));
      });
    }

    res.json({ tasks: filteredTasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get task completion history
router.get('/history', async (req, res) => {
  try {
    const userId = req.userId;

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        id,
        title,
        priority,
        completed_at,
        xp_earned,
        task_labels (
          label_id,
          labels (
            id,
            name
          )
        )
      `)
      .eq('user_id', userId)
      .eq('is_complete', true)
      .order('completed_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ tasks });
  } catch (error) {
    console.error('Get task history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        task_labels (
          label_id,
          labels (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, due_date, label_ids } = req.body;
    const userId = req.userId;

    if (!title || !priority) {
      return res.status(400).json({ error: 'Title and priority are required' });
    }

    if (!['High', 'Medium', 'Low'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be High, Medium, or Low' });
    }

    // Create task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title,
        description,
        priority,
        due_date: due_date || null,
        is_complete: false
      })
      .select()
      .single();

    if (taskError) {
      return res.status(500).json({ error: taskError.message });
    }

    // Assign labels if provided
    if (label_ids && label_ids.length > 0) {
      const taskLabels = label_ids.map(labelId => ({
        task_id: task.id,
        label_id: labelId
      }));

      const { error: labelError } = await supabase
        .from('task_labels')
        .insert(taskLabels);

      if (labelError) {
        console.error('Error assigning labels:', labelError);
        // Don't fail the request if labels fail
      }
    }

    // Check for task creation achievements (wrap in try-catch to prevent breaking task creation)
    let achievements = [];
    try {
      achievements = await checkAchievements(userId, 'task_creation');
    } catch (error) {
      console.error('Error checking achievements:', error);
      // Continue even if achievement check fails
    }

    // Get task with labels
    const { data: taskWithLabels, error: fetchError } = await supabase
      .from('tasks')
      .select(`
        *,
        task_labels (
          label_id,
          labels (
            id,
            name
          )
        )
      `)
      .eq('id', task.id)
      .single();

    if (fetchError) {
      console.error('Error fetching task with labels:', fetchError);
      // Return task without labels if fetch fails
      res.status(201).json({
        task: task,
        new_achievements: achievements
      });
      return;
    }

    res.status(201).json({
      task: taskWithLabels,
      new_achievements: achievements
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DEBUG: Delete all completed tasks
router.delete('/debug/delete-completed', async (req, res) => {
  try {
    const userId = req.userId;

    // Delete all completed tasks for this user
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', userId)
      .eq('is_complete', true);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'All completed tasks deleted' });
  } catch (error) {
    console.error('Delete completed tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark task as complete
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    console.log(`[Task Complete] Attempting to complete task ${id} for user ${userId}`);

    // Get task to check it exists and belongs to user
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (taskError || !task) {
      console.error(`[Task Complete] Task not found:`, taskError);
      return res.status(404).json({ error: 'Task not found' });
    }

    console.log(`[Task Complete] Task found:`, { id: task.id, title: task.title, is_complete: task.is_complete });

    if (task.is_complete) {
      console.warn(`[Task Complete] Task ${id} is already complete!`);
      return res.status(400).json({ error: 'Task is already complete' });
    }

    // Calculate XP based on priority (PRD line 68)
    const xpEarned = calculateXP(task.priority);

    // Update task to complete
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({
        is_complete: true,
        completed_at: new Date().toISOString(),
        xp_earned: xpEarned
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    // Update user XP and level
    const { newLevel, levelUp } = await updateUserXPAndLevel(userId, xpEarned);

    // Check for achievements
    const achievements = await checkAchievements(userId, 'task_completion', {
      priority: task.priority
    });

    // If leveled up, check for level achievements
    let levelAchievements = [];
    if (levelUp) {
      levelAchievements = await checkAchievements(userId, 'level_milestone', {
        level: newLevel
      });
    }

    // Get task with labels
    const { data: taskWithLabels } = await supabase
      .from('tasks')
      .select(`
        *,
        task_labels (
          label_id,
          labels (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    res.json({
      task: taskWithLabels,
      xp_earned: xpEarned,
      new_level: newLevel,
      level_up: levelUp,
      new_achievements: [...achievements, ...levelAchievements]
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, due_date, label_ids } = req.body;
    const userId = req.userId;

    // Verify task belongs to user
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update task
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) {
      if (!['High', 'Medium', 'Low'].includes(priority)) {
        return res.status(400).json({ error: 'Priority must be High, Medium, or Low' });
      }
      updateData.priority = priority;
    }
    if (due_date !== undefined) updateData.due_date = due_date;

    const { data: task, error: updateError } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    // Update labels if provided
    if (label_ids !== undefined) {
      // Delete existing labels
      await supabase
        .from('task_labels')
        .delete()
        .eq('task_id', id);

      // Insert new labels
      if (label_ids.length > 0) {
        const taskLabels = label_ids.map(labelId => ({
          task_id: id,
          label_id: labelId
        }));

        await supabase
          .from('task_labels')
          .insert(taskLabels);
      }
    }

    // Get task with labels
    const { data: taskWithLabels } = await supabase
      .from('tasks')
      .select(`
        *,
        task_labels (
          label_id,
          labels (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    res.json({ task: taskWithLabels });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify task belongs to user
    const { data: task } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Delete task (cascades to task_labels)
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

