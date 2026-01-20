# 🧪 Phase 3 Testing Guide

## ✅ Both Schemas Deployed Successfully!

**Track A:** Streak Engine ✅  
**Track B:** Memory System ✅

---

## 🧪 Quick Verification Tests

### Test 1: Verify Streak Engine Tables

Run in Supabase SQL Editor:

```sql
-- Check streak tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('user_inventory', 'streak_events', 'activity_log')
ORDER BY table_name;

-- Should return 3 rows
```

### Test 2: Verify Memory System Tables

```sql
-- Check memory tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('chat_sessions', 'messages', 'context_windows')
ORDER BY table_name;

-- Should return 3 rows
```

### Test 3: Verify pgvector Extension

```sql
-- Check pgvector is enabled
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Should return 1 row
```

### Test 4: Verify agent_memories Enhancements

```sql
-- Check new columns in agent_memories
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'agent_memories'
AND column_name IN ('session_id', 'summary', 'memory_type', 'importance', 'last_accessed_at', 'access_count')
ORDER BY column_name;

-- Should return 6 rows
```

---

## 🚀 Next: Test API Endpoints

### Test Track A (Streak Engine):

```powershell
# Get your JWT token after login
$TOKEN = "your_jwt_token_here"
$API_URL = "https://your-backend.railway.app/api"

# Test 1: Get streak stats
$stats = Invoke-RestMethod -Uri "$API_URL/streak/stats" `
    -Headers @{"Authorization" = "Bearer $TOKEN"}

Write-Host "Current Streak: $($stats.stats.currentStreak)"
Write-Host "Longest Streak: $($stats.stats.longestStreak)"

# Test 2: Log an activity
$activity = Invoke-RestMethod -Uri "$API_URL/streak/activity" `
    -Method Post `
    -Headers @{"Authorization" = "Bearer $TOKEN"} `
    -Body (@{activityWeight = 1} | ConvertTo-Json) `
    -ContentType "application/json"

Write-Host "Streak Status: $($activity.status)"
Write-Host "Message: $($activity.message)"
```

### Test Track B (Memory System):

The memory system will be tested through agent interactions. For now, verify the tables exist (Test 2 above).

---

## 📊 Success Criteria

### Track A:
- [x] Database schema deployed
- [x] Tables created
- [ ] API endpoints responding
- [ ] Streak increments on activity

### Track B:
- [x] Database schema deployed
- [x] Tables created
- [x] pgvector enabled
- [ ] Memory storage working
- [ ] Vector search working

---

## 🎯 Next Milestones

### Milestone A2: Daily Missions
- Create daily missions system
- Build micro-drills library
- Implement XP and leveling

### Milestone B2: Agent Personalities
- Create PersonaEngine
- Define 3 core personas
- Test personality differences

---

## 🎉 Congratulations!

You've successfully deployed **both Track A and Track B** foundations!

**Phase 3 Progress:** 40% complete (2/10 milestones done)

**Next:** Test the API endpoints and start building the next milestones! 🚀
