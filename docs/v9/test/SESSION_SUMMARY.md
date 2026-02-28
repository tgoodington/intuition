# v9 Protocol Validation — Session Summary

**Date:** 2026-02-27 through 2026-02-28
**Status:** All protocol tests PASS. Ready to build.

---

## What Was Done

### Design Doc Changes (domain-adaptive-team-architecture.md)

1. **Section 3 — Stage 1 output format**: Added `## Assumptions` section with `### A1:` entries having `**Default**:`/`**Rationale**:` fields. Added assumptions/decisions classification guidance and format compliance rules.

2. **Section 3 — Stage 2 protocol**: Added research grounding rule — every design choice must trace to Stage 1 research, user decisions, or a named domain standard. Ungrounded choices go to Open Items.

3. **Section 9.1**: Updated architecture diagram to show two-phase user gate with decisions.json.

4. **Section 9.3**: Added "depth controls the floor, not the ceiling" principle.

5. **New Section 9.8 — User Gate Protocol** (5 subsections):
   - 9.8.1: Stage 1 output format spec (headings, fields, parsing contract)
   - 9.8.2: Gate Phase 1 — assumptions review with "accept all" fast path + promotion. Fallback for missing Assumptions section.
   - 9.8.3: Gate Phase 2 — decisions with adaptive 1-7 individual / 8+ triage table with multiSelect
   - 9.8.4: decisions.json schema with context field and read-before-write rule
   - 9.8.5: Crash recovery protocol (resume mid-gate, skip completed gate)

6. **Section 9.7**: Added decisions.json to scratch file lifecycle.

7. **Section 12**: Added `decisions_path` to state schema.

8. **Section 14 — Decisions Log**: Added D19-D23:
   - D19: Assumptions/decisions separation
   - D20: Adaptive gate presentation (1-7 individual, 8+ triage)
   - D21: Incremental decisions.json for crash recovery
   - D22: No validation loop
   - D23: Greenfield-first design — Stage 2 invents grounded designs, not transcriptions

9. **Section 15**: Updated risk mitigation entries.

### Tests Executed

#### Phase 5 Specialist Tests (S1-S3) — All PASS
- **S1**: Stage 1 quality — thorough 428-line exploration
- **S2**: Stage 2 blueprint quality — 917-line blueprint, all 9 envelope sections, buildable
- **S3**: Divergence analysis — ~70% structural equivalence vs hand-crafted. Divergences are defensible design choices for greenfield, not gaps. Led to D23.

#### Phase 5B Gate Protocol Tests (5B-1 through 5B-10) — All PASS
- **5B-1**: Specialist produces correct assumptions/decisions format (actual subagent run)
- **5B-2**: Accept all assumptions fast path
- **5B-3**: Promote assumptions with simplified pattern
- **5B-4**: Individual decisions (recommended, non-recommended, Other)
- **5B-5**: 8+ triage table with multiSelect
- **5B-6**: Fallback — no assumptions section
- **5B-7**: Incremental write — valid JSON at every step
- **5B-8**: Crash recovery — resume mid-gate
- **5B-9**: Crash recovery — gate already complete
- **5B-10**: Stage 2 honors decisions.json (promoted assumptions, Other decisions, non-recommended picks)

### Key Architectural Decisions

1. **Greenfield-first (D23)**: Projects are typically greenfield. Stage 2 invents grounded designs, not transcriptions. No reference matching or faithfulness checks.

2. **No validation loop (D22)**: User's "Other" choices accepted directly. Stage 2 can flag risks in blueprint. Review chain catches problems during build.

3. **Simplified assumption promotion**: Gate offers "specialist's default" vs "Something else — I'll describe what I want." No domain-specific option construction.

4. **Read-before-write**: After each user response, Read decisions.json from disk, update, Write back. Protects against auto-compaction losing state.

5. **Research grounding rule**: Stage 2 must trace every design choice to Stage 1 research, user decisions, or named domain standards. Ungrounded choices go to Open Items.

---

## Implementation Recommendations (from tests)

1. Phase 1 "accept all" batch write must be atomic (single Write call)
2. For 8+ triage, show 3-4 highest-risk decisions as AskUserQuestion options, rest via "Other"
3. If user promotes an assumption but picks the default, record as "accepted" (simplification)
4. On resume, verify decisions.json IDs match stage1.md IDs; warn if mismatched
5. Add "restart gate" escape hatch in the completed-gate summary message
6. Model selection should come from the plan, not be invented by the specialist

---

## File Inventory

### Design Doc
- `docs/v9/domain-adaptive-team-architecture.md` — updated with all changes above

### Test Artifacts (docs/v9/test/)

**Phase 5 specialist test:**
- `phase5/specialist-test/TEST_PLAN.md` — S1-S3 all COMPLETE
- `phase5/specialist-test/scratch/code-architect-stage1.md` — Stage 1 output
- `phase5/specialist-test/blueprints/code-architect-hw-vetter.md` — auto-generated blueprint
- `phase5/specialist-test/blueprint-comparison.md` — detailed comparison (38 divergences)

**Phase 5B gate protocol test:**
- `phase5b/TEST_PLAN.md` — 5B-1 through 5B-10 all PASS
- `phase5b/stage1-with-assumptions.md` — 5A + 3D test input
- `phase5b/stage1-no-assumptions.md` — 4D fallback test input
- `phase5b/stage1-many-decisions.md` — 3A + 10D triage test input
- `phase5b/test-5B-{1-10}-results.md` — detailed results per test
- `phase5b/decisions/*.json` — decisions.json output per test
- `phase5b/blueprints/5B-10-stage2-with-decisions.md` — Stage 2 output honoring decisions.json
- `phase5b/specialists/code-architect.specialist.md` — updated specialist profile
- `phase5b/scratch/code-architect-stage1.md` — new-format Stage 1 output

---

## What's Ready to Build

The design doc Section 16 defines the build order. Based on testing:

- **Specialist profiles** — Stage 1 + Stage 2 protocol format works. code-architect tested. The format compliance rules and assumptions/decisions guidance produce correct output.
- **User gate (detail skill)** — Protocol fully designed and validated. Section 9.8 is the implementation spec. Tests 5B-2 through 5B-9 are the acceptance criteria.
- **decisions.json** — Schema defined (9.8.4), incremental write pattern validated (5B-7), crash recovery validated (5B-8, 5B-9).
- **Stage 2 → blueprint pipeline** — Universal envelope format works. Stage 2 honors decisions.json correctly. Research grounding rule prevents ungrounded invention.
