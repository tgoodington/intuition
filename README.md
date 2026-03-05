# Intuition

A trunk-and-branch workflow system for Claude Code. Turns rough ideas into structured plans, detailed designs, code specifications, and verified implementations through guided dialogue.

**npm**: [`@tgoodington/intuition`](https://www.npmjs.com/package/@tgoodington/intuition)
**GitHub**: [tgoodington/intuition](https://github.com/tgoodington/intuition)

## Install

```bash
npm install -g @tgoodington/intuition
```

This installs 12 skills globally to `~/.claude/skills/`. Verify by typing `/` in Claude Code — you should see skills starting with `intuition-`.

## Workflow

Five phases with handoff transitions between each:

```
prompt → outline → [design] → engineer → build
```

The first cycle is the **trunk**. After completion, create **branches** for new features or changes.

### Quick Start

```
/intuition-initialize          # Set up project memory (once per project)
/intuition-start               # Check status, get routed to next step
/intuition-prompt              # Describe what you want to build
/intuition-handoff             # Process → move to outlining
/intuition-outline             # Create the blueprint
/intuition-handoff             # Review design flags
/intuition-design              # Elaborate flagged items (if any)
/intuition-handoff             # Prepare for engineering
/intuition-engineer            # Create code specifications
/intuition-handoff             # Prepare for build
/intuition-build               # Implement and verify
/intuition-handoff             # Complete the cycle
```

Run `/clear` before each phase skill to keep context clean. Not every project needs design — if the outline is clear enough, handoff skips straight to engineer.

## Skills

### Core Workflow

| Skill | Model | Purpose |
|-------|-------|---------|
| `/intuition-prompt` | opus | Refines a rough idea into an outline-ready brief |
| `/intuition-outline` | opus | Strategic blueprint with tasks, dependencies, design flags |
| `/intuition-design` | opus | ECD framework design exploration for flagged items |
| `/intuition-engineer` | opus | Code-level specs through research + interactive dialogue |
| `/intuition-build` | sonnet | Delegates implementation, verifies against specs |

### Infrastructure

| Skill | Model | Purpose |
|-------|-------|---------|
| `/intuition-start` | haiku | Detects phase, routes to next skill, version check |
| `/intuition-handoff` | haiku | State transitions, brief generation, design loop |
| `/intuition-initialize` | haiku | Project memory setup (run once) |
| `/intuition-update` | haiku | Package update manager |

### Advisory

| Skill | Model | Purpose |
|-------|-------|---------|
| `/intuition-debugger` | opus | Expert diagnostics for complex post-completion bugs |
| `/intuition-agent-advisor` | opus | Guidance on building custom Claude Code agents |
| `/intuition-skill-guide` | opus | Guidance on building custom Claude Code skills |

## Key Concepts

### Engineer → Build Split

- **Engineer** (opus) determines the code-level HOW: researches codebase, discusses decisions interactively, produces `code_specs.md`
- **Build** (sonnet) implements against specs: delegates to subagents, verifies with reviewers, runs mandatory security review, produces `build_report.md`

### Trunk and Branches

- **Trunk**: First prompt→build cycle — the foundation
- **Branches**: Subsequent cycles that read parent context for continuity
- After any cycle completes, `/intuition-start` offers branch creation or debugging

### Design Loop

The outline flags tasks needing design exploration. Handoff manages a loop: design one item → check for more → design next or advance to engineer.

### Project Memory

All workflow state and knowledge lives in `docs/project_notes/`:
- Shared memory: `bugs.md`, `decisions.md`, `key_facts.md`, `issues.md`
- State: `.project-memory-state.json` (owned by handoff)
- Phase outputs: briefs, outline, code specs, build report (in context-specific paths)

## Project Structure

```
intuition/
├── skills/
│   ├── intuition-start/           # Session primer + routing
│   ├── intuition-prompt/          # Discovery refinement
│   ├── intuition-outline/         # Strategic outlining
│   ├── intuition-design/          # ECD design exploration
│   ├── intuition-engineer/        # Code spec creation
│   ├── intuition-build/           # Implementation + verification
│   ├── intuition-handoff/         # State transitions + briefs
│   ├── intuition-debugger/        # Post-completion diagnostics
│   ├── intuition-initialize/      # Project memory setup
│   ├── intuition-update/          # Package updates
│   ├── intuition-agent-advisor/   # Agent building guidance
│   └── intuition-skill-guide/     # Skill building guidance
├── scripts/
│   ├── install-skills.js          # Postinstall → copies skills to ~/.claude/skills/
│   └── uninstall-skills.js        # Preuninstall → removes skills
├── docs/                          # Architecture and design documentation
├── bin/                           # CLI entry point
├── package.json
└── README.md
```

## Requirements

- Node.js 14.0.0+
- Claude Code

## License

MIT
