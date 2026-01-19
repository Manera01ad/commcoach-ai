# Supabase Setup Guide - CommCoach AI

**Timeline**: 15-20 minutes  
**Cost**: $0 (Free tier)  
**Date**: 2026-01-18

---

## 📋 Prerequisites

- Email address for Supabase account
- GitHub account (optional, for OAuth)
- Google account (optional, for OAuth)

---

## 🚀 Step 1: Create Supabase Account

1. **Go to Supabase**: https://supabase.com
2. **Click "Start your project"**
3. **Sign up with GitHub** (recommended) or email
4. **Verify your email** if using email signup

---

## 🏗️ Step 2: Create New Project

1. **Click "New Project"**
2. **Fill in project details**:
   ```
   Organization: [Create new or select existing]
   Project Name: commcoach-ai
   Database Password: [Generate strong password - SAVE THIS!]
   Region: [Choose closest to your users]
   Pricing Plan: Free
   ```
3. **Click "Create new project"**
4. **Wait 2-3 minutes** for project to provision

---

## 🔑 Step 3: Get API Keys

1. **Go to Project Settings** (gear icon in sidebar)
2. **Click "API"** in left menu
3. **Copy these values** (you'll need them):

   ```env
   # Project URL
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   
   # Anon/Public Key (safe for frontend)
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Service Role Key (KEEP SECRET - backend only)
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Save these in a secure location** (password manager recommended)

---

## 🔧 Step 4: Enable pgvector Extension

1. **Go to Database** → **Extensions** in sidebar
2. **Search for "vector"**
3. **Enable "vector"** extension
4. **Confirm** - this enables AI vector embeddings

---

## 🔐 Step 5: Configure Authentication

1. **Go to Authentication** → **Providers**
2. **Enable Email provider**:
   - ✅ Enable Email provider
   - ✅ Confirm email (recommended)
   - ✅ Secure email change (recommended)
   
3. **Enable Google OAuth** (optional):
   - Click "Google"
   - Follow instructions to get Client ID and Secret from Google Cloud Console
   - Paste credentials
   - Save
   
4. **Enable GitHub OAuth** (optional):
   - Click "GitHub"  
   - Follow instructions to create OAuth app on GitHub
   - Paste Client ID and Secret
   - Save

---

## 📊 Step 6: Create Database Schema

### Option A: Using Supabase SQL Editor (Recommended)

1. **Go to SQL Editor** in sidebar
2. **Click "New query"**
3. **Copy and paste** the schema from `database/schema.sql` (I'll create this next)
4. **Click "Run"**
5. **Wait for completion** (should take 10-15 seconds)

### Option B: Using Local Migration Files

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref xxxxxxxxxxxxx

# Run migrations
supabase db push
```

---

## 🛡️ Step 7: Set Up Row Level Security (RLS)

1. **In SQL Editor**, run the RLS policies from `database/rls-policies.sql`
2. **Verify RLS is enabled**:
   - Go to **Database** → **Tables**
   - Each table should show "RLS enabled" ✅

---

## 📈 Step 8: Create Indexes

1. **In SQL Editor**, run the indexes from `database/indexes.sql`
2. **This improves query performance** for:
   - User lookups
   - Session queries
   - Message retrieval
   - Vector similarity search

---

## 🔗 Step 9: Update Environment Variables

### Backend (.env)

```bash
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Existing variables
GEMINI_API_KEY=your_gemini_key
ALLOWED_ORIGINS=http://localhost:5173,https://commcoach-ai.vercel.app
JWT_SECRET=your-super-secret-jwt-key-change-this
ENCRYPTION_KEY=your-32-byte-hex-encryption-key
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)

```bash
# Supabase (Public keys - safe for frontend)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API
VITE_API_URL=http://localhost:3001/api
```

---

## ✅ Step 10: Test Connection

### Test Backend Connection

Create `backend/test-supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testConnection() {
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    console.log('✅ Supabase connection successful!');
    console.log('✅ Database accessible');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

Run test:
```bash
cd backend
npm install @supabase/supabase-js
node test-supabase.js
```

Expected output:
```
✅ Supabase connection successful!
✅ Database accessible
```

---

## 🎯 Verification Checklist

Before proceeding, verify:

- [ ] ✅ Supabase project created
- [ ] ✅ API keys copied and saved
- [ ] ✅ pgvector extension enabled
- [ ] ✅ Email auth enabled
- [ ] ✅ OAuth providers configured (optional)
- [ ] ✅ Database schema created (16 tables)
- [ ] ✅ RLS policies applied
- [ ] ✅ Indexes created
- [ ] ✅ Environment variables updated
- [ ] ✅ Backend connection test passed

---

## 🚨 Troubleshooting

### Issue: "relation does not exist"
**Solution**: Run the schema.sql file in SQL Editor

### Issue: "JWT expired" or "Invalid API key"
**Solution**: Double-check you copied the correct keys from Settings → API

### Issue: "permission denied for table"
**Solution**: Make sure RLS policies are applied from rls-policies.sql

### Issue: "vector extension not found"
**Solution**: Enable the "vector" extension in Database → Extensions

---

## 📚 Next Steps

After Supabase is set up:

1. ✅ Install Supabase client in backend: `npm install @supabase/supabase-js`
2. ✅ Create Supabase client wrapper in `backend/config/supabase.js`
3. ✅ Implement authentication routes
4. ✅ Test signup/signin flow
5. ✅ Implement admin approval system

---

## 💡 Pro Tips

1. **Use Supabase Studio** - Great visual interface for viewing data
2. **Enable email templates** - Customize verification/reset emails in Auth → Email Templates
3. **Set up webhooks** - Get notified of auth events (Settings → Webhooks)
4. **Monitor usage** - Check Reports tab to track database size and API calls
5. **Backup regularly** - Free tier includes daily backups (7-day retention)

---

## 🔗 Useful Links

- **Supabase Dashboard**: https://app.supabase.com
- **Documentation**: https://supabase.com/docs
- **Auth Guide**: https://supabase.com/docs/guides/auth
- **Database Guide**: https://supabase.com/docs/guides/database
- **pgvector Guide**: https://supabase.com/docs/guides/ai/vector-columns

---

**Ready to proceed?** Once Supabase is set up, we'll create the database schema and implement authentication! 🚀
