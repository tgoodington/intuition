# Intuition

A trunk-and-branch workflow system for Claude Code. Turns rough ideas into structured plans, detailed designs, code specifications, and verified implementations through guided dialogue. Supports iterative development through independent branch cycles and post-completion debugging.

## Workflow

```
/intuition-prompt  →  /intuition-handoff  →  /intuition-plan  →  /intuition-handoff
                                                                        ↓
                                                              [design loop, if needed]
                                                                        ↓
                                                               /intuition-handoff  →  /intuition-engineer
                                                                                            ↓
                                               /intuition-build  ←  /intuition-handoff
                                                        ↓
                                               /intuition-handoff  →  complete
                                                        ↓
                              /intuition-start  →  create branch  or  /intuition-debugger
```

Run `/intuition-handoff` between every phase. It manages state, generates briefs, and routes you forward. Run `/clear` before each new phase skill to keep context clean.

The first prompt→build cycle is the **trunk**. After trunk completes, create **branches** for new features or changes. Use `/intuition-debugger` to investigate hard problems in any completed context.

## Skills

| Skill | What it does |
|-------|-------------|
| `/intuition-start` | Detects where you left off, shows project status, routes to next step or branch creation |
| `/intuition-prompt` | Sharpens a rough idea into a planning-ready brief through focused Q&A |
| `/intuition-plan` | Builds a strategic blueprint with tasks, decisions, and design flags |
| `/intuition-design` | Elaborates flagged items through collaborative design exploration (ECD framework) |
| `/intuition-engineer` | Creates code-level specifications through codebase research and interactive dialogue |
| `/intuition-build` | Delegates implementation to subagents, verifies against code specs and acceptance criteria |
| `/intuition-debugger` | Expert debugger — diagnostic specialist for complex bugs, cross-context failures, performance issues |
| `/intuition-handoff` | Processes phase outputs, updates memory, prepares the next phase |
| `/intuition-initialize` | Sets up project memory (you already ran this) |

## Quick Start

### First cycle (trunk)

1. `/intuition-start` — see where you are
2. `/intuition-prompt` — describe what you want to build
3. `/intuition-handoff` — process and move to planning
4. `/intuition-plan` — create the blueprint
5. `/intuition-handoff` — review design flags, confirm items
6. `/intuition-design` — elaborate each flagged item (repeat with handoff between)
7. `/intuition-handoff` — prepare for engineering
8. `/intuition-engineer` — create code specifications
9. `/intuition-handoff` — prepare for build
10. `/intuition-build` — implement and verify
11. `/intuition-handoff` — complete the cycle

Not every project needs design. If the plan is clear enough, handoff skips straight to engineer. Run `/clear` before each phase skill.

### After trunk completes (branches)

12. `/intuition-start` — see project status and choose next step
    - **Create a branch** — start a new feature or change cycle, informed by trunk
    - **Open the debugger** — investigate hard problems in any completed context

### Debugging

Run `/intuition-debugger` at any time after a context is complete. It classifies issues into diagnostic categories (causal chain, cross-context, emergent, performance, plan-was-wrong) and runs specialized investigation protocols.
