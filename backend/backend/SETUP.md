# 🚀 CommCoach Backend - Setup Guide

This guide will walk you through setting up and testing your CommCoach backend API.

## ✅ Phase 1 Completion Checklist

Follow this checklist to verify everything is working correctly:

### 1. Project Structure ✓
```
backend/
├── config/          ✓ Created
├── middleware/      ✓ Created  
├── routes/          ✓ Created
│   ├── antigravity.js   ✓
│   └── gemini.js        ✓
├── services/        ✓ Created
│   └── geminiService.js ✓
├── .env            ✓ Created (from .env.example)
├── .env.example    ✓ Created
├── .gitignore      ✓ Created
├── package.json    ✓ Created
├── README.md       ✓ Created
└── server.js       ✓ Created
```

### 2. Dependencies Installed ✓
All npm packages have been installed successfully.

### 3. Environment Configuration

**IMPORTANT**: You need to add your Gemini API key!

1. Open the `.env` file in the backend directory
2. Replace `your_gemini_api_key_here` with your actual API key
3. Get your API key from: https://aistudio.google.com/app/apikey

Your `.env` file should look like this:
```
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

## 🏃 Running the Server

### Start Development Server

Open a terminal in the `backend` directory and run:

```bash
npm run dev
```

You should see:
```
🚀 CommCoach Backend Server
================================
✅ Server running on http://localhost:3001
✅ Environment: development
✅ Health Check: http://localhost:3001/health
✅ API Base: http://localhost:3001/api
================================
```

## 🧪 Testing the API

### Option 1: Using the Test Script (Recommended)

**For PowerShell (Windows):**
```powershell
.\test-api.ps1
```

**For Bash (Mac/Linux/Git Bash):**
```bash
chmod +x test-api.sh
./test-api.sh
```

### Option 2: Manual Testing with curl

**Test 1: Health Check**
```bash
curl http://localhost:3001/health
```

Expected Response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-12T...",
  "uptime": 5.123,
  "environment": "development"
}
```

**Test 2: API Root**
```bash
curl http://localhost:3001/api
```

**Test 3: Antigravity Test**
```bash
curl http://localhost:3001/api/antigravity/test
```

**Test 4: Gemini Models**
```bash
curl http://localhost:3001/api/gemini/models
```

**Test 5: Gemini Generate** (requires API key)
```bash
curl -X POST http://localhost:3001/api/gemini/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.0-flash-exp",
    "prompt": "Say hello in a professional manner"
  }'
```

**Test 6: Antigravity Analysis** (requires API key)
```bash
curl -X POST http://localhost:3001/api/antigravity/analyze-session \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_1",
    "timestamp": "2025-01-12T00:00:00Z",
    "transcript": "USER: I struggle with public speaking. I get nervous.\nCOACH: Tell me more about when this happens.\nUSER: Mainly in meetings with executives."
  }'
```

Expected Response Structure:
```json
{
  "skillFocus": "Public Speaking",
  "confidenceLevel": 2,
  "challenges": "Nervousness in high-stakes situations",
  "practiceTime": "15 mins daily",
  "contentConsumed": {
    "type": "Video Training",
    "source": "CommCoach Library",
    "title": "Executive Presence Fundamentals",
    "actionability": 4
  },
  "metadata": {
    "role": "Professional",
    "industry": "Corporate",
    "feedbackPreference": "Direct"
  },
  "analyzedAt": "2026-01-12T...",
  "userId": "test_user_1",
  "transcriptLength": 147
}
```

## 📋 Final Verification Checklist

Go through this checklist to confirm everything is working:

- [ ] Backend server runs on http://localhost:3001
- [ ] Health check returns `status: "ok"`
- [ ] Antigravity test endpoint responds
- [ ] Gemini models endpoint lists available models
- [ ] Gemini generate endpoint creates text (with API key)
- [ ] Antigravity analyze-session returns structured data (with API key)
- [ ] No errors in console logs
- [ ] CORS is configured correctly

## 🔧 Troubleshooting

### Issue: "GEMINI_API_KEY is not set"
**Solution**: Make sure you've added your API key to the `.env` file

### Issue: CORS errors
**Solution**: Check that `ALLOWED_ORIGINS` in `.env` includes your frontend URL

### Issue: Port 3001 already in use
**Solution**: Change the `PORT` value in `.env` to another port (e.g., 3002)

### Issue: Module not found errors
**Solution**: Run `npm install` again in the backend directory

## 🎉 Next Steps

Once all tests pass, you're ready for Phase 2:
- Frontend development
- Real-time features
- Database integration
- User authentication

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify your `.env` file is configured correctly
3. Ensure all dependencies are installed
4. Make sure the server is running before testing

---

**Congratulations!** Your CommCoach backend is up and running! 🚀
