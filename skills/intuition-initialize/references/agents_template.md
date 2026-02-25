# Multi-Agent System & Project Memory

## Overview

This project uses a multi-agent system coordinated by Intuition (`@tgoodington/intuition`), a Claude Code skill system. Twelve specialized skills handle prompt refinement, planning, design exploration, code engineering, and build execution, with memory maintained in `docs/project_notes/` for consistency across sessions.

## Workflow Skills

### Core Workflow (run in sequence with handoff between each)

| Skill | Model | What it does |
|-------|-------|-------------|
| `/intuition-prompt` | opus | Transforms a rough vision into a planning-ready brief through focused iterative refinement |
| `/intuition-plan` | opus | Strategic architect — maps stakeholders, explores components, evaluates options, creates executable blueprint |
| `/intuition-design` | opus | Elaborates flagged plan items through ECD framework (Elements, Connections, Dynamics) |
| `/intuition-engineer` | opus | Creates code-level specifications through codebase research and interactive dialogue → `code_specs.md` |
| `/intuition-build` | sonnet | Delegates implementation to subagents, verifies outputs against code specs and acceptance criteria |

### Infrastructure

| Skill | Model | What it does |
|-------|-------|-------------|
| `/intuition-start` | haiku | Loads project context, detects workflow phase, routes to correct next skill |
| `/intuition-handoff` | haiku | Processes phase outputs, updates memory, generates briefs for the next phase |
| `/intuition-initialize` | haiku | Sets up project memory infrastructure (run once per project) |
| `/intuition-update` | haiku | Package update manager |

### Advisory

| Skill | Model | What it does |
|-------|-------|-------------|
| `/intuition-debugger` | opus | Expert debugger — 5 diagnostic categories, causal chain analysis, post-completion only |
| `/intuition-agent-advisor` | opus | Expert advisor on building custom Claude Code agents |
| `/intuition-skill-guide` | opus | Expert advisor on building custom Claude Code skills |

## Model Strategy

- **opus** — Complex multi-step reasoning: prompt refinement, planning, design exploration, code engineering, debugging, advisory
- **sonnet** — Project management and delegation: build manager, broad research subagents
- **haiku** — Focused simple tasks: start, handoff, state updates, narrow research subagents

## Workflow

### Trunk (first cycle)

```
/intuition-prompt → handoff → /intuition-plan → handoff →
  [/intuition-design loop] → handoff → /intuition-engineer → handoff →
  /intuition-build → handoff → complete
```

Each handoff transition:
1. Reads the previous phase's output
2. Updates shared memory files
3. Generates a fresh brief for the next phase
4. Updates `.project-memory-state.json`
5. Routes to the next skill (with `/clear` between phases)

### Branches (subsequent cycles)

After trunk completes, run `/intuition-start` to:
- **Create a branch** — new prompt→build cycle informed by trunk context
- **Open the debugger** — investigate hard problems in any completed context

Branches follow the same 5-phase workflow but read parent context for continuity.

### Design Loop (optional)

The plan flags tasks requiring design exploration (Section 6.5). If design items exist:
1. Handoff generates a design brief for the first item
2. `/intuition-design` elaborates it using the ECD framework
3. Handoff checks for remaining items → loops back or advances to engineer

### Engineer → Build Split

- **Engineer** (opus, interactive) determines the code-level HOW: reads codebase via research subagents, discusses decisions with you, produces `code_specs.md`
- **Build** (sonnet, PM) implements against specs: delegates to Code Writer subagents, verifies with Code Reviewer, runs mandatory Security Expert review, produces `build_report.md`
- Build makes NO engineering decisions — it matches output to specs

## Build Sub-Agents

The build phase delegates to these task-based subagents via the Task tool:

| Sub-Agent | Model | Purpose |
|-----------|-------|---------|
| Code Writer | sonnet | Implements features and fixes per code specs |
| Code Reviewer | sonnet | Reviews quality, maintainability, adherence to specs |
| Security Expert | sonnet | Scans for vulnerabilities (mandatory before completion) |

## Project Memory

**Memory Files** (`docs/project_notes/`):
- `bugs.md` — Bug log with solutions and prevention notes
- `decisions.md` — Architectural Decision Records (ADRs)
- `key_facts.md` — Project configuration, constants, URLs
- `issues.md` — Work log with ticket references

**Phase Output Files** (in `{context_path}/`):
- `planning_brief.md` — Brief for planning (created by handoff)
- `plan.md` — Structured plan with tasks, design recommendations
- `design_brief.md` — Brief for current design item (created/updated by handoff)
- `engineering_brief.md` — Brief for engineering (created by handoff)
- `code_specs.md` — Code-level specifications (created by engineer)
- `build_brief.md` — Brief for build (created by handoff)
- `build_report.md` — Task outcomes, files modified (created by build)

**How Skills Use Memory:**
- Check `decisions.md` before proposing architectural changes
- Search `bugs.md` for similar issues before debugging
- Reference `key_facts.md` for project configuration
- Log completed work in `issues.md`

## Coordination

- All workflow skills route to `/intuition-handoff` between phases
- Handoff is the ONLY skill that writes to `.project-memory-state.json`
- `/clear` runs between phases to keep context clean (each skill reads from disk)
- State tracks trunk, branches, and active context with per-context workflow pipelines
