# Skill Interaction Guide - How the Five Skills Work Together

**Purpose:** Quick reference for understanding how the five Intuition skills interact, what files they create/read, and how the system orchestrates work.

**Version:** 3.0.0 | **Updated:** February 5, 2026

---

## The Five Skills at a Glance

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INTUITION SKILL ECOSYSTEM                        │
└─────────────────────────────────────────────────────────────────────┘

/intuition-start
  └─ WHEN: Session begins
  └─ WHAT: Load context, detect phase, suggest next step
  └─ READS: .project-memory-state.json, all memory files
  └─ WRITES: .project-memory-state.json (updates)
  └─ OUTPUT: Phase status, next recommended skill

            ↓

/intuition-discovery (Waldo - Research-Informed Thinking Partner)
  └─ WHEN: Starting new feature or exploring problems
  └─ WHAT: Deep problem understanding through research-informed dialogue
  └─ READS: Existing memory (context), codebase (for research)
  └─ WRITES: discovery_brief.md, discovery_output.json, .project-memory-state.json
  └─ OUTPUT: Narrative brief + structured findings + user profile learnings

            ↓

/intuition-handoff (Orchestrator - Phase Coordinator)
  └─ WHEN: After discovery completes (before planning)
  └─ WHAT: Extract insights, update memory, generate brief for next agent
  └─ READS: discovery_brief.md, discovery_output.json, plan.md (if planning→exec)
  └─ WRITES: key_facts.md, decisions.md, issues.md, USER_PROFILE.json,
             planning_brief.md OR execution_brief.md, .project-memory-state.json
  └─ OUTPUT: Updated memory, fresh brief for next phase, profile merged

            ↓

/intuition-plan (Magellan - Strategist & Planner)
  └─ WHEN: After discovery handoff, ready to design approach
  └─ WHAT: Research codebase, synthesize plan with structured tasks
  └─ READS: planning_brief.md, existing memory, USER_PROFILE.json, codebase
  └─ WRITES: plan.md, .project-memory-state.json (updates)
  └─ OUTPUT: Structured plan with tasks, dependencies, risks, confidence

            ↓

(User reviews and approves plan)

            ↓

/intuition-handoff (Orchestrator - Prepare Execution)
  └─ WHEN: After planning completes
  └─ WHAT: Prepare context for execution phase
  └─ READS: plan.md
  └─ WRITES: execution_brief.md, issues.md, .project-memory-state.json
  └─ OUTPUT: Execution brief, updated memory

            ↓

/intuition-execute (Faraday - Implementer & Orchestrator)
  └─ WHEN: Plan approved and ready to implement
  └─ WHAT: Break plan into tasks, delegate to sub-agents, verify completion
  └─ READS: execution_brief.md, existing memory, USER_PROFILE.json, codebase
  └─ WRITES: bugs.md, decisions.md, issues.md, .project-memory-state.json
  └─ OUTPUT: Implemented features, updated memory, completion report

            ↓

(New iteration starts)
  └─ Go back to /intuition-discovery for next feature or problem
```

---

## Detailed Skill Specifications

### 1. /intuition-start - Session Primer

**Activation:** First command at session start

**Role:** "Where are we in the workflow and what's next?"

**Key Logic:**
```
1. Read .project-memory-state.json
2. Detect current workflow status:
   - status == "discovery" → suggest /intuition-discovery or /intuition-handoff
   - status == "planning" → suggest /intuition-plan or /intuition-handoff
   - status == "executing" → suggest /intuition-execute
   - status == "complete" → suggest /intuition-discovery for new iteration
3. Generate status brief explaining what's been completed
4. Suggest next skill to run
```

**User Experience:**
```
You: /intuition-start

Start Skill:
"Welcome back! Here's where we are:

✓ Discovery: Complete (Feb 3)
✓ Planning: Not yet started

You're ready to create a plan. Run /intuition-plan to have Magellan
synthesize discovery into a structured approach."
```

**Memory Footprint:**
- Reads: `.project-memory-state.json`, `discovery_brief.md`, `plan.md`, etc.
- Writes: Updates to `.project-memory-state.json` (minimal)
- Creates: Nothing new

**Resume Support:** N/A (stateless)

---

### 2. /intuition-discovery (Waldo) - Research-Informed Thinking Partner

**Activation:** When user runs `/intuition-discovery`

**Role:** "Help me understand this problem/opportunity deeply"

**v3 Redesign: Research-Informed Thinking Partnership**

Instead of interrogating the user, Waldo is now:
- A wise confidant who researches first
- Brings knowledge about best practices and pitfalls
- Uses "yes, and..." collaboration
- Asks 1-2 focused questions per turn
- Gently steers when needed

**Workflow:**

```
STEP 1: Greeting & Mode Selection
  Waldo: "What do you want to explore today?"
  Options: Build something | Problem-solve | Validate idea | Other
  User selects → Stored in state.discovery.dialogue_mode

STEP 2: User Describes Context
  Waldo: "Tell me more about what you're exploring"
  User: Describes problem/opportunity in own words
  Waldo: Identifies domain from user input

STEP 3: Research Launch (PARALLEL)
  [Single Waldo message launches 3 research tasks in parallel]
  Task 1: Best practices and standards in [user's domain]
  Task 2: Common pitfalls and inefficiencies
  Task 3: (Optional) Emerging patterns or alternatives

  While research runs: Waldo continues dialogue

STEP 4: Research Informs Questions
  [Research completes, Waldo has full context]
  Waldo asks 1-2 focused questions informed by:
  - User's initial context
  - Research findings
  - GAPP dimensions (Problem, Goals, Context, Motivation)

  GUIDED MODE: AskUserQuestion with 2-4 options
  OPEN-ENDED MODE: Conversational question (no options)

STEP 5: Dialogue Continues
  - 1-2 questions per turn
  - Building on user's answers (yes, and...)
  - Integrating research insights naturally
  - Documenting assumptions with confidence
  - Exploring all GAPP dimensions
  - Gleaning user profile information

STEP 6: Formalization
  When all dimensions covered:
  Waldo: "Ready to capture what we've learned?"
  User: Yes → Creates outputs
           No → Continues dialogue

STEP 7: Outputs Created
  - discovery_brief.md (narrative summary)
  - discovery_output.json (structured data + user_profile_learnings)

STEP 8: Route to Handoff
  Waldo: "Run /intuition-handoff to transition to planning"
  (NOT directly to /intuition-plan)
```

**Dialogue Modes (v3 New):**

**Guided Mode:**
- AskUserQuestion with 2-4 options
- "Other" always available
- Structured but flexible
- Good for: Users who like clear direction

**Open-Ended Mode:**
- Conversational questions
- User answers however they want
- Natural flow
- Good for: Users who prefer freedom

**Both modes produce:**
- Identical discovery depth
- Same GAPP coverage
- Same research-informed insights
- Only dialogue style differs

**Research Agents (v3 New):**

Waldo launches 3 research tasks in parallel:

```
Task 1: Best Practices & Standards
  Goal: Learn what works well in user's domain
  Approach: Research industry standards, proven patterns, best practices
  Output: Top 5-10 key practices, why they matter, how teams use them

Task 2: Common Pitfalls & Inefficiencies
  Goal: Learn what catches teams off-guard
  Approach: Research failure patterns, common mistakes, efficiency traps
  Output: Top 5 pitfalls, why they happen, how to avoid them

Task 3: Emerging Patterns (Optional)
  Goal: Learn about innovations and alternatives
  Approach: Research new approaches, emerging standards, alternatives
  Output: Trends, new methodologies, cutting-edge practices
```

**State Tracking:**

Stored in `.project-memory-state.json` > `discovery` section:
- dialogue_mode (guided vs. open-ended)
- initial_context (what user said at start)
- research_performed (all 3 research tasks + findings)
- conversation_via_mode (all questions and answers)
- gapp (coverage of Problem/Goals/Context/Motivation)
- assumptions (documented with confidence)
- quality_score (ready for formalization?)

**User Profile Learnings (v3 New):**

In `discovery_output.json` > `user_profile_learnings`:
- Role, seniority level, years of experience
- Organization (name, type, industry, location)
- Expertise areas and primary skills
- Learning style and preferences
- Communication style and pace
- Decision-making approach
- What motivates them
- Technical environment and tools
- Confidence score for each property

**Output Files:**

1. **discovery_brief.md** (Narrative)
   ```markdown
   # Discovery Brief

   ## Problem
   [Core challenge and context]

   ## Goals
   [Success criteria]

   ## User Context
   [Personas and workflows]

   ## Personalization / Motivation
   [What drives this work]

   ## Scope
   [In/out of scope]

   ## Assumptions
   [With confidence levels]
   ```

2. **discovery_output.json** (Structured)
   ```json
   {
     "key_facts_to_add": [...],
     "assumptions": [...],
     "new_constraints": [...],
     "suggested_decisions": [...],
     "follow_up_for_planning": [...],
     "user_profile_learnings": {
       "role": "...",
       "seniority_level": "...",
       "organization": {...},
       "expertise": {...},
       "communication": {...},
       "motivation": {...},
       "discovery_confidence": "high|medium|low"
     }
   }
   ```

**Resume Support:**

If discovery is interrupted:
1. Read `.project-memory-state.json` > `discovery`
2. Check `quality_score.ready_for_formalization`
3. If false: Continue dialogue from last turn
4. If true: Jump to formalization

**Memory Authority:**
- **Creates:** discovery_brief.md, discovery_output.json
- **Updates:** .project-memory-state.json
- **Reads:** Existing memory (context), codebase (research)

---

### 3. /intuition-handoff - Orchestrator & Phase Coordinator

**Activation:** After discovery completes, OR after planning completes

**Role:** "Extract insights, update memory, prepare next agent"

**Core Responsibility:**
Bridges phases by:
1. Reading outputs from previous phase
2. Extracting structured insights
3. Updating project memory files
4. Merging user profile learnings
5. Generating brief for next agent
6. Updating workflow state

**Workflow (Discovery → Planning Transition):**

```
STEP 1: Detect Transition
  Read .project-memory-state.json
  IF discovery.completed && !planning.started:
    → TRANSITION: Discovery → Planning

STEP 2: Extract Insights
  Read discovery_brief.md
  Read discovery_output.json
  Extract:
  - Key facts to add
  - Assumptions and constraints
  - Suggested decisions
  - Follow-up items for planning
  - User profile learnings

STEP 3: Update User Profile (v3 New)
  Read .claude/USER_PROFILE.json
  Read discovery_output.json > user_profile_learnings
  Merge logic:
  - If field null in profile → add it
  - If field populated → only overwrite if confidence "high"
  - Update last_updated timestamp
  - Track projects in projects_contributed_to
  - Update confidence_scores
  Save updated profile

STEP 4: Update Memory Files

  UPDATE key_facts.md:
    - Add discovered facts with dates
    - Keep existing facts (append only)
    - Example: "Scale target: 10,000 concurrent users"

  UPDATE decisions.md:
    - Create new ADRs for architectural choices
    - Format: ADR-NNN: Title
    - Include Context/Decision/Consequences
    - Link to discovery brief

  UPDATE issues.md:
    - Log discovery work completed
    - Format: Date - ID: Description
    - Link to discovery_brief.md

STEP 5: Generate Planning Brief
  Create planning_brief.md with:
  - Discovery summary (1-2 paragraphs)
  - Problem statement (clear)
  - Goals & success criteria
  - User context (who's affected)
  - Key constraints (team, time, budget)
  - Architectural context (existing decisions)
  - Assumptions & risks (with confidence)
  - References (links to discovery, ADRs)

STEP 6: Update Workflow State
  Update .project-memory-state.json:
  - workflow.status = "planning"
  - workflow.discovery.completed = true
  - workflow.discovery.completed_at = timestamp
  - workflow.planning.started = true
  - workflow.planning.started_at = timestamp

STEP 7: Suggest Next Step
  "Discovery is complete and in memory. Ready to plan?
   Run /intuition-plan"
```

**Workflow (Planning → Execution Transition):**

```
STEP 1: Detect Transition
  Read .project-memory-state.json
  IF planning.completed && !execution.started:
    → TRANSITION: Planning → Execution

STEP 2: Extract Plan Context
  Read plan.md
  Extract:
  - Task list and ordering
  - Dependencies and blocking relationships
  - Acceptance criteria
  - Identified risks and mitigations
  - Key technical decisions

STEP 3: Update Memory Files (Minimal)

  UPDATE issues.md:
    - Log planning work completed
    - Format: Date - ID: Plan Title
    - Link to plan.md
    - List tasks created

  UPDATE decisions.md (if needed):
    - If planning revealed new architectural choices
    - Create new ADRs

STEP 4: Generate Execution Brief
  Create execution_brief.md with:
  - Plan summary (1-2 paragraphs)
  - Objective (what will be accomplished)
  - Discovery context (why this matters)
  - Plan overview (task count, complexity, dependencies)
  - Task summary (list in execution order)
  - Acceptance criteria
  - Quality gates (security review MANDATORY)
  - Known risks and mitigations
  - Architectural decisions (references to ADRs)
  - References (links to plan, discovery, decisions)

STEP 5: Update Workflow State
  Update .project-memory-state.json:
  - workflow.status = "executing"
  - workflow.planning.completed = true
  - workflow.planning.completed_at = timestamp
  - workflow.execution.started = true
  - workflow.execution.started_at = timestamp

STEP 6: Suggest Next Step
  "Planning is complete and documented. Ready to execute?
   Run /intuition-execute"
```

**Memory Authority:**
- **Creates:** planning_brief.md, execution_brief.md
- **Updates:** key_facts.md, decisions.md, issues.md, USER_PROFILE.json, .project-memory-state.json
- **Reads:** discovery_brief.md, discovery_output.json, plan.md

**Key Design Principle:**
Handoff is NOT evaluating quality. It's extracting, documenting, and preparing. Administrative, not critical.

---

### 4. /intuition-plan (Magellan) - Strategist & Planner

**Activation:** When user runs `/intuition-plan`

**Role:** "Create a structured plan from discovery insights"

**Workflow:**

```
STEP 1: Load Context
  Read planning_brief.md
  Read all existing memory (key_facts.md, decisions.md)
  Read .claude/USER_PROFILE.json (NEW - user personalization)

STEP 2: Assess Scope
  From planning_brief:
  - Understand problem scope
  - Identify constraints
  - Detect complexity level
  - Determine planning depth needed

STEP 3: Research (Optional)
  Launch research agents if needed:
  - Codebase architecture patterns
  - Relevant existing implementations
  - Technology options and trade-offs

STEP 4: Synthesize Plan
  Create structured plan with:
  - Objective and approach
  - Task breakdown (decompose into implementable units)
  - Dependencies and ordering
  - Acceptance criteria per task
  - Estimated complexity
  - Identified risks and mitigations
  - Confidence in approach

STEP 5: Personalize Plan (v3 New - Based on User Profile)
  Read USER_PROFILE.json:
  - Adjust planning depth based on user's seniority
  - Match communication style to user's preference
  - Consider user's authority level and constraints
  - Factor in user's learning style
  - Tailor complexity to expertise areas

STEP 6: Present Plan
  Show plan to user
  Explain approach
  Highlight key decisions
  Ask for approval

STEP 7: Approval & State Update
  IF user approves:
    - workflow.planning.approved = true
    - workflow.planning.approved_at = timestamp
    - Ready for handoff

STEP 8: Route to Handoff
  "Plan is approved. Run /intuition-handoff to prepare for execution"
```

**Output Files:**

**plan.md** (Structured Plan)
```markdown
# Plan: [Title from Discovery]

## Objective
[What will be accomplished]

## Discovery Summary
[Key insights that led to this plan]

## Research Context
[What was learned about the codebase]

## Approach
[Overall strategy and rationale]

## Task List
1. Task Name
   - Description
   - Acceptance Criteria
   - Dependencies: [Task 2, Task 3]
   - Estimated Complexity: Simple/Moderate/Complex

2. Task Name
   ...

## Risks & Mitigations
- Risk: X
  Mitigation: Y
  Confidence: High/Medium/Low

## Execution Notes for Faraday
[Guidance for implementation phase]
```

**Personalization (v3 New):**
- Read USER_PROFILE.json at startup
- Adjust plan detail based on user's:
  - Expertise areas (seniors get less detail)
  - Role (leads might want team considerations)
  - Learning style (hands-on users get examples)
  - Decision-making approach (data-driven users get metrics)
  - Authority level (personal projects vs. enterprise)

**Memory Authority:**
- **Creates:** plan.md
- **Updates:** .project-memory-state.json
- **Reads:** planning_brief.md, existing memory, USER_PROFILE.json, codebase

---

### 5. /intuition-execute (Faraday) - Implementer & Orchestrator

**Activation:** When user runs `/intuition-execute`

**Role:** "Coordinate implementation with precision"

**Workflow:**

```
STEP 1: Load Context
  Read execution_brief.md
  Read plan.md
  Read all existing memory
  Read .claude/USER_PROFILE.json (NEW - user personalization)

STEP 2: Confirm Approach
  Present execution strategy to user:
  - Which tasks can run in parallel?
  - What's the critical path?
  - What are quality gates?
  Ask for final confirmation

STEP 3: Create Task List (Internal)
  Break plan into concrete tasks:
  - Task IDs
  - Actual implementation steps
  - File paths and code structure
  - Testing requirements
  - Review requirements

STEP 4: Delegate Tasks (Parallel Execution)
  Launch sub-agents in parallel (where possible):
  - Code Writer agents: Implement features
  - Test Runner: Verify tests pass
  - Code Reviewer: Quality review
  - Security Expert: MANDATORY security review
  - Documentation: Update docs

  All run in parallel (Faraday coordinates)

STEP 5: Personalize Execution (v3 New - Based on User Profile)
  Read USER_PROFILE.json:
  - Adjust communication level (detailed vs. summary)
  - Match delegation to team size
  - Consider time zone and availability
  - Respect authority level in decision-making
  - Adapt to learning style if explaining

STEP 6: Verify Outputs
  For each task:
  - ✓ Acceptance criteria met?
  - ✓ Tests passing?
  - ✓ Code reviewed?
  - ✓ Security review passed? (MANDATORY)
  - ✓ Documentation updated?

STEP 7: Update Memory

  UPDATE bugs.md:
    - Any bugs found during execution
    - With solutions

  UPDATE decisions.md:
    - Any decisions made during execution
    - Create new ADRs if needed

  UPDATE issues.md:
    - Log execution work completed
    - Task completion status
    - Any blockers or changes

STEP 8: Complete Execution
  Update .project-memory-state.json:
  - workflow.status = "complete"
  - workflow.execution.completed = true
  - workflow.execution.completed_at = timestamp
  - tasks_completed count

STEP 9: Report Completion
  "Execution complete!
   - X tasks completed
   - All tests passing
   - Security review passed
   - Documentation updated"

STEP 10: Next Steps
  "Run /intuition-discovery to start next feature iteration"
```

**Sub-Agents:**
- Code Writer: Implement changes
- Test Runner: Run and verify tests
- Code Reviewer: Review code quality
- Security Expert: Security review (mandatory)
- Documentation: Update documentation
- Research: Additional research if needed
- Specification Writer: Technical specs if needed

**Parallel Execution Strategy:**
- Identify independent tasks
- Run in parallel where possible
- Coordinate dependencies
- All agents report to Faraday

**Personalization (v3 New):**
- Read USER_PROFILE.json at startup
- Adjust personalization based on:
  - Team size (solo vs. team)
  - Authority level (personal vs. enterprise)
  - Communication preference (detailed vs. summary)
  - Time zone (batch reports vs. real-time)
  - Technical environment (cloud providers, tools)

**Memory Authority:**
- **Creates:** Implementation (code changes)
- **Updates:** bugs.md, decisions.md, issues.md, .project-memory-state.json
- **Reads:** execution_brief.md, plan.md, existing memory, USER_PROFILE.json, codebase

**Critical Gate:**
Security review is MANDATORY before execution completes. No skipping this gate.

---

## Memory File Ownership Chart

Who creates vs. updates each file:

| File | Created By | Updated By | Purpose |
|------|-----------|-----------|---------|
| `.project-memory-state.json` | Initialize | Start, Handoff, all skills | Workflow state |
| `discovery_brief.md` | Waldo | Only Waldo | Discovery narrative |
| `discovery_output.json` | Waldo | Only Waldo | Discovery structured data |
| `planning_brief.md` | Handoff | Only Handoff | Context for planning |
| `plan.md` | Magellan | Only Magellan | Structured plan |
| `execution_brief.md` | Handoff | Only Handoff | Context for execution |
| `key_facts.md` | Initialize | Handoff (after discovery) | Project configuration |
| `decisions.md` | Initialize | Handoff, Faraday | Architectural decisions |
| `issues.md` | Initialize | Handoff, Faraday | Work history |
| `bugs.md` | Initialize | Faraday | Problem-solution pairs |
| `.claude/USER_PROFILE.json` | Initialize | Handoff (after discovery) | Persistent user profile |

**Golden Rule:** Each file has one owner. Only that skill creates/updates it (except Handoff which coordinates transitions).

---

## Data Flow Diagram

```
CYCLE 1: Discovery → Planning → Execution

START USER SESSION
  ↓
Run /intuition-start
  ├─ Reads: .project-memory-state.json
  ├─ Detects: workflow phase
  └─ Suggests: next skill
  ↓
Run /intuition-discovery (Waldo)
  ├─ Reads: existing memory
  ├─ Launches: 3 research agents (parallel)
  ├─ Dialogue: questions + answers (guided or open-ended)
  ├─ Learns: user profile information
  ├─ Writes: discovery_brief.md
  ├─ Writes: discovery_output.json (with user_profile_learnings)
  └─ Routes: /intuition-handoff
  ↓
Run /intuition-handoff
  ├─ Reads: discovery_brief.md, discovery_output.json
  ├─ Extracts: user_profile_learnings
  ├─ Merges: .claude/USER_PROFILE.json
  ├─ Updates: key_facts.md, decisions.md, issues.md
  ├─ Writes: planning_brief.md
  ├─ Updates: .project-memory-state.json
  └─ Routes: /intuition-plan
  ↓
Run /intuition-plan (Magellan)
  ├─ Reads: planning_brief.md, memory, USER_PROFILE.json
  ├─ Personalizes: based on user profile
  ├─ Writes: plan.md
  ├─ Updates: .project-memory-state.json
  └─ Routes: user approval required
  ↓
(User reviews and approves plan)
  ↓
Run /intuition-handoff
  ├─ Reads: plan.md
  ├─ Updates: issues.md
  ├─ Writes: execution_brief.md
  ├─ Updates: .project-memory-state.json
  └─ Routes: /intuition-execute
  ↓
Run /intuition-execute (Faraday)
  ├─ Reads: execution_brief.md, plan.md, memory, USER_PROFILE.json
  ├─ Personalizes: based on user profile
  ├─ Delegates: tasks to sub-agents (parallel)
  ├─ Verifies: all outputs and quality gates
  ├─ Updates: bugs.md, decisions.md, issues.md
  ├─ Updates: .project-memory-state.json
  └─ Completes: workflow status = "complete"
  ↓
(New feature/iteration)
  └─ Go back to /intuition-discovery

CYCLE 2+: Discovery → Planning → Execution
  └─ Profile builds across iterations
  └─ Personalization increases with each cycle
```

---

## Key Design Patterns

### Pattern 1: File-Based Handoffs
No APIs, no parameter passing. All data flows through files.

**Benefits:**
- Resumable (files persist)
- Auditable (history readable)
- Tool-agnostic (works with any tool)
- Transparent (users see outputs)

### Pattern 2: Parallel Research
Research tasks launch simultaneously, not sequentially.

**Implementation:**
Single Waldo message with multiple Task calls:
- Task 1: Best practices
- Task 2: Pitfalls
- Task 3: Emerging patterns

All run in parallel while dialogue continues.

### Pattern 3: Explicit Orchestration
Handoff skill bridges phases, never direct skill-to-skill.

**Benefits:**
- Memory consistency
- Clear state transitions
- Opportunity for personalization prep
- Audit trail of what changed

### Pattern 4: User Profile Building
Persistent profile across projects, built naturally through dialogue.

**Implementation:**
- Waldo discovers during dialogue
- Documents in discovery_output.json
- Handoff merges into .claude/USER_PROFILE.json
- Magellan and Faraday read for personalization

### Pattern 5: Memory Authority
Each file has one owner. Clear responsibility.

**Benefit:** No conflicts, clear update order.

---

## Resume Support

Each skill can resume interrupted work by reading `.project-memory-state.json`:

**Waldo Resume:**
- Read discovery.quality_score.ready_for_formalization
- If true: skip to formalization
- If false: continue dialogue from last turn

**Magellan Resume:**
- Read planning_brief.md (context)
- Check if planning.started
- Continue from last checkpoint

**Faraday Resume:**
- Read execution state (tasks_completed, current_task)
- Continue from last completed task
- Re-verify outputs

**Handoff Resume:**
- Detect which transition is incomplete
- Complete missing updates
- Generate missing briefs

---

## Common Workflows

### Workflow 1: Start Fresh Discovery
```
/intuition-start
  → "Ready to explore something new? Run /intuition-discovery"
↓
/intuition-discovery (Waldo)
  → Choose mode, describe what you're exploring, dialogue, create outputs
↓
/intuition-handoff
  → Extract insights, update memory, merge profile, create planning brief
↓
/intuition-plan (Magellan)
  → Personalize based on profile, create plan
```

### Workflow 2: Revise Discovery
```
/intuition-discovery (Waldo)
  → Run again with same or different context
  → Update discovery_brief.md and discovery_output.json
↓
/intuition-handoff
  → Detect discovery_brief.md timestamp change
  → Ask if Magellan should re-plan
  → If yes: create new planning brief
```

### Workflow 3: Skip to Execution (Plan Already Approved)
```
/intuition-start
  → Detects planning complete + not executing
  → Suggests /intuition-handoff
↓
/intuition-handoff
  → Reads plan.md
  → Creates execution_brief.md
↓
/intuition-execute (Faraday)
  → Implement according to approved plan
```

### Workflow 4: New Project, Existing User Profile
```
Project 1: /intuition-discovery → profile created
Project 2: /intuition-discovery
  → Waldo reads existing USER_PROFILE.json
  → Already knows user's role, expertise, etc.
  → Focuses on project-specific discovery
  → Merges new learnings into profile
↓
Profile completeness increases
Personalization becomes more effective
```

---

## Troubleshooting Guide

### "Discovery_output.json doesn't exist"
- ✅ Handoff checks for this
- ✅ Falls back to reading discovery_brief.md manually
- ✅ Still completes handoff with available data

### "State.json is corrupted"
- ✅ Each skill validates before proceeding
- ✅ Falls back to checking for file existence
- ✅ Ask user to re-initialize if needed

### "User profile merging conflicted"
- ✅ Handoff uses confidence scoring
- ✅ Only overwrites if new data has "high" confidence
- ✅ Tracks which project informed each property

### "Planning didn't start after discovery handoff"
- ✅ Check workflow state in .project-memory-state.json
- ✅ Verify planning_brief.md was created
- ✅ Run /intuition-start to see current status

### "Handoff asked which transition but I know"
- ✅ This happens if state.json is ambiguous
- ✅ Provide clear answer about which phase just completed
- ✅ Handoff will proceed with correct transition

---

## File Sizes & Performance Notes

Typical file sizes:

| File | Typical Size | Notes |
|------|-------------|-------|
| discovery_brief.md | 2-5 KB | Narrative summary |
| discovery_output.json | 3-8 KB | Structured data |
| planning_brief.md | 2-4 KB | Focused context |
| plan.md | 5-15 KB | Tasks, dependencies, risks |
| execution_brief.md | 2-4 KB | Ready-for-execution context |
| .project-memory-state.json | 2-5 KB | State tracking |
| USER_PROFILE.json | 1-3 KB | User information |
| key_facts.md | 1-3 KB | Grows over time |
| decisions.md | 2-10 KB | Grows as ADRs added |
| issues.md | 2-5 KB | Grows as work logged |
| bugs.md | Varies | Grows as bugs found |

**Performance:** File-based architecture is fast. Reading/writing small JSON and markdown files is negligible.

---

## Summary: The Five Skills as a Team

| Skill | Personality | Job | Input | Output |
|-------|-------------|-----|-------|--------|
| **Start** | Orienteer | "Where are we?" | State | Status brief |
| **Waldo** | Thinking Partner | Deep understanding | Dialogue | Discovery outputs |
| **Handoff** | Orchestrator | Memory + preparation | Phase outputs | Updated memory + briefs |
| **Magellan** | Strategist | Create structured plan | Planning brief | Plan with tasks |
| **Faraday** | Implementer | Coordinate execution | Execution brief | Working code + updates |

Together they create a symphony:
- Each focused on one phase
- Clear handoffs between phases
- Shared memory (single source of truth)
- Personalized based on user profile
- Resumable at any point
- Tool-agnostic and auditable

This is the Intuition three-phase workflow, orchestrated by five specialized skills.
