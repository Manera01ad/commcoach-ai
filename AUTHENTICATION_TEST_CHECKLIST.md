# 🧪 Authentication Testing Checklist

**Project:** CommCoach AI  
**Date:** 2026-01-20  
**Status:** ⚠️ REQUIRES DATABASE PATCH

---

## ⚠️ IMPORTANT: Apply Database Patch First!

Before testing, you **MUST** apply the SQL patch to fix the infinite recursion error:

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Go to SQL Editor
3. Copy contents from: `database/patch_fix_infinite_recursion.sql`
4. Paste and run the query
5. Verify you see: ✅ Infinite recursion fix applied successfully!

**See `AUTH_FIX_GUIDE.md` for detailed instructions.**

---

## 📋 Pre-Testing Setup

### ✅ Backend Running
- [ ] Backend server is running on http://localhost:3001
- [ ] Health check passes: http://localhost:3001/health
- [ ] No errors in backend terminal

**Command:**
```powershell
cd backend
npm run dev
```

### ✅ Frontend Running
- [ ] Frontend server is running on http://localhost:5173
- [ ] Page loads without errors
- [ ] No console errors in browser DevTools

**Command:**
```powershell
cd frontend
npm run dev
```

### ✅ Database Patch Applied
- [ ] SQL patch has been applied to Supabase
- [ ] No RLS policy errors in Supabase logs
- [ ] `is_admin()` function exists in database

---

## 🧪 Test Suite 1: API Testing (Automated)

**Run:** `powershell -ExecutionPolicy Bypass -File test-auth.ps1`

### Expected Results:
- [ ] ✅ Backend health check passes
- [ ] ✅ Sign up creates new user
- [ ] ✅ Sign in returns access token
- [ ] ✅ Get session returns user profile
- [ ] ✅ All 4 tests pass

### If Tests Fail:
- Check backend terminal for errors
- Check Supabase Dashboard > Logs
- Verify database patch was applied
- See troubleshooting in `AUTH_FIX_GUIDE.md`

---

## 🌐 Test Suite 2: Browser UI Testing (Manual)

### Test 1: Initial Page Load
**URL:** http://localhost:5173

- [ ] Page loads successfully
- [ ] Login form is displayed
- [ ] "Create Account" button is visible
- [ ] No console errors (F12 > Console)
- [ ] Branding and UI look correct

### Test 2: Sign Up Flow

**Steps:**
1. Click "Create Account" button
2. Fill in the form:
   - Full Name: `Test User`
   - Email: `test.user.$(date)@example.com` (use unique email)
   - Password: `password123`
3. Click "Create Account"

**Expected Results:**
- [ ] Form submits without errors
- [ ] Loading spinner appears briefly
- [ ] Success message: "Account Created!"
- [ ] Green checkmark icon appears
- [ ] "Proceed to Login" button is shown
- [ ] No errors in browser console
- [ ] No errors in backend terminal

**If Fails:**
- [ ] Check error message displayed
- [ ] Check browser console (F12)
- [ ] Check backend terminal logs
- [ ] Verify database patch was applied

### Test 3: Sign In Flow

**Steps:**
1. Click "Proceed to Login" (or "Sign In" if already on login page)
2. Enter credentials:
   - Email: (from Test 2)
   - Password: `password123`
3. Click "Sign In"

**Expected Results:**
- [ ] Form submits without errors
- [ ] Loading spinner appears briefly
- [ ] User is redirected to main application
- [ ] User sees the CommCoach dashboard/chat interface
- [ ] User profile is loaded
- [ ] No errors in browser console
- [ ] No errors in backend terminal

**If Fails:**
- [ ] Check error message displayed
- [ ] Verify email/password are correct
- [ ] Check browser console (F12)
- [ ] Check backend terminal logs

### Test 4: Invalid Credentials

**Steps:**
1. Go to login page
2. Enter:
   - Email: `wrong@example.com`
   - Password: `wrongpassword`
3. Click "Sign In"

**Expected Results:**
- [ ] Error message is displayed
- [ ] User stays on login page
- [ ] Error is clear and helpful
- [ ] No console errors

### Test 5: Password Visibility Toggle

**Steps:**
1. On login or signup page
2. Enter password
3. Click the eye icon

**Expected Results:**
- [ ] Password becomes visible when eye is clicked
- [ ] Password becomes hidden when eye-off is clicked
- [ ] Toggle works smoothly

### Test 6: Form Validation

**Steps:**
1. Try to submit empty form
2. Try to submit with invalid email
3. Try to submit with password < 6 characters

**Expected Results:**
- [ ] Browser validation prevents submission
- [ ] Helpful error messages appear
- [ ] Form highlights invalid fields

### Test 7: Navigation Between Login/Signup

**Steps:**
1. Start on login page
2. Click "Create Account"
3. Click "Sign In" to go back

**Expected Results:**
- [ ] Smooth transition between forms
- [ ] No page reload
- [ ] Form fields are cleared
- [ ] No errors

---

## 🔒 Test Suite 3: Session Management

### Test 8: Protected Routes

**Steps:**
1. Sign in successfully
2. Note the URL after login
3. Open a new incognito/private window
4. Try to access the URL directly

**Expected Results:**
- [ ] Unauthenticated user is redirected to login
- [ ] Authenticated user can access the route
- [ ] Session persists on page refresh

### Test 9: Logout (if implemented)

**Steps:**
1. Sign in
2. Click logout button
3. Try to access protected route

**Expected Results:**
- [ ] User is logged out
- [ ] Redirected to login page
- [ ] Cannot access protected routes
- [ ] Session is cleared

---

## 📊 Test Suite 4: Database Verification

### Test 10: User Data in Supabase

**Steps:**
1. Go to Supabase Dashboard
2. Navigate to Table Editor > profiles
3. Find the user you created

**Expected Results:**
- [ ] User exists in `profiles` table
- [ ] Email is correct
- [ ] Full name is correct
- [ ] Status is "pending" (default)
- [ ] Created_at timestamp is recent
- [ ] ID matches auth.users ID

### Test 11: Authentication in Supabase

**Steps:**
1. Go to Supabase Dashboard
2. Navigate to Authentication > Users
3. Find the user you created

**Expected Results:**
- [ ] User exists in auth.users
- [ ] Email is confirmed (or pending if email verification is enabled)
- [ ] User metadata contains full_name
- [ ] Last sign in time is recent

---

## ✅ Success Criteria

All tests pass when:

### Backend
- ✅ Server runs without errors
- ✅ All API endpoints respond correctly
- ✅ Database connection is stable
- ✅ RLS policies work correctly

### Frontend
- ✅ UI loads without errors
- ✅ Forms are responsive and validated
- ✅ Error messages are clear
- ✅ Success states are shown
- ✅ Navigation works smoothly

### Authentication
- ✅ Users can sign up
- ✅ Users can sign in
- ✅ Sessions are maintained
- ✅ Protected routes are secure
- ✅ Data is stored correctly in Supabase

### User Experience
- ✅ UI is visually appealing
- ✅ Loading states are clear
- ✅ Error handling is graceful
- ✅ Forms are intuitive
- ✅ Transitions are smooth

---

## 🐛 Known Issues

### Issue 1: Infinite Recursion Error
- **Status:** ⚠️ REQUIRES FIX
- **Solution:** Apply `database/patch_fix_infinite_recursion.sql`
- **Guide:** See `AUTH_FIX_GUIDE.md`

### Issue 2: Email Verification
- **Status:** ℹ️ Optional
- **Note:** Email verification is disabled for testing
- **Future:** Enable in production

---

## 📝 Test Results Log

**Tester:** _________________  
**Date:** _________________  
**Time:** _________________

### API Tests:
- Backend Health: ☐ Pass ☐ Fail
- Sign Up: ☐ Pass ☐ Fail
- Sign In: ☐ Pass ☐ Fail
- Get Session: ☐ Pass ☐ Fail

### UI Tests:
- Page Load: ☐ Pass ☐ Fail
- Sign Up Flow: ☐ Pass ☐ Fail
- Sign In Flow: ☐ Pass ☐ Fail
- Invalid Credentials: ☐ Pass ☐ Fail
- Password Toggle: ☐ Pass ☐ Fail
- Form Validation: ☐ Pass ☐ Fail
- Navigation: ☐ Pass ☐ Fail

### Session Tests:
- Protected Routes: ☐ Pass ☐ Fail
- Logout: ☐ Pass ☐ Fail

### Database Tests:
- User in Profiles: ☐ Pass ☐ Fail
- User in Auth: ☐ Pass ☐ Fail

### Overall Result:
☐ ALL TESTS PASSED - Ready for Phase 3  
☐ SOME TESTS FAILED - See notes below

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## 🚀 Next Steps After All Tests Pass

1. ✅ Mark Phase 2 (Authentication) as complete
2. 📝 Update `PHASE_COMPLETION_STATUS.md`
3. 🎯 Begin Phase 3: Multi-Modal Agent System
4. 🚀 Deploy authentication to production (Vercel + Railway)
5. 📊 Monitor authentication metrics

---

**Last Updated:** 2026-01-20  
**Version:** 1.0  
**Maintainer:** CommCoach AI Team
