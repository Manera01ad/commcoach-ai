# ⚠️ IMPORTANT: How to Configure Your Backend

## The Confusion (Now Fixed!)

You were editing the **WRONG .env file**!

- ❌ **WRONG**: `commcoach\.env` (root directory - now moved to backup)
- ✅ **CORRECT**: `commcoach\backend\.env` (inside backend folder)

## 📝 Step-by-Step: Edit the Correct File

### 1. Open the Correct .env File

In VS Code, open:
```
commcoach\backend\.env
```

### 2. It Should Look Like This:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Gemini API Key (Get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here    ← CHANGE THIS LINE

# CORS Origins (Frontend URL)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Future: Database
# DATABASE_URL=postgresql://...

# Future: JWT Secret
# JWT_SECRET=your_jwt_secret_here
```

### 3. Replace Line 6 with Your Actual API Key:

**BEFORE:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**AFTER:**
```env
GEMINI_API_KEY=AIzaSyBcD1234567890xxxxxxxxxxxxxxxxxxx
```

**Important:**
- ✅ No quotes around the key
- ✅ No spaces around the `=` sign
- ✅ Just: `GEMINI_API_KEY=AIza...`

### 4. Save the file (Ctrl+S)

### 5. Start the Server

Open terminal in the `backend` folder:

```bash
cd backend
npm run dev
```

## ✅ Expected Result:

```
🚀 CommCoach Backend Server
================================
✅ Server running on http://localhost:3001
✅ Environment: development
✅ Health Check: http://localhost:3001/health
✅ API Base: http://localhost:3001/api
================================
```

## 🆘 If It Still Fails:

1. Make sure you're editing `backend\.env` (not root `.env`)
2. Make sure there are no quotes or extra spaces
3. Make sure you saved the file
4. Make sure you're running `npm run dev` from the `backend` folder

---

**You can now delete the `old_files_backup` folder once you confirm everything works!**
