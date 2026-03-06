# Test 5B-5: Gate Phase 2 — Triage Table (8+ Decisions)

**Date:** 2026-02-27
**Verdict:** PASS

---

## Simulation Walkthrough

**Input:** `stage1-many-decisions.md` — 3 assumptions (A1-A3) + 10 decisions (D1-D10).
**Phase 1:** User accepts all assumptions.
**Phase 2:** 10 decisions — triggers the 8+ triage path.

### Step 1: Summary table presented

Gate displays all 10 decisions with recommendations:

```
The specialist identified 10 decisions. Here's a summary:

| # | Decision | Specialist Recommends |
|---|----------|-----------------------|
| D1 | Test Scope — Which Endpoints | All 42 documented endpoints |
| D2 | External Service Mocking Strategy | In-process mocks (nock/msw) |
| D3 | Database Strategy | SQLite in-memory |
| D4 | Auth Token Management | Pre-generated static tokens |
| D5 | Test Organization | One test file per route file (14 files) |
| D6 | Response Validation Depth | Schema validation + key field assertions |
| D7 | Error Case Coverage | All documented error codes per endpoint |
| D8 | Rate Limiting Test Approach | Configurable rate limits in test env |
| D9 | Test Data Seeding Strategy | Fixture files per test suite |
| D10 | CI Integration | Separate CI job — run on PR |

Which of these do you want to discuss? The rest will use the specialist's recommendation.
```

### Step 2: multiSelect question

AskUserQuestion with `multiSelect: true`:

Options:
- "D1: Test Scope — Which Endpoints"
- "D2: External Service Mocking Strategy"
- "D9: Test Data Seeding Strategy"
- "D10: CI Integration"

(Only 4 shown as AskUserQuestion options — the full list is in the table above. The user can also type "Other" to specify additional ones.)

User selects: **D2, D9** (via multiSelect checkboxes)

### Step 3: Unselected decisions auto-resolved

D1, D3, D4, D5, D6, D7, D8, D10 all recorded with the specialist's recommended option:
- `"chosen": "A"` for each (the recommended option)
- `"user_input": null`

### Step 4: Selected decisions presented individually

**D2: External Service Mocking Strategy**

Options:
1. "In-process mocks — nock/msw (Recommended)"
2. "Sidecar mock servers"
3. "Real staging services"

User picks: **Other**
Types: "Use msw for email and search, but use a real Stripe test-mode instance for payment since Stripe has a robust test API"

**D9: Test Data Seeding Strategy**

Options:
1. "Fixture files per test suite (Recommended)"
2. "Factory functions with random data"
3. "Shared seed script"

User picks: **Option 2 (non-recommended)**

### Step 5: decisions.json complete

See `decisions/5B-5-triage-decisions.json`.

---

## Criterion-by-Criterion Evaluation

### 1. Summary table shows all 10 decisions with recommendations

**PASS** — Table presented with all 10 decisions, each showing the specialist's recommended approach.

### 2. multiSelect allows picking specific ones

**PASS** — AskUserQuestion with `multiSelect: true` used. User selected D2 and D9.

### 3. Only selected decisions get individual presentation

**PASS** — Only D2 and D9 were presented with full AskUserQuestion option sets. D1, D3-D8, D10 were not individually presented.

### 4. Unselected decisions recorded with `"chosen"` = recommended option, `"user_input": null`

**PASS** — All 8 unselected decisions have `"chosen": "A"` (the recommended option) and `"user_input": null`.

### 5. Selected decisions go through normal individual flow

**PASS** — D2 presented with 3 options + Other; user picked Other with custom text. D9 presented with 3 options; user picked non-recommended. Both recorded correctly.

### 6. decisions.json contains all 10 decisions when complete

**PASS** — Final file contains all 3 assumptions and all 10 decisions with `gate_completed` timestamp set.

---

## Protocol Validation Notes

1. The triage table effectively condenses 10 decisions into a scannable overview. Users can quickly identify which decisions they care about.
2. The multiSelect pattern works well — users check boxes for items they want to discuss, everything else gets auto-resolved.
3. Auto-resolved decisions still get full `context` and `options` fields in decisions.json, so Stage 2 has the same information regardless of how the decision was made.
4. The mix of auto-resolved + individually-answered decisions produces a consistent decisions.json format — no structural difference between the two.

### Design Observation: multiSelect Option Limit

AskUserQuestion supports 2-4 options per question. With 10 decisions, we can't list all 10 as selectable options. The protocol handles this by:
- Showing the full list in the summary TABLE (text output, not AskUserQuestion options)
- Using AskUserQuestion multiSelect for a representative subset
- Providing "Other" for the user to name additional decisions by number

**Recommendation for implementation:** The AskUserQuestion options should be the 3-4 decisions most likely to need user input (highest risk, most options, or least obvious recommendation). The user types "Other" and specifies additional ones (e.g., "D5, D8") if the subset doesn't cover their interests. This is a UX detail for the skill builder, not a protocol change.
