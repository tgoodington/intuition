# Intuition

Four Claude Code skills for structured planning, execution orchestration, project initialization, and compliance enforcement.

Intuition provides:
- **`/intuition-start`**: Load project context and enforce compliance with documented protocols
- **`/intuition-plan`**: Waldo planning agent for thoughtful architecture and feature planning
- **`/intuition-execute`**: Architect execution orchestrator for implementing approved plans
- **`/intuition-initialize`**: Project initialization for structured knowledge system tracking decisions, bugs, and progress

## Quick Start

```bash
# Install globally
npm install -g .

# In Claude Code, typical workflow:
/intuition-initialize      # Set up project memory (once per project)
/intuition-start           # Load context at start of session
/intuition-plan "..."      # Plan new features
/intuition-execute         # Execute the plan
```

## Skills

### `/intuition-start` Skill

Load your project context and enforce compliance with documented protocols.

**Usage:**
```
/intuition-start
```

**What happens:**
1. Reads project memory files (bugs.md, decisions.md, key_facts.md, issues.md)
2. Reads protocol documents (CLAUDE.md, AGENTS.md)
3. Summarizes project status, decisions, and constraints
4. Primes Waldo and Architect to follow project patterns
5. Offers next steps (plan, execute, or continue work)

**When to use:** Start of every session to load full project context.

### `/intuition-plan` Skill

Start a planning session with Waldo, your planning thought partner.

**Usage:**
```
/intuition-plan "Implement real-time notifications with WebSockets"
```

**What happens:**
1. Auto-initializes project memory on first run (creates `docs/project_notes/`)
2. Waldo engages in dialogue to understand your goals
3. Waldo researches your codebase and develops a detailed plan through reflection and refinement
4. Plan is saved to `docs/project_notes/project_plan.md`
5. You can review and approve before execution

### `/intuition-execute` Skill

Execute an existing plan with Architect, the execution orchestrator.

**Usage:**
```
/intuition-execute
```

**What happens:**
1. Architect reads your plan from `docs/project_notes/project_plan.md`
2. Reviews plan for feasibility and gaps
3. Creates tasks with dependencies
4. Delegates implementation to specialized sub-agents
5. Verifies outputs and reports completion

**Prerequisite:** A plan must exist from a previous `/intuition-plan` session

### `/intuition-initialize` Skill

Initialize the project memory system.

**Usage:**
```
/intuition-initialize
```

**What happens:**
1. Creates `docs/project_notes/` directory structure
2. Sets up memory files:
   - `bugs.md` - Bug log with solutions
   - `decisions.md` - Architectural decisions
   - `key_facts.md` - Project configuration
   - `issues.md` - Work log
3. Configures project memory tracking
4. Sets up CLAUDE.md and AGENTS.md with memory-aware protocols

## Workflow

A typical Intuition workflow in Claude Code:

```
1. /intuition-initialize
   └─ Initialize project memory system in docs/project_notes/

2. /intuition-start (at beginning of each session)
   └─ Load project context and enforce protocol compliance
   └─ Understand project decisions, constraints, and status

3. /intuition-plan "Feature description"
   └─ Work with Waldo to develop a comprehensive plan
   └─ Plan saved to docs/project_notes/project_plan.md
   └─ Review and approve plan

4. /intuition-execute
   └─ Architect reads the plan and enforces compliance
   └─ Delegates work to specialized sub-agents
   └─ Executes plan tasks with verification
   └─ Reports completion

5. (Iterate as needed)
   └─ /intuition-start (reload context for new session)
   └─ /intuition-plan "Next phase"
   └─ /intuition-execute
```

## Using Intuition Skills

After installation via npm, the four Intuition skills are available globally in Claude Code:

### `/intuition-initialize` Skill

Set up project memory and structured knowledge system.

```
/intuition-initialize
```

This creates:
- `docs/project_notes/bugs.md` - Bug log with solutions
- `docs/project_notes/decisions.md` - Architectural decisions
- `docs/project_notes/key_facts.md` - Project configuration
- `docs/project_notes/issues.md` - Work log
- Configures CLAUDE.md and AGENTS.md with memory protocols

**Run this first** when starting a new project.

### `/intuition-plan` Skill

Start a planning session with Waldo:

```
/intuition-plan "Add user authentication to the app"
```

Waldo will:
1. Engage in dialogue to understand your goals
2. Research your codebase for context
3. Develop a structured plan with confidence scoring
4. Reflect and refine before finalizing
5. Save the plan to `docs/project_notes/project_plan.md`

### `/intuition-execute` Skill

Execute an existing plan with Architect:

```
/intuition-execute
```

Architect will:
1. Read your plan from `docs/project_notes/project_plan.md`
2. Review for feasibility and gaps
3. Create tasks with dependencies
4. Delegate to specialized sub-agents
5. Verify outputs and report completion

**Prerequisite:** A plan must exist from a previous `/intuition-plan` session.

### Verification

To verify installation in Claude Code:

1. Open any project in Claude Code
2. Type `/` to see available skills
3. You should see `/intuition-start`, `/intuition-plan`, `/intuition-execute`, and `/intuition-initialize`

If skills are not available:
- Ensure installation completed (check `~/.claude/skills/` contains the skill directories)
- Restart Claude Code if just installed
- See [INSTALLATION.md](./INSTALLATION.md) for troubleshooting

## Project Structure

```
intuition/
├── skills/
│   ├── intuition-start/      # Context loading and compliance enforcement
│   ├── intuition-plan/       # Planning with Waldo
│   ├── intuition-execute/    # Execution with Architect
│   └── intuition-initialize/ # Project memory setup
├── agents/
│   ├── waldo.md              # Planning agent definition
│   ├── architect.md          # Execution orchestrator
│   └── [other sub-agents]
├── scripts/
│   └── install-skills.js     # Installation script
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

See `skills/intuition-initialize/SKILL.md` for full details.

## Installation

### Install Globally via npm (Recommended)

```bash
npm install -g intuition
```

This automatically installs the four Intuition skills to `~/.claude/skills/` for use across all projects with Claude Code:
- `/intuition-start` - Load project context
- `/intuition-plan` - Planning with Waldo
- `/intuition-execute` - Execution with Architect
- `/intuition-initialize` - Project initialization

**Verification:**
```bash
ls ~/.claude/skills/intuition-*
```

### Install from Source (Development)

```bash
cd intuition
npm install -g .
```

After installation, restart Claude Code and the skills will be available globally.

## Requirements

- Node.js 14.0.0 or higher
- Access to Claude Code or similar agent system

## Architecture

Intuition provides four integrated skills for Claude Code:

1. **Context Loading** (`/intuition-start`) - Loads project memory and enforces protocol compliance
2. **Initialization** (`/intuition-initialize`) - Sets up project memory and knowledge system
3. **Planning** (`/intuition-plan` with Waldo agent) - Structured planning with reflection and dialogue
4. **Execution** (`/intuition-execute` with Architect agent) - Orchestration and verification through sub-agents

All skills coordinate through the project memory system (`docs/project_notes/`) for consistency and context across sessions. `/intuition-start` ensures every session begins with full project context and compliance enforcement.

### Sub-Agent System

When `/execute` runs, Architect delegates to specialized sub-agents:
- Code Writer - Implementation
- Test Runner - Verification
- Code Reviewer - Quality assurance
- Documentation - Knowledge updates
- Research - Investigation and exploration
- Security Expert - Vulnerability detection

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

- Intuition Start Skill: `skills/intuition-start/SKILL.md`
- Intuition Plan Skill: `skills/intuition-plan/SKILL.md`
- Intuition Execute Skill: `skills/intuition-execute/SKILL.md`
- Intuition Initialize Skill: `skills/intuition-initialize/SKILL.md`
- Waldo Agent: `agents/waldo.md`
- Architect Agent: `agents/architect.md`
