# File Organization & Cleanup Plan
**Date:** 2026-02-02
**Status:** PENDING APPROVAL

---

## 🎯 MAIN PROJECT CLEANUP
**Location:** `C:\Users\Hp\.gemini\antigravity\scratch\commcoach-ai`

### 📁 Files to MOVE (Root → /docs)

| Current Location (Root) | New Location (/docs) | Reason |
|------------------------|---------------------|---------|
| `API_DOCS.md` | `/docs/API_DOCS.md` | Documentation file |
| `ARCHETYPE_COMPLETE.md` | `/docs/ARCHETYPE_COMPLETE.md` | Documentation file |
| `ARCHETYPE_DEPLOYMENT.md` | `/docs/ARCHETYPE_DEPLOYMENT.md` | Documentation file |
| `ARCHETYPE_FINAL.md` | `/docs/ARCHETYPE_FINAL.md` | Documentation file |
| `ARCHETYPE_IMPLEMENTATION.md` | `/docs/ARCHETYPE_IMPLEMENTATION.md` | Documentation file |
| `ARCHITECTURE_BLUEPRINT.md` | `/docs/ARCHITECTURE_BLUEPRINT.md` | Documentation file |
| `PROJECT_MASTER_LOG.md` | `/docs/PROJECT_MASTER_LOG.md` | Documentation file |
| `QUICK_START_AUTH.md` | `/docs/QUICK_START_AUTH.md` | Documentation file |
| `VISUAL_ARCH_GUIDE.md` | `/docs/VISUAL_ARCH_GUIDE.md` | Documentation file |

### 🗑️ Files to DELETE (Duplicates)

| File | Reason |
|------|--------|
| `DEPLOYMENT_CHECKLIST.md` (root) | Duplicate - already exists in `/docs/DEPLOYMENT_CHECKLIST.md` |

### ✅ Files to KEEP in Root

| File | Reason |
|------|--------|
| `README.md` | Main project readme - should stay in root |
| `.env.example` | Environment template - standard location |
| `.gitignore` | Git configuration |
| `.gitattributes` | Git configuration |
| `deploy.ps1` | Deployment script |
| `dev.ps1` | Development script |
| `monitor-health.ps1` | Monitoring script |
| `push-to-github.ps1` | Git automation script |
| `setup-cli-tools.ps1` | Setup script |

### 📂 Folders to KEEP (No Changes)
- `.agent/` - Agent configuration
- `.git/` - Git repository
- `.orchids/` - Orchids configuration
- `backend/` - Backend code
- `database/` - Database files
- `docs/` - Documentation (will receive moved files)
- `frontend/` - Frontend code
- `qa-dashboard/` - QA dashboard
- `scripts/` - Scripts folder

---

## 🤖 AGENT CONTROLLER CLEANUP
**Location:** `d:\My_AI_Projects`

### 🗑️ Files/Folders to DELETE

| Item | Type | Size | Reason |
|------|------|------|---------|
| `backend/` | Folder | - | Duplicate - belongs only in main project |
| `frontend/` | Folder | - | Duplicate - belongs only in main project |
| `database_sql_files/` | Folder | - | Duplicate - belongs only in main project |
| `node_modules/` | Folder | Large | Not needed - can be regenerated |
| `package-lock.json` | File | 48KB | Not needed if no package.json usage |
| `supabase_schema.sql` | File | 9.5KB | Duplicate - belongs in main project |
| `supabase_schema (1).sql` | File | 9.8KB | Duplicate - belongs in main project |
| `implementation_guide (1).md` | File | 31KB | Duplicate file (has "(1)" suffix) |

### 📁 Files to MOVE (Root → /docs)

| Current Location | New Location | Reason |
|-----------------|--------------|---------|
| `ANTIGRAVITY_IMPLEMENTATION_PROMPT.md` | `/docs/ANTIGRAVITY_IMPLEMENTATION_PROMPT.md` | Documentation |
| `ARCHITECTURE_AGENT.md` | `/docs/ARCHITECTURE_AGENT.md` | Documentation |
| `ARCHITECTURE_AGENT_README.md` | `/docs/ARCHITECTURE_AGENT_README.md` | Documentation |
| `COMMCOACH_ARCHITECTURE_OVERVIEW.md` | `/docs/COMMCOACH_ARCHITECTURE_OVERVIEW.md` | Documentation |
| `COMMCOACH_IMPLEMENTATION_PLAN.md` | `/docs/COMMCOACH_IMPLEMENTATION_PLAN.md` | Documentation |
| `INDEX.md` | `/docs/INDEX.md` | Documentation |
| `PREMIUM_AURA_UI_GUIDE.md` | `/docs/PREMIUM_AURA_UI_GUIDE.md` | Documentation |
| `PROJECT_SUMMARY.md` | `/docs/PROJECT_SUMMARY.md` | Documentation |
| `QUICK_START.md` | `/docs/QUICK_START.md` | Documentation |
| `RTCROS_IMPLEMENTATION_MASTER_PLAN.md` | `/docs/RTCROS_IMPLEMENTATION_MASTER_PLAN.md` | Documentation |
| `commcoach_ai_cto_audit.md` | `/docs/commcoach_ai_cto_audit.md` | Documentation |
| `visual_report.md` | `/docs/visual_report.md` | Documentation |

### 📁 Files to MOVE (Root → /reports)

| Current Location | New Location | Reason |
|-----------------|--------------|---------|
| `CommCoach AI_Project Report.docx` | `/reports/CommCoach_AI_Project_Report.docx` | Report document |
| `CommCoach AI_Visual Report.docx` | `/reports/CommCoach_AI_Visual_Report.docx` | Report document (5.8MB) |
| `NEURAL COMPASS.docx` | `/reports/NEURAL_COMPASS.docx` | Report document |
| `chagpt_neural science.docx` | `/reports/chatgpt_neural_science.docx` | Report document |
| `CommCoach AI - Health Monitor.json` | `/reports/CommCoach_AI_Health_Monitor.json` | Report/config file |

### 📁 Files to MOVE (Root → /config)

| Current Location | New Location | Reason |
|-----------------|--------------|---------|
| `.env` | `/config/.env` | Configuration file (contains secrets) |
| `tsconfig.json` | `/config/tsconfig.json` | TypeScript configuration |
| `package.json` | `/config/package.json` | Package configuration |

### 📁 Files to MOVE (Root → /scripts)

| Current Location | New Location | Reason |
|-----------------|--------------|---------|
| `orchestrator.ts` | `/scripts/orchestrator.ts` | Script file |
| `orchestrator-mock.ts` | `/scripts/orchestrator-mock.ts` | Script file |
| `orchestrator-skills.ts` | `/scripts/orchestrator-skills.ts` | Script file |

### ✅ Files/Folders to KEEP in Root

| Item | Reason |
|------|--------|
| `README.md` | Main readme for agent controller |
| `agents/` | Core agent scripts |
| `skills/` | Core skills |
| `legal_docs/` | Legal documentation |
| `images/` | Image assets |
| `Tech report WIP/` | Work in progress folder |

### 📂 NEW Folder Structure After Cleanup

```
d:\My_AI_Projects/
├── README.md
├── agents/
├── skills/
├── legal_docs/
├── images/
├── Tech report WIP/
├── config/          [NEW]
│   ├── .env
│   ├── tsconfig.json
│   └── package.json
├── docs/            [NEW]
│   ├── (all .md files)
│   └── ...
├── reports/         [NEW]
│   ├── CommCoach_AI_Project_Report.docx
│   ├── CommCoach_AI_Visual_Report.docx
│   └── ...
└── scripts/         [NEW]
    ├── orchestrator.ts
    ├── orchestrator-mock.ts
    └── orchestrator-skills.ts
```

---

## 📊 SUMMARY

### Main Project
- **Files to Move:** 9 files (root → /docs)
- **Files to Delete:** 1 file (duplicate)
- **Total Impact:** Cleaner root directory, organized documentation

### Agent Controller
- **Files to Delete:** 8 items (duplicates, node_modules)
- **Files to Move:** 24 files (organized into /docs, /reports, /config, /scripts)
- **New Folders:** 4 folders (docs, reports, config, scripts)
- **Total Impact:** ~6MB freed (node_modules + duplicates), much better organization

---

## ⚠️ SAFETY NOTES

1. **No code files will be deleted** - only duplicates and generated files
2. **All documentation will be preserved** - just moved to organized folders
3. **Git history will be maintained** - using `git mv` for tracked files
4. **Backup recommended** - Though all changes are reversible via git

---

## 🚀 NEXT STEPS

Once approved:
1. Execute cleanup on Main Project
2. Execute cleanup on Agent Controller
3. Verify both structures
4. Commit changes with descriptive message
5. Push to GitHub

**Ready to proceed?** (yes/no)
