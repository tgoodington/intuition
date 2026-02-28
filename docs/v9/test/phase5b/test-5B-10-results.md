# Test 5B-10: Stage 2 Honoring decisions.json

**Date:** 2026-02-28
**Verdict:** PASS

---

## Objective

Validate that a Stage 2 subagent correctly consumes decisions.json and produces a blueprint that honors all user overrides, promotions, and custom "Other" inputs.

## Input

- **stage1.md**: `stage1-with-assumptions.md` (5 assumptions + 3 decisions)
- **decisions.json**: `decisions/5B-3-promote-decisions.json` — the richest test case:
  - A3 promoted: sonnet → opus
  - A5 promoted: date-based naming → `recommendation_[use-case-slug].md`
  - D1: recommended option (A — weighted percentage)
  - D2: "Other" with custom text ("strict tag match but also include models tagged as 'general'")
  - D3: non-recommended option (C — all above threshold, not top-5)

## Compliance Check

### Promoted Assumption A3: Model Selection → opus

| Location | Expected | Found | Match |
|----------|----------|-------|-------|
| Section 4 Decisions table | `opus` noted as promoted override | "**Use `opus`** (not sonnet) — **Promoted**" | Yes |
| Section 5.2 YAML frontmatter | `model: opus` | `model: opus` | Yes |
| Section 9 Producer Handoff | `opus` | "Execution Model: `opus` (per A3 user override)" | Yes |

**PASS** — opus appears in all three locations where model selection matters. The default "sonnet" does not appear as the selected model anywhere in the blueprint.

### Promoted Assumption A5: Naming Convention → `recommendation_[use-case-slug].md`

| Location | Expected | Found | Match |
|----------|----------|-------|-------|
| Section 4 Decisions table | Override naming noted | "**Use `recommendation_[use-case-slug].md`** (no date prefix) — **Promoted**" | Yes |
| Section 5.4 Output data contract | `recommendation_[use-case-slug].md` | "reports/recommendation_[use-case-slug].md" | Yes |
| Section 5.8 Report generation | Uses override naming | Report written to `reports/recommendation_[slug].md` | Yes |
| Section 1 Acceptance Criteria AC6 | Override naming | "`recommendation_[use-case-slug].md` convention" | Yes |

**PASS** — The date-based `model_rec_YYYY-MM-DD_[slug].md` pattern does not appear anywhere. Override naming used consistently.

### Decision D1: Scoring Formula → Weighted Percentage (Option A)

| Location | Expected | Found | Match |
|----------|----------|-------|-------|
| Section 3 Approach | Weighted percentage referenced | "RAM fit 40%, VRAM fit 40%, context fit 20% (per D1)" | Yes |
| Section 5.6 Scoring Formula | Full formula with 40/40/20 weights | Complete formula with `ram_ratio * 0.40 + vram_ratio * 0.40 + context_ratio * 0.20` | Yes |
| Section 6 Acceptance Mapping AC2 | Formula referenced | "Complete formula with per-dimension calculation, capping, and edge cases" | Yes |

**PASS** — Scoring formula exactly matches the user's choice. Weights are 40/40/20 as specified.

### Decision D2: Filtering → "Other" (strict match + general tag inclusion)

| Location | Expected | Found | Match |
|----------|----------|-------|-------|
| Section 3 Approach | Custom filtering referenced | "always including models tagged 'general' regardless of query (per D2 user override)" | Yes |
| Section 5.5 Filtering Logic | Pseudocode implements both paths | Strict tag match PLUS `else if model.use_case_tags contains "general"` | Yes |
| Section 8 Open Items | "general" tag existence flagged | "D2 user override assumes models have a 'general' tag. Stage 1 did not confirm 'general' exists" | Yes |

**PASS** — The user's custom "Other" input was correctly interpreted and implemented. Both the strict match AND the general-tag inclusion appear in the filtering pseudocode. Critically, the blueprint also flagged an open item: Stage 1 never confirmed "general" exists as an actual tag in the catalog. This is exactly the kind of research gap that Stage 2 should surface.

### Decision D3: Presentation → All Above Threshold (Option C)

| Location | Expected | Found | Match |
|----------|----------|-------|-------|
| Section 3 Approach | All above threshold referenced | "all models at or above 'acceptable_fit' (per D3)" | Yes |
| Section 5.8 Report Generation | No top-N cap | "all models that score at or above the 'acceptable_fit' threshold (fit_score >= 0.55)" | Yes |
| Section 1 AC4 | Option C language | "all models above the 'acceptable_fit' threshold" | Yes |

**PASS** — No trace of "top 5" anywhere in the blueprint. The specialist's original recommendation (option A) was correctly overridden.

### Accepted Assumptions (A1, A2, A4) — Defaults Preserved

| Assumption | Default | Found in Blueprint | Match |
|------------|---------|-------------------|-------|
| A1: 3-tier rating | excellent_fit, acceptable_fit, poor_fit | Section 5.7 Tier Classification uses all three tiers | Yes |
| A2: Single SKILL.md | Single file | Section 5.1 "single Markdown file", Section 5.10 structure | Yes |
| A4: Hardware path | config/hardware-profile.json | Section 5.4 data contract | Yes |

**PASS** — All three accepted defaults correctly used without modification.

---

## Research Grounding Evaluation

Checked against the D23 grounding rule: every design choice traceable to (a) Stage 1 research, (b) user decision, or (c) named domain standard.

| Design Choice | Grounded To | Grounding Quality |
|---------------|-------------|-------------------|
| RAM field name `ram_requirement_gb` | Stage 1 finding #1 | Correct — used the exact field name from research |
| Scoring formula weights | D1 (user confirmed option A) | Correct |
| Filtering logic with "general" tag | D2 (user "Other" input) | Correct |
| All-above-threshold presentation | D3 (user chose option C) | Correct |
| Tier thresholds 0.85/0.55 | NOT in Stage 1 or decisions | **Correctly flagged as Open Item** |
| "general" tag existence | NOT confirmed by Stage 1 | **Correctly flagged as Open Item** |
| `use_case_tags` field name | NOT confirmed by Stage 1 | **Correctly flagged as Open Item** |

**PASS** — All three ungrounded design choices were properly surfaced in Open Items. Stage 2 did not silently invent thresholds or assume field names without flagging them.

---

## Summary

Stage 2 correctly honored all 8 items from decisions.json:
- 2 promoted assumptions with overrides → both reflected throughout the blueprint
- 1 "Other" decision with custom text → interpreted and implemented correctly, with open item flagged
- 1 non-recommended option → specialist's recommendation correctly overridden
- 1 recommended option → confirmed and implemented
- 3 accepted assumptions → defaults preserved without modification

The research grounding rule worked as intended: 3 design choices not covered by Stage 1 or user decisions were surfaced in Open Items rather than silently invented.

---

## Protocol Validation

This test closes the last gap in the Stage 1 → gate → Stage 2 pipeline validation:

| Test | What it validated |
|------|------------------|
| S1 | Stage 1 produces quality research |
| 5B-1 | Stage 1 produces correct assumptions/decisions format |
| 5B-2 through 5B-9 | Gate protocol correctly parses, presents, collects, persists, recovers |
| S2/S3 | Stage 2 produces a buildable blueprint |
| **5B-10** | **Stage 2 correctly consumes decisions.json with overrides** |

The complete pipeline is validated end-to-end at the protocol design level.
