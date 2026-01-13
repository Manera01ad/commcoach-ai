# ⚡ Quick Start - CommCoach Backend

## 🎯 Before You Start

**CRITICAL**: Add your Gemini API key to the `.env` file!

1. Open `backend/.env`
2. Replace `your_gemini_api_key_here` with your actual key
3. Get your key here: https://aistudio.google.com/app/apikey

## 🚀 Start Server

```bash
cd backend
npm run dev
```

## ✅ Quick Test

Once the server is running, open a new terminal and run:

```bash
# Test health check (no API key needed)
curl http://localhost:3001/health

# Test full analysis (requires API key)
curl -X POST http://localhost:3001/api/antigravity/analyze-session \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_1",
    "timestamp": "2025-01-12T00:00:00Z",
    "transcript": "USER: I struggle with public speaking. I get nervous.\nCOACH: Tell me more.\nUSER: Mainly in meetings with executives."
  }'
```

## 📚 Full Documentation

- `README.md` - API documentation
- `SETUP.md` - Complete setup guide
- `test-api.ps1` - PowerShell test script
- `test-api.sh` - Bash test script

## 🔑 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server status |
| `/api` | GET | API overview |
| `/api/antigravity/test` | GET | Test endpoint |
| `/api/antigravity/analyze-session` | POST | Analyze transcript |
| `/api/gemini/models` | GET | List models |
| `/api/gemini/generate` | POST | Generate text |
| `/api/gemini/structured` | POST | Generate JSON |

## 🎉 You're All Set!

Once the server starts without errors and health check passes, Phase 1 is complete!
