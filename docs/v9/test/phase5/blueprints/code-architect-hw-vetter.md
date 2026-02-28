# Universal Blueprint Envelope: Hardware Vetter Claude Code Skill

**Blueprint ID:** code-architect-hw-vetter
**Specialist:** code-architect
**Producer:** code-writer
**Source Task:** Task 2 — Build the Hardware Vetter Claude Code Skill

---

## 1. Task Reference

**Task Number:** 2

**Acceptance Criteria:**
1. Skill accepts all four hardware change types: CPU upgrade, GPU addition, RAM change, and entire system replacement
2. Skill reads current hardware specs and model data from `docs/model_catalog.json` and `src/pipeline/config.py` without requiring manual data entry
3. For each registered and candidate model, the skill produces a fit/no-fit verdict on proposed hardware with VRAM/RAM resource estimates
4. Skill delivers a before/after comparison between current and proposed hardware showing performance impact per model
5. Skill identifies which candidate models (beyond the current 3 registered) become feasible on the proposed hardware
6. Output report includes an upgrade recommendation with clear rationale
7. When benchmark data is unavailable for a specific hardware + model combination, the skill estimates from specs and flags the result as "projected" rather than "verified"
8. Report is written to a timestamped markdown file in the project

**Dependencies:** Task 1 (Augment Model Catalog for Hardware Evaluation) — provides GPU VRAM fields in `docs/model_catalog.json`. CPU/RAM-only evaluation works without Task 1; GPU analysis requires it.

---

## 2. Research Findings

### Data Flow Pattern
Both tasks share `docs/model_catalog.json` as the central data artifact. Task 1 augments it with GPU fields; this skill reads the augmented catalog as input. The skill never writes back to the catalog — read-only access.

### Model-to-Catalog Mapping
The pipeline config (`src/pipeline/config.py`) stores Ollama model identifiers (e.g., `"llama3.1:8b"`). The model catalog uses kebab-case keys (e.g., `"llama3.1-8b"`) and includes an `ollama_id` field per model. The skill matches config model names to catalog entries by comparing against each model's `ollama_id` field.

### Backwards Compatibility
All schema changes to `model_catalog.json` are additive. No existing fields are modified or removed. The catalog's `schema_version` will be `"1.1"` after Task 1 augmentation.

### Confidence Labeling Convention
Throughout the skill and its reports, every quantitative data point carries a confidence label:
- **Verified**: Data sourced from a published benchmark with a cited URL.
- **Projected**: Estimated from hardware specifications and model requirements. Calculation basis noted.

### Report Output Convention
Reports go to `docs/reports/` (created if absent). File naming: `hardware_eval_YYYY-MM-DD_[2-4-word-slug].md`. Each evaluation creates a new file — never overwrite existing reports.

### Skill Convention
User's existing skill structure observed in `~/.claude/skills/` — YAML frontmatter with `name`, `description`, `model`, `tools` fields, followed by structured protocol sections with numbered steps. All personal skills use the `[name]/SKILL.md` directory pattern. This is the project's first skill and sets the pattern.

---

## 3. Approach

**Strategy:** Create a Claude Code skill as a directory-based package at `.claude/skills/hardware-vetter/SKILL.md` following the user's established skill convention. The skill file contains YAML frontmatter plus structured protocol instructions that guide Claude through: data loading, interactive hardware intake, spec-based feasibility analysis, benchmark web search, and report generation. All logic is embedded as natural language instructions — no code execution.

**Rationale:** Directory structure matches the user's existing skill convention (all personal skills use `[name]/SKILL.md`). This is the project's first skill and sets the pattern. Sonnet model balances capability (web search, multi-step analysis, report writing) with speed for iterative hardware evaluations.

---

## 4. Decisions Made

1. **Question flow adaptation (full system vs single component):** Unified flow with multi-select. "Full system" subsumes individual selections and asks all follow-ups sequentially. No separate paths needed.

2. **Comparison metrics priority:** Full performance matrix — feasibility tier, resource headroom, throughput, and concurrency — all with confidence labels. No metric prioritization; all are presented. The executive summary provides the high-level verdict.

3. **Visual distinction for verified vs projected:** Inline text labels "(Verified)" and "(Projected)" next to each data point in report tables. Methodology section provides aggregate breakdown (X of Y verified). No color coding — markdown doesn't support it reliably.

4. **File naming convention:** `docs/reports/hardware_eval_YYYY-MM-DD_[2-4-word-slug].md`. Slug derived from proposed change type. Design spec's convention adopted directly.

5. **Schema validation:** Skill validates that `model_catalog.json` exists and has `hardware_profile` and `models` keys. For GPU fields, graceful degradation: if missing, CPU-only analysis with notation. No strict schema enforcement — trust the data but handle gaps.

6. **Skill file structure:** Directory pattern `.claude/skills/hardware-vetter/SKILL.md` — matches user's established convention, sets project precedent.

7. **Skill model:** `model: sonnet` in frontmatter — balances reasoning capability with speed for iterative evaluations.

8. **How skill reads config.py:** Read tool parses the Python source file. Looks for field default values in the Settings class (e.g., `chat_model: str = "llama3.1:8b"`). Maps Ollama identifiers to catalog entries via `ollama_id` field matching.

---

## 5. Deliverable Specification

The deliverable is a single file: `.claude/skills/hardware-vetter/SKILL.md`. It consists of YAML frontmatter followed by 8 sections of structured natural language instructions. The complete specification for each section follows.

### 5.1 YAML Frontmatter

The file MUST begin with exactly this frontmatter block:

```yaml
---
name: hardware-vetter
description: Evaluate proposed hardware changes against the AI server's model lineup
model: sonnet
tools: Read, WebSearch, AskUserQuestion, Write, Glob
---
```

### 5.2 Section 1: Overview & Role

- One-line role statement: "You are a hardware evaluation specialist for the AI server."
- State the skill's purpose: evaluate hardware changes, produce a report with feasibility verdicts and upgrade recommendations.
- List what the skill DOES:
  - Loads current hardware specs and model requirements from project data
  - Asks the user about proposed hardware changes
  - Calculates feasibility for every model in the catalog
  - Searches for published benchmarks to validate estimates
  - Produces a timestamped report with verdicts and recommendations
- List what the skill does NOT do:
  - Does NOT run benchmarks or execute code
  - Does NOT make purchase decisions or recommend vendors
  - Does NOT modify project files (model catalog, config, or source code)
  - Does NOT compare pricing or cost-effectiveness
  - Does NOT evaluate software or driver compatibility

### 5.3 Section 2: Data Loading

**Catalog loading:**
- Instructions to read `docs/model_catalog.json` using the Read tool.
- Extract from catalog:
  - `hardware_profile` object -> current server specs (RAM, CPU model/cores/clock, GPU status)
  - `models` object -> all 11 models with their `hardware_requirements`, `ollama_id`, `display_name`, `parameter_count`, `feasibility`

**Config loading:**
- Instructions to read `src/pipeline/config.py` using the Read tool.
- Extract from config: default values of `chat_model`, `fast_model`, `default_model` fields (the Ollama model identifiers).
- Map registered models to catalog entries by matching config values against each model's `ollama_id` field.

**Validation gate:**
- If `model_catalog.json` is missing or unreadable -> stop with error message.
- If GPU fields (`gpu_vram_gb_q4`) are missing from model entries -> note the limitation and proceed with CPU-only analysis path.

### 5.4 Section 3: Question Flow

**Step 3a — Change type selection:**
- Use AskUserQuestion with `multiSelect: true`.
- Question: "What hardware changes are you evaluating?"
- Options: "CPU upgrade", "GPU addition", "RAM change", "Full system replacement"
- If "Full system replacement" is selected alongside individual components, treat as full system (subsumes individual selections).

**Step 3b — Per-component follow-ups** (ask sequentially for each selected type):

- **CPU**: Ask for: processor model/family (e.g., "Xeon Gold 6448Y"), core count, base/turbo clock speeds, architecture generation. Use a single AskUserQuestion with free-text option, since CPU specs vary widely.
- **GPU**: Ask for: GPU model, VRAM capacity in GB, and optionally PCIe generation. Provide common options: RTX 4060 Ti/16GB, RTX 4070/12GB, RTX 4080/16GB, RTX 4090/24GB, A4000/16GB, A5000/24GB, A6000/48GB, plus free-text for unlisted GPUs. Suggested input format: "GPU Model, VRAM in GB (e.g., RTX 4060 Ti, 16GB)".
- **RAM**: Ask for: new total RAM capacity in GB (not just the amount being added). Provide common options: 128GB, 192GB, 256GB, 384GB, 512GB, 768GB, 1024GB (1 TB), plus free-text. Optionally ask DDR generation/speed if user knows.
- **Full system**: Ask all of the above in sequence (CPU, then GPU if included, then RAM).

**Step 3c — Confirmation:**
- Present a summary of all proposed changes back to the user.
- Ask for confirmation via AskUserQuestion before proceeding to analysis.
- Format as a markdown table with columns: Component | Current | Proposed | Change. Example:
  ```
  | Component | Current | Proposed | Change |
  |-----------|---------|----------|--------|
  | GPU | None | RTX 4060 Ti 16GB | Addition |
  ```

### 5.5 Section 4: Analysis Methodology

#### Feasibility Calculation

For each model in the catalog, at the model's `recommended_quantization` level:

**CPU-only path** (when no GPU is proposed or GPU fields are missing):
- Resource usage = `ram_gb_q4` / `proposed_total_ram` (or equivalent for the quantization level)
- Headroom = `(proposed_total_ram - ram_gb_q4) / proposed_total_ram * 100`

**GPU path** (when GPU is proposed and GPU VRAM data exists):
- Resource usage = `gpu_vram_gb_q4` / `proposed_gpu_vram`
- Headroom = `(proposed_gpu_vram - gpu_vram_gb_q4) / proposed_gpu_vram * 100`
- If model exceeds GPU VRAM: check if partial offload is viable (model's `gpu_offload_support` != `"cpu_only_viable"` AND combined GPU VRAM + system RAM can hold the model)
- **Partial offload calculation**: When a model exceeds GPU VRAM but fits in combined GPU + system RAM:
  - VRAM spillover = `gpu_vram_gb_q4 - proposed_gpu_vram`
  - System RAM needed for spillover = VRAM spillover amount
  - Remaining system RAM = `proposed_total_ram - spillover`
  - Feasibility tier based on remaining system RAM headroom (apply same thresholds)
- **Loading strategy labels**: Assign each model one of these labels in analysis and report:
  - `Full GPU offload` — model fits entirely in GPU VRAM with >= 10% headroom
  - `Partial GPU offload` — model requires CPU RAM spillover but fits in combined resources
  - `CPU-only` — no GPU proposed, or model's `gpu_offload_support` is `"cpu_only_viable"`
  - `Does not fit` — model exceeds all available resources

**Tier assignment based on headroom:**
- `>= 40%` headroom -> `runs_comfortably`
- `10-39%` headroom -> `runs_constrained`
- `< 10%` headroom or exceeds total capacity -> `does_not_fit`

**Concurrent capacity:**
- `floor(available_resource / per_model_requirement)`, capped by CPU core availability (at least 2 cores per concurrent instance as a heuristic).

**Throughput estimate:**
- If no benchmark data, estimate relative throughput from clock speed ratio (proposed vs current) and core count ratio for CPU-bound inference.
- Use **base clock speeds** for comparison (turbo is inconsistent under sustained inference load): `relative_throughput = (proposed_base_clock / current_base_clock) * sqrt(proposed_cores / current_cores)`
- The geometric mean (sqrt) for core scaling accounts for diminishing returns in parallelism for single-request inference.
- **Worked example**: Current = 2.1 GHz base, 12 cores. Proposed = 3.0 GHz base, 24 cores. Throughput multiplier = (3.0/2.1) * sqrt(24/12) = 1.43 * 1.41 = ~2.02x improvement. Flag as "Projected."
- Flag all spec-based estimates as "Projected."

#### Before/After Comparison

For the 3 registered models ONLY:
- Current feasibility tier and headroom (from current `hardware_profile` vs model requirements)
- Proposed feasibility tier and headroom
- Delta in concurrent capacity
- Delta in estimated throughput

#### Candidate Expansion

For all non-registered models:
- Current feasibility tier vs proposed feasibility tier
- Highlight models that move from `does_not_fit` -> `runs_constrained` or `runs_comfortably`
- These are "newly feasible" models the upgrade enables

### 5.6 Section 5: Benchmark Search

For each model that is `runs_comfortably` or `runs_constrained` on proposed hardware:
- Construct primary search query: `"[model_display_name] [proposed_hardware_identifier] benchmark tokens per second Ollama"`
- If primary query returns no useful results, try alternative query: `"[model_display_name] [proposed_hardware_identifier] llama.cpp inference speed"`
- Run 1-2 WebSearch calls per model (prioritize registered models first, then top candidates by parameter count)
- Filter results for: matching model variant, similar hardware class, Ollama/llama.cpp runtime
- Extract: throughput (tok/s), concurrency data if available, source URL
- If benchmark found: mark data point as "Verified", cite URL
- If not found: keep spec-based estimate, mark as "Projected"

**Search cap:** Maximum 8 WebSearch calls per evaluation to avoid excessive latency. Prioritize registered models and models near the feasibility boundary.

### 5.7 Section 6: Report Template

**Output path:** `docs/reports/hardware_eval_YYYY-MM-DD_[slug].md`
- Create `docs/reports/` directory if it doesn't exist (use Write tool — writing the file to the path will create intermediate directories).
- Derive the slug from the proposed change (e.g., `rtx-4060-addition`, `ram-256gb-upgrade`, `full-system-replacement`).

**Report sections in exact order:**

```
# Hardware Evaluation: [Brief Description]
**Date:** YYYY-MM-DD
**Evaluated by:** Hardware Vetter Skill (automated analysis)

## Executive Summary
[3-5 sentences: upgrade verdict (recommended/not recommended/conditional),
 key rationale, biggest performance impact, notable new model possibilities]

## Proposed Changes
[Table: Component | Current | Proposed | Change]

## Feasibility Matrix
[Table: Model | Parameters | Quantization | Loading Strategy | Resource Usage | Headroom | Tier | Confidence]
[All 11 models, sorted by parameter count descending]
[Registered models marked with bold and asterisk (*)]
[Loading Strategy column: Full GPU offload / Partial GPU offload / CPU-only / Does not fit]

## Before/After Comparison (Registered Models)
[Table per registered model: Metric | Current | Proposed | Delta]
[Metrics: feasibility tier, headroom %, est. throughput, concurrent capacity]
[Each data point labeled Verified or Projected]

## Candidate Model Expansion
[List models that become newly feasible]
[For each: parameter count, use case strengths, feasibility tier on proposed hardware]
[If no new models become feasible, state that explicitly]

## Recommendation
[1-2 paragraphs: clear upgrade/no-upgrade verdict with primary justification]
[If conditional: state what conditions would change the recommendation]
[Reference specific models and metrics from the analysis above]

## Methodology & Confidence Notes
[Data sources: model catalog version, config file, benchmark URLs]
[Projected vs Verified breakdown: X of Y data points are verified]
[Known limitations: list any models without GPU data, benchmark search gaps]
[Feasibility threshold definitions for reader reference:]
  - runs_comfortably: >= 40% resource headroom
  - runs_constrained: 10-39% resource headroom
  - does_not_fit: < 10% headroom or exceeds total capacity
```

### 5.8 Section 7: Error Handling & Graceful Degradation

The skill MUST handle every error case below and MUST always produce a report. Never fail silently.

**CRITICAL:** Mark this section with a CRITICAL RULES header in the skill output. These are non-negotiable behaviors.

1. **Missing catalog**: If `model_catalog.json` is missing or unreadable -> stop with clear error message. Suggest running the project setup. This is the ONLY case where no report is produced.
2. **Missing GPU fields**: If GPU fields (`gpu_vram_gb_q4`) are missing from model entries -> proceed with CPU-only analysis path. Add note to report header: "GPU analysis unavailable — catalog needs GPU augmentation (run Task 1)." All GPU-dependent calculations skipped; loading strategy defaults to `CPU-only` for all models.
3. **Unreadable config**: If `config.py` is unreadable or model fields cannot be parsed -> fall back to analyzing all catalog models without distinguishing registered vs candidate. Omit Before/After Comparison section. Add note to report header explaining the limitation.
4. **No benchmark results**: If benchmark search returns no results for any model -> all throughput estimates remain "Projected." Methodology section documents that zero benchmarks were found and all performance estimates are spec-derived.
5. **Unrecognized hardware**: If user provides a hardware component that the skill cannot identify specs for -> ask user to provide key specs directly (VRAM for GPUs, core count and clock speed for CPUs). Do NOT guess specs for unknown hardware.
6. **User proposes a downgrade**: If proposed specs are lower than current specs in any dimension (fewer cores, less RAM, slower clock) -> proceed with analysis normally but flag the downgrade explicitly in the Executive Summary. Do NOT refuse to analyze downgrades.
7. **Partial offload complexity**: When a model requires partial GPU offload (VRAM spillover to system RAM) -> use conservative estimates for throughput (partial offload is typically slower than full offload by 30-50%). Flag all partial offload throughput estimates as "Projected — partial offload penalty estimated."
8. **Missing hardware_profile fields**: If `hardware_profile` is present but missing specific fields (e.g., no clock speeds, no core count) -> use available fields for analysis, skip calculations requiring missing data, and note gaps in Methodology section.

**Validation gates summary**: Before proceeding to analysis, confirm: (1) catalog loaded successfully, (2) at least one model entry found, (3) user confirmation received. If any gate fails, explain what's wrong and stop or degrade gracefully per the rules above.

### 5.9 Section 8: Completion

After writing the report, tell the user:
- The report file path
- A 2-3 sentence summary of the key finding (upgrade verdict + most impactful change)
- Suggest they review the full report for details

Do NOT ask follow-up questions after presenting results. The evaluation is complete. If the user wants to evaluate different hardware, they should invoke the skill again.

---

## 6. Acceptance Mapping

| AC # | Acceptance Criterion | Deliverable Section(s) |
|------|---------------------|----------------------|
| 1 | Accepts all four hardware change types | Section 3 (Question Flow) — Step 3a offers all four options via multi-select; Step 3b has per-component follow-ups for each type; "Full system" subsumes individual selections |
| 2 | Reads current specs from model_catalog.json and config.py without manual data entry | Section 2 (Data Loading) — explicit Read tool instructions for both files, extraction of hardware_profile, models, and config model fields |
| 3 | Produces fit/no-fit verdict per model with resource estimates | Section 4 (Analysis Methodology) — feasibility calculation with resource usage and headroom formulas, tier assignment thresholds (runs_comfortably / runs_constrained / does_not_fit) |
| 4 | Before/after comparison showing performance impact | Section 4 (Before/After Comparison) — current vs proposed feasibility tier, headroom, concurrent capacity, throughput delta for 3 registered models; Section 6 report template "Before/After Comparison (Registered Models)" table |
| 5 | Identifies newly feasible candidate models | Section 4 (Candidate Expansion) — highlights models moving from does_not_fit to runs_constrained or runs_comfortably; Section 6 report template "Candidate Model Expansion" section |
| 6 | Upgrade recommendation with clear rationale | Section 6 report template "Executive Summary" — 3-5 sentences with verdict (recommended/not recommended/conditional) and key rationale |
| 7 | Spec-based estimates flagged as "projected" when benchmarks unavailable | Section 5 (Benchmark Search) — Verified vs Projected labeling; Section 4 throughput estimate flagged as Projected; Section 6 "Methodology & Confidence Notes" with aggregate breakdown |
| 8 | Timestamped markdown file output | Section 6 (Report Template) — output path `docs/reports/hardware_eval_YYYY-MM-DD_[slug].md`, creates directory if absent, never overwrites existing reports |

---

## 7. Integration Points

### Task 1 Dependency
- Task 1 adds `gpu_vram_gb_q4`, `gpu_vram_gb_q8`, and `gpu_offload_support` fields to each model's `hardware_requirements` in `docs/model_catalog.json`.
- Task 1 also adds `cpu_clock_ghz_base`, `cpu_clock_ghz_turbo`, `cpu_architecture`, and `storage_type` to the `hardware_profile` section.
- Task 1 bumps `schema_version` from `"1.0"` to `"1.1"`.
- **Graceful degradation:** If Task 1 is incomplete (GPU fields missing), this skill proceeds with CPU-only analysis and notes the limitation. The dependency is soft for CPU/RAM evaluations, hard for GPU evaluations.

### model_catalog.json
- Read-only access. Skill never writes to the catalog.
- Expected keys: `hardware_profile` (server specs), `models` (11 models with `hardware_requirements`, `ollama_id`, `display_name`, `parameter_count`, `feasibility`).
- GPU fields per model: `gpu_vram_gb_q4`, `gpu_vram_gb_q8`, `gpu_offload_support` (added by Task 1).

### config.py
- Read-only access via Read tool. Parses Python source text.
- Looks for field default values in the Settings class: `chat_model`, `fast_model`, `default_model` (Ollama model identifiers like `"llama3.1:8b"`).
- Maps config model identifiers to catalog entries via `ollama_id` field matching.

---

## 8. Open Items

### Requires User Input
- **Storage type**: The `hardware_profile.storage_type` field in the catalog needs the actual storage type of the aos-ai-beta server (SSD, HDD, NVMe). The build agent will need this from the user or server documentation during Task 1. (This is a Task 1 input — not directly blocking this task, but affects the data this skill reads.)

### Risk Notes

1. **GPU VRAM data accuracy** (inherited from Task 1): Published VRAM requirements vary by source and don't always account for Ollama runtime overhead. Mitigation: the skill's feasibility thresholds use a 40% headroom buffer for "runs_comfortably," which absorbs typical overhead discrepancies. Values should represent model weights only.

2. **Benchmark search quality**: Web searches may return irrelevant, dated, or conflicting results. Mitigation: spec-based analysis is the baseline (always runs); benchmarks are validation layer. Cap at 8 WebSearch calls per evaluation to bound latency. All benchmark sources cited for user verification.

3. **Partial offload complexity**: GPU + CPU split inference is harder to estimate accurately than pure GPU or pure CPU. Mitigation: the skill identifies when partial offload is needed but uses conservative estimates. Flagged as "Projected" unless a matching benchmark is found.

4. **Skill instruction length**: The skill needs comprehensive instructions to handle all edge cases reliably. Sonnet should handle long instruction following well, but the file will be substantial (~300-400 lines of markdown). The instructions should be organized with clear section headers and numbered steps so the model can follow sequentially.

5. **First project skill**: No project-level precedent to follow. The directory structure and frontmatter format are based on the user's personal skills. If Claude Code's project-level skill handling differs from user-level, this may need adjustment. Low risk — the system is designed to work consistently.

---

## 9. Producer Handoff

**Producer:** code-writer
**Output format:** Markdown (SKILL.md)
**Output filename:** `.claude/skills/hardware-vetter/SKILL.md`

**Content blocks in section order:**

1. **YAML Frontmatter** — Exact block specified in Section 5.1
2. **Overview & Role** — Role statement, purpose, exclusions per Section 5.2
3. **Data Loading** — Catalog read, config read, field extraction, model mapping, validation gate per Section 5.3
4. **Question Flow** — Multi-select change type, per-component follow-ups (CPU/GPU/RAM/Full system), confirmation step per Section 5.4
5. **Analysis Methodology** — Feasibility formulas (CPU-only and GPU paths), tier thresholds, concurrent capacity, throughput estimate, before/after comparison, candidate expansion per Section 5.5
6. **Benchmark Search** — Query construction, search execution, result filtering, Verified/Projected labeling, 8-search cap per Section 5.6
7. **Report Template** — Output path with slug derivation, directory creation, exact report section structure per Section 5.7
8. **Error Handling & Graceful Degradation** — All 8 error cases with fallback behaviors, validation gates summary per Section 5.8
9. **Completion** — Post-report user communication per Section 5.9

**Instruction to producer:** Write the SKILL.md file implementing all 8 skill sections (plus frontmatter) as specified. Each section of the deliverable specification maps to a section in the output file. The instructions in the SKILL.md must be imperative directives to Claude (second person: "You MUST..."), not user-facing documentation. Organize with clear section headers and numbered steps for reliable sequential execution by the Sonnet model. Use CRITICAL RULES callout blocks for non-negotiable behaviors. Include the worked throughput example in the analysis section. The skill should be comprehensive (~600-700 lines) — do not compress for brevity at the expense of clarity.
