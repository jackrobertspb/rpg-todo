-- Fix RLS policies for user_profiles to allow INSERT
-- Run this in Supabase SQL Editor

-- Allow INSERT for user_profiles (used by trigger)
CREATE POLICY "Allow profile creation"
    ON user_profiles FOR INSERT
    WITH CHECK (true);

-- Also ensure the trigger function can insert
-- The trigger uses SECURITY DEFINER so it should bypass RLS, but let's be explicit


