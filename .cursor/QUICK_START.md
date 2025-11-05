# Quick Start Guide for Cursor AI

This is a quick reference guide to get Cursor AI up to speed on the RPG Todo project.

## Project Summary

**RPG Todo** is a gamified task management app where users:
- Create tasks with priorities (High/Medium/Low)
- Earn XP (100/50/25) for completing tasks
- Level up through 20 levels
- Unlock 10 achievements
- Organize tasks with custom labels

**Tech Stack**: React + Vite | Express | Supabase (Postgres + Auth)

---

## Key Files to Know

### Documentation (Start Here!)
- `.cursor/PROJECT_OVERVIEW.md` - High-level overview
- `.cursor/CURRENT_STATE.md` - What's done, what's not
- `.cursor/ARCHITECTURE.md` - Technical architecture
- `.cursor/DATABASE_SCHEMA.md` - Database reference
- `.cursor/API_REFERENCE.md` - Backend API docs
- `.cursor/KNOWN_ISSUES.md` - Known issues and bugs

### Frontend (React)
- `client/src/App.jsx` - Main app with routing
- `client/src/context/AuthContext.jsx` - Auth state management
- `client/src/pages/Dashboard.jsx` - Main dashboard (most complex)
- `client/src/components/` - Reusable components
- `client/src/api/client.js` - Axios instance for API calls

### Backend (Express)
- `server/src/index.js` - Server entry point
- `server/src/routes/tasks.js` - Task CRUD + completion logic
- `server/src/services/xpService.js` - XP calculation and level up
- `server/src/services/achievementService.js` - Achievement checking

### Database
- `supabase/migrations/001_initial_schema.sql` - Schema
- `supabase/migrations/002_seed_data.sql` - Seed data (20 levels, 10 achievements)

---

## Current Project Status

### ✅ Completed Features
- User registration and login (Supabase Auth)
- Task CRUD (create, read, update, delete) - APIs done
- Task completion with XP rewards
- 20-level progression system
- 10 achievements with auto-detection
- Custom labels with filtering
- Dark/light mode toggle
- Tutorial for new users
- Dashboard, Profile, Achievements, History pages

### ⚠️ Main Gaps
1. **No toast notifications** - Achievements detected but not shown to user
2. **No task edit/delete UI** - Backend APIs exist, no frontend buttons
3. **Missing 3 achievements in seeds** - Level 20, Label Creator II & III
4. **Profile picture upload** - Field exists, no upload UI

### 📋 Quick Priorities
1. Add toast notification component
2. Add edit/delete buttons to TaskList
3. Update seed file with missing achievements

---

## How to Run Locally

```bash
# 1. Setup Supabase
# - Create Supabase project
# - Run migrations in SQL Editor (001, 002)
# - Copy URL and keys

# 2. Setup Environment Variables
# server/.env
PORT=3001
SUPABASE_URL=your-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key
CLIENT_URL=http://localhost:3000

# client/.env
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# 3. Start Backend
cd server
npm install
npm run dev  # Runs on port 3001

# 4. Start Frontend
cd client
npm install
npm run dev  # Runs on port 3000
```

---

## Common Development Tasks

### Add a New Feature
1. Check PRD: `docs/rpg-todo-prd-2025-10-23.md`
2. Check if backend API exists: `API_REFERENCE.md`
3. Check database schema: `DATABASE_SCHEMA.md`
4. Implement frontend component
5. Test locally

### Fix a Bug
1. Check `KNOWN_ISSUES.md` for context
2. Reproduce locally
3. Fix and test
4. Update `CURRENT_STATE.md` if it's a major fix

### Add a New API Endpoint
1. Add route in `server/src/routes/`
2. Add business logic in `server/src/services/` if needed
3. Update `API_REFERENCE.md`
4. Test with curl or Postman

### Modify Database
1. Create new migration file `supabase/migrations/006_description.sql`
2. Run in Supabase SQL Editor
3. Update `DATABASE_SCHEMA.md`
4. Update seed data if needed

---

## Architecture Quick Reference

### Authentication Flow
```
User → Supabase Auth → JWT Token → Frontend stores session
                     ↓
                Database trigger creates user_profiles row
                     ↓
              Frontend fetches profile → AuthContext stores user
                     ↓
        API calls include JWT in Authorization header
                     ↓
         Backend validates JWT → Extracts user ID → Queries database
```

### Task Completion Flow
```
User clicks checkbox → API POST /tasks/:id/complete
    ↓
Backend: Calculate XP (High=100, Medium=50, Low=25)
    ↓
Backend: Update task (is_complete=true, xp_earned=100)
    ↓
Backend: Update user (total_xp += 100, check level up)
    ↓
Backend: Check achievements (first High priority? Level milestone?)
    ↓
Backend: Award achievements (insert user_achievements, add bonus XP)
    ↓
Backend: Return { task, xp_earned, level_up, new_achievements }
    ↓
Frontend: Refresh data, show notifications
```

### Database Security (RLS)
- Each table has RLS policies
- Users can only see their own data (filtered by `auth.uid() = user_id`)
- Backend uses service role key (bypasses RLS) for admin operations
- Frontend uses anon key (respects RLS) for direct queries

---

## Coding Standards

### React
- Functional components with hooks (no classes)
- One component per file
- Use `useCallback` and `useMemo` for performance
- Tailwind CSS for styling
- See `docs/coding-standards/react-standards.mdc`

### Express
- RESTful API design
- Validate inputs on every endpoint
- Return proper HTTP status codes
- Use middleware for auth
- See `docs/coding-standards/express-standards.mdc`

### Database
- Use RLS policies for security
- Add indexes for performance
- Use triggers for automatic actions
- See `docs/coding-standards/supabase-standards.mdc`

---

## Common Patterns

### Fetching Data in React
```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    try {
      const response = await apiClient.get('/endpoint');
      setData(response.data.items);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

### Creating API Endpoint
```javascript
// server/src/routes/example.js
router.get('/items', requireSupabaseAuth, async (req, res) => {
  try {
    const userId = req.userId;
    
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', userId);
    
    if (error) return res.status(500).json({ error: error.message });
    
    res.json({ items: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Checking Achievements
```javascript
// In any service after user action
const achievements = await checkAchievements(userId, 'action_type', context);
return { ...response, new_achievements: achievements };
```

---

## Useful Commands

```bash
# Backend
cd server
npm run dev          # Start dev server (auto-reload)
npm start            # Start production server

# Frontend
cd client
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
# Run in Supabase SQL Editor (no CLI tool used)

# Git
git status
git add .
git commit -m "Description"
git push
```

---

## When You're Stuck

1. **Read the documentation in `.cursor/`** - Most answers are there
2. **Check `KNOWN_ISSUES.md`** - Your issue might be documented
3. **Check `CURRENT_STATE.md`** - See what's implemented
4. **Read the PRD** - `docs/rpg-todo-prd-2025-10-23.md` has all requirements
5. **Check existing code** - Similar features are already implemented

---

## Key Concepts

### XP System
- High priority task = 100 XP
- Medium priority task = 50 XP
- Low priority task = 25 XP
- XP requirements grow exponentially (Level 20 = 550,000 XP)

### Achievements
- 10 achievements total (as per seed file)
- Auto-detected and awarded by backend
- Each achievement gives bonus XP
- Types: task_creation, task_completion, level_milestone, label_creation

### Labels
- User-specific (each user has their own)
- Default labels: Work, Personal, Errands, Goals
- Many-to-many with tasks (task_labels junction table)

### Authentication
- Supabase Auth handles credentials
- JWT tokens for API auth
- RLS policies enforce data isolation
- Database trigger creates profiles automatically

---

## Important Notes

1. **Service Role Key** - NEVER expose in frontend, only in backend
2. **RLS Policies** - Always consider security when querying
3. **User ID** - Always filter by user_id to prevent data leaks
4. **Achievements** - Backend automatically checks, no manual triggering needed
5. **Environment Variables** - Different for dev/prod, never commit .env files

---

## Next Development Steps

Based on `KNOWN_ISSUES.md`, recommended next tasks:

1. **Add Toast Notifications** (High Priority)
   - Install Radix Toast or similar
   - Create Toast component
   - Show on achievement unlock
   - Show on errors

2. **Add Task Edit/Delete UI** (High Priority)
   - Add edit button to TaskList
   - Make TaskForm support edit mode
   - Add delete button with confirmation

3. **Fix Missing Achievements** (High Priority)
   - Add Level 20 achievement to seed
   - Add Label Creator II and III to seed
   - Update CURRENT_STATE.md

4. **Improve Error Handling** (Medium Priority)
   - Replace alert() with toast notifications
   - Better error messages
   - Loading states on buttons

---

## Contact & Resources

- **PRD**: `docs/rpg-todo-prd-2025-10-23.md`
- **Setup Guide**: `SETUP.md`
- **Database Guide**: `MIGRATION_GUIDE.md`
- **Env Setup**: `ENV_SETUP.md`

---

## Tips for Cursor AI

- Always check `.cursor/` documentation before asking questions
- When implementing features, check if backend API exists first
- Follow existing code patterns (consistency is key)
- Update `CURRENT_STATE.md` when completing major features
- Add new issues to `KNOWN_ISSUES.md` when discovered
- Test locally before marking features complete

---

**Welcome to RPG Todo!** You're now up to speed. Happy coding! 🚀

