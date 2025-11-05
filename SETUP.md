# RPG Todo Setup and Testing Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier works)
- PostgreSQL database access (via Supabase)

## Step 1: Set Up Supabase Database

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Run the migrations in order:
   - Copy and run `supabase/migrations/001_initial_schema.sql`
   - Copy and run `supabase/migrations/002_seed_data.sql`

4. **Important:** After running migrations, you need to set up a trigger to automatically create user profiles:
   
   Go to Database > Functions in Supabase and create a new function:
   
   ```sql
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

   Then create a trigger:
   ```sql
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

   This ensures that when a user signs up via Supabase Auth, their profile is automatically created.

## Step 2: Backend Setup (Express Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the `server` directory:
   ```env
   PORT=3001
   NODE_ENV=development
   
   # Supabase Configuration (get these from your Supabase project settings)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key
   
   # Client URL
   CLIENT_URL=http://localhost:3000
   ```

   **To get Supabase credentials:**
   - Go to your Supabase project settings
   - Project Settings > API
   - Copy the "Project URL" → `SUPABASE_URL`
   - Copy the "anon" or "public" key → `SUPABASE_ANON_KEY`
   - Copy the "service_role" key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret! Never expose this in frontend!)

4. Start the backend server:
   ```bash
   npm run dev
   ```

   The server should start on `http://localhost:3001`

5. Test the backend health endpoint:
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","message":"RPG Todo API is running"}`

## Step 3: Frontend Setup (React Client)

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the `client` directory:
   ```env
   # Supabase Configuration (get these from your Supabase project settings)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   **Note:** Use the same Supabase project as the backend. Copy the same URL and anon key.

4. Start the development server:
   ```bash
   npm run dev
   ```

   The client should start on `http://localhost:3000`

## Step 4: Testing the Application

### 1. Test Registration

1. Open `http://localhost:3000`
2. You should be redirected to `/login`
3. Click "Register"
4. Fill in:
   - Username (unique)
   - Email (valid format)
   - Password (min 8 characters)
5. Click "Register"
6. Should automatically log in and redirect to dashboard

**Expected Results:**
- User profile created in database
- Default labels created (Work, Personal, Errands, Goals)
- User starts at Level 1 with 0 XP
- Tutorial should appear (if first login)

### 2. Test Task Creation

1. On the dashboard, click "Create New Task"
2. Fill in:
   - Title: "Test Task"
   - Description: "My first task"
   - Priority: Select "High" (100 XP)
   - Due Date: Optional
   - Labels: Select one or more
3. Click "Create"
4. Task should appear in the "Incomplete Tasks" list

**Expected Results:**
- Task appears in dashboard
- Task is sorted by priority (High first)
- Check for Task Creator achievement when you create 5th, 10th, 20th task

### 3. Test Task Completion & XP

1. Click the checkbox on a task to mark it complete
2. Check the response in browser console (F12)

**Expected Results:**
- Task marked as complete
- XP earned based on priority:
  - High: 100 XP
  - Medium: 50 XP
  - Low: 25 XP
- User's total XP increases
- Check for level up if XP threshold reached
- Check for achievement notifications:
  - First High priority completion → "High Priority Task Master"
  - First Medium priority completion → "Medium Priority Task Master"
  - First Low priority completion → "Low Priority Task Master"

### 4. Test Leveling System

1. Complete multiple tasks (especially High priority for faster XP)
2. Watch the progress bar in the header
3. Check your profile page for level progress

**Expected Results:**
- Progress bar shows XP progress toward next level
- Level increases when XP threshold reached
- Level achievements unlock at levels 5, 10, 15, 20

### 5. Test Task Filtering

1. On dashboard, use the "Filter by Labels" dropdown
2. Select one or more labels
3. Task list should filter to show only tasks with selected labels

**Expected Results:**
- Only tasks with selected labels appear
- Can select multiple labels

### 6. Test Task History

1. Navigate to "History" in the header
2. Should see all completed tasks

**Expected Results:**
- List of completed tasks
- Each task shows: title, completion date, priority, XP earned, labels
- Sorted by completion date (most recent first)

### 7. Test Label Management

1. Create a new task or edit existing task
2. In the task form, you can:
   - Select existing labels
   - Create new labels (via backend API)
   - Edit labels (via backend API)
   - Delete labels (via backend API)

**Expected Results:**
- Can create unlimited custom labels
- Label Creator achievements unlock at 3, 5, 10 labels created

### 8. Test Achievements

1. Navigate to "Achievements" in the header
2. Should see all 10 achievements
3. Earned achievements show as unlocked
4. Unearned achievements show as locked

**Expected Results:**
- All achievements visible from start (PRD line 97)
- Earned achievements have checkmark/indicator
- Toast notifications when achievements earned (backend returns them, frontend should display)

### 9. Test Profile Page

1. Navigate to "Profile" in the header
2. Should see:
   - Username and email
   - Current level and XP
   - Progress bar
   - List of earned achievements
3. Click "Edit" to update username and bio

**Expected Results:**
- Profile displays all user information
- Progress bar shows current level and XP toward next level
- Achievements list shows earned achievements

### 10. Test Dark/Light Mode

1. Click the theme toggle button in the header (🌙/☀️)
2. UI should switch between dark and light themes

**Expected Results:**
- Theme switches instantly
- Preference saved in localStorage
- Maintains theme on page refresh

### 11. Test Tutorial

1. Clear localStorage: `localStorage.clear()` in browser console
2. Refresh page
3. Tutorial should appear on first login

**Expected Results:**
- Interactive tutorial appears
- Steps through key features
- Can skip or complete tutorial
- Tutorial doesn't show again after completion

## API Testing with cURL

You can also test the API directly:

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Create Task
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Test Task",
    "description": "Test description",
    "priority": "High",
    "label_ids": []
  }'
```

### Complete Task
```bash
curl -X POST http://localhost:3001/api/tasks/{task-id}/complete \
  -b cookies.txt
```

### Get Tasks
```bash
curl -X GET http://localhost:3001/api/tasks \
  -b cookies.txt
```

## Common Issues & Solutions

### 1. "Cannot connect to database"
- Check Supabase URL and service role key in `.env`
- Verify Supabase project is active
- Check if migrations ran successfully

### 2. "CORS errors"
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Backend and frontend should be running

### 3. "Authentication failed"
- Check if user was created in Supabase auth.users
- Verify session cookies are being set
- Check browser console for errors

### 4. "Tasks not appearing"
- Verify user is logged in
- Check RLS policies in Supabase
- Verify tasks belong to logged-in user

### 5. "Achievements not unlocking"
- Check browser console for achievement notifications
- Verify achievement criteria are met
- Check database `user_achievements` table

## Database Verification

You can verify data in Supabase:

1. Go to Supabase Dashboard > Table Editor
2. Check tables:
   - `user_profiles` - User data, level, XP
   - `tasks` - All tasks
   - `labels` - User labels
   - `user_achievements` - Earned achievements
   - `levels` - Should have 20 levels
   - `achievements` - Should have 10 achievements

## Next Steps

After testing, you can:
- Deploy backend to Vercel (Express server)
- Deploy frontend to Vercel
- Set up production Supabase project
- Configure production environment variables

