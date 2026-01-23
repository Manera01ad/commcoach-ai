# Authentication Setup Guide

## Overview
This guide explains the production-ready authentication system implemented for CommCoach AI using Supabase.

## Features Implemented ✅

### 1. **Supabase Authentication Integration**
- Direct Supabase client integration (no backend proxy needed for auth)
- Email/Password authentication
- Automatic session persistence
- Session restoration on page refresh
- Auth state change listeners

### 2. **Protected Routes**
- `ProtectedRoute` component guards authenticated routes
- Automatic redirect to login for unauthenticated users
- Loading states during authentication checks

### 3. **Dynamic Redirect URLs**
- Auto-detects environment (localhost vs production)
- Works seamlessly on both:
  - Development: `http://localhost:5173`
  - Production: `https://commcoach-ai.vercel.app`

### 4. **Session Management**
- Automatic token refresh
- Persistent sessions across page refreshes
- Secure localStorage-based session storage
- Automatic cleanup on logout

## File Structure

```
frontend/
├── src/
│   ├── lib/
│   │   └── supabaseClient.ts          # Supabase configuration & client
│   ├── contexts/
│   │   └── AuthContext.tsx            # Auth state management
│   ├── components/
│   │   └── ProtectedRoute.tsx         # Route guard component
│   ├── pages/
│   │   └── auth/
│   │       ├── AuthRouter.tsx         # Auth page router
│   │       ├── Login.tsx              # Login component
│   │       └── Signup.tsx             # Signup component
│   └── services/
│       └── authService.ts             # Legacy auth service (can be removed)
├── App.tsx                            # Main app with routing
├── .env.local                         # Local environment variables
├── .env.production                    # Production environment variables
└── .env.example                       # Environment template
```

## Setup Instructions

### 1. Local Development

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update `.env.local` with your Supabase credentials:**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_API_URL=http://localhost:3001/api
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

### 2. Production Deployment (Vercel)

1. **Set environment variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=https://jmaerbneeavezfrvttzq.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     VITE_API_URL=https://your-backend.railway.app/api
     ```

2. **Configure Supabase redirect URLs:**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add these URLs to "Redirect URLs":
     ```
     http://localhost:5173
     https://commcoach-ai.vercel.app
     ```

3. **Deploy to Vercel:**
   ```bash
   git push origin main
   ```
   Vercel will automatically deploy your changes.

## How It Works

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User visits app                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthContext checks for existing session                    │
│  (supabase.auth.getSession())                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐   ┌──────────────────┐
│ Session      │   │ No Session       │
│ Found        │   │ Found            │
└──────┬───────┘   └────────┬─────────┘
       │                    │
       ▼                    ▼
┌──────────────┐   ┌──────────────────┐
│ Set user     │   │ Redirect to      │
│ state        │   │ /login           │
└──────┬───────┘   └────────┬─────────┘
       │                    │
       ▼                    ▼
┌──────────────┐   ┌──────────────────┐
│ Show         │   │ Show Login/      │
│ Dashboard    │   │ Signup Form      │
└──────────────┘   └──────────────────┘
```

### Login Process

1. User enters email/password
2. `AuthContext.login()` calls `supabase.auth.signInWithPassword()`
3. Supabase returns session + user data
4. `onAuthStateChange` listener updates context state
5. `ProtectedRoute` detects authenticated user
6. User is shown the main dashboard

### Session Persistence

1. Supabase automatically stores session in localStorage
2. On page refresh, `AuthContext` calls `supabase.auth.getSession()`
3. If valid session exists, user state is restored
4. User remains logged in without re-entering credentials

## API Reference

### AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
```

### Usage Example

```typescript
import { useAuth } from './src/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      // User is now logged in
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Troubleshooting

### Issue: "User not redirected after login"
**Solution:** Check that `ProtectedRoute` is wrapping your protected routes in `App.tsx`

### Issue: "Session not persisting on refresh"
**Solution:** 
- Ensure `persistSession: true` in `supabaseClient.ts`
- Check browser localStorage for `sb-*` keys
- Verify Supabase URL and anon key are correct

### Issue: "CORS errors in production"
**Solution:**
- Add your Vercel URL to Supabase allowed origins
- Ensure environment variables are set in Vercel dashboard

### Issue: "Redirect URL mismatch"
**Solution:**
- Add both localhost and production URLs to Supabase redirect URLs
- Check `getRedirectUrl()` function in `supabaseClient.ts`

## Security Best Practices

✅ **Implemented:**
- Anon key is public (safe to expose in frontend)
- Session tokens stored in localStorage (Supabase default)
- Automatic token refresh
- HTTPS in production

⚠️ **Important:**
- Never commit `.env.local` to git
- Use Vercel environment variables for production secrets
- Regularly rotate Supabase service role key (not used in frontend)

## Next Steps

- [ ] Add OAuth providers (Google, GitHub, etc.)
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Create user profile management
- [ ] Add role-based access control (RBAC)

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs/guides/auth
2. Review this README
3. Check browser console for error messages
4. Verify environment variables are set correctly
