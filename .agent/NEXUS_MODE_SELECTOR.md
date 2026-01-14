# 🎛️ NEXUS OPERATIONAL MODE SELECTOR

**Version**: 2.0  
**Last Updated**: 2026-01-14T20:13:25+05:30  
**Location**: Mission Control - Nexus Orchestrator

---

## 🎯 QUICK MODE SELECTION

Copy and paste the desired mode tag into your task request:

```
[SENTINEL] - Activate Red Team security review BEFORE implementation
[UX_PROXY] - Activate User Experience testing AFTER implementation
[AUDITOR] - Activate Documentation sync at session end
[STANDARD] - Standard delegation (no special modes)
```

---

## 🛡️ MODE 1: SENTINEL MODE (The Critic)

### Purpose
Pre-emptive security and architectural attack to identify vulnerabilities **BEFORE** code is written.

### Activation Triggers
- Task labeled: `[SENTINEL]` or `[CRITICAL]` or `[COMPLEX]`
- Creator commands: "Red Team this" or "Attack this design"
- Nexus identifies high-risk changes (auth, payment, data handling)

### Workflow
```
1. Creator proposes task
2. Nexus creates IMPLEMENTATION_SPEC.md
3. 🛡️ SENTINEL MODE ACTIVATES
4. Nexus spawns "Red Team Agent" prompt
5. Creator pastes into NEW THREAD: "Red Team Review - [Task Name]"
6. Red Team Agent attacks the spec:
   - Security vulnerabilities
   - Logic flaws
   - Edge cases
   - Performance bottlenecks
   - Data integrity issues
7. Creator reports findings back to Mission Control
8. Nexus updates spec to address vulnerabilities
9. ONLY THEN: Delegate to implementation Sub-Agent
```

### Red Team Agent Prompt Template
```markdown
You are a Red Team Security Analyst specializing in finding vulnerabilities.

MISSION: Attack this implementation plan and find ALL weaknesses.

CONTEXT:
- Project: CommCoach-AI
- Task: [TASK_NAME]
- Spec: [PASTE_SPEC_HERE]

YOUR GOAL: Find vulnerabilities in these categories:
1. **Security Flaws**
   - Authentication bypasses
   - Authorization holes
   - SQL injection vectors
   - XSS vulnerabilities
   - CSRF attack surfaces
   - API key exposure
   - Session hijacking risks

2. **Logic Flaws**
   - Race conditions
   - Edge case failures
   - State management bugs
   - Data inconsistencies

3. **Architecture Issues**
   - Single points of failure
   - Scalability bottlenecks
   - Performance problems
   - Technical debt creation

4. **Data Integrity**
   - Data loss scenarios
   - Corruption vectors
   - Backup failures

DELIVERABLE:
For each vulnerability found, provide:
- **Severity**: CRITICAL / HIGH / MEDIUM / LOW
- **Attack Vector**: How to exploit it
- **Impact**: What breaks
- **Mitigation**: How to fix it

Be ruthless. Assume malicious actors will find these flaws.
```

### Example Usage
```
Creator: "Build JWT authentication system [SENTINEL]"

Nexus Response:
1. Creates AUTH_IMPLEMENTATION_SPEC.md
2. Identifies as CRITICAL (auth = high risk)
3. Issues Red Team handoff:
   "Creator, security review required. Start thread: 'Red Team: JWT Auth Review'"
4. Waits for security clearance
5. Updates spec based on findings
6. THEN delegates to Backend Builder
```

### Goal
**Zero architectural defects in production**

---

## 👁️ MODE 2: UX PROXY MODE (The User)

### Purpose
Post-implementation usability testing to verify user experience, not just functionality.

### Activation Triggers
- Task labeled: `[UX_PROXY]` or `[FRONTEND]` or `[UI]`
- Creator commands: "Test the UX" or "Playtest this"
- Any component with user-facing interface

### Workflow
```
1. Sub-Agent completes UI implementation
2. Creator reports: "LoginPage complete"
3. 👁️ UX PROXY MODE ACTIVATES
4. Nexus spawns "UX Tester Agent" prompt
5. Creator pastes into NEW THREAD: "UX Test - [Feature Name]"
6. UX Tester Agent evaluates:
   - First impression (aesthetics)
   - Usability (can users accomplish tasks?)
   - Accessibility (keyboard nav, screen readers)
   - Responsiveness (mobile, tablet, desktop)
   - Error states (helpful messages?)
   - Loading states (user feedback?)
   - Edge cases (empty states, long text, etc.)
7. Creator reports findings back to Mission Control
8. Nexus creates refinement tasks if issues found
9. Dashboard updated with UX test results
```

### UX Tester Agent Prompt Template
```markdown
You are a UX Researcher and User Experience Tester.

MISSION: Evaluate this UI feature from a real user's perspective.

CONTEXT:
- Project: CommCoach-AI (communication training platform)
- Feature: [FEATURE_NAME]
- Implementation: [DESCRIBE_WHAT_WAS_BUILT]
- Target Users: Professionals improving communication skills

EVALUATION CRITERIA:

1. **First Impression** (5 seconds test)
   - Is it visually appealing?
   - Is the purpose immediately clear?
   - Does it feel premium or basic?

2. **Usability** (Can users complete their task?)
   - Is the primary action obvious?
   - Are interactions intuitive?
   - Is feedback immediate?
   - Are error messages helpful?

3. **Accessibility**
   - Keyboard navigation working?
   - Screen reader friendly?
   - Color contrast sufficient?
   - Focus indicators visible?

4. **Responsiveness**
   - Mobile (320px - 480px): Usable?
   - Tablet (768px - 1024px): Optimal layout?
   - Desktop (1920px+): Not wasteful of space?

5. **Edge Cases**
   - How does it handle empty states?
   - What if text is very long?
   - What if network is slow?
   - What if user makes a mistake?

6. **Emotional Response**
   - Does it feel professional?
   - Does it reduce user anxiety?
   - Does it build confidence?

DELIVERABLE:
- **Overall Grade**: A+ to F
- **Strengths**: What works well (3-5 points)
- **Critical Issues**: Must fix before launch
- **Improvements**: Nice-to-have enhancements
- **User Journey Score**: 1-10

Test like a real user would. Be honest about what frustrates you.
```

### Example Usage
```
Creator: "Build user profile dashboard [UX_PROXY]"

Workflow:
1. Frontend Builder creates ProfileDashboard.tsx
2. Creator: "Profile dashboard complete"
3. Nexus activates UX PROXY MODE
4. Issues playtest handoff:
   "Creator, UX validation required. Start thread: 'UX Test: Profile Dashboard'"
5. UX Tester evaluates component
6. Creator reports: "Grade B+, 2 critical issues found"
7. Nexus creates refinement tasks
8. Dashboard updated
```

### Goal
**Verify usability, not just functionality**

---

## 📝 MODE 3: AUDITOR MODE (The Librarian)

### Purpose
Session-end documentation synchronization to ensure docs always reflect current codebase.

### Activation Triggers
- Creator commands: `[AUDITOR]` or `"Session Wrap-up"` or `"End of session"`
- Manual invocation when major changes complete

### Workflow
```
1. Creator: "Session Wrap-up [AUDITOR]"
2. 📝 AUDITOR MODE ACTIVATES
3. Nexus scans GLOBAL_DASHBOARD.md for completed tasks
4. Nexus identifies all modified files from session
5. Nexus generates documentation update requirements:
   - What changed in architecture?
   - What new components were added?
   - What dependencies updated?
   - What endpoints created/modified?
6. Nexus spawns "Documentation Agent" prompt
7. Creator pastes into NEW THREAD: "Auditor: Session [DATE] Docs Sync"
8. Documentation Agent updates:
   - docs/ARCHITECTURE.md
   - docs/CHANGELOG.md
   - docs/QUICK_REFERENCE.md (if needed)
   - README.md (if public-facing changes)
9. Creator reports: "Docs updated"
10. Nexus closes out session in Dashboard
```

### Documentation Agent Prompt Template
```markdown
You are a Technical Documentation Specialist.

MISSION: Synchronize documentation to reflect code changes from this session.

CONTEXT:
- Project: CommCoach-AI
- Session Date: [DATE]
- Changes: [LIST_OF_CHANGES_FROM_DASHBOARD]

FILES TO UPDATE:

1. **docs/ARCHITECTURE.md**
   - New components/services added
   - Architecture changes
   - Technology stack updates
   - API endpoint changes
   - Data flow modifications

2. **docs/CHANGELOG.md**
   - Version number (if applicable)
   - Date of changes
   - Added features
   - Fixed bugs
   - Changed behaviors
   - Deprecated items
   - Security updates

3. **docs/QUICK_REFERENCE.md** (if needed)
   - New environment variables
   - New API endpoints
   - Updated commands
   - Changed configurations

4. **README.md** (if public-facing changes)
   - Feature list updates
   - Installation steps
   - Usage examples

CHANGES THIS SESSION:
[PASTE_COMPLETED_TASKS_FROM_DASHBOARD]

DELIVERABLE:
For each file that needs updating:
- **Section to update**: (which part of the doc)
- **Changes**: (what to add/modify/remove)
- **Updated content**: (exact markdown to use)

Keep documentation:
- Accurate (matches current code)
- Clear (non-technical readers can understand)
- Concise (no fluff)
- Consistent (matches existing style)
```

### Example Usage
```
Session activities:
- Built LoginPage.tsx
- Added /api/auth/login endpoint
- Updated Express to v5.2.1
- Fixed API key security issue

Creator: "Session Wrap-up [AUDITOR]"

Nexus Response:
1. Scans Dashboard for completed tasks (finds 4 above)
2. Identifies files needing updates:
   - ARCHITECTURE.md (new component, new endpoint)
   - CHANGELOG.md (security fix, dependency update)
   - QUICK_REFERENCE.md (new API endpoint)
3. Issues documentation handoff:
   "Creator, documentation sync required. Start thread: 'Auditor: 2026-01-14 Session Docs'"
4. Documentation Agent updates all relevant files
5. Creator: "Docs synced"
6. Nexus marks session complete in Dashboard
```

### Goal
**Documentation is never stale**

---

## 🎛️ MODE COMBINATION MATRIX

You can combine modes for maximum quality:

| Task Type | Recommended Modes | Example |
|-----------|-------------------|---------|
| **Critical Backend** | `[SENTINEL]` only | "Build payment processing [SENTINEL]" |
| **User-Facing UI** | `[UX_PROXY]` only | "Build settings page [UX_PROXY]" |
| **High-Risk Frontend** | `[SENTINEL] [UX_PROXY]` | "Build admin dashboard [SENTINEL] [UX_PROXY]" |
| **Session End** | `[AUDITOR]` | "Session Wrap-up [AUDITOR]" |
| **Standard Task** | `[STANDARD]` | "Add loading spinner [STANDARD]" |

---

## 📋 QUICK REFERENCE COMMAND GUIDE

### Activating Modes

```bash
# Single Mode
"Build JWT authentication [SENTINEL]"
"Create login form [UX_PROXY]"
"Session Wrap-up [AUDITOR]"

# Multiple Modes
"Build user profile page [SENTINEL] [UX_PROXY]"

# Standard (no special handling)
"Fix typo in header [STANDARD]"
```

### Nexus Response Patterns

**SENTINEL MODE**:
```
🛡️ SENTINEL MODE ACTIVATED
Security review required before implementation.

Creator, please:
1. Start new thread: "Red Team: [Task Name]"
2. Paste the Red Team Agent prompt below
3. Report findings back to Mission Control

[RED TEAM PROMPT]
```

**UX PROXY MODE**:
```
👁️ UX PROXY MODE ACTIVATED
Usability testing required after implementation.

Implementation complete. Now testing UX...

Creator, please:
1. Start new thread: "UX Test: [Feature Name]"
2. Paste the UX Tester Agent prompt below
3. Report grade and issues back to Mission Control

[UX TESTER PROMPT]
```

**AUDITOR MODE**:
```
📝 AUDITOR MODE ACTIVATED
Documentation synchronization in progress...

Session changes detected:
- [CHANGE 1]
- [CHANGE 2]
- [CHANGE 3]

Creator, please:
1. Start new thread: "Auditor: [DATE] Session Docs"
2. Paste the Documentation Agent prompt below
3. Report completion back to Mission Control

[DOCUMENTATION AGENT PROMPT]
```

---

## 🎯 MODE DECISION FLOWCHART

```
Task Received
    |
    v
Is it labeled [SENTINEL], [CRITICAL], or [COMPLEX]?
    |
    ├─ YES → 🛡️ Activate SENTINEL MODE → Red Team review → Update spec → Delegate
    |
    └─ NO → Continue
               |
               v
Is it labeled [UX_PROXY], [FRONTEND], or [UI]?
    |
    ├─ YES → Note for later → Delegate → Implementation complete → 👁️ Activate UX PROXY MODE → Test → Refine if needed
    |
    └─ NO → Continue
               |
               v
Is command "Session Wrap-up" or [AUDITOR]?
    |
    ├─ YES → 📝 Activate AUDITOR MODE → Scan changes → Update docs → Close session
    |
    └─ NO → Standard delegation workflow
```

---

## 📊 MODE TRACKING IN DASHBOARD

Each mode activation will be logged in `GLOBAL_DASHBOARD.md`:

```markdown
### Tactical Execution Queue

#### Active Tasks
1. **Task**: Build JWT Authentication
   - **Status**: Red Team Review (SENTINEL MODE)
   - **Assigned To**: Red Team Agent (Thread: "Red Team: JWT Auth")
   - **Blocking**: Implementation (waiting for security clearance)

2. **Task**: Login Page Implementation
   - **Status**: UX Testing (UX PROXY MODE)
   - **Assigned To**: UX Tester Agent (Thread: "UX Test: Login Page")
   - **Grade**: Pending

#### Completed Tasks
1. **Session Documentation Sync** - AUDITOR MODE ✅
   - Updated: ARCHITECTURE.md, CHANGELOG.md
   - Date: 2026-01-14
```

---

## 🔄 INTEGRATION WITH PROTOCOL V2.0

These modes enhance but do not replace the Hub-and-Spoke architecture:

| Phase | Standard Flow | With Modes |
|-------|---------------|------------|
| **Planning** | Nexus creates spec | + SENTINEL MODE (if critical) |
| **Implementation** | Delegate to Sub-Agent | (same) |
| **Validation** | Sub-Agent reports done | + UX PROXY MODE (if UI) |
| **Session End** | Update Dashboard | + AUDITOR MODE (sync docs) |

---

## ✅ MODE INSTALLATION COMPLETE

**Nexus Configuration Updated**:
- ✅ SENTINEL MODE: Armed and ready
- ✅ UX PROXY MODE: Standing by
- ✅ AUDITOR MODE: Monitoring enabled

**Next Steps**:
Use the mode tags in your task requests, and I will automatically activate the appropriate quality gates.

---

**End of Mode Selector Artifact**
