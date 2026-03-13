# Intuition

A trunk-and-branch workflow system for Claude Code. Turns rough ideas into structured plans, specialist-driven blueprints, and verified implementations through guided dialogue.

## Workflow

```
/intuition-prompt → /intuition-outline → /intuition-assemble →
  /intuition-detail → /intuition-build → /intuition-test → complete
        ↓
  /intuition-start → create branch or /intuition-debugger
```

Run `/clear` before each new phase skill to keep context clean.

The first cycle is the **trunk**. After trunk completes, create **branches** for new features or changes. Use `/intuition-debugger` to investigate hard problems in any completed context.

## Skills

| Skill | What it does |
|-------|-------------|
| `/intuition-start` | Detects where you left off, shows project status, routes to next step or branch creation |
| `/intuition-prompt` | Sharpens a rough idea into a planning-ready brief through focused Q&A |
| `/intuition-outline` | Builds a strategic blueprint with tasks, depth assessment, and domain classification |
| `/intuition-assemble` | Matches tasks to domain specialists and format producers |
| `/intuition-detail` | Domain specialists produce detailed blueprints through exploration and user gates |
| `/intuition-build` | Delegates implementation to subagents, verifies against blueprints and acceptance criteria |
| `/intuition-test` | Post-build quality gate — test strategy design and execution |
| `/intuition-debugger` | Expert debugger — diagnostic specialist for complex bugs, cross-context failures, performance issues |
| `/intuition-handoff` | Branch creation, v8 state transitions, migrations |
| `/intuition-initialize` | Sets up project memory (you already ran this) |
| `/intuition-meander` | Thought partner — reason through problems collaboratively |
| `/intuition-think-tank` | Rapid expert-panel analysis of documents, ideas, or proposals |

## Quick Start

### First cycle (trunk)

1. `/intuition-start` — see where you are
2. `/intuition-prompt` — describe what you want to build
3. `/intuition-outline` — create the blueprint
4. `/intuition-assemble` — match tasks to specialists
5. `/intuition-detail` — specialists produce blueprints
6. `/intuition-build` — implement and verify
7. `/intuition-test` — quality gate

Run `/clear` before each phase skill.

### After trunk completes (branches)

12. `/intuition-start` — see project status and choose next step
    - **Create a branch** — start a new feature or change cycle, informed by trunk
    - **Open the debugger** — investigate hard problems in any completed context

### Debugging

Run `/intuition-debugger` at any time after a context is complete. It classifies issues into diagnostic categories (causal chain, cross-context, emergent, performance, plan-was-wrong) and runs specialized investigation protocols.
