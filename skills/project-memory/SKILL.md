---
name: project-memory
description: Set up and maintain a structured project memory system in docs/project_notes/ that tracks bugs with solutions, architectural decisions, key project facts, and work history. Use this skill when asked to "set up project memory", "track our decisions", "log a bug fix", "update project memory", or "initialize memory system". Configures both CLAUDE.md and AGENTS.md to maintain memory awareness across different AI coding tools.
---

# Project Memory

## Table of Contents

- [Overview](#overview)
- [When to Use This Skill](#when-to-use-this-skill)
- [Core Capabilities](#core-capabilities)
  - [1. Initial Setup - Create Memory Infrastructure](#1-initial-setup---create-memory-infrastructure)
  - [2. Configure CLAUDE.md - Memory-Aware Behavior](#2-configure-claudemd---memory-aware-behavior)
  - [3. Configure AGENTS.md - Multi-Tool Support](#3-configure-agentsmd---multi-tool-support)
  - [4. Searching Memory Files](#4-searching-memory-files)
  - [5. Updating Memory Files](#5-updating-memory-files)
  - [6. Memory File Maintenance](#6-memory-file-maintenance)
- [Templates and References](#templates-and-references)
- [Example Workflows](#example-workflows)
- [Integration with Other Skills](#integration-with-other-skills)
- [Success Criteria](#success-criteria)
- [Personalization Layer - Waldo Integration](#personalization-layer---waldo-integration)

## Overview

Maintain institutional knowledge for projects by establishing a structured memory system in `docs/project_notes/`. This skill sets up four key memory files (bugs, decisions, key facts, issues) and configures CLAUDE.md and AGENTS.md to automatically reference and maintain them. The result is a project that remembers past decisions, solutions to problems, and important configuration details across coding sessions and across different AI tools.

**Optional Personalization:** This skill can optionally integrate with the Waldo agent to provide a conversational, plan-oriented experience with project planning and progress tracking. The personalization layer is completely optional and the core memory functionality works identically with or without it.

## When to Use This Skill

Invoke this skill when:

- Starting a new project that will accumulate knowledge over time
- The project already has recurring bugs or decisions that should be documented
- The user asks to "set up project memory" or "track our decisions"
- The user wants to log a bug fix, architectural decision, or completed work
- Encountering a problem that feels familiar ("didn't we solve this before?")
- Before proposing an architectural change (check existing decisions first)
- Working on projects with multiple developers or AI tools (Claude Code, Cursor, etc.)
- Setting up a personalized, plan-oriented project workflow with progress tracking

## Core Capabilities

### 1. Initial Setup - Create Memory Infrastructure

When invoked for the first time in a project, create the following structure:

```
docs/
└── project_notes/
    ├── bugs.md         # Bug log with solutions
    ├── decisions.md    # Architectural Decision Records
    ├── key_facts.md    # Project configuration and constants
    └── issues.md       # Work log with ticket references
```

**Directory naming rationale:** Using `docs/project_notes/` instead of `memory/` makes it look like standard engineering organization, not AI-specific tooling. This increases adoption and maintenance by human developers.

**Initial file content:** Copy templates from the `references/` directory in this skill:
- Use `references/bugs_template.md` for initial `bugs.md`
- Use `references/decisions_template.md` for initial `decisions.md`
- Use `references/key_facts_template.md` for initial `key_facts.md`
- Use `references/issues_template.md` for initial `issues.md`

Each template includes format examples and usage tips.

### 2. Configure CLAUDE.md - Memory-Aware Behavior

Add or update the following section in the project's `CLAUDE.md` file:

```markdown
## Project Memory System

This project maintains institutional knowledge in `docs/project_notes/` for consistency across sessions.

### Memory Files

- **bugs.md** - Bug log with dates, solutions, and prevention notes
- **decisions.md** - Architectural Decision Records (ADRs) with context and trade-offs
- **key_facts.md** - Project configuration, credentials, ports, important URLs
- **issues.md** - Work log with ticket IDs, descriptions, and URLs

### Memory-Aware Protocols

**Before proposing architectural changes:**
- Check `docs/project_notes/decisions.md` for existing decisions
- Verify the proposed approach doesn't conflict with past choices
- If it does conflict, acknowledge the existing decision and explain why a change is warranted

**When encountering errors or bugs:**
- Search `docs/project_notes/bugs.md` for similar issues
- Apply known solutions if found
- Document new bugs and solutions when resolved

**When looking up project configuration:**
- Check `docs/project_notes/key_facts.md` for credentials, ports, URLs, service accounts
- Prefer documented facts over assumptions

**When completing work on tickets:**
- Log completed work in `docs/project_notes/issues.md`
- Include ticket ID, date, brief description, and URL

**When user requests memory updates:**
- Update the appropriate memory file (bugs, decisions, key_facts, or issues)
- Follow the established format and style (bullet lists, dates, concise entries)

### Style Guidelines for Memory Files

- **Prefer bullet lists over tables** for simplicity and ease of editing
- **Keep entries concise** (1-3 lines for descriptions)
- **Always include dates** for temporal context
- **Include URLs** for tickets, documentation, monitoring dashboards
- **Manual cleanup** of old entries is expected (not automated)
```

### 3. Configure AGENTS.md - Multi-Tool Support

If the project has an `AGENTS.md` file (used for agent workflows or multi-tool projects), add the same memory protocols. This ensures consistency whether using Claude Code, Cursor, GitHub Copilot, or other AI tools.

**If AGENTS.md exists:** Add the same "Project Memory System" section as above.

**If AGENTS.md doesn't exist:** Ask the user if they want to create it. Many projects use multiple AI tools and benefit from shared memory protocols.

### 4. Searching Memory Files

When encountering problems or making decisions, proactively search memory files:

**Search bugs.md:**
```bash
# Look for similar errors
grep -i "connection refused" docs/project_notes/bugs.md

# Find bugs by date range
grep "2025-01" docs/project_notes/bugs.md
```

**Search decisions.md:**
```bash
# Check for decisions about a technology
grep -i "database" docs/project_notes/decisions.md

# Find all ADRs
grep "^### ADR-" docs/project_notes/decisions.md
```

**Search key_facts.md:**
```bash
# Find database connection info
grep -A 5 "Database" docs/project_notes/key_facts.md

# Look up service accounts
grep -i "service account" docs/project_notes/key_facts.md
```

**Use Grep tool for more complex searches:**
- Search across all memory files: `Grep(pattern="oauth", path="docs/project_notes/")`
- Context-aware search: `Grep(pattern="bug", path="docs/project_notes/bugs.md", -A=3, -B=3)`

### 5. Updating Memory Files

When the user requests updates or when documenting resolved issues, update the appropriate memory file:

**Adding a bug entry:**
```markdown
### YYYY-MM-DD - Brief Bug Description
- **Issue**: What went wrong
- **Root Cause**: Why it happened
- **Solution**: How it was fixed
- **Prevention**: How to avoid it in the future
```

**Adding a decision:**
```markdown
### ADR-XXX: Decision Title (YYYY-MM-DD)

**Context:**
- Why the decision was needed
- What problem it solves

**Decision:**
- What was chosen

**Alternatives Considered:**
- Option 1 -> Why rejected
- Option 2 -> Why rejected

**Consequences:**
- Benefits
- Trade-offs
```

**Adding key facts:**
- Organize by category (GCP Project, Database, API, Local Development, etc.)
- Use bullet lists for clarity
- Include both production and development details
- Add URLs for easy navigation
- See `references/key_facts_template.md` for security guidelines on what NOT to store

**Adding work log entry:**
```markdown
### YYYY-MM-DD - TICKET-ID: Brief Description
- **Status**: Completed / In Progress / Blocked
- **Description**: 1-2 line summary
- **URL**: https://jira.company.com/browse/TICKET-ID
- **Notes**: Any important context
```

### 6. Memory File Maintenance

**Periodically clean old entries:**
- User is responsible for manual cleanup (no automation)
- Remove very old bug entries (6+ months) that are no longer relevant
- Archive completed work from issues.md (3+ months old)
- Keep all decisions (they're lightweight and provide historical context)
- Update key_facts.md when project configuration changes

**Conflict resolution:**
- If proposing something that conflicts with decisions.md, explain why revisiting the decision is warranted
- Update the decision entry if the choice changes
- Add date of revision to show evolution

## Templates and References

This skill includes template files in `references/` that demonstrate proper formatting:

- **references/bugs_template.md** - Bug entry format with examples
- **references/decisions_template.md** - ADR format with examples
- **references/key_facts_template.md** - Key facts organization with examples (includes security guidelines)
- **references/issues_template.md** - Work log format with examples

When creating initial memory files, copy these templates to `docs/project_notes/` and customize them for the project.

## Example Workflows

### Scenario 1: Encountering a Familiar Bug

```
User: "I'm getting a 'connection refused' error from the database"
-> Search docs/project_notes/bugs.md for "connection"
-> Find previous solution: "Use AlloyDB Auth Proxy on port 5432"
-> Apply known fix
```

### Scenario 2: Proposing an Architectural Change

```
Internal: "User might benefit from using SQLAlchemy for migrations"
-> Check docs/project_notes/decisions.md
-> Find ADR-002: Already decided to use Alembic
-> Use Alembic instead, maintaining consistency
```

### Scenario 3: User Requests Memory Update

```
User: "Add that CORS fix to our bug log"
-> Read docs/project_notes/bugs.md
-> Add new entry with date, issue, solution, prevention
-> Confirm addition to user
```

### Scenario 4: Looking Up Project Configuration

```
Internal: "Need to connect to database"
-> Check docs/project_notes/key_facts.md
-> Find Database Configuration section
-> Use documented connection string and credentials
```

## Tips for Effective Memory Management

1. **Be proactive**: Check memory files before proposing solutions
2. **Be concise**: Keep entries brief (1-3 lines for descriptions)
3. **Be dated**: Always include dates for temporal context
4. **Be linked**: Include URLs to tickets, docs, monitoring dashboards
5. **Be selective**: Focus on recurring or instructive issues, not every bug

## Integration with Other Skills

The project-memory skill complements other skills:

- **requirements-documenter**: Requirements -> Decisions (ADRs reference requirements)
- **root-cause-debugger**: Bug diagnosis -> Bug log (document solutions after fixes)
- **code-quality-reviewer**: Quality issues -> Decisions (document quality standards)
- **docs-sync-editor**: Code changes -> Key facts (update when config changes)

When using these skills together, consider updating memory files as a follow-up action.

## Success Criteria

This skill is successfully deployed when:

- `docs/project_notes/` directory exists with all four memory files
- CLAUDE.md includes "Project Memory System" section with protocols
- AGENTS.md includes the same protocols (if file exists or user requested)
- Memory files follow template format and style guidelines
- AI assistant checks memory files before proposing changes
- User can easily request memory updates ("add this to bugs.md")
- Memory files look like standard engineering documentation, not AI artifacts

## Personalization Layer - Waldo Integration

The project-memory skill includes an optional personalization layer that integrates with the Waldo agent to provide a conversational, plan-oriented experience. This layer is completely optional and backward-compatible - the core skill functionality works identically with or without personalization.

### Overview

When the project-memory skill is activated with personalization enabled, it:

1. **First-time activation**: Detects that this is a new setup, performs core configuration, then invokes Waldo to greet the user and help create a project plan
2. **Subsequent activations**: Detects existing setup, invokes Waldo to check project plan status and enter plan mode for the session
3. **State tracking**: Maintains a lightweight state file to track initialization status and plan progress
4. **Agent configuration**: Adds Waldo-specific instructions to AGENTS.md to ensure consistent behavior

This creates a more conversational, plan-driven project experience while preserving all core memory functionality.

### Detecting First-Time Activation

The personalization layer determines first-time vs subsequent activation by checking for the state file:

**State file location:** `docs/project_notes/.project-memory-state.json`

**Detection logic:**
```
IF file does NOT exist:
  -> First-time activation (proceed with full setup + Waldo greeting)
ELSE:
  -> Subsequent activation (check plan status + enter plan mode)
```

The state file is stored in `docs/project_notes/` alongside other memory files to keep all project memory artifacts in one location. The leading dot (`.`) makes it hidden from casual directory listings while remaining accessible.

### First-Time Activation Workflow

When the skill is invoked for the first time in a project (state file does not exist), execute these steps in order:

**Step 1: Core Setup**
- Create `docs/project_notes/` directory structure
- Initialize all four memory files (bugs.md, decisions.md, key_facts.md, issues.md)
- Configure CLAUDE.md with memory-aware protocols

**Step 2: Add Waldo Protocol to AGENTS.md**
- If AGENTS.md exists, add the "Waldo Planning Protocol" section (see template below)
- If AGENTS.md doesn't exist, create it with the Waldo protocol
- This ensures Waldo knows to operate in plan mode when project-memory is active

**Step 3: Create State File**
- Write `docs/project_notes/.project-memory-state.json` with initial state:
```json
{
  "initialized": true,
  "version": "1.0",
  "personalization": {
    "waldo_greeted": false,
    "plan_created": false,
    "plan_status": "none",
    "plan_file": "docs/project_notes/project_plan.md"
  }
}
```

**Step 4: Waldo Greeting**
- Invoke Waldo agent with a warm, conversational greeting
- Example greeting: "Hey! I'm Waldo, your project planning assistant. I noticed we just set up the project memory system - that's great! To help us stay organized, I'd love to create a project plan with you. This will help track what we're building, what's done, and what's next. Want to get started? I can ask you a few quick questions about the project, or if you prefer, we can skip this for now and focus on other work."
- Waldo should be friendly but not pushy - allow user to decline or defer

**Step 5: Create Project Plan (if user agrees)**
- Waldo asks about project goals, current status, immediate priorities
- Creates `docs/project_notes/project_plan.md` with structured plan
- Updates state file: `plan_created: true`, `plan_status: "planned"`
- State file update example:
```json
{
  "initialized": true,
  "version": "1.0",
  "personalization": {
    "waldo_greeted": true,
    "plan_created": true,
    "plan_status": "planned",
    "plan_file": "docs/project_notes/project_plan.md"
  }
}
```

**Step 6: Enter Plan Mode**
- Waldo transitions to plan mode for the remainder of the session
- Monitors plan status, updates as work progresses
- References plan when discussing priorities or next steps

### Subsequent Activation Workflow

When the skill is invoked in a project where setup already exists (state file found), execute these steps:

**Step 1: Read State File**
- Load `docs/project_notes/.project-memory-state.json`
- Determine current plan status: "none" | "planned" | "implementing" | "complete"

**Step 2: Waldo Status Check**
- Invoke Waldo to check in on project status
- Waldo behavior depends on plan_status:
  - **"none"**: Offer to create a plan (same as first-time, step 5)
  - **"planned"**: "Welcome back! We have a project plan ready. Let me check our status and see what's next."
  - **"implementing"**: "Hey! We're making progress on the plan. Let me see where we left off and what's coming up."
  - **"complete"**: "Hi! Looks like we completed the previous plan. Ready to start a new phase or project?"

**Step 3: Load Project Plan**
- If plan exists, read `docs/project_notes/project_plan.md`
- Waldo summarizes current status (what's done, what's in progress, what's next)
- Example: "Last time we were working on setting up the API endpoints. I see we completed the user authentication endpoint. Ready to tackle the profile endpoint next, or something else?"

**Step 4: Enter Plan Mode**
- Waldo operates in plan mode for the session
- References plan for context and priorities
- Updates plan status as work progresses

**Step 5: Update State File (as needed)**
- When plan status changes (e.g., from "planned" to "implementing"), update state file
- Example transition: User completes first task → update to "implementing"

### State File Schema

The state file (`docs/project_notes/.project-memory-state.json`) uses this schema:

```json
{
  "initialized": true,
  "version": "1.0",
  "personalization": {
    "waldo_greeted": false,
    "plan_created": false,
    "plan_status": "none",
    "plan_file": "docs/project_notes/project_plan.md"
  }
}
```

**Field descriptions:**

- `initialized` (boolean): Always `true` once state file is created; indicates project-memory has been set up
- `version` (string): Schema version for future compatibility; currently "1.0"
- `personalization` (object): Personalization layer state
  - `waldo_greeted` (boolean): Whether Waldo has greeted the user on first activation
  - `plan_created` (boolean): Whether a project plan has been created
  - `plan_status` (string): Current plan status
    - `"none"` - No plan created yet
    - `"planned"` - Plan created but work not started
    - `"implementing"` - Actively working on plan tasks
    - `"complete"` - Plan completed
  - `plan_file` (string): Relative path to project plan file

**State transitions:**

```
"none" → "planned" (when plan is created)
"planned" → "implementing" (when first task starts)
"implementing" → "complete" (when all tasks done)
"complete" → "planned" (when new plan created)
```

**Security note:** The state file contains only metadata and status information. It should NEVER contain sensitive data (passwords, API keys, credentials). The file is safe to commit to version control.

### AGENTS.md Template Addition

When configuring AGENTS.md (either creating new or updating existing), add this section to enable Waldo planning protocol:

```markdown
## Waldo Planning Protocol

This project uses the Waldo agent for conversational project planning and progress tracking.

### Activation Trigger

When project-memory skill is active (indicated by `docs/project_notes/` directory existing), Waldo should:

1. **First time**: Check for `.project-memory-state.json` in `docs/project_notes/`
   - If NOT found: Greet user warmly, offer to create project plan
   - Create state file after greeting
   - Create `project_plan.md` if user agrees

2. **Subsequent times**: Check state file for plan status
   - Load existing plan from `docs/project_notes/project_plan.md`
   - Summarize current status (what's done, what's next)
   - Enter plan mode for the session

### Plan Mode Behavior

When in plan mode, Waldo should:

- Reference the project plan when discussing priorities
- Update plan status as tasks are completed
- Offer to add new tasks or adjust priorities as needed
- Keep plan synchronized with actual work progress
- Update `.project-memory-state.json` when plan status changes

### Tone and Style

- **Conversational**: Use friendly, natural language ("Hey!" "Let's..." "Ready to...")
- **Not pushy**: Allow user to decline or defer plan creation
- **Status-aware**: Acknowledge progress and celebrate completions
- **Context-rich**: Reference recent work and upcoming tasks

### Integration with Memory Files

Waldo should coordinate plan with memory files:

- Log completed work in `issues.md` as tasks finish
- Reference architectural decisions from `decisions.md` when planning
- Check `bugs.md` for known issues that might affect timeline
- Update `key_facts.md` with new configuration as it's created
```

**Where to add this section:**
- If AGENTS.md already has sections for other agents, add after those sections
- If AGENTS.md is new, this can be the first agent-specific section after any general project setup
- Place before or after "Project Memory System" section (either order works)

### Backward Compatibility

The personalization layer is designed to be completely optional and non-breaking:

**Core skill works without personalization:**
- If `.project-memory-state.json` is not created, skill functions normally
- All core memory files (bugs.md, decisions.md, key_facts.md, issues.md) work independently
- CLAUDE.md configuration applies regardless of personalization state
- Memory-aware protocols function with or without Waldo integration

**Opting out of personalization:**
- Simply don't create the state file during setup
- Skip the Waldo greeting and plan creation steps
- Use project-memory as a pure memory system without planning layer

**Manual state management:**
- State file can be edited manually if needed
- Delete state file to "reset" personalization (core files remain intact)
- Plan status can be updated directly in JSON if automatic tracking fails

### Example: First-Time Activation with Personalization

```
User: "Set up project memory for this codebase"

AI: *Creates docs/project_notes/ directory*
AI: *Initializes bugs.md, decisions.md, key_facts.md, issues.md*
AI: *Configures CLAUDE.md with memory-aware protocols*
AI: *Adds Waldo Planning Protocol to AGENTS.md*
AI: *Creates .project-memory-state.json with initial state*

AI: "Project memory is all set up! You now have:
     - docs/project_notes/bugs.md - Bug tracking
     - docs/project_notes/decisions.md - Architectural decisions
     - docs/project_notes/key_facts.md - Project configuration
     - docs/project_notes/issues.md - Work log

     CLAUDE.md and AGENTS.md have been configured for memory-aware behavior."

Waldo: "Hey! I'm Waldo, your project planning assistant. I noticed we just set up
        the project memory system - that's great! To help us stay organized, I'd
        love to create a project plan with you. This will help track what we're
        building, what's done, and what's next. Want to get started?"

User: "Sure, let's create a plan"

Waldo: "Awesome! Let me ask you a few questions:
        1. What's the main goal of this project?
        2. What have you already built or started?
        3. What are your immediate priorities (next 1-2 weeks)?"

User: *Answers questions*

Waldo: *Creates docs/project_notes/project_plan.md with structured plan*
Waldo: *Updates .project-memory-state.json: plan_created=true, plan_status="planned"*

Waldo: "Perfect! I've created a project plan at docs/project_notes/project_plan.md.
        I'll keep track of our progress and check in as we complete tasks. Ready to
        get started on the first item?"
```

### Example: Subsequent Activation with Plan in Progress

```
User: "Invoke project memory"

AI: *Checks for docs/project_notes/ - exists*
AI: *Reads .project-memory-state.json - plan_status: "implementing"*

Waldo: "Hey! Welcome back. We're making progress on the plan. Let me check where
        we left off..."

Waldo: *Reads docs/project_notes/project_plan.md*

Waldo: "Looks like we completed the user authentication endpoint last time. The next
        task on our plan is implementing the profile endpoint. I see we also have the
        password reset flow coming up after that. Ready to tackle the profile endpoint,
        or would you like to work on something else?"

User: "Let's do the profile endpoint"

Waldo: "Great! I'll keep the plan updated as we go. Let me know when you're ready
        for the next task or if priorities change."
```

### Example: Opting Out of Personalization

```
User: "Set up project memory, but I don't want the planning features"

AI: *Creates docs/project_notes/ directory*
AI: *Initializes bugs.md, decisions.md, key_facts.md, issues.md*
AI: *Configures CLAUDE.md with memory-aware protocols*
AI: *Adds basic memory protocols to AGENTS.md (without Waldo section)*
AI: *Does NOT create .project-memory-state.json*

AI: "Project memory is set up! The memory files are ready to use:
     - docs/project_notes/bugs.md
     - docs/project_notes/decisions.md
     - docs/project_notes/key_facts.md
     - docs/project_notes/issues.md

     Memory-aware protocols are configured in CLAUDE.md and AGENTS.md.
     Personalization/planning features are disabled."
```
