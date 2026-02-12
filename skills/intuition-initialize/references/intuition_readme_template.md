# Intuition

A four-phase workflow system for Claude Code. Turns rough ideas into structured plans, detailed designs, and executed implementations through guided dialogue.

## Workflow

```
/intuition-prompt  →  /intuition-handoff  →  /intuition-plan  →  /intuition-handoff
                                                                        ↓
                                                              [design loop, if needed]
                                                                        ↓
                                                /intuition-execute  ←  /intuition-handoff
```

Run `/intuition-handoff` between every phase. It manages state, generates briefs, and routes you forward.

## Skills

| Skill | What it does |
|-------|-------------|
| `/intuition-start` | Detects where you left off and tells you what to run next |
| `/intuition-prompt` | Sharpens a rough idea into a planning-ready brief through focused Q&A |
| `/intuition-plan` | Builds a strategic blueprint with tasks, decisions, and design flags |
| `/intuition-design` | Elaborates flagged items through collaborative design exploration (ECD framework) |
| `/intuition-execute` | Delegates implementation to specialized subagents and verifies quality |
| `/intuition-handoff` | Processes phase outputs, updates memory, prepares the next phase |
| `/intuition-initialize` | Sets up project memory (you already ran this) |

## Quick Start

1. `/intuition-start` — see where you are
2. `/intuition-prompt` — describe what you want to build
3. `/intuition-handoff` — process and move to planning
4. `/intuition-plan` — create the blueprint
5. `/intuition-handoff` — review design flags, confirm items
6. `/intuition-design` — elaborate each flagged item (repeat with handoff between)
7. `/intuition-handoff` — prepare for execution
8. `/intuition-execute` — build it

Not every project needs design. If the plan is clear enough, handoff skips straight to execute.
