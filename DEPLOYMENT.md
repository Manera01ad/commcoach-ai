# 🚀 CommCoach AI - Deployment Guide

This guide will walk you through deploying your CommCoach application to production.

## 📋 Prerequisites

Before deploying, make sure you have:
- [ ] GitHub account
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Railway account (sign up at https://railway.app)
- [ ] Gemini API Key (get from https://aistudio.google.com/app/apikey)
- [ ] Your code pushed to GitHub

---

## 🔧 Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with your GitHub account
3. Click "New Project"

### Step 2: Deploy Backend
1. Click **"Deploy from GitHub repo"**
2. Select your `commcoach-ai` repository
3. Railway will auto-detect your monorepo - select the `backend` folder
4. Click **"Add variables"** to set environment variables

### Step 3: Configure Environment Variables
Add these environment variables in Railway:
```
PORT=3001
NODE_ENV=production
GEMINI_API_KEY=your_actual_gemini_api_key
ALLOWED_ORIGINS=https://commcoach-ai.vercel.app,http://localhost:5173
```

### Step 4: Get Your Backend URL
1. After deployment, Railway will give you a URL like: `https://commcoach-backend-production.up.railway.app`
2. **Copy this URL** - you'll need it for frontend deployment
3. Test your backend: Open `https://your-backend-url.railway.app/health`

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with your GitHub account
3. Click **"Add New Project"**

### Step 2: Import Your Repository
1. Click **"Import Git Repository"**
2. Select your `commcoach-ai` repository
3. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 3: Configure Environment Variables
In Vercel's environment variables section, add:
```
VITE_API_URL=https://your-backend-url.railway.app/api
```
(Replace with your actual Railway backend URL from Part 1)

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment to complete
3. Vercel will give you a URL like: `https://commcoach-ai.vercel.app`

---

## 🔄 Part 3: Connect Frontend and Backend

### Update Backend CORS
1. Go back to Railway dashboard
2. Update the `ALLOWED_ORIGINS` environment variable to include your Vercel URL:
```
ALLOWED_ORIGINS=https://commcoach-ai.vercel.app,http://localhost:5173
```
3. Railway will automatically redeploy with new settings

---

## ✅ Part 4: Verify Deployment

### Test Your Live App
1. Open your Vercel URL: `https://commcoach-ai.vercel.app`
2. Try the communication analysis features
3. Check browser console for any errors

### Test Backend Health
Visit: `https://your-backend-url.railway.app/health`

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T...",
  "uptime": 123.45,
  "environment": "production"
}
```

---

## 🎯 Quick Reference

| Component | URL | Dashboard |
|-----------|-----|-----------|
| **Frontend** | `https://commcoach-ai.vercel.app` | https://vercel.com/dashboard |
| **Backend** | `https://your-backend.railway.app` | https://railway.app/dashboard |
| **Logs** | Check Railway & Vercel dashboards | For debugging |

---

## 🔧 Future Updates

### To Deploy Updates to Frontend:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel auto-deploys on every push to `main` branch!

### To Deploy Updates to Backend:
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Railway auto-deploys on every push to `main` branch!

---

## 🐛 Troubleshooting

### Frontend Build Errors
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Backend Errors
- Check Railway logs
- Verify `GEMINI_API_KEY` is set correctly
- Test health endpoint: `/health`

### CORS Errors
- Ensure `ALLOWED_ORIGINS` in Railway includes your Vercel URL
- Check browser console for specific CORS errors

---

## 🎉 Success!

Your CommCoach AI is now live and accessible to the world!

- **Frontend:** https://commcoach-ai.vercel.app
- **Backend API:** https://your-backend.railway.app

Share your app and get feedback! 🚀
