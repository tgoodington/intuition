# Code Production Regression Comparison

## Summary Verdict

**v9 EQUIVALENT** — The v9 output faithfully implements all 8 blueprint sections and satisfies all 8 acceptance criteria. It is more concise than v8 (460 vs 708 lines) with no structural omissions, though v8 provides greater detail in several areas (GPU options, error scenarios, report template). Neither output contains significant technical errors. The v9 architecture can replace v8 for code production without quality loss, though it produces leaner output.

## Structural Comparison

| Aspect | v8 | v9 | Winner |
|--------|----|----|--------|
| YAML frontmatter | Correct: name, description, model, tools | Identical frontmatter | EQUAL |
| Section 1: Overview & Role | Present (lines 8-28) | Present (lines 8-16) | v8 slightly more detailed |
| Section 2: Data Loading | Present (lines 30-86) | Present (lines 18-71) | v8 more detailed (lists all fields) |
| Section 3: Question Flow | Present (lines 88-194) | Present (lines 73-158) | v8 more detailed (more GPU options) |
| Section 4: Analysis | Present (lines 196-348) | Present (lines 160-244) | v8 more detailed |
| Section 5: Benchmark Search | Present (lines 350-420) | Present (lines 246-293) | v8 more detailed |
| Section 6: Report Template | Present (lines 422-596) | Present (lines 295-411) | v8 significantly more detailed |
| Section 7: Error Handling | Present (lines 598-689) | Present (lines 413-444) | v8 significantly more detailed |
| Section 8: Completion | Present (lines 691-707) | Present (lines 446-459) | EQUAL in substance |
| Total line count | 708 lines | 460 lines | v8 is 54% longer |
| Heading style | "# Hardware Vetter Skill" + "## N. Section" | "## Section N: Title" | Stylistic preference only |

## Criterion-by-Criterion Analysis

### 1. Structural Completeness

**Rating: EQUAL**

Both outputs contain all 8 required sections plus correct YAML frontmatter. The frontmatter blocks are identical:

v8 (lines 1-6):
```yaml
---
name: hardware-vetter
description: Evaluate proposed hardware changes against the AI server's model lineup
model: sonnet
tools: Read, WebSearch, AskUserQuestion, Write, Glob
---
```

v9 (lines 1-6): Identical block.

Both include Data Loading, Question Flow, Analysis, Benchmark Search, Report Template, Error Handling, and Completion sections in the correct order.

### 2. Specification Fidelity

**Rating: EQUAL — both are faithful to their inputs, with minor differences**

**v8 fidelity to code_specs:**
- The code_specs (Task 2) specified 8 sections in order. v8 implements all 8.
- The code_specs specified "Provide common options (RTX 4060/16GB, RTX 4090/24GB, A4000/16GB, A6000/48GB) plus free-text." v8 expanded this significantly to 8 GPU options (lines 141-148: RTX 4060 Ti, 4070, 4080, 4090, A4000, A5000, A6000, Custom). This is **invented content** — the code_specs only listed 4 common options. The additions (4070, 4080, A5000) are reasonable but were not specified.
- The code_specs specified RAM options as "128GB, 256GB, 384GB, 512GB". v8 expanded to 8 options (128, 192, 256, 384, 512, 768, 1024, Custom) — lines 163-171. The additional options (192, 768, 1024) are **invented content**.
- v8 added a "Scenario 6: User Proposes a Downgrade" error case (lines 659-667) and "Scenario 7: Partial Offload Complexity" (lines 669-676) that were not in the code_specs. The code_specs Section 7 listed 5 error cases; v8 has 7.

**v9 fidelity to blueprint:**
- The blueprint specified 8 sections. v9 implements all 8.
- The blueprint (Section 5.4) specified GPU options as: "RTX 4060/16GB, RTX 4090/24GB, A4000/16GB, A6000/48GB". v9 lists exactly these 4 plus "Other (I'll specify)" — lines 112-116. Faithful to spec.
- The blueprint specified RAM options as "128GB, 256GB, 384GB, 512GB". v9 lists exactly these 4 plus "Other" — lines 127-131. Faithful to spec.
- The blueprint specified 5 error cases in Section 5.8. v9 implements all 5 plus adds a 6th: "If current hardware fields are missing from `hardware_profile`" (lines 441-443). This is a reasonable addition that handles a gap the blueprint didn't explicitly cover.
- v9 adds a deduplication check (line 310-311): "You MUST NOT overwrite an existing report file. If a file at the target path already exists, append a numeric suffix..." The blueprint mentions "never overwrite existing reports" in Section 2 (Research Findings) and the approach matches, but the implementation detail of a numeric suffix is v9's own addition. Good defensive behavior.

**Verdict:** Both outputs are faithful to their respective inputs. v8 invents more content (extra GPU/RAM options, extra error scenarios). v9 stays closer to its blueprint but adds one useful error case and a file collision guard.

### 3. Technical Accuracy

**Rating: EQUAL**

**Feasibility tier thresholds:**
- v8 (line 201-202): "runs_comfortably (>=40% headroom), runs_constrained (10-39% headroom), does_not_fit (<10% headroom or exceeds capacity)" — Correct.
- v9 (lines 192-195): "Headroom >= 40% -> runs_comfortably, 10-39% -> runs_constrained, < 10% OR resource usage ratio > 1.0 -> does_not_fit" — Correct. The `> 1.0` explicit check is a clearer formulation.

**Headroom formula:**
- v8 (line 274): `(proposed_total_ram - model_ram_requirement) / proposed_total_ram * 100` — Correct.
- v9 (line 179): `(proposed_total_ram - ram_gb_q4) / proposed_total_ram * 100` — Correct. Uses the specific field name rather than a generic variable, which is more precise.

**Concurrent capacity:**
- v8 (lines 284-286): `floor(proposed_total_ram / model_ram_requirement)`, capped by CPU cores (2 cores per instance). Correct.
- v9 (lines 200-202): `floor(proposed_total_ram / ram_gb_q4)`, capped by `floor(proposed_cpu_cores / 2)`. Correct. Explicitly states the floor operation on the core cap.

**Throughput formula:**
- v8 (lines 291-297): `relative_throughput = (proposed_clock_speed / current_clock_speed) * sqrt(proposed_cores / current_cores)` using base clock speeds. Includes a worked example. Correct.
- v9 (lines 210-213): `clock_speed_ratio * sqrt(core_count_ratio)` — uses turbo clock speeds as primary with base as fallback ("use base clock if turbo is unavailable for either"). Includes the geometric mean characterization. Correct formula, but **differs on clock source**: v8 says "Use base clock speeds for comparison (turbo is inconsistent under sustained load)" while v9 says use turbo as primary.

This is a **minor discrepancy** — the v8 rationale (turbo is inconsistent under sustained load) is arguably more technically accurate for sustained inference workloads. The v9 approach using turbo is defensible but less conservative. Both the code_specs and blueprint say "clock speed ratio (proposed vs current)" without specifying base vs turbo, so neither output is contradicting its input — they made different reasonable choices.

**GPU partial offload:**
- v8 (lines 239-254): Detailed partial offload logic with VRAM spillover calculation, RAM headroom for spillover, loading strategy labels. Correct and thorough.
- v9 (lines 185-188): Covers partial offload viability check. Correct but less detailed — doesn't specify spillover calculation or loading strategy labels.

### 4. Instruction Quality

**Rating: v8 SLIGHTLY BETTER**

Both outputs use imperative directives to Claude, as required. Examples:

v8 (line 32): "**CRITICAL:** You MUST complete data loading before proceeding to questions."
v9 (line 68): "If `docs/model_catalog.json` is missing or unreadable, stop immediately and tell the user..."

v8 uses more explicit "CRITICAL RULES" callout blocks (lines 32, 91-93, 198-202, 352-357, 424-427, 602-605) with MUST/NEVER language. v9 uses imperative voice throughout but with fewer explicit CRITICAL markers.

v8 provides more procedural granularity. For example, in the question flow, v8 specifies exact suggested formats for user input (line 130: "Provide CPU details: Model, Core Count, Base Clock GHz, Turbo Clock GHz, Architecture (optional)") and an example (line 132). v9 provides the question text but not a suggested format or example.

v8's report template (Section 6) includes the complete markdown structure with every field placeholder and key/legend text, spanning ~170 lines. v9's report template is ~100 lines with the same sections but less placeholder detail.

For Claude following instructions reliably, v8's greater specificity reduces ambiguity. However, v9's instructions are clear enough that a capable model (sonnet) would produce equivalent results in practice.

### 5. Content Depth

**Rating: v8 BETTER in specific areas**

| Section | v8 Lines | v9 Lines | Depth Comparison |
|---------|----------|----------|-----------------|
| Overview | ~20 | ~9 | v8 includes explicit "What you do" / "What you do NOT do" lists (7 do items, 5 don't items). v9 has 3 lines covering the same scope more tersely. |
| Data Loading | ~57 | ~54 | Comparable. v8 lists every field to extract with bullet points. v9 lists the same fields with slightly different organization. |
| Question Flow | ~107 | ~86 | v8 provides more GPU options (8 vs 5), more RAM options (8 vs 5), explicit table format for confirmation summary, detailed handling logic. v9 covers the same flow with fewer options. |
| Analysis | ~153 | ~85 | v8 is significantly more detailed. Includes: worked throughput example (lines 293-296), explicit loading strategy labels for GPU path, detailed partial offload spillover math, explicit delta format specifications. v9 covers the same methodology but without worked examples. |
| Benchmark Search | ~71 | ~48 | v8 includes alternative query template, explicit filtering criteria with 3 conditions, search tracking counter, search summary format. v9 covers the same logic more concisely. |
| Report Template | ~175 | ~117 | v8 includes the full report markdown with all placeholders, legend, and formatting notes. v9 includes the same sections but with less placeholder text. Both specify identical section order. |
| Error Handling | ~92 | ~32 | Largest gap. v8 has 7 named error scenarios with detailed response/remediation for each, plus a validation gates summary. v9 has 6 error cases in a more compressed format. v8 adds Downgrade and Partial Offload Complexity scenarios. |
| Completion | ~17 | ~14 | Comparable. Both specify report path, summary, and next steps. |

**Areas where v9 adds content v8 lacks:**
- File collision guard with numeric suffix (v9 lines 310-311)
- Missing hardware_profile fields error case (v9 lines 441-443)
- Schema version awareness: v9 notes that version "1.1" indicates Task 1 completion (line 49)
- Explicit instruction: "Perform all calculations in working memory. Do not write intermediate results to files." (v9 line 165)

### 6. Acceptance Criteria Coverage

## Acceptance Criteria Coverage

| AC# | Criterion | v8 | v9 | Notes |
|-----|-----------|----|----|-------|
| 1 | Accepts all four hardware change types | PASS — Section 3, Step 3.1 offers all four with multi-select, Step 3.2 has per-component follow-ups | PASS — Section 3, Step 3a offers all four with multi-select, Step 3b has per-component follow-ups | Both handle "Full system" subsuming individual selections |
| 2 | Reads from model_catalog.json and config.py automatically | PASS — Section 2, Steps 2.1 and 2.2 with Read tool instructions | PASS — Section 2, Steps 2.1 and 2.2 with Read tool instructions | Both extract hardware_profile, models, and config Settings fields |
| 3 | Fit/no-fit verdict with resource estimates | PASS — Section 4, 3-tier system with resource usage % and headroom % | PASS — Section 4.2, same 3-tier system with resource usage ratio and headroom % | Both use identical thresholds (40%/10-39%/<10%) |
| 4 | Before/after comparison per model | PASS — Section 4, Step 4.4 with 4 metrics (tier, headroom, throughput, concurrent capacity) and delta | PASS — Section 4.5 with same 4 metrics and delta | Both compare current vs proposed for registered models only |
| 5 | Identifies newly feasible candidate models | PASS — Section 4, Step 4.5 identifies models moving from does_not_fit to feasible tiers | PASS — Section 4.6 identifies models moving from does_not_fit to feasible tiers | Both include explicit handling when no models become newly feasible |
| 6 | Upgrade recommendation with rationale | PASS — Section 6 report template includes Executive Summary with verdict + rationale and Recommendation section | PASS — Section 6 report template includes Executive Summary with verdict + rationale | v8 has a separate "Recommendation" section at end of report; v9 puts recommendation in Executive Summary. Both satisfy the criterion. |
| 7 | Spec estimates flagged as "projected" | PASS — Section 4 (line 203), Section 5 (lines 399-407), report template methodology section | PASS — Section 4.4 (line 214), Section 5.5 (lines 284-291), report template methodology section | Both implement Verified/Projected labeling consistently |
| 8 | Timestamped markdown file output | PASS — Section 6, Step 6.1 with YYYY-MM-DD_slug format | PASS — Section 6.1 with YYYY-MM-DD_slug format | Both specify docs/reports/ directory creation and slug derivation |

## Notable Differences

### 1. Report Template: Recommendation Section
v8 includes a separate **"Recommendation"** section at the end of the report (lines 578-584) in addition to the Executive Summary. v9 puts the recommendation in the Executive Summary only. The blueprint (Section 5.7) specifies: "Executive Summary [3-5 sentences: upgrade verdict (recommended/not recommended/conditional), key rationale...]" — it does not specify a separate Recommendation section. The code_specs also do not specify a separate Recommendation section. v8 invented this addition. It is useful but goes beyond spec.

### 2. Throughput Clock Source
v8 explicitly states: "Use base clock speeds for comparison (turbo is inconsistent under sustained load)" (line 292). v9 states: "use `proposed_cpu_clock_ghz_turbo` / `current_cpu_clock_ghz_turbo` (use base clock if turbo is unavailable for either)" (line 211). Neither input document specifies which clock to use. The v8 choice is arguably more technically sound for sustained inference workloads.

### 3. GPU Option Breadth
v8 provides 8 GPU options including RTX 4070, 4080, A5000 (lines 141-148). v9 provides 5 options (lines 112-116). The code_specs specified 4 common options; the blueprint specified the same 4. v8 expanded beyond spec; v9 stayed faithful.

### 4. Error Handling Depth
v8 has 7 named error scenarios with detailed response and remediation for each (lines 607-676), plus a Validation Gates Summary (lines 678-689). v9 has 6 error cases in a compressed format (lines 422-444). v8 adds "User Proposes a Downgrade" and "Partial Offload Complexity" scenarios. v9 adds "Current hardware fields missing from hardware_profile."

### 5. File Collision Guard
v9 (lines 310-311) explicitly instructs: "You MUST NOT overwrite an existing report file. If a file at the target path already exists, append a numeric suffix to the slug." v8 says "Each evaluation creates a new timestamped file — never overwrite existing reports" (line 429) but doesn't specify how to handle a collision. v9 is more defensive here.

### 6. Working Memory Instruction
v9 (line 165) includes: "Perform all calculations in working memory. Do not write intermediate results to files." v8 has no equivalent instruction. This is a useful guardrail for the executing model.

### 7. Loading Strategy Labels
v8 explicitly specifies loading strategy labels in the analysis: "Full GPU offload", "Partial GPU offload (layers split between GPU and CPU)", "Not feasible", "CPU-only" — and includes them in the report template. v9 does not include loading strategy as a tracked metric.

## Issues Found

### v8 Issues
1. **Invented content beyond spec:** v8 adds GPU options (RTX 4070, 4080, A5000), RAM options (192, 768, 1024 GB), extra error scenarios (Downgrade, Partial Offload Complexity), and a separate Recommendation section that were not in the code_specs. While all additions are reasonable, they represent scope creep from the build system.

2. **Redundancy in report template:** The v8 report template includes both an Executive Summary with verdict AND a separate Recommendation section (lines 578-584). These overlap in purpose. The code_specs did not specify a separate Recommendation section.

### v9 Issues
1. **Turbo clock preference:** v9 defaults to turbo clock for throughput comparison (line 211), which is less conservative than base clock for sustained inference. Minor technical choice difference, not an error.

2. **Less GPU option breadth:** Only 5 GPU options vs v8's 8. While faithful to the blueprint, users evaluating RTX 4070/4080 or A5000 would need to use the free-text option. Not a functional gap, but a usability reduction.

3. **Missing loading strategy labels:** v9 does not track or report "loading strategy" (Full GPU offload / Partial offload / CPU-only) as a per-model metric. v8 includes this in both analysis and report. The blueprint does not explicitly require it, so this is not a spec violation, but it is a useful piece of information that v8 provides.

4. **Less detailed report template:** v9's report template section is less prescriptive about exact placeholder text and formatting. A capable model would fill in reasonable content, but there is more room for variation in output format.

### Neither Output
Both outputs correctly handle all core requirements. No critical errors or omissions found in either.

## Conclusion

The v9 architecture produces output that is functionally equivalent to v8 for this skill. All 8 acceptance criteria are satisfied by both outputs. The v9 output is 35% shorter (460 vs 708 lines), which is attributable to:

1. Fewer invented additions (v9 stays closer to its blueprint spec)
2. More compressed error handling (6 cases in 32 lines vs 7 cases in 92 lines)
3. Less verbose report template (still complete, but with fewer placeholder details)

The v8 output is richer in several areas: more GPU/RAM options for users, more detailed error scenarios, explicit loading strategy tracking, a worked throughput example, and a separate Recommendation section. However, most of these additions were **invented by the v8 build system** beyond what the code_specs specified, meaning v8's build process exhibited more creative expansion while v9's code-writer producer stayed more disciplined to its blueprint.

**Can the v9 architecture replace v8 for code production without quality loss?** Yes. The v9 output would produce an equally functional skill when executed by Claude. The differences are in richness of detail, not correctness or completeness. If the goal is spec-faithful production (build what was specified, nothing more), v9 is arguably better disciplined. If the goal is maximum robustness through extra detail, v8's build process added useful material — but that material could also be added to the v9 blueprint if desired, which would then flow through to the producer output.

The v9 architecture's advantage is that quality is controlled at the blueprint level. What the code-architect specifies, the code-writer produces. The v8 system's build step added value through creative expansion, but also added scope that was never reviewed by the engineer or architect — a tradeoff between richness and spec discipline.
