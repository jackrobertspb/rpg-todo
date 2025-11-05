-- Seed initial data: Levels, Achievements, and Default Labels
-- This migration seeds the database with foundation data

-- Seed 20 levels with exponential XP requirements
-- Formula: XP required = base * (multiplier ^ (level - 1))
-- Using exponential growth: XP increases exponentially up to level 20
INSERT INTO levels (level_number, xp_required) VALUES
(1, 0),    -- Level 1: Starting level, no XP required
(2, 100),  -- Level 2: 100 XP
(3, 250),  -- Level 3: 250 XP
(4, 500),  -- Level 4: 500 XP
(5, 1000), -- Level 5: 1,000 XP
(6, 2000), -- Level 6: 2,000 XP
(7, 3500), -- Level 7: 3,500 XP
(8, 5500), -- Level 8: 5,500 XP
(9, 8500), -- Level 9: 8,500 XP
(10, 13000), -- Level 10: 13,000 XP
(11, 20000), -- Level 11: 20,000 XP
(12, 30000), -- Level 12: 30,000 XP
(13, 45000), -- Level 13: 45,000 XP
(14, 65000), -- Level 14: 65,000 XP
(15, 95000), -- Level 15: 95,000 XP
(16, 140000), -- Level 16: 140,000 XP
(17, 200000), -- Level 17: 200,000 XP
(18, 285000), -- Level 18: 285,000 XP
(19, 400000), -- Level 19: 400,000 XP
(20, 550000); -- Level 20: 550,000 XP

-- Seed 13 achievements (PRD lines 93-96)
-- Task Creator I-III (3), Priority Masters (3), Level Achievers (4), Label Creator I-III (3)
INSERT INTO achievements (name, description, xp_bonus, criteria_type, criteria_value) VALUES
-- Task creation achievements (PRD line 93: 5, 10, 20 tasks)
('Task Creator I', 'Create 5 tasks', 50, 'task_creation', 5),
('Task Creator II', 'Create 10 tasks', 100, 'task_creation', 10),
('Task Creator III', 'Create 20 tasks', 200, 'task_creation', 20),

-- Task completion by priority achievements (PRD line 94: one task of each priority)
('High Priority Task Master', 'Complete a high priority task', 25, 'task_completion', 1),
('Medium Priority Task Master', 'Complete a medium priority task', 15, 'task_completion', 2),
('Low Priority Task Master', 'Complete a low priority task', 10, 'task_completion', 3),

-- Level milestone achievements (PRD line 95: levels 5, 10, 15, and 20)
('Level 5 Achiever', 'Reach level 5', 100, 'level_milestone', 5),
('Level 10 Achiever', 'Reach level 10', 250, 'level_milestone', 10),
('Level 15 Achiever', 'Reach level 15', 500, 'level_milestone', 15),
('Level 20 Achiever', 'Reach level 20', 1000, 'level_milestone', 20),

-- Label Creator achievements (PRD line 96: creating 3, 5, and 10 custom labels)
('Label Creator I', 'Create 3 custom labels', 30, 'label_creation', 3),
('Label Creator II', 'Create 5 custom labels', 50, 'label_creation', 5),
('Label Creator III', 'Create 10 custom labels', 100, 'label_creation', 10);

-- Function to create default labels for a new user upon registration
-- Default labels: 'Work', 'Personal', 'Errands', 'Goals' (PRD line 82, 287)
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

-- Note: The PRD mentions default labels should be seeded, but these are user-specific
-- Default labels will be created for each user upon registration via application logic
-- rather than as global seeded data, since labels are user-specific with UNIQUE(user_id, name)

