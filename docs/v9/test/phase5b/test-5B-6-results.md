# Test 5B-6: Fallback — No Assumptions Section

**Date:** 2026-02-27
**Verdict:** PASS

---

## Simulation Walkthrough

**Input:** `stage1-no-assumptions.md` — contains `## Key Decisions` (D1-D4) but NO `## Assumptions` section.

### Step 1: Gate reads stage1.md, scans for `## Assumptions`

Heading not found. Per Section 9.8.2 fallback rule: "If stage1.md contains no `## Assumptions` section, treat all items under `## Key Decisions` as decisions and skip Phase 1 entirely."

### Step 2: Phase 1 skipped

No "accept all assumptions" prompt presented. Gate proceeds directly to Phase 2.

### Step 3: Phase 2 — 4 decisions presented individually

D1-D4 each presented via AskUserQuestion with recommended option first + "(Recommended)" label.

Simulated user responses:
- D1: Accepts recommended (A — Vulnerabilities only)
- D2: Accepts recommended (A — Full tree)
- D3: Accepts recommended (A — Summary with details)
- D4: Picks non-recommended (B — Flag issues only)

### Step 4: decisions.json written

See `decisions/5B-6-fallback-decisions.json`.

---

## Criterion-by-Criterion Evaluation

### 1. No error or crash when Assumptions section is absent

**PASS** — Fallback rule triggers cleanly. The gate detects the missing heading and adjusts behavior without error.

### 2. Phase 1 is skipped (no "accept all assumptions" prompt)

**PASS** — Gate goes directly from reading stage1.md to presenting D1. No assumptions prompt shown.

### 3. All Key Decisions presented normally in Phase 2

**PASS** — D1-D4 each presented individually with correct option format. Recommended option first with "(Recommended)" label. Rationale included per option.

### 4. decisions.json has empty `"assumptions": []` array

**PASS** — Output file contains `"assumptions": []` with all 4 decisions populated in the `"decisions"` array. Each decision has `context`, `options`, `chosen`, and `user_input` fields.

---

## Protocol Validation Notes

1. The fallback behavior is clean — no special error state, just a graceful skip of Phase 1.
2. This handles backward compatibility with specialist profiles that haven't been updated with the assumptions/decisions guidance.
3. The `assumptions: []` empty array is important — downstream consumers (Stage 2) can always expect the field to exist.
