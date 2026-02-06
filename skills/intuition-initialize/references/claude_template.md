## Project Workflow and Memory System

This project uses a three-phase workflow coordinated by the Intuition system, with institutional knowledge maintained in `docs/project_notes/` for consistency across sessions.

### Workflow Phases

The project follows a structured workflow with handoff transitions between phases:

**Discovery (Waldo)** — `/intuition-discovery`
- Deep understanding of the problem through collaborative dialogue
- Framework: GAPP (Problem → Goals → UX Context → Personalization)
- Output: `discovery_brief.md` and `discovery_output.json`

**Handoff** — `/intuition-handoff`
- Processes phase outputs, updates memory files, generates brief for next agent
- Runs between every phase transition (discovery→planning and planning→execution)
- ONLY component that writes to `.project-memory-state.json`

**Planning (Magellan)** — `/intuition-plan`
- Strategic synthesis and structured execution planning
- Researches codebase, identifies patterns, creates detailed plan
- Output: `plan.md` with tasks, dependencies, risks

**Execution (Faraday)** — `/intuition-execute`
- Methodical implementation with verification and quality checks
- Delegates to specialized sub-agents, coordinates work, verifies outputs
- Output: Implemented features, updated memory, completion report

**Session Primer** — `/intuition-start`
- Loads project context, detects workflow phase, suggests next step
- Run at the start of any session to get oriented

**Recommended Flow**: Discovery → Handoff → Planning → Handoff → Execution → Handoff

### Memory Files

**Core Memory Files** (initialized at setup):
- **bugs.md** — Bug log with dates, solutions, and prevention notes
- **decisions.md** — Architectural Decision Records (ADRs) with context and trade-offs
- **key_facts.md** — Project configuration, credentials, ports, important URLs
- **issues.md** — Work log with ticket IDs, descriptions, and URLs
- **.project-memory-state.json** — Workflow phase tracking and session state

**Phase Output Files** (created during workflow):
- **discovery_brief.md** — Discovery phase synthesis (created by Waldo)
- **discovery_output.json** — Structured findings (created by Waldo, processed by Handoff)
- **planning_brief.md** — Brief for planning phase (created by Handoff)
- **plan.md** — Structured project plan (created by Magellan)
- **execution_brief.md** — Brief for execution phase (created by Handoff)

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

**When discovery is complete:**
- "Discovery looks complete! Use `/intuition-handoff` to process insights and prepare for planning."

**When user suggests planning work:**
- "This sounds like a good candidate for planning. Use `/intuition-handoff` to process discovery, then `/intuition-plan` to develop a structured approach."

**When plan is ready for execution:**
- "The plan looks ready! Use `/intuition-handoff` to prepare execution context, then `/intuition-execute` to begin."

**When user is ready to execute:**
- "Execution brief is ready! Use `/intuition-execute` to kick off coordinated implementation."
