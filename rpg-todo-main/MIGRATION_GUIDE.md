# How to Run Database Migrations in Supabase

## Step-by-Step Guide

### 1. Open Supabase SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar (icon looks like `</>`)

### 2. Run First Migration (Schema)

1. In the SQL Editor, click **New Query** (top right)
2. Open the file `supabase/migrations/001_initial_schema.sql` from your project
3. Copy **ALL** the contents of that file
4. Paste it into the SQL Editor
5. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

**Expected Result:**
- You should see "Success. No rows returned" or similar success message
- This creates all the tables, indexes, RLS policies, and triggers

### 3. Run Second Migration (Seed Data)

1. Click **New Query** again (or clear the editor)
2. Open the file `supabase/migrations/002_seed_data.sql` from your project
3. Copy **ALL** the contents of that file
4. Paste it into the SQL Editor
5. Click **Run**

**Expected Result:**
- You should see success messages
- This creates:
  - 20 levels with XP requirements
  - 10 achievements
  - Function for creating default labels

### 4. Create Database Trigger (Auto-Create User Profiles)

1. Click **New Query** again
2. Copy and paste this SQL code:

```sql
-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, email, current_level, total_xp, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    1,
    0,
    'User'
  );
  
  -- Create default labels
  PERFORM create_default_labels_for_user(NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

3. Click **Run**

4. Create another **New Query** and paste:

```sql
-- Trigger to run function when new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

5. Click **Run**

**Expected Result:**
- Both queries should return success messages

## Verify Migrations Worked

### Check Tables Were Created

1. Go to **Table Editor** in Supabase sidebar
2. You should see these tables:
   - `levels` (should have 20 rows)
   - `achievements` (should have 10 rows)
   - `user_profiles`
   - `tasks`
   - `labels`
   - `task_labels`
   - `user_achievements`

### Check Seed Data

1. In **Table Editor**, click on `levels` table
2. You should see 20 levels (levels 1-20 with XP requirements)
3. Click on `achievements` table
4. You should see 10 achievements

### Check Functions

1. Go to **Database** → **Functions** in Supabase sidebar
2. You should see:
   - `update_updated_at_column`
   - `create_default_labels_for_user`
   - `handle_new_user`

## Troubleshooting

### "relation already exists" error
- Some tables might already exist from previous attempts
- You can either:
  - Drop and recreate (be careful - deletes data!)
  - Or just continue if the error is about a specific table that already exists

### "permission denied" error
- Make sure you're running as the database owner
- Some functions need `SECURITY DEFINER` (already included in migrations)

### "function already exists" error
- If you see this for the trigger function, it's fine - means it's already created
- You can skip that step

## After Migrations

Once migrations are complete:
1. ✅ Database schema is ready
2. ✅ Seed data (levels, achievements) is loaded
3. ✅ Trigger is set up to auto-create profiles

**Next step:** Add your Supabase keys to `.env` files and start the servers!


