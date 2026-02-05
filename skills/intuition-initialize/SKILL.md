---
name: intuition-initialize
description: Set up and maintain a structured project memory system in docs/project_notes/ that tracks bugs with solutions, architectural decisions, key project facts, and work history. Configures both CLAUDE.md and AGENTS.md to maintain memory awareness across different AI coding tools.
model: haiku
tools: Read, Write, Glob, Grep, AskUserQuestion
---

# Intuition Initialize

## Table of Contents

- [Overview](#overview)
- [When to Use This Skill](#when-to-use-this-skill)
- [Core Capabilities](#core-capabilities)
  - [1. Initial Setup - Create Memory Infrastructure](#1-initial-setup---create-memory-infrastructure)
  - [2. Configure CLAUDE.md - Memory-Aware Behavior](#2-configure-claudemd---memory-aware-behavior)
  - [3. Configure AGENTS.md - Multi-Tool Support](#3-configure-agentsmd---multi-tool-support)
  - [4. Configure Claude Code Settings - Agent Permissions](#4-configure-claude-code-settings---agent-permissions)
  - [5. Searching Memory Files](#5-searching-memory-files)
  - [6. Updating Memory Files](#6-updating-memory-files)
  - [7. Memory File Maintenance](#7-memory-file-maintenance)
- [Templates and References](#templates-and-references)
- [Example Workflows](#example-workflows)
- [Integration with Other Skills](#integration-with-other-skills)
- [Success Criteria](#success-criteria)
- [Workflow Integration](#workflow-integration)

## Overview

Maintain institutional knowledge for projects by establishing a structured memory system in `docs/project_notes/`. This skill sets up memory files (bugs, decisions, key facts, issues, project plan), configures CLAUDE.md and AGENTS.md with memory-aware protocols, and pre-authorizes essential tools in Claude Code settings so agents work autonomously. The result is a project that remembers past decisions, solutions to problems, and important configuration details across coding sessions and across different AI tools, with agents empowered to work efficiently without permission interruptions.

**Optional Personalization:** This skill can optionally integrate with the Waldo agent to provide a conversational, plan-oriented experience with project planning and progress tracking. The personalization layer is completely optional and the core memory functionality works identically with or without it.

## When to Use This Skill

Invoke this skill when:

- Starting a new project that will accumulate knowledge over time
- The project already has recurring bugs or decisions that should be documented
- The user asks to "set up project memory" or "track our decisions"
- The user wants to log a bug fix, architectural decision, or completed work
- Encountering a problem that feels familiar ("didn't we solve this before?")
- Before proposing an architectural change (check existing decisions first)
- Working on projects with multiple developers or AI tools (Claude Code, Cursor, etc.)
- Setting up a personalized, plan-oriented project workflow with progress tracking

## Core Capabilities

### 1. Initial Setup - Create Memory Infrastructure

When invoked for the first time in a project, create the following structure:

```
docs/
└── project_notes/
    ├── bugs.md                        # Bug log with solutions
    ├── decisions.md                   # Architectural Decision Records
    ├── key_facts.md                   # Project configuration and constants
    ├── issues.md                      # Work log with ticket references
    ├── discovery_brief.md             # Discovery phase output (Waldo)
    ├── discovery_output.json          # Structured discovery findings
    ├── planning_brief.md              # Planning phase context (Magellan)
    ├── plan.md                        # Structured project plan (Magellan)
    ├── execution_brief.md             # Execution phase context (Faraday)
    └── .project-memory-state.json     # Workflow state and resume data
```

**Directory naming rationale:** Using `docs/project_notes/` instead of `memory/` makes it look like standard engineering organization, not AI-specific tooling. This increases adoption and maintenance by human developers.

**Initial file content:** Copy templates from the `references/` directory in this skill:
- Use `references/bugs_template.md` for initial `bugs.md`
- Use `references/decisions_template.md` for initial `decisions.md`
- Use `references/key_facts_template.md` for initial `key_facts.md`
- Use `references/issues_template.md` for initial `issues.md`
- Use `references/state_template.json` for initial `.project-memory-state.json`

**User Profile Setup:** Also create `.claude/USER_PROFILE.json`:
- Use `references/user_profile_template.json` to create `.claude/USER_PROFILE.json`
- This is a **persistent, cross-project** file (not project-specific)
- Lives in `.claude/` directory (global to the user, shared across all projects)
- Agents naturally discover and populate this through conversation
- Contains: role, expertise, communication style, motivation, constraints
- Does NOT contain: project goals, project decisions, project constraints

**Brief templates** (created at runtime by handoff skill, not at init):
- `references/discovery_output_template.json` - Structured output from discovery
- `references/planning_brief_template.md` - Brief for planning phase
- `references/execution_brief_template.md` - Brief for execution phase

Each template includes format examples and usage tips. The brief files are generated by the handoff skill as phases complete.

**Claude Code Settings:** Also create or update `.claude/settings.local.json`:
- Use `references/settings_template.json` to create `.claude/settings.local.json`
- Pre-authorizes essential tools (Read, Glob, Grep, WebSearch, WebFetch, Task) so agents work autonomously
- Includes common git operations for version control workflows
- Users can customize this file if they want different permission levels

### 2. Configure CLAUDE.md - Memory-Aware Behavior

Add or update the following section in the project's `CLAUDE.md` file:

```markdown
## Project Workflow and Memory System

This project uses a three-phase workflow coordinated by the Intuition system, with institutional knowledge maintained in `docs/project_notes/` for consistency across sessions.

### Workflow Phases

The project follows a structured three-phase workflow:

**Phase 1: Discovery (Waldo)**
- Purpose: Deep understanding of the problem through collaborative dialogue
- Framework: GAPP (Problem → Goals → UX Context → Personalization)
- Output: `discovery_brief.md` and `discovery_output.json` with comprehensive context
- When: Starting new features or investigating complex problems
- Skill: `/intuition-discovery`

**Phase 1.5: Discovery → Planning Handoff (Orchestrator)**
- Purpose: Process discovery output, update memory files, brief planner
- Process: Extract insights, document in key_facts/decisions, generate planning_brief.md
- Output: Fresh context for planning phase
- When: Discovery complete, before planning begins
- Skill: `/intuition-handoff`

**Phase 2: Planning (Magellan)**
- Purpose: Strategic synthesis and structured execution planning
- Process: Research codebase, identify patterns, create detailed plan
- Output: `plan.md` with tasks, dependencies, risks
- When: After discovery handoff, ready to design approach
- Skill: `/intuition-plan`

**Phase 2.5: Planning → Execution Handoff (Orchestrator)**
- Purpose: Process plan, brief executor, update memory
- Process: Extract task structure and risks, generate execution_brief.md
- Output: Fresh context for execution phase
- When: Plan approved, before execution begins
- Skill: `/intuition-handoff`

**Phase 3: Execution (Faraday)**
- Purpose: Methodical implementation with verification and quality checks
- Process: Delegate to specialized sub-agents, coordinate work, verify outputs
- Output: Implemented features, updated memory, completion report
- When: Plan approved and ready to implement
- Skill: `/intuition-execute`

**Recommended Workflow**: Discovery → Handoff → Planning → Handoff → Execution (→ Repeat for next feature)

### Memory Files

**Core Memory Files** (initialized at setup):
- **bugs.md** - Bug log with dates, solutions, and prevention notes
- **decisions.md** - Architectural Decision Records (ADRs) with context and trade-offs
- **key_facts.md** - Project configuration, credentials, ports, important URLs
- **issues.md** - Work log with ticket IDs, descriptions, and URLs
- **.project-memory-state.json** - Workflow phase tracking and session state

**Phase Output Files** (created during workflow):
- **discovery_brief.md** - Discovery phase synthesis (created by Waldo)
- **discovery_output.json** - Structured findings from discovery (created by Waldo, processed by Handoff)
- **planning_brief.md** - Brief for planning phase (created by Handoff orchestrator)
- **plan.md** - Structured project plan with tasks, dependencies, risks (created by Magellan)
- **execution_brief.md** - Brief for execution phase (created by Handoff orchestrator)

### Documentation Flagging

This project uses a documentation flagging system where specialized agents (Waldo for discovery, Magellan for planning, Faraday for execution) emit flags when they complete work. The base Claude agent processes these flags and routes documentation to the appropriate memory file.

**Flag format**: `[DOCUMENT: type] "content"`

**Supported types**:
- `plan` → `project_plan.md` (project structure and task list)
- `decision` → `decisions.md` (architectural decisions and ADRs)
- `work` → `issues.md` (completed work and task progress)
- `bug` → `bugs.md` (bug solutions and prevention notes)
- `key_fact` → `key_facts.md` (project configuration and important info)

**How it works**: After agents complete planning or execution, they emit flags like `[DOCUMENT: decision] "Chose async pattern..."`. Claude processes these flags, routes them to the right file, applies proper formatting (dates, structure, linking), and updates project memory.

This keeps documentation authority centralized with Claude while agents focus on their core work.

### Memory-Aware Protocols

**Before proposing architectural changes:**
- Check `docs/project_notes/decisions.md` for existing decisions
- Verify the proposed approach doesn't conflict with past choices
- If it does conflict, acknowledge the existing decision and explain why a change is warranted

**When encountering errors or bugs:**
- Search `docs/project_notes/bugs.md` for similar issues
- Apply known solutions if found
- Document new bugs and solutions when resolved

**When looking up project configuration:**
- Check `docs/project_notes/key_facts.md` for credentials, ports, URLs, service accounts
- Prefer documented facts over assumptions

**When completing work on tickets:**
- Log completed work in `docs/project_notes/issues.md`
- Include ticket ID, date, brief description, and URL

**When user requests memory updates:**
- Update the appropriate memory file (bugs, decisions, key_facts, or issues)
- Follow the established format and style (bullet lists, dates, concise entries)

**Documentation Flagging System:**

When agents complete work, they emit documentation flags that Claude (the base agent) processes:
- **Flag format**: `[DOCUMENT: type] "content - context"`
- **Supported types**: `plan`, `decision`, `work`, `bug`, `key_fact`
- **Processing**: Claude checks agent output for flags after they complete
- **Routing**: Claude routes each type to the appropriate memory file with correct formatting
- **Error handling**: If a flag is unrecognized:
  1. Claude searches recent agent output for context
  2. If resolvable, routes it correctly and moves on
  3. If unclear, creates `docs/intuition-framework-improvements.md` entry documenting the issue
  4. Entry includes: flag type, context, suggested framework update

This system keeps documentation authority centralized with Claude while agents focus on planning and execution.

### Style Guidelines for Memory Files

- **Prefer bullet lists over tables** for simplicity and ease of editing
- **Keep entries concise** (1-3 lines for descriptions)
- **Always include dates** for temporal context
- **Include URLs** for tickets, documentation, monitoring dashboards
- **Manual cleanup** of old entries is expected (not automated)

### Smart Skill Suggestions

**When discovery is complete:**
If discovery brief is finalized - prompt them to run handoff before planning:
- "Discovery looks complete! Use `/intuition-handoff` to process insights and prepare for planning."
- Handoff orchestrator updates memory files and creates planning brief

**Triggers for /intuition-handoff (Discovery→Planning):**
- Discovery brief is finalized
- User says "ready to plan" or "let's move on"
- discovery.completed == true in state.json

**When user suggests planning work:**
If the user mentions designing features, architecture, complex multi-step work, or asks "how should we approach..." - prompt them to use `/intuition-plan` after handoff:
- "This sounds like a good candidate for planning. Use `/intuition-handoff` to process discovery, then `/intuition-plan` to develop a structured approach."
- Don't proceed with ad-hoc planning; guide them to the planning workflow

**Triggers for /intuition-plan suggestion:**
- User describes a new feature to build
- User asks about architecture or design decisions
- User mentions multi-step or complex work
- User says "how should we...", "what's the best way to...", "let's think through..."
- Discovery has been handed off

**When plan is ready for execution:**
If the user approves a plan or indicates readiness - prompt them to run handoff before execution:
- "Great, the plan looks ready! Use `/intuition-handoff` to prepare execution context."
- Handoff orchestrator creates execution brief and updates state

**Triggers for /intuition-handoff (Planning→Execution):**
- Plan is approved and finalized
- User says "ready to execute" or "let's implement"
- planning.approved == true in state.json

**When user is ready to execute:**
If handoff is complete - prompt them to use `/intuition-execute`:
- "Execution brief is ready! Use `/intuition-execute` to kick off coordinated implementation."
- Don't start implementing directly; hand off to the execution workflow

**Triggers for /intuition-execute suggestion:**
- User approves a plan ("looks good", "let's do it", "approved")
- User asks to start implementation after planning
- User says "execute", "implement", "build it", "make it happen"
- Planning has been handed off
```

### 3. Configure AGENTS.md - Multi-Tool Support

If the project has an `AGENTS.md` file (used for agent workflows or multi-tool projects), enhance it with complete agent system configuration. This ensures consistency whether using Claude Code, Cursor, GitHub Copilot, or other AI tools.

**AGENTS.md Template Content:**

The AGENTS.md file will be created with the following comprehensive template that includes memory protocols, agent registry, workflow patterns, and Waldo integration:

```markdown
# Multi-Agent System & Project Memory

## Overview

This project uses a multi-agent system coordinated by Intuition (Claude Code plugin) to streamline development workflows. The system includes specialized agents for planning, execution, research, testing, and more. All agents have access to and maintain the project memory system for consistency across sessions.

## Agent Registry

### Primary Coordination Agents

**Waldo** - Discovery & Thought Partnership (Skill: `/intuition-discovery`)
- Role: Conversational discovery partner for understanding problems deeply
- Framework: GAPP (Problem → Goals → UX Context → Personalization)
- Activation: Invoked at project start or when exploring complex problems
- Behavior: Collaborative dialogue, Socratic questioning, systems thinking
- Output: `discovery_brief.md` and `discovery_output.json` with comprehensive context for planning
- Key: Never executes changes - strictly discovery-focused

**Magellan** - Planning & Strategic Synthesis (Skill: `/intuition-plan`)
- Role: Synthesizes discovery into structured, executable plans
- Activation: After discovery phase or when planning new features
- Behavior: Researches codebase, identifies patterns, creates detailed strategy
- Output: `plan.md` with tasks, dependencies, risks, confidence scores
- Coordination: Prepares context for Faraday execution, seeks user approval
- Integration: Works with project memory system, references past decisions

**Faraday** - Execution & Implementation (Skill: `/intuition-execute`)
- Role: Executes approved plans by orchestrating specialized sub-agents
- Activation: After user approves plan from Magellan
- Behavior: Breaks down plans into concrete tasks, ensures quality, monitors progress
- Coordination: Manages parallel execution, handles failures with retry strategies
- Integration: Works with project memory system, Security Expert review before commits
- Output: Implemented features, updated memory, completion report

**Handoff Orchestrator** - Phase Transition Coordinator (Skill: `/intuition-handoff`)
- Role: Processes phase outputs, updates memory, briefs next agent
- Activation: After discovery completes (before planning), after planning completes (before execution)
- Behavior: Extracts insights, updates memory files, generates fresh briefs
- Coordination: Bridges discovery→planning and planning→execution transitions
- Integration: Maintains project memory consistency, creates phase-appropriate context
- Output: Updated memory files, fresh brief for next agent, state transitions

### Specialized Sub-Agents

**Code Writer** - Implementation Specialist
- Writes and edits code based on clear specifications
- Performs self-review before submission
- Maintains security awareness during implementation

**Test Runner** - Quality Verification
- Executes unit and integration tests
- Detects flaky tests and regressions
- Reports coverage with threshold awareness

**Documentation** - Knowledge & Communication
- Creates and updates README, API docs, code comments
- Writes for specific audiences
- Validates links and accuracy

**Research** - Investigation & Exploration
- Explores codebases and investigates issues
- Researches solutions and gathers information
- Provides confidence-scored findings with citations

**Code Reviewer** - Quality Assurance
- Reviews code for quality, maintainability, security
- Uses reflection to review the review
- Provides severity-scored feedback with OWASP checklist

**Security Expert** - Vulnerability Detection
- Scans code and configs for security issues
- Detects exposed secrets, API keys, sensitive data
- Uses OWASP guidelines for comprehensive analysis
- Mandatory review before commits and deployments

**Technical Spec Writer** - Specification & Documentation
- Creates comprehensive technical specifications for features
- Documents APIs, data models, integration points
- Specifies error handling and performance requirements
- Produces human-facing technical documentation in docs/specs/

**Communications Specialist** - Audience-Focused Communication
- Transforms technical specs into audience-specific documents
- Creates getting-started guides, user tutorials, executive summaries
- Creates NEW human-centric documents (not modifications)
- Emits documentation flags for routing by base Claude

## Agent Categories

The 10-agent system is organized into three functional categories:

### Core Execution Agents (3)
- **Code Writer** - Implements features and fixes
- **Test Runner** - Verifies with automated tests
- **Research** - Explores and investigates

### Document Creators (4)
- **Documentation** - General documentation (README, API docs, comments)
- **Technical Spec Writer** - Technical specifications (pre-implementation planning)
- **Communications Specialist** - Audience-specific documents (user guides, executive summaries)
- **Code Reviewer** - Code quality documentation and feedback

### Coordination Agents (3)
- **Waldo** - Discovery & thought partner (coordinates discovery)
- **Magellan** - Planning & synthesis (coordinates planning)
- **Faraday** - Execution & implementation (coordinates execution)

## Extensibility via Dynamic Discovery

The system can discover new agent archetypes based on emerging needs:

1. Both Magellan (planning) and Faraday (execution) can identify unknown agent types
2. They request Research agent to find best practices for that archetype
3. Findings are documented in `docs/intuition-framework-improvements.md`
4. Patterns are available for current session and documented for future framework-wide adoption

**Example**: If a feature requires specialized deployment expertise, delegate to Research to investigate deployment patterns. Document findings for future adoption consideration.

## Workflow Patterns

### Pattern 1: Feature Development (Recommended)
**When**: Planning new features or significant changes
**Flow**:
1. User → Waldo (describe what you want to build)
2. Waldo asks clarifying questions through GAPP, explores codebase, creates discovery brief
3. Waldo hands off to Magellan
4. Magellan researches, synthesizes strategy, creates detailed plan
5. User approves or provides feedback
6. Magellan hands off to Faraday
7. Faraday → Sub-agents (parallel delegation for efficiency)
   - Code Writer writes implementation
   - Test Runner verifies with tests
   - Code Reviewer checks quality
   - Security Expert reviews before commit
   - Documentation updates relevant files

**Benefits**: Deep understanding, clear strategy, architectural alignment, team knowledge captured

### Pattern 2: Direct Execution (Simple Tasks)
**When**: Simple tasks with clear requirements (bug fixes, small features)
**Flow**:
1. User → Faraday (describe what to do)
2. Faraday breaks into tasks
3. Faraday → Sub-agents (delegated work)
4. Parallel execution of independent tasks
5. Results verified and consolidated

**Benefits**: Faster for straightforward work, skips planning overhead

### Pattern 3: Discovery & Investigation
**When**: Understanding codebase, investigating complex issues, evaluating approaches
**Flow**:
1. User → Waldo (ask questions or describe unclear problem)
2. Waldo guides through GAPP dialogue, explores codebase, creates discovery brief with findings
3. Waldo provides findings with confidence scores and citations for next steps

**Benefits**: Deep understanding, confidence-scored insights, foundation for planning or direct implementation

## Agent Coordination Protocols

### Handoff Protocol: Waldo → Magellan → Faraday

**Discovery to Planning (Waldo → Magellan):**
- Waldo completes discovery brief with comprehensive context
- Waldo explicitly hands off to Magellan with discovery findings
- Magellan reads discovery brief, validates understanding, asks clarifying questions if needed
- Magellan never modifies discovery findings - uses them to inform strategy

**Planning to Execution (Magellan → Faraday):**
- Magellan creates detailed markdown plan with all necessary details
- Plan includes tasks, dependencies, confidence scores, risk assessment, and approach rationale
- Magellan explicitly hands off to Faraday with context and plan
- Faraday reads plan, validates understanding, confirms approach with user
- Faraday never modifies plan without user approval - executes according to specifications

### Parallel Execution
The Architect can delegate multiple sub-agents to run in parallel when:
- Tasks are independent (no dependencies between them)
- Each sub-agent has clear, non-overlapping scope
- Results can be consolidated and validated

Common patterns:
- Code Writer + Test Runner + Reviewer can run in parallel
- Research agent can run independently while others work
- Security Expert review happens last (before commits)

### Agent Communication
- Agents use clear, structured output (markdown format)
- Long-running tasks provide progress updates
- Agents respect user preferences and project conventions
- State is tracked in memory files for continuity

## Project Memory Integration

**Memory Files Location**: `docs/project_notes/`
- `bugs.md` - Bug log with solutions
- `decisions.md` - Architectural Decision Records
- `key_facts.md` - Project configuration, constants
- `issues.md` - Work log with ticket references

### How Agents Use Memory Files

**Before proposing architectural changes:**
- Check `decisions.md` for existing decisions
- Verify proposed approach aligns with past choices
- If conflicting, explain why change is warranted

**When encountering errors or bugs:**
- Search `bugs.md` for similar issues
- Apply known solutions if found
- Document new bugs and solutions when resolved

**When looking up project configuration:**
- Check `key_facts.md` for credentials, ports, URLs
- Prefer documented facts over assumptions

**When completing work on tickets:**
- Log completed work in `issues.md`
- Include ticket ID, date, brief description, URL

**When user requests memory updates:**
- Update appropriate memory file following format
- Keep entries concise (1-3 lines)
- Always include dates and URLs

### Style Guidelines
- Prefer bullet lists over tables
- Keep entries concise
- Always include dates for temporal context
- Include URLs for tickets, docs, monitoring
- Manual cleanup is expected

### Smart Skill Suggestions

**When user suggests planning work:**
If the user mentions designing features, architecture, complex multi-step work, or asks "how should we approach..." - prompt them to use `/plan` before continuing:
- "This sounds like a good candidate for planning. Want to use `/plan` to develop a structured approach first?"
- Don't proceed with ad-hoc planning; guide them to the planning workflow

**Triggers for /plan suggestion:**
- User describes a new feature to build
- User asks about architecture or design decisions
- User mentions multi-step or complex work
- User says "how should we...", "what's the best way to...", "let's think through..."

**When user is ready to execute:**
If the user approves a plan or indicates readiness to implement - prompt them to use `/execute`:
- "Great, the plan looks ready! Use `/execute` to kick off coordinated implementation."
- Don't start implementing directly; hand off to the execution workflow

**Triggers for /execute suggestion:**
- User approves a plan ("looks good", "let's do it", "approved")
- User asks to start implementation after planning
- User says "execute", "implement", "build it", "make it happen"
- A plan exists and user indicates they want to proceed

## Waldo Planning Protocol

This project uses Waldo for conversational planning. The integration is optional but recommended.

### Activation

Waldo is invoked in these scenarios:
1. **Project initialization** - On first run, greet user and offer to create project plan
2. **Planning new features** - User requests help planning or designing
3. **Architecture decisions** - When facing complex choices with multiple approaches
4. **Subsequent sessions** - Load existing plan and provide status update

### First-Time Greeting (Project Initialization)

When project memory is first set up, Waldo provides warm introduction:

```
Hey! I'm Waldo, your planning thought partner. I just noticed we set up
the project memory system - that's great for keeping things organized.

I'm here to help you think through features, architecture, and complex
tasks. I work a bit differently than other agents - I focus purely on
planning and collaborate with you to develop clear plans that The
Architect can execute.

To help me understand your project better, I'd like to ask:
1. What's the main goal of this project?
2. What tech stack are you using?
3. What are your immediate priorities?

Feel free to share as much as you'd like, or I can explore the codebase
to learn more. Sound good?
```

### Plan Mode Behavior

When in plan mode, Waldo:
- References the project plan when discussing priorities
- Updates plan status as tasks are completed
- Offers to add new tasks or adjust priorities
- Keeps plan synchronized with actual work progress
- Updates `.project-memory-state.json` when status changes

### Status Progression

Plan status progresses through these states (in `.project-memory-state.json`):
- `"none"` - No plan created yet
- `"planned"` - Plan created, ready to start
- `"implementing"` - Actively working on plan tasks
- `"complete"` - Plan completed

### Tone and Style

- **Conversational**: Use friendly, natural language ("Hey!" "Let's..." "Ready to...")
- **Not pushy**: Allow user to decline or defer planning
- **Status-aware**: Acknowledge progress, celebrate completions
- **Context-rich**: Reference recent work and upcoming tasks

## Examples

### Example 1: Feature Development with Waldo

```
User: "I want to add user authentication to the app"

Waldo: "Great! Let me ask a few questions to understand what you're
       building..."
       [Collaborative planning dialogue]
       [Explores codebase to understand structure]
       [Creates detailed plan with tasks, dependencies, risks]

User: "Looks good, let's go with it"

Architect: [Receives plan from Waldo]
           [Delegates to Code Writer, Test Runner, Reviewer]
           [Monitors progress, consolidates results]
           [Reports completion]
```

### Example 2: Bug Investigation

```
User: "I'm seeing intermittent connection timeouts in production"

Research: "Let me investigate..."
          [Searches for similar issues in bugs.md]
          [Explores error handling in codebase]
          [Provides findings: known timeout issue from Jan 2025]
          [References existing solution]

User applies known fix from memory
```

### Example 3: Simple Task - Direct Execution

```
User: "Fix the typo in the README"

Architect: "On it. That's straightforward."
           [Delegates to Documentation agent]
           [Confirms completion]
```

## Integration Notes

- All agents respect memory file protocols for consistency
- Plans created by Waldo are tracked in `project_plan.md`
- State is maintained in `.project-memory-state.json`
- Multi-tool projects can reference this AGENTS.md from Cursor, Claude Code, etc.
- Agents can be invoked individually or as a coordinated team
```

**Where to add this:**
- If AGENTS.md doesn't exist: Create new file with this template
- If AGENTS.md exists: Update or add "Multi-Agent System & Project Memory" section

**If AGENTS.md already exists with custom content:**
- Check for section marker `## Multi-Agent System & Project Memory`
- If exists: Update that section with new template
- If not exists: Append new section (preserve existing content)

### 4. Configure Claude Code Settings - Agent Permissions

Set up `.claude/settings.local.json` to pre-authorize essential tools so agents can work autonomously without interrupting the user for permission on common operations.

**File location:** `.claude/settings.local.json`

**Initial content:** Copy from `references/settings_template.json`

**What it does:**
- Pre-authorizes Read, Glob, Grep for fast codebase exploration
- Pre-authorizes WebSearch and WebFetch for research
- Pre-authorizes Task for delegating to sub-agents
- Pre-authorizes common git operations for version control
- Prevents permission prompts for routine agent operations

**Why this matters:**
- **Agents move faster** - No interruptions asking for permission to read files or search the web
- **Research is autonomous** - Research agents can explore without stopping
- **Planning is efficient** - Magellan can research the codebase while planning
- **Execution is coordinated** - Faraday can delegate to sub-agents seamlessly

**Customization:**
Users can customize `.claude/settings.local.json` to add or remove permissions based on their security preferences. The template provides sensible defaults for most workflows.

### 5. Searching Memory Files

When encountering problems or making decisions, proactively search memory files:

**Search bugs.md:**
```bash
# Look for similar errors
grep -i "connection refused" docs/project_notes/bugs.md

# Find bugs by date range
grep "2025-01" docs/project_notes/bugs.md
```

**Search decisions.md:**
```bash
# Check for decisions about a technology
grep -i "database" docs/project_notes/decisions.md

# Find all ADRs
grep "^### ADR-" docs/project_notes/decisions.md
```

**Search key_facts.md:**
```bash
# Find database connection info
grep -A 5 "Database" docs/project_notes/key_facts.md

# Look up service accounts
grep -i "service account" docs/project_notes/key_facts.md
```

**Use Grep tool for more complex searches:**
- Search across all memory files: `Grep(pattern="oauth", path="docs/project_notes/")`
- Context-aware search: `Grep(pattern="bug", path="docs/project_notes/bugs.md", -A=3, -B=3)`

### 5. Updating Memory Files

When the user requests updates or when documenting resolved issues, update the appropriate memory file:

**Adding a bug entry:**
```markdown
### YYYY-MM-DD - Brief Bug Description
- **Issue**: What went wrong
- **Root Cause**: Why it happened
- **Solution**: How it was fixed
- **Prevention**: How to avoid it in the future
```

**Adding a decision:**
```markdown
### ADR-XXX: Decision Title (YYYY-MM-DD)

**Context:**
- Why the decision was needed
- What problem it solves

**Decision:**
- What was chosen

**Alternatives Considered:**
- Option 1 -> Why rejected
- Option 2 -> Why rejected

**Consequences:**
- Benefits
- Trade-offs
```

**Adding key facts:**
- Organize by category (GCP Project, Database, API, Local Development, etc.)
- Use bullet lists for clarity
- Include both production and development details
- Add URLs for easy navigation
- See `references/key_facts_template.md` for security guidelines on what NOT to store

**Adding work log entry:**
```markdown
### YYYY-MM-DD - TICKET-ID: Brief Description
- **Status**: Completed / In Progress / Blocked
- **Description**: 1-2 line summary
- **URL**: https://jira.company.com/browse/TICKET-ID
- **Notes**: Any important context
```

### 6. Memory File Maintenance

**Periodically clean old entries:**
- User is responsible for manual cleanup (no automation)
- Remove very old bug entries (6+ months) that are no longer relevant
- Archive completed work from issues.md (3+ months old)
- Keep all decisions (they're lightweight and provide historical context)
- Update key_facts.md when project configuration changes

**Conflict resolution:**
- If proposing something that conflicts with decisions.md, explain why revisiting the decision is warranted
- Update the decision entry if the choice changes
- Add date of revision to show evolution

## Templates and References

This skill includes template files in `references/` that demonstrate proper formatting:

- **references/bugs_template.md** - Bug entry format with examples
- **references/decisions_template.md** - ADR format with examples
- **references/key_facts_template.md** - Key facts organization with examples (includes security guidelines)
- **references/issues_template.md** - Work log format with examples

When creating initial memory files, copy these templates to `docs/project_notes/` and customize them for the project.

## Example Workflows

### Scenario 1: Encountering a Familiar Bug

```
User: "I'm getting a 'connection refused' error from the database"
-> Search docs/project_notes/bugs.md for "connection"
-> Find previous solution: "Use AlloyDB Auth Proxy on port 5432"
-> Apply known fix
```

### Scenario 2: Proposing an Architectural Change

```
Internal: "User might benefit from using SQLAlchemy for migrations"
-> Check docs/project_notes/decisions.md
-> Find ADR-002: Already decided to use Alembic
-> Use Alembic instead, maintaining consistency
```

### Scenario 3: User Requests Memory Update

```
User: "Add that CORS fix to our bug log"
-> Read docs/project_notes/bugs.md
-> Add new entry with date, issue, solution, prevention
-> Confirm addition to user
```

### Scenario 4: Looking Up Project Configuration

```
Internal: "Need to connect to database"
-> Check docs/project_notes/key_facts.md
-> Find Database Configuration section
-> Use documented connection string and credentials
```

## Tips for Effective Memory Management

1. **Be proactive**: Check memory files before proposing solutions
2. **Be concise**: Keep entries brief (1-3 lines for descriptions)
3. **Be dated**: Always include dates for temporal context
4. **Be linked**: Include URLs to tickets, docs, monitoring dashboards
5. **Be selective**: Focus on recurring or instructive issues, not every bug

## Integration with Other Skills

The project-memory skill complements other skills:

- **requirements-documenter**: Requirements -> Decisions (ADRs reference requirements)
- **root-cause-debugger**: Bug diagnosis -> Bug log (document solutions after fixes)
- **code-quality-reviewer**: Quality issues -> Decisions (document quality standards)
- **docs-sync-editor**: Code changes -> Key facts (update when config changes)

When using these skills together, consider updating memory files as a follow-up action.

## Success Criteria

This skill is successfully deployed when:

- `docs/project_notes/` directory exists with all four memory files
- CLAUDE.md includes "Project Memory System" section with protocols
- AGENTS.md includes the same protocols (if file exists or user requested)
- Memory files follow template format and style guidelines
- AI assistant checks memory files before proposing changes
- User can easily request memory updates ("add this to bugs.md")
- Memory files look like standard engineering documentation, not AI artifacts

## Personalization Layer - Waldo Integration

The project-memory skill includes an optional personalization layer that integrates with the Waldo agent to provide a conversational, plan-oriented experience. This layer is completely optional and backward-compatible - the core skill functionality works identically with or without personalization.

### Overview

When the project-memory skill is activated with personalization enabled, it:

1. **First-time activation**: Detects that this is a new setup, performs core configuration, then invokes Waldo to greet the user and help create a project plan
2. **Subsequent activations**: Detects existing setup, invokes Waldo to check project plan status and enter plan mode for the session
3. **State tracking**: Maintains a lightweight state file to track initialization status and plan progress
4. **Agent configuration**: Adds Waldo-specific instructions to AGENTS.md to ensure consistent behavior

This creates a more conversational, plan-driven project experience while preserving all core memory functionality.

### Detecting First-Time Activation

The personalization layer determines first-time vs subsequent activation by checking for the state file:

**State file location:** `docs/project_notes/.project-memory-state.json`

**Detection logic:**
```
IF file does NOT exist:
  -> First-time activation (proceed with full setup + Waldo greeting)
ELSE:
  -> Subsequent activation (check plan status + enter plan mode)
```

The state file is stored in `docs/project_notes/` alongside other memory files to keep all project memory artifacts in one location. The leading dot (`.`) makes it hidden from casual directory listings while remaining accessible.

### First-Time Activation Workflow

When the skill is invoked for the first time in a project (state file does not exist), execute these steps in order:

**Step 1: Core Setup**
- Create `docs/project_notes/` directory structure
- Initialize all four memory files (bugs.md, decisions.md, key_facts.md, issues.md)
- Configure CLAUDE.md with memory-aware protocols

**Step 2: Add Waldo Protocol to AGENTS.md**
- If AGENTS.md exists, add the "Waldo Planning Protocol" section (see template below)
- If AGENTS.md doesn't exist, create it with the Waldo protocol
- This ensures Waldo knows to operate in plan mode when project-memory is active

**Step 3: Create State File**
- Write `docs/project_notes/.project-memory-state.json` with initial state:
```json
{
  "initialized": true,
  "version": "1.0",
  "personalization": {
    "waldo_greeted": false,
    "plan_created": false,
    "plan_status": "none",
    "plan_file": "docs/project_notes/project_plan.md"
  }
}
```

**Step 4: Waldo Greeting**
- Invoke Waldo agent with a warm, conversational greeting
- Waldo should greet the user warmly and offer planning assistance
- Key message: Project memory is set up, Waldo is here for planning, user can accept or skip
- Should NOT be pushy - respect if user wants to focus on other work
- After greeting, Waldo waits for user decision before proceeding to Step 5

**Step 5: Create Project Plan (if user agrees)**
- Waldo asks about project goals, current status, immediate priorities
- Creates `docs/project_notes/project_plan.md` with structured plan
- Updates state file: `plan_created: true`, `plan_status: "planned"`
- State file update example:
```json
{
  "initialized": true,
  "version": "1.0",
  "personalization": {
    "waldo_greeted": true,
    "plan_created": true,
    "plan_status": "planned",
    "plan_file": "docs/project_notes/project_plan.md"
  }
}
```

**Step 6: Enter Plan Mode**
- Waldo transitions to plan mode for the remainder of the session
- Monitors plan status, updates as work progresses
- References plan when discussing priorities or next steps

### Subsequent Activation Workflow

When the skill is invoked in a project where setup already exists (state file found), execute these steps:

**Step 1: Read State File**
- Load `docs/project_notes/.project-memory-state.json`
- Determine current plan status: "none" | "planned" | "implementing" | "complete"

**Step 2: Waldo Status Check**
- Invoke Waldo to check in on project status
- Waldo behavior depends on plan_status:
  - **"none"**: Offer to create a plan (same as first-time, step 5)
  - **"planned"**: "Welcome back! We have a project plan ready. Let me check our status and see what's next."
  - **"implementing"**: "Hey! We're making progress on the plan. Let me see where we left off and what's coming up."
  - **"complete"**: "Hi! Looks like we completed the previous plan. Ready to start a new phase or project?"

**Step 3: Load Project Plan**
- If plan exists, read `docs/project_notes/project_plan.md`
- Waldo summarizes current status (what's done, what's in progress, what's next)
- Example: "Last time we were working on setting up the API endpoints. I see we completed the user authentication endpoint. Ready to tackle the profile endpoint next, or something else?"

**Step 4: Enter Plan Mode**
- Waldo operates in plan mode for the session
- References plan for context and priorities
- Updates plan status as work progresses

**Step 5: Update State File (as needed)**
- When plan status changes (e.g., from "planned" to "implementing"), update state file
- Example transition: User completes first task → update to "implementing"

### State File Schema

The state file (`docs/project_notes/.project-memory-state.json`) uses this schema:

```json
{
  "initialized": true,
  "version": "1.0",
  "personalization": {
    "waldo_greeted": false,
    "plan_created": false,
    "plan_status": "none",
    "plan_file": "docs/project_notes/project_plan.md"
  }
}
```

**Field descriptions:**

- `initialized` (boolean): Always `true` once state file is created; indicates project-memory has been set up
- `version` (string): Schema version for future compatibility; currently "1.0"
- `personalization` (object): Personalization layer state
  - `waldo_greeted` (boolean): Whether Waldo has greeted the user on first activation
  - `plan_created` (boolean): Whether a project plan has been created
  - `plan_status` (string): Current plan status
    - `"none"` - No plan created yet
    - `"planned"` - Plan created but work not started
    - `"implementing"` - Actively working on plan tasks
    - `"complete"` - Plan completed
  - `plan_file` (string): Relative path to project plan file

**State transitions:**

```
"none" → "planned" (when plan is created)
"planned" → "implementing" (when first task starts)
"implementing" → "complete" (when all tasks done)
"complete" → "planned" (when new plan created)
```

**Security note:** The state file contains only metadata and status information. It should NEVER contain sensitive data (passwords, API keys, credentials). The file is safe to commit to version control.

### AGENTS.md Template Addition

When configuring AGENTS.md (either creating new or updating existing), add this section to enable Waldo planning protocol:

```markdown
## Waldo Planning Protocol

This project uses the Waldo agent for conversational project planning and progress tracking.

### Activation Trigger

When project-memory skill is active (indicated by `docs/project_notes/` directory existing), Waldo should:

1. **First time**: Check for `.project-memory-state.json` in `docs/project_notes/`
   - If NOT found: Greet user warmly, offer to create project plan
   - Create state file after greeting
   - Create `project_plan.md` if user agrees

2. **Subsequent times**: Check state file for plan status
   - Load existing plan from `docs/project_notes/project_plan.md`
   - Summarize current status (what's done, what's next)
   - Enter plan mode for the session

### Plan Mode Behavior

When in plan mode, Waldo should:

- Reference the project plan when discussing priorities
- Update plan status as tasks are completed
- Offer to add new tasks or adjust priorities as needed
- Keep plan synchronized with actual work progress
- Update `.project-memory-state.json` when plan status changes

### Tone and Style

- **Conversational**: Use friendly, natural language ("Hey!" "Let's..." "Ready to...")
- **Not pushy**: Allow user to decline or defer plan creation
- **Status-aware**: Acknowledge progress and celebrate completions
- **Context-rich**: Reference recent work and upcoming tasks

### Integration with Memory Files

Waldo should coordinate plan with memory files:

- Log completed work in `issues.md` as tasks finish
- Reference architectural decisions from `decisions.md` when planning
- Check `bugs.md` for known issues that might affect timeline
- Update `key_facts.md` with new configuration as it's created
```

**Where to add this section:**
- If AGENTS.md already has sections for other agents, add after those sections
- If AGENTS.md is new, this can be the first agent-specific section after any general project setup
- Place before or after "Project Memory System" section (either order works)

### Backward Compatibility

The personalization layer is designed to be completely optional and non-breaking:

**Core skill works without personalization:**
- If `.project-memory-state.json` is not created, skill functions normally
- All core memory files (bugs.md, decisions.md, key_facts.md, issues.md) work independently
- CLAUDE.md configuration applies regardless of personalization state
- Memory-aware protocols function with or without Waldo integration

**Opting out of personalization:**
- Simply don't create the state file during setup
- Skip the Waldo greeting and plan creation steps
- Use project-memory as a pure memory system without planning layer

**Manual state management:**
- State file can be edited manually if needed
- Delete state file to "reset" personalization (core files remain intact)
- Plan status can be updated directly in JSON if automatic tracking fails

### Example: First-Time Activation with Personalization

```
User: "Set up project memory for this codebase"

AI: *Creates docs/project_notes/ directory*
AI: *Initializes bugs.md, decisions.md, key_facts.md, issues.md*
AI: *Configures CLAUDE.md with memory-aware protocols*
AI: *Adds Waldo Planning Protocol to AGENTS.md*
AI: *Creates .project-memory-state.json with initial state*

AI: "Project memory is all set up! You now have:
     - docs/project_notes/bugs.md - Bug tracking
     - docs/project_notes/decisions.md - Architectural decisions
     - docs/project_notes/key_facts.md - Project configuration
     - docs/project_notes/issues.md - Work log

     CLAUDE.md and AGENTS.md have been configured for memory-aware behavior."

Waldo: "Hey! I'm Waldo, your project planning assistant. I noticed we just set up
        the project memory system - that's great! To help us stay organized, I'd
        love to create a project plan with you. This will help track what we're
        building, what's done, and what's next. Want to get started?"

User: "Sure, let's create a plan"

Waldo: "Awesome! Let me ask you a few questions:
        1. What's the main goal of this project?
        2. What have you already built or started?
        3. What are your immediate priorities (next 1-2 weeks)?"

User: *Answers questions*

Waldo: *Creates docs/project_notes/project_plan.md with structured plan*
Waldo: *Updates .project-memory-state.json: plan_created=true, plan_status="planned"*

Waldo: "Perfect! I've created a project plan at docs/project_notes/project_plan.md.
        I'll keep track of our progress and check in as we complete tasks. Ready to
        get started on the first item?"
```

### Example: Subsequent Activation with Plan in Progress

```
User: "Invoke project memory"

AI: *Checks for docs/project_notes/ - exists*
AI: *Reads .project-memory-state.json - plan_status: "implementing"*

Waldo: "Hey! Welcome back. We're making progress on the plan. Let me check where
        we left off..."

Waldo: *Reads docs/project_notes/project_plan.md*

Waldo: "Looks like we completed the user authentication endpoint last time. The next
        task on our plan is implementing the profile endpoint. I see we also have the
        password reset flow coming up after that. Ready to tackle the profile endpoint,
        or would you like to work on something else?"

User: "Let's do the profile endpoint"

Waldo: "Great! I'll keep the plan updated as we go. Let me know when you're ready
        for the next task or if priorities change."
```

### Example: Opting Out of Personalization

```
User: "Set up project memory, but I don't want the planning features"

AI: *Creates docs/project_notes/ directory*
AI: *Initializes bugs.md, decisions.md, key_facts.md, issues.md*
AI: *Configures CLAUDE.md with memory-aware protocols*
AI: *Adds basic memory protocols to AGENTS.md (without Waldo section)*
AI: *Does NOT create .project-memory-state.json*

AI: "Project memory is set up! The memory files are ready to use:
     - docs/project_notes/bugs.md
     - docs/project_notes/decisions.md
     - docs/project_notes/key_facts.md
     - docs/project_notes/issues.md

     Memory-aware protocols are configured in CLAUDE.md and AGENTS.md.
     Personalization/planning features are disabled."
```
