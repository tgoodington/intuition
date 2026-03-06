# Intuition Architecture

This document describes the technical architecture of the Intuition three-agent system.

## System Overview

Intuition is a skill-based system for Claude Code that implements a three-phase workflow for software development:

```
Discovery → Planning → Execution
 (Waldo)   (Magellan)  (Faraday)
```

Each phase is handled by a specialized agent with focused responsibilities, connected through file-based handoffs in project memory.

## Design Principles

### 1. Separation of Concerns
Each agent has a single, focused responsibility:
- Waldo: Discovery and dialogue
- Magellan: Research and planning
- Faraday: Orchestration and execution

### 2. Clean Context
By separating phases, each agent starts with clean, focused context:
- Waldo only holds dialogue state
- Magellan reads synthesis from files
- Faraday reads plans from files

### 3. File-Based Handoffs
Agents communicate through project memory files, not conversation context:
- `discovery_brief.md` - Waldo → Magellan
- `plan.md` - Magellan → Faraday
- `state.json` - Workflow coordination

### 4. Resume Support
All agents can resume interrupted work by reading state from project memory.

## Skill Structure

```
skills/
├── intuition-start/
│   └── SKILL.md              # Context loader, workflow status
├── intuition-initialize/
│   ├── SKILL.md              # Project memory setup
│   └── references/
│       └── state_template.json
├── intuition-discovery/
│   ├── SKILL.md              # Waldo's interface
│   └── references/
│       ├── waldo_core.md     # GAPP methodology
│       └── templates/
│           └── discovery_brief_template.md
├── intuition-plan/
│   ├── SKILL.md              # Magellan's interface
│   └── references/
│       ├── magellan_core.md  # Planning methodology
│       └── templates/
│           └── plan_template.md
└── intuition-execute/
    ├── SKILL.md              # Faraday's interface
    └── references/
        └── faraday_core.md   # Execution methodology
```

## State Management

### State File Location
`docs/project_notes/.project-memory-state.json`

### State Schema (v2.0)

```json
{
  "initialized": true,
  "version": "2.0",

  "workflow": {
    "status": "none|discovery|planning|executing|complete",

    "discovery": {
      "completed": false,
      "completed_at": null,
      "brief_file": "docs/project_notes/discovery_brief.md",
      "resume_data": null
    },

    "planning": {
      "completed": false,
      "completed_at": null,
      "plan_file": "docs/project_notes/plan.md",
      "approved": false,
      "approved_at": null,
      "resume_data": null
    },

    "execution": {
      "started": false,
      "started_at": null,
      "completed": false,
      "completed_at": null,
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

### State Transitions

```
none → discovery (when /intuition-discovery starts)
discovery → planning (when discovery completes)
planning → executing (when plan is approved)
executing → complete (when execution finishes)
complete → discovery (when new workflow starts)
```

## Data Flow

### Discovery Phase (Waldo)

**Input:**
- User dialogue
- (Optional) Existing project memory

**Process:**
1. GAPP dialogue (Problem → Goals → UX Context → Personalization)
2. Clarifying questions
3. Synthesize into discovery brief

**Output:**
- `docs/project_notes/discovery_brief.md`
- Updated `state.json` (workflow.status = "discovery", discovery.completed = true)

### Planning Phase (Magellan)

**Input:**
- `docs/project_notes/discovery_brief.md`
- Codebase (via Research agents)

**Process:**
1. Read discovery brief
2. Assess scope (auto-detect planning depth)
3. Launch parallel Research agents
4. Synthesize plan
5. Present for user approval

**Output:**
- `docs/project_notes/plan.md`
- Updated `state.json` (workflow.status = "planning", planning.approved = true)

### Execution Phase (Faraday)

**Input:**
- `docs/project_notes/plan.md`
- `docs/project_notes/discovery_brief.md`
- Codebase

**Process:**
1. Read plan and discovery context
2. Confirm with user
3. Create tasks from plan
4. Delegate to sub-agents (parallel when possible)
5. Verify outputs
6. Update project memory

**Output:**
- Implemented code changes
- Updated project memory (bugs.md, decisions.md, etc.)
- Updated `state.json` (workflow.status = "complete")

## Sub-Agent Architecture

### Available Sub-Agents

| Agent | Used By | Purpose |
|-------|---------|---------|
| Research | Waldo, Magellan | Explore codebase |
| Security Expert | Magellan, Faraday | Security review |
| Code Writer | Faraday | Implementation |
| Test Runner | Faraday | Testing |
| Code Reviewer | Faraday | Quality review |
| Documentation | Faraday | Doc updates |
| Technical Spec Writer | Faraday | Specifications |
| Communications Specialist | Faraday | User-facing docs |

### Parallel Execution

Both Magellan and Faraday can run sub-agents in parallel:

```
Magellan (Planning):
├── Research Agent 1: Authentication patterns
├── Research Agent 2: Database schema
└── Research Agent 3: API routing
    ↓ (all complete)
    Synthesize findings

Faraday (Execution):
├── Code Writer 1: User model
├── Code Writer 2: Product model
└── Code Writer 3: Order model
    ↓ (all complete)
    Verify each independently
```

## File Formats

### discovery_brief.md

```markdown
# Discovery Brief

## Problem
[Core challenge and context]

## Goals
[Success criteria]

## User Context
[Personas and workflows]

## Personalization / Motivation
[What drives this work]

## Scope
[In scope / out of scope]

## Assumptions
[With confidence levels]
```

### plan.md

```markdown
# Plan: [Title]

## Objective
[What will be accomplished]

## Discovery Summary
[Key insights from Waldo]

## Research Context
[Codebase findings]

## Approach
[Strategy and rationale]

## Tasks
[With acceptance criteria, dependencies]

## Risks & Mitigations
[Identified risks]

## Execution Notes for Faraday
[Guidance for execution]
```

## Resume Mechanism

Each agent stores resume data in `state.json`:

**Waldo:**
- Current GAPP phase
- Key insights captured
- Open questions

**Magellan:**
- Research completed
- Draft progress
- Current synthesis state

**Faraday:**
- Tasks completed
- Current task
- Checkpoint reached

On resume, agents read their resume_data and continue from last checkpoint.

## Discovery Revision Flow

When discovery is revised:

1. User runs `/intuition-discovery` again
2. Waldo updates `discovery_brief.md`
3. State tracks revision: `history.discovery_revisions++`
4. Magellan detects timestamp change
5. Magellan offers to re-plan
6. If yes, new plan created; old plan archived

## Error Handling

### Workflow Validation
Each skill validates workflow state before proceeding:
- Magellan requires discovery to be complete
- Faraday requires plan to be approved

### Graceful Degradation
If state.json is missing or corrupted:
- Skills fall back to checking for file existence
- User prompted to re-initialize if needed

### Sub-Agent Failures
Faraday handles sub-agent failures with:
1. Retry with additional context
2. Decompose into smaller tasks
3. Escalate to user

## Security Considerations

- Security Expert review is MANDATORY before any commit
- No skipping or bypassing security gates
- Faraday verifies security review before completing execution

## Extension Points

### Adding New Sub-Agents
1. Document in each skill's sub_agents.md
2. Add delegation patterns to core reference
3. Update SKILL.md with agent description

### Adding New Workflow Phases
1. Add state tracking in state_template.json
2. Create new skill directory
3. Update intuition-start for status detection
4. Document handoff files and formats
