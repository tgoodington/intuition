# Phase 5B: User Gate Protocol Tests

## Objective
Validate the refined user gate protocol (D19-D22) — assumptions/decisions separation, adaptive presentation, decisions.json, crash recovery, and fallback behavior.

## Context
These tests exercise the **foreground detail skill's** gate logic, not the specialist subagents. The gate is the skill's core responsibility: parsing Stage 1 output, presenting to the user, collecting input, writing decisions.json.

Since the detail skill doesn't exist yet, these tests validate the **protocol design** by simulating the gate manually (human plays the skill role, subagents produce Stage 1 output). This proves the protocol works before we build the skill.

## Results Summary

| Test | Description | Verdict |
|------|-------------|---------|
| 5B-1 | Assumptions/Decisions split format | PASS |
| 5B-2 | Accept all assumptions (fast path) | PASS |
| 5B-3 | Promote assumptions | PASS |
| 5B-4 | Individual decisions (1-7) | PASS |
| 5B-5 | Triage table (8+) | PASS |
| 5B-6 | Fallback — no assumptions section | PASS |
| 5B-7 | Incremental write validation | PASS |
| 5B-8 | Crash recovery — resume mid-gate | PASS |
| 5B-9 | Crash recovery — gate already complete | PASS |
| 5B-10 | Stage 2 honoring decisions.json | PASS |

**All 10 tests PASS.** Protocol design validated end-to-end.

## Test Artifacts

All in `docs/v9/test/phase5b/`:

| Artifact | Purpose |
|----------|---------|
| `stage1-with-assumptions.md` | Stage 1 output with proper Assumptions + Decisions split (5A + 3D) |
| `stage1-no-assumptions.md` | Stage 1 output missing Assumptions section (fallback test) (4D) |
| `stage1-many-decisions.md` | Stage 1 output with 10+ decisions (8+ triage test) (3A + 10D) |
| `decisions/` | Output decisions.json files from gate tests |
| `test-5B-*-results.md` | Detailed results for each test |

---

## Test Cases

### Test 5B-1: Assumptions/Decisions Separation in Stage 1 Output — PASS

**Question**: Can a specialist subagent reliably produce the assumptions/decisions split when instructed?

**Method**:
1. Update the code-architect specialist profile to include the assumptions/decisions guidance and format compliance rules
2. Run a Stage 1 subagent (opus) on the hardware vetter task with the updated profile
3. Examine the output for proper structure

**Pass criteria**:
- `## Assumptions` section exists with `### A1:`, `### A2:` entries
- `## Key Decisions` section exists with `### D1:`, `### D2:` entries
- Each assumption has `**Default**:` and `**Rationale**:` fields
- Each decision has `**Options**:`, `**Recommendation**:`, `**Risk if wrong**:` fields
- Classification is reasonable (clear best practices as assumptions, genuine choices as decisions)
- No items that obviously belong in the other category

**Result**: PASS — 7 assumptions, 3 decisions, all correctly formatted and classified. See `test-5B-1-results.md`.

### Test 5B-2: Gate Phase 1 — Accept All Assumptions — PASS

**Question**: Does the "accept all" fast path work correctly?

**Method**:
1. Start with `stage1-with-assumptions.md` (5 assumptions + 3 decisions)
2. Simulate gate Phase 1: present assumptions, user selects "Accept all"
3. Write decisions.json with all assumptions marked `"status": "accepted"`
4. Verify Phase 2 proceeds with only the 3 decisions

**Result**: PASS — All 5 assumptions accepted in one click, gate proceeds to 3 decisions. See `test-5B-2-results.md`, `decisions/5B-2-accept-all-decisions.json`.

### Test 5B-3: Gate Phase 1 — Promote Assumptions — PASS

**Question**: Does assumption promotion work with the simplified pattern (no domain-specific option construction)?

**Method**:
1. Start with same `stage1-with-assumptions.md`
2. User selects "I want to review some"
3. User promotes A3 (model selection) and A5 (naming convention)
4. Gate offers: specialist's default vs "Something else — I'll describe what I want"
5. User provides overrides via free text

**Result**: PASS — Promoted assumptions recorded with `"status": "promoted"` and user overrides. Gate does not construct domain-specific options. Non-promoted assumptions accepted. Phase 2 proceeds with 3 original decisions. See `test-5B-3-results.md`, `decisions/5B-3-promote-decisions.json`.

**Edge case noted**: If user promotes but picks the default, consider recording as `"accepted"` rather than `"promoted"` with null override (simplification for implementation).

### Test 5B-4: Gate Phase 2 — Individual Decisions (1-7) — PASS

**Question**: Does individual decision presentation with AskUserQuestion options work correctly?

**Method**:
1. 3 decisions from Phase 1 output
2. D1: user picks recommended (A)
3. D2: user picks non-recommended (B)
4. D3: user picks "Other" with custom text
5. Write each to decisions.json incrementally

**Result**: PASS — All three response types (recommended, non-recommended, Other) recorded correctly. Context field populated. Incremental writes after each response. See `test-5B-4-results.md`, `decisions/5B-4-individual-decisions.json`.

### Test 5B-5: Gate Phase 2 — Triage Table (8+ Decisions) — PASS

**Question**: Does the 8+ triage path work with multiSelect?

**Method**:
1. `stage1-many-decisions.md` (3 assumptions + 10 decisions)
2. Summary table of all 10 decisions with recommendations
3. multiSelect: user picks D2 and D9 for discussion
4. 8 remaining auto-resolved with specialist's recommendation
5. Selected decisions presented individually

**Result**: PASS — Summary table presented, multiSelect works, auto-resolved decisions use recommended options, selected decisions go through normal individual flow. All 10 decisions in final file. See `test-5B-5-results.md`, `decisions/5B-5-triage-decisions.json`.

**Implementation note**: AskUserQuestion 2-4 option limit means the multiSelect shows a representative subset, not all 10. User types "Other" to add beyond the subset.

### Test 5B-6: Fallback — No Assumptions Section — PASS

**Question**: Does the gate handle a stage1.md that has no `## Assumptions` heading?

**Method**:
1. `stage1-no-assumptions.md` (4 decisions, no assumptions section)
2. Gate detects missing section, skips Phase 1
3. All items presented as decisions in Phase 2

**Result**: PASS — Phase 1 skipped cleanly, `assumptions: []` in output, all 4 decisions presented normally. See `test-5B-6-results.md`, `decisions/5B-6-fallback-decisions.json`.

### Test 5B-7: decisions.json Incremental Write — PASS

**Question**: Does the read-before-write pattern produce valid JSON after each step?

**Method**:
1. Walk through 5 assumptions + 3 decisions gate
2. Verify JSON validity after each of 5 writes (startup, assumptions batch, D1, D2, D3)
3. Verify no data loss between writes

**Result**: PASS — Valid JSON at every step. No data loss. `gate_started` persists, `gate_completed` transitions from null to timestamp on final write. See `test-5B-7-results.md`.

**Implementation note**: Phase 1 "accept all" should be a single atomic Write call (all-or-nothing for the batch). Each Phase 2 decision is an individual read+write cycle.

### Test 5B-8: Crash Recovery — Resume Mid-Gate — PASS

**Question**: Can the gate resume from a partially-completed decisions.json?

**Method**:
1. Pre-written partial decisions.json: 3 assumptions accepted, 2 of 3 decisions resolved
2. Skill starts fresh (after crash/clear), re-reads detail brief from disk
3. Detects partial completion, identifies unresolved items
4. Presents resume message, continues from first unresolved

**Result**: PASS — Partial completion detected, resolved items not re-asked, correct resume count, continues from right decision, final file complete. See `test-5B-8-results.md`, `decisions/5B-8-partial-decisions.json`.

**Edge cases noted**: (1) Crash during Phase 1 batch write → re-present Phase 1. (2) stage1.md changed between sessions → warn and offer restart.

### Test 5B-9: Crash Recovery — Gate Already Complete — PASS

**Question**: Does the skill skip the gate when decisions.json is complete but no blueprint exists?

**Method**:
1. Pre-written complete decisions.json with `gate_completed` timestamp
2. No blueprint at expected path
3. Skill starts fresh

**Result**: PASS — Completed gate detected, summary presented, gate bypassed entirely, proceeds to Stage 2. See `test-5B-9-results.md`, `decisions/5B-9-complete-decisions.json`.

**Recommendation**: Add a "restart gate" option in the summary message as an escape hatch (don't build granular "edit one decision" initially).

### Test 5B-10: Stage 2 Honoring decisions.json — PASS

**Question**: Does Stage 2 correctly consume decisions.json and honor all user overrides, promotions, and custom inputs?

**Method**:
1. Use `stage1-with-assumptions.md` + `decisions/5B-3-promote-decisions.json` (richest test case)
2. Run Stage 2 subagent with both files injected
3. Verify blueprint honors: 2 promoted assumptions, 1 "Other" decision, 1 non-recommended pick, 1 recommended pick, 3 accepted defaults

**Result**: PASS — All 8 items from decisions.json correctly reflected in the blueprint. Promoted assumptions (A3→opus, A5→new naming) appear in all relevant blueprint locations. "Other" decision (D2) correctly interpreted and implemented with pseudocode. Non-recommended option (D3) correctly overrode specialist's recommendation. Three ungrounded design choices properly surfaced in Open Items. See `test-5B-10-results.md`, `blueprints/5B-10-stage2-with-decisions.md`.

---

## Implementation Recommendations (from test findings)

1. **Phase 1 batch write must be atomic** — single Write tool call for all assumptions (5B-7, 5B-8)
2. **multiSelect subset selection** — for 8+ triage, show 3-4 highest-risk decisions as AskUserQuestion options, rest accessible via "Other" (5B-5)
3. **Promote-then-accept simplification** — if user promotes an assumption but picks the default, record as `"accepted"` (5B-3)
4. **ID consistency check on resume** — verify decisions.json IDs match stage1.md IDs; warn if mismatched (5B-8)
5. **"Restart gate" escape hatch** — offer in the completed-gate summary message (5B-9)

---

## Execution Strategy

**Tests 5B-1** ran an actual subagent — validated that the specialist can produce the right format.

**Tests 5B-2 through 5B-9** are protocol simulations — manually walked through the gate steps to validate the protocol design and decisions.json format. These become the acceptance criteria for the actual detail skill when we build it.

### Execution Order (completed)
1. **5B-1** (specialist output format) — PASS
2. **5B-6** (fallback) — PASS
3. **5B-2, 5B-3** (Phase 1 variations) — PASS
4. **5B-4, 5B-5** (Phase 2 variations) — PASS
5. **5B-7** (incremental writes) — PASS
6. **5B-8, 5B-9** (crash recovery) — PASS
7. **5B-10** (Stage 2 consumes decisions.json) — PASS

### What We Can Test Now vs Later
- **Now (protocol validation)**: All 9 tests COMPLETE
- **Later (when detail skill exists)**: Full automated runs of 5B-2 through 5B-9

---

## Relationship to Phase 5 Specialist Test

The specialist-test (`specialist-test/TEST_PLAN.md`) validates Stage 1 and Stage 2 **subagent quality** — can the specialist produce good research and good blueprints?

Phase 5B validates the **gate protocol between them** — does the user gate correctly parse, present, collect, persist, and recover?

Together they cover the complete detail phase pipeline: Stage 1 → gate → Stage 2.
