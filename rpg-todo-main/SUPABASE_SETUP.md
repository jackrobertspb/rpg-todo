# Supabase Keys Setup Guide

## What You Need From Supabase

You need **3 values** from your Supabase project:

1. **Project URL** (same for both backend and frontend)
2. **Anon/Public Key** (used in frontend)
3. **Service Role Key** (used ONLY in backend - never expose in frontend!)

## Step-by-Step: Getting Your Supabase Keys

### 1. Create/Access Your Supabase Project

1. Go to https://supabase.com
2. Sign in or create an account
3. Create a new project OR select an existing project

### 2. Get Your Keys

1. In your Supabase project dashboard, click **Settings** (gear icon in left sidebar)
2. Click **API** under Project Settings
3. You'll see:

   **Project URL**
   - Found under "Project URL" section
   - Looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - Copy this value → Use as `SUPABASE_URL` (backend) and `VITE_SUPABASE_URL` (frontend)

   **anon public key**
   - Found under "Project API keys" section
   - Labeled as "anon" or "public"
   - Looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Copy this value → Use as `SUPABASE_ANON_KEY` (backend) and `VITE_SUPABASE_ANON_KEY` (frontend)

   **service_role key**
   - Found under "Project API keys" section  
   - Labeled as "service_role" 
   - ⚠️ **SECRET** - This key bypasses Row Level Security
   - Looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Copy this value → Use as `SUPABASE_SERVICE_ROLE_KEY` (backend ONLY)
   - ⚠️ **NEVER** put this in frontend code or client-side `.env` files!

## Where to Put the Keys

### Backend Environment File (`server/.env`)

Create or edit `server/.env`:

```env
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key-here
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here

# Client URL
CLIENT_URL=http://localhost:3000
```

**Replace:**
- `https://your-project-id.supabase.co` with your Project URL
- `your-service-role-key-here` with your service_role key
- `your-anon-key-here` with your anon/public key

### Frontend Environment File (`client/.env`)

Create or edit `client/.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here
```

**Replace:**
- `https://your-project-id.supabase.co` with your Project URL
- `your-anon-key-here` with your anon/public key

**Important:** Frontend only gets the anon key, NOT the service_role key!

## Quick Copy-Paste Format

Once you have your keys, here's what to copy:

### For Backend (`server/.env`):
```
SUPABASE_URL=<paste-your-project-url-here>
SUPABASE_SERVICE_ROLE_KEY=<paste-your-service-role-key-here>
SUPABASE_ANON_KEY=<paste-your-anon-key-here>
```

### For Frontend (`client/.env`):
```
VITE_SUPABASE_URL=<paste-your-project-url-here>
VITE_SUPABASE_ANON_KEY=<paste-your-anon-key-here>
```

## Security Checklist

- ✅ Service Role Key is ONLY in `server/.env` (backend)
- ✅ Anon Key is in both `server/.env` AND `client/.env`
- ✅ `.env` files are in `.gitignore` (never commit keys to git)
- ✅ Service Role Key is never exposed to frontend
- ✅ Service Role Key is never committed to version control

## Verification

After setting up your keys:

1. **Backend**: Start server - should connect to Supabase without errors
2. **Frontend**: Start client - should be able to authenticate with Supabase
3. **Test**: Try registering a user - should create profile in database

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` files exist in both `server/` and `client/` directories
- Check that variable names match exactly (case-sensitive)
- Verify no extra spaces or quotes around values

### "Invalid API key"
- Double-check you copied the entire key (they're long!)
- Make sure you're using the correct key type (anon vs service_role)
- Verify the keys are from the correct Supabase project

### "Authentication failed"
- Check that migrations ran successfully
- Verify RLS policies are set up correctly
- Make sure the database trigger for user profiles is created


