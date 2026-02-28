# Code Architect Stage 1: Hardware Vetter Skill — Research Findings

**Task:** Task 2 — Build the Hardware Vetter Claude Code Skill
**Date:** 2026-02-27
**Status:** Research complete, ready for Stage 2 code spec authoring

---

## Codebase Research Summary

### Files Read

| File | Path | Key Data |
|------|------|----------|
| Model Catalog | `C:/Projects/District_AI_Agent_Implementation/docs/model_catalog.json` | 1003 lines, schema v1.2, 11 models, hardware_profile, infrastructure_options |
| Pipeline Config | `C:/Projects/District_AI_Agent_Implementation/src/pipeline/config.py` | Pydantic Settings class, 3 registered Ollama model IDs |
| Existing Skill Stub | `C:/Projects/District_AI_Agent_Implementation/.claude/skills/hardware-vetter/SKILL.md` | 708 lines — fully written skill already exists |
| Existing Report | `C:/Projects/District_AI_Agent_Implementation/docs/reports/hardware_eval_2026-02-20_thinkstation-pgx-addition.md` | Prior evaluation output — demonstrates report format in practice |
| Project Settings | `C:/Projects/District_AI_Agent_Implementation/.claude/settings.local.json` | Permissions config, tool allowlist |
| Intuition Skill Pattern | `C:/Projects/Intuition/skills/intuition-start/SKILL.md` | Frontmatter format reference |

---

## CRITICAL FINDING: Skill Already Exists

The file `C:/Projects/District_AI_Agent_Implementation/.claude/skills/hardware-vetter/SKILL.md` is **already a complete, 708-line skill implementation**. It is not a stub. It contains:

- Full YAML frontmatter (`name: hardware-vetter`, `model: sonnet`, `tools: Read, WebSearch, AskUserQuestion, Write, Glob`)
- 8 numbered sections covering the entire workflow
- Detailed data loading with exact field names from the catalog
- Question flow with AskUserQuestion for all 4 change types
- Complete analysis methodology for GPU-primary and CPU-only paths
- Benchmark search protocol with 8-call cap
- Full report template with all required sections
- 7 error handling scenarios with graceful degradation
- Completion message format

**This means Task 2's primary deliverable already exists.** The engineering work should focus on review, verification against acceptance criteria, and any gaps — not building from scratch.

---

## ECD Exploration

### Elements (E) — Building Blocks

#### E1: Skill File Structure

**Single file:** `C:/Projects/District_AI_Agent_Implementation/.claude/skills/hardware-vetter/SKILL.md`

**Frontmatter (YAML):**
```yaml
---
name: hardware-vetter
description: Evaluate proposed hardware changes against the AI server's model lineup
model: sonnet
tools: Read, WebSearch, AskUserQuestion, Write, Glob
---
```

No additional files in the skill directory — everything is in SKILL.md per the Intuition project's "Reference File Problem" rule (only SKILL.md is injected into context).

#### E2: Data Structures — Model Catalog (`docs/model_catalog.json`)

**Schema version:** `1.2`

**Top-level keys:**
- `schema_version` (string): "1.2"
- `generated_at` (string, ISO 8601)
- `description` (string)
- `task_categories` (array of 5 strings): `reasoning_analysis`, `code_generation`, `instruction_following_tool_use`, `conversational_quality`, `summarization`
- `benchmarks` (object): 7 benchmark definitions with `full_name`, `scale`, `higher_is_better`, optional `normalization`
- `normalization_method` (string)
- `hardware_profile` (object) — current server specs
- `infrastructure_options` (object) — evaluated PGX configs
- `recommended_models` (array of 11 strings) — model keys in recommendation order
- `models` (object) — 11 model entries keyed by slug

**`hardware_profile` exact fields:**
```json
{
  "server_name": "aos-ai-beta",
  "ram_gb": 192,
  "cpu_model": "2x Intel Xeon E5-2620 v4",
  "cpu_cores": 32,
  "cpu_clock_ghz_base": 2.1,
  "cpu_clock_ghz_turbo": 2.5,
  "cpu_architecture": "Broadwell",
  "storage_type": "NVMe",
  "storage_gb": "TBD",
  "gpu": "none",
  "notes": "CPU-only inference, no GPU available. 32 threads total (16 per socket)."
}
```

Note: The skill references `total_ram_gb` in section 2.1 but the actual catalog field is `ram_gb`. This is a **field name mismatch** that should be flagged.

**Per-model `hardware_requirements` exact fields (all 11 models have these):**
```json
{
  "ram_gb_q4": <number>,
  "ram_gb_q8": <number>,
  "ram_gb_fp16": <number>,
  "recommended_ram_gb": <number>,
  "recommended_quantization": "q4_K_M",
  "gpu_vram_gb_q4": <number>,
  "gpu_vram_gb_q8": <number>,
  "gpu_offload_support": "<string>"
}
```

**GPU fields are ALREADY PRESENT in all 11 models.** The task dependency note says "CPU/RAM-only evaluation works without it" and Task 1 "adds GPU VRAM fields," but the catalog already contains `gpu_vram_gb_q4`, `gpu_vram_gb_q8`, and `gpu_offload_support` for every model. Either Task 1 was already completed, or these fields were added during initial catalog creation.

**`gpu_offload_support` values observed:**
- `"cpu_only_viable"` — tinyllama-1.1b (too small for GPU to help)
- `"full_offload"` — llama3.2-1b, llama3.2-3b, phi3-3.8b, qwen2.5-7b, mistral-7b, gemma2-9b, qwen2.5-14b, llama3.1-8b
- `"partial_offload"` — mixtral-8x22b (141B), llama3.3-70b (70B)

**Per-model `feasibility` values observed:**
- `"runs_comfortably"` — ALL 11 models (on the current 192 GB RAM server for CPU inference)

**Other per-model fields used by the skill:**
- `display_name` (string)
- `ollama_id` (string) — used for matching to config.py
- `parameter_count` (string, e.g., "7B", "14.7B", "141B")
- `size_tier` (string): "small", "medium", "large", "xlarge"
- `default_quantization` (string) — same as `recommended_quantization` in `hardware_requirements`
- `strengths` (array of strings)
- `weaknesses` (array of strings)
- `raw_benchmarks` (object) — per-benchmark scores
- `category_scores` (object) — per-category normalized scores

#### E3: Data Structures — Pipeline Config (`src/pipeline/config.py`)

**Registered model identifiers (exact lines from file):**
```python
default_model: str = "qwen2.5:14b"
fast_model: str = "qwen2.5:7b"
chat_model: str = "llama3.1:8b"
```

**Mapping to catalog entries:**
| Config Field | Ollama ID | Catalog Key | Display Name |
|-------------|-----------|-------------|--------------|
| `default_model` | `qwen2.5:14b` | `qwen2.5-14b` | Qwen 2.5 14B |
| `fast_model` | `qwen2.5:7b` | `qwen2.5-7b` | Qwen 2.5 7B |
| `chat_model` | `llama3.1:8b` | `llama3.1-8b` | Llama 3.1 8B |

**Important:** The Ollama IDs in config.py use colon format (`qwen2.5:14b`) while catalog keys use hyphen format (`qwen2.5-14b`) and the catalog's `ollama_id` field uses colon format (`qwen2.5:14b`). The skill correctly instructs matching via the `ollama_id` field.

#### E4: Report Output Structure

**Output directory:** `C:/Projects/District_AI_Agent_Implementation/docs/reports/`
**Naming convention:** `hardware_eval_YYYY-MM-DD_[slug].md`
**Existing report:** `hardware_eval_2026-02-20_thinkstation-pgx-addition.md`

#### E5: Model Count

The catalog contains exactly **11 models:**
1. tinyllama-1.1b (1.1B)
2. llama3.2-1b (1B)
3. llama3.2-3b (3B)
4. phi3-3.8b (3.8B)
5. qwen2.5-7b (7B) — **registered** as `fast_model`
6. mistral-7b (7B)
7. gemma2-9b (9B)
8. llama3.1-8b (8B) — **registered** as `chat_model`
9. qwen2.5-14b (14.7B) — **registered** as `default_model`
10. llama3.3-70b (70B)
11. mixtral-8x22b (141B)

3 registered, 8 candidates.

---

### Connections (C) — How Components Relate

#### C1: Data Flow

```
model_catalog.json ──Read──→ Skill extracts hardware_profile + 11 model entries
config.py ──Read──→ Skill extracts 3 registered Ollama IDs
                         ↓
                    Match Ollama IDs to catalog entries
                         ↓
                    AskUserQuestion → collect proposed hardware
                         ↓
                    Analysis engine (GPU-primary or CPU-only path)
                         ↓
                    WebSearch → benchmark lookup (up to 8 calls)
                         ↓
                    Write → docs/reports/hardware_eval_YYYY-MM-DD_[slug].md
```

#### C2: Field Reference Chain

The skill references catalog fields at these specific points:
- **Section 2.1:** `hardware_profile.total_ram_gb` → [MISMATCH] actual field is `hardware_profile.ram_gb`
- **Section 2.1:** `hardware_profile.cpu_model`, `cpu_cores`, `cpu_clock_ghz_base`, `cpu_clock_ghz_turbo`, `cpu_architecture`, `gpu`, `storage_type`
- **Section 2.2:** `models[*].ollama_id` → matched against config.py values
- **Section 4.2a:** `models[*].hardware_requirements.recommended_quantization`, `gpu_vram_gb_q4`, `gpu_vram_gb_q8`, `ram_gb_q4`
- **Section 4.2b:** `gpu_offload_support` checked for partial offload viability
- **Section 4.3a:** `models[*].hardware_requirements.ram_gb_q4`, `ram_gb_q8`, `ram_gb_fp16`
- **Section 4.4:** `models[*].feasibility` for current tier
- **Section 4.5:** `models[*].feasibility` for expansion analysis
- **Section 6.2:** `schema_version` for report metadata

#### C3: Skill ←→ Project Relationship

The skill is a Claude Code skill registered in `C:/Projects/District_AI_Agent_Implementation/.claude/skills/hardware-vetter/`. It runs within the District AI Agent Implementation project context. It reads project files and writes reports within that project's `docs/reports/` directory.

#### C4: Tool Dependencies

| Tool | Usage | Critical? |
|------|-------|-----------|
| `Read` | Load model_catalog.json and config.py | Yes — skill cannot function without |
| `AskUserQuestion` | Collect hardware change details from user | Yes — interactive skill |
| `WebSearch` | Find published benchmarks | No — degrades to "Projected" estimates |
| `Write` | Output the report | Yes — primary deliverable |
| `Glob` | Listed in frontmatter but not used in skill body | No — [VERIFY] may be unused |

#### C5: infrastructure_options Section

The catalog contains a detailed `infrastructure_options` section (lines 64-192) with specific ThinkStation PGX configurations and verified throughput data. The current skill **does not explicitly reference** this section. The existing report (`hardware_eval_2026-02-20_thinkstation-pgx-addition.md`) used this data extensively. This means:
- For PGX-related evaluations, the `verified_throughput_per_unit` data could be used instead of WebSearch
- The skill's benchmark search could be enhanced to check the catalog's own throughput data first
- This is a potential improvement but not a gap — the skill works without it

---

### Dynamics (D) — Execution Flow & Edge Cases

#### D1: Step-by-Step Execution Flow

1. **Data Loading** (Steps 2.1, 2.2)
   - Read `docs/model_catalog.json` → extract `hardware_profile` + all 11 models
   - Read `src/pipeline/config.py` → extract 3 registered Ollama IDs
   - Match IDs to catalog → classify 3 registered + 8 candidate
   - Validation gates: catalog must exist, hardware_profile must be present

2. **Question Flow** (Steps 3.1-3.3)
   - AskUserQuestion (multiSelect) → change type: CPU/GPU/RAM/Full system
   - Sequential component follow-ups based on selection
   - Confirmation table → user approves or revises

3. **Analysis** (Steps 4.1-4.5)
   - Determine path: GPU-primary (if GPU proposed + GPU fields exist) or CPU-only
   - For each of 11 models: calculate feasibility tier, resource usage, headroom, concurrent capacity
   - Before/After comparison for 3 registered models
   - Candidate expansion analysis for 8 non-registered models

4. **Benchmark Search** (Steps 5.1-5.4)
   - Prioritize: registered models first, then candidates by parameter count
   - Up to 8 WebSearch calls
   - Upgrade estimates from "Projected" to "Verified" when match found

5. **Report Writing** (Steps 6.1-6.3)
   - Construct filename with date + slug
   - Write full report to `docs/reports/`

6. **Completion** (Step 8)
   - Display summary message with report path and key findings

#### D2: Error/Edge Cases Handled in Skill

The skill already handles 7 error scenarios:
1. **Model catalog missing** → STOP with error
2. **GPU fields missing from catalog** → CPU-only analysis path + header note
3. **Config file unreadable** → All 11 models as candidates
4. **Benchmark search returns nothing** → "Projected" estimates
5. **Unrecognized hardware** → Ask user for specs directly
6. **User proposes downgrade** → Analyze without judgment, flag in recommendation
7. **Partial offload complexity** → Conservative estimates, always "runs_constrained"

#### D3: Edge Cases NOT Handled

1. **Unified memory architectures** (like the PGX/DGX Spark) — the existing report (`hardware_eval_2026-02-20_thinkstation-pgx-addition.md`) handled this by adding a framing note about unified memory, but the skill's analysis methodology assumes discrete GPU VRAM separate from system RAM. The skill does not have instructions for handling `memory_type: "LPDDR5x unified"` or similar.

2. **Multi-GPU configurations** — the skill asks for "a GPU" (singular). No path for multi-GPU setups, tensor parallelism, or NVLink configurations. The existing report's infrastructure_options section has detailed multi-unit configs, but the skill cannot evaluate these.

3. **Adding a new dedicated node vs upgrading existing** — the existing report evaluated a ThinkStation PGX as an **additive node**, not a replacement. The skill's question flow only covers upgrades to the existing server, not "add a separate inference machine."

4. **Model not in catalog** — the skill only evaluates the 11 models in the catalog. If the user wants to evaluate a model not in the catalog, there's no path for that.

5. **Concurrent model loading** — the feasibility analysis evaluates models individually. It doesn't analyze the memory impact of loading multiple models simultaneously (which is the real-world scenario for the Ollama server).

6. **`gpu_vram_gb_fp16` field** — the skill references this in Step 4.2a but it does not exist in the catalog. Only `ram_gb_fp16` exists. For FP16 GPU inference, the skill would need to use `ram_gb_fp16` as a proxy or note the gap.

#### D4: Graceful Degradation Path

```
Full analysis (GPU + CPU + benchmarks)
    ↓ GPU fields missing
CPU-only analysis + benchmarks
    ↓ Benchmarks return nothing
CPU-only analysis with projected estimates
    ↓ Config.py unreadable
All 11 models as candidates, projected estimates
    ↓ Model catalog missing
STOP — cannot proceed
```

---

## Engineering Questions — Answers

### Q1: How should the skill's question flow adapt when the user specifies an entire system replacement vs a single component upgrade?

**Answer from codebase research:** The existing skill (Section 3.1) handles this with clear branching logic:
- "Full system replacement" selected → ask ALL component follow-ups (CPU, GPU, RAM) sequentially
- Multiple individual components → ask follow-ups for each selected component in order: CPU, GPU, RAM
- Single component → ask only that component's follow-up

The question flow does NOT change structurally — it just includes/excludes component follow-up blocks based on selection. This is simple and correct.

**One gap:** For full system replacement, the user might want to specify a complete pre-built system (e.g., "Dell PowerEdge R760xa with dual A6000 GPUs") rather than specifying each component separately. The current flow forces component-by-component entry even for known systems. Consider adding a "known system" shortcut path.

### Q2: What comparison metrics should the before/after analysis prioritize?

**Answer from codebase research:** The existing skill (Section 4.4) defines 4 metrics:
1. **Feasibility tier** — most important (determines if model can run at all)
2. **Resource headroom %** — capacity margin
3. **Estimated throughput (tok/s)** — user-visible performance
4. **Concurrent capacity** — multi-user scaling

The existing report demonstrates these work well in practice. Throughput is the most user-visible metric. The prioritization order should be: feasibility tier first (binary gate), then throughput (user experience), then concurrent capacity (scaling), then headroom (engineering margin).

### Q3: How should the report visually distinguish "verified" benchmark data from "projected" spec-based estimates?

**Answer from codebase research:** The existing skill uses two mechanisms:
1. A `Confidence` column in the feasibility matrix with values "Verified" or "Projected"
2. **Bold** formatting on verified throughput values in the feasibility matrix (seen in the existing report: `**38 tok/s**` for verified vs `~50 tok/s` for projected)

The existing report also uses the `**Verified**` / `Projected` labels in per-model comparison tables. This approach works well and is already consistent across the skill.

### Q4: What file naming convention and output directory should reports use?

**Answer from codebase research:** Already specified in the skill (Section 6.1):
- **Directory:** `docs/reports/`
- **Format:** `hardware_eval_YYYY-MM-DD_[slug].md`
- **Slug derivation rules:**
  - GPU addition: `[gpu-model]-addition`
  - RAM upgrade: `ram-[capacity]gb-upgrade`
  - CPU upgrade: `cpu-[family-shorthand]-upgrade`
  - Full system: `full-system-[key-identifier]`
  - Multiple components: combine key elements
- **Existing precedent:** `hardware_eval_2026-02-20_thinkstation-pgx-addition.md`

This convention is good. No changes needed.

### Q5: Should the skill validate the schema before proceeding, or trust the data?

**Answer from codebase research:** The existing skill uses a **lightweight validation** approach (Section 2.1 "Validation gates"):
- Checks if `model_catalog.json` exists and is readable
- Checks if `hardware_profile` section is present
- Checks if GPU fields exist (degrades gracefully if not)
- Does NOT validate schema version, field types, or data integrity

This is the right approach for a Claude Code skill. Full JSON schema validation would require code execution (not available). The skill reads data and gracefully degrades when fields are missing. Adding `schema_version` checking would be low-value — if the schema changes significantly, the skill's field references will naturally fail and the error handling will catch it.

---

## Acceptance Criteria Verification

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Accepts all four hardware change types | MET | Section 3.1: CPU upgrade, GPU addition, RAM change, Full system replacement via multiSelect |
| 2 | Reads current hardware specs and model data from catalog + config.py | MET | Section 2.1 reads model_catalog.json, Section 2.2 reads config.py. One field name mismatch: `total_ram_gb` vs actual `ram_gb` |
| 3 | Fit/no-fit verdict per model with VRAM/RAM estimates | MET | Section 4.2/4.3: 3-tier feasibility with resource usage % and headroom % |
| 4 | Before/after comparison for registered models | MET | Section 4.4: 4-metric comparison table per registered model |
| 5 | Identifies candidate models that become feasible | MET | Section 4.5: explicit expansion analysis |
| 6 | Upgrade recommendation with rationale | MET | Section 6.2 report template: Executive Summary + Recommendation section |
| 7 | Projected vs Verified labeling | MET | "Projected" default, "Verified" when benchmark matches (Section 5.3) |
| 8 | Timestamped markdown report | MET | Section 6.1: `hardware_eval_YYYY-MM-DD_[slug].md` in `docs/reports/` |

---

## Issues Found

### Issue 1: Field Name Mismatch (Minor)

**Location:** SKILL.md Section 2.1
**Problem:** References `hardware_profile.total_ram_gb` but the actual catalog field is `hardware_profile.ram_gb`
**Impact:** Claude (sonnet) may adapt at runtime since it reads the actual JSON, but the instruction is technically wrong. Could cause confusion if Claude follows the instruction literally and looks for a field that doesn't exist.
**Fix:** Change `total_ram_gb` to `ram_gb` in Section 2.1.

### Issue 2: `gpu_vram_gb_fp16` Reference (Minor)

**Location:** SKILL.md Section 4.2a
**Problem:** References `gpu_vram_gb_fp16` as a possible field, but this field does not exist in any model's `hardware_requirements`. Only `ram_gb_fp16` exists for FP16.
**Impact:** Low — no model uses FP16 as `recommended_quantization`, so this code path would never trigger. But it's technically incorrect.
**Fix:** Remove the FP16 case from GPU path, or note that FP16 GPU inference uses `ram_gb_fp16` as the VRAM estimate.

### Issue 3: `Glob` Tool Listed but Unused (Trivial)

**Location:** SKILL.md frontmatter
**Problem:** `Glob` is listed in the tools but never referenced in the skill body.
**Impact:** No functional impact — just a slightly larger tool surface than needed.
**Fix:** Remove `Glob` from tools list, or add a use case (e.g., checking if `docs/reports/` directory exists before writing).

### Issue 4: No Handling of Unified Memory Architectures

**Location:** Section 4.2 (GPU-Primary Analysis Path)
**Problem:** The analysis assumes discrete GPU with separate VRAM and system RAM. Systems like the NVIDIA DGX Spark/ThinkStation PGX use unified memory where there is no VRAM/RAM distinction. The existing report handled this with manual framing notes, but the skill has no built-in logic for it.
**Impact:** The skill will produce incorrect analysis for unified memory systems — it would compare model's `gpu_vram_gb_q4` against the unified memory pool when it should compare `ram_gb_q4` (since all memory is GPU-accessible).
**Fix:** Add a sub-path in Section 4.2 for unified memory architectures. When the user specifies a unified memory system, use total unified memory as the GPU capacity and skip partial offload calculations entirely.

### Issue 5: No Multi-Model Concurrent Loading Analysis

**Location:** Sections 4.2-4.3
**Problem:** Each model is evaluated independently. The real-world scenario involves loading multiple models simultaneously (the server runs 3 registered models concurrently). The skill never calculates "can all 3 registered models fit in memory at the same time?"
**Impact:** Medium — a configuration could show all models as `runs_comfortably` individually but not actually fit all registered models simultaneously.
**Fix:** Add a "concurrent loading check" subsection that sums the RAM/VRAM requirements of the 3 registered models and checks against total capacity.

---

## Recommendations for Code Spec

Given that the skill already exists and is comprehensive, the code spec should focus on:

1. **Fix the `ram_gb` field name mismatch** (Issue 1)
2. **Fix the `gpu_vram_gb_fp16` reference** (Issue 2)
3. **[OPTIONAL] Add unified memory architecture handling** (Issue 4) — only if this is considered in-scope
4. **[OPTIONAL] Add concurrent model loading check** (Issue 5) — high value, moderate complexity
5. **Verify the skill works end-to-end** by mentally tracing through the execution with a sample scenario (e.g., "RTX 4090 addition" or "RAM upgrade to 256 GB")
6. **No new files need to be created** — the skill is a single SKILL.md file

The existing skill is production-quality. The main risk is not missing functionality but the minor data field mismatches that could cause runtime confusion for the sonnet model executing the skill.
