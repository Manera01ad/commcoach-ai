# 🎨 Visual Architecture Guide - CommCoach AI

This guide explains how the professional architecture infographics are built and provides the **Master Prompt** you can use to request them.

---

## 🛠️ The "Build" Process

Creating a professional architectural design involves three technical stages:

### 1. **Context Aggregation (The Brain)**
First, the AI scans your project root (`C:\Users\Hp\...\commcoach-ai`) to understand:
- **Folder Structure**: Identifying `frontend`, `backend`, and `database` directories.
- **Tech Stack**: Reading `package.json` and `README.md` to find React 19, Node.js, and Supabase.
- **Features**: Identifying unique components like "Meeting Intelligence" or "YouTube Mentor Library."

### 2. **Structural Mapping (The Map)**
The system then maps these components into a standard **4-Tier Architecture**:
- **Client Layer**: User-facing interfaces (React, PWA).
- **Service Layer**: Business logic and API handling (Express, Orchestrator).
- **Data Layer**: Persistence and long-term memory (PostgreSQL, pgvector).
- **Intelligence Layer**: External AI models (Gemini, Whisper, ElevenLabs).

### 3. **Visual Translation (The Artist)**
Finally, the system converts these technical facts into a visual description using **Design Tokens**:
- **Colors**: Using purple/indigo gradients for a "premium" feel.
- **Shapes**: Using card-styled blocks with "Glassmorphism" (semi-transparent) effects.
- **Connections**: High-tech glowing lines to show how data flows between layers.

---

## 🚀 The Master Prompt

If you want the most "Beautiful Approach," use this **Master Prompt** with any high-end AI image generator (like Gemini Image 3):

> **PROMPT:** 
> "Create a world-class architectural infographic for the 'CommCoach AI' project. 
> 
> DESIGN STYLE: High-tech SaaS dashboard, dark mode, deep purple and neon blue glow. Use glassmorphism cards and glowing connection lines. Professional, clean, and premium aesthetic.
> 
> DASHBOARD SECTIONS:
> 1. TOP LEFT (CLIENT): A box for 'Presence' showing React 19, PWA icons, and Microphone/Video icons for voice/chat labs.
> 2. CENTER (ORCHESTRATOR): A glowing core representing the 'Agent Brain' that routes user requests.
> 3. TOP RIGHT (CLOUD): Logos for Google Gemini, OpenAI, and ElevenLabs.
> 4. BOTTOM LEFT (DATABASE): A repository icon for Supabase (PostgreSQL + pgvector).
> 5. BOTTOM RIGHT (SECURITY): A shield icon representing RBAC and RLS data security.
> 
> Background should be a subtle clean grid. Include tech badges at the bottom for TypeScript and Node.js. No device frames."

---

## 📊 Tools for Design

| Tool | Purpose |
|------|---------|
| **Mermaid.js** | Best for technical, clickable diagrams in documentation. |
| **Figma** | Used for manual high-fidelity design based on AI concepts. |
| **Gemini Image 3** | The engine used for the "Wow" infographics you saw. |
| **Lucidchart** | Best for enterprise-standard flowcharts. |

---

## 🎯 Pro Tip
When requesting a design, always specify the **Target Directory**. This ensures the AI looks at your *actual* project code instead of just general technical definitions.
