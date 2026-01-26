# Intuition

A planning and execution CLI that orchestrates AI agents for structured software development.

Intuition provides a simple command-line interface that routes between:
- **Waldo**: Planning agent for thoughtful architecture and feature planning
- **Architect**: Execution orchestrator for implementing approved plans
- **Project Memory**: Structured knowledge system tracking decisions, bugs, and progress

## Quick Start

```bash
# Install globally
npm install -g .

# Initialize project memory
intuition memory setup

# Create a plan
intuition plan "Add user authentication system"

# Execute the plan
intuition execute
```

## Commands

### `intuition plan <description>`

Start a planning session with Waldo, your planning thought partner.

**What happens:**
1. Auto-initializes project memory on first run (creates `docs/project_notes/`)
2. Invokes Waldo planning agent with your description
3. Waldo develops a detailed plan through reflection and refinement
4. Plan is saved to `docs/project_notes/project_plan.md`
5. You can review and approve before execution

**Example:**
```bash
intuition plan "Implement real-time notifications with WebSockets"
```

### `intuition execute`

Execute an existing plan with Architect, the execution orchestrator.

**What happens:**
1. Architect reads your plan from `docs/project_notes/project_plan.md`
2. Reviews plan for feasibility and gaps
3. Creates tasks with dependencies
4. Delegates implementation to specialized sub-agents
5. Verifies outputs and reports completion

**Prerequisites:**
- A plan must exist from a previous `intuition plan` command

**Example:**
```bash
intuition execute
```

### `intuition memory setup`

Initialize the project memory system explicitly.

**What happens:**
1. Creates `docs/project_notes/` directory structure
2. Sets up memory files:
   - `bugs.md` - Bug log with solutions
   - `decisions.md` - Architectural decisions
   - `key_facts.md` - Project configuration
   - `issues.md` - Work log
3. Configures project memory tracking

**Example:**
```bash
intuition memory setup
```

### `intuition help`

Show help information.

```bash
intuition help
intuition -h
intuition --help
```

### `intuition version`

Show version information.

```bash
intuition version
intuition -v
intuition --version
```

## Workflow

A typical Intuition workflow:

```
1. intuition memory setup
   └─ Initialize project memory system

2. intuition plan "Feature description"
   └─ Work with Waldo to develop a comprehensive plan
   └─ Plan saved to docs/project_notes/project_plan.md
   └─ You review and approve

3. intuition execute
   └─ Architect reads the plan
   └─ Delegates work to specialized sub-agents
   └─ Executes plan tasks with verification
   └─ Reports completion

4. (Iterate as needed)
   └─ intuition plan "Next phase"
   └─ intuition execute
```

## Project Structure

```
intuition/
├── bin/
│   └── intuition.js          # Main CLI entry point
├── agents/
│   ├── waldo.md              # Planning agent definition
│   ├── architect.md          # Execution orchestrator
│   └── [other agents]
├── skills/
│   └── project-memory/       # Project memory skill
├── package.json              # npm package config
└── README.md                 # This file
```

## Agents

### Waldo - Planning Thought Partner

Waldo specializes in collaborative planning. When you run `intuition plan`, Waldo:
- Engages in dialogue to understand your goals
- Researches your codebase for context
- Develops structured plans with confidence scoring
- Reflects and refines before finalizing
- Outputs markdown plans for review

Read more in `agents/waldo.md`

### Architect - Execution Orchestrator

Architect specializes in execution coordination. When you run `intuition execute`, Architect:
- Reviews the plan for completeness
- Breaks plans into discrete tasks
- Delegates to specialized sub-agents (Code Writer, Test Runner, etc.)
- Verifies outputs against acceptance criteria
- Handles failures with retry/fallback strategies

Read more in `agents/architect.md`

## Project Memory System

Intuition includes a project memory system that maintains institutional knowledge across sessions.

**Memory files:**
- `docs/project_notes/bugs.md` - Known bugs and solutions
- `docs/project_notes/decisions.md` - Architectural decisions
- `docs/project_notes/key_facts.md` - Project configuration
- `docs/project_notes/issues.md` - Work log and tickets

Memory is automatically referenced by Waldo and Architect to maintain consistency and avoid repeating past mistakes.

See `skills/project-memory/SKILL.md` for full details.

## Installation

### From Source

```bash
cd intuition
npm install -g .
```

### From npm (when published)

```bash
npm install -g intuition
```

### Development

```bash
cd intuition
node bin/intuition.js help
```

## Requirements

- Node.js 14.0.0 or higher
- Access to Claude Code or similar agent system

## Architecture

Intuition is built on a multi-agent architecture:

1. **CLI Layer** (`bin/intuition.js`) - Command routing and user interaction
2. **Planning Layer** (Waldo agent) - Structured planning with reflection
3. **Execution Layer** (Architect agent) - Orchestration and verification
4. **Memory Layer** (project-memory skill) - Institutional knowledge
5. **Implementation Layer** (sub-agents) - Actual code changes, tests, etc.

Each layer is independent but coordinates through the CLI and shared memory system.

## Contributing

Contributions welcome! Areas for enhancement:
- Additional specialized sub-agents
- Plan format improvements
- Memory system enhancements
- CLI features

## License

MIT

## Support

For issues or questions:
- Check `docs/project_notes/` for known issues and decisions
- Review agent definitions in `agents/`
- Check the skill documentation in `skills/`

## See Also

- Waldo Agent: `agents/waldo.md`
- Architect Agent: `agents/architect.md`
- Project Memory Skill: `skills/project-memory/SKILL.md`
