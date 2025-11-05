# Deployment Guide - Vercel

This guide will help you deploy TaskQuest (RPG Todo App) to Vercel.

## Architecture Overview

TaskQuest has two parts:
1. **Frontend** (React + Vite) - Static site
2. **Backend** (Express.js) - API server

We'll deploy both to Vercel as separate projects.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. GitHub/GitLab/Bitbucket repository with your code
3. Your Supabase project set up and running
4. All migrations run in Supabase

---

## Part 1: Deploy Backend API

### Step 1: Prepare Backend for Vercel

Create `server/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ]
}
```

### Step 2: Deploy Backend

**Via Vercel Dashboard:**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Output Directory:** (leave empty)
   - **Install Command:** (leave default)

4. **Add Environment Variables:**
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anonymous key  
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `JWT_SECRET` - Your JWT secret (must match Supabase JWT secret)
   - `NODE_ENV` - `production`

5. Click **Deploy**

6. **Note the deployment URL** (e.g., `https://taskquest-backend.vercel.app`)
   - You'll need this for the frontend deployment

---

## Part 2: Deploy Frontend

### Step 1: Deploy Frontend

**Via Vercel Dashboard:**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the **same** Git repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** (leave default)

4. **Add Environment Variables:**
   - `VITE_API_URL` - Your backend URL + `/api` (e.g., `https://taskquest-backend.vercel.app/api`)
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

5. Click **Deploy**

6. **Note the deployment URL** (e.g., `https://taskquest.vercel.app`)

---

## Part 3: Configure CORS

Update your backend to allow requests from your frontend domain.

1. Go to your **backend** Vercel project
2. Settings > Environment Variables
3. Add or update the CORS configuration in `server/src/index.js`:

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));
```

4. Add environment variable:
   - `CORS_ORIGIN` = `https://taskquest.vercel.app` (your frontend URL)

5. Redeploy the backend

---

## Part 4: Update Supabase Configuration

1. Go to your Supabase dashboard
2. Navigate to **Authentication > URL Configuration**
3. Update **Site URL:** `https://taskquest.vercel.app` (your frontend URL)
4. Add to **Redirect URLs:** `https://taskquest.vercel.app/**`

---

## Alternative: Deploy via Vercel CLI

### Install Vercel CLI:
```bash
npm install -g vercel
```

### Deploy Backend:
```bash
cd server
vercel login
vercel
# Follow prompts, select "server" as root directory
# Add environment variables when prompted
vercel --prod
```

### Deploy Frontend:
```bash
cd client  
vercel
# Follow prompts, select "client" as root directory
# Add environment variables when prompted
vercel --prod
```

Set environment variables using:
```bash
vercel env add VARIABLE_NAME production
```

---

## Post-Deployment Testing

### Test Checklist:

1. ✅ Visit your frontend URL
2. ✅ Register a new account
3. ✅ Log in
4. ✅ Create a task (Low, Medium, High priority)
5. ✅ Complete a task (check XP gain, level up)
6. ✅ Check achievements page
7. ✅ Create custom labels
8. ✅ Filter tasks by labels
9. ✅ Edit profile (username, bio, profile picture)
10. ✅ Test dark/light mode toggle
11. ✅ Test offline indicator (disconnect internet)
12. ✅ Check task history
13. ✅ Test on mobile (responsive design)

---

## Troubleshooting

### Build Fails

- **Frontend:** Check that all environment variables are set correctly
- **Backend:** Ensure `vercel.json` is in the `server` directory
- Verify `package.json` scripts are correct
- Check build logs in Vercel dashboard

### API Calls Fail (CORS Error)

- Ensure `CORS_ORIGIN` is set to your frontend URL
- Check `VITE_API_URL` includes `/api` path
- Verify backend is deployed and running

### Authentication Issues

- Check Supabase redirect URLs include your frontend domain
- Verify `JWT_SECRET` matches Supabase JWT secret
- Check `SUPABASE_ANON_KEY` is correct

### Database Issues

- Ensure all migrations are run in Supabase
- Check RLS policies are enabled
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct

### 404 Errors on Refresh

For the frontend, Vercel should handle SPAs automatically. If you get 404s on page refresh, create `client/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Monitoring & Analytics

After deployment:
1. Enable Vercel Analytics for performance monitoring
2. Check Vercel deployment logs for errors
3. Monitor Supabase logs for database issues
4. Set up Sentry or similar for error tracking (optional)

---

## Custom Domain (Optional)

To add a custom domain:
1. Go to Vercel dashboard > your project > Settings > Domains
2. Add your domain
3. Update DNS records as instructed
4. Update Supabase redirect URLs with custom domain

---

## Continuous Deployment

Vercel automatically deploys:
- **Production:** Pushes to `main` branch
- **Preview:** Pushes to other branches or PRs

To configure:
- Go to Settings > Git
- Configure branch deployment settings

---

## Environment Variables Summary

### Backend
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...
JWT_SECRET=your-jwt-secret
NODE_ENV=production
CORS_ORIGIN=https://taskquest.vercel.app
```

### Frontend
```
VITE_API_URL=https://taskquest-backend.vercel.app/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
```

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**🎉 Your TaskQuest app should now be live!**
