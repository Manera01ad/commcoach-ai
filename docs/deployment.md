# Deployment Guide

## Phase E: Deploy Backend to Railway

### Step 6: Deploy Backend

**Option 1: One-Click Railway Deployment**

1. Go to [Railway.app](https://railway.app/)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select `commcoach-ai` repository
6. Configure:
   - **Root Directory:** `/backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

7. Add Environment Variables in Railway Dashboard:
   ```
   GEMINI_API_KEY=your_key_here
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   NODE_ENV=production
   PORT=3001
   ```

## Frontend Deployment (Vercel)

1. Go to Vercel and Import Project.
2. Select Root Directory as `frontend`.
3. Set Environment Variable:
   - `VITE_API_URL`: Your Railway Backend URL (e.g. `https://commcoach-api.railway.app/api`).
