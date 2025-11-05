# How to Set Up Environment Variables

## Step-by-Step Guide

### 1. Create Backend Environment File (`server/.env`)

1. Open your project in your code editor
2. Navigate to the `server` folder
3. Create a new file named `.env` (exactly that name - with the dot at the start)
4. Copy and paste this content:

```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=https://uwxabqpwijhsgyiaioug.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eGFicXB3aWpoc2d5aWFpb3VnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTkxMzg2NiwiZXhwIjoyMDc3NDg5ODY2fQ.FW0wMdb-UH0O1-a-HAZ2BHqLOjFY44aV2o9Fb97Z_3o
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eGFicXB3aWpoc2d5aWFpb3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTM4NjYsImV4cCI6MjA3NzQ4OTg2Nn0._7qRTO_afRhlCvjQWdpnow9_WgAYe8TRKPZqGaCuzuw

CLIENT_URL=http://localhost:3000
```

5. Save the file

**File location:** `server/.env`

### 2. Create Frontend Environment File (`client/.env`)

1. Navigate to the `client` folder
2. Create a new file named `.env` (with the dot at the start)
3. Copy and paste this content:

```env
VITE_SUPABASE_URL=https://uwxabqpwijhsgyiaioug.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eGFicXB3aWpoc2d5aWFpb3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTM4NjYsImV4cCI6MjA3NzQ4OTg2Nn0._7qRTO_afRhlCvjQWdpnow9_WgAYe8TRKPZqGaCuzuw
```

4. Save the file

**File location:** `client/.env`

## How to Create `.env` Files in Different Editors

### VS Code / Cursor

1. Right-click on the `server` folder → **New File**
2. Type `.env` (including the dot) as the filename
3. Paste the content
4. Save

**Note:** If `.env` doesn't appear in the file explorer, it's because dot-files are hidden. You can:
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "Show Hidden Files" or look for file explorer settings
- Or just create it via terminal (see below)

### Terminal / Command Line

**Windows (PowerShell):**
```powershell
# In server folder
cd server
New-Item -Path .env -ItemType File
# Then open in editor and paste content
```

**Mac/Linux:**
```bash
# In server folder
cd server
touch .env
# Then open in editor and paste content
```

### Notepad / Text Editor

1. Open Notepad (or any text editor)
2. Paste the content
3. Save as `.env` (make sure file type is "All Files" not ".txt")
4. Save it in the `server` folder

## Verify Files Are Created

After creating both `.env` files, your project structure should look like:

```
rpg-todo/
├── server/
│   ├── .env          ← Should exist here
│   ├── package.json
│   └── src/
├── client/
│   ├── .env          ← Should exist here
│   ├── package.json
│   └── src/
└── supabase/
```

## Important Notes

- ✅ `.env` files start with a dot (`.`) - this makes them hidden files
- ✅ `.env` files should NOT be committed to git (they're in `.gitignore`)
- ✅ No spaces around the `=` sign in environment variables
- ✅ No quotes needed around values (unless the value itself contains spaces)
- ✅ After creating `.env` files, restart your servers for changes to take effect

## Troubleshooting

### "Cannot find module" or "Missing Supabase environment variables"
- Make sure `.env` file is in the correct folder (`server/` or `client/`)
- Check the file is named exactly `.env` (not `.env.txt`)
- Verify no typos in variable names
- Restart the server after creating/modifying `.env`

### File doesn't appear in file explorer
- Dot-files are hidden by default
- You can still open them in your editor by typing the path
- Or enable "Show Hidden Files" in your editor settings


