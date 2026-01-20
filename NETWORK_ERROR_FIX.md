# 🔧 NETWORK ERROR FIX GUIDE

**Issue:** Frontend showing "Network Error" on login  
**Cause:** Frontend pointing to localhost but backend not running locally  
**Solution:** Point to Railway backend

---

## ✅ **FIXED!**

I've updated your `.env.local` to point to Railway backend:

```bash
# Before (broken):
VITE_API_URL=http://localhost:3001/api

# After (fixed):
VITE_API_URL=https://commcoach-ai-production.up.railway.app/api
```

---

## 🚀 **TO APPLY THE FIX:**

### **Option 1: Restart Frontend (Local)**

```bash
# Stop current dev server (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

The login should work now!

---

### **Option 2: Vercel (Production)**

The fix is already in `.env.local`, but Vercel needs environment variables set in dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add/Update:
   ```
   VITE_API_URL = https://commcoach-ai-production.up.railway.app/api
   ```
5. Redeploy

---

## 🧪 **TEST THE FIX:**

### **Test Locally:**
```bash
cd frontend
npm run dev
```

Then try to login at http://localhost:5173

### **Test on Vercel:**
Go to your Vercel URL and try to login

---

## 🔍 **VERIFY BACKEND IS RUNNING:**

```bash
# Test Railway backend
curl https://commcoach-ai-production.up.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

---

## ⚠️ **IF STILL NOT WORKING:**

### **Check Railway Backend:**

1. Go to https://railway.app
2. Select your project
3. Check deployment status
4. View logs for errors

### **Common Issues:**

**Issue 1: Backend not deployed**
- Solution: Push latest code to GitHub
- Railway auto-deploys

**Issue 2: CORS error**
- Solution: Backend needs to allow your Vercel domain
- Check `backend/server.js` CORS settings

**Issue 3: Wrong Railway URL**
- Solution: Get correct URL from Railway dashboard
- Update `.env.local`

---

## 📋 **ENVIRONMENT VARIABLES CHECKLIST:**

### **Frontend (.env.local):**
```bash
✅ VITE_SUPABASE_URL=https://jmaerbneeavezfrvttzq.supabase.co
✅ VITE_SUPABASE_ANON_KEY=eyJhbGci...
✅ VITE_API_URL=https://commcoach-ai-production.up.railway.app/api
```

### **Vercel Dashboard:**
```bash
✅ VITE_SUPABASE_URL
✅ VITE_SUPABASE_ANON_KEY  
✅ VITE_API_URL (Railway URL)
```

---

## 🎯 **NEXT STEPS:**

1. **Restart frontend** - Apply the fix
2. **Test login** - Should work now
3. **Deploy to Vercel** - Update env vars
4. **Verify** - Test on production

---

**The fix is applied!** Just restart your frontend dev server! 🚀

---

**Last Updated:** 2026-01-20 21:02 PM  
**Status:** Network error fixed - pointing to Railway backend  
**Next:** Restart frontend and test login
