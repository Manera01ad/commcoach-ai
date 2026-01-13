# CommCoach Backend API

Backend API server for CommCoach AI communication coaching platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 📋 API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Antigravity Analysis
- **GET** `/api/antigravity/test` - Test endpoint
- **POST** `/api/antigravity/analyze-session` - Analyze communication transcript

### Gemini Proxy
- **GET** `/api/gemini/models` - List available models
- **POST** `/api/gemini/generate` - Generate text content
- **POST** `/api/gemini/structured` - Generate structured JSON

## 🧪 Testing

### Test Health Check
```bash
curl http://localhost:3001/health
```

### Test Antigravity Analysis
```bash
curl -X POST http://localhost:3001/api/antigravity/analyze-session \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_1",
    "timestamp": "2025-01-12T00:00:00Z",
    "transcript": "USER: I struggle with public speaking. I get nervous.\nCOACH: Tell me more about when this happens.\nUSER: Mainly in meetings with executives."
  }'
```

### Test Gemini Models
```bash
curl http://localhost:3001/api/gemini/models
```

## 📁 Project Structure

```
backend/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── routes/          # API route handlers
│   ├── antigravity.js
│   └── gemini.js
├── services/        # Business logic
│   └── geminiService.js
├── .env            # Environment variables (not in git)
├── .env.example    # Environment template
├── .gitignore      # Git ignore rules
├── package.json    # Dependencies
└── server.js       # Main entry point
```

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `GEMINI_API_KEY` | Google Gemini API key | *Required* |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000,http://localhost:5173` |

## 🛠️ Development

- `npm run dev` - Start with hot reload (nodemon)
- `npm start` - Start production server

## 📝 Notes

- CORS is configured to allow requests from localhost:3000 and localhost:5173
- API key is kept server-side for security
- All routes support JSON request/response
- Error handling includes development mode stack traces
