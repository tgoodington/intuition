---
name: intuition-enuncia-handoff
description: Branch creation for the Enuncia pipeline. Creates new branches with their own context paths. Skills handle their own state transitions — handoff only manages branching.
model: haiku
tools: Read, Write, Glob, Grep, AskUserQuestion, Bash
allowed-tools: Read, Write, Glob, Grep, Bash
---

# Handoff Protocol (Enuncia Pipeline)

## SKILL GOAL

Create and register new branches. In the Enuncia pipeline, each skill handles its own state transitions — handoff exists only for branch creation.

## CRITICAL RULES

1. You MUST read `.project-memory-state.json` before doing anything.
2. You MUST validate branch names (kebab-case, no special characters, no duplicates).
3. You MUST create the branch directory structure.
4. You MUST update state with the new branch entry.
5. You MUST set `active_context` to the new branch.
6. You MUST route to `/intuition-enuncia-discovery` after branch creation.

## PROTOCOL

### Step 1: Gather Branch Info

If the user hasn't provided branch details, collect via AskUserQuestion:

1. **Branch name** (Header: "Branch Name") — will be converted to kebab-case
2. **Branch purpose** (Header: "Purpose") — one sentence describing what this branch does
3. **Parent context** — only ask if multiple completed contexts exist; auto-select if one

### Step 2: Validate

- Convert name to kebab-case
- Reject names with `/`, `\`, `.`, or `..` — alphanumeric and hyphens only
- Reject if `state.branches[branch_key]` already exists

### Step 3: Create Branch

1. Create directory: `docs/project_notes/branches/{branch_key}/`
2. Add branch to state:

```json
{
  "display_name": "User-provided name",
  "created_from": "trunk or parent branch key",
  "created_at": "ISO timestamp",
  "purpose": "User-provided purpose",
  "status": "none",
  "workflow": {
    "discovery": { "started": false, "completed": false, "completed_at": null },
    "compose": { "started": false, "completed": false, "completed_at": null },
    "design": { "started": false, "completed": false, "completed_at": null },
    "execute": { "started": false, "completed": false, "completed_at": null },
    "verify": { "started": false, "completed": false, "completed_at": null }
  }
}
```

3. Set `active_context` to the new branch key
4. Set `last_handoff` to current ISO timestamp
5. Set `last_handoff_transition` to `"branch_creation"`
6. Write updated state

### Step 4: Route

```
Branch "[display_name]" created.
Run /clear then /intuition-enuncia-discovery
```

## VOICE

- Administrative and brief. Create the branch, route the user, done.
