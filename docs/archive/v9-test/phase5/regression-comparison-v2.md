# Regression Comparison v2: Enriched Blueprint

## Gap Closure Summary

| Gap | v9-v1 | v9-v2 | Closed? |
|-----|-------|-------|---------|
| 1. GPU/RAM option breadth | 5 GPU options (4060 Ti, 4090, A4000, A6000, Other) | 8 options (4060 Ti, 4070, 4080, 4090, A4000, A5000, A6000, Other) | **YES** — full parity with v8's 8-option list including all 7 named GPUs + custom. RAM options also expanded from 5 to 8 (added 192, 384, 768, 1024 GB). |
| 2. Loading strategy labels | Absent — no loading strategy tracking | Present — explicitly defines 4 labels: `Full GPU offload`, `Partial GPU offload`, `CPU-only`, `Does not fit`. Assigned per model in Section 4.2. Included in Feasibility Matrix column and Before/After tables. | **YES** — loading strategy is now a first-class concept with assignment rules and report column. |
| 3. Worked throughput example | Absent — formula only, no example | Present — Section 4.4 includes a worked example: "Current: 2.1 GHz base, 12 cores / Proposed: 3.0 GHz base, 24 cores / Calculation: (3.0/2.1) * sqrt(24/12) = 1.43 * 1.41 = ~2.02x improvement" | **YES** — concrete worked example with numbers and label. |
| 4. Error handling depth | 6 scenarios (~40 lines) | 8 scenarios in a dedicated CRITICAL RULES block: (1) Missing catalog, (2) Missing GPU fields, (3) Unreadable config, (4) No benchmark results, (5) Unrecognized hardware, (6) User proposes downgrade, (7) Partial offload complexity, (8) Missing hardware_profile fields. | **YES** — 8 scenarios matching or exceeding v8's 7 (v8 had scenarios 1-7; v9-v2 adds Case 8 for missing hardware_profile fields which v8 folded into other checks). |
| 5. Report template: Recommendation section | Absent — report template ended after Methodology | Present — dedicated `## Recommendation` section between Candidate Expansion and Methodology. Specifies 1-2 paragraph structure with verdict restatement and conditional/risk paragraph. | **YES** — standalone Recommendation section with structured guidance for content. |
| 6. Base clock for throughput | Used turbo clock — formula referenced `proposed_cpu_clock_ghz_turbo / current_cpu_clock_ghz_turbo` | Uses base clock — formula is `proposed_base_clock_ghz / current_base_clock_ghz` with explicit rationale: "Base clock speeds used (not turbo) — turbo speeds are inconsistent under sustained inference load." Stated in both Section 4.4 and the Methodology template. | **YES** — base clock with rationale, matching v8's approach. |

**All 6 identified gaps are closed.**

## Line Count

| Version | Lines | Delta from v8 |
|---------|-------|---------------|
| v8 (production) | 708 | — |
| v9-v1 (first attempt) | 460 | -248 (65% of v8) |
| v9-v2 (enriched blueprint) | 562 | -146 (79% of v8) |

v9-v2 recovered 102 lines versus v9-v1, closing roughly 41% of the original line deficit. The remaining 146-line gap is structural: v8 is more verbose in its formatting (numbered subsection headers, longer inline examples, more repetitive validation gate text).

## Remaining Gaps (if any)

1. **RAM option granularity detail**: v8 provides `192, 384, 768, 1024 GB (1 TB)` with the parenthetical "1 TB" annotation. v9-v2 lists `1024 GB` without the annotation. Negligible.

2. **Step numbering verbosity**: v8 uses deeply nested step IDs (Step 4.2a, 4.2b, 4.2c) with per-sub-step bold headers. v9-v2 uses inline code blocks and more compact formatting. This is a style difference, not a content gap.

3. **Benchmark alternative query**: v8 explicitly specifies a fallback query format using "llama.cpp" if the first "Ollama" query fails (Section 5.2). v9-v2 says "Run 1-2 WebSearch calls per model" but does not spell out the alternative query template. Minor — the intent is present but the fallback query wording is less explicit.

4. **Completion section**: v8's Section 8 provides a more specific template with bullet structure (report location, key finding, next steps) and a "Do not ask follow-up questions" directive. v9-v2 covers the same ground but without the explicit "Do not ask follow-up questions" instruction. Minor behavioral gap.

5. **Confirmation table format**: v8 specifies the confirmation summary as a markdown table with Current/Proposed/Change columns. v9-v2 uses a code block with arrow notation (`Current -> Proposed`). Functionally equivalent but v8's format is more structured.

None of these remaining gaps are significant enough to affect skill execution quality.

## v9-v2 Advantages (things v9-v2 has that v8 doesn't)

1. **Loading strategy as first-class Feasibility Matrix column**: v8 mentions loading strategy in the Before/After section per model, but the Feasibility Matrix table does not include a Loading Strategy column. v9-v2 adds it directly to the matrix, giving every model a visible loading strategy label in the overview table.

2. **Partial offload throughput penalty quantification**: v8 says "use conservative estimates (assume PCIe bandwidth bottleneck)" without quantifying the penalty. v9-v2 specifies "reduce throughput by 40% (range 30-50%)" and adds a label "Projected — partial offload penalty estimated." This is more actionable.

3. **Case 8 — Missing hardware_profile fields**: v9-v2 adds a standalone error case for partially missing hardware_profile data (e.g., RAM present but clock speeds absent). v8 handles this implicitly within other error cases but doesn't give it a dedicated scenario with skip/document rules.

4. **Explicit "Do NOT guess or invent specs" directive** (Case 5): v9-v2 adds emphatic language prohibiting spec invention for unrecognized hardware. v8 handles the case but without the explicit prohibition on guessing.

5. **Pre-analysis summary checkpoint** (Step 2.3): v9-v2 includes an internal validation step that summarizes what was loaded and what flags are set before entering the question flow. v8 doesn't have this explicit checkpoint.

6. **Validation gates summary section**: v9-v2 provides a consolidated validation gates summary at the end of Section 7, listing all three gates (catalog, data, confirmation) with explicit failure routing. v8 distributes validation gates across sections without a consolidated summary.

7. **CRITICAL RULES block in error handling**: v9-v2 uses a quoted callout block format for the error handling critical rules, which is a best practice for SKILL.md files (high-attention position formatting). v8 uses standard bold text.

## Verdict

**v9 EQUIVALENT**

All 6 identified regression gaps from v9-v1 are fully closed in v9-v2. The enriched blueprint successfully guided the skill builder to restore every missing capability. The remaining line count difference (562 vs 708) reflects v9-v2's more compact formatting rather than missing content. v9-v2 additionally introduces several structural improvements (loading strategy column, partial offload penalty quantification, missing-field error case, validation gate summary) that v8 lacks. The skill is functionally equivalent with minor advantages in both directions — v8 is more verbose/explicit in some formatting areas, v9-v2 is more structured in error handling and analysis methodology.
