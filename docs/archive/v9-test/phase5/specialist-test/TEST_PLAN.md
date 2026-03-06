# Phase 5 Specialist Test: Code-Architect End-to-End

## Objective
Validate that the code-architect specialist profile can produce a blueprint of equivalent quality to the hand-crafted blueprint through the Stage 1 → user gate → Stage 2 pipeline.

## Test Case: Hardware Vetter Skill (Same task as Phase 5B)

### Test S1: Stage 1 Quality — COMPLETE (PASS)
- **Specialist**: code-architect
- **Task**: Task 2 — Build the Hardware Vetter Claude Code Skill
- **Depth**: Deep
- **Input**: Plan task + access to District AI codebase
- **Output**: `specialist-test/scratch/code-architect-stage1.md`
- **Pass criteria**:
  1. Research findings cover all relevant files (catalog, config, existing skill, existing report)
  2. ECD analysis is thorough (elements, connections, dynamics)
  3. Engineering questions are identified and self-answered from research
  4. Issues/risks are surfaced
- **Result**: PASS — thorough 428-line exploration, found all key files, identified 5 issues, self-answered 5 engineering questions

### Test S2: Stage 2 Blueprint Quality — COMPLETE (PASS)
- **Input**: stage1.md + user decisions (scope: full rewrite, accept self-answers, ignore existing skill)
- **Output**: `specialist-test/blueprints/code-architect-hw-vetter.md`
- **Reference**: `phase5/blueprints/code-architect-hw-vetter.md` (hand-crafted)
- **Pass criteria**:
  1. All 9 universal envelope sections present and non-empty
  2. Deliverable specification detailed enough for code-writer producer (no architectural gaps)
  3. All 8 acceptance criteria mapped
  4. Quality comparable to hand-crafted blueprint
- **Result**: PASS — 917-line blueprint, all 9 envelope sections present and substantive, all acceptance criteria mapped, specification depth sufficient for a code-writer producer. Divergences from hand-crafted are design choices, not gaps (see S3).
- **Comparison dimensions evaluated**:
  - Structural completeness: All sections present, auto-generated is more verbose (917 vs 376 lines)
  - Specification depth: Auto-generated has more detail in some areas (error handling, architecture multipliers), less in others (predefined option lists)
  - Research grounding: Most design choices traceable to Stage 1 findings; some re-derived from first principles (see S3)
  - Practical executability: A code-writer producer could build from either blueprint
- **Full comparison**: `specialist-test/blueprint-comparison.md`

### Test S3: Divergence Analysis — COMPLETE (PASS with findings)
- **Input**: Both blueprints side by side
- **Check**: Where does the auto-generated blueprint diverge from the hand-crafted one?
- **Key divergences found** (38 specific items documented in `blueprint-comparison.md`):
  - Feasibility thresholds: auto 30%/5% vs hand-crafted 40%/10% — different but both defensible
  - Throughput formula: auto invented architecture multiplier tables vs hand-crafted used relative ratio — auto is more ambitious
  - Question flow: auto used free-text vs hand-crafted used predefined option lists — hand-crafted more constrained
  - Tier naming: auto "Comfortable/Tight/Infeasible" vs hand-crafted "runs_comfortably/runs_constrained/does_not_fit" — style difference
  - WebSearch cap: auto 5 vs hand-crafted 8 — minor
  - Model: auto opus vs hand-crafted sonnet — should be pinned by plan, not decided by specialist
- **Verdict**: ~70% structural equivalence. Divergences are a mix of (a) defensible alternative designs and (b) cases where Stage 2 re-derived from first principles instead of using Stage 1's documented research.
- **Greenfield reframe**: This test compared against a hand-crafted blueprint that embodied v8 implementation decisions. Since Intuition projects are typically greenfield (no prior implementation to match), the "invention" behavior is actually the desired outcome. The relevant quality question is not "did it match the reference?" but "are the inventions grounded in Stage 1 research?"

### Protocol Improvements Applied (from S2/S3 findings)

1. **Research grounding rule added to Stage 2 protocol** (Section 3): Every design choice must be traceable to Stage 1 research, user decisions, or a named domain standard. Ungrounded choices go to Open Items.
2. **D23 added to decisions log**: Greenfield-first design stance — Stage 2 invents grounded designs, not transcriptions.
3. **Model pinning**: Model selection should come from the plan, not be invented by the specialist. (Recommendation 4 — applies regardless of greenfield/rewrite.)
4. **Dropped recommendations**: Reference Behavior input, explicit deviation flags, and faithfulness checks were specific to rewrite scenarios and don't apply to greenfield projects.

## Execution Order
1. ~~Test S2 comparison~~ COMPLETE
2. ~~Test S3 divergence analysis~~ COMPLETE
