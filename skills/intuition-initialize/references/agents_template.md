# Multi-Agent System & Project Memory

## Overview

This project uses a multi-agent system coordinated by Intuition (Claude Code skill system) to streamline development workflows. Specialized agents handle discovery, planning, and execution, with memory maintained in `docs/project_notes/` for consistency across sessions.

## Primary Agents

**Waldo** — Discovery & Thought Partnership (`/intuition-discovery`)
- Collaborative dialogue for understanding problems deeply
- GAPP framework: Problem → Goals → UX Context → Personalization
- Researches topic via parallel subagents before engaging
- Output: `discovery_brief.md` and `discovery_output.json`

**Magellan** — Planning & Strategic Synthesis (`/intuition-plan`)
- Synthesizes discovery into structured, executable plans
- Researches codebase via parallel subagents
- Output: `plan.md` with tasks, dependencies, risks

**Faraday** — Execution & Implementation (`/intuition-execute`)
- Executes approved plans by orchestrating specialized sub-agents
- Delegates to Code Writer, Test Runner, Code Reviewer, Security Expert
- Mandatory security review before completion
- Output: Implemented features, completion report

**Handoff Orchestrator** (`/intuition-handoff`)
- Processes phase outputs, updates memory files, briefs next agent
- ONLY component that writes to `.project-memory-state.json`
- Bridges discovery→planning and planning→execution transitions

## Specialized Sub-Agents

**Code Writer** — Implements features and fixes
**Test Runner** — Runs unit and integration tests
**Code Reviewer** — Reviews quality, maintainability, security
**Security Expert** — Scans for vulnerabilities (mandatory before completion)
**Documentation** — Creates and updates docs
**Research** — Investigates issues, explores codebases

## Workflow Patterns

### Pattern 1: Full Feature Development (Recommended)
1. User → Waldo (collaborative discovery dialogue)
2. Handoff (processes discovery, briefs planner)
3. Magellan (creates structured plan)
4. Handoff (processes plan, briefs executor)
5. Faraday → Sub-agents (parallel delegation)
6. Security Expert review (mandatory)

### Pattern 2: Direct Execution (Simple Tasks)
1. User → Faraday (describe what to do)
2. Faraday → Sub-agents (delegated work)
3. Security Expert review

## Project Memory Integration

**Memory Files Location**: `docs/project_notes/`
- `bugs.md` — Bug log with solutions
- `decisions.md` — Architectural Decision Records
- `key_facts.md` — Project configuration, constants
- `issues.md` — Work log with ticket references

**How Agents Use Memory:**
- Check `decisions.md` before proposing architectural changes
- Search `bugs.md` for similar issues before debugging
- Reference `key_facts.md` for project configuration
- Log completed work in `issues.md`

## Agent Coordination

- All work skills route to `/intuition-handoff` between phases
- Handoff owns all state transitions in `.project-memory-state.json`
- Agents use structured markdown output
- State is tracked in memory files for cross-session continuity
