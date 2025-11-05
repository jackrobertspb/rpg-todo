import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Check username availability
router.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    res.json({ available: true });
  } catch (error) {
    // Username doesn't exist (single() returns error when no match)
    res.json({ available: true });
  }
});

// Create profile for existing auth user (fallback if trigger fails)
router.post('/create-profile', async (req, res) => {
  try {
    const { userId, username, email } = req.body;

    if (!userId || !username || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if profile already exists
    const { data: existing, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (existing) {
      return res.json({ message: 'Profile already exists', user: existing });
    }

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is fine
      console.error('Error checking profile:', checkError);
    }

    // Create user profile (using service role which bypasses RLS)
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        username,
        email,
        current_level: 1,
        total_xp: 0,
        role: 'User'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return res.status(400).json({ 
        error: profileError.message || 'Failed to create profile',
        details: profileError
      });
    }

    // Create default labels for user
    const { error: labelError } = await supabase.rpc('create_default_labels_for_user', { 
      user_uuid: userId 
    });

    if (labelError) {
      console.error('Label creation error:', labelError);
      // Don't fail if labels can't be created
    }

    res.status(201).json({
      message: 'Profile created successfully',
      user: profileData
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for development
      user_metadata: {
        username
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        username,
        email,
        current_level: 1,
        total_xp: 0,
        role: 'User'
      })
      .select()
      .single();

    if (profileError) {
      // Cleanup auth user if profile creation fails
      await supabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: profileError.message });
    }

    // Create default labels for user
    await supabase.rpc('create_default_labels_for_user', { user_uuid: userId });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        username,
        email,
        level: 1,
        xp: 0
      },
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user - returns Supabase session tokens
router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/email and password are required' });
    }

    // Get user profile to find email if username provided
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id, username, email')
      .or(`username.eq.${usernameOrEmail},email.eq.${usernameOrEmail}`)
      .single();

    if (!userProfile) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: userProfile.email,
      password
    });

    if (authError) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: userProfile.id,
        username: userProfile.username,
        email: userProfile.email
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    // Supabase handles logout via client
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Get current user from Supabase token
router.get('/me', async (req, res) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify token with Supabase
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('id, username, email, current_level, total_xp, profile_picture_url, bio, role')
      .eq('id', authUser.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

