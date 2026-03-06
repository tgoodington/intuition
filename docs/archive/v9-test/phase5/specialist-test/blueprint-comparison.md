# Blueprint Comparison: Hand-Crafted vs Auto-Generated (Hardware Vetter Skill)

**Date:** 2026-02-27
**Subject:** Code Architect blueprint for Task 2 (Hardware Vetter Claude Code Skill)
**Hand-crafted:** `docs/v9/test/phase5/blueprints/code-architect-hw-vetter.md`
**Auto-generated:** `docs/v9/test/phase5/specialist-test/blueprints/code-architect-hw-vetter.md`
**Stage 1 findings:** `docs/v9/test/phase5/specialist-test/scratch/code-architect-stage1.md`

---

## 1. Executive Summary

The hand-crafted blueprint is a tighter, more faithful translation of the v8 reference skill into blueprint form. The auto-generated blueprint is structurally complete and often more detailed, but it diverges significantly from the v8 reference on core specifications: it uses different feasibility thresholds (30%/5% vs 40%/10%), different tier names (Comfortable/Tight/Infeasible vs runs_comfortably/runs_constrained/does_not_fit), a completely different throughput formula, a different model (`opus` vs `sonnet`), a lower WebSearch cap (5 vs 8), and invents substantial new content (architecture multiplier tables, GPU bandwidth formulas, worked examples) not present in Stage 1 findings or v8. The auto-generated blueprint is more self-contained and would give a producer more to work with, but a meaningful fraction of that content is invented rather than researched, and the inventions sometimes contradict the existing system. The hand-crafted blueprint wins on faithfulness and precision; the auto-generated blueprint wins on elaboration and self-sufficiency.

---

## 2. Dimension-by-Dimension Comparison

### 2.1 Structural Completeness

| Section | Hand-Crafted | Auto-Generated |
|---------|-------------|----------------|
| 1. Task Reference | Present, complete | Present, complete |
| 2. Research Findings | Present, narrative style | Present, structured with exact JSON blocks |
| 3. Approach | Present, concise | Present, concise |
| 4. Decisions Made | Present, 8 decisions (numbered list) | Present, 9 decisions (table format) |
| 5. Deliverable Specification | 9 subsections (5.1-5.9) | 14 subsections (5.1-5.14) |
| 6. Acceptance Mapping | Present, 8-row table | Present, 8-row table |
| 7. Integration Points | Present, narrative + lists | Present, table format |
| 8. Open Items | Present, 1 user input + 5 risks | Present, 4 items (all runtime verifications) |
| 9. Producer Handoff | Present, detailed section-by-section | Present, detailed with line-number estimates |

Both blueprints have all 9 sections filled. The auto-generated blueprint has significantly more subsections within Section 5, including a worked example (5.13), a complete question flow summary (5.14), a verdict logic section (5.10.3), and explicit data structures (5.8.1).

**Winner: Auto-generated** (more subsections in Section 5, more structured throughout)

---

### 2.2 Specification Depth

| Aspect | Hand-Crafted | Auto-Generated |
|--------|-------------|----------------|
| **Formulas** | Feasibility: `ram_gb_q4 / proposed_total_ram`. Throughput: `(proposed_base_clock / current_base_clock) * sqrt(proposed_cores / current_cores)`. All variables defined. | Feasibility: `ram_required / hardware_ram_gb`. Throughput: two completely different formulas (CPU and GPU paths) with architecture multiplier table. Variables defined but formulas are invented. |
| **Thresholds** | `>=40%` comfortable, `10-39%` constrained, `<10%` does_not_fit | `<=0.70` ratio comfortable (30%+), `<=0.95` tight (5-30%), `>0.95` infeasible (<5%) |
| **AskUserQuestion prompts** | GPU: 8 named options (4060 Ti/4070/4080/4090/A4000/A5000/A6000/Other) + VRAM. RAM: 8 named options (128/192/256/384/512/768/1024/Other). CPU: free-text. Change type: multiSelect with 4 options. | GPU: free-text with examples. RAM: free-text with examples. CPU: free-text. Change type: numbered single-select (1-4). |
| **Error cases** | 8 enumerated cases with exact behaviors | 12 enumerated cases in table format with behaviors |
| **Report template** | Full template with exact section headers, column names, content guidance | Full template with exact section headers, column names, content guidance, PLUS verdict logic rules |
| **Loading strategy labels** | 4 labels: Full GPU offload, Partial GPU offload, CPU-only, Does not fit | Not explicitly labeled as a taxonomy; GPU path vs CPU path described procedurally |

The hand-crafted blueprint fully specifies the AskUserQuestion option lists (matching v8), which is critical for a skill because the producer needs to know exactly what options to present. The auto-generated blueprint uses free-text for GPU and RAM, which means the producer must invent the option lists or present open-ended prompts. However, the auto-generated blueprint has more error cases and adds verdict logic, which the hand-crafted blueprint embeds implicitly in the report template.

**Winner: Hand-crafted** (fully specified option lists, v8-faithful thresholds and formulas)

---

### 2.3 Faithfulness to Stage 1 Findings

| Finding from Stage 1 | Hand-Crafted | Auto-Generated |
|----------------------|-------------|----------------|
| RAM field is `ram_gb` not `total_ram_gb` | Correct: uses `ram_gb` in hardware_profile references | Correct: explicit warning "NEVER reference `total_ram_gb`" in Critical Rules |
| `gpu_vram_gb_fp16` does not exist | Correct: never references it | Correct: explicit warning "NEVER reference `gpu_vram_gb_fp16`" in Critical Rules |
| 11 models, 3 registered | Correct: references 11 models, 3 registered | Correct: full table of all 11 models with registration status |
| Schema version 1.2 | Not mentioned (says 1.1 from Task 1 augmentation) | Mentioned in Section 2 research findings |
| Existing skill is 708 lines | Not reflected (writes from scratch per plan) | Not reflected (writes from scratch per plan) |
| `hardware_profile` exact fields | Listed but not reproduced verbatim | Reproduced verbatim as JSON block |
| `hardware_requirements` exact fields | Listed key fields | Reproduced verbatim as JSON block |
| `gpu_offload_support` values: cpu_only_viable, full_offload, partial_offload | References all three values in analysis | References cpu_only_viable in analysis; others implicit |
| Ollama ID colon vs hyphen distinction | Documented, matching via `ollama_id` field | Documented with explicit Critical Rule |
| Glob tool listed but unused (Stage 1 Issue 3) | Includes Glob in frontmatter tools | Excludes Glob (Decision #8: "all file paths are known") |
| Field name mismatch flagged as Issue 1 | Fixed (uses correct `ram_gb`) | Fixed with Critical Rule emphasis |
| `gpu_vram_gb_fp16` flagged as Issue 2 | Not referenced (implicitly fixed) | Explicitly prohibited in Critical Rules |

The auto-generated blueprint incorporates Stage 1 findings more visibly, reproducing exact JSON structures and placing field-name warnings in Critical Rules. The hand-crafted blueprint incorporates findings correctly but less conspicuously. Both fix the issues Stage 1 identified.

One notable divergence: the auto-generated blueprint drops `Glob` from the tools list (correct per Stage 1 findings), while the hand-crafted blueprint retains it (matching v8 but ignoring Stage 1's observation).

**Winner: Auto-generated** (more visible integration, explicit Critical Rules for field pitfalls, correct Glob removal)

---

### 2.4 Divergences from v8 Reference

| v8 Value | Hand-Crafted | Auto-Generated | Notes |
|----------|-------------|----------------|-------|
| **Feasibility thresholds:** 40%/10% headroom | `>=40%` comfortable, `10-39%` constrained, `<10%` does_not_fit | `<=0.70` ratio (30%+), `<=0.95` (5-30%), `>0.95` (<5%) | **Auto-gen diverges.** Uses 30%/5% instead of 40%/10%. |
| **Tier names:** `runs_comfortably`, `runs_constrained`, `does_not_fit` | Matches exactly | Uses `Comfortable`, `Tight`, `Infeasible` | **Auto-gen diverges.** Different names break consistency with catalog's `feasibility` field values. |
| **Throughput formula:** `(proposed_base_clock / current_base_clock) * sqrt(proposed_cores / current_cores)` | Matches exactly, with worked example | Completely different: `base_tokens_per_sec = (cores * turbo_clock) / (params * 0.5)` with architecture multiplier table | **Auto-gen diverges.** Invents new formula. |
| **WebSearch cap:** 8 calls | 8 calls | 5 calls | **Auto-gen diverges.** Lower cap. |
| **GPU options:** 8 named (4060 Ti, 4070, 4080, 4090, A4000, A5000, A6000, Other) | Matches exactly with VRAM amounts | Free-text with examples (RTX 4090, A100) | **Auto-gen diverges.** No structured options. |
| **RAM options:** 8 named (128, 192, 256, 384, 512, 768, 1024 GB, Other) | Matches exactly | Free-text with examples | **Auto-gen diverges.** No structured options. |
| **Model:** `model: sonnet` | `model: sonnet` | `model: opus` | **Auto-gen diverges.** Wrong model. |
| **Change type selection:** multiSelect | `multiSelect: true` | Single-select (numbered 1-4) | **Auto-gen diverges.** Different interaction pattern. |
| **Confidence labels:** Verified/Projected | Matches | Matches | Both aligned. |
| **Report path:** `docs/reports/hardware_eval_YYYY-MM-DD_[slug].md` | Matches | Matches | Both aligned. |
| **Partial offload handling** | Matches v8 (spillover calc, conservative estimates) | Simplified (falls back to RAM path instead of spillover calc) | **Auto-gen diverges.** Less detailed. |
| **Loading strategy labels** | 4 explicit labels matching v8 | No explicit label taxonomy | **Auto-gen diverges.** Missing. |
| **Report sections** | Matches v8 section order | Different section structure (adds "Hardware Comparison" table, splits "Registered Model Analysis" into per-model subsections) | **Both diverge** from v8, but in different ways. |

**Winner: Hand-crafted** (matches v8 on 10/12 dimensions vs auto-generated matching on 3/12)

---

### 2.5 Invented Content

The auto-generated blueprint introduces the following content NOT present in Stage 1 findings or v8:

| Invention | Description | Beneficial or Problematic? |
|-----------|-------------|---------------------------|
| **Architecture multiplier table** | Maps CPU architecture generations to IPC multipliers (Broadwell=1.0, Skylake=1.15, ... Zen 5=1.45) | **Mixed.** Conceptually useful, but the specific values are fabricated and not cited. A producer would treat these as authoritative. |
| **GPU throughput formula** | `(gpu_bandwidth_gbs) / (model_size_gb * 2)` and fallback `(gpu_vram_gb * 10) / parameter_count_billions` | **Problematic.** These formulas are invented without justification. The v8 skill does not have GPU-specific throughput formulas. The factor-of-2 for "KV cache and overhead" is a rough guess. |
| **Parameter-based RAM estimation** | `ram_required = parameter_count_billions * 0.6` when catalog fields missing | **Beneficial.** Reasonable fallback, though it's an invention not in Stage 1 or v8. |
| **Parameter-based VRAM estimation** | `gpu_vram_required = parameter_count_billions * 0.55` when fields missing | **Mixed.** Same reasoning as above but the 0.55 multiplier is fabricated. |
| **20% OS RAM reservation** | Reserves 20% of RAM for OS in concurrent capacity calculation | **Beneficial.** Practical and reasonable, absent from both Stage 1 and v8. |
| **Verdict logic rules** | Formal decision tree for Recommended/Recommended with Caveats/Not Recommended | **Beneficial.** The hand-crafted blueprint leaves verdict logic implicit in the report template. Explicit rules reduce producer guesswork. |
| **ModelAssessment data structure** | Full typed object definition with all fields | **Beneficial.** Gives producer a clear data model to implement around. |
| **Worked example** (Section 5.13) | Full numeric trace through GPU addition scenario | **Beneficial.** Demonstrates how formulas should be applied, though it uses the invented formulas. |
| **Confirmation loop** | "If 'no', ask which component to correct, re-ask" | **Beneficial.** More robust UX. |
| **Max 2 retries per unparseable field** | Explicit retry limit for parsing failures | **Beneficial.** Prevents infinite loops. |

**Assessment:** The auto-generated blueprint invents significantly. About half the inventions are beneficial (data structures, verdict logic, retry limits, worked example format). The other half are problematic because they replace correct v8 formulas/thresholds with fabricated alternatives that a producer would implement literally. The most damaging inventions are the throughput formulas and feasibility thresholds, because they would produce different numeric results than the v8 skill.

**Winner: Tie** (invention is substantial in both directions; the auto-gen adds useful structure but also harmful fabrication)

---

### 2.6 Practical Executability

| Question | Hand-Crafted | Auto-Generated |
|----------|-------------|----------------|
| Could a producer build the complete SKILL.md without architectural decisions? | **Yes**, with minor gaps. GPU/RAM option lists are fully specified. Formulas are complete. Report template is exact. Producer would need to decide on exact wording of some error messages. | **Mostly yes**, but producer would need to invent GPU/RAM AskUserQuestion option lists (blueprint says free-text). Producer would also need to reconcile the tier names with the catalog's `feasibility` field values (`runs_comfortably` etc.). |
| Where would the producer need to guess? | (1) Exact wording of Critical Rules section header; (2) Exact line-by-line layout of the skill; (3) How to present the throughput worked example. | (1) GPU option list; (2) RAM option list; (3) Whether to use `multiSelect` or numbered single-select for change type; (4) How tier names map to catalog's existing `feasibility` values; (5) Whether the architecture multiplier values are correct. |
| Target length guidance | "~600-700 lines... do not compress for brevity" | "600-700 lines" with approximate line ranges per section |
| Tone guidance | "imperative directives to Claude... CRITICAL RULES callout blocks" | "second-person imperative... MUST/NEVER/ALWAYS... No persona names" |

The hand-crafted blueprint leaves fewer decisions to the producer on the parts that matter most (option lists, thresholds, formulas). The auto-generated blueprint provides more structural scaffolding (line ranges, data structures) but leaves gaps on user-facing interaction design.

**Winner: Hand-crafted** (fewer producer decisions required on critical specifications)

---

## 3. Divergence Inventory

Every concrete difference between the two blueprints, organized by category:

### Metadata / Frontmatter
1. **Model:** Hand-crafted uses `sonnet`; auto-generated uses `opus`
2. **Tools:** Hand-crafted includes `Glob`; auto-generated excludes it
3. **Description text:** Hand-crafted: "Evaluate proposed hardware changes against the AI server's model lineup"; auto-generated: "Evaluate proposed hardware changes against registered and candidate AI models"

### Feasibility Analysis
4. **Tier names:** Hand-crafted: `runs_comfortably`/`runs_constrained`/`does_not_fit`; auto-generated: `Comfortable`/`Tight`/`Infeasible`
5. **Tier thresholds:** Hand-crafted: 40%/10% headroom; auto-generated: 30%/5% headroom (expressed as resource ratios 0.70/0.95)
6. **Feasibility formula base:** Hand-crafted: `ram_gb_q4 / proposed_total_ram`; auto-generated: `recommended_ram_gb / hardware_ram_gb` (falls back to `ram_gb_q4`)
7. **Partial offload:** Hand-crafted: explicit spillover calculation with remaining RAM check; auto-generated: simplified fallback to RAM-based resource ratio

### Throughput
8. **CPU throughput formula:** Hand-crafted: relative ratio `(base_clock_proposed/base_clock_current) * sqrt(cores_proposed/cores_current)`; auto-generated: absolute estimate `(cores * turbo_clock) / (params * 0.5) * arch_multiplier`
9. **Clock speed used:** Hand-crafted: base clock; auto-generated: turbo clock
10. **Architecture multiplier:** Hand-crafted: none; auto-generated: 7-entry lookup table (Broadwell through Zen 5)
11. **GPU throughput formula:** Hand-crafted: none (uses relative CPU formula for all estimates); auto-generated: bandwidth-based and VRAM-based formulas
12. **Throughput output format:** Hand-crafted: relative multiplier (e.g., "2.02x improvement"); auto-generated: absolute tok/s estimate (e.g., "~11 tok/s")

### Question Flow
13. **Change type selection:** Hand-crafted: `multiSelect: true` (user can select multiple); auto-generated: single-select numbered list (1-4)
14. **GPU input:** Hand-crafted: 8 named options with VRAM + free-text; auto-generated: free-text with examples
15. **RAM input:** Hand-crafted: 8 named options + free-text; auto-generated: free-text with examples
16. **CPU input:** Both use free-text (aligned)
17. **Pre-question display:** Hand-crafted: none specified; auto-generated: full current hardware summary + registered/candidate model list before first question
18. **Confirmation format:** Hand-crafted: markdown table (Component/Current/Proposed/Change); auto-generated: formatted text block with before-after list
19. **Confirmation rejection:** Hand-crafted: "Ask for confirmation via AskUserQuestion"; auto-generated: explicit correction loop ("ask which component to correct, re-ask")

### Benchmark Search
20. **WebSearch cap:** Hand-crafted: 8 calls; auto-generated: 5 calls
21. **Search query template:** Hand-crafted: includes "Ollama" in primary query, "llama.cpp" in fallback; auto-generated: includes only "inference benchmark tokens per second"
22. **Small model skip:** Hand-crafted: none; auto-generated: skip models under 3B parameters
23. **Alternative query:** Hand-crafted: explicit fallback query template; auto-generated: no fallback

### Report Structure
24. **Report title:** Hand-crafted: "Hardware Evaluation: [Brief Description]"; auto-generated: "Hardware Evaluation Report: {Change Description}"
25. **Evaluator line:** Hand-crafted: "Hardware Vetter Skill (automated analysis)"; auto-generated: "Hardware Vetter Skill (Automated)"
26. **Report sections:** Hand-crafted: Executive Summary, Proposed Changes, Feasibility Matrix, Before/After, Candidate Expansion, Recommendation, Methodology; auto-generated: Executive Summary, Hardware Comparison, Registered Model Analysis (per-model subsections), Candidate Model Analysis (table + newly feasible), Upgrade Recommendation (with verdict logic), Methodology
27. **Feasibility matrix:** Hand-crafted: single table with all 11 models; auto-generated: split into registered (per-model detail) and candidate (summary table)
28. **Loading Strategy column:** Hand-crafted: explicit column; auto-generated: not present as a column
29. **Verdict categories:** Hand-crafted: recommended/not recommended/conditional; auto-generated: Recommended/Recommended with Caveats/Not Recommended (with formal decision rules)

### Error Handling
30. **Number of error cases:** Hand-crafted: 8; auto-generated: 12
31. **Missing `hardware_profile` fields:** Hand-crafted: use available fields, skip missing, note gaps; auto-generated: STOP if `hardware_profile` key itself is missing
32. **Retry limits:** Hand-crafted: none specified; auto-generated: max 2 retries per field

### Concurrent Capacity
33. **OS reservation:** Hand-crafted: none; auto-generated: 20% RAM reserved for OS
34. **CPU core constraint:** Hand-crafted: at least 2 cores per instance heuristic; auto-generated: not mentioned

### Structure / Presentation
35. **Section numbering in deliverable:** Hand-crafted: 8 skill sections; auto-generated: 8 skill sections (same count, different internal structure)
36. **Data structures:** Hand-crafted: implicit; auto-generated: explicit ModelAssessment object definition
37. **Worked example:** Hand-crafted: throughput formula only (1 example); auto-generated: full scenario trace with current + proposed calculations for 2 models
38. **Line-number estimates:** Hand-crafted: none; auto-generated: approximate line ranges per section

---

## 4. Verdict

**The auto-generated blueprint is worse than the hand-crafted one for this specific task, but not by a large margin.**

The auto-generated blueprint is structurally richer: it has more subsections, explicit data structures, a worked example, verdict logic rules, and more error cases. As a standalone document for a producer who has never seen the v8 skill, it provides more scaffolding.

However, it fails on the most important dimension for a v9 architecture test: **faithfulness to the existing system**. The divergences are not stylistic -- they are substantive:

- Wrong model (`opus` instead of `sonnet`) -- this changes cost and speed of every skill invocation
- Wrong feasibility thresholds (30%/5% vs 40%/10%) -- this changes which models are classified into which tiers
- Wrong tier names (`Comfortable`/`Tight`/`Infeasible` vs `runs_comfortably`/`runs_constrained`/`does_not_fit`) -- this breaks consistency with the catalog's existing `feasibility` field values
- Completely different throughput formula -- this changes every throughput estimate in the report
- Missing GPU/RAM option lists -- the producer must invent what the user sees
- Single-select instead of multiSelect for change type -- different UX behavior

The Stage 1 findings documented the v8 skill thoroughly, including its exact field names and structure. But the Stage 2 process did not constrain itself to reproducing v8's analytical approach. Instead, it invented alternatives. Some inventions are improvements (verdict logic, data structures, confirmation loops), but the core analytical divergences would produce a skill that behaves differently from v8 in ways the user likely did not intend.

**Rating: Auto-generated is approximately 70% equivalent.** It would produce a functional skill, but one that differs materially from the v8 reference on core specifications.

---

## 5. Implications for the v9 Architecture

### What this tells us about the Stage 2 protocol

**1. Stage 1 research quality is high; Stage 2 does not fully leverage it.**
The Stage 1 findings correctly identified field names, data structures, the 11 models, the 3 registered IDs, and even specific issues (field mismatches, nonexistent fields). The auto-generated blueprint incorporated the field-name warnings into Critical Rules (good), but then proceeded to invent new formulas and thresholds that contradict the v8 reference that Stage 1 documented. The pipeline has a research-to-specification gap.

**2. The specialist subagent invents when it should transcribe.**
The biggest problem is not missing information but fabricated alternatives. The auto-generated blueprint's throughput formula, architecture multiplier table, and feasibility thresholds are plausible but made up. A code-architect specialist should either reproduce the existing approach (when rewriting a known skill) or explicitly flag departures as decisions. The auto-generated blueprint presents its inventions as specifications without noting they differ from v8.

**3. The Stage 2 protocol needs an "existing reference" constraint.**
When the task is "build a skill that already exists in v8," the Stage 2 specialist should be explicitly instructed to match the existing behavior unless the plan says otherwise. The current protocol apparently gives the specialist freedom to re-derive the approach from first principles, which produces divergence.

**4. Option lists and interaction design are under-specified by the auto-gen.**
The hand-crafted blueprint fully specifies every AskUserQuestion prompt with exact options, matching v8. The auto-generated blueprint defaults to free-text for GPU and RAM, which is a significant UX regression. The Stage 2 protocol should require that all user-facing prompts be fully specified in the blueprint, not left to the producer.

**5. Beneficial inventions suggest a "structured elaboration" role.**
The auto-generated blueprint's ModelAssessment data structure, verdict logic decision tree, and error handling table are genuinely useful additions the hand-crafted blueprint lacks. This suggests the specialist subagent adds value through structured elaboration of implicit requirements. The protocol should encourage this kind of invention (making implicit things explicit) while constraining the kind that replaces correct existing specifications with fabricated alternatives.

**6. Model selection must be pinned, not decided by the specialist.**
The auto-generated blueprint chose `opus` when the v8 skill and the hand-crafted blueprint both specify `sonnet`. Model selection has cost and performance implications and should come from the plan, not be a specialist decision. The Stage 2 protocol should either pass model selection as an input parameter or prohibit the specialist from overriding it.

### Recommended protocol changes

1. **Add a "Reference Behavior" input to Stage 2** -- when a v8 equivalent exists, Stage 1 should extract its key parameters (thresholds, formulas, option lists, model) and Stage 2 should treat them as constraints, not suggestions.
2. **Require explicit deviation flags** -- if the specialist changes any v8 parameter, it must appear in the Decisions section with rationale, not silently in the specification.
3. **Require fully specified AskUserQuestion prompts** -- every interactive prompt must include the exact question text, option list, and input type (multiSelect, single-select, free-text).
4. **Pin the model in plan inputs** -- `model: sonnet` should be a plan-level parameter passed to the specialist, not a specialist decision.
5. **Add a "faithfulness check" stage** -- after Stage 2 produces the blueprint, a lightweight verification pass should compare key parameters against v8 reference values and flag divergences.
