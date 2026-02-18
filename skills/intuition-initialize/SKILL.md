---
name: intuition-initialize
description: Set up project memory infrastructure with workflow state tracking, memory files, and configuration templates.
model: haiku
tools: Read, Write, Glob, Grep, Bash, AskUserQuestion
allowed-tools: Read, Write, Glob, Grep
---

# Initialize - Project Memory Setup Protocol

You create the `docs/project_notes/` directory structure, initialize memory files from templates, create the workflow state file, and set up project configuration files. You run once per project to set up infrastructure, then hand off to the workflow skills.

## CRITICAL RULES

1. You MUST check install location before doing anything else — enforce global install.
2. You MUST check if `docs/project_notes/` already exists before creating anything.
3. You MUST use template files from `references/` directory for all initial content. Read each template with the Read tool, then Write to the target path.
4. You MUST create `.project-memory-state.json` using the v5.0 schema from `references/state_template.json`. Do NOT use older schemas.
5. You MUST auto-create all configuration files (CLAUDE.md, INTUITION.md, AGENTS.md, settings, profile) if they do not exist. Do NOT ask — just create them.
6. You MUST NOT overwrite existing files. If a file already exists, skip it silently.
7. You MUST NOT invoke other skills. You only set up infrastructure.
8. You MUST report what was created at the end.

## PROTOCOL: COMPLETE FLOW

```
Step 0: Check install location — enforce global install
Step 1: Detect existing setup
Step 2: Create memory directory and files from templates
Step 3: Create .project-memory-state.json with v5.0 schema
Step 4: Update CLAUDE.md with workflow protocols
Step 4.5: Create INTUITION.md framework overview
Step 5: Create configuration files (AGENTS.md, settings, user profile)
Step 6: Report completion and suggest next step
```

## STEP 0: ENFORCE GLOBAL INSTALL

Before anything else, check whether `@tgoodington/intuition` is installed locally (project-level) vs globally.

Run these checks using Bash:

```
Local:  npm list @tgoodington/intuition --depth=0 2>&1
Global: npm list -g @tgoodington/intuition --depth=0 2>&1
```

Apply this logic:

```
IF local install found AND global install found:
  → Uninstall local: npm uninstall @tgoodington/intuition
  → Notify: "Removed local install. Using global install."

IF local install found AND no global install:
  → Uninstall local: npm uninstall @tgoodington/intuition
  → Install global: npm install -g @tgoodington/intuition
  → Notify: "Moved install from local to global."

IF no local install AND global install found:
  → Proceed (correct setup)

IF neither found:
  → Warn: "Package not found. Install with: npm install -g @tgoodington/intuition"
  → STOP
```

## STEP 1: DETECT EXISTING SETUP

Check if `docs/project_notes/` exists.

```
IF docs/project_notes/ exists:
  → Check which files already exist
  → Ask user: "Project memory already exists. What would you like to do?"
    Options:
    - "Skip existing files, only create missing ones" (Recommended)
    - "Overwrite everything with fresh templates"
    - "Cancel — nothing to do"

IF docs/project_notes/ does NOT exist:
  → Proceed with full setup
```

Also check if CLAUDE.md exists and whether it already has a "Project Workflow and Memory System" section.

## STEP 2: CREATE MEMORY FILES

Create the directory structure and initialize memory files:

```
docs/
└── project_notes/
    ├── trunk/
    ├── branches/
    ├── bugs.md
    ├── decisions.md
    ├── key_facts.md
    ├── issues.md
    └── .project-memory-state.json
```

Create `docs/project_notes/trunk/` and `docs/project_notes/branches/` as empty directories. Write a `.gitkeep` placeholder to each so they are tracked by git.

For each file, use the Read tool to read the template, then use Write to create the target:

| Template Source | Target File |
|----------------|-------------|
| `references/bugs_template.md` | `docs/project_notes/bugs.md` |
| `references/decisions_template.md` | `docs/project_notes/decisions.md` |
| `references/key_facts_template.md` | `docs/project_notes/key_facts.md` |
| `references/issues_template.md` | `docs/project_notes/issues.md` |

Do NOT create workflow output files (discovery_brief.md, plan.md, etc.). Those are created by their respective skills.

## STEP 3: CREATE STATE FILE

Read `references/state_template.json` and write to `docs/project_notes/.project-memory-state.json`.

The state file uses the v5.0 schema:

```json
{
  "initialized": true,
  "version": "5.0",
  "active_context": "trunk",
  "trunk": {
    "status": "none",
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
      "engineering": {
        "started": false,
        "completed": false,
        "completed_at": null
      },
      "build": {
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

**CRITICAL**: Handoff is the ONLY skill that updates this file after initialization.

## STEP 4: UPDATE CLAUDE.MD

Read `references/claude_template.md` for the workflow protocol content.

```
IF CLAUDE.md does NOT exist:
  → Create CLAUDE.md with the template content

IF CLAUDE.md exists BUT has no "Project Workflow and Memory System" section:
  → Append the template content to the end of the file

IF CLAUDE.md exists AND already has the section:
  → Skip (do not overwrite)
```

## STEP 4.5: CREATE INTUITION.MD

Read `references/intuition_readme_template.md` and write to `INTUITION.md` at the project root.

```
IF INTUITION.md does NOT exist:
  → Create it from template

IF INTUITION.md already exists:
  → Skip
```

## STEP 5: CREATE CONFIGURATION FILES

Auto-create each file if it does not exist. Do NOT ask — just create. If a file already exists, skip it silently.

### 5A: AGENTS.md

- Read `references/agents_template.md`
- If `AGENTS.md` does not exist: create with full template content
- If `AGENTS.md` exists: skip

### 5B: Claude Code Settings

- Read `references/settings_template.json`
- If `.claude/settings.local.json` does not exist: create from template
- If `.claude/settings.local.json` exists: skip

### 5C: User Profile

- Read `references/user_profile_template.json`
- If `.claude/USER_PROFILE.json` does not exist: create from template
- If `.claude/USER_PROFILE.json` exists: skip

## STEP 6: REPORT COMPLETION

Present a concise summary of what was created vs skipped:

```
Project memory initialized!

Created:
- [list each file that was created]

Skipped (already existed):
- [list each file that was skipped, if any]

Next step: Run /intuition-prompt to describe what you want to build,
or /intuition-start to check project status.
```

## EDGE CASES

- **Partial setup exists**: Check each file individually. Only create missing files.
- **CLAUDE.md has custom content**: Append the workflow section. Do not replace the entire file.
- **Git-tracked project**: Memory files in `docs/project_notes/` are safe to commit. Settings in `.claude/` are typically gitignored.

## REFERENCE FILES

These template files are in the `references/` directory. Use Read tool to access them:

**Memory file templates** (Step 2):
- `bugs_template.md`, `decisions_template.md`, `key_facts_template.md`, `issues_template.md`

**State template** (Step 3):
- `state_template.json`

**Framework overview** (Step 4.5):
- `intuition_readme_template.md`

**Configuration templates** (Steps 4-5):
- `claude_template.md` — workflow protocols for CLAUDE.md
- `agents_template.md` — agent registry for AGENTS.md
- `settings_template.json` — pre-authorized tools for Claude Code
- `user_profile_template.json` — cross-project user context
