# CommCoach AI Platform

Communication coaching platform powered by Google Gemini AI.

## 📁 Project Structure

```
commcoach/
├── backend/              # Backend API (Phase 1 ✅)
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── .env            # ⚠️ CONFIGURE THIS with your API key
│   ├── server.js       # Main server
│   └── README.md       # Backend documentation
├── old_files_backup/    # Previous test files (can be deleted)
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Configure the Backend

```bash
cd backend
```

Edit `backend/.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key: https://aistudio.google.com/app/apikey

### 2. Start the Server

```bash
npm run dev
```

### 3. Test the API

```bash
# PowerShell
.\test-api.ps1

# Or manually
curl http://localhost:3001/health
```

## 📚 Documentation

- **Backend**: See `backend/README.md`
- **Setup Guide**: See `backend/SETUP.md`
- **Quick Start**: See `backend/QUICKSTART.md`

## 🎯 Current Status

- ✅ **Phase 1**: Backend API (Complete, needs API key)
- ⏳ **Phase 2**: Frontend (Coming next)
- ⏳ **Phase 3**: Database integration
- ⏳ **Phase 4**: Real-time features

## 🔧 Important

**ALL backend work is in the `backend/` folder.**

The `.env` file you need to edit is: `backend/.env` (NOT the root directory)
