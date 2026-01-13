# CommCoach AI - Communication Skills Training Platform

AI-powered communication coach using Gemini API and real-time voice analysis.

## 🏗️ Architecture
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│ Gemini API  │
│   (React)   │      │  (Express)  │      │   (Google)  │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Local Development

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/commcoach-ai.git
cd commcoach-ai
```

#### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

#### 3. Setup Frontend (in new terminal)
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local and set VITE_API_URL=http://localhost:3001/api
npm run dev
```

#### 4. Open Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/health

## 📦 Deployment

### Backend Deployment (Railway)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)

1. Click the button above or manually:
```bash
   railway login
   railway init
   railway up
```

2. Set environment variables in Railway dashboard:
   - `GEMINI_API_KEY`
   - `ALLOWED_ORIGINS`

3. Get your backend URL: `https://your-app.railway.app`

### Frontend Deployment (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/yourusername/commcoach-ai)

1. Click the button above or manually:
```bash
   cd frontend
   vercel
```

2. Set environment variable:
   - `VITE_API_URL` = your Railway backend URL

## 🎯 Features

- ✅ Real-time AI coaching
- ✅ Voice practice with live transcription
- ✅ Session analysis (Antigravity)
- ✅ YouTube mentor library
- ✅ Meeting intelligence agent
- ✅ Avatar personality cloning

## 🛠️ Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

**Backend:**
- Node.js + Express
- Google Gemini API
- CORS enabled

## 📝 API Endpoints

### Health Check
```bash
GET /health
```

### Gemini Generation
```bash
POST /api/gemini/generate
Body: { model, prompt, config }
```

### Antigravity Analysis
```bash
POST /api/antigravity/analyze-session
Body: { transcript, userId, timestamp }
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🆘 Support

- 📧 Email: support@commcoach.ai
- 💬 Discord: [Join our server](https://discord.gg/commcoach)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/commcoach-ai/issues)

## 🙏 Acknowledgments

- [Aleena Rais](https://www.youtube.com/@AleenaRaisLive) - Communication methodology
- [Google Gemini](https://ai.google.dev/) - AI models
- [Anthropic Claude](https://claude.ai/) - Development assistance
