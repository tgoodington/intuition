# Test 5B-4: Gate Phase 2 — Individual Decisions (1-7)

**Date:** 2026-02-27
**Verdict:** PASS

---

## Simulation Walkthrough

**Input:** `stage1-with-assumptions.md` — 5 assumptions (A1-A5) + 3 decisions (D1-D3).
**Phase 1:** User accepts all assumptions (fast path).
**Phase 2:** 3 decisions — below the 8+ threshold, so each presented individually.

### D1: Scoring Formula Approach

AskUserQuestion presented:

```
D1: Scoring Formula Approach

Need to rank 47 models against user hardware. RAM, VRAM, and context length
are the key dimensions.
```

Options:
1. "Weighted percentage — RAM 40%, VRAM 40%, context 20% (Recommended)"
2. "Binary pass/fail per dimension, rank by headroom"
3. "Single composite ratio averaged across dimensions"

User picks: **Option 1 (recommended)**

decisions.json updated: `"chosen": "A"`, `"user_input": null`

### D2: Use-Case Filtering Strategy

AskUserQuestion presented:

```
D2: Use-Case Filtering Strategy

Models have use-case tags (chat, code, creative, reasoning). User provides
a query like 'I need a coding model'.
```

Options:
1. "Strict tag match (Recommended)"
2. "Fuzzy match — tagged first, then 'might also work'"

User picks: **Option 2 (non-recommended)**

decisions.json updated: `"chosen": "B"`, `"user_input": null`

### D3: Top-N Presentation Count

AskUserQuestion presented:

```
D3: Top-N Presentation Count

Need to decide how many models to show in the recommendation report.
```

Options:
1. "Top 5 models (Recommended)"
2. "Top 3 models"
3. "All models above acceptable_fit threshold"

User picks: **Other**
User types: "Show top 5 but also include a 'honorable mentions' section for models that scored between acceptable_fit and the 5th-place score"

decisions.json updated: `"chosen": "other"`, `"user_input": "Show top 5 but also include a 'honorable mentions' section..."`

---

## Criterion-by-Criterion Evaluation

### 1. Each decision presented individually with correct option format

**PASS** — D1, D2, D3 each shown as a separate AskUserQuestion with context description above the options.

### 2. Recommended option appears first with "(Recommended)" label

**PASS** — All three decisions have the specialist's recommended option as the first choice with "(Recommended)" appended.

### 3. D1: `"chosen": "A"`, `"user_input": null`

**PASS** — User picked the recommended option. Recorded correctly.

### 4. D2: `"chosen": "B"`, `"user_input": null`

**PASS** — User picked the non-recommended option. Recorded correctly with no user input (it was a predefined option, not "Other").

### 5. D3: `"chosen": "other"`, `"user_input": "[user's text]"`

**PASS** — User picked "Other" and provided custom text. Recorded with `"chosen": "other"` and the full user text in `"user_input"`.

### 6. decisions.json updated after EACH response (not batched at end)

**PASS (by protocol design)** — The read-before-write rule in Section 9.8.4 mandates updating after each response. The simulation produces intermediate states:
- After D1: file has assumptions + D1 only
- After D2: file has assumptions + D1 + D2
- After D3: file has all items, `gate_completed` set

### 7. `"context"` field populated for each decision

**PASS** — All three decisions have a `"context"` field with meaningful summary text drawn from the decision's surrounding context in stage1.md.

---

## Protocol Validation Notes

1. The three response types (recommended, non-recommended, Other) all record correctly with distinct patterns.
2. The `context` field gives Stage 2 enough information to understand each decision without re-reading all of stage1.md.
3. For "Other" responses, the user's free text is preserved verbatim — no interpretation by the gate.
