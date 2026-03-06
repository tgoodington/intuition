# `/intuition-design` — Skill Specification (v6.0)

**Status:** Implemented
**Date:** 2026-02-12
**Source:** Synthesized from skill-guide analysis, user design sessions, and architectural review

---

## 1. Purpose & Position in Workflow

Design Exploration fills the gap between strategic planning and execution. Planning decides WHAT to build and WHY. Execution decides the code-level HOW. Design Exploration decides the **architectural/creative HOW** — through collaborative dialogue with the user.

**Domain-agnostic:** Design works for code architecture, world building, UI/UX design, document structure, game design, business processes, or any creative/structural work that needs detailed elaboration before implementation.

**Workflow position (v6.0):**
```
prompt → handoff → plan → handoff → [design loop] → handoff → execute → handoff
                                          ↑
                              Per-item design cycles
                              managed by handoff
```

**When design runs:**
- Plan auto-flags tasks below 95% design readiness
- Handoff presents flagged items to user for confirmation
- User can add/remove items from the design list
- If no items need design, handoff skips to execute

**When design does NOT run:**
- All plan tasks are straightforward enough for direct execution
- User explicitly skips design at the confirmation step

---

## 2. Core Design Decisions

### Framework: ECD (Elements, Connections, Dynamics)

Three coverage dimensions tracked throughout dialogue:

- **E — Elements**: What are the building blocks? The core entities, components, types, content pieces, or structural units. Their properties, boundaries, and definitions.
- **C — Connections**: How do elements relate? The relationships, interfaces, dependencies, flows, hierarchies, or structural organization. Integration with existing context.
- **D — Dynamics**: How do things work and change? The behaviors, processes, rules, interactions, state transitions, or operational logic. Edge cases and exceptions.

Natural progression: E → C → D. All three must reach sufficiency before formalization.

**Why ECD over DIP:**
- DIP (Data, Interfaces, Process) was code-specific — TypeScript types, API signatures, algorithms
- ECD is domain-agnostic — adapts language to match what is being designed
- ECD maps cleanly to DIP for code (E≈D, C≈I, D≈P) while also working for creative domains

**Domain adaptation:**

| Domain | Elements | Connections | Dynamics |
|--------|----------|-------------|----------|
| Code | Types, models, schemas | APIs, interfaces, integration | Algorithms, state transitions |
| World building | Locations, characters, factions | Alliances, geography, trade | Magic rules, economy, combat |
| UI/UX | Screens, components, layouts | Navigation, data flow, journeys | Interactions, states, animations |
| Documents | Sections, arguments, evidence | Logical flow, transitions | Tone, persuasion, pacing |
| Game design | Mechanics, entities, resources | Progression, feedback loops | Balance, player interactions |
| Business | Roles, artifacts, stages | Handoffs, approvals, escalations | Timing rules, SLAs |

### Voice: Senior Architect

Analytical, decisive, research-informed, concise, appropriately challenging. Domain adapts to what is being designed, but posture stays the same.

### Model: Opus

Design decisions have long-term consequences. Worth the cost for nuanced trade-off reasoning, complex system synthesis, and edge case identification.

Sub-agents use haiku for research (fast, cheap, parallel). Sonnet for complex trade-off analysis.

### Permission Mode: Plan-like (read-only for code)

Design creates specifications, not code. All artifacts are markdown. Write tool used for spec files only.

**Tools:** Read, Glob, Grep, Task, AskUserQuestion, Write (for spec files only)

---

## 3. Protocol Structure

```
Phase 1:   SCOPE & CONTEXT    (1 turn)      Read brief, research context, frame challenge
Phase 2:   ELEMENTS           (1-2 turns)   Define building blocks and properties      [ECD: E]
Phase 3:   CONNECTIONS        (1-2 turns)   Map relationships and structure             [ECD: C]
Phase 4:   DYNAMICS           (2-3 turns)   Define behaviors, rules, and edge cases     [ECD: D]
Phase 5:   FORMALIZATION      (1 turn)      Draft spec, validate, approve, save
```

**Total:** 6-9 turns per item. Shorter than discovery because scope is narrower (one item, not the whole problem).

---

## 4. Design Loop Architecture

Design runs once per flagged item, with handoff managing the loop:

```
handoff (plan→design): presents items, user confirms, generates brief for item 1
  → design (item 1): ECD exploration, saves design_spec_item1.md
  → handoff (design→design): processes spec, generates brief for item 2
  → design (item 2): ECD exploration, saves design_spec_item2.md
  → handoff (design→design): processes spec, generates brief for item 3
  → design (item 3): ECD exploration, saves design_spec_item3.md
  → handoff (design→execute): all items done, generates execution_brief.md
```

**Key properties:**
- Each design invocation focuses on ONE item (narrow scope, high quality)
- Handoff tracks which items are completed, pending, or skipped
- User gets natural breakpoints between items
- Execute gets ALL design specs before starting (full picture for parallelization)
- No skip-to-execute mid-loop — complete all confirmed items first

---

## 5. Plan Integration: Auto-Flagging

Plan assesses every task for design readiness using a 95% threshold:

**Flag as DESIGN REQUIRED if:**
- Novel territory (no existing pattern)
- Multiple valid approaches (lasting consequences)
- User-facing decisions (layout, creative, UX, tone)
- Complex interactions (interfaces need definition)
- Ambiguous scope (HOW has genuine options)

**Plan output includes:**
```markdown
### Design Recommendations

| Task(s) | Item Name | Recommendation | Rationale |
|---------|-----------|---------------|-----------|
| Task 3, 4 | Behavior Tree AI | DESIGN REQUIRED | Novel architecture, multiple approaches |
| Task 7 | Combat UI | DESIGN REQUIRED | User-facing layout decisions |
| Task 1, 2 | Core Data Model | Ready for execution | Follows existing patterns |
```

---

## 6. Output Format

Saved to `docs/project_notes/design_spec_[item_name].md`. Content adapts to the domain being designed. See SKILL.md for full format.

---

## 7. State Schema (v3.0)

```json
{
  "initialized": true,
  "version": "3.0",
  "workflow": {
    "status": "none | prompt | planning | design | executing | complete",
    "prompt": { "started": false, "completed": false, "completed_at": null, "output_files": [] },
    "planning": { "started": false, "completed": false, "completed_at": null, "approved": false },
    "design": {
      "started": false,
      "completed": false,
      "completed_at": null,
      "items": [
        {
          "name": "item_name_snake_case",
          "display_name": "Human Readable Name",
          "status": "pending | in_progress | completed | skipped",
          "plan_tasks": [3, 4, 5],
          "spec_file": null,
          "flagged_reason": "Why plan flagged this"
        }
      ],
      "current_item": null
    },
    "execution": { "started": false, "completed": false, "completed_at": null }
  },
  "last_handoff": null,
  "last_handoff_transition": null
}
```

---

## 8. Handoff Transitions

| # | Transition | Input | Output |
|---|-----------|-------|--------|
| 1 | prompt → plan | discovery_brief.md, discovery_output.json | planning_brief.md |
| 2 | plan → design | plan.md | design_brief.md (first item) |
| 3 | design → design | design_spec_[item].md | design_brief.md (next item) |
| 4 | design → execute | all design_spec_*.md, plan.md | execution_brief.md |
| 4B | plan → execute (skip) | plan.md | execution_brief.md |
| 5 | execute → complete | execution results | completion summary |

---

## 9. Critical Rules

1. You MUST read design_brief.md before designing. If missing, route to handoff.
2. You MUST launch context research in Phase 1 before first question.
3. You MUST use ECD coverage tracking. Formalization only when E, C, D are sufficient.
4. You MUST ask exactly ONE question per turn via AskUserQuestion.
5. You MUST present 2-4 sentences of analysis BEFORE every question.
6. You MUST be domain-agnostic. Adapt language to the domain being designed.
7. You MUST validate against Design Completeness Checklist before presenting draft.
8. You MUST save spec to `docs/project_notes/design_spec_[item_name].md`.
9. You MUST route to `/intuition-handoff` after saving. NEVER to `/intuition-execute`.
10. You MUST NOT write code — specifications only.
11. You MUST NOT modify plan.md or discovery_brief.md.
12. You MUST NOT manage .project-memory-state.json — handoff owns state.

---

## 10. Migration from v5.0

- Discovery skill removed entirely
- Prompt becomes sole entry point for problem understanding
- State schema v2.0 → v3.0 (`discovery` → `prompt`, added `design` phase)
- Install script auto-removes old `intuition-discovery` from ~/.claude/skills/
- Start skill no longer offers discovery/prompt choice — directs to prompt only
