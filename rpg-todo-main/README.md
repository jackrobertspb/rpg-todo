# RPG Todo Application

A gamified task management application built with React, Express, Supabase, Shadcn, and Tailwind CSS.

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Express.js
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
.
├── docs/
│   ├── coding-standards/    # Framework-specific coding standards
│   └── rpg-todo-prd-2025-10-23.md
├── supabase/
│   └── migrations/         # Database migrations
├── client/                 # React frontend (to be created)
├── server/                 # Express backend (to be created)
└── README.md
```

## Setup

### Database Setup (Supabase)

1. Run migrations in order:
   - `001_initial_schema.sql` - Creates database schema
   - `002_seed_data.sql` - Seeds initial data (levels, achievements)

### Development

This project follows the build plan in `rpg-todo-build-plan.plan.md` and implements features exactly as specified in the PRD.


