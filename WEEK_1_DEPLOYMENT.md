# 🚀 Week 1 Deployment Guide - Streak Engine

**Status:** APPROVED - Ready to Deploy  
**Time Required:** 10-15 minutes  
**Expected Impact:** 3-5x retention increase

---

## ✅ Step 1: Deploy Database Schema (5 minutes)

### Instructions:

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Select project: `jmaerbneeavezfrvttzq`
   - Click: **SQL Editor** → **New Query**

2. **Run Schema:**
   - Open file: `database/streak_engine_schema.sql`
   - Copy **ALL** content
   - Paste in SQL Editor
   - Click **"Run"**

3. **Verify Success:**
   ```sql
   -- Should see: ✅ STREAK ENGINE SCHEMA DEPLOYED!
   
   -- Verify tables:
   SELECT table_name FROM information_schema.tables 
   WHERE table_name IN ('user_inventory', 'streak_events', 'activity_log');
   
   -- Should return 3 rows
   ```

---

## ✅ Step 2: Integrate Backend Routes (2 minutes)

### File: `backend/server.js`

Add these lines:

```javascript
// Add import at top (after other imports)
import streakRoutes from './routes/streak.js';

// Add route (after auth routes, around line 40)
app.use('/api/streak', streakRoutes);
```

### Restart Backend:
```bash
# Stop current server (Ctrl+C)
# Restart
npm run dev
```

---

## ✅ Step 3: Test API Endpoints (3 minutes)

### Test 1: Log Activity
```powershell
$API_URL = "http://localhost:3001/api"
$TOKEN = "YOUR_JWT_TOKEN"  # Get from localStorage after login

$response = Invoke-RestMethod -Uri "$API_URL/streak/activity" `
    -Method Post `
    -Headers @{"Authorization" = "Bearer $TOKEN"} `
    -Body (@{activityWeight = 1} | ConvertTo-Json) `
    -ContentType "application/json"

Write-Host "✅ Streak: $($response.streak) days"
Write-Host "📊 Status: $($response.status)"
Write-Host "💬 Message: $($response.message)"
```

### Test 2: Get Stats
```powershell
$stats = Invoke-RestMethod -Uri "$API_URL/streak/stats" `
    -Method Get `
    -Headers @{"Authorization" = "Bearer $TOKEN"}

Write-Host "🔥 Current Streak: $($stats.stats.currentStreak)"
Write-Host "🏆 Longest Streak: $($stats.stats.longestStreak)"
Write-Host "⭐ Total Points: $($stats.stats.totalPoints)"
```

---

## ✅ Step 4: Frontend Integration (Optional - Week 1)

> **Note:** Frontend UI can be added later. Backend is the priority for Week 1.

If you want to add the streak counter to the header now:

### File: `frontend/components/Header.tsx`

```typescript
// Add import
import { useState, useEffect } from 'react';

// Inside Header component, add:
const [streak, setStreak] = useState(0);

useEffect(() => {
  if (user) {
    fetch('/api/streak/stats', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setStreak(data.stats.currentStreak))
    .catch(console.error);
  }
}, [user]);

// In the header JSX, add:
{user && streak > 0 && (
  <div className="flex items-center gap-2 px-3 py-1 bg-orange-500 rounded-full">
    <span className="text-xl">🔥</span>
    <span className="text-white font-bold">{streak}</span>
  </div>
)}
```

---

## ✅ Step 5: Deploy to Production (5 minutes)

### Push to GitHub:
```bash
git add .
git commit -m "feat: Deploy Streak Engine - Week 1 complete"
git push origin main
```

### Verify Deployment:
- **Railway:** Auto-deploys backend
- **Vercel:** Auto-deploys frontend
- Wait 2-3 minutes for deployment

### Test Production:
```powershell
$PROD_URL = "https://your-backend.railway.app/api"

# Test health
Invoke-RestMethod -Uri "$PROD_URL/health"

# Test streak endpoint (after login)
Invoke-RestMethod -Uri "$PROD_URL/streak/stats" `
    -Headers @{"Authorization" = "Bearer $TOKEN"}
```

---

## 📊 Success Criteria

After deployment, verify:

- [ ] Database tables created (3 tables)
- [ ] API endpoints responding
- [ ] Streak increments on activity
- [ ] Stats endpoint returns data
- [ ] No errors in logs
- [ ] Production deployment successful

---

## 🎯 Expected Results (Week 1)

**Day 1-2:**
- Users see streak counter
- Activity logging works
- No critical bugs

**Day 3-5:**
- 30%+ users open app daily
- 20%+ complete activity
- First 7-day streaks achieved

**Day 7:**
- 15%+ users on 7+ day streaks
- Retention increase visible
- Ready for Week 2 (Daily Missions)

---

## 🚨 Troubleshooting

### Issue: Database schema fails
**Solution:** Check Supabase logs, verify permissions, run schema line by line

### Issue: API returns 404
**Solution:** Verify routes added to server.js, restart backend

### Issue: Streak not incrementing
**Solution:** Check ActivityLogger integration, verify user_id matches

### Issue: Production deployment fails
**Solution:** Check Railway logs, verify environment variables set

---

## 📝 Next Steps

After Week 1 deployment:

1. **Monitor metrics** (daily active users, streak completion)
2. **Gather feedback** from beta users
3. **Plan Week 2** (Daily Missions system)
4. **Create micro-drills** content library

---

**Ready to deploy?** Start with Step 1! 🚀

**Last Updated:** 2026-01-20 03:29 AM  
**Status:** Approved - Execute Now
