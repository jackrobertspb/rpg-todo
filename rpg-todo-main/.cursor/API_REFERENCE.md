# Backend API Reference

Base URL: `http://localhost:3001` (development)

All API routes except `/health` and auth routes require authentication via Supabase JWT token.

## Authentication

### Headers Required for Protected Routes
```
Authorization: Bearer <supabase-jwt-token>
```

The frontend automatically includes this via the `apiClient` (Axios instance with interceptors).

---

## Health Check

### GET /health

Check if API is running.

**Auth**: Not required

**Response**:
```json
{
  "status": "ok",
  "message": "RPG Todo API is running"
}
```

---

## Authentication Routes

Base: `/api/auth`

### POST /api/auth/register

Register a new user.

**Auth**: Not required

**Request Body**:
```json
{
  "username": "string (required, unique, max 50 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "username": "username"
    }
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_at": 1234567890
  }
}
```

**Errors**:
- 400: Invalid input or username/email already exists
- 500: Server error

**Side Effects**:
- Creates user in auth.users (Supabase Auth)
- Triggers `handle_new_user()` which:
  - Creates user_profiles row
  - Creates default labels (Work, Personal, Errands, Goals)
  - Sets user at Level 1 with 0 XP

---

### POST /api/auth/login

Login existing user.

**Auth**: Not required

**Request Body**:
```json
{
  "usernameOrEmail": "string (username or email)",
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "user": { ... },
  "session": { ... }
}
```

**Errors**:
- 401: Invalid credentials
- 500: Server error

---

### POST /api/auth/logout

Logout current user.

**Auth**: Required

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/me

Get current user profile.

**Auth**: Required

**Response** (200 OK):
```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "current_level": 1,
    "total_xp": 0,
    "profile_picture_url": "string | null",
    "bio": "string | null",
    "role": "User"
  }
}
```

---

### POST /api/auth/create-profile

Fallback endpoint to manually create user profile if trigger fails.

**Auth**: Required (or provide userId in body)

**Request Body**:
```json
{
  "userId": "uuid",
  "username": "string",
  "email": "string"
}
```

**Response** (201 Created):
```json
{
  "message": "Profile created successfully",
  "profile": { ... }
}
```

---

## Task Routes

Base: `/api/tasks`

All task routes require authentication.

### GET /api/tasks

Get all tasks for current user with optional filtering.

**Auth**: Required

**Query Parameters**:
- `is_complete` (boolean): Filter by completion status ("true" or "false")
- `priority` (string): Filter by priority ("High", "Medium", "Low")
- `label_ids` (string | string[]): Filter by label IDs

**Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "string",
      "description": "string | null",
      "priority": "High | Medium | Low",
      "due_date": "YYYY-MM-DD | null",
      "is_complete": false,
      "completed_at": "timestamp | null",
      "xp_earned": 0,
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "task_labels": [
        {
          "label_id": "uuid",
          "labels": {
            "id": "uuid",
            "name": "string"
          }
        }
      ]
    }
  ]
}
```

**Example**:
```
GET /api/tasks?is_complete=false&priority=High
```

---

### GET /api/tasks/history

Get completed tasks (task history).

**Auth**: Required

**Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "string",
      "priority": "High | Medium | Low",
      "completed_at": "timestamp",
      "xp_earned": 100,
      "task_labels": [ ... ]
    }
  ]
}
```

**Notes**:
- Only returns completed tasks (is_complete = true)
- Sorted by completion date (most recent first)

---

### GET /api/tasks/:id

Get single task by ID.

**Auth**: Required

**Response** (200 OK):
```json
{
  "task": { ... }
}
```

**Errors**:
- 404: Task not found or doesn't belong to user

---

### POST /api/tasks

Create a new task.

**Auth**: Required

**Request Body**:
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional)",
  "priority": "High | Medium | Low (required)",
  "due_date": "YYYY-MM-DD (optional)",
  "label_ids": ["uuid", ...] (optional)
}
```

**Response** (201 Created):
```json
{
  "task": { ... },
  "new_achievements": [
    {
      "id": "uuid",
      "name": "Task Creator I",
      "description": "Create 5 tasks",
      "xp_bonus": 50
    }
  ]
}
```

**Errors**:
- 400: Invalid input (missing title/priority, invalid priority)
- 500: Server error

**Side Effects**:
- Checks for task creation achievements (5, 10, 20 tasks)
- Awards achievement and bonus XP if milestone reached

---

### POST /api/tasks/:id/complete

Mark a task as complete.

**Auth**: Required

**Response** (200 OK):
```json
{
  "task": { ... },
  "xp_earned": 100,
  "new_level": 2,
  "level_up": true,
  "new_achievements": [
    {
      "id": "uuid",
      "name": "High Priority Task Master",
      "description": "Complete a high priority task",
      "xp_bonus": 25
    }
  ]
}
```

**Errors**:
- 404: Task not found
- 400: Task already complete

**Side Effects**:
1. Calculates XP based on priority (High=100, Medium=50, Low=25)
2. Updates task: is_complete=true, completed_at=now, xp_earned=calculated
3. Adds XP to user's total_xp
4. Checks if user leveled up
5. Updates user's current_level if leveled up
6. Checks for task completion achievements (first High/Medium/Low)
7. Checks for level milestone achievements (5, 10, 15, 20)
8. Awards bonus XP from achievements

---

### PUT /api/tasks/:id

Update an existing task.

**Auth**: Required

**Request Body** (all fields optional):
```json
{
  "title": "string",
  "description": "string",
  "priority": "High | Medium | Low",
  "due_date": "YYYY-MM-DD",
  "label_ids": ["uuid", ...]
}
```

**Response** (200 OK):
```json
{
  "task": { ... }
}
```

**Errors**:
- 404: Task not found
- 400: Invalid priority

**Notes**:
- Only updates provided fields
- If label_ids provided, replaces all labels (removes old, adds new)

---

### DELETE /api/tasks/:id

Delete a task.

**Auth**: Required

**Response** (200 OK):
```json
{
  "message": "Task deleted successfully"
}
```

**Errors**:
- 404: Task not found

**Side Effects**:
- Cascade deletes task_labels entries

---

## Label Routes

Base: `/api/labels`

All label routes require authentication.

### GET /api/labels

Get all labels for current user.

**Auth**: Required

**Response** (200 OK):
```json
{
  "labels": [
    {
      "id": "uuid",
      "name": "Work",
      "user_id": "uuid",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

---

### POST /api/labels

Create a new label.

**Auth**: Required

**Request Body**:
```json
{
  "name": "string (required, max 100 chars)"
}
```

**Response** (201 Created):
```json
{
  "label": { ... },
  "new_achievements": [
    {
      "id": "uuid",
      "name": "Label Creator I",
      "description": "Create 3 custom labels",
      "xp_bonus": 30
    }
  ]
}
```

**Errors**:
- 400: Missing name or duplicate label name for user
- 500: Server error

**Side Effects**:
- Checks for label creation achievements (3, 5, 10 labels)
- Awards achievement and bonus XP if milestone reached

---

### PUT /api/labels/:id

Update a label name.

**Auth**: Required

**Request Body**:
```json
{
  "name": "string (required)"
}
```

**Response** (200 OK):
```json
{
  "label": { ... }
}
```

**Errors**:
- 404: Label not found
- 400: Duplicate label name for user

---

### DELETE /api/labels/:id

Delete a label.

**Auth**: Required

**Response** (200 OK):
```json
{
  "message": "Label deleted successfully"
}
```

**Errors**:
- 404: Label not found

**Side Effects**:
- Cascade deletes task_labels entries (removes label from all tasks)

---

## Achievement Routes

Base: `/api/achievements`

All achievement routes require authentication.

### GET /api/achievements

Get all achievements (with earned status for current user).

**Auth**: Required

**Response** (200 OK):
```json
{
  "achievements": [
    {
      "id": "uuid",
      "name": "Task Creator I",
      "description": "Create 5 tasks",
      "xp_bonus": 50,
      "criteria_type": "task_creation",
      "criteria_value": 5,
      "is_earned": true,
      "earned_at": "timestamp | null"
    }
  ]
}
```

---

### GET /api/achievements/earned

Get only earned achievements for current user.

**Auth**: Required

**Response** (200 OK):
```json
{
  "achievements": [
    {
      "user_id": "uuid",
      "achievement_id": "uuid",
      "earned_at": "timestamp",
      "achievements": {
        "id": "uuid",
        "name": "Task Creator I",
        "description": "Create 5 tasks",
        "xp_bonus": 50
      }
    }
  ]
}
```

---

## Profile Routes

Base: `/api/profile`

All profile routes require authentication.

### GET /api/profile

Get current user's profile.

**Auth**: Required

**Response** (200 OK):
```json
{
  "profile": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "current_level": 5,
    "total_xp": 1250,
    "profile_picture_url": "string | null",
    "bio": "string | null",
    "role": "User",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

---

### PUT /api/profile

Update current user's profile.

**Auth**: Required

**Request Body** (all fields optional):
```json
{
  "username": "string (max 50 chars, must be unique)",
  "bio": "string",
  "profile_picture_url": "string"
}
```

**Response** (200 OK):
```json
{
  "profile": { ... }
}
```

**Errors**:
- 400: Invalid input or username already taken

**Notes**:
- Cannot update: email, current_level, total_xp, role
- Only username, bio, and profile_picture_url are updatable

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes**:
- 200: Success (GET, PUT, POST completion)
- 201: Created (POST)
- 400: Bad Request (validation errors)
- 401: Unauthorized (not logged in)
- 404: Not Found
- 500: Internal Server Error

---

## Authentication Middleware

The backend uses `requireSupabaseAuth` middleware on protected routes:

1. Extracts JWT token from `Authorization: Bearer <token>` header
2. Verifies token with Supabase
3. Sets `req.userId` from token
4. Rejects request with 401 if invalid/missing token

Frontend `apiClient` automatically:
- Includes Authorization header with Supabase token
- Refreshes token when expired
- Handles 401 by redirecting to login

---

## Rate Limiting

**Not implemented** - Consider adding for production.

---

## CORS Configuration

Backend allows requests from:
- `process.env.CLIENT_URL` (default: http://localhost:3000)
- Credentials: true (allows cookies/auth headers)

---

## Development vs Production

**Development**:
- Base URL: http://localhost:3001
- CORS: http://localhost:3000
- Detailed error messages

**Production** (not yet deployed):
- Base URL: TBD (Vercel serverless)
- CORS: Production frontend URL
- Generic error messages (don't leak details)

