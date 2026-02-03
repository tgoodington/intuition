# Intuition v2

A five-skill orchestration system for software development. Intuition coordinates discovery, planning, and execution through a symphony of specialized agents, with explicit handoff phases maintaining clean context and memory consistency.

**The Five Skills:**
1. **`/intuition-start`** - Session primer (load context, detect phase, suggest next step)
2. **`/intuition-discovery`** - Waldo (explore problems through GAPP and Socratic dialogue)
3. **`/intuition-handoff`** - Orchestrator (extract insights, update memory, brief next agent)
4. **`/intuition-plan`** - Magellan (synthesize discovery into structured executable plans)
5. **`/intuition-execute`** - Faraday (orchestrate implementation with methodical precision)

**Also includes:**
- `/intuition-initialize` - Setup project memory system

## Quick Start

```bash
# Install globally
npm install -g intuition

# In Claude Code, typical workflow:
/intuition-start            # Load context and check workflow status
/intuition-discovery        # Waldo guides discovery (GAPP dialogue)
/intuition-handoff          # Extract insights, brief planner
/intuition-plan             # Magellan creates structured plan
/intuition-handoff          # Prepare execution context
/intuition-execute          # Faraday orchestrates implementation
```

**Key Point:** Always start with `/intuition-start` — it will tell you which step to take next.

## Why Five Skills?

Each skill has a focused responsibility:

| Skill | Role | Phase | Input | Output | Focus |
|-------|------|-------|-------|--------|-------|
| `/intuition-start` | Primer | Any | State file | Context brief + suggestion | Navigation |
| `/intuition-discovery` | Waldo | Discovery | Problem description | `discovery_brief.md`, `discovery_output.json` | Understanding & dialogue |
| `/intuition-handoff` | Orchestrator | Transition | Phase output | Updated memory + brief | Context bridging |
| `/intuition-plan` | Magellan | Planning | `planning_brief.md` | `plan.md` | Strategy & synthesis |
| `/intuition-execute` | Faraday | Execution | `execution_brief.md` | Code + memory | Implementation |

By splitting into five phases with explicit handoffs:
- **Clean context** - Each skill gets exactly what it needs, nothing more
- **Memory consistency** - Handoff maintains project memory across phases
- **Higher success rate** - Less context bloat, better focus
- **Resume support** - Interrupted work picks up from last checkpoint
- **Transparency** - Every phase produces readable, auditable outputs

## The Five-Phase Workflow

### Phase 1: Discovery with Waldo

Explore your problem deeply using the GAPP framework:

```
/intuition-discovery
```

Waldo guides you through genuine dialogue covering:
- **Problem** - What's the core challenge?
- **Goals** - What does success look like?
- **UX Context** - Who will use this and how?
- **Personalization** - What drives this work for you?

**Output:** `docs/project_notes/discovery_brief.md` + `discovery_output.json`

Uses Socratic questioning and systems thinking to surface authentic intentions.

### Phase 1.5: Discovery → Planning Handoff

Process discovery and prepare for planning:

```
/intuition-handoff
```

The orchestrator:
1. Reads your discovery output
2. Extracts key facts, decisions, constraints
3. Updates project memory files
4. Generates `planning_brief.md` for Magellan
5. Updates workflow state

**Output:** Updated memory + fresh planning context

### Phase 2: Planning with Magellan

Create a structured plan from discovery:

```
/intuition-plan
```

Magellan:
1. Reads your planning brief and memory
2. Researches your codebase
3. Synthesizes insights into a strategic plan
4. Detects planning depth (simple vs. complex)
5. Presents plan for your approval

**Output:** `docs/project_notes/plan.md`

Includes tasks with acceptance criteria, dependencies, risks, and execution notes.

### Phase 2.5: Planning → Execution Handoff

Process plan and prepare for execution:

```
/intuition-handoff
```

The orchestrator:
1. Reads your plan
2. Extracts task structure and risks
3. Updates project memory with planning outcomes
4. Generates `execution_brief.md` for Faraday
5. Updates workflow state

**Output:** Updated memory + fresh execution context

### Phase 3: Execution with Faraday

Execute the approved plan:

```
/intuition-execute
```

Faraday:
1. Reads execution brief and memory
2. Confirms approach with you
3. Delegates to specialized sub-agents
4. Verifies outputs against acceptance criteria
5. Updates project memory
6. Reports completion

**Output:** Implemented code + updated project memory

## Project Memory System

Intuition maintains persistent project knowledge:

```
docs/project_notes/
├── .project-memory-state.json    (workflow status & resume data)
├── discovery_brief.md            (from Waldo)
├── plan.md                       (from Magellan)
├── bugs.md                       (known issues & solutions)
├── decisions.md                  (architectural decisions)
├── key_facts.md                  (project configuration)
└── issues.md                     (work log)
```

All three agents reference and update project memory for consistency.

## Workflow Status

Check where you are in the workflow:

```
/intuition-start
```

Returns current status:
- **Discovery:** In progress / Complete
- **Planning:** In progress / Complete / Approved
- **Execution:** In progress / Complete

Also provides helpful next-step suggestions.

## File Outputs

### discovery_brief.md (From Waldo)

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

### plan.md (From Magellan)

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

## Resume Support

All three agents can resume interrupted work:

- **Waldo** resumes from the last GAPP phase
- **Magellan** resumes from research or draft state
- **Faraday** resumes from the last completed task

Just run the skill again and it will pick up from the checkpoint.

## Discovery Revision

If you need to revise your discovery:

1. Run `/intuition-discovery` again
2. Waldo updates `discovery_brief.md`
3. Magellan detects the change and offers to re-plan
4. New plan created with updated context

## Installation

### Install Globally (Recommended)

```bash
npm install -g @tgoodington/intuition
```

This installs five skills globally to `~/.claude/skills/`:
- `/intuition-start` - Load project context
- `/intuition-initialize` - Setup project memory
- `/intuition-discovery` - Waldo's discovery
- `/intuition-plan` - Magellan's planning
- `/intuition-execute` - Faraday's execution

### Install from Source (Development)

```bash
cd intuition
npm install -g .
```

### Verify Installation

In Claude Code, type `/` to see available skills. You should see all five:
- `/intuition-start`
- `/intuition-initialize`
- `/intuition-discovery`
- `/intuition-plan`
- `/intuition-execute`

## Skills Reference

### `/intuition-start`

Load project context and check workflow status.

```
/intuition-start
```

**Does:**
- Loads project memory files
- Checks workflow status
- Suggests next steps based on status
- Enforces project protocols

**When to use:** Start of every session

### `/intuition-initialize`

Setup project memory system.

```
/intuition-initialize
```

**Creates:**
- `docs/project_notes/` directory
- `bugs.md` - Bug tracking
- `decisions.md` - Architecture decisions
- `key_facts.md` - Project configuration
- `issues.md` - Work log
- `.project-memory-state.json` - Workflow tracking

**When to use:** Once per project, at the start

### `/intuition-discovery`

Explore your problem with Waldo.

```
/intuition-discovery
```

**Waldo does:**
- GAPP discovery (Problem → Goals → UX Context → Personalization)
- Socratic questioning
- Systems thinking perspective
- Clarifying questions to validate understanding
- Saves `discovery_brief.md`

**When to use:** Start of new work

### `/intuition-plan`

Create a plan with Magellan.

```
/intuition-plan
```

**Magellan does:**
- Reads your discovery brief
- Researches codebase (parallel agents)
- Synthesizes into strategic plan
- Auto-detects planning depth
- Saves `plan.md`

**When to use:** After discovery is complete

### `/intuition-execute`

Execute the plan with Faraday.

```
/intuition-execute
```

**Faraday does:**
- Reads plan and discovery context
- Confirms approach with you
- Delegates to sub-agents (parallel when possible)
- Verifies outputs
- Updates project memory

**When to use:** After plan is approved

## Sub-Agents

Faraday coordinates these specialized agents:

| Agent | Purpose |
|-------|---------|
| Code Writer | Implementation |
| Test Runner | Testing & verification |
| Code Reviewer | Quality review |
| Documentation | Updates docs |
| Research | Codebase exploration |
| Security Expert | Vulnerability scanning |
| Technical Spec Writer | Specification creation |
| Communications Specialist | User-facing documentation |

## Documentation

- **Workflow Guide:** `docs/intuition-workflow.md`
- **Architecture:** `docs/intuition-architecture.md`
- **Waldo Reference:** `skills/intuition-discovery/references/waldo_core.md`
- **Magellan Reference:** `skills/intuition-plan/references/magellan_core.md`
- **Faraday Reference:** `skills/intuition-execute/references/faraday_core.md`

## Requirements

- Node.js 14.0.0 or higher
- Claude Code or similar agent system

## Project Structure

```
intuition/
├── skills/
│   ├── intuition-start/        # Context loading & workflow status
│   ├── intuition-initialize/   # Project memory setup
│   ├── intuition-discovery/    # Waldo - discovery & GAPP
│   ├── intuition-plan/         # Magellan - strategic planning
│   └── intuition-execute/      # Faraday - orchestrated execution
├── docs/                       # Documentation
│   ├── intuition-workflow.md   # User guide
│   └── intuition-architecture.md # Technical details
├── scripts/                    # Installation scripts
├── package.json                # npm package config
└── README.md                   # This file
```

## Contributing

Contributions welcome! Areas for enhancement:
- Additional specialized sub-agents
- Workflow improvements
- Documentation enhancements
- Framework extensions

## License

MIT

## Support

For issues or questions:
- Check `docs/intuition-workflow.md` for user guide
- Check `docs/intuition-architecture.md` for technical details
- Review skill documentation in `skills/*/SKILL.md`
- Check project memory in `docs/project_notes/` for decisions and issues

## Version History

### 2.0.0+
- Complete refactor into three-agent system (Waldo → Magellan → Faraday)
- GAPP framework for discovery
- File-based handoffs through project memory
- Enhanced state management
- Resume support for all phases

### 1.x
- Original monolithic planning system
