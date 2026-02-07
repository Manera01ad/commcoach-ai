# Task: Phase 2 - Authentication & User Management

**Status:** ✅ COMPLETED
**Priority:** High
**Completed:** 2026-01-21
**Goal:** Implement full user authentication flow using Supabase Auth, including signup, login, email verification, and admin approval.

---

## 📋 Objectives

1.  **Backend Auth API**: Create endpoints for user management.
2.  **Frontend Auth Pages**: Build UI for Login, Signup, and Password Reset.
3.  **Admin Approval System**: Users stay in "pending" state until admin approves.
4.  **Security**: Protect routes and API endpoints.

---

## 🛠️ Implementation Steps

### 1. Backend Implementation (Node.js/Express)

- [ ] **Create Auth Controller (`controllers/authController.js`)**
    - `signup`: Register user with Supabase Auth + create Profile record.
    - `signin`: Authenticate user + check if status is 'active'.
    - `signout`: Clear cookies/tokens.
    - `me`: Get current user session.

- [ ] **Create Admin Controller (`controllers/adminController.js`)**
    - `getPendingUsers`: List users with `status = 'pending'`.
    - `approveUser`: Update user status to 'active'.
    - `rejectUser`: Update user status to 'rejected'.

- [ ] **Define Routes (`routes/auth.js`)**
    - POST `/api/auth/signup`
    - POST `/api/auth/signin`
    - POST `/api/auth/signout`
    - GET `/api/auth/me`

- [ ] **Define Routes (`routes/admin.js`)**
    - GET `/api/admin/pending` (Admin only)
    - POST `/api/admin/approve/:id` (Admin only)

### 2. Frontend Implementation (React)

- [ ] **Setup Auth Context (`context/AuthContext.tsx`)**
    - Manage global user state.
    - Persist session.

- [ ] **Create API Service (`services/authService.ts`)**
    - Helper functions to call backend auth endpoints.

- [ ] **Build Pages**
    - `pages/Login.tsx`: Email/Password form.
    - `pages/Signup.tsx`: Registration form.
    - `pages/PendingApproval.tsx`: "Wait for admin" screen.
    - `pages/Dashboard.tsx`: Protected home page.

- [ ] **Add Routing (`App.tsx`)**
    - Wrap protected routes with `<ProtectedRoute>`.
    - Redirect unauthenticated users to `/login`.

---

## 🧪 Verification Criteria

1.  **Signup Flow**:
    - User signs up -> Entry created in `auth.users` AND `profiles` table.
    - `profiles.status` defaults to `'pending'`.
2.  **Login Flow (Access Control)**:
    - Pending user attempts login -> Receives "Account pending approval" message.
    - Active user attempts login -> Successfully redirected to Dashboard.
3.  **Admin Flow**:
    - Admin can see list of pending users.
    - Admin clicks "Approve" -> Database updates status to `'active'`.
    - User can now log in.

---

## 📂 Key Files to Create/Edit

- `backend/routes/auth.js`
- `backend/controllers/authController.js`
- `frontend/src/context/AuthContext.tsx`
- `frontend/src/pages/Login.tsx`
- `frontend/src/pages/Signup.tsx`
