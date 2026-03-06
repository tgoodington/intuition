# Intuition v2 - Project Context Document

**Version:** 2.0 | **Last Updated:** February 2025 | **Status:** Production

## What is Intuition?

Intuition is a five-skill system for Claude Code that orchestrates software development through structured discovery, planning, and execution phases. It's a **plugin**, not a CLI tool or JavaScript library. When installed via `npm install -g intuition`, it deploys five skills to `~/.claude/skills/` that enhance Claude Code's capabilities for complex projects.

### Critical: Intuition is NOT a CLI

`bin/intuition.js` in the repository is **development testing only**. In production, users invoke skills via Claude Code:
- `/intuition-start` - Load context and suggest next steps
- `/intuition-discovery` - Learn through dialogue (Waldo)
- `/intuition-handoff` - Process phase outputs and brief next agent
- `/intuition-plan` - Create structured plans (Magellan)
- `/intuition-execute` - Implement coordinated work (Faraday)

There is no CLI invocation. No shell scripts run during normal use. The plugin works entirely through Claude Code's skill system.

## The Five Skills

### 1. `/intuition-start` - Session Primer
**Role:** Load project context at session start

Detects which phase is active (discovery/planning/execution), loads project memory files, and generates phase-appropriate briefs. Tells users where they are and what to do next.

**When:** First thing at the start of each session
**Output:** Phase summary, next recommended step

### 2. `/intuition-discovery` - Waldo (Learner)
**Role:** Deep problem understanding through dialogue

Waldo engages in genuine conversation to understand problems, goals, users, and motivations. Not interrogation—collaborative thinking. Asks better questions by researching quietly.

**When:** Starting new features or exploring complex problems
**Output:** `discovery_brief.md`, `discovery_output.json`

### 3. `/intuition-handoff` - Orchestrator (Conductor)
**Role:** Phase transition coordinator

Processes phase outputs, extracts insights, updates project memory files with proper formatting, and generates fresh briefs for the next agent. Maintains consistency and flow.

**When:** After discovery completes (before planning), after planning completes (before execution)
**Output:** Updated memory, new brief, state transitions

### 4. `/intuition-plan` - Magellan (Strategist)
**Role:** Strategic planning and synthesis

Researches the codebase, identifies patterns, and creates detailed structured plans with tasks, dependencies, risks, and confidence scores.

**When:** After discovery handoff, ready to design approach
**Output:** `plan.md`

### 5. `/intuition-execute` - Faraday (Implementer)
**Role:** Methodical implementation

Breaks plans into concrete tasks, delegates to sub-agents, monitors progress, and ensures quality. Coordinates parallel work and handles failures gracefully.

**When:** Plan approved and ready to implement
**Output:** Implemented features, updated memory, completion report

## The Complete Workflow

```
/intuition-start (Load context)
    ↓
/intuition-discovery (Waldo explores with user)
    → discovery_brief.md, discovery_output.json
    ↓
/intuition-handoff (Extract insights, update memory)
    → Updated key_facts.md, decisions.md, issues.md
    → planning_brief.md
    ↓
/intuition-plan (Magellan synthesizes into plan)
    → plan.md (user reviews and approves)
    ↓
/intuition-handoff (Prepare for execution)
    → execution_brief.md
    ↓
/intuition-execute (Faraday implements)
    → Completed work, updated memory

→ /intuition-discovery (Start new feature iteration)
```

**Recommended:** Always run `/intuition-start` at the beginning of a session. It will tell you which step to take next.

## Key Design Principles

### 1. Symphony Model
Five distinct roles, each focused on one phase. They don't overlap—Waldo doesn't plan, Magellan doesn't execute. Clean separation of concerns makes each agent excellent at its specific job.

### 2. Memory Authority
Memory files are the single source of truth:
- `bugs.md` - Problem-solution pairs, maintained by all
- `decisions.md` - Architectural choices (ADRs), created during discovery/planning
- `key_facts.md` - Project configuration, discovered during discovery
- `issues.md` - Work history, maintained by all
- `.project-memory-state.json` - Workflow state, maintained by start and handoff skills

Each skill reads from memory before starting. Each skill updates memory appropriately. Memory is never stale because every agent maintains it.

### 3. Clean Context
Each phase gets exactly what it needs—no noise. Waldo doesn't see the plan, Magellan doesn't execute. The handoff skill bridges phases by providing fresh, focused context briefs.

### 4. File-Based Handoffs
No API calls between skills. No JSON payloads passed through parameters. Handoffs happen entirely through files:
- Discovery writes `discovery_brief.md` + `discovery_output.json`
- Handoff reads those files, extracts insights, writes `planning_brief.md`
- Magellan reads `planning_brief.md` and existing memory
- Magellan writes `plan.md`
- Handoff reads `plan.md`, writes `execution_brief.md`
- Faraday reads `execution_brief.md` and existing memory

This design is:
- **Resumable:** Stop anytime, resume anytime. Files persist.
- **Auditable:** Entire history is readable.
- **Tool-agnostic:** Works with Claude Code, Cursor, GitHub Copilot, or any Claude integration.
- **Transparent:** Users see exactly what each phase produces.

## File Structure

```
docs/
├── project_notes/
│   ├── bugs.md                        # Bug log with solutions
│   ├── decisions.md                   # Architectural Decision Records
│   ├── key_facts.md                   # Project configuration & constants
│   ├── issues.md                      # Work history
│   ├── .project-memory-state.json     # Workflow state
│   ├── discovery_brief.md             # Discovery output (Waldo)
│   ├── discovery_output.json          # Structured findings (Waldo)
│   ├── planning_brief.md              # Brief for planning (Handoff)
│   ├── plan.md                        # Plan output (Magellan)
│   └── execution_brief.md             # Brief for execution (Handoff)
└── [other project documentation]

.claude/
├── settings.local.json                # Claude Code tool permissions
├── CLAUDE.md                          # Memory-aware protocols for Claude
└── AGENTS.md                          # Multi-agent system config

[project root]/
├── README.md
├── [source code, tests, etc.]
└── [standard project files]
```

## State Management (v2.0)

The `.project-memory-state.json` file tracks workflow progression:

```json
{
  "initialized": true,
  "version": "2.0",
  "workflow": {
    "status": "discovery|planning|executing|complete",
    "discovery": {
      "started": false,
      "started_at": null,
      "completed": false,
      "completed_at": null,
      "output_files": [],
      "resume_data": null
    },
    "planning": {
      "started": false,
      "started_at": null,
      "completed": false,
      "completed_at": null,
      "output_files": [],
      "approved": false,
      "approved_at": null,
      "resume_data": null
    },
    "execution": {
      "started": false,
      "started_at": null,
      "completed": false,
      "completed_at": null,
      "output_files": [],
      "tasks_completed": 0,
      "tasks_total": 0,
      "resume_data": null
    }
  },
  "agents": {
    "waldo": { "greeted": false },
    "magellan": { "greeted": false },
    "faraday": { "greeted": false }
  },
  "history": {
    "discovery_revisions": 0,
    "planning_revisions": 0,
    "last_activity": null
  }
}
```

The handoff skill updates this after each phase.

## Memory Authority Rules

**Only the appropriate skill modifies each type of memory:**

| File | Who Creates | Who Updates | What It Tracks |
|------|-------------|------------|-----------------|
| `bugs.md` | /intuition-initialize (template) | Any skill | Problems found, solutions applied |
| `decisions.md` | /intuition-initialize (template) | Handoff, skills | Architectural choices (ADRs) |
| `key_facts.md` | /intuition-initialize (template) | Handoff, Discovery | Project config, discovered facts |
| `issues.md` | /intuition-initialize (template) | Any skill | Work history and progress |
| `.project-memory-state.json` | /intuition-initialize | /intuition-start, /intuition-handoff | Workflow phase and state |
| `discovery_brief.md` | /intuition-discovery | Only Waldo | Discovery synthesis |
| `discovery_output.json` | /intuition-discovery | Only Waldo | Structured findings |
| `planning_brief.md` | /intuition-handoff | Only Handoff | Context prepared for planning |
| `plan.md` | /intuition-plan | Only Magellan | Detailed plan and tasks |
| `execution_brief.md` | /intuition-handoff | Only Handoff | Context prepared for execution |

**The rule:** Respect existing entries. Never delete or overwrite entries from previous sessions without explicit user consent. Append, never replace.

## How Skills Interact

### Skill → Skill Data Flow

```
Discovery
  ├─ Reads: Existing memory files for context
  ├─ Writes: discovery_brief.md, discovery_output.json
  └─ Expects: User conversation

Discovery → Handoff
  ├─ Handoff reads: discovery_brief.md, discovery_output.json
  ├─ Handoff writes: planning_brief.md, updated memory
  └─ Expected: Insights extracted, memory updated

Handoff → Planning
  ├─ Planning reads: planning_brief.md, existing memory
  ├─ Planning writes: plan.md
  └─ Expected: Structured plan ready for user review

Planning → Handoff
  ├─ Handoff reads: plan.md
  ├─ Handoff writes: execution_brief.md, updated memory
  └─ Expected: Context ready for execution

Handoff → Execution
  ├─ Execution reads: execution_brief.md, existing memory
  ├─ Execution writes: Implementation, updated memory
  └─ Expected: Tasks completed, work done
```

### Resume Support (Resumption Through Skills)

Each skill reads the state file first:

1. `/intuition-start` - "Where are we in the workflow?"
2. Discovery - "Was this started? Resume if interrupted"
3. Handoff - "Which transition are we making?"
4. Planning - "Was this started? Resume if interrupted"
5. Execution - "Continue where we left off"

Users can stop anytime and resume—the state file preserves progress.

## What NOT to Assume (Important Gotchas)

### ❌ Don't assume CLI invocation is supported
Intuition works via Claude Code skills, not shell commands. `bin/intuition.js` is development only.

### ❌ Don't modify `plan.md` or `execute.md` directly
These are outputs from Magellan and Faraday respectively. Editing them won't affect the skills' behavior. If you need changes, run the skill again and it will update.

### ❌ Don't modify `discovery_brief_template.md`
This is a frozen reference. The actual output is `discovery_brief.md` (without "template").

### ❌ Don't assume all skills write to every memory file
Only the appropriate skill writes to each file. Handoff is the exception—it updates multiple files during transitions. Check the Memory Authority table above.

### ❌ Don't assume skills cache information
Each skill starts fresh and reads from files. Memory files are the source of truth, not skill-local state.

### ❌ Don't assume Waldo will plan
Waldo's only job is discovery. Planning is Magellan's job. If you want planning, run `/intuition-plan`, not `/intuition-discovery` again.

### ❌ Don't assume Magellan will execute
Magellan creates a plan. Execution is Faraday's job. The handoff in between ensures Faraday gets proper context.

## Installation and Setup

See `INSTALLATION.md` in the root for detailed setup instructions. Quick version:

```bash
npm install -g intuition
cd your-project
/intuition-initialize        # Set up project memory
/intuition-start             # Load context and suggest next step
```

Then follow the skill suggestions from `/intuition-start`.

## Future Sessions: Use `/intuition-start`

Every session should start with:

```
/intuition-start
```

It will:
1. Load your project's memory and workflow state
2. Detect which phase you're in
3. Generate a fresh context brief for that phase
4. Suggest the next skill to run

Then run the suggested skill. Repeat.

## Key Files in This Repo

### For Users
- `README.md` - Overview and quick start
- `INSTALLATION.md` - Detailed setup instructions
- `docs/intuition-workflow.md` - Detailed workflow explanation
- `docs/intuition-architecture.md` - System design and philosophy

### For Developers
- `skills/intuition-*/SKILL.md` - Skill interface documents
- `skills/intuition-*/references/` - Implementation guides
- `.claude-plugin/` - Plugin metadata
- `scripts/install-skills.js` - Installation script
- `bin/intuition.js` - Development testing only

### For Project Memory
- `docs/project_notes/` - Created by `/intuition-initialize` in each project

## Getting Help

- Check `docs/intuition-workflow.md` for detailed workflow steps
- Check `docs/intuition-architecture.md` for system design questions
- Run `/intuition-start` in any project to get oriented
- Read skill-specific docs in `skills/[skill-name]/SKILL.md`
- See implementation guides in `skills/[skill-name]/references/`

## Version History

**v2.0** (Current)
- Five-skill system (Start, Discovery/Waldo, Handoff, Planning/Magellan, Execution/Faraday)
- Explicit handoff phases between discovery→planning and planning→execution
- File-based handoffs with structured briefs
- Updated state schema with started/started_at/output_files fields
- New brief templates (planning_brief.md, execution_brief.md, discovery_output.json)
- Discovery and handoff skills are new

**v1.0** (Legacy)
- Three skills (Discovery/Waldo, Planning/Magellan, Execution/Faraday)
- Direct skill-to-skill transitions
- No explicit handoff phase
- Simpler state tracking

---

**Last updated:** February 2025 | **Maintained by:** Intuition Contributors
