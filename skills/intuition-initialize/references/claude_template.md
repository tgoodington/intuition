## Project Workflow and Memory System

This project uses a five-phase workflow coordinated by the Intuition system, with institutional knowledge maintained in `docs/project_notes/` for consistency across sessions.

### Workflow Model

The Intuition workflow uses a trunk-and-branch model:
- **Trunk**: The first prompt→plan→design→engineer→build cycle. Represents the core vision.
- **Branches**: Subsequent cycles that build on, extend, or diverge from trunk or other branches.
- **Debugger**: Post-completion diagnostic specialist for hard problems.

All phases: `/intuition-prompt` → `/intuition-handoff` → `/intuition-outline` → `/intuition-handoff` →
`[/intuition-design loop]` → `/intuition-handoff` → `/intuition-engineer` → `/intuition-handoff` →
`/intuition-build` → `/intuition-handoff` → complete

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

**Design** — `/intuition-design`
- Detailed design exploration for flagged plan items
- Framework: ECD (Elements, Connections, Dynamics)
- Domain-agnostic: works for code, world building, UI, documents, or any creative/structural work
- Runs once per flagged item in a loop managed by handoff
- Output: Design specifications per item

**Engineering** — `/intuition-engineer`
- Creates code-level specifications through codebase research and interactive dialogue
- Research subagents read codebase, engineer discusses decisions with user
- Output: `code_specs.md` — determines the code-level HOW for every task

**Build** — `/intuition-build`
- Delegates implementation to subagents, verifies against code specs and acceptance criteria
- Mandatory security review before completion
- Makes NO engineering decisions — matches output to specs
- Output: `build_report.md` — task outcomes, files modified, deviations from specs

**Session Primer** — `/intuition-start`
- Loads project context, detects workflow phase, suggests next step
- Run at the start of any session to get oriented

**Recommended Flow**: Prompt → Handoff → Plan → Handoff → [Design Loop] → Handoff → Engineer → Handoff → Build → Handoff → complete

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
- **design_brief.md** — Brief for current design item (created/updated by Handoff)
- **engineering_brief.md** — Brief for engineering phase (created by Handoff)
- **code_specs.md** — Code-level specifications (created by Engineer)
- **build_brief.md** — Brief for build phase (created by Handoff)
- **build_report.md** — Task outcomes and files modified (created by Build)

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

**When plan is ready and has design items:**
- "The plan looks ready! Use `/intuition-handoff` to review design recommendations and start the design loop."

**When design items are complete:**
- "All design specs are done! Use `/intuition-handoff` to prepare the engineering brief."

**When user is ready to engineer:**
- "Engineering brief is ready! Use `/intuition-engineer` to create code specifications."

**When engineering is complete:**
- "Code specs are ready! Use `/intuition-handoff` to prepare the build brief."

**When user is ready to build:**
- "Build brief is ready! Use `/intuition-build` to kick off implementation."

**When build is complete:**
- "Workflow cycle complete! Use `/intuition-start` to create a branch for new work, or `/intuition-debugger` to debug any issues."
