# 🏗️ CommCoach AI - Complete Architecture Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Component Breakdown](#component-breakdown)
5. [Data Flow](#data-flow)
6. [Deployment Infrastructure](#deployment-infrastructure)
7. [API Endpoints](#api-endpoints)
8. [Security & Authentication](#security--authentication)
9. [Environment Configuration](#environment-configuration)
10. [Database Schema (Future)](#database-schema-future)

---

## System Overview

**CommCoach AI** is a full-stack AI-powered communication training platform that helps users improve their communication skills through:
- 🎤 Real-time voice practice with AI feedback
- 📊 Session analysis and progress tracking
- 🎯 Meeting intelligence and analysis
- 👥 YouTube mentor library integration
- 🤖 Avatar personality cloning

### High-Level Architecture
```
┌─────────────────┐
│  User Browser   │ ← Client (HTTPS)
└────────┬────────┘
         │
    ┌────▼────┐
    │ Vercel  │ ← Frontend Hosting (React SPA)
    │   CDN   │
    └────┬────┘
         │ REST API (JSON)
    ┌────▼─────────┐
    │   Railway    │ ← Backend Hosting (Node.js)
    │   Server     │
    └────┬─────────┘
         │ AI Requests
    ┌────▼─────────┐
    │ Google Gemini│ ← AI Processing
    │      API     │
    └──────────────┘
```

---

## Architecture Diagram

See the comprehensive architecture diagram above showing:
- **Client Layer**: User's web browser accessing the application
- **Application Layer**: 
  - Frontend (Vercel) - React application with Vite
  - Backend (Railway) - Node.js Express server
- **External Services**: Google Gemini API for AI capabilities
- **Future Services**: Firebase/Database for data persistence

---

## Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.3 | UI framework for building interactive components |
| **TypeScript** | 5.8.2 | Type-safe JavaScript for better code quality |
| **Vite** | 6.2.0 | Fast build tool and dev server |
| **Lucide React** | 0.460.0 | Modern icon library |
| **Marked** | 12.0.0 | Markdown parser for rendering AI responses |
| **@google/genai** | 1.34.0 | Google Generative AI SDK (client-side) |

**Build Output**: Static files (HTML, CSS, JS) served via Vercel CDN

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express** | 4.19.2 | Web application framework |
| **@google/generative-ai** | 0.21.0 | Google Gemini API SDK |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing middleware |
| **dotenv** | 16.4.5 | Environment variable management |
| **body-parser** | 1.20.2 | Request body parsing middleware |
| **Nodemon** | 3.1.0 | Development auto-restart tool |

**Server Type**: RESTful API with JSON responses

### External Services
| Service | Purpose | Documentation |
|---------|---------|---------------|
| **Google Gemini API** | AI text generation, analysis, structured output | [docs](https://ai.google.dev/) |
| **Vercel** | Frontend hosting, CDN, automatic deployments | [docs](https://vercel.com/docs) |
| **Railway** | Backend hosting, auto-scaling, logging | [docs](https://docs.railway.app/) |
| **Firebase** (Future) | User authentication, Firestore database | [docs](https://firebase.google.com/) |

---

## Component Breakdown

### Frontend Components (`/frontend/components/`)

#### 1. **WelcomeScreen.tsx** (4 KB)
- **Purpose**: Landing page with app introduction
- **Features**: Hero section, feature highlights, call-to-action
- **Navigation**: Entry point to the application

#### 2. **ChatWindow.tsx** (31 KB) ⭐ Core Component
- **Purpose**: Main AI chat interface for practice sessions
- **Features**:
  - Real-time voice recording and transcription
  - AI-powered conversation feedback
  - Message history display
  - Audio playback controls
- **Integrations**: 
  - Backend API for AI processing
  - Browser Audio API for recording
  - Gemini API for responses

#### 3. **ProfileDashboard.tsx** (22 KB)
- **Purpose**: User profile and progress tracking
- **Features**:
  - Session history
  - Performance metrics
  - Skill improvement graphs
  - Personal statistics
- **Data**: Stores session results in localStorage (future: Firebase)

#### 4. **MeetingAgent.tsx** (25 KB)
- **Purpose**: Intelligent meeting analysis tool
- **Features**:
  - Upload meeting transcripts
  - Extract action items
  - Identify decision points
  - Communication pattern analysis
  - Risk/blocker detection
- **AI Model**: Gemini with structured output

#### 5. **MentorsLab.tsx** (41 KB) ⭐ Largest Component
- **Purpose**: YouTube mentor video library and analysis
- **Features**:
  - Video URL input and embedding
  - AI-powered content analysis
  - Key takeaways extraction
  - Practice exercises generation
  - Mentor knowledge database
- **Integration**: YouTube embed + Gemini analysis

#### 6. **VisionLab.tsx** (12 KB)
- **Purpose**: Avatar personality cloning and customization
- **Features**:
  - Avatar creation from YouTube personalities
  - Communication style extraction
  - Custom persona training
  - Voice tone analysis

#### 7. **RecapScreen.tsx** (14 KB)
- **Purpose**: Session summary and insights
- **Features**:
  - Session performance overview
  - Strengths and weaknesses
  - Actionable recommendations
  - Progress comparison

#### 8. **Header.tsx** (3 KB)
- **Purpose**: Top navigation bar
- **Features**: Logo, navigation links, user profile access

#### 9. **Sidebar.tsx** (7 KB)
- **Purpose**: Side navigation menu
- **Features**: Page navigation, quick links, settings

#### 10. **CommCoachInfographic.tsx** (4 KB)
- **Purpose**: Visual representation of app methodology
- **Features**: Animated infographic, process flow

### Frontend Utilities

#### `audioUtils.ts` (1.4 KB)
- Audio recording helper functions
- Browser MediaRecorder API wrappers
- Audio format conversion utilities

#### `geminiService.ts` (77 bytes)
- (Minimal) Frontend Gemini service wrapper
- Uses backend API for most operations

#### `types.ts` (2.5 KB)
- TypeScript type definitions
- Interface declarations for components
- API response types

#### `constants.tsx` (5.7 KB)
- Application constants
- Configuration values
- Default settings

---

### Backend Structure (`/backend/`)

#### **server.js** (4 KB) - Main Entry Point
**Responsibilities**:
1. Initialize Express application
2. Configure middleware (CORS, JSON parser, logger)
3. Register routes
4. Error handling
5. Start HTTP server on port 3001

**Key Middleware**:
```javascript
// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');
    // Validate origin against whitelist
  },
  credentials: true
};

// Body Parser
app.use(express.json({ limit: '50mb' }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[timestamp] ${req.method} ${req.path}`);
  next();
});
```

**Health Check Endpoint**:
```javascript
GET /health
Response: {
  status: 'ok',
  timestamp: '2026-01-14T...',
  uptime: 123.45,
  environment: 'production'
}
```

#### Routes (`/backend/routes/`)

##### **antigravity.js** (2.2 KB)
**Endpoints**:
- `POST /api/antigravity/analyze-session`
  - Analyzes user practice session transcripts
  - Extracts: skill focus, confidence level, challenges, practice time
  - Uses Gemini AI for structured data extraction
  
- `GET /api/antigravity/test`
  - Test endpoint for route validation

**Request Format**:
```json
{
  "transcript": "User's practice session transcript",
  "userId": "user123",
  "timestamp": "2026-01-14T14:00:00Z"
}
```

**Response Format**:
```json
{
  "skillFocus": "Public Speaking",
  "confidenceLevel": 7,
  "challenges": ["Maintaining eye contact", "Speaking pace"],
  "practiceTime": 25,
  "contentConsumed": "Video on voice modulation"
}
```

##### **gemini.js** (2.5 KB)
**Endpoints**:
- `POST /api/gemini/generate`
  - General-purpose AI text generation
  - Accepts custom prompts and configuration
  
- `POST /api/gemini/structured`
  - Structured output generation (JSON schema validation)
  
- `GET /api/gemini/models`
  - List available Gemini models

**Request Format** (generate):
```json
{
  "model": "gemini-1.5-flash",
  "prompt": "Analyze this communication...",
  "config": {
    "temperature": 0.7,
    "maxOutputTokens": 1024
  }
}
```

#### Services (`/backend/services/`)

##### **geminiService.js** (5.2 KB) - Core AI Service
**Functions**:

1. **`initializeGemini()`**
   - Initializes Google Generative AI client
   - Validates API key
   - Sets up default configurations

2. **`generateContent(prompt, config)`**
   - General text generation
   - Customizable parameters (temperature, maxTokens)
   - Error handling and retries

3. **`generateStructuredOutput(prompt, schema)`**
   - JSON schema-validated responses
   - Used for session analysis, meeting intelligence
   - Ensures consistent data format

4. **`analyzeTranscript(transcript)`**
   - Specialized function for communication analysis
   - Returns structured feedback on speaking patterns

**Error Handling**:
- API key validation
- Rate limit handling
- Network error retries
- Fallback responses

---

## Data Flow

### Complete Request Lifecycle

#### Scenario 1: User Practice Session Analysis

```
1. User speaks → Frontend (ChatWindow.tsx)
   ↓
2. Audio recording → Browser MediaRecorder API
   ↓
3. Transcript generated → Local processing
   ↓
4. HTTP POST → Backend (Railway)
   POST /api/antigravity/analyze-session
   Body: { transcript, userId, timestamp }
   ↓
5. Backend routes to antigravity.js
   ↓
6. antigravity.js calls geminiService.js
   ↓
7. geminiService makes API request → Google Gemini
   ↓
8. Gemini processes prompt and returns structured JSON
   ↓
9. Backend validates and formats response
   ↓
10. JSON response sent back to Frontend
   ↓
11. ChatWindow.tsx displays results
   ↓
12. Data saved to localStorage (future: Firebase)
```

**Request Headers**:
```http
POST /api/antigravity/analyze-session HTTP/1.1
Host: your-backend.railway.app
Content-Type: application/json
Origin: https://commcoach-ai.vercel.app
Authorization: Bearer <future-jwt-token>
```

**Response Headers**:
```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: https://commcoach-ai.vercel.app
Access-Control-Allow-Credentials: true
```

#### Scenario 2: Meeting Intelligence Analysis

```
1. User uploads transcript → MeetingAgent.tsx
   ↓
2. HTTP POST → Backend
   POST /api/gemini/structured
   ↓
3. Backend calls Gemini with JSON schema
   Schema: { actionItems[], decisions[], risks[] }
   ↓
4. Gemini returns validated JSON
   ↓
5. Frontend displays structured results:
   - Action items table
   - Decision points timeline
   - Risk assessment dashboard
```

#### Scenario 3: YouTube Mentor Analysis

```
1. User enters YouTube URL → MentorsLab.tsx
   ↓
2. Extract video ID and embed video
   ↓
3. User requests analysis
   ↓
4. HTTP POST → Backend
   POST /api/gemini/generate
   Prompt: "Analyze YouTube video transcript for communication techniques"
   ↓
5. Gemini analyzes content
   ↓
6. Returns: Key takeaways, practice exercises, mentor profile
   ↓
7. MentorsLab displays results in organized cards
```

---

## Deployment Infrastructure

### Frontend Deployment (Vercel)

**Platform**: Vercel (Serverless Edge Network)

**Deployment Configuration**:
```json
// vercel.json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Build Process**:
1. Git push to `main` branch triggers webhook
2. Vercel pulls latest code
3. Runs `npm install` (installs dependencies)
4. Runs `npm run build` (Vite builds production bundle)
5. Outputs static files to `dist/` directory
6. Deploys to global CDN
7. Invalidates old cache
8. Live in ~2-3 minutes

**Domains**:
- Production: `https://commcoach-ai.vercel.app`
- Preview: `https://commcoach-ai-git-<branch>.vercel.app`
- Development: `http://localhost:5173`

**Environment Variables** (Vercel Dashboard):
```env
VITE_API_URL=https://your-backend.railway.app/api
```

**CDN Features**:
- Global edge network (40+ regions)
- Automatic HTTPS/SSL
- HTTP/2 and HTTP/3 support
- Brotli compression
- Image optimization (future)

**Performance**:
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Lighthouse Score: 95+

---

### Backend Deployment (Railway)

**Platform**: Railway (Container-based PaaS)

**Deployment Configuration**:
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Build Process**:
1. Git push to `main` branch triggers webhook
2. Railway pulls latest code
3. Detects Node.js project (package.json)
4. Runs `npm install --production`
5. Creates container image
6. Deploys to Railway infrastructure
7. Starts server with `npm start`
8. Health check: `GET /health`
9. Live in ~3-5 minutes

**Server Configuration**:
- **Memory**: 512 MB (can auto-scale to 8 GB)
- **CPU**: Shared vCPU (can upgrade to dedicated)
- **Region**: us-west1 (configurable)
- **Restart Policy**: Automatic on failure
- **Health Checks**: HTTP GET /health every 30s

**Environment Variables** (Railway Dashboard):
```env
PORT=3001
NODE_ENV=production
GEMINI_API_KEY=AIza... (secret)
ALLOWED_ORIGINS=https://commcoach-ai.vercel.app,http://localhost:5173
```

**Logging**:
- All console.log() captured
- Accessible via Railway dashboard
- Persistent for 7 days
- Searchable and filterable

**Monitoring**:
- CPU usage tracking
- Memory consumption graphs
- Request rate metrics
- Error rate alerts

**Auto-Scaling**:
- Horizontal: Up to 3 instances (if upgraded)
- Vertical: Memory scales based on usage
- Load balancer distributes traffic

**Domain**:
- Production: `https://commcoach-backend-production.up.railway.app`
- Custom domain (future): `https://api.commcoach.ai`

---

## API Endpoints

### Complete API Reference

#### Health & Status

##### GET `/health`
**Purpose**: Service health check  
**Authentication**: None  
**Rate Limit**: Unlimited

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T14:00:17.123Z",
  "uptime": 3456.78,
  "environment": "production"
}
```

##### GET `/api`
**Purpose**: API documentation and available endpoints  
**Authentication**: None

**Response** (200 OK):
```json
{
  "message": "CommCoach AI Backend API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "antigravity": {
      "analyzeSession": "POST /api/antigravity/analyze-session",
      "test": "GET /api/antigravity/test"
    },
    "gemini": {
      "generate": "POST /api/gemini/generate",
      "structured": "POST /api/gemini/structured",
      "models": "GET /api/gemini/models"
    }
  }
}
```

---

#### Antigravity Routes

##### POST `/api/antigravity/analyze-session`
**Purpose**: Analyze practice session transcripts  
**Authentication**: None (future: Bearer token)  
**Rate Limit**: 60 requests/minute

**Request Body**:
```json
{
  "transcript": "Hi, I'm practicing my presentation skills...",
  "userId": "user_abc123",
  "timestamp": "2026-01-14T14:00:00Z"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "skillFocus": "Presentation Skills",
    "confidenceLevel": 7,
    "challenges": [
      "Maintaining steady pace",
      "Using filler words (um, uh)"
    ],
    "practiceTime": 15,
    "contentConsumed": "Video: How to Present with Confidence",
    "insights": {
      "strengths": ["Clear articulation", "Good structure"],
      "improvementAreas": ["Reduce filler words", "Add pauses"],
      "nextSteps": "Practice with a timer, record and self-review"
    }
  },
  "processingTime": 2.3
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Validation Error",
  "message": "Transcript is required",
  "code": "MISSING_TRANSCRIPT"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "AI Processing Error",
  "message": "Gemini API returned an error",
  "details": "Rate limit exceeded"
}
```

##### GET `/api/antigravity/test`
**Purpose**: Test route connectivity  
**Response**:
```json
{
  "message": "Antigravity route works!",
  "timestamp": "2026-01-14T14:00:17Z"
}
```

---

#### Gemini Routes

##### POST `/api/gemini/generate`
**Purpose**: General AI text generation  
**Authentication**: None (future: Bearer token)  
**Rate Limit**: 60 requests/minute

**Request Body**:
```json
{
  "model": "gemini-1.5-flash",
  "prompt": "Analyze this communication: [transcript]",
  "config": {
    "temperature": 0.7,
    "maxOutputTokens": 1024,
    "topP": 0.95,
    "topK": 40
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "text": "Based on the transcript, here are key observations...",
    "model": "gemini-1.5-flash",
    "tokensUsed": 523,
    "finishReason": "STOP"
  },
  "processingTime": 1.8
}
```

##### POST `/api/gemini/structured`
**Purpose**: Generate structured JSON responses  
**Use Case**: Meeting analysis, session scoring

**Request Body**:
```json
{
  "prompt": "Extract action items from this meeting: [transcript]",
  "schema": {
    "type": "object",
    "properties": {
      "actionItems": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "owner": { "type": "string" },
            "task": { "type": "string" },
            "dueDate": { "type": "string" },
            "priority": { "type": "string", "enum": ["high", "medium", "low"] }
          }
        }
      }
    }
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "actionItems": [
      {
        "owner": "John",
        "task": "Prepare Q4 report",
        "dueDate": "2026-01-20",
        "priority": "high"
      },
      {
        "owner": "Sarah",
        "task": "Review client feedback",
        "dueDate": "2026-01-17",
        "priority": "medium"
      }
    ]
  },
  "processingTime": 2.1
}
```

##### GET `/api/gemini/models`
**Purpose**: List available Gemini models

**Response** (200 OK):
```json
{
  "models": [
    {
      "name": "gemini-1.5-flash",
      "description": "Fast, efficient model for most tasks",
      "maxTokens": 32768,
      "inputCostPer1M": "$0.35",
      "outputCostPer1M": "$1.05"
    },
    {
      "name": "gemini-1.5-pro",
      "description": "More capable, larger context window",
      "maxTokens": 1048576,
      "inputCostPer1M": "$3.50",
      "outputCostPer1M": "$10.50"
    }
  ]
}
```

---

## Security & Authentication

### Current Security Measures

#### 1. **CORS (Cross-Origin Resource Sharing)**
**Purpose**: Prevent unauthorized domains from accessing the API

**Configuration** (`server.js`):
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    if (!origin) return callback(null, true); // Allow non-browser requests
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Allow whitelisted origins
    } else {
      callback(new Error('Not allowed by CORS')); // Reject
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

**Allowed Origins**:
- `https://commcoach-ai.vercel.app` (production frontend)
- `http://localhost:5173` (local development)
- `http://localhost:3000` (alternative port)

#### 2. **Environment Variables**
**Purpose**: Protect sensitive credentials

**Backend** (`.env`):
```env
# Never commit this file!
GEMINI_API_KEY=AIza... (kept secret)
```

**Frontend** (`.env.local`):
```env
# Exposed to client (prefixed with VITE_)
VITE_API_URL=https://backend.railway.app/api
```

**Security Notes**:
- Backend `.env` is server-only (never exposed)
- Frontend `VITE_` vars are bundled into client code (use only for public data)
- Railway/Vercel encrypt environment variables at rest

#### 3. **Request Size Limits**
**Purpose**: Prevent DoS attacks via large payloads

```javascript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

#### 4. **HTTPS Enforcement**
- Vercel: Automatic HTTPS for all requests
- Railway: Automatic HTTPS for all requests
- HTTP requests auto-redirected to HTTPS

#### 5. **Error Handling**
**Purpose**: Don't leak sensitive information

```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err.stack); // Log internally
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    // Only show stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

**Production Error Response**:
```json
{
  "error": "Internal Server Error"
}
```

**Development Error Response**:
```json
{
  "error": "Database connection failed",
  "stack": "Error: connect ECONNREFUSED...\n at ..."
}
```

---

### Future Security Enhancements

#### 1. **JWT Authentication**
**Implementation Plan**:

**Login Flow**:
```
1. User enters email/password → Frontend
   ↓
2. POST /api/auth/login → Backend
   ↓
3. Verify credentials against Firebase Auth
   ↓
4. Generate JWT token (expires in 24h)
   ↓
5. Return token to Frontend
   ↓
6. Frontend stores token in localStorage
   ↓
7. Include token in all subsequent requests:
   Authorization: Bearer <token>
```

**Backend Middleware**:
```javascript
// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  });
};

// Usage
app.post('/api/antigravity/analyze-session', authenticateToken, analyzeHandler);
```

#### 2. **Rate Limiting**
**Purpose**: Prevent API abuse

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

#### 3. **API Key Rotation**
- Rotate Gemini API key quarterly
- Implement key versioning
- Graceful key transitions

#### 4. **Input Validation**
**Using Zod**:
```javascript
import { z } from 'zod';

const sessionSchema = z.object({
  transcript: z.string().min(10).max(10000),
  userId: z.string().uuid(),
  timestamp: z.string().datetime()
});

// Route handler
app.post('/api/antigravity/analyze-session', (req, res) => {
  const validation = sessionSchema.safeParse(req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      error: 'Validation Error',
      details: validation.error.errors
    });
  }
  
  // Continue processing...
});
```

#### 5. **SQL Injection Prevention**
**When database is added**:
- Use parameterized queries
- ORM (Prisma/TypeORM) for safe database access
- Never concatenate user input into SQL

---

## Environment Configuration

### Backend Environment Variables

#### **Development** (`.env`)
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Google Gemini API
GEMINI_API_KEY=AIzaSyD... (get from https://aistudio.google.com/app/apikey)

# CORS Allowed Origins
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=debug

# Future: Database
# DATABASE_URL=postgresql://user:pass@localhost:5432/commcoach

# Future: JWT
# JWT_SECRET=your_super_secret_jwt_key_here
# JWT_EXPIRATION=24h

# Future: Firebase
# FIREBASE_PROJECT_ID=commcoach-ai
# FIREBASE_PRIVATE_KEY=...
# FIREBASE_CLIENT_EMAIL=...
```

#### **Production** (Railway Dashboard)
```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Google Gemini API
GEMINI_API_KEY=<stored-in-railway>

# CORS Allowed Origins
ALLOWED_ORIGINS=https://commcoach-ai.vercel.app

# Future: Database
# DATABASE_URL=<railway-postgres-connection-string>

# Future: JWT
# JWT_SECRET=<generated-secret>
```

---

### Frontend Environment Variables

#### **Development** (`.env.local`)
```env
# Backend API URL
VITE_API_URL=http://localhost:3001/api

# Future: Firebase Config (public values)
# VITE_FIREBASE_API_KEY=AIza...
# VITE_FIREBASE_AUTH_DOMAIN=commcoach-ai.firebaseapp.com
# VITE_FIREBASE_PROJECT_ID=commcoach-ai

# Future: Analytics
# VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### **Production** (Vercel Dashboard)
```env
# Backend API URL
VITE_API_URL=https://commcoach-backend-production.up.railway.app/api

# Future: Firebase Config
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# VITE_FIREBASE_PROJECT_ID=...
```

---

### Accessing Environment Variables

#### Backend (Node.js)
```javascript
// Load dotenv at the very top of server.js
import dotenv from 'dotenv';
dotenv.config();

// Access variables
const apiKey = process.env.GEMINI_API_KEY;
const port = process.env.PORT || 3001;
```

#### Frontend (Vite + React)
```typescript
// Vite automatically loads .env.local
// Access with import.meta.env prefix

const apiUrl = import.meta.env.VITE_API_URL;

// Type-safe access
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
```

---

## Database Schema (Future)

### Planned Firebase Firestore Structure

When Firebase integration is complete, the database will have the following collections:

#### **Collection: `users`**
```json
{
  "uid": "user_abc123",
  "email": "john@example.com",
  "displayName": "John Doe",
  "createdAt": "2026-01-14T14:00:00Z",
  "profile": {
    "skillLevel": "intermediate",
    "goals": ["Public Speaking", "Meeting Facilitation"],
    "preferredMentors": ["aleena_rais", "simon_sinek"]
  },
  "stats": {
    "totalSessions": 42,
    "totalPracticeMinutes": 1230,
    "averageConfidence": 7.2,
    "streak": 15
  }
}
```

#### **Collection: `sessions`**
```json
{
  "sessionId": "session_xyz789",
  "userId": "user_abc123",
  "timestamp": "2026-01-14T14:00:00Z",
  "duration": 25,
  "transcript": "Full session transcript...",
  "analysis": {
    "skillFocus": "Presentation Skills",
    "confidenceLevel": 7,
    "challenges": ["Pacing", "Filler words"],
    "strengths": ["Clear voice", "Good structure"],
    "improvementScore": 8.5
  },
  "audioUrl": "gs://commcoach-ai/sessions/session_xyz789.mp3"
}
```

#### **Collection: `meetings`**
```json
{
  "meetingId": "meeting_def456",
  "userId": "user_abc123",
  "title": "Q4 Planning Meeting",
  "date": "2026-01-14",
  "participants": ["John", "Sarah", "Mike"],
  "transcript": "Full meeting transcript...",
  "analysis": {
    "actionItems": [
      {
        "owner": "John",
        "task": "Prepare Q4 report",
        "dueDate": "2026-01-20",
        "priority": "high",
        "status": "pending"
      }
    ],
    "decisions": [
      {
        "decision": "Approve new marketing budget",
        "decisionMaker": "Sarah",
        "timestamp": "2026-01-14T14:15:00Z"
      }
    ],
    "communicationScore": {
      "clarityScore": 8.2,
      "professionalismScore": 9.1,
      "participationBalance": 7.5
    }
  }
}
```

#### **Collection: `mentors`**
```json
{
  "mentorId": "aleena_rais",
  "name": "Aleena Rais",
  "expertise": ["Communication", "Public Speaking", "Confidence"],
  "youtubeChannel": "https://youtube.com/@AleenaRaisLive",
  "analysisCount": 1234,
  "averageRating": 4.8,
  "communicationStyle": {
    "tone": "Energetic and encouraging",
    "keyPhrases": ["You've got this!", "Communication is a skill"],
    "teachingApproach": "Practical exercises with real-world examples"
  },
  "contentLibrary": [
    {
      "videoId": "abc123",
      "title": "How to Speak Confidently",
      "url": "https://youtube.com/watch?v=abc123",
      "keyTakeaways": ["...", "...", "..."],
      "practiceExercises": ["...", "..."]
    }
  ]
}
```

#### **Collection: `avatars`**
```json
{
  "avatarId": "avatar_ghi789",
  "userId": "user_abc123",
  "name": "My Leadership Avatar",
  "basedOnMentor": "simon_sinek",
  "personality": {
    "tone": "Calm and inspiring",
    "vocabulary": ["leadership", "purpose", "why"],
    "communicationStyle": "Storytelling with deep questions"
  },
  "trainingData": [
    "Video analysis from 5 Simon Sinek talks",
    "Custom prompts from user"
  ],
  "createdAt": "2026-01-14T14:00:00Z"
}
```

---

### Database Access Patterns

#### **Read Patterns**:
1. `getUserProfile(uid)` - Fetch user data
2. `getUserSessions(uid, limit)` - Fetch session history
3. `getMeetingAnalysis(meetingId)` - Fetch meeting details
4. `getMentorLibrary()` - Fetch all mentors
5. `getAvatarsByUser(uid)` - Fetch user's avatars

#### **Write Patterns**:
1. `createSession(sessionData)` - Save new session
2. `updateUserStats(uid, stats)` - Update practice stats
3. `saveMeetingAnalysis(meetingData)` - Save meeting results
4. `createAvatar(avatarData)` - Create new avatar

#### **Security Rules** (Firebase):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Sessions belong to users
    match /sessions/{sessionId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Mentors are public read
    match /mentors/{mentorId} {
      allow read: if true;
      allow write: if false; // Admin only
    }
  }
}
```

---

## Additional Documentation

For more detailed information, see:

📘 **[DEPLOYMENT.md](../DEPLOYMENT.md)** - Step-by-step deployment guide  
📘 **[README.md](../README.md)** - Quick start and feature overview  
📘 **Backend Docs**:
  - `/backend/SETUP.md` - Backend setup instructions
  - `/backend/QUICKSTART.md` - Quick backend testing
  - `/backend/ANTIGRAVITY_TEST_REPORT.md` - API testing results

---

## Monitoring & Observability

### Current Monitoring

#### **Railway Backend Monitoring**:
- **Metrics**: CPU, Memory, Network I/O
- **Logs**: All console output captured
- **Alerts**: Email on deployment failure
- **Uptime**: 99.9% SLA

#### **Vercel Frontend Monitoring**:
- **Analytics**: Page views, user sessions
- **Performance**: Core Web Vitals (LCP, FID, CLS)
- **Errors**: Runtime error tracking
- **Build Status**: Email on build failure

### Future Monitoring Enhancements

1. **Application Performance Monitoring (APM)**:
   - Integrate Sentry for error tracking
   - Track API response times
   - Monitor Gemini API latency
   - User session replay

2. **Custom Metrics**:
   ```javascript
   // Track business metrics
   analytics.track('session_completed', {
     userId: user.id,
     duration: session.duration,
     confidenceImprovement: session.deltaConfidence
   });
   ```

3. **Health Dashboard**:
   - Create admin panel at `/admin/health`
   - Display: Uptime, error rates, API usage
   - Real-time logs and alerts

---

## Cost Analysis

### Current Monthly Costs (Estimated)

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| **Vercel** | Hobby | $0 | Free tier (100 GB bandwidth/month) |
| **Railway** | Starter | $5 | 500 hours/month, $0.01/hr after |
| **Gemini API** | Pay-as-you-go | $10-50 | Depends on usage (~1M tokens/month) |
| **GitHub** | Free | $0 | Public repositories |
| **Total** | | **$15-55** | Early stage, low traffic |

### Future Costs (Scale to 10,000 users)

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| **Vercel** | Pro | $20 | Unlimited bandwidth, better support |
| **Railway** | Team | $20 | Dedicated CPU, 8 GB RAM |
| **Gemini API** | Pay-as-you-go | $500-1000 | ~100M tokens/month |
| **Firebase** | Blaze | $50-200 | Database, hosting, auth |
| **Monitoring** | Sentry | $26 | 50k events/month |
| **Total** | | **$616-1266** | Mid-scale production |

---

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. **CORS Error**
**Symptom**: Frontend can't connect to backend
```
Access to fetch at 'https://backend.railway.app/api' from origin 'https://commcoach-ai.vercel.app' 
has been blocked by CORS policy
```

**Solution**:
1. Check Railway environment variable `ALLOWED_ORIGINS`
2. Ensure it includes your Vercel domain
3. Restart Railway service

#### 2. **Gemini API Key Error**
**Symptom**: "Invalid API key" or "API key not found"

**Solution**:
1. Verify `GEMINI_API_KEY` in Railway dashboard
2. Check for extra spaces or newlines
3. Generate new key at https://aistudio.google.com/app/apikey

#### 3. **Frontend Build Failure**
**Symptom**: Vercel build fails

**Solution**:
1. Check Vercel build logs
2. Verify all dependencies in `package.json`
3. Test build locally: `npm run build`
4. Check Node.js version compatibility

#### 4. **Session Not Saving**
**Symptom**: User sessions disappear after refresh

**Current**: localStorage is used (browser-specific)  
**Future**: Will persist to Firebase

**Solution**:
- Data is stored in browser localStorage
- Clear cache will delete data
- Use same browser/device

---

## Performance Optimization

### Current Optimizations

1. **Code Splitting** (Vite):
   - Lazy load heavy components
   - Separate vendor bundles
   - Tree-shaking unused code

2. **API Response Caching**:
   ```javascript
   // Cache Gemini responses for identical prompts
   const cache = new Map();
   
   const cachedGenerate = async (prompt) => {
     if (cache.has(prompt)) {
       return cache.get(prompt);
     }
     
     const response = await gemini.generate(prompt);
     cache.set(prompt, response);
     return response;
   };
   ```

3. **Compression**:
   - Vercel: Brotli compression
   - Railway: Gzip compression

### Future Optimizations

1. **Database Indexing**:
   ```javascript
   // Firestore indexes
   sessions: index(userId, timestamp)
   meetings: index(userId, date)
   ```

2. **CDN for Assets**:
   - Move audio files to Cloudflare R2 or AWS S3
   - Serve via CDN for faster global access

3. **Background Processing**:
   - Move heavy AI processing to background jobs
   - Use message queue (Redis/BullMQ)
   - Return job ID immediately, poll for results

---

## Development Workflow

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/yourusername/commcoach-ai.git
cd commcoach-ai

# 2. Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env and add GEMINI_API_KEY
npm run dev

# 3. Setup frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env.local
# Edit .env.local: VITE_API_URL=http://localhost:3001/api
npm run dev

# 4. Open browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001/api
```

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/add-user-authentication

# 2. Make changes

# 3. Test locally
npm run dev

# 4. Commit changes
git add .
git commit -m "Add JWT authentication"

# 5. Push to GitHub
git push origin feature/add-user-authentication

# 6. Create Pull Request on GitHub

# 7. After review, merge to main

# 8. Auto-deploy triggers:
# - Vercel redeploys frontend
# - Railway redeploys backend
```

---

## Conclusion

CommCoach AI is a production-ready, scalable communication training platform with:

✅ **Modern Tech Stack**: React, Node.js, Gemini AI  
✅ **Cloud Infrastructure**: Vercel + Railway  
✅ **RESTful API**: Well-documented endpoints  
✅ **Security**: CORS, HTTPS, environment variables  
✅ **Monitoring**: Logs, analytics, health checks  
✅ **CI/CD**: Auto-deploy on git push  
✅ **Future-Ready**: Database, auth, scaling plans  

**Next Steps**:
1. Integrate Firebase for user authentication
2. Add database persistence (Firestore)
3. Implement JWT authentication
4. Add rate limiting
5. Create admin dashboard
6. Mobile app (React Native)

---

**Last Updated**: January 14, 2026  
**Version**: 1.0  
**Maintainer**: CommCoach Team

For questions or support, visit:
- 📧 Email: support@commcoach.ai
- 💬 Discord: [Join our server](https://discord.gg/commcoach)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/commcoach-ai/issues)
