# v9 Architecture Test — Blueprint-Driven Build

## Objective

Validate that build can work from a **domain blueprint + producer profile** instead of `code_specs.md + Code Writer`. This is Critical Path Phase 1 from the design proposal.

## Test Case

**Task**: Draft the ZBA variance cover letter (Task 8 from the real zoning variance project)

This task was chosen because:
- It's a real non-code deliverable from an actual completed project
- We have the original output to compare against (produced by v8.0 build with code_specs.md)
- It exercises legal domain specifics, tone requirements, and factual accuracy
- It has clear, verifiable acceptance criteria

## Test Artifacts

All in `docs/v9/test/`:

| Artifact | Path | Purpose |
|----------|------|---------|
| Specialist profile | `specialists/legal-analyst.specialist.md` | Domain expertise + review criteria |
| Producer profile | `producers/document-writer.producer.md` | Format-specific production instructions |
| Blueprint | `blueprints/legal-analyst.md` | v9 universal envelope format — the spec build works from |
| Output directory | `output/` | Where the producer writes the deliverable |
| Original output | `C:/Projects/Addition/.../deliverables/07_cover_letter.md` | Baseline for comparison |

## What We're Testing

### Test 1: Producer Delegation
**Question**: Can a sonnet subagent (document-writer) produce a complete cover letter from the blueprint alone?

**Method**:
1. Spawn a Task subagent with the document-writer producer prompt
2. Point it at the blueprint
3. It writes to `output/07_cover_letter.md`

**Success criteria**:
- Output file is created and non-empty
- All 9 content blocks from the blueprint's Producer Handoff are present
- No content was invented (everything traces to the blueprint)
- Formatting matches directives (markdown, horizontal rules, italic enclosures)

### Test 2: Specialist Review
**Question**: Can the legal-analyst specialist (as reviewer) catch domain errors in producer output?

**Method**:
1. Spawn a Task subagent with the legal-analyst review prompt
2. Give it the blueprint + the produced output
3. It returns PASS/FAIL with findings

**Success criteria**:
- Reviewer checks each review criterion from the specialist profile
- Reviewer catches if HB 577 distinction was blurred
- Reviewer catches if factual claims don't trace to research findings
- Reviewer catches if tone is off (advocacy vs. factual persuasion)

### Test 3: Builder Verification
**Question**: Can a build-manager-level check verify acceptance criteria are met?

**Method**:
1. Spawn a Task subagent acting as the build manager verifier
2. Give it the plan's acceptance criteria + the produced output
3. It returns PASS/FAIL per criterion

**Success criteria**:
- Each of the 5 acceptance criteria is individually assessed
- Assessment is evidence-based (points to specific content in the output)

### Test 4: Comparison to v8.0 Output
**Question**: Is the v9-produced cover letter comparable in quality to the v8.0 original?

**Method**:
1. Human review — compare the two outputs side by side
2. Check: factual accuracy, tone, completeness, HB 577 distinction, ADR-005 framing

**Success criteria**:
- v9 output is at least as complete as v8.0 output
- No factual errors introduced
- HB 577 distinction maintained
- ADR-005 framing applied correctly

## How to Run

### Quick version (Test 1 only — validates the core question)

Run a Task subagent with:
- **Model**: sonnet
- **Prompt**: Document-writer producer prompt + blueprint path
- **Tools**: Read, Write, Glob, Grep
- **Expected output**: `docs/v9/test/output/07_cover_letter.md`

### Full version (Tests 1-3 — validates the complete review chain)

1. Run Test 1 (producer creates deliverable)
2. Run Test 2 (specialist reviews — must PASS)
3. Run Test 3 (builder verifies acceptance criteria — must PASS)
4. User runs Test 4 (manual comparison)

## What Failure Looks Like

| Failure Mode | What It Means | Implication |
|-------------|---------------|-------------|
| Producer invents content | Blueprint not detailed enough OR producer prompt too loose | Need richer blueprints or tighter producer constraints |
| Producer misses content | Producer can't parse the blueprint format | Blueprint format needs restructuring |
| Specialist review misses errors | Review criteria too vague OR reviewer prompt not adversarial enough | Need sharper review criteria |
| Builder can't map acceptance criteria | Blueprint's acceptance mapping is unclear | Need tighter mapping format |
| Output quality much worse than v8.0 | The blueprint abstraction layer loses signal | Fundamental architecture concern — may need to reconsider the separation |

## Expected Outcome

If all 4 tests pass, we've validated that:
1. The universal blueprint format carries enough information for a producer to work from
2. The specialist-as-reviewer pattern catches domain errors
3. The builder verification layer works against acceptance criteria
4. The quality is comparable to the current architecture

This proves Critical Path Phase 1 and green-lights Phase 2 (team assembly).
