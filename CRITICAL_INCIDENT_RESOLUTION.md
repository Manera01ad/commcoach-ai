# 🚨 CRITICAL INCIDENT RESOLUTION PLAN
**Date**: 2026-01-14T21:40:01+05:30  
**Priority**: IMMEDIATE  
**Status**: ⏳ IN PROGRESS

---

## 📋 INCIDENT SUMMARY

### 🔴 Incident #001: Railway Backend Offline
- **Severity**: CRITICAL
- **Impact**: Application completely non-functional
- **Root Cause**: Backend not deployed or deployment failed on Railway
- **Affected**: All users, all features

### 🔴 Incident #002: API Key Exposure in Frontend
- **Severity**: CRITICAL (Security)
- **Impact**: Security breach, API quota theft risk
- **Root Cause**: Direct Gemini API calls from frontend with exposed keys
- **Affected**: 10 instances across 4 components + vite.config.ts

---

## 🎯 RESOLUTION STRATEGY

### Phase 1: Railway Backend Deployment (IMMEDIATE)
### Phase 2: API Key Security Fix (IMMEDIATE)
### Phase 3: Verification & Testing (FOLLOW-UP)

---

## 🔧 PHASE 1: FIX RAILWAY BACKEND DEPLOYMENT

### Root Cause Analysis

**Likely Issues**:
1. ❌ Backend never deployed to Railway
2. ❌ Deployment failed and wasn't redeployed
3. ❌ Railway project deleted or deprovisioned
4. ❌ Wrong deployment URL in documentation

### Solution A: Check Railway Dashboard (Manual - Requires User)

**Action Required**: Check Railway dashboard for project status

**Access Railway**: https://railway.app/

**Steps to Verify**:
1. Login to Railway account
2. Look for "commcoach-backend" or similar project
3. Check deployment status:
   - ✅ If deployed: Note the actual URL
   - ❌ If failed: Check error logs
   - ❌ If not found: Need to create new deployment

**Expected URL Format**:
```
https://<project-name>.up.railway.app
```

### Solution B: Redeploy Backend to Railway

**Option 1: Using Railway CLI** (Recommended)
```powershell
# Install Railway CLI (if not installed)
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to backend directory
cd c:/Users/Hp/.gemini/antigravity/scratch/commcoach-ai/backend

# Link to Railway project (if exists)
railway link

# Deploy
railway up

# Get deployment URL
railway domain
```

**Option 2: Using GitHub Auto-Deploy**
```powershell
# Push code to GitHub (triggers auto-deploy if configured)
cd c:/Users/Hp/.gemini/antigravity/scratch/commcoach-ai
git add backend/
git commit -m "fix: redeploy backend to Railway"
git push origin main
```

**Option 3: Create New Railway Project**
```powershell
# Navigate to backend
cd c:/Users/Hp/.gemini/antigravity/scratch/commcoach-ai/backend

# Initialize Railway project
railway init

# Deploy
railway up

# Add environment variables (CRITICAL)
railway variables set GEMINI_API_KEY=<your-key>
railway variables set NODE_ENV=production
railway variables set ALLOWED_ORIGINS=https://commcoach-ai.vercel.app,http://localhost:5173

# Get assigned URL
railway domain
```

### Critical Environment Variables (Railway)

**Required Variables**:
```env
PORT=3001                                    # Railway auto-assigns, but good to set
NODE_ENV=production                          # Production mode
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>        # MUST SET
ALLOWED_ORIGINS=https://commcoach-ai.vercel.app,http://localhost:5173
```

**How to Set** (Railway Dashboard):
1. Go to project settings
2. Click "Variables" tab
3. Add each variable above
4. Redeploy after setting

---

## 🔒 PHASE 2: FIX API KEY SECURITY EXPOSURE

### Security Issue Breakdown

**Exposed Locations** (10 instances):
1. `frontend/App.tsx` - Line 88
2. `frontend/components/ChatWindow.tsx` - Lines 149, 201
3. `frontend/components/VisionLab.tsx` - Lines 43, 69, 98, 127
4. `frontend/components/MeetingAgent.tsx` - Lines 103, 184, 257
5. `frontend/vite.config.ts` - Lines 14, 15

### Solution: Route All AI Calls Through Backend Proxy

**Architecture Change**:
```
❌ BEFORE (Insecure):
Frontend → Direct Gemini API Call (Using exposed API key)

✅ AFTER (Secure):
Frontend → Backend API Proxy → Gemini API (Using secure backend key)
```

### Implementation Plan

#### Step 1: Remove API Key from Frontend Environment

**File**: `frontend/vite.config.ts`

**REMOVE** these lines (14-15):
```typescript
'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
```

**Also Remove** from Vercel environment variables:
- Go to Vercel dashboard → Project Settings → Environment Variables
- Delete `GEMINI_API_KEY` and `API_KEY` if present

#### Step 2: Create Frontend API Service

**File**: `frontend/src/services/api.ts` (NEW FILE)

```typescript
// API service to communicate with backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const geminiAPI = {
  // General text generation
  async generate(prompt: string, config = {}) {
    const response = await fetch(`${API_BASE_URL}/api/gemini/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, config })
    });
    
    if (!response.ok) throw new Error('AI generation failed');
    return response.json();
  },

  // Structured output generation
  async structured(prompt: string, schema: object) {
    const response = await fetch(`${API_BASE_URL}/api/gemini/structured`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, schema })
    });
    
    if (!response.ok) throw new Error('Structured generation failed');
    return response.json();
  }
};
```

#### Step 3: Refactor Frontend Components to Use Backend Proxy

**Affected Files**:
- `frontend/App.tsx`
- `frontend/components/ChatWindow.tsx`
- `frontend/components/VisionLab.tsx`
- `frontend/components/MeetingAgent.tsx`

**Pattern to Replace**:

**❌ BEFORE** (Direct API call):
```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
const result = await model.generateContent(prompt);
const text = result.response.text();
```

**✅ AFTER** (Backend proxy):
```typescript
import { geminiAPI } from '../services/api';

const result = await geminiAPI.generate(prompt, {
  model: 'gemini-1.5-flash',
  temperature: 0.7
});
const text = result.data.text;
```

#### Step 4: Verify Backend Has Required Endpoints

**Check**: `backend/routes/gemini.js` should have:
- `POST /api/gemini/generate` ✅
- `POST /api/gemini/structured` ✅

**These already exist** based on server.js configuration.

---

## 📝 DETAILED FIX INSTRUCTIONS

### Fix #1: App.tsx (1 instance)

**File**: `frontend/App.tsx`  
**Line**: 88

**Current Code**:
```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

**Replacement**:
```typescript
import { geminiAPI } from './services/api';

// Later in the function, replace AI calls with:
const result = await geminiAPI.generate(yourPrompt);
```

### Fix #2: ChatWindow.tsx (2 instances)

**File**: `frontend/components/ChatWindow.tsx`  
**Lines**: 149, 201

**Replace all `GoogleGenAI` instances** with backend API calls using `geminiAPI.generate()`

### Fix #3: VisionLab.tsx (4 instances)

**File**: `frontend/components/VisionLab.tsx`  
**Lines**: 43, 69, 98, 127

**Special Note**: Line 127 uses API key in URL parameter:
```typescript
const fetchRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
```

**Fix**: Move this to backend route or use alternative method

### Fix #4: MeetingAgent.tsx (3 instances)

**File**: `frontend/components/MeetingAgent.tsx`  
**Lines**: 103, 184, 257

**Replace with structured API calls** for meeting analysis

---

## ✅ VERIFICATION CHECKLIST

### After Railway Deployment
- [ ] Backend accessible at Railway URL
- [ ] `/health` endpoint returns 200 OK
- [ ] `/api` endpoint returns API documentation
- [ ] Environment variables set correctly
- [ ] Logs show successful startup

### After API Key Removal
- [ ] No `API_KEY` or `GEMINI_API_KEY` in frontend code (verified with grep)
- [ ] Frontend uses backend proxy for all AI calls
- [ ] `vite.config.ts` cleaned of API key references
- [ ] Vercel environment variables cleaned
- [ ] Backend Gemini API key still secure

### Integration Testing
- [ ] Frontend can reach backend
- [ ] AI features work through backend proxy
- [ ] No CORS errors
- [ ] All components functional

---

## 🎯 QUICK START COMMANDS

### Check Railway Status
```powershell
cd c:/Users/Hp/.gemini/antigravity/scratch/commcoach-ai/backend
railway status
railway logs
```

### Redeploy to Railway
```powershell
cd c:/Users/Hp/.gemini/antigravity/scratch/commcoach-ai/backend
railway up
```

### Test Backend Health
```powershell
# After deployment, test with:
curl https://your-railway-url.up.railway.app/health
```

### Check API Key Exposure
```powershell
cd c:/Users/Hp/.gemini/antigravity/scratch/commcoach-ai/frontend
grep -r "API_KEY" src/
# Should return zero results after fixes
```

---

## 🚀 RECOMMENDED EXECUTION ORDER

1. **Fix Railway Backend** (15-20 minutes)
   - Check Railway dashboard
   - Redeploy if needed
   - Verify health endpoint
   - Note actual deployment URL

2. **Update Frontend Environment** (5 minutes)
   - Set `VITE_API_URL` in Vercel to Railway URL
   - Remove `GEMINI_API_KEY` from Vercel
   - Redeploy frontend

3. **Fix API Key Exposure** (30-45 minutes)
   - Create `services/api.ts`
   - Refactor App.tsx
   - Refactor ChatWindow.tsx
   - Refactor VisionLab.tsx
   - Refactor MeetingAgent.tsx
   - Update vite.config.ts
   - Test locally
   - Deploy to Vercel

4. **Verification** (10 minutes)
   - Test full application flow
   - Verify no API keys in frontend
   - Check backend logs
   - Test all AI features

---

## 📊 SUCCESS CRITERIA

### Incident #001 Resolution
- ✅ Railway backend deployed and accessible
- ✅ Health endpoint returns proper JSON
- ✅ All API routes functional
- ✅ No 404 errors

### Incident #002 Resolution
- ✅ Zero `API_KEY` references in frontend code
- ✅ All AI calls routed through backend
- ✅ `vite.config.ts` cleaned
- ✅ Vercel environment cleaned
- ✅ Application fully functional

---

## 🤝 SUPPORT RESOURCES

### Railway Documentation
- Deploy Guide: https://docs.railway.app/deploy/deployments
- Environment Variables: https://docs.railway.app/develop/variables
- CLI Reference: https://docs.railway.app/develop/cli

### Vercel Documentation
- Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables
- Deployments: https://vercel.com/docs/concepts/deployments/overview

---

**Status**: Ready for execution  
**Estimated Time**: 1-1.5 hours total  
**Risk Level**: MEDIUM (requires code refactoring)  
**Priority**: IMMEDIATE

---

*Created by Documentation Agent*  
*Incident Response Plan - 2026-01-14*
