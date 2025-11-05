-- Fixed trigger function for auto-creating user profiles
-- This should be run in Supabase SQL Editor

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_username VARCHAR(50);
BEGIN
  -- Extract username from metadata or use email prefix
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );
  
  -- Ensure username doesn't exceed length limit
  IF LENGTH(v_username) > 50 THEN
    v_username := LEFT(v_username, 50);
  END IF;
  
  -- Make username unique by appending number if needed
  -- This is a simple approach - in production you might want more sophisticated logic
  WHILE EXISTS (SELECT 1 FROM public.user_profiles WHERE username = v_username) LOOP
    v_username := v_username || '_' || floor(random() * 1000)::text;
  END LOOP;
  
  -- Insert user profile
  INSERT INTO public.user_profiles (id, username, email, current_level, total_xp, role)
  VALUES (
    NEW.id,
    v_username,
    NEW.email,
    1,
    0,
    'User'
  )
  ON CONFLICT (id) DO NOTHING; -- Don't error if profile already exists
  
  -- Create default labels (only if profile was created)
  IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = NEW.id) THEN
    -- Profile wasn't created, exit
    RETURN NEW;
  END IF;
  
  -- Create default labels
  BEGIN
    PERFORM create_default_labels_for_user(NEW.id);
  EXCEPTION WHEN OTHERS THEN
    -- If label creation fails, log but don't fail the trigger
    RAISE WARNING 'Failed to create default labels for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't prevent user creation
  RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


