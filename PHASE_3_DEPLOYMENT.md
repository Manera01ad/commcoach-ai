# 🚀 Phase 3 Deployment Guide

**Status:** ✅ Code pushed to GitHub  
**Commit:** `8f2a4ff` - "Phase 3 Start: Streak Engine + Memory System"  
**Ready for:** Database deployment

---

## ✅ What's Been Done

### Track A: Dopamine Architecture
- ✅ Streak Engine merged to main
- ✅ Backend services ready (`StreakEngine.js`, `ActivityLogger.js`)
- ✅ API routes ready (`/api/streak/*`)
- ✅ Database schema ready (`streak_engine_schema.sql`)

### Track B: Multi-Modal Agents
- ✅ Memory system schema created (`memory_system_schema.sql`)
- ✅ Embedding service exists (`EmbeddingService.js`)
- ✅ Memory service exists (`MemoryService.js`)
- ✅ pgvector support added

---

## 📋 Deployment Steps

### Step 1: Deploy Streak Engine Schema (5 minutes)

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Select project: `jmaerbneeavezfrvttzq`
   - Click: **SQL Editor** → **New Query**

2. **Run Streak Engine Schema:**
   - Open file: `database/streak_engine_schema.sql`
   - Copy **ALL** content
   - Paste in SQL Editor
   - Click **"Run"**

3. **Expected Output:**
   ```
   ✅ STREAK ENGINE SCHEMA DEPLOYED!
   
   Tables created:
   - user_inventory
   - streak_events  
   - activity_log
   ```

4. **Verify:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_name IN ('user_inventory', 'streak_events', 'activity_log');
   ```

---

### Step 2: Deploy Memory System Schema (5 minutes)

1. **In Same SQL Editor, New Query:**
   - Open file: `database/memory_system_schema.sql`
   - Copy **ALL** content
   - Paste in SQL Editor
   - Click **"Run"**

2. **Expected Output:**
   ```
   ✅ MEMORY SYSTEM SCHEMA DEPLOYED!
   
   Tables created:
   - agent_memories (with vector support)
   - context_windows
   
   pgvector extension: ENABLED
   ```

3. **Verify:**
   ```sql
   -- Check pgvector
   SELECT * FROM pg_extension WHERE extname = 'vector';
   
   -- Check tables
   SELECT table_name FROM information_schema.tables 
   WHERE table_name IN ('agent_memories', 'context_windows');
   ```

---

### Step 3: Verify Railway Deployment (Auto)

Railway should auto-deploy the backend with the new code.

**Check deployment:**
1. Go to: https://railway.app
2. Select your project
3. Check deployment status
4. Wait for "Deployed" status

**Test endpoints:**
```powershell
# Test API
$API_URL = "https://your-backend.railway.app/api"

# Should show streak endpoint
Invoke-RestMethod -Uri $API_URL | ConvertTo-Json

# Test streak stats (after login)
$TOKEN = "your_jwt_token"
Invoke-RestMethod -Uri "$API_URL/streak/stats" `
    -Headers @{"Authorization" = "Bearer $TOKEN"}
```

---

## 🧪 Testing Phase 3

### Test Track A (Streak Engine):

```powershell
# 1. Log activity
$response = Invoke-RestMethod -Uri "$API_URL/streak/activity" `
    -Method Post `
    -Headers @{"Authorization" = "Bearer $TOKEN"} `
    -Body (@{activityWeight = 1} | ConvertTo-Json) `
    -ContentType "application/json"

Write-Host "Streak: $($response.streak) days"
Write-Host "Status: $($response.status)"

# 2. Get stats
$stats = Invoke-RestMethod -Uri "$API_URL/streak/stats" `
    -Headers @{"Authorization" = "Bearer $TOKEN"}

Write-Host "Current: $($stats.stats.currentStreak)"
Write-Host "Longest: $($stats.stats.longestStreak)"
```

### Test Track B (Memory System):

The memory system will be tested through the agent services once we integrate them.

---

## 📊 Success Criteria

### Track A:
- [ ] Database schema deployed
- [ ] API endpoints responding
- [ ] Streak increments on activity
- [ ] Stats endpoint returns data

### Track B:
- [ ] pgvector extension enabled
- [ ] agent_memories table created
- [ ] Vector similarity search working
- [ ] Context windows functional

---

## 🎯 Next Steps

After successful deployment:

### Immediate (Today):
1. **Test Streak Engine** - Log activities, verify streaks work
2. **Test Memory System** - Store and retrieve memories
3. **Monitor metrics** - Check for errors

### Next Milestone:
- **Track A:** Daily Missions system
- **Track B:** Agent Personalities

---

## 🚨 Troubleshooting

### Issue: Schema deployment fails
**Solution:** Check Supabase logs, verify permissions, run line by line

### Issue: pgvector not found
**Solution:** Ensure you're on Supabase (supports pgvector), not vanilla PostgreSQL

### Issue: API returns 404
**Solution:** Wait for Railway deployment to complete, check logs

### Issue: Streak not incrementing
**Solution:** Check user_id matches, verify ActivityLogger integration

---

## 📁 Files Deployed

### Backend:
- `backend/services/StreakEngine.js`
- `backend/services/ActivityLogger.js`
- `backend/routes/streak.js`
- `backend/services/memory/EmbeddingService.js`
- `backend/services/memory/MemoryService.js`

### Database:
- `database/streak_engine_schema.sql`
- `database/memory_system_schema.sql`

### Documentation:
- `STREAK_ENGINE_GUIDE.md`
- `STREAK_DEPLOYMENT_PLAN.md`
- `PROJECT_STATUS.md`

---

## 🎉 Phase 3 Progress

```
Track A: ████████░░░░░░░░░░░░ 40% (Milestone A1 in progress)
Track B: ████░░░░░░░░░░░░░░░░ 20% (Milestone B1 in progress)
Overall: ██████░░░░░░░░░░░░░░ 30% (2/10 milestones started)
```

---

**Ready to deploy?** Start with Step 1 in Supabase! 🚀

**Last Updated:** 2026-01-20 19:37 PM  
**Status:** Code deployed to GitHub, awaiting database deployment
