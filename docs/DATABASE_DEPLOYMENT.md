# Supabase Database Deployment Guide

**Project**: CommCoach AI  
**Supabase URL**: https://jmaerbneeavezfrvttzq.supabase.co  
**Status**: Ready to deploy

---

## ✅ Environment Variables - COMPLETE

Both backend and frontend `.env` files have been updated with your Supabase credentials.

### Backend `.env` ✅
- SUPABASE_URL
- SUPABASE_ANON_KEY  
- SUPABASE_SERVICE_KEY
- JWT_SECRET
- ENCRYPTION_KEY

### Frontend `.env.local` ✅
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_API_URL

---

## 📋 Next Step: Deploy Database Schema

### Option 1: Supabase Dashboard (Recommended - 5 minutes)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com/project/jmaerbneeavezfrvttzq
   - Login if needed

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New query"

3. **Deploy Schema (Step 1 of 3)**
   - Copy ALL contents from: `database/schema.sql`
   - Paste into SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - Wait for success message: "✅ Database schema created successfully!"
   - You should see: "16 tables created"

4. **Deploy RLS Policies (Step 2 of 3)**
   - Click "New query" again
   - Copy ALL contents from: `database/rls-policies.sql`
   - Paste into SQL Editor
   - Click "Run"
   - Wait for: "✅ Row Level Security policies created successfully!"

5. **Deploy Indexes (Step 3 of 3)**
   - Click "New query" again
   - Copy ALL contents from: `database/indexes.sql`
   - Paste into SQL Editor
   - Click "Run"
   - Wait for: "✅ Performance indexes created successfully!"

---

### Option 2: Supabase CLI (Advanced - 2 minutes)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref jmaerbneeavezfrvttzq

# Deploy all migrations
cd database
supabase db push --file schema.sql
supabase db push --file rls-policies.sql
supabase db push --file indexes.sql
```

---

## ✅ Verification Checklist

After deployment, verify in Supabase Dashboard:

### Database → Tables
You should see 16 tables:
- [ ] profiles
- [ ] user_preferences
- [ ] user_api_keys
- [ ] agent_templates
- [ ] agent_configs
- [ ] agent_memories
- [ ] chat_sessions
- [ ] messages
- [ ] voice_recordings
- [ ] user_progress
- [ ] achievements
- [ ] user_achievements
- [ ] subscription_plans
- [ ] subscriptions
- [ ] payment_history
- [ ] admin_actions
- [ ] system_analytics

### Database → Policies
Each table should show "RLS enabled" ✅

### Database → Indexes
You should see 50+ indexes created

### Table Editor → subscription_plans
You should see 3 rows:
- Free ($0)
- Pro ($19)
- Enterprise ($99)

### Table Editor → agent_templates
You should see 3 rows:
- Interview Coach
- Presentation Coach
- Sales Coach

### Table Editor → achievements
You should see 4 rows:
- First Steps
- Consistent Learner
- Conversation Master
- Voice Champion

---

## 🧪 Test Database Connection

After deployment, test the connection:

```bash
cd backend
npm run dev
```

You should see:
```
✅ Supabase connection successful
🚀 CommCoach Backend Server
================================
✅ Server running on http://localhost:3001
✅ Environment: development
✅ Health Check: http://localhost:3001/health
```

---

## 🚨 Troubleshooting

### "relation does not exist"
**Cause**: Schema not deployed  
**Solution**: Run `database/schema.sql` in SQL Editor

### "permission denied for table"
**Cause**: RLS policies not applied  
**Solution**: Run `database/rls-policies.sql` in SQL Editor

### "syntax error at or near"
**Cause**: Partial SQL copied  
**Solution**: Make sure to copy ENTIRE file contents

### "duplicate key value violates unique constraint"
**Cause**: Trying to run schema.sql twice  
**Solution**: Drop all tables first, or create new Supabase project

---

## 📊 What Gets Created

### Tables (16)
- User management (3 tables)
- Agent system (3 tables)
- Communication (3 tables)
- Progress & gamification (3 tables)
- Payments (3 tables)
- Admin (1 table)

### Seed Data
- 3 subscription plans (Free, Pro, Enterprise)
- 3 agent templates (Interview, Presentation, Sales)
- 4 achievements (First Steps, Streak, Master, Champion)

### Security
- 30+ RLS policies
- Row-level data isolation
- Admin-only access controls

### Performance
- 50+ indexes
- Vector similarity search (IVFFlat)
- Composite indexes for common queries

---

## ✅ Success Indicators

After successful deployment, you should be able to:

1. ✅ See 16 tables in Supabase Dashboard
2. ✅ See "RLS enabled" on all tables
3. ✅ See 3 subscription plans in `subscription_plans` table
4. ✅ See 3 agent templates in `agent_templates` table
5. ✅ Start backend server without errors
6. ✅ Access http://localhost:3001/health

---

## 🚀 Next Steps After Deployment

Once database is deployed, we'll implement:

1. **Authentication Routes** (Phase 2)
   - Signup/signin endpoints
   - Email verification
   - Password reset
   - OAuth (Google, GitHub)

2. **Admin Approval System**
   - Pending user queue
   - Approve/reject workflow
   - Email notifications

3. **Frontend Auth Pages**
   - Login/signup UI
   - Email verification screen
   - Pending approval screen

**Estimated time**: 2-3 hours after database deployment

---

**Ready to deploy?** Just run the 3 SQL files in Supabase SQL Editor! 🚀
