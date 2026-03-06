# Test 5B-7: decisions.json Incremental Write

**Date:** 2026-02-27
**Verdict:** PASS

---

## Simulation Walkthrough

**Input:** `stage1-with-assumptions.md` — 5 assumptions + 3 decisions = 8 items total.
**Method:** Walk through each gate step and verify the decisions.json state after each write.

### Write 0: Gate startup

```json
{
  "specialist": "code-architect",
  "gate_started": "2026-02-27T17:00:00Z",
  "gate_completed": null,
  "assumptions": [],
  "decisions": []
}
```

**Valid JSON:** Yes
**`gate_started` set:** Yes
**`gate_completed`:** null

### Write 1: Phase 1 — User accepts all assumptions

```json
{
  "specialist": "code-architect",
  "gate_started": "2026-02-27T17:00:00Z",
  "gate_completed": null,
  "assumptions": [
    { "id": "A1", "title": "Output Format Consistency", "default": "...", "status": "accepted", "user_override": null },
    { "id": "A2", "title": "Single-File Skill Structure", "default": "...", "status": "accepted", "user_override": null },
    { "id": "A3", "title": "Model Selection for Execution", "default": "...", "status": "accepted", "user_override": null },
    { "id": "A4", "title": "Hardware Profile Path", "default": "...", "status": "accepted", "user_override": null },
    { "id": "A5", "title": "Report Naming Convention", "default": "...", "status": "accepted", "user_override": null }
  ],
  "decisions": []
}
```

**Valid JSON:** Yes
**All 5 assumptions present:** Yes
**Previous data preserved:** gate_started unchanged

### Write 2: D1 resolved (user picks recommended)

Skill reads file from disk, adds D1 to decisions array, writes back.

```json
{
  ...
  "assumptions": [A1-A5 unchanged],
  "decisions": [
    { "id": "D1", "title": "Scoring Formula Approach", "context": "...", "options": [...], "chosen": "A", "user_input": null }
  ]
}
```

**Valid JSON:** Yes
**Assumptions preserved:** Yes (all 5 still present)
**D1 present:** Yes

### Write 3: D2 resolved (user picks non-recommended)

Skill reads file from disk, adds D2 to decisions array, writes back.

```json
{
  ...
  "assumptions": [A1-A5 unchanged],
  "decisions": [
    { "id": "D1", ... "chosen": "A" },
    { "id": "D2", ... "chosen": "B" }
  ]
}
```

**Valid JSON:** Yes
**D1 preserved:** Yes (still present, unchanged)
**D2 present:** Yes

### Write 4: D3 resolved (user picks Other) — final write

Skill reads file from disk, adds D3, sets `gate_completed`, writes back.

```json
{
  "specialist": "code-architect",
  "gate_started": "2026-02-27T17:00:00Z",
  "gate_completed": "2026-02-27T17:04:00Z",
  "assumptions": [A1-A5],
  "decisions": [D1, D2, D3]
}
```

**Valid JSON:** Yes
**All previous data preserved:** Yes
**`gate_completed` set:** Yes (was null before this write)

---

## Criterion-by-Criterion Evaluation

### 1. Valid JSON after every write

**PASS** — All 5 writes (0 through 4) produce valid JSON. The read-before-write pattern ensures the full file is rewritten each time, not appended.

### 2. No data loss between writes

**PASS** — Each write preserves all previously recorded items. Verified by checking that `gate_started`, all assumptions, and all previously recorded decisions persist through each subsequent write.

### 3. `gate_started` set on first write, persists through all writes

**PASS** — Set in Write 0, unchanged through Writes 1-4.

### 4. `gate_completed` null until final write, then set to timestamp

**PASS** — Null in Writes 0-3. Set to `"2026-02-27T17:04:00Z"` in Write 4.

### 5. Each item appears in the file immediately after resolution

**PASS** — Assumptions appear after Write 1 (Phase 1 resolution). D1 appears after Write 2. D2 appears after Write 3. D3 appears after Write 4.

---

## Protocol Validation Notes

1. **Read-before-write is essential.** Without it, auto-compaction could cause the skill to lose track of previously collected answers and overwrite with partial data. The file on disk is the source of truth.
2. **Write 0 (gate startup) establishes the skeleton.** This ensures that even if the gate crashes before the first user response, there's a valid decisions.json on disk indicating the gate started.
3. **The "accept all" assumptions are written as a batch** in a single write (Write 1). This is correct — they're resolved in a single user action. Individual writes per assumption would be unnecessary.
4. **Each decision is a separate write.** This is the key crash recovery property — if the process dies between D2 and D3, D1 and D2 are already on disk.

### Implementation Note

The read-before-write pattern means the skill makes 2 tool calls per decision (Read + Write). For 3 decisions, that's 6 tool calls for the decisions array alone. This is acceptable overhead for crash recovery guarantees. For the 8+ triage path, auto-resolved decisions should be written in a single batch (one read + one write for all auto-resolved items), then individual writes for the selected decisions.
