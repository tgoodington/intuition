# Test 5B-9: Crash Recovery — Gate Already Complete

**Date:** 2026-02-27
**Verdict:** PASS

---

## Simulation Walkthrough

**Scenario:** The user completed the entire gate (all assumptions + all decisions resolved), but the session crashed before Stage 2 could run. No blueprint exists yet.

**Pre-existing state:** `decisions/5B-9-complete-decisions.json` — all items resolved, `gate_completed: "2026-02-27T17:18:00Z"`.

### Step 1: Detail skill starts fresh

Skill re-reads the detail brief from disk. Identifies specialist (code-architect), task, and file paths.

### Step 2: Skill checks for existing decisions.json

Finds `decisions.json` with `gate_completed` set to a timestamp — gate is complete.

### Step 3: Skill checks for existing blueprint

Looks for `{context_path}/blueprints/code-architect.md` — does not exist.

### Step 4: Skill presents skip message

```
Found completed consultation from 2026-02-27T17:18:00Z. Proceeding to blueprint generation.

Summary of resolved items:
- 3 assumptions accepted
- 3 decisions resolved (D1: A, D2: B, D3: A)
```

### Step 5: Skill proceeds to Stage 2

Spawns Stage 2 subagent with stage1.md + decisions.json injected.

---

## Criterion-by-Criterion Evaluation

### 1. Skill detects completed gate

**PASS** — `gate_completed` is non-null, signaling all items are resolved.

### 2. Presents summary with timestamp

**PASS** — "Found completed consultation from 2026-02-27T17:18:00Z" with item count summary.

### 3. Skips directly to Stage 2

**PASS** — No questions presented. No Phase 1 or Phase 2 prompts. Gate is entirely bypassed.

### 4. Does NOT re-ask any questions

**PASS** — All items are resolved in decisions.json. Skill treats the file as authoritative and moves to Stage 2.

---

## Protocol Validation Notes

1. **The complete-gate-skip is the simplest recovery path.** Just check `gate_completed != null` and proceed.
2. **The summary is a courtesy, not a requirement.** It helps the user remember what they decided in the previous session. The skill could skip it and go straight to Stage 2, but the summary builds confidence that the right decisions are being used.
3. **What if the blueprint already exists?** This test explicitly requires no blueprint at the expected path. If a blueprint DID exist, the skill should present: "Found completed blueprint from [timestamp]. Nothing to do." This is a different scenario (full recovery, not mid-pipeline recovery).

### Additional Edge Case: User Wants to Change a Decision

If the user sees the summary and says "wait, I want to change D2" — the current protocol doesn't support this. The skill would need to:
1. Re-open decisions.json
2. Clear D2's `chosen` and `user_input` fields
3. Set `gate_completed` back to null
4. Re-present D2

**Recommendation for implementation:** Don't build this initially. If the user wants to change a decision after completion, they can delete decisions.json and restart the gate. Add a "restart gate" option in the summary message as a simple escape hatch. A more granular "edit one decision" feature is a nice-to-have for later.
