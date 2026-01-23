# Production Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Supabase Configuration
- [ ] Verify Supabase project is active
- [ ] Confirm authentication is enabled in Supabase dashboard
- [ ] Add redirect URLs in Supabase:
  - `http://localhost:5173` (for local testing)
  - `https://commcoach-ai.vercel.app` (for production)
  
**Steps:**
1. Go to: https://supabase.com/dashboard/project/jmaerbneeavezfrvttzq
2. Navigate to: Authentication → URL Configuration
3. Add URLs to "Redirect URLs" section
4. Save changes

### 2. Vercel Environment Variables
- [ ] Set `VITE_SUPABASE_URL` in Vercel
- [ ] Set `VITE_SUPABASE_ANON_KEY` in Vercel
- [ ] Set `VITE_API_URL` in Vercel (your Railway backend URL)

**Steps:**
1. Go to: https://vercel.com/ahmeds-projects-e783c559/commcoach-ai
2. Navigate to: Settings → Environment Variables
3. Add the following variables:

```
Name: VITE_SUPABASE_URL
Value: https://jmaerbneeavezfrvttzq.supabase.co
Environment: Production, Preview, Development
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYWVyYm5lZWF2ZXpmcnZ0dHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTI5NjIsImV4cCI6MjA4NDMyODk2Mn0.HgtB-4Y8im5H4GzoQezIWOzgPSXBRdCQ1xNStshDMJI
Environment: Production, Preview, Development
```

```
Name: VITE_API_URL
Value: https://your-backend-url.railway.app/api
Environment: Production, Preview, Development
```

4. Save all variables

### 3. Code Changes
- [x] Created `supabaseClient.ts` with dynamic redirect URL handling
- [x] Updated `AuthContext.tsx` to use Supabase directly
- [x] Created `ProtectedRoute.tsx` component
- [x] Updated `Login.tsx` with better error handling
- [x] Updated `Signup.tsx` with better error handling
- [x] Refactored `App.tsx` to use React Router with protected routes
- [x] Created `.env.production` template
- [x] Created `AUTH_SETUP.md` documentation

### 4. Local Testing
- [ ] Test login flow locally
- [ ] Test signup flow locally
- [ ] Test session persistence (refresh page while logged in)
- [ ] Test logout flow
- [ ] Verify redirect URLs work correctly

**Commands:**
```bash
cd frontend
npm install
npm run dev
```

Then test:
1. Navigate to http://localhost:5173
2. Should redirect to /login
3. Create an account or login
4. Should redirect to dashboard
5. Refresh page - should stay logged in
6. Logout - should redirect to /login

### 5. Deploy to Vercel
- [ ] Commit all changes to git
- [ ] Push to GitHub
- [ ] Verify Vercel auto-deployment succeeds
- [ ] Check build logs for errors

**Commands:**
```bash
git add .
git commit -m "feat: implement production-ready authentication with Supabase"
git push origin main
```

### 6. Production Testing
- [ ] Visit https://commcoach-ai.vercel.app
- [ ] Test login flow in production
- [ ] Test signup flow in production
- [ ] Test session persistence in production
- [ ] Test logout flow in production
- [ ] Verify no console errors
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices

## 🔧 Post-Deployment

### Monitor for Issues
- [ ] Check Vercel deployment logs
- [ ] Check Supabase auth logs
- [ ] Monitor for user-reported issues

### Performance Checks
- [ ] Verify page load times
- [ ] Check authentication response times
- [ ] Ensure no memory leaks

## 🚨 Rollback Plan

If issues occur in production:

1. **Quick Fix:** Revert to previous Vercel deployment
   - Go to Vercel dashboard → Deployments
   - Find last working deployment
   - Click "Promote to Production"

2. **Code Rollback:**
   ```bash
   git revert HEAD
   git push origin main
   ```

## 📝 Notes

### Current Configuration
- **Supabase Project:** jmaerbneeavezfrvttzq
- **Vercel Project:** commcoach-ai
- **Production URL:** https://commcoach-ai.vercel.app
- **Local Dev URL:** http://localhost:5173

### Key Files Modified
- `frontend/src/lib/supabaseClient.ts` (NEW)
- `frontend/src/contexts/AuthContext.tsx` (UPDATED)
- `frontend/src/components/ProtectedRoute.tsx` (NEW)
- `frontend/src/pages/auth/Login.tsx` (UPDATED)
- `frontend/src/pages/auth/Signup.tsx` (UPDATED)
- `frontend/App.tsx` (UPDATED)
- `frontend/.env.production` (NEW)
- `frontend/AUTH_SETUP.md` (NEW)

### Dependencies
All required dependencies are already installed:
- `@supabase/supabase-js` ✅
- `react-router-dom` ✅

## ✨ Success Criteria

Authentication is working correctly when:
1. ✅ Users can sign up with email/password
2. ✅ Users can log in with email/password
3. ✅ Sessions persist across page refreshes
4. ✅ Unauthenticated users are redirected to /login
5. ✅ Authenticated users can access the dashboard
6. ✅ Users can log out successfully
7. ✅ Works in both localhost and production
8. ✅ No console errors
9. ✅ Redirect URLs work correctly
