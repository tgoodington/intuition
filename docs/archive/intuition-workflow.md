# Intuition Workflow Guide

Welcome to Intuition! This guide explains how to use the three-phase workflow for planning and executing software projects.

## Overview

Intuition uses three specialized agents, each focused on a specific phase of work:

| Phase | Skill | Agent | Purpose |
|-------|-------|-------|---------|
| 1. Discovery | `/intuition-discovery` | **Waldo** | Explore problems, goals, and motivations through dialogue |
| 2. Planning | `/intuition-plan` | **Magellan** | Synthesize discovery into executable plans |
| 3. Execution | `/intuition-execute` | **Faraday** | Implement plans with methodical precision |

Each agent has a focused role, which keeps context clean and improves success rate.

## Quick Start

```bash
# Start your session
/intuition-start

# Explore your problem with Waldo
/intuition-discovery

# Create a plan with Magellan
/intuition-plan

# Execute with Faraday
/intuition-execute
```

## The Three Phases

### Phase 1: Discovery with Waldo

**What happens:** Waldo guides you through the GAPP framework to surface authentic intentions before planning.

**GAPP Framework:**
- **Problem** - What's the core challenge?
- **Goals** - What does success look like?
- **UX Context** - Who will use this and how?
- **Personalization** - What drives this work for you?

**What you'll experience:**
- Socratic questioning that helps you think deeper
- Systems thinking perspective on how problems connect
- Clarifying questions to validate understanding

**Output:** `docs/project_notes/discovery_brief.md`

**Example:**
```
You: /intuition-discovery
Waldo: What's the core challenge you're trying to solve?
You: Our API is too slow for large data requests.
Waldo: What happens when this slowness occurs? Who's affected?
...
```

### Phase 2: Planning with Magellan

**What happens:** Magellan reads the discovery brief, researches your codebase, and creates a structured plan.

**What Magellan does:**
- Reads your discovery brief
- Launches Research agents to explore the codebase
- Synthesizes insights into a coherent strategy
- Creates tasks with dependencies and acceptance criteria
- Presents the plan for your approval

**Output:** `docs/project_notes/plan.md`

**Example:**
```
You: /intuition-plan
Magellan: I've read your discovery brief about API performance. Let me research the codebase...

[Research agents explore in parallel]

Magellan: Based on discovery and research, here's my recommended plan:
- Task 1: Add caching layer to data endpoints
- Task 2: Implement pagination for large results
- Task 3: Add performance monitoring
...
```

### Phase 3: Execution with Faraday

**What happens:** Faraday reads the approved plan and orchestrates implementation through specialized sub-agents.

**What Faraday does:**
- Reads the plan and discovery brief
- Confirms approach with you
- Delegates tasks to sub-agents (Code Writer, Test Runner, etc.)
- Verifies outputs against acceptance criteria
- Reports completion with files modified

**Sub-agents available:**
- Code Writer, Test Runner, Documentation
- Research, Code Reviewer, Security Expert
- Technical Spec Writer, Communications Specialist

**Example:**
```
You: /intuition-execute
Faraday: I've read the plan. Here's my execution approach:
- Tasks 1-3 can run in parallel (different files)
- Security review is mandatory before completion

Ready to proceed?

You: Yes
Faraday: [Delegates to Code Writer agents in parallel]
...
Faraday: Execution complete. 3 tasks finished, all tests passing.
```

## Workflow Status

Intuition tracks your progress through the workflow in `docs/project_notes/.project-memory-state.json`.

Run `/intuition-start` at any time to see where you are:

```
/intuition-start

Workflow Status: Discovery complete, awaiting planning
- Discovery: ✓ Complete
- Planning: Not started
- Execution: Not started

Suggested Next Step: Run /intuition-plan
```

## File Outputs

Each phase produces files in your project memory:

```
docs/project_notes/
├── .project-memory-state.json  (workflow tracking)
├── discovery_brief.md          (from Waldo)
├── plan.md                     (from Magellan)
├── bugs.md                     (project memory)
├── decisions.md                (project memory)
├── key_facts.md                (project memory)
└── issues.md                   (project memory)
```

## Resume Support

All three skills support resuming interrupted work:

- **Waldo** resumes from the last GAPP phase
- **Magellan** resumes from research or draft state
- **Faraday** resumes from the last completed task

Just run the skill again and it will pick up where you left off.

## Discovery Revision

If you need to revise your discovery (maybe you learned something new):

1. Run `/intuition-discovery` again
2. Waldo will update the discovery brief
3. Magellan will detect the change and offer to re-plan

This keeps plans aligned with your current understanding.

## Best Practices

1. **Start with `/intuition-start`** - Load context at the beginning of each session

2. **Don't skip discovery** - The GAPP framework significantly improves plan quality

3. **Trust the agents** - Each has a focused role; let them do their job

4. **Approve before execution** - Always review Magellan's plan before Faraday executes

5. **Use project memory** - Initialize with `/intuition-initialize` for persistent context

## Troubleshooting

**"No discovery brief found"**
- Run `/intuition-discovery` first to create one

**"Plan not approved"**
- Review `docs/project_notes/plan.md` and tell Magellan to proceed

**"Workflow out of sync"**
- Run `/intuition-start` to see current status and reset if needed

## Agent Personalities

Each agent has a distinct personality:

- **Waldo** (after Ralph Waldo Emerson) - Thoughtful, curious, philosophical. Asks probing questions.

- **Magellan** (after Ferdinand Magellan) - Strategic, organized, confident. Turns vision into plans.

- **Faraday** (after Michael Faraday) - Methodical, precise, rigorous. Transforms plans into reality.

## Getting Help

- `/intuition-start` - See current status and get suggestions
- Check `docs/project_notes/` for all workflow files
- Each skill's SKILL.md has detailed documentation

Happy building!
