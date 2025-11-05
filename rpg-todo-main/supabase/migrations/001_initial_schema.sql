-- RPG Todo Application Database Schema
-- Supabase/PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Levels table (seeded with 20 levels)
CREATE TABLE levels (
    id SERIAL PRIMARY KEY,
    level_number INTEGER NOT NULL UNIQUE,
    xp_required INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements table (seeded with 10 achievements)
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    xp_bonus INTEGER DEFAULT 0,
    criteria_type VARCHAR(50) NOT NULL, -- 'task_creation', 'task_completion', 'level_milestone', 'label_creation'
    criteria_value INTEGER NOT NULL, -- e.g., 5 tasks, level 10, 3 labels
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
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

-- Labels table (for custom labels)
CREATE TABLE labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Tasks table
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

-- Task-Label many-to-many relationship
CREATE TABLE task_labels (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (task_id, label_id)
);

-- User-Achievement junction table (tracks earned achievements)
CREATE TABLE user_achievements (
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, achievement_id)
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_is_complete ON tasks(is_complete);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_user_complete ON tasks(user_id, is_complete);
CREATE INDEX idx_labels_user_id ON labels(user_id);
CREATE INDEX idx_task_labels_task_id ON task_labels(task_id);
CREATE INDEX idx_task_labels_label_id ON task_labels(label_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see and modify their own profile
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- RLS Policy: Users can only see and modify their own tasks
CREATE POLICY "Users can view own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
    ON tasks FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policy: Users can only see and modify their own labels
CREATE POLICY "Users can view own labels"
    ON labels FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own labels"
    ON labels FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own labels"
    ON labels FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own labels"
    ON labels FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policy: Users can only see their own task labels
CREATE POLICY "Users can view own task labels"
    ON task_labels FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = task_labels.task_id
            AND tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own task labels"
    ON task_labels FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = task_labels.task_id
            AND tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own task labels"
    ON task_labels FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = task_labels.task_id
            AND tasks.user_id = auth.uid()
        )
    );

-- RLS Policy: Users can only see their own achievements
CREATE POLICY "Users can view own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
    ON user_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Levels and Achievements are public read
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view levels"
    ON levels FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view achievements"
    ON achievements FOR SELECT
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_labels_updated_at
    BEFORE UPDATE ON labels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
    BEFORE UPDATE ON achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_levels_updated_at
    BEFORE UPDATE ON levels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


