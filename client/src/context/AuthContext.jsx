import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import apiClient from '../api/client';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session immediately
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('checkSession called');
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (process.env.NODE_ENV === 'development') {
        console.log('Session check result:', session ? 'Session exists' : 'No session');
      }
      if (session) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Session found, fetching profile for user:', session.user.id);
        }
        // Pass session to avoid re-fetching it
        await fetchUserProfile(session.user.id, session);
      } else {
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setUser(null);
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId, session = null) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('fetchUserProfile called for userId:', userId);
      }
      
      // Use provided session or get it once
      let authSession = session;
      if (!authSession) {
        const { data: { session: fetchedSession } } = await supabase.auth.getSession();
        if (!fetchedSession) {
          setUser(null);
          setLoading(false);
          return;
        }
        authSession = fetchedSession;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching profile from database...');
      }

      const { data: user, error } = await supabase
        .from('user_profiles')
        .select('id, username, email, current_level, total_xp, profile_picture_url, bio, role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
        setLoading(false);
        return;
      }

      if (!user) {
        if (process.env.NODE_ENV === 'development') {
          console.log('No user profile found');
        }
        setUser(null);
        setLoading(false);
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('User profile fetched successfully');
      }
      setUser(user);
      setLoading(false); // CRITICAL: Set loading to false on success
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (usernameOrEmail, password) => {
    // First, get email from username if needed
    let email = usernameOrEmail;
    if (!email.includes('@')) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('username', usernameOrEmail)
        .single();
      
      if (!profile) {
        throw new Error('Invalid credentials');
      }
      email = profile.email;
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Fetch user profile with session
    await fetchUserProfile(data.user.id, data.session);
    return data;
  };

  const register = async (username, email, password) => {
    // Sign up with Supabase Auth (this will trigger the database trigger to create profile)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Registration failed - no user returned');
    }

    // Wait for session to be established
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify we have a session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Registration completed but session not established. Please try logging in.');
    }

    // Wait for database trigger to create profile (give it time)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Verify profile was created, retry a few times
    let attempts = 0;
    while (attempts < 5) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profile && !profileError) {
        // Profile exists, fetch it
        await fetchUserProfile(data.user.id);
        return data;
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // If profile still doesn't exist after retries, create it manually via backend
    try {
      const response = await apiClient.post('/auth/create-profile', {
        userId: data.user.id,
        username,
        email
      });
      await fetchUserProfile(data.user.id);
      return data;
    } catch (err) {
      console.error('Profile creation error:', err);
      // Even if profile creation fails, user is created in auth
      // They can try logging in and profile will be created via trigger
      throw new Error(err.response?.data?.error || 'Registration completed but profile creation failed. Please try logging in.');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth: checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

