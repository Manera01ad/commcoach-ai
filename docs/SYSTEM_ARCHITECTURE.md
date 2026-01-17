# 🏗️ CommCoach AI - 7-Layer System Architecture

## Architecture Diagram (Mermaid.js)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#f4f4f4'}}}%%
graph TD
    %% Define Styles
    classDef blue stroke:#3b82f6,stroke-width:2px,fill:#eff6ff;
    classDef purple stroke:#a855f7,stroke-width:2px,fill:#faf5ff;
    classDef gray stroke:#64748b,stroke-width:2px,fill:#f8fafc;
    classDef green stroke:#22c55e,stroke-width:2px,fill:#f0fdf4;
    classDef orange stroke:#f97316,stroke-width:2px,fill:#fff7ed;
    classDef yellow stroke:#eab308,stroke-width:2px,fill:#fefce8;
    classDef red stroke:#ef4444,stroke-width:2px,fill:#fef2f2;
    classDef dashed stroke-dasharray: 5 5;

    %% --- Layer 1: Development (Blue) ---
    subgraph L1 [Layer 1: Development Environment]
        direction TB
        DevWorkstation["💻 Local Workstation<br/>Path: .../antigravity/scratch/commcoach-ai"]:::blue
        TechStack["🛠️ Tech Stack<br/>React 19, Vite, Node.js"]:::blue
        LocalStorage["💾 Storage<br/>localStorage (Current)"]:::blue
    end

    %% --- Layer 2: AI Agent Orchestration (Purple) ---
    subgraph L2 [Layer 2: AI Agent Orchestration]
        direction TB
        AgentHQ["🧠 Agent HQ (D: Drive)<br/>Local File System Access"]:::purple
        Orchestrator["🤖 Master Orchestrator<br/>Reads/Writes Code"]:::purple
    end

    %% --- Layer 3: Version Control (Gray) ---
    subgraph L3 [Layer 3: Version Control]
        GitHub["🐙 GitHub Repository<br/>Branch: main"]:::gray
    end

    %% --- Layer 4: CI/CD Pipeline (Green) ---
    subgraph L4 [Layer 4: CI/CD Pipeline]
        VercelPipe["⚙️ Vercel Pipeline<br/>Frontend Build"]:::green
        RailwayPipe["⚙️ Railway Pipeline<br/>Backend Build"]:::green
    end

    %% --- Layer 5: Deployment & Hosting (Orange) ---
    subgraph L5 [Layer 5: Deployment & Hosting]
        VercelHost["☁️ Vercel<br/>https://commcoach-ai.vercel.app"]:::orange
        RailwayHost["🚂 Railway<br/>(Backend API)"]:::orange
        EnvVars["🔐 Env Vars<br/>(Encrypted)"]:::orange
    end

    %% --- Layer 6: Runtime Architecture (Yellow) ---
    subgraph L6 [Layer 6: Runtime Architecture]
        Browser["👤 User Browser<br/>Web / Mobile"]:::yellow
        CDN["🌐 Vercel CDN"]:::yellow
        ReactApp["⚛️ React App"]:::yellow
        BackendAPI["⚙️ Backend API<br/>Node.js Express"]:::yellow
        PWA["📱 PWA Mobile Support<br/>(Planned - Q2 2026)"]:::yellow
        style PWA stroke-dasharray: 5 5
    end

    %% --- Layer 7: Automation & Integrations (Red) ---
    subgraph L7 [Layer 7: Automation & Integrations]
        CurrentAI["⚡ Google Gemini API<br/>Session Analysis"]:::red
        PlannedAuth["🔒 Firebase Auth<br/>(Planned - Q1 2026)"]:::red
        style PlannedAuth stroke-dasharray: 5 5
        PlannedN8N["🔄 n8n Workflows<br/>(Planned - Q2 2026)"]:::red
        style PlannedN8N stroke-dasharray: 5 5
        PlannedStripe["💳 Stripe Payments<br/>(Planned - Q3 2026)"]:::red
        style PlannedStripe stroke-dasharray: 5 5
    end

    %% --- Relationships & Flow ---
    
    %% Development Flow
    Orchestrator -- "1. Modifies Code" --> DevWorkstation
    DevWorkstation -- "2. Developer Reviews" --> L2
    DevWorkstation -- "3. Manual Git Push" --> GitHub

    %% CI/CD Flow
    GitHub -- "4. Trigger Webhook" --> VercelPipe
    GitHub -- "4. Trigger Webhook" --> RailwayPipe
    VercelPipe -- "5. Deploy" --> VercelHost
    RailwayPipe -- "5. Deploy" --> RailwayHost

    %% Runtime Flow
    Browser -- "6. HTTPS Request" --> CDN
    CDN --> ReactApp
    ReactApp -- "7. API Call (JWT)" --> RailwayHost
    RailwayHost --> BackendAPI
    BackendAPI -- "8. AI Request" --> CurrentAI

    %% Future Connections (Dashed)
    BackendAPI -. "Planned: Auth" .-> PlannedAuth
    BackendAPI -. "Planned: Webhook" .-> PlannedN8N
    ReactApp -. "Planned: Offline" .-> PWA
```

---

## 🗺️ Layer Description Mapping

| Layer | Color | Components | Status |
|:---|:---|:---|:---|
| **1. Development** | 🟦 Blue | Local Workstation, React/Node Stack, LocalStorage | ✅ Live |
| **2. AI Orchestration** | 🟪 Purple | Agent HQ (D:), Master Orchestrator, FileOps | ✅ Live |
| **3. Version Control** | ⬜ Gray | GitHub Repository (`main` branch) | ✅ Live |
| **4. CI/CD** | 🟩 Green | Vercel Pipeline, Railway Pipeline | ✅ Live |
| **5. Deployment** | 🟧 Orange | Vercel Hosting, Railway Hosting, Env Vars | ✅ Live |
| **6. Runtime** | 🟨 Yellow | Browser, CDN, API, PWA (Planned) | ⚠️ Mixed |
| **7. Automation** | 🟥 Red | Gemini API, Firebase (Planned), n8n (Planned) | ⚠️ Mixed |

## 🔑 Key Data Flow Sequence

1.  **User Input** 🗣️
    *   User records audio in Browser (Frontend).
2.  **Transmission** 📡
    *   React App sends transcript via HTTPS POST to Vercel/Railway.
3.  **Processing** ⚙️
    *   Railway Backend receives request, authenticates (future), and formats prompt.
4.  **Intelligence** 🧠
    *   Backend calls **Google Gemini API** (Layer 7).
5.  **Response** ↩️
    *   Insights returned to Backend -> Frontend -> User UI.

## 🛠️ Implementation Guidance

1.  **Orchestration Rule**: Agents (Layer 2) *never* push to GitHub (Layer 3) directly. They modify Layer 1, and the Human Developer bridges the gap to Layer 3.
2.  **Security Boundary**: Layer 6 (Runtime) communicates with Layer 7 (Integrations) only via Layer 5/6 Backend logic, never directly from client (except strictly public assets).
3.  **Future Proofing**: Dashed components (Firebase, PWA) in the diagram represent the Q1-Q3 2026 roadmap items.
