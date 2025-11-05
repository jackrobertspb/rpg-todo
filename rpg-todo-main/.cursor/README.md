# Cursor AI Documentation Index

Welcome to the RPG Todo project! This folder contains comprehensive documentation to help Cursor AI understand and continue development of this project.

## 📚 Documentation Overview

### Start Here
- **[QUICK_START.md](QUICK_START.md)** - Fast overview to get started immediately
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - High-level project description and goals

### Implementation Status
- **[CURRENT_STATE.md](CURRENT_STATE.md)** - What's complete, what's not, feature checklist
- **[KNOWN_ISSUES.md](KNOWN_ISSUES.md)** - Bugs, technical debt, and areas for improvement

### Technical References
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design decisions
- **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** - Complete database reference
- **[API_REFERENCE.md](API_REFERENCE.md)** - Backend API documentation
- **[FRONTEND_COMPONENTS.md](FRONTEND_COMPONENTS.md)** - React component structure

---

## 🚀 Quick Navigation

### I want to...

**Understand the project**
→ Read [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) and [QUICK_START.md](QUICK_START.md)

**Know what's already built**
→ Read [CURRENT_STATE.md](CURRENT_STATE.md)

**Fix a bug**
→ Check [KNOWN_ISSUES.md](KNOWN_ISSUES.md) first

**Add a new feature**
→ Check [ARCHITECTURE.md](ARCHITECTURE.md) and [CURRENT_STATE.md](CURRENT_STATE.md)

**Understand authentication**
→ Read [ARCHITECTURE.md](ARCHITECTURE.md) - Authentication section

**Add an API endpoint**
→ Read [API_REFERENCE.md](API_REFERENCE.md) and [ARCHITECTURE.md](ARCHITECTURE.md)

**Understand the database**
→ Read [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

**Work on the frontend**
→ Read [FRONTEND_COMPONENTS.md](FRONTEND_COMPONENTS.md)

**Set up locally**
→ Read root [SETUP.md](../SETUP.md) or [ENV_SETUP.md](../ENV_SETUP.md)

---

## 📊 Project Status Summary

### Overall Status: ~90% Complete

**✅ Fully Working**:
- User authentication (register, login, logout)
- Task CRUD operations (backend APIs complete)
- XP calculation and leveling (20 levels)
- Achievement system (10 achievements, auto-detection)
- Custom labels with filtering
- Task history
- User profiles with edit
- Dark/light mode
- Tutorial system

**⚠️ Partially Working**:
- Task edit/delete (APIs exist, no UI)
- Achievement notifications (detected but not shown)
- Profile picture (field exists, no upload)

**❌ Not Implemented**:
- Toast notification system
- Task edit/delete UI
- Profile picture upload
- Some achievements missing from seeds

### Top 3 Priorities
1. Add toast notification component for achievements
2. Add task edit/delete UI
3. Fix missing achievements in seed data

---

## 🏗️ Architecture Summary

```
┌─────────────────┐         ┌─────────────────┐
│  React Frontend │ ←────→ │ Express Backend │
│  (Vite, Tailwind)│         │  (RESTful API)  │
└─────────────────┘         └─────────────────┘
         │                           │
         └───────────┬───────────────┘
                     ▼
         ┌─────────────────────────┐
         │  Supabase PostgreSQL    │
         │  + Auth + RLS Policies  │
         └─────────────────────────┘
```

- **Frontend**: React 18, React Router, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Supabase JS client
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Auth**: JWT tokens via Supabase Auth

---

## 📁 Project Structure

```
rpg-todo-main/
├── .cursor/                 ← You are here!
│   ├── README.md           ← This file
│   ├── QUICK_START.md
│   ├── PROJECT_OVERVIEW.md
│   ├── CURRENT_STATE.md
│   ├── KNOWN_ISSUES.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_REFERENCE.md
│   └── FRONTEND_COMPONENTS.md
│
├── client/                  ← React frontend
│   ├── src/
│   │   ├── api/            ← API client (Axios)
│   │   ├── components/     ← React components
│   │   ├── context/        ← AuthContext, ThemeContext
│   │   ├── pages/          ← Page components
│   │   ├── lib/            ← Supabase client
│   │   └── utils/          ← Utilities
│   ├── package.json
│   └── vite.config.js
│
├── server/                  ← Express backend
│   ├── src/
│   │   ├── config/         ← Supabase config
│   │   ├── middleware/     ← Auth middleware
│   │   ├── routes/         ← API routes
│   │   └── services/       ← Business logic
│   └── package.json
│
├── supabase/               ← Database
│   └── migrations/         ← SQL migrations
│
├── docs/                   ← Additional docs
│   ├── coding-standards/
│   └── rpg-todo-prd-2025-10-23.md  ← Product Requirements
│
├── README.md
├── SETUP.md                ← Full setup guide
├── ENV_SETUP.md           ← Environment variables guide
└── MIGRATION_GUIDE.md     ← Database setup guide
```

---

## 🎯 Core Features

1. **Task Management** - Create tasks with priority (High/Medium/Low), description, due date, labels
2. **XP & Leveling** - Earn 100/50/25 XP for High/Medium/Low priority tasks, level up through 20 levels
3. **Achievements** - Unlock 10 achievements for milestones (task creation, completion, leveling, labels)
4. **Custom Labels** - Organize tasks with unlimited custom labels, filter by labels
5. **User Profiles** - Username, bio, level, XP, achievements, profile picture (upload not implemented)
6. **Dark Mode** - Toggle between dark and light themes
7. **Tutorial** - Interactive tutorial for first-time users

---

## 🔑 Key Technical Details

### Authentication
- **Supabase Auth** handles user credentials (JWT tokens)
- **Database trigger** automatically creates user profile on signup
- **Row Level Security (RLS)** ensures users can only see their own data
- Frontend uses AuthContext to manage auth state

### XP Calculation
```javascript
High priority   = 100 XP
Medium priority = 50 XP
Low priority    = 25 XP
```

### Achievements
- Auto-detected by backend when actions occur
- Awards bonus XP when unlocked
- 10 total: Task Creator I/II/III, Priority Masters, Level Achievers, Label Creator

### Security
- RLS policies on all tables
- JWT validation via middleware
- Service role key only in backend (never exposed)
- Anon key in frontend (respects RLS)

---

## 🛠️ Development Workflow

### Running Locally
```bash
# Backend (Terminal 1)
cd server && npm install && npm run dev

# Frontend (Terminal 2)
cd client && npm install && npm run dev
```

### Making Changes
1. Check existing documentation
2. Follow coding standards in `docs/coding-standards/`
3. Test locally
4. Update documentation if needed

### Common Tasks
- **Add feature**: Check PRD → Check if API exists → Implement UI → Test
- **Fix bug**: Check KNOWN_ISSUES.md → Reproduce → Fix → Test
- **Modify DB**: Create migration → Run in Supabase → Update docs
- **Add API**: Create route → Add to API_REFERENCE.md → Test

---

## 📖 External Documentation

### Root Documentation (Outside .cursor/)
- **[SETUP.md](../SETUP.md)** - Complete setup and testing guide
- **[ENV_SETUP.md](../ENV_SETUP.md)** - How to set up environment variables
- **[MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md)** - How to run database migrations
- **[SUPABASE_SETUP.md](../SUPABASE_SETUP.md)** - Supabase keys setup

### Product Requirements
- **[docs/rpg-todo-prd-2025-10-23.md](../docs/rpg-todo-prd-2025-10-23.md)** - Full PRD with user stories

### Coding Standards
- **[docs/coding-standards/](../docs/coding-standards/)** - Framework-specific standards
  - react-standards.mdc
  - express-standards.mdc
  - supabase-standards.mdc
  - tailwind-standards.mdc
  - shadcn-standards.mdc

---

## 🐛 Known Issues Summary

### Critical (Must Fix)
- None currently

### High Priority
1. Achievement notifications not visible to users
2. Missing achievements in seed data (Level 20, Label Creator II/III)
3. No task edit/delete UI (APIs exist)

### Medium Priority
4. Profile picture upload not implemented
5. Tutorial could be more interactive
6. No loading states on individual actions
7. Generic error messages (using alert())

See [KNOWN_ISSUES.md](KNOWN_ISSUES.md) for complete list.

---

## 📝 Documentation Maintenance

### When to Update Documentation

**CURRENT_STATE.md**:
- After completing a major feature
- After fixing a high-priority issue
- When updating feature checklist

**KNOWN_ISSUES.md**:
- When discovering a new bug
- When fixing an issue (move to resolved section)
- When adding technical debt

**API_REFERENCE.md**:
- When adding/modifying API endpoints
- When changing request/response format

**DATABASE_SCHEMA.md**:
- When running new migrations
- When adding/modifying tables
- When changing RLS policies

**ARCHITECTURE.md**:
- When making architectural decisions
- When adding new patterns
- When changing tech stack

---

## 🎓 Learning Resources

### For Understanding the Codebase
1. Start with [QUICK_START.md](QUICK_START.md) - 5 min read
2. Read [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - 10 min read
3. Skim [ARCHITECTURE.md](ARCHITECTURE.md) - 15 min read
4. Reference other docs as needed

### For Specific Topics
- **React patterns**: [FRONTEND_COMPONENTS.md](FRONTEND_COMPONENTS.md)
- **Database queries**: [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
- **API endpoints**: [API_REFERENCE.md](API_REFERENCE.md)
- **Auth flow**: [ARCHITECTURE.md](ARCHITECTURE.md) - Authentication section

---

## 💡 Tips for Cursor AI

1. **Always check documentation first** - Most answers are already here
2. **Update docs when making changes** - Keep documentation current
3. **Follow existing patterns** - Consistency is important
4. **Test locally before committing** - Ensure changes work
5. **Reference PRD for requirements** - Don't guess at features
6. **Check KNOWN_ISSUES** - Don't re-report known bugs

---

## 📞 Getting Help

If you're stuck:
1. Read the relevant documentation in this folder
2. Check the PRD for requirements
3. Look at existing similar code for patterns
4. Check KNOWN_ISSUES for context on problems

---

## 🎉 Project Context

This project was **started with ChatGPT** and is now being **continued with Cursor AI**.

**What's Good**:
- Core architecture is solid
- Backend is complete and working
- Frontend is ~90% complete
- Database schema is well-designed
- Security (RLS) is properly implemented

**What Needs Work**:
- UI polish (notifications, loading states)
- Missing some UI features (edit/delete)
- Error handling could be better
- No tests yet

**Overall**: The foundation is strong. Focus on polish and user experience improvements.

---

## 📅 Last Updated

Documentation last updated: **2025-11-05**

Project status as of last update: **~90% complete, functional MVP**

---

## 🚀 Next Steps

Recommended immediate next steps:

1. **Read QUICK_START.md** - Get familiar with the project (5 min)
2. **Run locally** - Follow SETUP.md to run the app (15 min)
3. **Explore the code** - Look at Dashboard.jsx and tasks.js (20 min)
4. **Pick a task** - Choose from KNOWN_ISSUES.md high priority items
5. **Make changes** - Follow coding standards, test locally
6. **Update docs** - Keep documentation current

---

**Welcome to RPG Todo!** This documentation should give you everything you need to continue development. If you find gaps in documentation, please add to it. Good luck! 🎮

