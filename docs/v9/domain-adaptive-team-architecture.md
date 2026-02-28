# Domain-Adaptive Team Architecture — v9.0 Design Proposal

> **Status:** Proposal
> **Date:** 2026-02-27
> **Supersedes:** v8.0 Engineer/Build split
> **Core idea:** Replace fixed design/engineer phases with dynamic domain-specialist teams and format-specific producers

---

## 1. Executive Summary

The current Intuition workflow (v8.0/8.1) uses a fixed five-phase pipeline: Prompt → Plan → Design → Engineer → Build. The design and engineer phases are code-centric — design uses ECD for architectural exploration, engineer produces `code_specs.md`, and build delegates to Code Writer subagents.

This proposal generalizes the workflow to handle any domain (legal, marketing, financial, creative, technical) by replacing the fixed design/engineer phases with a **dynamic specialist team** assembled after planning, and replacing Code Writer with **format-specific producers** during build.

### The Lawyer/Paralegal Model

- **Domain specialists** (Detail phase) act as expert consultants — they know the domain deeply, ask the right questions, extract what's needed from the user, and produce a detailed blueprint
- **Format producers** (Build phase) act as skilled creators — they take blueprints and produce deliverables in the right output format (Word docs, Excel sheets, slide decks, code files, etc.)

### Phase Flow

```
Prompt → Handoff → Plan → Handoff (team assembly) → Detail (specialist loop) → Handoff (conflict check + completeness gate) → Build → Handoff → Complete
```

---

## 2. Two-Registry Architecture

### 2.1 Domain Specialist Registry (Detail Phase)

Domain experts who consult with the user and produce blueprints. They ALWAYS produce a specification/blueprint, never the final deliverable.

**Registry tiers (resolution order):**
1. **Project-level:** `.claude/specialists/` — team-shared, version-controlled
2. **User-level:** `~/.claude/specialists/` — personal library, persists across projects
3. **Framework-shipped:** installed by npm package — curated defaults

**Profile format:** `{name}.specialist.md` — YAML frontmatter + markdown body

### 2.2 Format Producer Registry (Build Phase)

Format-specific creators who produce deliverables from blueprints. They execute what the specialist specified — no domain interpretation.

**Registry tiers (same resolution order):**
1. **Project-level:** `.claude/producers/`
2. **User-level:** `~/.claude/producers/`
3. **Framework-shipped:** installed by npm package

**Profile format:** `{name}.producer.md` — YAML frontmatter + markdown body

### 2.3 Dynamic Fallback

When team assembly encounters tasks that don't match any registered specialist:
1. Opus generates a temporary specialist profile
2. Profile is stored in `{context_path}/generated-specialists/` (session-only)
3. Opus may return null if an existing specialist actually fits (haiku misjudged)
4. After build completes, handoff offers to save the generated specialist to the user pool
5. At most ONE dynamic specialist per handoff invocation — multiple unmatched tasks require user intervention

---

## 3. Specialist Profile Schema

```yaml
# {name}.specialist.md
---
name: legal-analyst
display_name: Legal Analyst
domain: legal
description: >
  Analyzes legal requirements, regulatory compliance, contract structures,
  and application procedures. Produces blueprints for legal documents,
  filings, and compliance artifacts.

# Detail configuration
exploration_methodology: ECD  # default; can declare custom with justification
supported_depths: [Deep, Standard, Light]
default_depth: Deep

# Research configuration
research_patterns:
  - "Find all legal/regulatory reference documents"
  - "Locate existing contracts or legal templates"
  - "Identify compliance requirements in project briefs"
  - "Map jurisdictional constraints"

# Blueprint output
blueprint_sections:
  - "Legal Framework"
  - "Requirements Analysis"
  - "Document Structure"
  - "Clause Library"
  - "Risk Assessment"

# Build configuration — what producer to use
default_producer: document-writer
default_output_format: docx

# Review configuration
review_criteria:
  - "All regulatory requirements addressed"
  - "Clause language matches jurisdiction requirements"
  - "Cross-references are internally consistent"
  - "Risk factors documented with mitigation strategies"
mandatory_reviewers: []  # cross-cutting reviewers that always run for this domain

# Model configuration
model: opus           # for the specialist itself (detail phase)
reviewer_model: sonnet # for review during build
tools: [Read, Write, Glob, Grep, Task, AskUserQuestion]
---

# Legal Analyst

## Stage 1: Exploration Protocol

You are a legal analyst conducting exploration for a legal document task.

First, spawn haiku research subagents to read project context files matching your research patterns. Then conduct ECD exploration:

### Elements (E)
- What legal instruments are required?
- What parties, obligations, and conditions exist?
- What regulatory standards apply?
- What defined terms are needed?

### Connections (C)
- How do clauses cross-reference each other?
- What dependency chains exist between obligations?
- How does this integrate with existing legal framework?

### Dynamics (D)
- What triggers each obligation?
- What are the breach/cure/remedy flows?
- How are amendments and termination handled?

Write your findings to the specified stage1.md path. Structure the output as:
1. Research Findings (facts discovered from project context)
2. ECD Analysis (dimensional exploration results)
3. Assumptions (defaults you will use unless the user intervenes — each with a one-line rationale)
4. Key Decisions (options with recommended choice, rationale per option, risk if wrong)
5. Risks Identified (with severity and mitigation suggestions)
6. Recommended Approach (your overall recommendation)

**Assumptions vs Decisions:** An assumption has a clear best practice where deviation would be unusual (e.g., file naming convention matching existing patterns, standard model selection). A decision has multiple valid approaches where the user's preference matters (e.g., scope boundaries, architecture choices, depth of error handling). When uncertain, classify as a decision — the user can always accept the recommendation quickly, but they can't intervene on an assumption they never saw.

**Format compliance:** Use EXACTLY the heading levels and field labels specified above (`## Assumptions`, `### A1:`, `- **Default**:`, `- **Rationale**:`, `## Key Decisions`, `### D1:`, `- **Options**:`, `- **Recommendation**:`, `- **Risk if wrong**:`). The foreground skill parses by these headings — do not restructure, rename, or nest differently.

For Standard depth: abbreviate to Research Findings + Proposed Approach + Assumptions + 1-2 Key Decisions.

## Stage 2: Specification Protocol

You are a legal analyst producing a detailed blueprint from approved exploration findings.

You will receive: your Stage 1 findings, the user's decisions on each key question, and the confirmed assumptions (including any the user promoted to decisions and resolved).

**Research grounding rule:** Every design choice in the blueprint must be traceable to either (a) a finding from your Stage 1 research, (b) a user decision from decisions.json, or (c) a domain standard you can name. Do not invent formulas, thresholds, data structures, or workflows from first principles when your Stage 1 research already established them. When you must make a design choice not covered by Stage 1 or user decisions, note it explicitly in the blueprint's Open Items section.

Produce the full blueprint in the universal envelope format (9 sections). The Deliverable Specification (Section 5) must contain actual clause language detailed enough that a document-writer producer can assemble the complete legal document without making any legal decisions. Include:
- Exact clause text with section numbering
- Fill-in blanks for execution-time values (dates, names, amounts)
- All required statutory disclosures with correct citations
- [VERIFY] flags for items requiring attorney confirmation

## Review Protocol

You are reviewing a legal document produced from a blueprint you authored. Find problems.
Check each review criterion. Flag invented content, omitted content, and blurred legal distinctions.
Return: PASS or FAIL with specific findings.
```

---

## 4. Producer Profile Schema

```yaml
# {name}.producer.md
---
name: document-writer
type: producer
display_name: Document Writer
description: >
  Produces formatted long-form documents from specialist blueprints.

output_formats:
  - markdown    # zero-dependency default
  - docx        # opt-in, requires tooling

tooling:
  markdown:
    required: []
  docx:
    required:
      - python>=3.8
      - python-docx>=0.8.11
    optional:
      - pandoc

model: sonnet
tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Document Writer

You produce formatted documents from specialist blueprints. You do NOT interpret or expand the content — the blueprint is authoritative. Your job is structure, formatting, and faithful rendering of the blueprint's content.

## Input Protocol
Read the blueprint at the path provided. Extract:
- Document type and section structure from the "Producer Handoff" section
- Required content blocks (in order)
- Formatting requirements
- Target output format

## Output Protocol
- For `markdown`: write directly to `{output_directory}/{output_filename}.md`
- For `docx`: write a Python script to `{context_path}/scripts/produce_document.py` that uses python-docx, then execute it. Output to `{output_directory}/{output_filename}.docx`
- NEVER invent content not in the blueprint
- NEVER reinterpret specialist decisions
- NEVER make domain-level judgment calls

## Quality Self-Check
After production: verify section count matches blueprint, all required content blocks present, output file exists and is non-empty.
```

---

## 5. Blueprint Format (Universal Envelope)

Every specialist produces blueprints following this structure. Sections 1-4, 6-8 are universal and mandatory. Section 5 is the domain-specific payload.

```markdown
---
specialist: {name}
domain: {domain}
plan_tasks: [N, M]
depth: Deep|Standard|Light
status: draft|approved
---

# Blueprint: {Title}

## 1. Task Reference
[Plan task numbers, acceptance criteria copied from plan, dependencies]

## 2. Research Findings
[What the specialist learned from project context — grounding in facts, not assumptions]

## 3. Approach
[Chosen strategy with rationale. For Deep tasks: alternatives considered, tradeoffs, why this was selected]

## 4. Decisions Made
[Explicit list of judgment calls resolved during specialist dialogue. Each includes: the decision, alternatives considered, rationale, and user confirmation status]

## 5. Deliverable Specification
[The domain-specific payload — this is where the specialist's expertise lives. Structure varies by domain but must be detailed enough that the producer makes zero domain-level decisions]

## 6. Acceptance Mapping
[How each plan acceptance criterion is addressed by this blueprint. Direct traceability.]

## 7. Integration Points
[How this blueprint connects to other blueprints, existing project artifacts, or external systems. Enables conflict detection.]

## 8. Open Items
[Anything unresolved. MUST be empty before completeness gate passes. Non-empty = blueprint incomplete = build will not proceed.]

## 9. Producer Handoff
[Declares target producer, output format, filename, directory, and any format-specific directives]

output_format: docx
producer: document-writer
output_filename: zoning-variance-application.docx
output_directory: {context_path}/output/

### Formatting Requirements
[Page size, font, section numbering, styling directives — format-specific]

### Content Blocks (in order)
[Ordered list of content sections with the actual content the producer should render. This is the "95% solved" material that the producer formats and assembles.]
```

---

## 6. Review Chain

Build executes a three-layer review for every deliverable:

### 6.1 Review Order

```
Producer creates deliverable
        ↓
1. Domain Specialist Review (specialist profile as reviewer)
   "Does this deliverable accurately capture what the blueprint specified?
    Are the domain-specific requirements met?"
   → Catches: domain errors, misinterpreted specialist intent, missing nuance
        ↓ (only if specialist passes)
2. Builder Verification (build manager)
   "Do the plan's acceptance criteria pass?
    Is the deliverable complete against the blueprint's acceptance mapping?"
   → Catches: structural gaps, unaddressed acceptance criteria, missing sections
        ↓ (only if builder passes)
3. Mandatory Cross-Cutting Reviewers (if configured in specialist profile)
   Domain-specific safety nets (e.g., security-auditor for code, legal compliance for marketing)
   → Catches: cross-cutting concerns the specialist and builder aren't looking for
```

### 6.2 Review Failure Handling

- Specialist rejects → back to producer with specialist feedback. No builder review yet.
- Specialist passes, builder rejects → back to producer with builder feedback.
- Cross-cutting reviewer rejects → back to producer with reviewer findings.
- After 2 failed cycles on the same issue → escalate to user via build report.

### 6.3 Review Prompting

All reviews use adversarial prompting: "Find problems with this deliverable" not "Review this deliverable." Build frames every review as "Your job is to reject insufficient work."

### 6.4 Model Tiers

- Producer: declared in producer profile (typically sonnet)
- Specialist reviewer: declared in specialist profile (`reviewer_model`, typically sonnet)
- Builder verification: build manager itself (sonnet)
- Cross-cutting reviewers: declared in their own specialist profiles
- Rule: reviewer tier >= producer tier

---

## 7. Plan Phase Changes

### 7.1 Section 6 — Task Sequence (Updated)

Each task gains two new fields:

```markdown
### Task [N]: [Title]
- **Domain**: [free-text domain descriptor — e.g., "legal/regulatory", "marketing/copy", "code/backend"]
- **Depth**: Deep | Standard | Light
- **Component**: [which architectural component or project area]
- **Description**: [WHAT to do]
- **Acceptance Criteria**: [outcome-based, verifiable]
- **Dependencies**: [Task numbers] or "None"
- **Files**: [Specific paths] or "TBD"
```

**Domain** is a free-text descriptor. Plan does NOT reference specialist names. Team assembly matches domains to specialists.

**Depth** controls specialist invocation mode:
- **Deep** — full exploration → user confirmation gate → specification. For novel territory, multiple valid approaches, or high-stakes decisions.
- **Standard** — research → 1-2 confirmation questions → blueprint. For clear paths with a few key decisions.
- **Light** — research → blueprint produced autonomously. For straightforward, pattern-following tasks.

### 7.2 Section 6.5 — Detail Assessment (Replaces Design Recommendations)

```markdown
### 6.5 Detail Assessment

| Task(s) | Domain | Depth | Rationale |
|---------|--------|-------|-----------|
| Task 3, 4 | legal/regulatory | Deep — design exploration required | Novel regulatory territory, multiple valid approaches |
| Task 7 | code/api | Standard — confirmation needed | Follows existing patterns, one key decision |
| Task 1, 2 | code/frontend | Light — autonomous | Straightforward pattern application |
```

### 7.3 Section 10 — Planning Context for Detail Phase (Replaces Planning Context for Engineer)

```markdown
### 10. Planning Context for Detail Phase
- **Domain-Specific Considerations**: [per-domain notes — legal constraints, brand guidelines, data quality issues, performance targets]
- **Cross-Domain Dependencies**: [where specialist outputs must coordinate]
- **Sequencing Considerations**: [what depends on what across domains]
- **Open Questions**: [questions the detail phase must resolve, tagged by domain]
- **Constraints**: [hard boundaries per domain]
```

### 7.4 What Doesn't Change in Plan

- ARCH framework (Actors, Reach, Choices, Homestretch) — already domain-agnostic
- Sections 1-5, 7-9 of plan.md
- Plan stays registry-ignorant — never references specialist names or profiles
- Acceptance criteria remain outcome-based, not implementation-prescriptive

---

## 8. Team Assembly (Handoff Transition)

### 8.1 When It Runs

During the plan→detail handoff transition (replacing current transitions 2/2B).

### 8.2 Mechanism

Constrained haiku LLM pass:

```
Input:
  - Plan task list with Domain and Depth fields
  - Available specialist names + domain_tags (from registry scan)
  - Available producer names + output_formats (from registry scan)

Output (team_assignment.json):
{
  "specialist_assignments": [
    {
      "specialist": "legal-analyst",
      "tasks": [
        {"task_id": "T1", "depth": "Deep"},
        {"task_id": "T4", "depth": "Light"}
      ],
      "rationale": "Tasks involve regulatory compliance and legal document drafting"
    }
  ],
  "producer_assignments": [
    {
      "specialist": "legal-analyst",
      "producer": "document-writer",
      "output_format": "docx",
      "tasks_output_files": ["deliverables/01_lease_agreement.md"]
    }
  ],
  "execution_order": [
    {"phase": 1, "specialists": ["legal-analyst", "financial-analyst"], "rationale": "No dependencies, run in parallel"},
    {"phase": 2, "specialists": ["marketing-strategist"], "rationale": "Depends on financial-analyst pricing"}
  ],
  "dependencies": [
    {"specialist": "marketing-strategist", "reads_blueprint_from": "financial-analyst", "reason": "Listing copy needs pricing from rental analysis"}
  ],
  "unmatched_tasks": [
    {"task_id": "T3", "title": "Create Listing Copy", "domain": "marketing/copy", "reason": "No specialist with marketing domain_tags"}
  ],
  "prerequisite_check": {
    "document-writer/docx": "PASS — python-docx 0.8.11 found",
    "code-writer": "PASS — no prerequisites"
  }
}

Notes on schema:
- `specialist_assignments[].tasks` is per-task with individual depth, replacing the flat `task_ids` + single `depth` field
- `dependencies` is for CROSS-SPECIALIST dependencies only. Same-specialist task sequencing (e.g., T2 before T5, both financial-analyst) is handled via `execution_order` phases
- `execution_order` includes rationale for each phase
```

### 8.3 Prerequisite Checking

Runs at assembly time for all selected producers. Checks tooling requirements via Bash. If a required tool is missing, assembly halts with install instructions — user finds out before starting specialist dialogue, not after.

### 8.4 User Confirmation

Assembly presents the proposed team and asks user to confirm before proceeding. User can override producer selections, adjust specialist assignments, or add/remove specialists.

---

## 9. Detail Phase (Specialist Loop)

### 9.1 Architecture: Foreground Skill + Two Fresh Subagents

The `intuition-detail` skill runs as a **foreground opus skill** that orchestrates specialist subagents. It does NOT try to be the specialist itself — it handles user interaction and disk I/O while specialist subagents handle domain work.

**Why this pattern:** Task subagents cannot sustain multi-turn AskUserQuestion conversations. The foreground skill handles the one thing subagents can't (interactive user dialogue) while specialist subagents handle domain expertise (exploration and specification).

```
intuition-detail skill (foreground, opus)
  │
  ├── Reads specialist profile from disk
  ├── Parses Stage 1 protocol + Stage 2 protocol sections
  │
  ├── STAGE 1: Spawns exploration subagent (opus)
  │     → System prompt = specialist's Stage 1 protocol
  │     → Context = plan tasks + research patterns + prior blueprints
  │     → Writes {context_path}/scratch/{specialist-name}-stage1.md
  │     → Returns summary
  │
  ├── USER GATE: Skill reads stage1.md
  │     → Phase 1: Present assumptions as group, user accepts or promotes any to decisions
  │     → Phase 2: Present each decision with 2-3 options (recommended first, rationale, Other)
  │     → Adaptive presentation based on decision count (see 9.8)
  │     → Writes decisions to {context_path}/scratch/{specialist-name}-decisions.json
  │     → (Deep: full assumptions review + all decisions)
  │     → (Standard: assumptions + decisions, streamlined presentation)
  │     → (Light: skip gate entirely)
  │
  ├── STAGE 2: Spawns specification subagent (opus, FRESH — not resumed)
  │     → System prompt = specialist's Stage 2 protocol
  │     → Injected context = stage1.md contents + decisions.json
  │     → Writes {context_path}/blueprints/{specialist-name}.md
  │
  └── Confirms blueprint written, routes to next specialist or handoff
```

**Key design decisions:**
- Stage 2 is a **fresh subagent**, not a resumed one. Resume is unreliable for this purpose — context may degrade. Stage 2 gets Stage 1 findings as injected content, not conversation history.
- **Disk as handoff**: `stage1.md` and `decisions.json` persist between stages, survive `/clear` or crashes. If the gate is interrupted, the skill reads `decisions.json` on restart and resumes from the last unanswered decision.
- **No "chameleon" behavior**: The skill does not adopt the specialist's persona. It reads the profile, extracts the right protocol section, and injects it as the subagent's system prompt. Domain intelligence stays in the subagents.
- **User controls engagement depth**: The gate presents assumptions separately from decisions. The user chooses how much to engage — accept all assumptions and blow through decisions quickly, or promote assumptions and deliberate on each one.

### 9.2 Specialist Profile Structure (Two-Protocol Format)

Specialist profiles MUST contain two named sections in their body that the `intuition-detail` skill parses and injects into the appropriate subagent:

```markdown
## Stage 1: Exploration Protocol
[What the exploration subagent does]
- Research patterns and what to look for
- Exploration methodology (ECD dimensions or custom)
- What decisions to surface for user
- How to structure the stage1.md output file
- Risks and considerations to flag

## Stage 2: Specification Protocol
[What the specification subagent does]
- Blueprint sections to produce
- How to incorporate user decisions from Stage 1
- Deliverable specification format
- Completeness requirements
- Producer handoff format
```

The foreground skill extracts sections by heading — trivial parsing, no complex logic.

### 9.3 Depth-Controlled Execution

Depth controls the **floor** of the gate protocol, not the ceiling. A Standard task can still surface many decisions if the research warrants it — depth determines how much infrastructure the gate provides, not how many questions the specialist can ask.

**Deep tasks (two-stage with full gate):**
1. **Stage 1 subagent** runs full exploration protocol (ECD or custom methodology). Writes structured findings to `{context_path}/scratch/{specialist-name}-stage1.md` including: dimensional analysis, assumptions with rationale, decisions with options and recommendations, risks, and areas needing user input.
2. **User gate** (foreground skill): Full gate protocol (see 9.8). Phase 1: present assumptions, user accepts or promotes. Phase 2: present decisions individually with options (recommended first, rationale per option, Other available). Writes resolved state to `{context_path}/scratch/{specialist-name}-decisions.json`.
3. **Stage 2 subagent** receives stage1.md + decisions.json. Produces the full blueprint in the universal envelope format.

**Standard tasks (confirmatory):**
1. **Stage 1 subagent** runs abbreviated exploration — research + proposed approach + assumptions + 1-2 key decisions. Writes concise findings to stage1.md.
2. **User gate** (foreground skill): Streamlined gate. Presents assumptions and decisions together in a single summary, asks for confirmation or overrides. Same structure as Deep but more compact presentation.
3. **Stage 2 subagent** produces blueprint with confirmed approach.

**Light tasks (autonomous — no user gate):**
1. **Single subagent** runs both exploration and specification in one pass. Writes blueprint directly to `{context_path}/blueprints/{specialist-name}.md`. No stage1.md, no user interaction. All items treated as assumptions — the specialist uses its best judgment.
2. User reviews the completed blueprint (via the completeness gate, not during production).

### 9.4 ECD as Default Exploration Methodology

Every specialist MUST declare an exploration methodology in their Stage 1 protocol. If none is declared, ECD (Elements, Connections, Dynamics) is applied automatically. Specialists may replace ECD with a domain-native methodology as long as it satisfies: **tracked dimensional exploration with explicit coverage gates before moving to specification.**

### 9.5 Research-Before-Dialogue

Every specialist's Stage 1 protocol begins with research subagents (haiku) reading relevant project context. Research targets are domain-appropriate (defined in the specialist's `research_patterns` field). The Stage 1 subagent spawns its own haiku research subagents before performing exploration. External research is NOT attempted — if the specialist needs external references, the user must place them in the project.

### 9.6 Specialist Re-Routing

If a Stage 1 subagent discovers mid-exploration that the task belongs to a different domain, it flags this in its stage1.md output. The foreground skill presents the re-route recommendation to the user and can reassign to a different specialist without losing the exploration context (stage1.md is already on disk).

### 9.7 Scratch File Lifecycle

Stage 1 scratch files (`{context_path}/scratch/{specialist-name}-stage1.md`) are intermediate artifacts:
- Created by Stage 1 subagent
- Read by the foreground skill for user presentation
- Injected into Stage 2 subagent as context
- Retained for auditability after blueprint is complete
- Not consumed by build phase (build reads blueprints only)

Decision files (`{context_path}/scratch/{specialist-name}-decisions.json`) are gate output artifacts:
- Created incrementally by the foreground skill during the user gate
- Each decision/assumption is written as it's resolved (crash recovery)
- Injected into Stage 2 subagent alongside stage1.md
- Retained for auditability

### 9.8 User Gate Protocol

The user gate is the foreground skill's core responsibility. It translates Stage 1's domain-expert output into a human-friendly consultation, collects the user's input, and produces structured decisions for Stage 2.

#### 9.8.1 Stage 1 Output Format

Stage 1 writes stage1.md with these sections (in order):

```markdown
## Research Findings
[Facts from codebase research — file paths, schemas, patterns, constraints]

## ECD Analysis (or domain-equivalent exploration)
[Dimensional exploration results]

## Assumptions
### A1: [Title]
- **Default**: [what the specialist will do]
- **Rationale**: [why this is the obvious choice]

### A2: [Title]
...

## Key Decisions
### D1: [Title]
- **Options**:
  - A) [option — recommended]: [rationale]
  - B) [option]: [rationale]
  - C) [option]: [rationale]
- **Recommendation**: A, because [reason]
- **Risk if wrong**: [what happens if this decision is made poorly]

### D2: [Title]
...

## Risks Identified
[Each risk with severity and mitigation]

## Recommended Approach
[Overall recommendation summarizing the proposed direction]
```

The assumptions/decisions split is the specialist's best judgment. The user gate allows reclassification.

**Format compliance:** Stage 1 MUST use exactly the heading levels and field labels specified above. Do not restructure, rename, or nest differently. The foreground skill parses stage1.md by these exact headings — creative reformatting will break the gate.

#### 9.8.2 Gate Phase 1: Assumptions Review

**Fallback:** If stage1.md contains no `## Assumptions` section, treat all items under `## Key Decisions` as decisions and skip Phase 1 entirely. This handles specialist profiles that omit the assumptions/decisions guidance or older profiles that haven't been updated.

The skill presents all assumptions as a group:

```
The specialist proposes these defaults:

A1: [Title] — [Default] ([one-line rationale])
A2: [Title] — [Default] ([one-line rationale])
A3: [Title] — [Default] ([one-line rationale])
...

Accept all, or tell me which ones you want to weigh in on.
```

Use AskUserQuestion with options:
- "Accept all assumptions" (recommended)
- "I want to review some of these"

If the user wants to review: ask which assumptions to promote. For each promoted assumption, present a simple AskUserQuestion:

```
The specialist planned to use [default] for [title]. What would you prefer?
```

Options:
- "[Default] (specialist's recommendation)"
- "Something else — I'll describe what I want"

The skill does NOT construct domain-specific alternatives — that would require domain reasoning the orchestrator shouldn't do. The user provides the alternative directly, and it gets recorded as a promoted assumption with their override text. Stage 2 interprets it in domain context.

#### 9.8.3 Gate Phase 2: Decisions

Present each decision using AskUserQuestion with 2-3 options. The recommended option appears first with "(Recommended)" appended. Each option includes a brief rationale. "Other" is always available (AskUserQuestion provides this automatically).

**Adaptive presentation based on decision count:**

- **1-7 decisions**: Present each individually via AskUserQuestion. One question per decision. Full rationale per option. This is the common case — most tasks surface fewer than 8 decisions.
- **8+ decisions**: Present a summary table first showing all decisions with the specialist's recommendations. Use AskUserQuestion with `multiSelect: true` to ask: "Which of these do you want to discuss? The rest will go with the specialist's recommendation." Then present only the selected decisions individually.

For "Other" responses: the skill accepts the user's alternative without validation. The specialist in Stage 2 will work with whatever the user decided. If the choice causes downstream problems, they'll surface in the blueprint's Open Items or in the review chain during build.

#### 9.8.4 Decisions File Format

The gate writes decisions incrementally to `{context_path}/scratch/{specialist-name}-decisions.json`:

```json
{
  "specialist": "legal-analyst",
  "gate_started": "2026-02-27T14:30:00Z",
  "gate_completed": null,
  "assumptions": [
    {
      "id": "A1",
      "title": "File naming convention",
      "default": "hardware_eval_YYYY-MM-DD_[slug].md",
      "status": "accepted",
      "user_override": null
    },
    {
      "id": "A2",
      "title": "Model selection",
      "default": "sonnet",
      "status": "promoted",
      "user_override": "opus",
      "rationale": "User wants deeper reasoning for analysis"
    }
  ],
  "decisions": [
    {
      "id": "D1",
      "title": "Blueprint scope",
      "context": "Task 2 deliverable already exists as a 708-line skill. Options range from patching to full rewrite.",
      "options": ["A: Full rewrite (recommended)", "B: Patch existing", "C: Review only"],
      "chosen": "A",
      "user_input": null
    },
    {
      "id": "D2",
      "title": "Error handling depth",
      "context": "Stage 1 identified 12 possible error cases. The existing implementation handles 7.",
      "options": ["A: Comprehensive (recommended)", "B: Minimal"],
      "chosen": "other",
      "user_input": "Match the 7 cases from the existing implementation, don't add new ones"
    }
  ]
}
```

The `context` field gives Stage 2 enough background to act on each decision (especially "Other" choices) without re-reading stage1.md to find the relevant section. The foreground skill populates it from the decision's surrounding context in stage1.md.

**Read-before-write rule:** After each user response, the skill MUST Read the current decisions.json from disk, update it with the new answer, and Write the full file back. Do not rely on conversation memory for previously collected answers — auto-compaction may discard earlier state. The file on disk is the source of truth.

`gate_completed` is set to a timestamp when all items are resolved.

#### 9.8.5 Crash Recovery

On startup, the detail skill MUST re-read the detail brief from disk to determine which specialist and task it's working on. Do not rely on conversation history for this context — `/clear` erases it.

If the detail skill starts and finds an existing `decisions.json` with `gate_completed: null`:
1. Re-read stage1.md to restore the full assumptions and decisions list
2. Read decisions.json to determine what's been answered
3. Present a summary: "Found an in-progress consultation. You've answered X of Y items. Resuming from [next item]."
4. Continue the gate from the first unresolved item
5. Do NOT re-ask resolved items

If the skill starts and finds `decisions.json` with `gate_completed` set (and no blueprint exists yet):
1. The gate is done — skip directly to Stage 2
2. Present a summary: "Found completed consultation from [timestamp]. Proceeding to blueprint generation."

---

## 10. Conflict Detection and Completeness Gate

### 10.1 Post-Blueprint Conflict Detection

After ALL specialists complete their blueprints, a haiku subagent runs a conflict scan:

- Reads all blueprints in `{context_path}/blueprints/`
- Flags: contradictory decisions, overlapping file modifications, inconsistent interface assumptions, duplicated work
- Writes `{context_path}/blueprint-conflicts.md`
- If conflicts found → presented to user for resolution before proceeding
- If clean → proceeds to completeness gate

### 10.2 Completeness Gate

For each blueprint:
- Section 8 "Open Items" must be empty
- All mandatory blueprint sections must be present and non-empty
- Acceptance mapping must address every plan acceptance criterion
- Producer handoff section must reference a valid producer from the registry

If any blueprint fails the gate → escalated to user, build does not start.

---

## 11. Build Phase Changes

### 11.1 Build's Role (Unchanged Principle)

Build is a **domain-agnostic process engine**. It delegates, orchestrates, and verifies. It makes NO domain decisions. All domain intelligence lives in specialist profiles, producer profiles, and blueprints.

### 11.2 Delegation

For each task:
1. Read the blueprint's Producer Handoff section
2. Load the declared producer's profile from the registry
3. Construct the delegation prompt using the producer profile's template
4. Spawn the producer as a Task subagent

### 11.3 Review Chain

Three-layer review per deliverable (see Section 6):
1. Domain specialist review (catches domain errors)
2. Builder verification (catches acceptance criteria gaps)
3. Mandatory cross-cutting reviewers (catches cross-domain concerns)

### 11.4 Build Report (Extended)

```markdown
# Build Report

## Task Results

### Task N: [Title]
- **Domain**: legal/regulatory
- **Specialist**: legal-analyst
- **Producer**: document-writer (docx)
- **Output**: {context_path}/output/zoning-variance-application.docx
- **Status**: PASS | FAIL | PARTIAL

#### Review Chain
1. **Specialist Review** (legal-analyst): PASS — "All regulatory requirements addressed, clause language appropriate for jurisdiction"
2. **Builder Verification**: PASS — "All 4 acceptance criteria met"
3. **Cross-Cutting Review**: N/A — no mandatory reviewers configured

#### Deviations from Blueprint
[Any deviations and rationale]

#### External Dependencies
[Anything requiring human action — e.g., "Requires review by licensed attorney before filing"]
```

---

## 12. Handoff Transitions (Updated)

| # | Transition | Description |
|---|-----------|-------------|
| 0 | Branch creation | No change |
| 1 | Prompt → Plan | No change |
| 2 | Plan → Detail | **Runs team assembly.** Scans registries, runs constrained haiku matching, prerequisite checks, writes `team_assignment.json`, generates first specialist brief. |
| 3 | Specialist → Specialist | **Replaces design→design loop.** Tracks completed blueprints, routes to next specialist per dependency order, passes prior blueprints as context. |
| 4 | Detail → Build | **New: conflict check + completeness gate.** Runs haiku conflict detection, validates all blueprints, generates build brief. |
| 5 | Build → Complete | **Extended.** Reads build report, includes domain field, review chain results, external dependency flags. Offers git commit/push. Routes to `/intuition-start`. |

### State Schema (v6.0)

```json
{
  "detail": {
    "started": false,
    "completed": false,
    "team_assignment": null,
    "specialists": [
      {
        "name": "legal-analyst",
        "tasks": [
          {"task_id": "T1", "depth": "Deep"},
          {"task_id": "T3", "depth": "Light"}
        ],
        "status": "pending|in_progress|completed",
        "stage": "stage1|user_gate|stage2|done",
        "stage1_path": null,
        "decisions_path": null,
        "blueprint_path": null
      }
    ],
    "current_specialist": null,
    "execution_phase": 1,
    "conflict_check": {
      "ran": false,
      "passed": false,
      "issues": []
    },
    "completeness_gate": {
      "ran": false,
      "passed": false,
      "failures": []
    }
  }
}
```

Replaces the current `design` and `engineering` state objects.

---

## 13. Shipped Rosters

### 13.1 Domain Specialists (15)

**Code/Technical (6):**
| Name | Domain | Default Depth |
|------|--------|---------------|
| database-architect | database | Standard |
| api-designer | api | Standard |
| frontend-component | frontend/ui | Standard |
| security-auditor | security | Deep |
| devops-infrastructure | devops/infra | Standard |
| test-strategist | testing | Standard |

**Professional/Business (5):**
| Name | Domain | Default Depth |
|------|--------|---------------|
| legal-analyst | legal/regulatory | Deep |
| financial-analyst | financial | Deep |
| marketing-strategist | marketing | Deep |
| project-manager | project-management | Standard |
| business-analyst | business/requirements | Deep |

**Content/Creative (4):**
| Name | Domain | Default Depth |
|------|--------|---------------|
| technical-writer | documentation | Standard |
| copywriter | marketing/copy | Standard |
| research-analyst | research/analysis | Deep |
| instructional-designer | education/training | Deep |

### 13.2 Format Producers (6)

| Name | Formats | Default | Tooling (opt-in) |
|------|---------|---------|------------------|
| code-writer | source files | N/A | N/A |
| document-writer | markdown, docx | markdown | python-docx |
| spreadsheet-builder | CSV, xlsx | CSV | openpyxl |
| presentation-creator | markdown, pptx | markdown | python-pptx |
| form-filler | markdown, pdf | markdown | reportlab / fpdf2 |
| data-file-writer | JSON, YAML, XML | JSON | N/A |

Each producer operates in two modes:
- **Markdown/text mode** (zero dependencies) — ships as default
- **Native format mode** (opt-in) — requires tooling, checked at team assembly

---

## 14. Decisions Log

Key architectural decisions made during roundtable and rationale:

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Two separate registries (specialists + producers) | Different lookup patterns, different schemas, cleaner separation |
| D2 | Plan stays registry-ignorant | Prevents coupling, avoids plan overreach, domain descriptors are sufficient |
| D3 | ECD as default exploration methodology with opt-out | Prevents "empty methodology" failure while allowing domain-native alternatives |
| D4 | Depth-controlled specialist invocation (Deep/Standard/Light) | Preserves divergent exploration for complex tasks without overhead on simple ones |
| D5 | Two-stage specialist invocation for Deep tasks | Protects the divergent/convergent split that design/engineer currently enforce |
| D6 | Specialists always produce specs, never final deliverables | Lawyer/paralegal model — expert consults, creator produces |
| D7 | Three-layer review: specialist + builder + cross-cutting | Domain accuracy, acceptance criteria, and cross-domain concerns each get a dedicated check |
| D8 | Build stays domain-agnostic, one management strategy | Domain intelligence in registry + blueprints, not in build logic |
| D9 | Team assembly in handoff via constrained haiku LLM pass | Prevents hallucinated specialists, keeps assembly cheap and fast |
| D10 | Dependency ordering + conflict detection (no lead specialist) | More reliable than a designated lead, avoids single point of failure |
| D11 | Prerequisite checking at team assembly time | User discovers missing tools before investing time in specialist dialogue |
| D12 | Specialist declares producer in blueprint, user overrides at assembly | Authority chain: specialist recommends, user decides, build executes |
| D13 | Dynamic fallback with temp storage + opt-in save | Handles long-tail domains without polluting the curated registry |
| D14 | Markdown producers as zero-dep default, native formats opt-in | Broad accessibility, no forced dependencies |
| D15 | Both specialist and builder review producer output | Domain correctness (specialist) + acceptance criteria (builder) = comprehensive coverage |
| D16 | Foreground skill + two fresh subagents for Deep mode | Subagents can't sustain multi-turn AskUserQuestion; skill handles user gate, subagents handle domain work; resume is unreliable — use fresh Stage 2 with Stage 1 findings injected |
| D17 | Specialist profiles split into Stage 1 + Stage 2 protocols | Foreground skill parses by heading, injects right section into each subagent; keeps single file per specialist |
| D18 | Disk as handoff between stages (stage1.md) | Persists between stages, survives /clear or breaks, auditable |
| D19 | Assumptions/decisions separation in Stage 1 output | User controls engagement depth — accept defaults quickly or promote assumptions to decisions. Prevents both decision fatigue (too many questions) and surprise (specialist made choices user didn't know about) |
| D20 | Adaptive gate presentation based on decision count | 1-7 individual, 8+ triage table with multiSelect. Clustering (4-7 range) dropped — unreliable semantic grouping by the orchestrator, and 7 individual questions isn't overwhelming |
| D21 | Incremental decisions.json for crash recovery | Each resolved item written immediately. Gate resumes from last unanswered item on restart. No lost work from crashes or /clear |
| D22 | No validation loop — user's "Other" choices accepted directly | Simplicity over safety nets. Stage 2 can flag risks in the blueprint. Review chain catches problems during build. Avoids over-engineering the gate with speculative pushback |
| D23 | Greenfield-first design — Stage 2 invents grounded designs, not transcriptions | Projects are typically greenfield (no existing artifact to reproduce). Stage 2's job is grounded invention: design choices traceable to Stage 1 research, user decisions, or named domain standards. "Faithfulness" means research-grounded, not reference-matching. No Reference Behavior input, no deviation flags, no faithfulness checks against prior implementations |

---

## 15. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Coherence loss from multiple specialists | Dependency ordering at assembly + post-blueprint haiku conflict detection |
| Shallow blueprints that build can't execute | Completeness gate (Section 8 empty, all sections present, acceptance mapping complete) |
| Dynamic fallback producing low-quality specialists | Opus can return null, temp storage only, max 1 per invocation, explicit save opt-in |
| Wrong specialist assigned to task | Re-routing supported mid-exploration; user confirms team at assembly |
| Haiku model insufficient for some producers | Model tier declared in producer profile, reviewer tier >= producer tier |
| Prerequisites missing at build time | Checked at team assembly, halts with install instructions before specialist dialogue |
| Prompt drift on dynamic specialists | Registry-first matching; dynamic is explicitly flagged fallback |
| User overwhelm from team complexity | Light-depth tasks run autonomously; user only interacts on Deep tasks. Assumptions/decisions split lets user fast-track when they trust the specialist |
| Gate interrupted by crash or /clear | decisions.json written incrementally; gate resumes from last unanswered item |

---

## 16. Critical Path (Build Order)

### Phase 1: Blueprint + Build Prototype
- One specialist profile (database-architect) with full schema
- One blueprint produced manually following the universal format
- Build skill modified to read a blueprint instead of code_specs.md
- One producer profile (code-writer) adapted from existing Code Writer
- **Validate:** Build can delegate and verify from a blueprint

### Phase 2: Team Assembly Prototype
- Haiku LLM pass that reads plan annotations + registry, returns JSON
- Prerequisite checking logic
- **Validate:** Assignments are sensible, prerequisites caught, runs in <5 seconds

### Phase 3: Single Specialist Deep Mode
- Detail skill that loads a specialist profile and runs explore/specify flow
- Test with database-architect on a Deep-tier task
- **Validate:** ECD exploration works, user gate functions, blueprint matches format

### Phase 4: Multi-Specialist Coordination
- Specialist loop in handoff
- Conflict detection pass
- **Validate:** Later specialists receive earlier blueprints, conflicts detected

### Phase 5: Producer Diversity
- All 6 producer profiles
- Native format mode for document-writer (python-docx)
- **Validate:** Non-code deliverables produced correctly

### Phase 6: Full Roster + Registry
- All 15 specialist profiles
- Directory scanning resolution
- Dynamic fallback generation
- Save-to-user-pool flow

### Phase 7: Integration + Migration
- State schema v6.0
- All handoff transitions updated
- Plan skill updated with Domain/Depth fields
- Design + Engineer skills deprecated
- Full end-to-end test

---

## 17. Migration Notes

### What Gets Deprecated
- `intuition-design` skill (absorbed into Detail phase specialist loop)
- `intuition-engineer` skill (absorbed into Detail phase specialist loop)
- `code_specs.md` artifact (replaced by `blueprints/{specialist}.md`)
- `design_spec_*.md` artifacts (replaced by blueprints)

### What Gets Added
- `intuition-detail` skill (new — orchestrates specialist loop)
- `.specialist.md` file type + registry
- `.producer.md` file type + registry
- `team_assignment.json` artifact
- `blueprints/` directory in context path
- `blueprint-conflicts.md` artifact

### What Gets Modified
- `intuition-plan` — Sections 6, 6.5, 10 updated
- `intuition-handoff` — New transitions 2, 3, 4 replacing current design/engineer transitions
- `intuition-build` — Blueprint-based input, producer delegation, three-layer review chain
- State schema — v5.0 → v6.0 (detail object replaces design + engineering)

### Backward Compatibility
- Existing v8.x projects continue working until explicitly migrated
- New projects use v9.0 by default
- No breaking changes to prompt, start, debugger, or advisory skills
