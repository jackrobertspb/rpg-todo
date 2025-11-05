# Technical Architecture

## System Overview

RPG Todo is a **full-stack web application** with:
- **React SPA** frontend (client-side rendering)
- **Express.js** backend API (RESTful)
- **Supabase** for database and authentication
- **JWT-based authentication** with Row Level Security

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  React Frontend (Vite)                 │  │
│  │  - React Router                                        │  │
│  │  - Tailwind CSS                                        │  │
│  │  - Supabase JS Client (Auth)                          │  │
│  │  - Axios (API calls)                                   │  │
│  └───────────────────────────────────────────────────────┘  │
│           │                                      │            │
│           │ Auth                                 │ API        │
│           ▼                                      ▼            │
└───────────┼──────────────────────────────────────┼───────────┘
            │                                      │
            │                                      │
    ┌───────▼──────────┐              ┌───────────▼──────────┐
    │  Supabase Auth   │              │   Express Backend    │
    │  ┌────────────┐  │              │  ┌──────────────┐   │
    │  │ auth.users │  │              │  │   Routing    │   │
    │  └────────────┘  │              │  │  Middleware  │   │
    │                  │              │  │   Services   │   │
    └──────────────────┘              │  └──────────────┘   │
            │                         │         │            │
            │ Trigger                 │         │ RPC        │
            │                         └─────────┼────────────┘
            │                                   │
    ┌───────▼───────────────────────────────────▼───────────┐
    │              Supabase PostgreSQL                      │
    │  ┌──────────────────────────────────────────────┐    │
    │  │  Tables: user_profiles, tasks, labels,       │    │
    │  │          achievements, levels, ...           │    │
    │  └──────────────────────────────────────────────┘    │
    │  ┌──────────────────────────────────────────────┐    │
    │  │  RLS Policies (Row Level Security)           │    │
    │  └──────────────────────────────────────────────┘    │
    │  ┌──────────────────────────────────────────────┐    │
    │  │  Triggers & Functions                        │    │
    │  └──────────────────────────────────────────────┘    │
    └───────────────────────────────────────────────────────┘
```

---

## Frontend Architecture (React)

### Technology Stack
- **React 18**: Functional components with hooks
- **Vite**: Fast build tool and dev server
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: Reusable component primitives (built on Radix UI)
- **Axios**: HTTP client with interceptors
- **Supabase JS**: Client for authentication

### Folder Structure
```
client/src/
├── api/
│   └── client.js              # Axios instance with auth interceptor
├── components/                # Reusable UI components
│   ├── Header.jsx            # Navigation header with theme toggle
│   ├── ProgressBar.jsx       # XP/level progress visualization
│   ├── TaskForm.jsx          # Task creation form
│   ├── TaskList.jsx          # Task list display
│   └── Tutorial.jsx          # First-time user tutorial
├── context/                   # React Context providers
│   ├── AuthContext.jsx       # Authentication state management
│   └── ThemeContext.jsx      # Dark/light mode state
├── lib/
│   └── supabase.js           # Supabase client instance
├── pages/                     # Page-level components
│   ├── Achievements.jsx      # Achievements page
│   ├── Dashboard.jsx         # Main dashboard
│   ├── Login.jsx             # Login page
│   ├── Profile.jsx           # User profile page
│   ├── Register.jsx          # Registration page
│   └── TaskHistory.jsx       # Completed tasks history
├── utils/
│   └── cn.js                 # Tailwind class name utility
├── App.jsx                    # Root component with routing
├── main.jsx                   # Entry point
└── index.css                  # Global styles + Tailwind
```

### Component Architecture

#### Component Patterns
- **Functional components** with hooks (no class components)
- **Single responsibility**: Each component has one job
- **Composition over inheritance**: Build complex UIs from simple components
- **Controlled components**: Form inputs managed by React state
- **Custom hooks**: Reusable logic (e.g., `useAuth()`)

#### State Management

**Local State** (useState):
- Component-specific UI state (form inputs, loading states, etc.)

**Context State** (React Context):
- **AuthContext**: Global auth state (user, login, logout)
- **ThemeContext**: Global theme state (dark/light mode)

**Server State** (fetched via API):
- Tasks, achievements, labels fetched from backend
- Stored in component state
- Refetched on mutations

**No global state library** (Redux, Zustand) - not needed for this app size.

### Routing

```jsx
<Routes>
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
  <Route path="/history" element={<PrivateRoute><TaskHistory /></PrivateRoute>} />
  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
  <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
  <Route path="/" element={<Navigate to="/dashboard" />} />
</Routes>
```

**PrivateRoute**: Redirects to `/login` if not authenticated
**PublicRoute**: Redirects to `/dashboard` if already authenticated

### Authentication Flow (Frontend)

1. User signs up via Supabase Auth (supabase.auth.signUp)
2. Supabase returns user + session (JWT token)
3. Frontend stores session in localStorage (handled by Supabase SDK)
4. AuthContext checks session on mount (supabase.auth.getSession)
5. AuthContext listens for auth changes (supabase.auth.onAuthStateChange)
6. On auth state change, fetch user profile from database
7. Store user profile in AuthContext state
8. All API calls include JWT in Authorization header (via Axios interceptor)

### API Client (Axios)

```javascript
// api/client.js
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Response interceptor: Handle 401 (redirect to login)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Styling Approach

**Tailwind CSS** with utility classes:
```jsx
<div className="bg-white dark:bg-primary-dark p-4 rounded-lg">
```

**Custom Tailwind Config** (`tailwind.config.js`):
```javascript
theme: {
  extend: {
    colors: {
      primary: '#1e3a5f',
      'primary-light': '#2c5282',
      'primary-dark': '#0f1e33',
      secondary: '#2d6a4f',
      'secondary-light': '#40916c',
      'secondary-dark': '#1b4332',
    },
    fontFamily: {
      rpg: ['MedievalSharp', 'serif'],
    }
  }
}
```

**`cn()` utility**: Merges Tailwind classes with conditional logic
```javascript
import { cn } from '../utils/cn';
<div className={cn("base-class", condition && "conditional-class")} />
```

---

## Backend Architecture (Express)

### Technology Stack
- **Node.js**: Runtime (v18+)
- **Express.js**: Web framework
- **Supabase JS**: Database client + admin SDK
- **dotenv**: Environment variables
- **CORS**: Cross-origin requests

### Folder Structure
```
server/src/
├── config/
│   ├── supabase.js           # Supabase client (service role)
│   └── supabaseClient.js     # Supabase client (anon key)
├── middleware/
│   ├── auth.js               # Legacy auth middleware
│   └── supabaseAuth.js       # Supabase JWT validation middleware
├── routes/                    # Express route handlers
│   ├── achievements.js
│   ├── auth.js
│   ├── labels.js
│   ├── profile.js
│   └── tasks.js
├── services/                  # Business logic
│   ├── achievementService.js # Achievement checking logic
│   └── xpService.js          # XP calculation and level up logic
└── index.js                   # Server entry point
```

### API Architecture

**RESTful JSON API**:
- **Resource-based URLs**: `/api/tasks`, `/api/achievements`, etc.
- **HTTP methods**: GET, POST, PUT, DELETE
- **JSON payloads**: All requests and responses use JSON
- **Status codes**: 200, 201, 400, 401, 404, 500

**Route Structure**:
```javascript
// index.js
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/profile', profileRoutes);
```

### Middleware Stack

1. **CORS**: Allow requests from frontend
2. **express.json()**: Parse JSON bodies
3. **express.urlencoded()**: Parse URL-encoded bodies
4. **requireSupabaseAuth**: Validate JWT token (on protected routes)

**Auth Middleware** (`middleware/supabaseAuth.js`):
```javascript
export async function requireSupabaseAuth(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });
  
  req.userId = user.id;
  next();
}
```

### Business Logic (Services)

#### XP Service (`services/xpService.js`)

**calculateXP(priority)**:
- High → 100 XP
- Medium → 50 XP
- Low → 25 XP

**updateUserXPAndLevel(userId, xpEarned)**:
1. Get user's current total_xp and current_level
2. Add xpEarned to total_xp
3. Check if total_xp >= next level's xp_required
4. If yes, increment current_level
5. Update user_profiles with new total_xp and current_level
6. Return { newLevel, levelUp: true/false }

#### Achievement Service (`services/achievementService.js`)

**checkAchievements(userId, actionType, context)**:

Checks if user earned any achievements based on action.

**Action Types**:
- `task_creation`: Check if user reached 5, 10, or 20 tasks
- `task_completion`: Check if first task of this priority (High/Medium/Low)
- `level_milestone`: Check if reached level 5, 10, 15, or 20
- `label_creation`: Check if reached 3, 5, or 10 labels

**Logic**:
1. Count relevant items (tasks, labels, level)
2. Check if count matches any achievement criteria
3. If match, call `awardAchievement()`
4. Return array of newly earned achievements

**awardAchievement(userId, criteriaType, criteriaValue)**:
1. Find achievement matching criteria
2. Check if user already has it
3. If not, insert into user_achievements
4. Add xp_bonus to user's total_xp
5. Return achievement object

---

## Database Architecture (Supabase)

### Supabase Components

**Supabase = Postgres + Auth + Realtime + Storage + Edge Functions**

RPG Todo uses:
- ✅ **Postgres Database**: Main data storage
- ✅ **Auth**: User authentication (JWT tokens)
- ✅ **Row Level Security (RLS)**: Data isolation
- ❌ **Realtime**: Not used (no subscriptions)
- ❌ **Storage**: Not used (no file uploads yet)
- ❌ **Edge Functions**: Not used

### Database Access Patterns

**Two Supabase Clients**:

1. **Service Role Client** (backend only):
   - Uses `SUPABASE_SERVICE_ROLE_KEY`
   - **Bypasses RLS** - full database access
   - Used for admin operations (creating profiles, checking achievements)
   - ⚠️ Never expose to frontend

2. **Anon Key Client** (frontend):
   - Uses `SUPABASE_ANON_KEY`
   - **Respects RLS** - only sees user's own data
   - Used for auth and direct database queries
   - Safe to expose in frontend

**Why both?**:
- Frontend uses anon key for auth (safe)
- Backend uses service role for operations that need full access
- Backend validates user identity via JWT, then uses service role for queries

### Row Level Security (RLS)

**How it works**:
1. User logs in via Supabase Auth
2. Supabase returns JWT token
3. JWT contains user ID (`auth.uid()`)
4. Database RLS policies use `auth.uid()` to filter queries
5. User can only see/modify their own data

**Example Policy**:
```sql
CREATE POLICY "Users can view own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);
```

**Why it's secure**:
- Even if frontend is compromised, user can't access other users' data
- Database enforces security, not application code
- SQL injection safe (uses parameterized queries)

### Database Triggers

**`on_auth_user_created` Trigger**:

When user signs up via Supabase Auth:
1. Trigger fires on INSERT to `auth.users`
2. Calls `handle_new_user()` function
3. Function creates user_profiles row
4. Function calls `create_default_labels_for_user()`
5. Function creates 4 default labels

**Why use triggers?**:
- Automatic profile creation (no backend call needed)
- Guaranteed to run (can't forget)
- Transactional (all-or-nothing)

---

## Authentication & Security

### Authentication Flow (Complete)

**Registration**:
1. User submits registration form (frontend)
2. Frontend calls `supabase.auth.signUp(email, password, { data: { username } })`
3. Supabase creates user in `auth.users` table
4. Database trigger `on_auth_user_created` fires
5. Trigger creates row in `user_profiles` with same ID
6. Trigger creates default labels for user
7. Supabase returns user + session
8. Frontend stores session in localStorage
9. Frontend fetches user profile from database
10. Frontend redirects to dashboard

**Login**:
1. User submits login form (frontend)
2. Frontend looks up email from username (if username provided)
3. Frontend calls `supabase.auth.signInWithPassword(email, password)`
4. Supabase validates credentials
5. Supabase returns user + session (JWT token)
6. Frontend stores session in localStorage
7. Frontend fetches user profile from database
8. Frontend redirects to dashboard

**Authenticated API Calls**:
1. Frontend gets session from Supabase
2. Frontend extracts JWT token from session
3. Frontend includes token in Authorization header
4. Backend middleware validates JWT with Supabase
5. Backend extracts user ID from JWT
6. Backend queries database with user ID filter

### Security Best Practices

✅ **Implemented**:
- Passwords hashed by Supabase (bcrypt)
- JWT tokens for stateless auth
- Row Level Security (RLS) enforced in database
- Service role key only in backend (never exposed)
- CORS configured (only allows specific origin)
- Input validation on backend
- Parameterized queries (Supabase client prevents SQL injection)

⚠️ **Could Improve**:
- Rate limiting (not implemented)
- CSRF protection (not needed for JWT auth, but could add)
- Input sanitization (basic, could be more thorough)
- Error messages (could be more generic in production)

---

## Data Flow Examples

### Task Completion Flow

```
1. User clicks checkbox on task (Frontend)
   └─> handleTaskComplete(taskId)

2. Frontend makes API call
   └─> POST /api/tasks/:id/complete

3. Backend validates auth (middleware)
   └─> Extract userId from JWT

4. Backend fetches task from database
   └─> Verify task belongs to user
   └─> Check if already complete

5. Backend calculates XP (xpService)
   └─> priority: High → 100 XP

6. Backend updates task
   └─> is_complete = true
   └─> completed_at = now()
   └─> xp_earned = 100

7. Backend updates user XP (xpService)
   └─> total_xp += 100
   └─> Check if leveled up

8. Backend checks achievements (achievementService)
   └─> Check if first High priority task
   └─> Check if reached level milestone (if leveled up)

9. Backend awards achievements
   └─> Insert into user_achievements
   └─> Add bonus XP to total_xp

10. Backend returns response
    └─> { task, xp_earned, level_up, new_achievements }

11. Frontend receives response
    └─> Refresh tasks list
    └─> Refresh user profile (XP, level)
    └─> Show achievement notifications (if any)
```

### Achievement Unlock Flow

```
1. User creates 5th task
   └─> POST /api/tasks

2. Backend creates task

3. Backend calls checkAchievements(userId, 'task_creation')
   └─> Count user's tasks: SELECT COUNT(*) FROM tasks WHERE user_id = ?
   └─> Count = 5

4. achievementService checks milestones
   └─> Milestone 5 matches!

5. achievementService calls awardAchievement()
   └─> Find achievement: criteria_type='task_creation', criteria_value=5
   └─> Achievement: "Task Creator I"

6. achievementService checks if already earned
   └─> SELECT * FROM user_achievements WHERE user_id = ? AND achievement_id = ?
   └─> Not found → Award!

7. achievementService inserts achievement
   └─> INSERT INTO user_achievements (user_id, achievement_id)

8. achievementService adds bonus XP
   └─> xp_bonus = 50
   └─> UPDATE user_profiles SET total_xp = total_xp + 50

9. Backend returns response with new_achievements array

10. Frontend receives response
    └─> Show notification: "Achievement Unlocked: Task Creator I (+50 XP)"
```

---

## Performance Considerations

### Frontend Optimizations

✅ **Implemented**:
- **Optimistic UI updates**: Task completion updates UI immediately
- **Parallel fetching**: Dashboard fetches tasks/achievements/labels in parallel
- **Memoization**: useMemo for filtered/sorted tasks
- **Debouncing**: Prevents duplicate task completion clicks
- **Code splitting**: Pages lazy loaded via React.lazy (could improve)

⚠️ **Could Improve**:
- **React Query / SWR**: Better server state management with caching
- **Pagination**: For large task lists
- **Virtual scrolling**: For very long lists
- **Image optimization**: For profile pictures (when implemented)

### Backend Optimizations

✅ **Implemented**:
- **Database indexes**: On user_id, is_complete, priority, etc.
- **Single queries**: Fetch tasks with labels in one query (JOIN)
- **Efficient counting**: Use COUNT queries instead of fetching all rows

⚠️ **Could Improve**:
- **Caching**: Redis for frequent queries (levels, achievements)
- **Connection pooling**: Supabase handles this, but could optimize
- **Batch operations**: Bulk inserts for task_labels

### Database Optimizations

✅ **Implemented**:
- **Indexes**: All foreign keys indexed
- **RLS policies**: Efficient (indexed on user_id)
- **Cascade deletes**: Database handles cleanup

⚠️ **Could Improve**:
- **Materialized views**: For complex aggregations
- **Partitioning**: For very large tables (future)

---

## Deployment Architecture (Planned)

**Not yet deployed**, but planned architecture:

```
Frontend (Vercel)
  - React app deployed to Vercel CDN
  - Environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

Backend (Vercel Serverless Functions)
  - Express app deployed as Vercel serverless
  - Environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CLIENT_URL

Database (Supabase Cloud)
  - Managed PostgreSQL
  - Automatic backups
  - Auth handled by Supabase

Custom Domain (Optional)
  - Frontend: rpg-todo.com
  - Backend: api.rpg-todo.com
```

---

## Technology Choices Rationale

**React** - Industry standard, great ecosystem, hooks API is clean
**Vite** - Much faster than Create React App
**Tailwind** - Rapid styling, no CSS file bloat
**Express** - Simple, flexible, well-documented
**Supabase** - Postgres + Auth + RLS = less code to maintain
**JWT Auth** - Stateless, scalable, works with RLS
**Axios** - Better than fetch (interceptors, better errors)

---

## Development Environment

**Required Tools**:
- Node.js v18+
- npm or yarn
- Supabase account
- Code editor (VS Code / Cursor)

**Running Locally**:
```bash
# Terminal 1: Backend
cd server
npm install
npm run dev  # Runs on port 3001

# Terminal 2: Frontend
cd client
npm install
npm run dev  # Runs on port 3000
```

**Environment Variables** (see ENV_SETUP.md for details):
- Backend: `.env` in `server/`
- Frontend: `.env` in `client/`

