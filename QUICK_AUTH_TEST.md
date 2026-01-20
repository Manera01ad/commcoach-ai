# 🚀 Quick Start: Test Authentication

## ⚠️ CRITICAL: Apply Database Patch First!

### Step 1: Apply SQL Patch to Supabase

1. Open: https://supabase.com/dashboard
2. Select project: `jmaerbneeavezfrvttzq`
3. Go to: **SQL Editor** → **New Query**
4. Copy/paste contents from: `database/patch_fix_infinite_recursion.sql`
5. Click **Run**
6. Verify: ✅ Infinite recursion fix applied successfully!

---

## 🧪 Step 2: Run Automated Tests

```powershell
# Make sure you're in the project root
cd C:\Users\Hp\.gemini\antigravity\scratch\commcoach-ai

# Run the test script
powershell -ExecutionPolicy Bypass -File test-auth.ps1
```

**Expected Output:**
```
✅ Backend is healthy
✅ Sign Up Successful!
✅ Sign In Successful!
✅ Session Retrieved Successfully!
✅ ALL TESTS PASSED!
```

---

## 🌐 Step 3: Test in Browser

### Open the App:
```
http://localhost:5173
```

### Test Sign Up:
1. Click **"Create Account"**
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Create Account"**
4. Should see: ✅ **"Account Created!"**

### Test Sign In:
1. Click **"Proceed to Login"**
2. Enter credentials
3. Click **"Sign In"**
4. Should redirect to: **CommCoach Dashboard**

---

## 📊 Verify in Supabase

1. Go to: https://supabase.com/dashboard
2. Navigate to: **Table Editor** → **profiles**
3. Find your test user
4. Check: ✅ User exists with correct data

---

## 🐛 If Tests Fail

### Backend Error:
```powershell
# Check backend logs
cd backend
npm run dev
# Look for error messages in terminal
```

### Frontend Error:
```
# Open browser DevTools (F12)
# Check Console tab for errors
```

### Database Error:
```
# Go to Supabase Dashboard
# Check: Logs → Recent Logs
# Look for RLS policy errors
```

---

## 📁 Important Files

- **Test Script:** `test-auth.ps1`
- **SQL Patch:** `database/patch_fix_infinite_recursion.sql`
- **Full Guide:** `AUTH_FIX_GUIDE.md`
- **Checklist:** `AUTHENTICATION_TEST_CHECKLIST.md`

---

## ✅ Success = All Green Checkmarks!

When everything works:
- ✅ Automated tests pass
- ✅ Sign up works in browser
- ✅ Sign in works in browser
- ✅ User data in Supabase
- ✅ No errors in console

**Then you're ready for Phase 3! 🎉**
