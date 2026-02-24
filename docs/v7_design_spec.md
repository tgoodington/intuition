# Intuition v7.0 Design Specification
## Branch/Trunk Workflow + Coding Expert

---

## Table of Contents

1. [Overview](#1-overview)
2. [Folder Structure](#2-folder-structure)
3. [State Schema v4.0](#3-state-schema-v40)
4. [New Skill: intuition-engineer](#4-new-skill-intuition-engineer)
5. [Skill Changes: intuition-start](#5-skill-changes-intuition-start)
6. [Skill Changes: intuition-prompt](#6-skill-changes-intuition-prompt)
7. [Skill Changes: intuition-plan](#7-skill-changes-intuition-plan)
8. [Skill Changes: intuition-design](#8-skill-changes-intuition-design)
9. [Skill Changes: intuition-execute](#9-skill-changes-intuition-execute)
10. [Skill Changes: intuition-handoff](#10-skill-changes-intuition-handoff)
11. [Skill Changes: intuition-initialize](#11-skill-changes-intuition-initialize)
12. [Install Script Changes](#12-install-script-changes)
13. [MEMORY.md Updates](#13-memorymd-updates)
14. [Migration Path](#14-migration-path)

---

## 1. Overview

### What Changes

v7.0 introduces two major capabilities:

1. **Branch/Trunk Workflow Model**: The first prompt→execute cycle becomes the "trunk." After trunk completes, users can create branches — independent prompt→execute cycles that build on, extend, or diverge from trunk (or from other completed branches). Each branch is aware of its lineage and the plan considers how branch work intersects with its parent.

2. **Coding Expert Skill (`intuition-engineer`)**: A new opus-level skill that serves dual roles:
   - **Troubleshooter** (user-invoked): After a context completes execution, users can invoke the engineer to diagnose and fix issues in any completed context.
   - **Execute Consultant** (subagent): Execute gains a new "Senior Engineer" opus subagent for tasks requiring holistic codebase reasoning.

### Core Principles

- **Trunk is permanent**: Once complete, the trunk is the foundational reference. It is never re-run.
- **Branches are the iteration mechanism**: New features, changes, or explorations happen on branches.
- **Engineer is the maintenance mechanism**: Broken things get fixed, not re-planned.
- **Shared memory persists across all contexts**: `key_facts.md`, `decisions.md`, `issues.md`, `bugs.md` stay at the root and accumulate project-wide knowledge.
- **Context path abstraction**: All skills use a dynamic `{context_path}` for file operations, resolved from the active context in state.

### Skill Count

v7.0: 11 skills (add `intuition-engineer`)

### Post-Completion Flow

When start detects a completed context, it offers two choices:
1. **Create a branch** — begins a new prompt→execute cycle informed by parent context
2. **Open the engineer** — troubleshoot issues in any completed context

---

## 2. Folder Structure

### New Layout

```
docs/project_notes/
├── trunk/                              ← Trunk-specific workflow artifacts
│   ├── discovery_brief.md
│   ├── discovery_output.json
│   ├── planning_brief.md
│   ├── plan.md
│   ├── design_brief.md
│   ├── design_spec_*.md
│   ├── execution_brief.md
│   └── .planning_research/
│       ├── orientation.md
│       ├── decisions_log.md
│       └── decision_*.md
│
├── branches/                           ← Branch-specific workflow artifacts
│   ├── feature-auth/
│   │   ├── discovery_brief.md
│   │   ├── discovery_output.json
│   │   ├── planning_brief.md
│   │   ├── plan.md
│   │   ├── design_brief.md
│   │   ├── design_spec_*.md
│   │   ├── execution_brief.md
│   │   └── .planning_research/
│   │
│   └── ui-overhaul/
│       └── ...
│
├── .project-memory-state.json          ← Root level, tracks ALL contexts
├── key_facts.md                        ← Shared across all contexts
├── decisions.md                        ← Shared across all contexts
├── issues.md                           ← Shared across all contexts
└── bugs.md                             ← Shared across all contexts
```

### Path Resolution

All skills resolve file paths through a **context path** derived from state:

| Active Context | Context Path | Example Full Path |
|---------------|-------------|-------------------|
| `trunk` | `docs/project_notes/trunk/` | `docs/project_notes/trunk/plan.md` |
| Branch `feature-auth` | `docs/project_notes/branches/feature-auth/` | `docs/project_notes/branches/feature-auth/plan.md` |

**Shared files** (key_facts, decisions, issues, bugs) always resolve to `docs/project_notes/` regardless of active context.

### Context Path Formula

```
IF active_context == "trunk":
    context_path = "docs/project_notes/trunk/"
ELSE:
    context_path = "docs/project_notes/branches/{active_context}/"
```

Every skill that reads or writes workflow artifacts (discovery_brief.md, plan.md, design_spec_*.md, etc.) MUST use context_path. This is the single most pervasive change across all skills.

---

## 3. State Schema v4.0

### Full Schema

```json
{
  "initialized": true,
  "version": "4.0",
  "active_context": "trunk",
  "trunk": {
    "status": "none | prompt | planning | design | executing | complete",
    "workflow": {
      "prompt": {
        "started": false,
        "completed": false,
        "started_at": null,
        "completed_at": null,
        "output_files": []
      },
      "planning": {
        "started": false,
        "completed": false,
        "completed_at": null,
        "approved": false
      },
      "design": {
        "started": false,
        "completed": false,
        "completed_at": null,
        "items": [],
        "current_item": null
      },
      "execution": {
        "started": false,
        "completed": false,
        "completed_at": null
      }
    }
  },
  "branches": {},
  "last_handoff": null,
  "last_handoff_transition": null
}
```

### Branch Entry Schema

When a branch is created, it gets added to `branches`:

```json
{
  "branches": {
    "feature-auth": {
      "display_name": "OAuth2 Authentication",
      "created_from": "trunk",
      "created_at": "2026-02-13T10:00:00Z",
      "purpose": "Add OAuth2 support for third-party login",
      "status": "none | prompt | planning | design | executing | complete",
      "workflow": {
        "prompt": { "started": false, "completed": false, "started_at": null, "completed_at": null, "output_files": [] },
        "planning": { "started": false, "completed": false, "completed_at": null, "approved": false },
        "design": { "started": false, "completed": false, "completed_at": null, "items": [], "current_item": null },
        "execution": { "started": false, "completed": false, "completed_at": null }
      }
    }
  }
}
```

### Key Design Decisions

1. **`active_context`** — Tracks which context is currently being worked on. Set by handoff when branch creation happens or when a branch workflow begins. All skills read this to determine their context_path.

2. **Each context has its own workflow pipeline** — Trunk and every branch have independent `status` + `workflow` objects. A branch can be in "planning" while trunk is "complete."

3. **`created_from` tracks lineage** — Branches reference their parent. This enables plan to read the parent's plan.md for intersection analysis. Branches can be created from other completed branches, forming a tree.

4. **`purpose` is captured at creation** — Brief description captured when the user creates a branch, used by start for context display and by plan for intersection reasoning.

5. **`display_name` is human-readable** — The branch key is snake_case for paths, display_name is for UI presentation.

### Reading Active Context

All skills that need to find files use this pattern:

```
1. Read .project-memory-state.json
2. Get active_context value
3. IF active_context == "trunk":
     context_path = "docs/project_notes/trunk/"
     workflow = state.trunk
   ELSE:
     context_path = "docs/project_notes/branches/{active_context}/"
     workflow = state.branches[active_context]
4. Use context_path for all file reads/writes
5. Use workflow for status checks
```

---

## 4. New Skill: intuition-engineer

### SKILL.md Specification

```yaml
---
name: intuition-engineer
description: Senior software engineer. Troubleshoots issues in completed workflow contexts with holistic codebase awareness. Delegates fixes to coding subagents while maintaining full-system context.
model: opus
tools: Read, Write, Glob, Grep, Task, AskUserQuestion, Bash, mcp__ide__getDiagnostics
allowed-tools: Read, Write, Glob, Grep, Task, Bash, mcp__ide__getDiagnostics
---
```

### Behavioral Overview

The engineer is a senior software engineer who thinks holistically. Every change is evaluated in context of the entire codebase. The engineer never makes isolated fixes — it traces impact across the system before touching anything.

### Protocol Flow

```
Step 1: Read state, identify completed contexts
Step 2: Present context choice (if multiple completed)
Step 3: Load context artifacts (plan, design specs, execution brief)
Step 4: Ask user to describe the issue
Step 5: Investigate holistically (codebase analysis)
Step 6: Present diagnosis and proposed fix
Step 7: Delegate fix to coding subagents
Step 8: Verify fix (test, review, impact analysis)
Step 9: Report results
```

### Step 1-2: Context Selection

Read `.project-memory-state.json`. Build list of completed contexts:
- If `trunk.status == "complete"` → add "Trunk" to list
- For each branch where `status == "complete"` → add branch display_name to list

```
IF only one completed context:
  → Auto-select it. Tell user: "Working in [context name]."
IF multiple completed contexts:
  → Use AskUserQuestion:
    "Which area needs attention?"
    Options: [list each completed context with its purpose]
IF no completed contexts:
  → STOP: "No completed workflow contexts found. The engineer works on
    completed implementations. Run the workflow to completion first."
```

### Step 3: Load Context

After selecting a context, read:
- `{context_path}/plan.md` — what was planned
- `{context_path}/execution_brief.md` — what was executed
- `{context_path}/design_spec_*.md` — design decisions (if any)
- `docs/project_notes/key_facts.md` — project-wide knowledge
- `docs/project_notes/decisions.md` — architectural decisions
- `docs/project_notes/bugs.md` — known bugs

Do NOT read code files yet. Wait for the user to describe the issue — then investigate targeted areas.

### Step 4: Issue Description

Ask via AskUserQuestion:

```
"I've loaded the [context name] context. What's the issue?

You can paste error messages, describe unexpected behavior,
or point me to specific files."

Header: "Issue"
Options:
- "Runtime error / crash"
- "Unexpected behavior"
- "Performance issue"
- "Code quality concern"
```

After the user describes the issue, proceed to investigation.

### Step 5: Holistic Investigation

This is what distinguishes the engineer from a simple code fixer.

**Investigation Protocol:**

1. **Trace the symptom** — Read the file(s) directly related to the error/issue.
2. **Map the blast radius** — Use Grep/Glob to find all files that import, reference, or depend on the affected code.
3. **Check upstream** — What feeds into this code? Read callers, data sources, configuration.
4. **Check downstream** — What does this code feed? Read consumers, outputs, side effects.
5. **Cross-reference plan** — Does the implementation match what was planned? Check plan.md and design specs.
6. **Check for systemic patterns** — Is this a one-off bug or a pattern that exists elsewhere?

**For large investigations:** Launch research subagents (haiku, Explore) to map dependencies without polluting your own context:

```
Agent: Explore (haiku)
Task: "Map all imports and usages of [module/function] across the codebase.
Report: file paths, line numbers, how each usage depends on this module.
Under 400 words."
```

### Step 6: Diagnosis

Present findings to the user:

```markdown
## Diagnosis

**Root cause:** [Clear statement of what's wrong and why]

**Affected files:**
- path/to/file.ext — [what's wrong here]
- path/to/other.ext — [downstream impact]

**Systemic impact:** [Does this affect other parts of the codebase?]

**Proposed fix:**
- [Step 1: what to change and why]
- [Step 2: what to change and why]

**Risk assessment:** [What could this fix break? How do we verify?]
```

Ask via AskUserQuestion: "Does this diagnosis look right? Should I proceed with the fix?"

### Step 7: Delegate Fixes

**CRITICAL: The engineer delegates code changes to subagents to preserve its own context for holistic oversight.**

Decision framework for delegation:

```
IF fix is trivial (1-3 lines, single file):
  → Engineer MAY fix directly (acceptable exception)

IF fix is moderate (multiple lines, single file):
  → Delegate to Code Writer subagent (sonnet)

IF fix is complex (multiple files, architectural):
  → Delegate to Code Writer subagent (sonnet) with detailed instructions
  → Include holistic context: "This file is used by X, Y, Z. Change must preserve..."

IF fix requires investigation + implementation:
  → Launch research subagent first (haiku, Explore)
  → Then delegate implementation (sonnet, general-purpose)
```

**Subagent prompt template:**

```
You are implementing a fix as part of a holistic code review.

CONTEXT:
- Issue: [root cause summary]
- Affected file(s): [paths]
- Plan reference: {context_path}/plan.md Task #[N]

CRITICAL — HOLISTIC AWARENESS:
- This code is imported/used by: [list dependents]
- Changes MUST preserve: [interfaces, behaviors, contracts]
- After making changes, verify: [specific things to check]

FIX:
[Specific instructions — what to change and why]

After fixing, read the modified file(s) and verify the fix is complete
and doesn't introduce new issues. Report what you changed.
```

### Step 8: Verify

After subagent returns:

1. **Review the changes** — Read modified files to confirm the fix matches diagnosis.
2. **Run tests** — Launch Test Runner (haiku) if test infrastructure exists.
3. **Impact check** — Launch Explore subagent (haiku) to verify dependent code still works:
   ```
   "Read [list of dependent files]. Verify they are compatible with the changes
   made to [modified files]. Report any broken imports, changed interfaces,
   or behavioral mismatches."
   ```
4. **Log the fix** — Add entry to `docs/project_notes/bugs.md`:
   ```markdown
   ### [Date] - [Brief Bug Description]
   - **Context**: [trunk/branch name]
   - **Issue**: [What went wrong]
   - **Root Cause**: [Why]
   - **Solution**: [What was changed]
   - **Files Modified**: [list]
   - **Prevention**: [How to avoid in future]
   ```

### Step 9: Report

```markdown
## Fix Complete

**Issue:** [Brief description]
**Root Cause:** [One sentence]

**Changes Made:**
- path/to/file — [what changed]

**Verification:**
- Tests: PASS / FAIL / N/A
- Impact check: [clean / issues found]

**Additional recommendations:**
- [Any follow-up items or related issues spotted]
```

### Subagent Table

| Agent | Model | When to Use |
|-------|-------|-------------|
| **Code Writer** | sonnet | Implementing fixes (moderate to complex) |
| **Research/Explorer** | haiku | Mapping dependencies, investigating patterns |
| **Test Runner** | haiku | Running tests after fixes |
| **Impact Analyst** | haiku | Verifying dependent code after changes |

### Critical Rules

1. You MUST read `.project-memory-state.json` and verify at least one context is complete before proceeding.
2. You MUST investigate holistically — trace upstream, downstream, and lateral dependencies before proposing fixes.
3. You MUST delegate code changes to subagents for anything beyond trivial fixes (1-3 lines).
4. You MUST verify fixes don't break dependent code. Never make an isolated fix.
5. You MUST log every fix to `docs/project_notes/bugs.md`.
6. You MUST present diagnosis to the user before implementing fixes.
7. You MUST NOT make design decisions. If the fix requires architectural changes, tell the user to create a branch and run the full workflow.
8. You MUST NOT modify plan.md, design specs, or other workflow artifacts. You fix code, not plans.
9. When delegating to subagents, ALWAYS include the list of dependent files and what must be preserved.
10. You MUST treat the entire codebase as your responsibility. No change exists in isolation.

### Voice

- Precise and diagnostic — like a senior engineer explaining a bug to a colleague
- Confident but not dismissive — "Here's what I found" not "This is obvious"
- Systemic thinker — always mentions the broader impact
- Evidence-based — references specific files, line numbers, and code patterns

---

## 5. Skill Changes: intuition-start

### Summary of Changes

Start gains post-completion awareness. When any context is complete, it presents the two-choice flow instead of suggesting `/intuition-prompt`.

### Phase Detection Changes

Replace the current `complete` phase handler with context-aware logic:

```
ELSE IF trunk.status == "complete" OR any branch has status == "complete":
  → PHASE: post_completion
  → ACTION: Show status tree, present two choices

  Determine active context:
  - If active_context has status != "complete" and is in-progress:
    → PHASE: [appropriate in-progress phase for that context]
    → ACTION: Resume that context's workflow

  - If all contexts are complete or no in-progress context:
    → PHASE: post_completion
    → ACTION: Two-choice prompt
```

### New Phase Handler: Post-Completion

```
Welcome back! Here's your project status:

**Trunk:** Complete
  - [Trunk objective from plan.md — 1 sentence]

**Branches:**
- feature-auth: Complete — [purpose]
- ui-overhaul: In progress (planning) — [purpose]

[If a context is in-progress]:
  You have work in progress on [branch name].
  Run /intuition-[next skill] to continue.

[If all contexts are complete]:
  What would you like to do next?
```

Use AskUserQuestion:

```
Question: "All current work is complete. What's next?"
Header: "Next Step"
Options:
- "Create a new branch (new feature or change)"
- "Troubleshoot an issue (/intuition-engineer)"
```

If user selects "Create a new branch":
- Ask for branch name (short, descriptive, kebab-case)
- Ask for branch purpose (1 sentence)
- Ask which context to branch from (if multiple completed)
- Route to `/intuition-handoff` with branch creation intent

If user selects "Troubleshoot":
- Route to `/intuition-engineer`

### Start Remains Read-Only

Start NEVER writes state. For branch creation, start collects the information (name, purpose, parent) and routes to handoff, which handles the state write and folder creation.

### Status Tree Display

Start reads state and renders a tree:

```
Project Status:
├── Trunk: Complete ✓
│   └── "Build a REST API for document management"
├── Branch: feature-auth (from trunk): Complete ✓
│   └── "Add OAuth2 authentication"
└── Branch: caching-layer (from trunk): Planning...
    └── "Add Redis caching for API responses"
```

### Context Path Awareness

When start detects an in-progress context, it resolves the context_path and reads artifacts from the correct folder:

```
IF active_context == "trunk":
  Read docs/project_notes/trunk/plan.md for task count
ELSE:
  Read docs/project_notes/branches/{active_context}/plan.md
```

---

## 6. Skill Changes: intuition-prompt

### Summary of Changes

Prompt needs context-path awareness for all file writes. The interaction flow stays the same — only the output paths change.

### Changes Required

1. **On startup**: Read `.project-memory-state.json` to determine `active_context` and resolve `context_path`.

2. **File writes** in Phase 4 (CONFIRM) change from:
   - `docs/project_notes/discovery_brief.md` → `{context_path}/discovery_brief.md`
   - `docs/project_notes/discovery_output.json` → `{context_path}/discovery_output.json`

3. **Resume logic**: Check for `{context_path}/discovery_brief.md` instead of the fixed path.

4. **Branch context awareness**: When running on a branch, prompt's opening message should acknowledge the lineage:
   ```
   You're working on branch "[display_name]" (from [parent]).
   Branch purpose: [purpose]

   Tell me what you want to build or change for this branch.
   I'll help you sharpen it into something the planning phase can run with.
   ```

5. **No structural changes** to the CAPTURE → REFINE → REFLECT → CONFIRM protocol. The prompt flow is identical regardless of context.

### New Critical Rule

Add rule: "You MUST read `.project-memory-state.json` to determine the active context path before writing any files. NEVER write to the root `docs/project_notes/` — always write to the resolved context_path."

---

## 7. Skill Changes: intuition-plan

### Summary of Changes

Plan gains branch awareness. When planning on a branch, it reads the parent context's plan and includes a "Trunk Intersection" analysis. File paths are context-aware.

### Changes Required

1. **On startup**: Read state for `active_context`. Resolve `context_path`.

2. **All file paths** change to use context_path:
   - Read: `{context_path}/discovery_brief.md`, `{context_path}/planning_brief.md`
   - Write: `{context_path}/plan.md`, `{context_path}/.planning_research/*`

3. **Branch-aware intake (new Phase 1 step)**:

   When `active_context` is NOT trunk:

   a. Determine parent: `state.branches[active_context].created_from`

   b. Read parent's plan:
      - If parent is trunk: read `docs/project_notes/trunk/plan.md`
      - If parent is a branch: read `docs/project_notes/branches/{parent}/plan.md`

   c. Read parent's design specs (if any): `{parent_path}/design_spec_*.md`

   d. During orientation research, add a third agent:

   ```
   Agent 3 — Parent Intersection Analysis (subagent_type: Explore, model: haiku):
   Prompt: "Compare the discovery brief at {context_path}/discovery_brief.md
   with the plan at {parent_path}/plan.md. Identify:
   (1) Shared files/components that both touch
   (2) Decisions in the parent plan that constrain this branch
   (3) Potential conflicts or dependencies
   (4) Patterns from parent that should be reused
   Under 500 words. Facts only."
   ```

   Write results to `{context_path}/.planning_research/parent_intersection.md`

4. **New plan section: Parent Context (branch plans only)**

   Add between Section 2 (Discovery Summary) and Section 3 (Technology Decisions):

   ```markdown
   ### 2.5. Parent Context

   **Parent:** [trunk or branch name]
   **Parent Objective:** [1 sentence from parent plan]

   **Shared Components:**
   - [Component]: [how this branch's work relates to parent's use]

   **Inherited Decisions:**
   - [Decision from parent that constrains this branch]

   **Intersection Points:**
   - [File/module touched by both parent and this branch]
   - [Potential conflict or dependency]

   **Divergence:**
   - [Where this branch intentionally departs from parent patterns]
   ```

5. **ARCH framework extension**: When on a branch, the Reach dimension explicitly includes intersection with parent. The Choices dimension must acknowledge inherited decisions.

6. **Scope scaling**: Parent Context section is included for ALL tiers when on a branch.

### New Critical Rule

Add rule: "When planning on a branch, you MUST read the parent context's plan.md and include a Parent Context section. Inherited architectural decisions from the parent are binding unless the user explicitly overrides them."

---

## 8. Skill Changes: intuition-design

### Summary of Changes

Minimal changes — design only needs context-path awareness for file reads and writes.

### Changes Required

1. **On startup**: Read state for `active_context`. Resolve `context_path`.

2. **File paths** change:
   - Read: `{context_path}/plan.md`, `{context_path}/design_brief.md`
   - Write: `{context_path}/design_spec_{item}.md`
   - Working files: `{context_path}/.design_research/{item}/`

3. **Branch awareness in design**: When designing on a branch, if the parent has design specs for related components, read them for context. Add to the ECD exploration:

   ```
   "The parent context ([name]) has a design spec for [related component].
   Read {parent_path}/design_spec_{item}.md for existing design decisions
   that may constrain or inform this design."
   ```

4. **No structural changes** to the ECD protocol. The design flow is identical regardless of context.

---

## 9. Skill Changes: intuition-execute

### Summary of Changes

Execute gains context-path awareness and a new Senior Engineer opus subagent.

### Changes Required

1. **On startup**: Read state for `active_context`. Resolve `context_path`.

2. **All file paths** change to context_path:
   - Read: `{context_path}/plan.md`, `{context_path}/discovery_brief.md`, `{context_path}/design_spec_*.md`, `{context_path}/execution_brief.md`

3. **New subagent: Senior Engineer (opus)**

   Add to the AVAILABLE SUBAGENTS table:

   | Agent | Model | When to Use |
   |-------|-------|-------------|
   | **Senior Engineer** | opus | Complex tasks requiring holistic codebase reasoning. Multi-file architectural changes, tricky integrations, tasks where the implementation approach affects the broader system. |

   Usage criteria — delegate to Senior Engineer instead of Code Writer when:
   - The task touches 3+ files with dependencies between them
   - The implementation choice affects system architecture
   - The task requires understanding the full call chain
   - The task was flagged for design (has a design spec)

   **Senior Engineer subagent prompt template:**

   ```
   You are a senior software engineer implementing a task that requires holistic
   codebase awareness. Every change you make must be evaluated in context of the
   entire system.

   TASK: [description] (see {context_path}/plan.md Task #[N])

   CONTEXT DOCUMENTS:
   - {context_path}/plan.md — Read Task #[N] for full acceptance criteria
   - {context_path}/design_spec_[item].md — Read for design blueprint (if exists)
   - docs/project_notes/decisions.md — Architectural decisions to respect

   HOLISTIC PROTOCOL:
   1. Before writing any code, read ALL files that will be affected.
   2. Map the dependency graph — what imports this? What does this import?
   3. Identify interfaces that must be preserved.
   4. Implement the change.
   5. After implementation, read dependent files and verify compatibility.
   6. If your change affects an interface used by other code, update ALL consumers.
   7. Report: what you changed, why, and what dependent code you verified.

   NO ISOLATED CHANGES. Every modification considers the whole.
   ```

4. **Branch-aware execution**: When executing on a branch, the execution brief should note the parent context. Subagent prompts should include:

   ```
   NOTE: This is branch work. The parent context ([name]) has existing
   implementations at [relevant paths]. Your changes must be compatible
   with the parent's architecture unless the plan explicitly states otherwise.
   ```

### New Critical Rule

Add rule: "For tasks flagged with design specs or touching 3+ interdependent files, you MUST delegate to the Senior Engineer (opus) subagent, not the standard Code Writer."

---

## 10. Skill Changes: intuition-handoff

### Summary of Changes

Handoff undergoes the most significant changes. It must manage the tree state, handle branch creation, and resolve all file paths through context_path.

### State Schema Update

Handoff's embedded state schema updates from v3.0 to v4.0 (see Section 3 above).

### Context Path Resolution

Add to the top of the protocol:

```
BEFORE ANY TRANSITION:
1. Read .project-memory-state.json
2. Get active_context
3. Resolve context_path:
   IF active_context == "trunk":
     context_path = "docs/project_notes/trunk/"
   ELSE:
     context_path = "docs/project_notes/branches/{active_context}/"
4. Use context_path for ALL file operations in this transition
```

### All Existing Transitions — Path Updates

Every file path in every transition changes:

| v6.0 Path | v7.0 Path |
|-----------|-----------|
| `docs/project_notes/discovery_brief.md` | `{context_path}/discovery_brief.md` |
| `docs/project_notes/discovery_output.json` | `{context_path}/discovery_output.json` |
| `docs/project_notes/planning_brief.md` | `{context_path}/planning_brief.md` |
| `docs/project_notes/plan.md` | `{context_path}/plan.md` |
| `docs/project_notes/design_brief.md` | `{context_path}/design_brief.md` |
| `docs/project_notes/design_spec_*.md` | `{context_path}/design_spec_*.md` |
| `docs/project_notes/execution_brief.md` | `{context_path}/execution_brief.md` |

Shared files remain at `docs/project_notes/`:
- `key_facts.md`, `decisions.md`, `issues.md`, `bugs.md`

### State Write Changes

All state writes now target the correct context object:

```
IF active_context == "trunk":
  Update state.trunk.status and state.trunk.workflow.*
ELSE:
  Update state.branches[active_context].status and state.branches[active_context].workflow.*
```

### New Transition 0: Branch Creation

Triggered when start routes to handoff with branch creation intent. The user has provided: branch name, purpose, parent context.

**Protocol:**

1. Validate branch name:
   - Convert to kebab-case for directory name (the state key)
   - Reject if a branch with that key already exists

2. Create branch directory: `docs/project_notes/branches/{branch_key}/`

3. Add branch to state:
   ```json
   {
     "branches": {
       "{branch_key}": {
         "display_name": "[User-provided name]",
         "created_from": "[parent context key]",
         "created_at": "[ISO timestamp]",
         "purpose": "[User-provided purpose]",
         "status": "none",
         "workflow": {
           "prompt": { "started": false, "completed": false, "started_at": null, "completed_at": null, "output_files": [] },
           "planning": { "started": false, "completed": false, "completed_at": null, "approved": false },
           "design": { "started": false, "completed": false, "completed_at": null, "items": [], "current_item": null },
           "execution": { "started": false, "completed": false, "completed_at": null }
         }
       }
     },
     "active_context": "{branch_key}"
   }
   ```

4. Route user: "Branch **[display_name]** created. Run `/intuition-prompt` to define what this branch will accomplish."

### Transition Detection Update

The transition detection tree now reads the active context's workflow:

```
Step 1: Read state, get active_context
Step 2: Get context_workflow:
  IF active_context == "trunk": context_workflow = state.trunk
  ELSE: context_workflow = state.branches[active_context]
Step 3: Apply existing transition logic against context_workflow
```

The existing IF/ELSE transition logic stays the same — it just operates on `context_workflow` instead of `state.workflow`.

### Transition 5 Update: Execution → Complete

After marking the context as complete, the route message changes:

```
"Workflow cycle complete for [context name].

Run /intuition-start to see your project status and decide what's next."
```

Do NOT suggest `/intuition-prompt` for a new cycle. Start now handles the post-completion flow.

### New Critical Rule

Add rule: "You MUST resolve the active context and context_path before every transition. NEVER hardcode `docs/project_notes/` for workflow artifacts."

---

## 11. Skill Changes: intuition-initialize

### Summary of Changes

Initialize creates the trunk/ and branches/ directory structure. State schema initializes as v4.0.

### New Directory Structure

```
docs/project_notes/
├── trunk/                      ← Created by initialize
├── branches/                   ← Created by initialize (empty)
├── .project-memory-state.json  ← v4.0 schema
├── key_facts.md
├── decisions.md
├── issues.md
└── bugs.md
```

### State Template Update

The initial state file uses v4.0 schema:

```json
{
  "initialized": true,
  "version": "4.0",
  "active_context": "trunk",
  "trunk": {
    "status": "none",
    "workflow": {
      "prompt": { "started": false, "completed": false, "started_at": null, "completed_at": null, "output_files": [] },
      "planning": { "started": false, "completed": false, "completed_at": null, "approved": false },
      "design": { "started": false, "completed": false, "completed_at": null, "items": [], "current_item": null },
      "execution": { "started": false, "completed": false, "completed_at": null }
    }
  },
  "branches": {},
  "last_handoff": null,
  "last_handoff_transition": null
}
```

### CLAUDE.md Template Update

Update the workflow description to mention trunk/branch model:

```
## Workflow Model

The Intuition workflow uses a trunk-and-branch model:
- **Trunk**: The first prompt→plan→design→execute cycle. Represents the core vision.
- **Branches**: Subsequent cycles that build on, extend, or diverge from trunk or other branches.
- **Engineer**: Post-execution troubleshooting with holistic codebase awareness.

All phases: /intuition-prompt → /intuition-handoff → /intuition-plan → /intuition-handoff →
[/intuition-design loop] → /intuition-handoff → /intuition-execute → /intuition-handoff → complete

After completion: /intuition-start to create branches or /intuition-engineer to troubleshoot.
```

### INTUITION.md Template Update

Add trunk/branch explanation and engineer skill to the overview.

---

## 12. Install Script Changes

### New Skill Registration

Add `intuition-engineer` to the skills array in `scripts/install-skills.js`:

```javascript
const SKILLS = [
  'intuition-start',
  'intuition-prompt',
  'intuition-handoff',
  'intuition-plan',
  'intuition-design',
  'intuition-execute',
  'intuition-engineer',     // NEW
  'intuition-initialize',
  'intuition-agent-advisor',
  'intuition-skill-guide',
  'intuition-update',
];
```

### Uninstall Script

Add `intuition-engineer` to the cleanup list in `scripts/uninstall-skills.js`.

### Source Skill Directory

Create `skills/intuition-engineer/SKILL.md` in the package source.

---

## 13. MEMORY.md Updates

### Updated Project Overview

```markdown
## Project Overview
- npm package `@tgoodington/intuition` — Claude Code skill system
- 11 skills deployed to `~/.claude/skills/` via postinstall script
- Trunk-and-branch workflow: trunk (first cycle) → branches (subsequent cycles)
- Four-phase workflow per context: prompt → handoff → plan → handoff → [design loop] → handoff → execute → handoff
- **v7.0**: Branch/trunk model, intuition-engineer skill, state schema v4.0
```

### Updated All Skills Section

```markdown
## All Skills (11 total)
- `intuition-start` — haiku, read-only session primer + post-completion routing
- `intuition-prompt` — opus, focused discovery (context-path aware)
- `intuition-handoff` — haiku, state owner + transition logic + branch creation + design loop
- `intuition-plan` — opus, ARCH architect + branch intersection analysis
- `intuition-design` — opus, ECD design exploration (context-path aware)
- `intuition-execute` — opus, execution orchestrator + Senior Engineer subagent
- `intuition-engineer` — opus, holistic troubleshooter + coding expert (NEW)
- `intuition-initialize` — project initialization (v4.0 state schema)
- `intuition-agent-advisor` — opus, advisory skill
- `intuition-skill-guide` — opus, advisory skill
- `intuition-update` — haiku, package update manager
```

### Updated State Ownership

```markdown
### State Ownership
- **Handoff is the ONLY skill that writes to `.project-memory-state.json`**
- Other skills MUST NOT manage state
- State schema v4.0: trunk object, branches map, active_context, per-context workflow pipelines
- Engineer writes to bugs.md only (shared memory, not state)
```

### Updated Workflow Architecture

```markdown
## Workflow Architecture (v7.0)
- Trunk = first prompt→execute cycle, permanent foundation
- Branches = subsequent cycles, track lineage via `created_from`
- `/intuition-start` — post-completion: create branch or open engineer
- `/intuition-plan` on branches — reads parent plan, includes Parent Context section
- `/intuition-execute` — new Senior Engineer (opus) subagent for complex tasks
- `/intuition-engineer` — dual mode: user troubleshooter + execute consultant
- All skills use context_path resolution for file operations
- Shared memory (key_facts, decisions, issues, bugs) stays at root
```

### Updated Handoff Transitions

```markdown
## Handoff Transitions (v7.0)
0. branch_creation (start → handoff with branch info → creates branch, sets active_context)
1. prompt → plan (generates {context_path}/planning_brief.md)
2. plan → design (user confirms items, generates {context_path}/design_brief.md)
3. design → design (loop: updates {context_path}/design_brief.md for next item)
4. design → execute (all items done, generates {context_path}/execution_brief.md)
4B. plan → execute (skip design, no items flagged)
5. execute → complete
Post-completion: start offers branch creation or engineer
```

---

## 14. Migration Path

### v3.0 → v4.0 State Migration

Projects with existing v3.0 state need migration. Options:

**Option A: Auto-migration in handoff (recommended)**

When handoff reads a v3.0 state file, it:
1. Detects `version: "3.0"` (or missing `active_context` field)
2. Creates trunk directory: `docs/project_notes/trunk/`
3. Moves existing workflow artifacts into trunk/:
   - `discovery_brief.md`, `discovery_output.json`, `planning_brief.md`, `plan.md`, `design_brief.md`, `design_spec_*.md`, `execution_brief.md`, `.planning_research/`
4. Restructures state:
   ```json
   {
     "version": "4.0",
     "active_context": "trunk",
     "trunk": {
       "status": "[existing workflow.status]",
       "workflow": { /* existing workflow object */ }
     },
     "branches": {}
   }
   ```
5. Leaves shared files (key_facts, decisions, issues, bugs) at root.

**Option B: Manual re-initialize**

User runs `/intuition-initialize` which detects v3.0 and offers to upgrade.

**Recommendation:** Implement both. Handoff auto-migrates when it encounters v3.0. Initialize also offers upgrade as a deliberate action. Start should detect v3.0 and warn: "Project uses v3.0 state schema. Run `/intuition-handoff` or `/intuition-initialize` to upgrade to v4.0."

### Backward Compatibility

- v7.0 skills should handle both v3.0 and v4.0 state during a transition period
- If a skill reads state and finds `version: "3.0"`, it should warn and suggest migration
- After migration, v3.0 compatibility can be removed in v8.0

---

## Summary of All Changes

| Skill | Change Level | Key Changes |
|-------|-------------|-------------|
| **intuition-start** | Moderate | Post-completion two-choice flow, status tree display, context-path awareness |
| **intuition-prompt** | Light | Context-path for file writes, branch context in opening message |
| **intuition-plan** | Moderate | Parent intersection analysis, new Section 2.5, third research agent on branches |
| **intuition-design** | Light | Context-path for file reads/writes, optional parent spec reading |
| **intuition-execute** | Moderate | Context-path, new Senior Engineer (opus) subagent, branch-aware prompts |
| **intuition-handoff** | Heavy | Context-path everywhere, new Transition 0 (branch creation), tree state management, v3→v4 migration |
| **intuition-engineer** | New | Entire skill — troubleshooter + holistic codebase expert |
| **intuition-initialize** | Moderate | trunk/ and branches/ directories, v4.0 state template, updated CLAUDE.md/INTUITION.md templates |
| **intuition-agent-advisor** | None | No changes needed |
| **intuition-skill-guide** | None | No changes needed |
| **intuition-update** | None | No changes needed |
| **Install scripts** | Light | Add intuition-engineer to skill list |
| **MEMORY.md** | Moderate | Updated overview, skill list, state ownership, transitions |
