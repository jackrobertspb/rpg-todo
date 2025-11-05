-- Fix RLS policies for user_profiles
-- Run this in Supabase SQL Editor

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON user_profiles;

-- Create improved policies
-- Policy 1: Allow users to view their own profile
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Allow users to update their own profile
CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy 3: Allow INSERT (used by trigger function)
CREATE POLICY "Allow profile creation"
    ON user_profiles FOR INSERT
    WITH CHECK (true);

-- Verify policies are enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;


