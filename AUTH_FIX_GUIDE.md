# ========================================
# CommCoach AI - Authentication Fix Guide
# ========================================

## 🔴 CRITICAL ISSUE DETECTED

The authentication signup is failing due to an **infinite recursion error** in the Supabase RLS (Row Level Security) policies.

### Error Details:
```
AuthApiError: Database error saving new user
status: 500
code: 'unexpected_failure'
```

This happens because the RLS policies are checking if a user is an admin by querying the `profiles` table, which triggers the same policy again, creating an infinite loop.

---

## ✅ SOLUTION: Apply the SQL Patch

You need to run the SQL patch file in your Supabase database to fix this issue.

### Option 1: Using Supabase Dashboard (RECOMMENDED)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `jmaerbneeavezfrvttzq`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the Patch**
   - Open the file: `database/patch_fix_infinite_recursion.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor

4. **Run the Query**
   - Click "Run" or press Ctrl+Enter
   - You should see: ✅ Infinite recursion fix applied successfully!

5. **Verify the Fix**
   - Run the authentication test again: `powershell -ExecutionPolicy Bypass -File test-auth.ps1`

---

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```powershell
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref jmaerbneeavezfrvttzq

# Apply the patch
supabase db push --file database/patch_fix_infinite_recursion.sql
```

---

## 📋 What the Patch Does

1. **Creates a Safe Function**: `is_admin()`
   - Uses `SECURITY DEFINER` to bypass RLS
   - Prevents infinite recursion

2. **Drops Problematic Policies**
   - Removes the recursive admin policies

3. **Recreates Policies Safely**
   - Uses the new `is_admin()` function
   - No more infinite loops!

---

## 🧪 After Applying the Patch

Run the authentication test to verify everything works:

```powershell
# Make sure backend is running
cd backend
npm run dev

# In another terminal, run the test
cd ..
powershell -ExecutionPolicy Bypass -File test-auth.ps1
```

Expected output:
```
✅ Backend is healthy
✅ Sign Up Successful!
✅ Sign In Successful!
✅ Session Retrieved Successfully!
✅ ALL TESTS PASSED!
```

---

## 🌐 Manual Browser Testing

After the patch is applied and tests pass:

1. **Open the Application**
   - Go to: http://localhost:5173

2. **Test Sign Up**
   - Click "Create Account"
   - Fill in:
     - Full Name: Your Name
     - Email: your.email@example.com
     - Password: password123 (min 6 chars)
   - Click "Create Account"
   - Should see: "Account Created!" success message

3. **Test Sign In**
   - Click "Proceed to Login"
   - Enter your credentials
   - Click "Sign In"
   - Should redirect to the main CommCoach application

---

## 🚨 Troubleshooting

### If signup still fails:

1. **Check Supabase Logs**
   - Go to Supabase Dashboard > Logs
   - Look for error messages

2. **Verify RLS Policies**
   - Go to Supabase Dashboard > Authentication > Policies
   - Check if the new policies are there

3. **Check Backend Logs**
   - Look at the terminal running `npm run dev`
   - Should show detailed error messages

### If you see "Email already exists":
   - This is normal if you've tested before
   - Use a different email address
   - Or delete the user from Supabase Dashboard > Authentication > Users

---

## 📞 Need Help?

If you're still having issues after applying the patch:

1. Check the backend terminal for detailed error logs
2. Check the Supabase Dashboard > Logs for database errors
3. Verify your `.env` files have the correct Supabase credentials
4. Make sure both backend (port 3001) and frontend (port 5173) are running

---

## ✅ Success Criteria

Authentication is working when:
- ✅ New users can sign up without errors
- ✅ Users can sign in with correct credentials
- ✅ Users are redirected to the main app after login
- ✅ Protected routes require authentication
- ✅ User profile data is stored in Supabase

---

**Next Steps After Fix:**
1. Test the complete authentication flow in the browser
2. Verify user data is stored correctly in Supabase
3. Test logout functionality
4. Move on to Phase 3: Multi-Modal Agent System
