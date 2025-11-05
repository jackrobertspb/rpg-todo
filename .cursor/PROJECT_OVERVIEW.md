# RPG Todo - Project Overview

## What is RPG Todo?

RPG Todo is a **gamified task management application** that motivates users to complete their to-do lists by rewarding them with:
- **Experience Points (XP)** for completing tasks
- **Level progression** (20 levels with exponential XP requirements)
- **Achievements** (10 achievements for various milestones)
- **Custom labels** for task organization

## Tech Stack

### Frontend
- **Framework**: React 18 (functional components with hooks)
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI primitives
- **HTTP Client**: Axios
- **Auth**: Supabase Auth (client-side)

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Row Level Security (RLS)
- **API Style**: RESTful JSON API

### Database
- **Platform**: Supabase (managed PostgreSQL)
- **Security**: Row Level Security (RLS) policies
- **Auth**: Supabase Auth (handles user registration/login)

## Core Features

### 1. User Authentication & Profiles
- User registration with username, email, password
- Login with username or email
- User profiles showing:
  - Username, email, profile picture, bio
  - Current level and total XP
  - Achievements earned
  - Progress bar for level advancement

### 2. Task Management
- Create tasks with:
  - Title, description
  - Priority (High/Medium/Low)
  - Due date
  - Custom labels (unlimited)
- Mark tasks as complete
- View task history (completed tasks)
- Filter tasks by labels
- Prioritized task list (High priority shown first)

### 3. XP & Leveling System
- XP awarded based on task priority:
  - High: 100 XP
  - Medium: 50 XP
  - Low: 25 XP
- 20 levels with exponential XP requirements
- Progress bars in header and profile
- Level-up triggers level milestone achievements

### 4. Achievement System
10 achievements total:
- **Task Creation**: Create 5, 10, 20 tasks
- **Task Completion**: Complete first High/Medium/Low priority task
- **Level Milestones**: Reach levels 5, 10, 15
- **Label Creation**: Create 3 custom labels

Each achievement awards bonus XP.

### 5. Custom Labels
- Unlimited custom labels per user
- Default labels on registration: Work, Personal, Errands, Goals
- Create, edit, delete labels
- Assign multiple labels to tasks
- Filter tasks by labels

### 6. UI/UX Features
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Tutorial**: Interactive first-time user tutorial
- **Fantasy RPG Aesthetic**: Deep blues and greens color palette
- **Responsive Design**: Mobile-friendly
- **Tooltips**: On form fields and achievements

## Project Structure

```
rpg-todo-main/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/              # API client (Axios)
│   │   ├── components/       # React components
│   │   ├── context/          # React context (Auth, Theme)
│   │   ├── lib/              # Supabase client
│   │   ├── pages/            # Page components
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/           # Supabase config
│   │   ├── middleware/       # Auth middleware
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── index.js          # Server entry point
│   └── package.json
│
├── supabase/                  # Database
│   └── migrations/           # SQL migrations
│       ├── 001_initial_schema.sql
│       ├── 002_seed_data.sql
│       └── ...
│
├── docs/                      # Documentation
│   ├── coding-standards/     # Coding standards by framework
│   └── rpg-todo-prd-2025-10-23.md  # Product Requirements Document
│
├── .cursor/                   # Cursor AI documentation (this folder)
│
├── README.md
├── SETUP.md                   # Complete setup guide
├── ENV_SETUP.md              # Environment variables guide
└── MIGRATION_GUIDE.md        # Database migration guide
```

## Key Design Decisions

### Authentication Architecture
- **Supabase Auth** handles user credentials (in auth.users table)
- **Database Trigger** (`handle_new_user`) automatically creates user profile on signup
- **Frontend** uses Supabase JS client for auth state management
- **Backend** validates Supabase JWT tokens via middleware
- **RLS Policies** ensure users can only access their own data

### XP & Achievement Flow
1. User completes task → Backend calculates XP based on priority
2. Backend updates user's total_xp and checks for level up
3. Backend checks for achievements (task completion, level milestone)
4. Backend returns: task data, xp_earned, level_up flag, new_achievements array
5. Frontend shows notifications and refreshes user data

### Label Management
- Labels are user-specific (each user has their own labels)
- Default labels created automatically on registration
- Many-to-many relationship: tasks ↔ task_labels ↔ labels

## Environment Setup

### Required Environment Variables

**Server (.env)**:
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...
CLIENT_URL=http://localhost:3000
```

**Client (.env)**:
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Development Workflow

1. **Database**: Run migrations in Supabase SQL Editor
2. **Backend**: `cd server && npm install && npm run dev`
3. **Frontend**: `cd client && npm install && npm run dev`
4. **Access**: Open http://localhost:3000

## Current Status

**✅ Fully Implemented:**
- User registration and login
- Task CRUD operations
- XP calculation and leveling
- Achievement system
- Label management
- Task history
- Dark/Light mode
- Tutorial system
- Profile page

**⚠️ Potential Improvements:**
- Toast notifications (currently using console.log)
- Profile picture upload
- Task editing UI
- Task deletion UI
- Achievement notifications UI
- Level 20 achievement (not in current seeds)
- Label Creator II and III achievements (not in current seeds)

## Related Documentation

- **SETUP.md**: Complete setup instructions
- **docs/rpg-todo-prd-2025-10-23.md**: Full Product Requirements Document
- **CURRENT_STATE.md**: Implementation status and checklist
- **ARCHITECTURE.md**: Technical architecture details
- **DATABASE_SCHEMA.md**: Database structure reference
- **API_REFERENCE.md**: Backend API endpoints
- **FRONTEND_COMPONENTS.md**: React component structure

