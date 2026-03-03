# Decision Framework — Implementation Tracker

**Source**: `docs/v9/decision-framework-direction.md`
**Started**: 2026-03-03

## Implementation Layers

### Layer 1: Prompt Skill — Capture Intent + Posture
**Status**: DONE
**File**: `skills/intuition-prompt/SKILL.md`

Changes made:
- Added INTENT step to REFINE order (between SCOPE and SUCCESS)
- Added POSTURE phase (Phase 4, between REFLECT and CONFIRM)
- Added Commander's Intent section to `prompt_brief.md` template
- Added Decision Posture table to `prompt_brief.md` template
- Added `commander_intent` and `decision_posture` fields to `prompt_output.json` template
- Updated phase flow: 4 phases → 5 phases, 5-7 turns → 6-9 turns
- Updated REFLECT to include Commander's Intent synthesis before posture question

### Layer 2: Plan Skill — Classify Decisions Per Task
**Status**: DONE
**File**: `skills/intuition-plan/SKILL.md`

Changes made:
- Added `Decisions` field to task template with `[USER]`/`[SPEC]`/`[SILENT]` tier classifications
- Added 2x2 classification heuristic (human-facing × reversibility) as Section 10 reference
- Added Decision Policy output (conservative/aggressive) based on Commander's Intent + Posture Map
- Added post-plan confirmation step: "Want to reclassify any decisions?" with shift options
- Added decision classification checklist item

Each plan task gets a `Decisions` field with classified decision points using three tiers:

| Label | Meaning | Appelo Equivalent |
|-------|---------|-------------------|
| `[USER]` | Specialist recommends, user decides | L2-L3 |
| `[SPEC]` | Specialist decides, reports rationale | L5-L6 |
| `[SILENT]` | Full autonomy, no report needed | L7 |

Classification heuristic (2x2):

| | Human-facing | Machine-facing |
|---|---|---|
| **Hard to reverse** | `[USER]` always | `[SPEC]` (reported with full reasoning) |
| **Easy to reverse** | `[USER]` by default, user can downgrade | `[SILENT]` |

Plan reads Commander's Intent and Decision Posture from prompt brief to determine what counts as "human-facing." Without that signal, defaults conservative.

After presenting the full task breakdown, one confirmation question: "Here are the decisions I'd surface to you during detail work. Want to reclassify any?" Shows `[USER]` and `[SPEC]` items only. One pass, not per-task. Cap at ~2-3 decisions per task.

### Layer 3: Downstream Phases — Follow, Log, Escalate
**Status**: DONE
**Files**: `skills/intuition-detail/SKILL.md`, `skills/intuition-build/SKILL.md`

Changes made (detail):
- Step 2: extracts decision classifications + decision policy from detail brief
- Stage 1a: research budget cap (Deep: 3, Standard: 2) + decision tier awareness in specialist framing
- Stage 1b: hard enforcement of research cap with warning log
- Stage 1c: tier tagging in synthesis output ([UNCLASSIFIED] for specialist-discovered decisions)
- User Gate Phase 2: split into 2a (USER→ask), 2b (SPEC→display+auto-record), 2c (UNCLASSIFIED→classify via 2x2 then route)
- decisions.json schema: added `decision_policy`, `tier`, `classified_by` fields
- New section: CLASSIFYING UNCLASSIFIED DECISIONS (2x2 heuristic + posture-based borderline handling)

Changes made (build):
- Removed all v8 compat artifacts (~135 lines: v8 mode detection, steps, subagents, delegation, verification, report)
- Step 1: reads `scratch/*-decisions.json` + extracts decision log from blueprint Section 4
- Layer 2 verification: checks [USER] decisions honored, [SPEC] rationale documented, flags untraced producer choices
- Build report: new "Decision Compliance" section per task
- New "Unanticipated Decision Escalation" rule: human-facing unclassified decisions pause+escalate

**Detail / Specialists:**
- Follow `[USER]`/`[SPEC]`/`[SILENT]` labels from plan
- Stage 1a: explicitly separate "technical questions I'll resolve" from "experience questions needing principal input"
- User gate surfaces `[USER]` decisions with full options + tradeoffs
- `[SPEC]` decisions logged with rationale
- New decisions discovered during work get classified using the 2x2 before routing

**Engineer (v8 compat):**
- Boundary test: "Would the user notice this from the outside?"
- Append to decision log: decision, tier, rationale (one line), user-facing flag
- Elevate implementation choices that constrain future UX to joint decisions

**Build:**
- Decision log is read-only verification artifact
- Build report includes "Decision Compliance" section: user-reserved honored, expert-delegated applied, deviations noted
- Unanticipated decisions with user-facing impact: pause and escalate, never guess
- Autonomous domain: production logistics only (task ordering, retries, format validation)

## Open Design Decisions

### D1: Decision Log Location & Format
**Status**: RESOLVED — decisions.json with tier field

Uses the existing `decisions.json` file that detail already writes. Added `tier` and `classified_by` fields to each decision entry, plus `decision_policy` at the root. Build reads this for compliance verification. No new file needed.

### D2: Default for Unclassified Decisions
**Status**: RESOLVED — posture-calibrated (conservative/aggressive from plan Section 10)

Detail reads the Decision Policy from plan Section 10. If the user's posture leans hands-on (many "I decide" areas), unclassified decisions default to `[USER]`. If delegator posture, default to `[SPEC]`. Encoded as `"decision_policy": "conservative"` or `"aggressive"` in decisions.json.

### D3: Cross-Specialist Decisions
**Status**: RESOLVED — first specialist owns, deferred to handoff for v2

When handoff passes prior blueprints to the next specialist, it already includes cross-specialist context. The plan's Decisions field tags the owning task. If a decision spans tasks assigned to different specialists, the first specialist to encounter it owns the classification.

### D4: Learning Over Time
**Status**: DEFERRED (not v1)

Can the system build precedent from past decisions? ("Last time you upgraded font choice from SILENT to USER — should I default typography decisions to USER going forward?")

### D5: Metrics & Feedback Loop
**Status**: DEFERRED (not v1)

How does the user signal the framework is calibrated well vs. still asking too much or too little? Post-build retrospective? Lightweight thumbs-up/down?
