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

Two workflow modes:

**v9 (current):** `prompt → outline → assemble → detail → build → test`
**v8 (legacy):** `prompt → outline → build` (with handoff transitions)

The first cycle is the **trunk**. After completion, create **branches** for new features or changes.

### Quick Start

```
/intuition-initialize          # Set up project memory (once per project)
/intuition-start               # Check status, get routed to next step
/intuition-prompt              # Describe what you want to build
/intuition-outline             # Create the blueprint
/intuition-assemble            # Match tasks to domain specialists
/intuition-detail              # Specialists produce blueprints
/intuition-build               # Implement and verify
/intuition-test                # Quality gate
```

Run `/clear` before each phase skill to keep context clean.

## Skills

### Core Workflow

| Skill | Model | Purpose |
|-------|-------|---------|
| `/intuition-prompt` | opus | Refines a rough idea into an outline-ready brief |
| `/intuition-outline` | opus | Strategic blueprint with tasks, dependencies, depth assessment |
| `/intuition-assemble` | sonnet | Matches tasks to domain specialists and producers |
| `/intuition-detail` | opus | Domain specialists produce detailed blueprints |
| `/intuition-build` | sonnet | Delegates implementation, verifies against blueprints |
| `/intuition-test` | opus | Post-build quality gate — test strategy and execution |

### Infrastructure

| Skill | Model | Purpose |
|-------|-------|---------|
| `/intuition-start` | haiku | Detects phase, routes to next skill, version check |
| `/intuition-handoff` | sonnet | Branch creation, v8 state transitions, migrations |
| `/intuition-initialize` | haiku | Project memory setup (run once) |
| `/intuition-update` | haiku | Package update manager |

### Standalone Tools

| Skill | Model | Purpose |
|-------|-------|---------|
| `/intuition-meander` | opus | Thought partner — reason through problems collaboratively |
| `/intuition-think-tank` | opus | Rapid expert-panel analysis of documents, ideas, or proposals |

### Advisory

| Skill | Model | Purpose |
|-------|-------|---------|
| `/intuition-debugger` | opus | Expert diagnostics for complex post-completion bugs |
| `/intuition-agent-advisor` | opus | Guidance on building custom Claude Code agents |
| `/intuition-skill-guide` | opus | Guidance on building custom Claude Code skills |

## Key Concepts

### Trunk and Branches

- **Trunk**: First prompt→build cycle — the foundation
- **Branches**: Subsequent cycles that read parent context for continuity
- After any cycle completes, `/intuition-start` offers branch creation or debugging

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
│   ├── intuition-meander/         # Thought partner
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
