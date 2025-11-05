-- Add missing achievements per PRD lines 95-96
-- This adds Level 20 Achiever and Label Creator II & III

INSERT INTO achievements (name, description, xp_bonus, criteria_type, criteria_value) VALUES
('Level 20 Achiever', 'Reach level 20', 1000, 'level_milestone', 20),
('Label Creator II', 'Create 5 custom labels', 50, 'label_creation', 5),
('Label Creator III', 'Create 10 custom labels', 100, 'label_creation', 10)
ON CONFLICT (name) DO NOTHING;

