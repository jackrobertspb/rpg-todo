# Frontend Components Reference

## Component Hierarchy

```
App
├── ThemeProvider (context)
│   └── AuthProvider (context)
│       └── AppRoutes
│           ├── Header (if authenticated)
│           └── Routes
│               ├── Login (PublicRoute)
│               ├── Register (PublicRoute)
│               ├── Dashboard (PrivateRoute)
│               │   ├── ProgressBar
│               │   ├── TaskForm (conditional)
│               │   ├── TaskList
│               │   └── Tutorial (conditional)
│               ├── TaskHistory (PrivateRoute)
│               │   └── TaskList
│               ├── Profile (PrivateRoute)
│               │   └── ProgressBar
│               └── Achievements (PrivateRoute)
```

---

## Context Providers

### AuthContext (`context/AuthContext.jsx`)

**Purpose**: Manage global authentication state

**State**:
- `user`: Current user profile (from database)
- `loading`: Authentication check in progress

**Methods**:
- `login(usernameOrEmail, password)`: Login user
- `register(username, email, password)`: Register new user
- `logout()`: Logout user
- `checkAuth()`: Re-check authentication status

**Usage**:
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, loading, login, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  return <div>Hello, {user.username}!</div>;
}
```

**Implementation Details**:
- Uses Supabase Auth for authentication
- Listens for auth state changes (onAuthStateChange)
- Fetches user profile from database on auth
- Stores session in localStorage (via Supabase SDK)
- Retries profile creation if trigger fails

**Key Functions**:

**checkSession()**:
- Called on mount
- Gets current session from Supabase
- Fetches user profile if session exists

**fetchUserProfile(userId, session)**:
- Fetches user profile from user_profiles table
- Sets user state
- Sets loading to false

**register(username, email, password)**:
- Signs up with Supabase Auth
- Waits for profile creation (trigger)
- Retries if profile not created
- Fallback to manual profile creation via backend

**login(usernameOrEmail, password)**:
- Looks up email from username if needed
- Signs in with Supabase Auth
- Fetches user profile

---

### ThemeContext (`context/ThemeContext.jsx`)

**Purpose**: Manage dark/light mode

**State**:
- `theme`: 'dark' or 'light'

**Methods**:
- `toggleTheme()`: Toggle between dark and light

**Usage**:
```jsx
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

**Implementation Details**:
- Reads initial theme from localStorage
- Saves theme to localStorage on change
- Adds/removes 'dark' class on document.documentElement
- Tailwind uses `.dark:` prefix for dark mode styles

---

## Page Components

### Dashboard (`pages/Dashboard.jsx`)

**Purpose**: Main app dashboard showing tasks, XP, and achievements

**State**:
- `tasks`: Array of incomplete tasks
- `achievements`: Array of earned achievements
- `labels`: Array of user's labels
- `loading`: Data loading state
- `showTaskForm`: Task form visibility
- `showTutorial`: Tutorial visibility
- `filterLabelIds`: Selected label filters
- `completingTaskIds`: Set of task IDs being completed (prevents double-click)

**Key Features**:
- Profile summary with level and XP
- Progress bar showing XP toward next level
- Recent achievements display (first 4)
- Create new task button
- Task filtering by labels
- Prioritized task list (High → Medium → Low)
- Tutorial on first visit

**Data Fetching**:
- `fetchData()`: Fetches tasks, achievements, labels in parallel (Promise.allSettled)
- Called on mount and after task creation/completion
- Uses apiClient for authenticated requests

**Event Handlers**:

**handleTaskComplete(taskId)**:
- Prevents duplicate clicks (checks completingTaskIds)
- Optimistically updates UI
- Calls API to complete task
- Refreshes data
- Shows achievement notifications
- Reverts UI on error

**handleTaskCreate(taskData)**:
- Calls API to create task
- Refreshes data
- Closes task form
- Shows achievement notifications

**handleFilterChange(labelIds)**:
- Updates filterLabelIds state
- Filters tasks by selected labels

**Performance Optimizations**:
- `useMemo` for filtered and sorted tasks
- `useCallback` for event handlers (prevents re-renders)
- Parallel data fetching (Promise.allSettled)
- Optimistic UI updates
- Safety timeout (3 seconds) to prevent infinite loading

---

### TaskHistory (`pages/TaskHistory.jsx`)

**Purpose**: Display completed tasks with details

**State**:
- `tasks`: Array of completed tasks
- `loading`: Data loading state

**Data Fetching**:
- Fetches from `/api/tasks/history`
- Shows completed tasks sorted by completion date (most recent first)

**Display**:
- Task title, priority, completion date
- XP earned
- Associated labels
- Color-coded by priority

---

### Profile (`pages/Profile.jsx`)

**Purpose**: User profile page with edit capabilities

**State**:
- `profile`: User profile data
- `achievements`: Earned achievements
- `loading`: Data loading state
- `editing`: Edit mode toggle
- `formData`: Form inputs (username, bio)
- `saving`: Save in progress

**Features**:
- Display username, email, level, XP, bio
- Progress bar showing XP toward next level
- Edit username and bio
- Display all earned achievements
- Account creation date

**Event Handlers**:

**handleEdit()**:
- Enters edit mode
- Pre-fills form with current data

**handleSave()**:
- Validates input
- Calls API to update profile
- Updates local state
- Exits edit mode

**handleCancel()**:
- Exits edit mode
- Resets form data

---

### Achievements (`pages/Achievements.jsx`)

**Purpose**: Display all achievements (earned and not earned)

**State**:
- `achievements`: Array of all achievements with earned status
- `loading`: Data loading state

**Data Fetching**:
- Fetches from `/api/achievements`
- Returns all achievements with `is_earned` and `earned_at` fields

**Display**:
- Grid of achievement cards
- Earned achievements: Colored background, trophy icon
- Locked achievements: Greyed out, lock icon
- Shows achievement name, description, XP bonus
- Shows earned date for earned achievements

**Grouping** (could be implemented):
- Task Creation achievements
- Task Completion achievements
- Level Milestone achievements
- Label Creation achievements

---

### Login (`pages/Login.jsx`)

**Purpose**: User login page

**State**:
- `usernameOrEmail`: Login input
- `password`: Password input
- `error`: Error message
- `loading`: Login in progress

**Features**:
- Login with username or email
- Error display
- Link to registration page
- Redirects to dashboard on success

**Event Handlers**:

**handleSubmit(e)**:
- Prevents default form submission
- Validates inputs (non-empty)
- Calls `login()` from AuthContext
- Handles errors (displays message)
- Redirects on success (handled by PublicRoute)

---

### Register (`pages/Register.jsx`)

**Purpose**: User registration page

**State**:
- `username`: Username input
- `email`: Email input
- `password`: Password input
- `confirmPassword`: Confirm password input
- `error`: Error message
- `loading`: Registration in progress

**Features**:
- Registration with username, email, password
- Password confirmation
- Validation (matching passwords, min length)
- Error display
- Link to login page
- Redirects to dashboard on success

**Validation**:
- Username: Required, max 50 chars
- Email: Required, valid format (handled by Supabase)
- Password: Required, min 8 chars
- Confirm Password: Must match password

**Event Handlers**:

**handleSubmit(e)**:
- Validates all inputs
- Calls `register()` from AuthContext
- Handles errors
- Redirects on success

---

## Shared Components

### Header (`components/Header.jsx`)

**Purpose**: Navigation header with links and theme toggle

**Features**:
- Logo/title
- Navigation links (Dashboard, History, Profile, Achievements)
- Progress bar showing current XP/level
- Theme toggle button (☀️/🌙)
- Logout button

**Responsive**:
- Mobile: Hamburger menu
- Desktop: Horizontal nav

**Styling**:
- Sticky header (stays at top on scroll)
- Fantasy RPG aesthetic (deep blues/greens)
- Dark mode support

---

### ProgressBar (`components/ProgressBar.jsx`)

**Purpose**: Visual XP/level progress bar

**Props**:
- `currentXP`: User's total XP
- `currentLevel`: User's current level

**Features**:
- Calculates XP for current level range
- Shows progress bar (filled based on % to next level)
- Displays current level and XP/next level XP
- Color-coded (gradient from blue to green)

**Calculation**:
```javascript
const currentLevelXP = levels[currentLevel - 1].xp_required;
const nextLevelXP = levels[currentLevel]?.xp_required || currentLevelXP;
const xpForCurrentLevel = currentXP - currentLevelXP;
const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
const progress = (xpForCurrentLevel / xpNeededForNextLevel) * 100;
```

**Example**:
- Level 2 requires 100 XP
- Level 3 requires 250 XP
- User has 180 XP
- Progress: (180 - 100) / (250 - 100) = 80 / 150 = 53%

---

### TaskForm (`components/TaskForm.jsx`)

**Purpose**: Form for creating new tasks

**Props**:
- `labels`: Array of user's labels
- `onSubmit`: Callback when form submitted
- `onCancel`: Callback when form cancelled

**State**:
- `title`: Task title
- `description`: Task description
- `priority`: Task priority (High/Medium/Low)
- `dueDate`: Task due date
- `selectedLabels`: Array of selected label IDs
- `error`: Error message
- `submitting`: Submission in progress

**Features**:
- Title input (required)
- Description textarea
- Priority dropdown (High/Medium/Low)
- Due date picker
- Label multi-select
- Submit and Cancel buttons
- Error display
- Disables submit during submission

**Validation**:
- Title: Required
- Priority: Required, must be High/Medium/Low
- Due date: Optional, must be valid date
- Labels: Optional

**Event Handlers**:

**handleSubmit(e)**:
- Validates inputs
- Calls onSubmit with task data
- Handles errors
- Resets form on success

**handleCancel()**:
- Calls onCancel
- Closes form

---

### TaskList (`components/TaskList.jsx`)

**Purpose**: Display list of tasks

**Props**:
- `tasks`: Array of tasks to display
- `onComplete`: Callback when task completed
- `completingTaskIds`: Set of task IDs being completed (optional)

**Features**:
- Task cards with title, description, priority, due date
- Labels display
- Complete button (checkbox)
- Color-coded by priority:
  - High: Red border
  - Medium: Yellow border
  - Low: Green border
- Disabled state for tasks being completed
- Responsive grid layout

**Task Card Structure**:
```
┌─────────────────────────────────────────┐
│ [✓] Task Title                 [High]   │
│     Task description goes here          │
│     Due: 2025-11-10                     │
│     Labels: [Work] [Urgent]             │
└─────────────────────────────────────────┘
```

**Event Handlers**:

**handleComplete(taskId)**:
- Calls onComplete with task ID
- Parent component handles API call and state update

---

### Tutorial (`components/Tutorial.jsx`)

**Purpose**: Interactive tutorial for first-time users

**Props**:
- `onComplete`: Callback when tutorial completed

**State**:
- `step`: Current tutorial step (1-5)

**Steps**:
1. Welcome - Introduction to RPG Todo
2. Creating Tasks - How to create tasks and set priority
3. Earning XP - Explanation of XP and leveling
4. Achievements - Overview of achievement system
5. Labels - Using labels to organize tasks

**Features**:
- Modal overlay (prevents interaction with app)
- Step-by-step navigation (Next, Previous, Skip)
- Highlights key concepts
- Stores completion in localStorage
- Doesn't show again after completion

**Event Handlers**:

**handleNext()**:
- Advances to next step
- If last step, calls onComplete

**handlePrevious()**:
- Goes back one step

**handleSkip()**:
- Calls onComplete immediately

---

## Utility Components

### cn() (`utils/cn.js`)

**Purpose**: Merge Tailwind classes with conditional logic

**Usage**:
```javascript
import { cn } from '../utils/cn';

<div className={cn(
  "base-class",
  "another-class",
  condition && "conditional-class",
  {
    "class-a": variantA,
    "class-b": variantB,
  }
)} />
```

**Implementation**:
Uses `clsx` and `tailwind-merge` to:
1. Handle conditional classes
2. Merge classes properly
3. Resolve Tailwind conflicts (e.g., `p-4` overrides `p-2`)

---

## Route Components

### PrivateRoute

**Purpose**: Protect routes that require authentication

**Logic**:
- If loading, show loading spinner
- If not authenticated, redirect to `/login`
- If authenticated, render children

**Usage**:
```jsx
<Route path="/dashboard" element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
} />
```

---

### PublicRoute

**Purpose**: Routes for non-authenticated users (login/register)

**Logic**:
- If loading, show loading spinner
- If authenticated, redirect to `/dashboard`
- If not authenticated, render children

**Usage**:
```jsx
<Route path="/login" element={
  <PublicRoute>
    <Login />
  </PublicRoute>
} />
```

---

## Component Patterns

### Functional Components with Hooks
All components use functional components with hooks (no classes).

```jsx
function MyComponent() {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return <div>...</div>;
}
```

### Controlled Components
Form inputs are controlled by React state.

```jsx
<input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

### Custom Hooks
Extract reusable logic into custom hooks.

```jsx
function useAuth() {
  return useContext(AuthContext);
}
```

### Composition
Build complex UIs from simple components.

```jsx
<Dashboard>
  <ProgressBar />
  <TaskForm />
  <TaskList />
</Dashboard>
```

### Prop Drilling Prevention
Use Context for global state (auth, theme).

```jsx
// Instead of passing user through every component:
<Dashboard user={user}>
  <Header user={user} />
  <TaskList user={user} />
</Dashboard>

// Use Context:
<AuthProvider>
  <Dashboard />  {/* Access user via useAuth() */}
</AuthProvider>
```

---

## Styling Conventions

### Tailwind Utility Classes
```jsx
<div className="bg-white dark:bg-primary-dark p-4 rounded-lg shadow-md">
```

### Color Palette
- Primary: `#1e3a5f` (deep blue)
- Primary Light: `#2c5282`
- Primary Dark: `#0f1e33`
- Secondary: `#2d6a4f` (deep green)
- Secondary Light: `#40916c`
- Secondary Dark: `#1b4332`

### Dark Mode
Use `dark:` prefix for dark mode styles:
```jsx
<div className="bg-white dark:bg-primary-dark">
```

### Responsive Design
Use responsive prefixes:
```jsx
<div className="text-sm md:text-base lg:text-lg">
```

---

## Component State Management

### Local State (useState)
Component-specific state that doesn't need to be shared.

### Context State (useContext)
Global state shared across multiple components (auth, theme).

### Server State (API)
Data fetched from backend, stored in component state, refetched on mutations.

### Derived State (useMemo)
Computed values based on other state.

```jsx
const filteredTasks = useMemo(() => {
  return tasks.filter(task => filterLabelIds.includes(task.label_id));
}, [tasks, filterLabelIds]);
```

---

## Performance Optimizations

### useMemo
Memoize expensive computations.

```jsx
const sortedTasks = useMemo(() => {
  return tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
}, [tasks]);
```

### useCallback
Memoize functions to prevent re-renders.

```jsx
const handleComplete = useCallback((taskId) => {
  // ...
}, [dependencies]);
```

### React.memo
Memoize components that render frequently with same props.

```jsx
const TaskCard = React.memo(({ task, onComplete }) => {
  // ...
});
```

### Optimistic UI Updates
Update UI immediately, revert on error.

```jsx
// Update UI
setTasks(tasks.map(t => t.id === taskId ? { ...t, is_complete: true } : t));

// Make API call
try {
  await apiClient.post(`/tasks/${taskId}/complete`);
} catch (error) {
  // Revert UI
  setTasks(tasks.map(t => t.id === taskId ? { ...t, is_complete: false } : t));
}
```

---

## Testing Considerations

**Not yet implemented**, but should test:

### Unit Tests
- Utility functions (cn)
- Custom hooks (useAuth, useTheme)
- Pure components (ProgressBar with different XP values)

### Integration Tests
- AuthContext with Supabase
- API client with interceptors
- Form submissions

### E2E Tests
- User registration flow
- Task creation and completion
- Achievement unlocking
- Dark mode toggle

