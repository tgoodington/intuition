## Project Workflow and Memory System

This project uses a five-phase workflow coordinated by the Intuition system, with institutional knowledge maintained in `docs/project_notes/` for consistency across sessions.

### Workflow Model

The Intuition workflow uses a trunk-and-branch model:
- **Trunk**: The first prompt→outline→detail→build→test cycle. Represents the core vision.
- **Branches**: Subsequent cycles that build on, extend, or diverge from trunk or other branches.
- **Debugger**: Post-completion diagnostic specialist for hard problems.

v9 workflow: `/intuition-prompt` → `/intuition-outline` → `/intuition-assemble` → `/intuition-detail` → `/intuition-build` → `/intuition-test` → complete

After completion: `/intuition-start` to create branches or `/intuition-debugger` to debug issues.

### Workflow Phases

The project follows a structured workflow with handoff transitions between phases:

**Prompt** — `/intuition-prompt`
- Transforms a rough vision into a precise, planning-ready brief
- Framework: Capture → Refine → Reflect → Confirm
- Output: Planning-ready brief (processed by Handoff into `outline_brief.md`)

**Handoff** — `/intuition-handoff`
- Processes phase outputs, updates memory files, generates brief for next phase
- Runs between every phase transition
- Manages the design loop (item-by-item design cycles)
- ONLY component that writes to `.project-memory-state.json`

**Outline** — `/intuition-outline`
- Strategic synthesis and structured execution planning
- Researches codebase, identifies patterns, creates detailed plan
- Flags tasks requiring design exploration with rationale
- Output: `outline.md` with tasks, dependencies, risks, design recommendations

**Assemble** — `/intuition-assemble`
- Matches outline tasks to domain specialists and format producers
- Writes team_assignment.json for the detail phase

**Detail** — `/intuition-detail`
- Domain specialists produce detailed blueprints
- Stage 1 exploration → user gate → Stage 2 specification
- Output: Blueprints per specialist domain

**Build** — `/intuition-build`
- Delegates implementation to format producers, verifies against blueprints and acceptance criteria
- Mandatory security review before completion
- Output: `build_report.md` — task outcomes, files modified

**Test** — `/intuition-test`
- Post-build quality gate
- Designs test strategy, creates tests, runs fix cycles
- Output: `test_report.md`

**Session Primer** — `/intuition-start`
- Loads project context, detects workflow phase, suggests next step
- Run at the start of any session to get oriented

**Recommended Flow (v9)**: Prompt → Outline → Assemble → Detail → Build → Test → complete

Run `/clear` before each phase skill. After completion, run `/intuition-start` to create a branch or invoke `/intuition-debugger` to debug issues.

### Memory Files

**Core Memory Files** (initialized at setup):
- **bugs.md** — Bug log with dates, solutions, and prevention notes
- **decisions.md** — Architectural Decision Records (ADRs) with context and trade-offs
- **key_facts.md** — Project configuration, credentials, ports, important URLs
- **issues.md** — Work log with ticket IDs, descriptions, and URLs
- **.project-memory-state.json** — Workflow phase tracking and session state

**Phase Output Files** (created during workflow, in `{context_path}/`):
- **outline_brief.md** — Brief for outline phase (created by Handoff)
- **outline.md** — Structured project outline with design recommendations
- **team_assignment.json** — Specialist/producer assignments (created by Assemble)
- **blueprints/** — Detailed blueprints per specialist (created by Detail)
- **build_brief.md** — Brief for build phase (created by Handoff, v8)
- **build_report.md** — Task outcomes and files modified (created by Build)
- **test_report.md** — Test results and coverage (created by Test)

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

### Style Guidelines for Memory Files

- Prefer bullet lists over tables for simplicity
- Keep entries concise (1-3 lines for descriptions)
- Always include dates for temporal context
- Include URLs for tickets, documentation, monitoring dashboards

### Smart Skill Suggestions

**When prompt refinement is complete:**
- "Prompt refinement looks complete! Use `/intuition-handoff` to process insights and prepare for outline."

**When user suggests outline work:**
- "This sounds like a good candidate for planning. Use `/intuition-handoff` to process the brief, then `/intuition-outline` to develop a structured approach."

**When outline is ready:**
- "Outline looks ready! Use `/intuition-assemble` to match tasks to specialists."

**When assembly is complete:**
- "Team assigned! Use `/intuition-detail` to start the specialist blueprint phase."

**When detail is complete:**
- "Blueprints ready! Use `/intuition-build` to kick off implementation."

**When build is complete:**
- "Build done! Use `/intuition-test` to run the quality gate."

**When test is complete:**
- "Workflow cycle complete! Use `/intuition-start` to create a branch for new work, or `/intuition-debugger` to debug any issues."
