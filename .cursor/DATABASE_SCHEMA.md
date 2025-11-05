# Database Schema Reference

## Overview

The RPG Todo application uses **Supabase (PostgreSQL)** as its database. The schema includes:
- User profiles extending Supabase Auth
- Task management with labels
- Leveling system (20 levels)
- Achievement system (10 achievements)
- Row Level Security (RLS) for data protection

## Tables

### `levels`

Stores the 20 levels with exponential XP requirements.

```sql
CREATE TABLE levels (
    id SERIAL PRIMARY KEY,
    level_number INTEGER NOT NULL UNIQUE,
    xp_required INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Data**: 20 rows, levels 1-20
- Level 1: 0 XP
- Level 2: 100 XP
- Level 3: 250 XP
- ...
- Level 20: 550,000 XP

**RLS**: Public read access (anyone can view levels)

---

### `achievements`

Stores the 10 achievement definitions.

```sql
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    xp_bonus INTEGER DEFAULT 0,
    criteria_type VARCHAR(50) NOT NULL,
    criteria_value INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields**:
- `name`: Achievement name (e.g., "Task Creator I")
- `description`: Achievement description
- `xp_bonus`: Bonus XP awarded when earned
- `criteria_type`: Type of achievement
  - `task_creation` - Creating N tasks
  - `task_completion` - Completing task of priority (1=High, 2=Medium, 3=Low)
  - `level_milestone` - Reaching level N
  - `label_creation` - Creating N labels
- `criteria_value`: Numeric value for criteria (e.g., 5 tasks, level 10)

**Data**: 10 rows
1. Task Creator I (5 tasks) - 50 XP
2. Task Creator II (10 tasks) - 100 XP
3. Task Creator III (20 tasks) - 200 XP
4. High Priority Task Master (1st high priority) - 25 XP
5. Medium Priority Task Master (1st medium priority) - 15 XP
6. Low Priority Task Master (1st low priority) - 10 XP
7. Level 5 Achiever - 100 XP
8. Level 10 Achiever - 250 XP
9. Level 15 Achiever - 500 XP
10. Label Creator I (3 labels) - 30 XP

**RLS**: Public read access

---

### `user_profiles`

User profile data, extends Supabase auth.users.

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    current_level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    profile_picture_url TEXT,
    bio TEXT,
    role VARCHAR(20) DEFAULT 'User',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_level FOREIGN KEY (current_level) REFERENCES levels(level_number)
);
```

**Fields**:
- `id`: UUID from auth.users (same ID)
- `username`: Unique username (50 chars max)
- `email`: User's email
- `current_level`: Current level (1-20)
- `total_xp`: Total XP accumulated
- `profile_picture_url`: URL to profile picture (optional)
- `bio`: User bio (optional)
- `role`: Always 'User' for now

**RLS Policies**:
- Users can SELECT their own profile
- Users can UPDATE their own profile

**Created By**: Database trigger `on_auth_user_created` when user signs up

---

### `labels`

Custom labels for organizing tasks (user-specific).

```sql
CREATE TABLE labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);
```

**Fields**:
- `name`: Label name (e.g., "Work", "Personal")
- `user_id`: Owner of the label

**Constraints**:
- Unique constraint on (user_id, name) - no duplicate label names per user

**Default Labels**: Work, Personal, Errands, Goals (created automatically on registration)

**RLS Policies**:
- Users can SELECT their own labels
- Users can INSERT their own labels
- Users can UPDATE their own labels
- Users can DELETE their own labels

**Indexes**:
- `idx_labels_user_id` on user_id

---

### `tasks`

User tasks with priority, completion status, and XP.

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    due_date DATE,
    is_complete BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields**:
- `title`: Task title (required, max 255 chars)
- `description`: Task description (optional)
- `priority`: Must be 'High', 'Medium', or 'Low'
- `due_date`: Optional due date
- `is_complete`: Completion status
- `completed_at`: Timestamp when completed
- `xp_earned`: XP earned when completed (calculated on completion)

**XP Values**:
- High: 100 XP
- Medium: 50 XP
- Low: 25 XP

**RLS Policies**:
- Users can SELECT their own tasks
- Users can INSERT their own tasks
- Users can UPDATE their own tasks

**Indexes**:
- `idx_tasks_user_id` on user_id
- `idx_tasks_is_complete` on is_complete
- `idx_tasks_priority` on priority
- `idx_tasks_user_complete` on (user_id, is_complete)

---

### `task_labels`

Many-to-many relationship between tasks and labels.

```sql
CREATE TABLE task_labels (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (task_id, label_id)
);
```

**Relationship**: 
- One task can have many labels
- One label can be on many tasks

**RLS Policies**:
- Users can SELECT task_labels for their own tasks
- Users can INSERT task_labels for their own tasks
- Users can DELETE task_labels for their own tasks

**Indexes**:
- `idx_task_labels_task_id` on task_id
- `idx_task_labels_label_id` on label_id

---

### `user_achievements`

Junction table tracking which achievements users have earned.

```sql
CREATE TABLE user_achievements (
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, achievement_id)
);
```

**Fields**:
- `earned_at`: Timestamp when achievement was earned

**RLS Policies**:
- Users can SELECT their own achievements
- Users can INSERT their own achievements

**Indexes**:
- `idx_user_achievements_user_id` on user_id

---

## Database Functions

### `update_updated_at_column()`

Trigger function that automatically updates the `updated_at` timestamp on UPDATE.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Used On**: user_profiles, tasks, labels, achievements, levels

---

### `create_default_labels_for_user(user_uuid UUID)`

Creates default labels for a new user.

```sql
CREATE OR REPLACE FUNCTION create_default_labels_for_user(user_uuid UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO labels (name, user_id) VALUES
    ('Work', user_uuid),
    ('Personal', user_uuid),
    ('Errands', user_uuid),
    ('Goals', user_uuid)
    ON CONFLICT (user_id, name) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Called By**: `handle_new_user()` trigger

---

### `handle_new_user()`

Trigger function that automatically creates a user profile when a user signs up via Supabase Auth.

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
  
  PERFORM create_default_labels_for_user(NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Trigger**: `on_auth_user_created` AFTER INSERT ON auth.users

**What it does**:
1. Creates user_profiles row with same ID as auth.users
2. Sets username from metadata or derives from email
3. Initializes user at level 1 with 0 XP
4. Creates default labels for the user

---

## Common Queries

### Get user with level info
```sql
SELECT 
  up.*,
  l.xp_required as next_level_xp
FROM user_profiles up
LEFT JOIN levels l ON l.level_number = up.current_level + 1
WHERE up.id = 'user-uuid';
```

### Get tasks with labels
```sql
SELECT 
  t.*,
  ARRAY_AGG(
    json_build_object('id', l.id, 'name', l.name)
  ) FILTER (WHERE l.id IS NOT NULL) as labels
FROM tasks t
LEFT JOIN task_labels tl ON t.id = tl.task_id
LEFT JOIN labels l ON tl.label_id = l.id
WHERE t.user_id = 'user-uuid'
GROUP BY t.id;
```

### Get earned achievements
```sql
SELECT 
  ua.earned_at,
  a.*
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.id
WHERE ua.user_id = 'user-uuid'
ORDER BY ua.earned_at DESC;
```

### Get all achievements with earned status
```sql
SELECT 
  a.*,
  ua.earned_at IS NOT NULL as is_earned,
  ua.earned_at
FROM achievements a
LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = 'user-uuid'
ORDER BY a.criteria_type, a.criteria_value;
```

## Migration Files

### 001_initial_schema.sql
- Creates all tables
- Sets up indexes
- Configures RLS policies
- Creates trigger functions
- Sets up updated_at triggers

### 002_seed_data.sql
- Seeds 20 levels
- Seeds 10 achievements
- Creates `create_default_labels_for_user()` function

### 003_fix_trigger.sql
- Fixes user profile creation trigger

### 004_fix_rls_insert.sql
- Fixes RLS policies for INSERT operations

### 005_fix_rls_policies.sql
- Additional RLS policy fixes

## Row Level Security (RLS) Summary

### User-Specific Data (Isolated by user)
- `user_profiles` - users see only their own profile
- `tasks` - users see only their own tasks
- `labels` - users see only their own labels
- `task_labels` - users see only labels for their tasks
- `user_achievements` - users see only their own achievements

### Public Read Data (Everyone can read)
- `levels` - all users can see all levels
- `achievements` - all users can see all achievements

### Security Notes
1. All RLS uses `auth.uid()` to match current authenticated user
2. CASCADE deletes ensure data cleanup when user deleted
3. Service role key bypasses RLS (used in backend with caution)
4. Anon key respects RLS (used in frontend)

