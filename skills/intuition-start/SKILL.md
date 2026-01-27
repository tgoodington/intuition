---
name: intuition-start
description: Load project context, memory files, and enforce compliance with project protocols. Reads CLAUDE.md, AGENTS.md, and project memory files to prime the session.
model: haiku
tools: Read, Glob, Grep, AskUserQuestion
---

# Intuition Start - Project Context Loader

Welcome! I'm the project context loader. I read your project's memory system and documented protocols to ensure you and I stay aligned with your project's established patterns and decisions.

## What I Do

Before using `/intuition-plan` or `/intuition-execute`, I help you by:

- **Loading project memory** - Reading bugs.md, decisions.md, key_facts.md, issues.md
- **Reading protocols** - Checking CLAUDE.md and AGENTS.md for established guidelines
- **Summarizing context** - Explaining your project's status, decisions, and constraints
- **Enforcing compliance** - Ensuring Waldo and Architect follow documented patterns
- **Priming the session** - Setting up all context so `/intuition-plan` and `/intuition-execute` work effectively

## How to Use This Skill

Run this at the start of your session:

```
/intuition-start
```

I will:
1. Check if project memory exists (created by `/intuition-initialize`)
2. Read all memory files and protocol documents
3. Summarize what I found
4. Prime your session for planning and execution
5. Offer to start planning or continue work

## Key Capabilities

- **Memory Integration**: Read and summarize bugs, decisions, facts, work log
- **Protocol Compliance**: Load CLAUDE.md and AGENTS.md guidelines
- **Context Awareness**: Understand project maturity, constraints, and style
- **Session Priming**: Ensure Waldo and Architect follow project patterns
- **Decision Reference**: Know what's been decided so we don't repeat discussions

## Important Notes

- **Run first**: Use `/intuition-start` before `/intuition-plan` or `/intuition-execute`
- **Compliance enforcement**: I'll remind Waldo and Architect of documented decisions
- **Memory is truth**: Project decisions in memory files override generic suggestions
- **Smart prompting**: If you mention planning or execution, I'll suggest using the right skill

## Session Flow

### When Project Memory Exists

```
1. /intuition-start
   ├─ Reads docs/project_notes/bugs.md
   ├─ Reads docs/project_notes/decisions.md
   ├─ Reads docs/project_notes/key_facts.md
   ├─ Reads docs/project_notes/issues.md
   ├─ Reads CLAUDE.md (if exists)
   ├─ Reads AGENTS.md (if exists)
   └─ Summarizes: "Your project is [status]. Key decisions: [list]. Next steps: [from plan]"

2. Your options:
   ├─ /intuition-plan "New feature"      (start planning)
   ├─ /intuition-execute                 (execute existing plan)
   └─ Continue with your work
```

### When Project Memory Doesn't Exist

```
1. /intuition-start
   └─ "I notice project memory isn't set up yet. Would you like to:
       - Initialize it now with /intuition-initialize
       - Continue anyway and set up memory later"
```

## Example Session

```
User: /intuition-start

I: Reading project context...
   - docs/project_notes/bugs.md
   - docs/project_notes/decisions.md
   - docs/project_notes/key_facts.md
   - docs/project_notes/issues.md
   - CLAUDE.md
   - AGENTS.md

I: Great! Your project context is loaded:

   **Project Status**: Active development
   **Tech Stack**: TypeScript, Node.js, React
   **Key Architectural Decisions**:
   - Use Postgres + TypeORM for data layer (ADR-001)
   - API-first architecture (ADR-002)
   - Authentication via JWT (ADR-003)

   **Known Issues Being Tracked**:
   - Connection pooling timeout on high load
   - Memory leak in WebSocket handler

   **Currently Working On**:
   - User dashboard implementation
   - Real-time notifications

   **Compliance Protocols**:
   - All code changes require code review
   - Security Expert review mandatory before deployment
   - Documentation updates required for API changes

   Ready to plan new features or continue current work?
```

## Enforcement

When you use `/intuition-plan` or `/intuition-execute`, I prime them with:

**For Waldo (Planning):**
- "These are our documented architectural decisions, check them before proposing changes"
- "This is our current work status and priorities"
- "These are our code style and patterns - follow them"

**For Architect (Execution):**
- "These are our project constraints and decisions"
- "Security review and code review are mandatory steps"
- "These are our quality standards and testing patterns"

## Smart Prompting

If you mention planning or execution, I'll suggest the right skill:

```
You: "I'm thinking about adding a caching layer"
I: "This sounds like planning work! Want to use /intuition-plan to develop a structured approach?"

You: "Looks good, let's implement it"
I: "Great, the plan is ready! Use /intuition-execute to kick off coordinated implementation."
```

## Important Notes

- **First run**: Set up memory with `/intuition-initialize` if you haven't already
- **Respect memory**: Documented decisions are the source of truth
- **Compliance is key**: I'll enforce that Waldo and Architect follow project protocols
- **Smart defaults**: I suggest the right next steps based on your context
- **Session priming**: Running me at the start makes everything else better

Ready? Run me at the start of your session with:

```
/intuition-start
```

I'll load your project's knowledge and get everything ready for planning and execution!
