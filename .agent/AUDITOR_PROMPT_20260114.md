# Documentation Agent Prompt - Session 2026-01-14

You are a Technical Documentation Specialist working on the CommCoach-AI project.

## MISSION
Synchronize project documentation to reflect all system changes from today's session (2026-01-14).

## PROJECT CONTEXT
**Project**: CommCoach-AI  
**Type**: Full-stack AI communication training platform  
**Stack**: React 19 + TypeScript, Node.js + Express, Google Gemini API  
**Deployment**: Vercel (frontend) + Railway (backend)  

## SESSION CHANGES TO DOCUMENT

### 1. NEXUS Orchestrator System (NEW COMPONENT)
**What**: A multi-agent orchestration system for managing the CommCoach-AI project
**Components**:
- **Nexus (Mission Control)**: Strategic orchestrator in main chat thread
- **Sub-Agents (Workers)**: Specialized agents in separate threads (Frontend Builder, Backend Developer, QA Tester, etc.)
- **Hub-and-Spoke Architecture**: Nexus delegates to Sub-Agents, monitors progress, updates dashboard

**Key Artifacts**:
- `GLOBAL_DASHBOARD.md` - Real-time project health dashboard
- `.agent/NEXUS_MODE_SELECTOR.md` - Operational modes guide

### 2. Operational Modes V2.0 (NEW FEATURE)
**Three Quality Gates**:

**🛡️ SENTINEL MODE (The Critic)**
- **Purpose**: Pre-implementation security review
- **Trigger**: Tasks tagged [SENTINEL], [CRITICAL], or [COMPLEX]
- **Action**: Spawns Red Team Agent to attack design before coding
- **Example**: "Build JWT auth [SENTINEL]" → Security review before implementation

**👁️ UX PROXY MODE (The User)**
- **Purpose**: Post-implementation UX testing
- **Trigger**: Tasks tagged [UX_PROXY], [FRONTEND], or [UI]
- **Action**: Spawns UX Tester Agent to playtest after build
- **Example**: "Build login page [UX_PROXY]" → UX test after implementation

**📝 AUDITOR MODE (The Librarian)**
- **Purpose**: Session-end documentation sync
- **Trigger**: "Session Wrap-up [AUDITOR]"
- **Action**: Scans changes, updates all project documentation
- **Example**: End of session → Auto-sync docs with code

### 3. Supervisor Suite V3.0 (NEW PROTOCOLS)
**Action Log Approval System**:
- All strategic actions require explicit Creator approval
- Structured approval format with risk assessment
- No immediate execution without "Run" command

**Self-Correction Protocol**:
- Automatic repair plan generation on Sub-Agent failures
- Multiple repair strategies presented
- Incident tracking in Dashboard

### 4. Health Check Results (CRITICAL FINDINGS)
**Incident #001**: Railway backend offline (404 error) - CRITICAL
**Incident #002**: API key exposure in frontend (12 instances) - CRITICAL
**Incident #003**: Outdated dependencies (4 packages) - MEDIUM

### 5. Dependency Audit Results
**Outdated Packages**:
- Express: v4.22.1 → v5.2.1 (MAJOR - breaking changes)
- body-parser: v1.20.4 → v2.2.2 (MAJOR)
- dotenv: v16.6.1 → v17.2.3 (MAJOR)
- @google/generative-ai: v0.21.0 → v0.24.1 (MINOR)

## DOCUMENTATION TASKS

### Task 1: Update `docs/ARCHITECTURE.md`

**Add New Section After "System Overview"**:

```markdown
## Nexus Orchestrator System

**Added**: 2026-01-14

CommCoach-AI now employs a multi-agent orchestration system for project management and code quality assurance.

### Architecture Pattern: Hub-and-Spoke

```
┌─────────────────────────────────────────────────┐
│         NEXUS (Mission Control)                 │
│  - Strategic planning                           │
│  - Task delegation                              │
│  - Health monitoring                            │
│  - Dashboard management                         │
└─────────────┬───────────────────────────────────┘
              │
    ┌─────────┼─────────┬─────────┬─────────┐
    │         │         │         │         │
┌───▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐
│Frontend│ │Backend│ │ QA   │ │Red   │ │ UX   │
│Builder │ │ Dev   │ │Tester│ │Team  │ │Tester│
└────────┘ └───────┘ └──────┘ └──────┘ └──────┘
  (Sub-Agents in separate conversation threads)
```

### Components

#### 1. Nexus (Orchestrator)
- **Location**: Main conversation thread (Mission Control)
- **Role**: Strategic oversight, not code implementation
- **Responsibilities**:
  - Analyze requests and create implementation specs
  - Delegate tasks to specialized Sub-Agents
  - Monitor progress and health metrics
  - Maintain GLOBAL_DASHBOARD.md
  - Coordinate quality gates (SENTINEL, UX_PROXY, AUDITOR modes)

#### 2. Sub-Agents (Tactical Workers)
- **Location**: Separate conversation threads (Workspaces)
- **Role**: Hands-on code implementation
- **Types**:
  - Frontend Builder (React/TypeScript)
  - Backend Developer (Node.js/Express)
  - Database Architect (Firebase/SQL)
  - QA Tester (Testing/Debugging)
  - Red Team (Security review)
  - UX Tester (Usability validation)
  - Documentation Agent (Docs sync)

#### 3. Operational Modes (Quality Gates)

**🛡️ SENTINEL MODE** - Pre-implementation security review
- Spawns Red Team Agent to attack design before coding
- Identifies vulnerabilities, logic flaws, architecture issues
- Required for critical/complex tasks

**👁️ UX PROXY MODE** - Post-implementation UX testing
- Spawns UX Tester Agent to playtest after build
- Validates usability, accessibility, responsiveness
- Required for frontend/UI tasks

**📝 AUDITOR MODE** - Session-end documentation sync
- Scans completed tasks and updates all docs
- Ensures documentation matches codebase
- Triggered at session wrap-up

#### 4. Artifacts

**GLOBAL_DASHBOARD.md** (Root)
- Real-time project health status
- Active incidents tracking
- System metrics
- Deployment status
- Risk assessment

**.agent/NEXUS_MODE_SELECTOR.md**
- Operational modes guide
- Workflow documentation
- Agent prompt templates
- Command reference

### Workflow Example

```
Creator: "Build login page [SENTINEL] [UX_PROXY]"
         ↓
Nexus: Creates spec → Spawns Red Team review
         ↓
Red Team: Attacks design, finds vulnerabilities
         ↓
Nexus: Updates spec → Delegates to Frontend Builder
         ↓
Frontend Builder: Implements LoginPage.tsx
         ↓
Nexus: Spawns UX Tester → Validates usability
         ↓
UX Tester: Reports grade B+, 2 issues found
         ↓
Nexus: Creates refinement tasks → Updates Dashboard
```

### Supervisor Suite V3.0

**Action Log Approval System**:
- All strategic actions presented for explicit approval
- Risk assessment included (LOW/MEDIUM/HIGH)
- No auto-execution without Creator's "Run" command

**Self-Correction Protocol**:
- Automatic repair plans generated on Sub-Agent failures
- Multiple strategies presented with risk/time estimates
- Incident tracking and resolution monitoring
```

**Add to "Component Breakdown" section**:

```markdown
### Global Orchestration Layer

#### GLOBAL_DASHBOARD.md
- **Purpose**: Central monitoring and status tracking
- **Contents**: 
  - System health metrics
  - Active incidents log
  - Deployment status matrix
  - Risk assessment
  - Tactical execution queue
  - Change log
- **Updated By**: Nexus Orchestrator (automated)
- **Location**: Root directory

#### .agent/ Directory
- **Purpose**: Nexus system configuration and guides
- **Contents**:
  - NEXUS_MODE_SELECTOR.md - Operational modes documentation
  - AUDITOR_PROMPT_[DATE].md - Session documentation prompts
- **Updated By**: Nexus system installation
```

---

### Task 2: Update `docs/QUICK_REFERENCE.md`

**Add New Section After "🚀 Quick Start"**:

```markdown
## 🌐 Nexus Orchestrator Commands

### Operational Modes
Tag tasks to activate quality gates:

```bash
# Security review before implementation
"Build authentication [SENTINEL]"

# UX testing after implementation
"Create dashboard [UX_PROXY]"

# Combined quality gates
"Build admin panel [SENTINEL] [UX_PROXY]"

# Documentation sync at session end
"Session Wrap-up [AUDITOR]"
```

### Quick Commands
```bash
# Check project health
"Health check"

# View current status
"Status"

# View incidents
"Incident report"

# Onboard new project
"Onboard [project_path]"
```

### Mode Selector Guide
Full documentation: `.agent/NEXUS_MODE_SELECTOR.md`

### Dashboard Location
Real-time status: `GLOBAL_DASHBOARD.md`
```

---

### Task 3: Update `README.md` (Optional Enhancement)

**Add to "🏗️ Architecture" section**:

```markdown
### Project Orchestration

CommCoach-AI uses the **Nexus Orchestrator System** for code quality and project management:

- **🛡️ SENTINEL MODE**: Security review before implementation
- **👁️ UX PROXY MODE**: Usability testing after build
- **📝 AUDITOR MODE**: Automatic documentation sync

See `GLOBAL_DASHBOARD.md` for real-time project health.
```

---

## DELIVERABLES REQUIRED

For each documentation file, provide:

1. **Section to Update**: Which part of the doc
2. **Changes Required**: What to add/modify/remove
3. **Updated Content**: Exact markdown to insert
4. **Location**: Line numbers or section headings

## QUALITY STANDARDS

- **Accurate**: Match current system implementation
- **Clear**: Non-technical readers can understand
- **Concise**: No unnecessary verbosity
- **Consistent**: Match existing documentation style
- **Complete**: Cover all session changes

## OUTPUT FORMAT

Please provide updates in this format:

```markdown
## FILE: docs/ARCHITECTURE.md

### Update #1: Add Nexus Orchestrator Section
**Location**: After "System Overview" (line ~48)
**Action**: INSERT NEW SECTION

**Content**:
[paste exact markdown here]

---

### Update #2: Add .agent/ to Component Breakdown
**Location**: In "Component Breakdown" section
**Action**: ADD NEW SUBSECTION

**Content**:
[paste exact markdown here]

---

## FILE: docs/QUICK_REFERENCE.md
[repeat format]
```

---

**Begin documentation sync now. Provide all required updates.**
