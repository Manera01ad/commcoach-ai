# CommCoach AI QA Monitoring Dashboard

A production-grade, real-time monitoring system for CommCoach AI quality assurance.

## 🚀 Features

- **Real-time Health Monitoring**: 30-second auto-refresh of all system metrics.
- **8 Critical System Cards**: Infrastructure, Therapy Logic, User Journeys, Performance, Security, Safety, Bias, and Conversation Quality.
- **7-Day Trend Analysis**: Interactive charts using Recharts.
- **AI-Powered Insights**: Automated recommendations from `ai_analytics_reports`.
- **Critical Alert System**: Instant notification of system failures or regressions.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## 📦 Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd qa-dashboard
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the `qa-dashboard` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://jmaerbneeavezfrvttzq.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

## 🏗️ Project Structure

- `src/app`: Main dashboard page and layout.
- `src/components/Dashboard`: Modular UI components (HealthCards, Charts, Alerts).
- `src/hooks`: Custom hooks for real-time data orchestration.
- `src/lib`: Supabase client and utility functions.
- `src/types`: Database and component type definitions.

---
Created by Antigravity for CommCoach AI QA System.
