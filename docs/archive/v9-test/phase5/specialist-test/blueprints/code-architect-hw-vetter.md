# Blueprint: Hardware Vetter Claude Code Skill

**Specialist:** Code Architect
**Task:** Task 2 — Build the Hardware Vetter Claude Code Skill
**Date:** 2026-02-27
**Status:** Complete — Ready for Producer

---

## 1. Task Reference

**Plan Task:** Task 2 — Build the Hardware Vetter Claude Code Skill

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

### Model Catalog (`docs/model_catalog.json`)

- 1003 lines, schema v1.2, 11 models total
- Top-level structure: `{ "schema_version", "hardware_profile", "infrastructure_options", "models": { ... } }`
- `hardware_profile` fields (exact):
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
- Per-model `hardware_requirements` fields (exact):
  ```json
  {
    "ram_gb_q4": number,
    "ram_gb_q8": number,
    "ram_gb_fp16": number,
    "recommended_ram_gb": number,
    "recommended_quantization": "q4_K_M",
    "gpu_vram_gb_q4": number,
    "gpu_vram_gb_q8": number,
    "gpu_offload_support": "cpu_only_viable|full_offload|partial_offload"
  }
  ```
- Per-model other key fields: `display_name`, `ollama_id`, `parameter_count`, `size_tier`, `default_quantization`, `strengths`, `weaknesses`, `raw_benchmarks`, `category_scores`, `feasibility`
- **Field warning:** `gpu_vram_gb_fp16` does NOT exist in the catalog — never reference it
- **Field warning:** The RAM field is `ram_gb` (not `total_ram_gb`)

### Pipeline Config (`src/pipeline/config.py`)

- Pydantic Settings class with 3 registered model IDs:
  - `default_model: str = "qwen2.5:14b"` → catalog key `qwen2.5-14b`
  - `fast_model: str = "qwen2.5:7b"` → catalog key `qwen2.5-7b`
  - `chat_model: str = "llama3.1:8b"` → catalog key `llama3.1-8b`
- Ollama ID format: config uses colon (`qwen2.5:14b`), catalog keys use hyphen (`qwen2.5-14b`), catalog `ollama_id` field uses colon. Match via `ollama_id` field.

### All 11 Catalog Models

| Key | Display Name | Parameters | Registered |
|-----|-------------|-----------|------------|
| tinyllama-1.1b | TinyLlama 1.1B | 1.1B | No |
| llama3.2-1b | Llama 3.2 1B | 1B | No |
| llama3.2-3b | Llama 3.2 3B | 3B | No |
| phi3-3.8b | Phi-3 3.8B | 3.8B | No |
| qwen2.5-7b | Qwen 2.5 7B | 7B | Yes (fast_model) |
| mistral-7b | Mistral 7B | 7B | No |
| gemma2-9b | Gemma 2 9B | 9B | No |
| llama3.1-8b | Llama 3.1 8B | 8B | Yes (chat_model) |
| qwen2.5-14b | Qwen 2.5 14B | 14.7B | Yes (default_model) |
| llama3.3-70b | Llama 3.3 70B | 70B | No |
| mixtral-8x22b | Mixtral 8x22B | 141B | No |

### Report Output Convention

- Path: `docs/reports/hardware_eval_YYYY-MM-DD_[slug].md`
- Slug derived from change type (see Section 5 for exact rules)

---

## 3. Approach

Build a single-file Claude Code skill (`SKILL.md`) that:

1. **Loads data automatically** — reads `docs/model_catalog.json` and `src/pipeline/config.py` to extract current hardware specs, all model definitions, and registered model IDs, with no manual data entry from the user.
2. **Runs an interactive question flow** — uses `AskUserQuestion` to collect the proposed hardware change through a unified question sequence that handles all 4 change types (CPU upgrade, GPU addition, RAM change, full system replacement).
3. **Analyzes every model** — evaluates all 11 catalog models against both current and proposed hardware, computing feasibility tiers, resource headroom, throughput estimates, and concurrent capacity.
4. **Separates verified from projected** — uses catalog benchmark data when available (Verified), falls back to parameter-based estimation formulas when not (Projected), with clear inline labeling.
5. **Generates a structured markdown report** — writes a before/after comparison report with executive summary, per-model analysis tables, newly feasible model identification, and upgrade recommendation to `docs/reports/`.
6. **Degrades gracefully** — handles missing GPU fields (CPU-only path), missing benchmarks (Projected estimates), and unreadable config (all models treated as candidates).

---

## 4. Decisions Made

| # | Decision | Alternatives Considered | Choice & Rationale |
|---|----------|------------------------|---------------------|
| 1 | Blueprint scope | Patch existing skill vs. full rewrite | **Full rewrite from scratch** — user decision. Spec all 8 sections completely without referencing existing skill. |
| 2 | Question flow architecture | Separate flows per change type vs. unified flow | **Unified flow** — "Full system" subsumes individual selections. All change types ask the same base questions, with component-specific follow-ups appearing sequentially as needed. Simpler logic, less branching. |
| 3 | Comparison metrics | Subset of metrics vs. all 4 | **All 4 metrics** — feasibility tier, headroom percentage, throughput estimate, concurrent capacity. Executive summary provides high-level verdict. |
| 4 | Verified vs. Projected distinction | Color coding, separate tables, inline labels | **Inline labels** — "(Verified)" / "(Projected)" next to each data point. Methodology section has aggregate breakdown. Markdown has no color support. |
| 5 | Schema validation depth | Strict JSON Schema vs. lightweight existence checks | **Lightweight** — check existence of `hardware_profile`, `models` keys. Degrade gracefully for missing GPU fields. No strict schema enforcement. |
| 6 | Concurrent model loading | In scope vs. out of scope | **Out of scope** — not included in this blueprint. |
| 7 | Unified memory handling | In scope vs. out of scope | **Out of scope** — not included in this blueprint. |
| 8 | Glob tool usage | Include vs. exclude | **Exclude** — all file paths are known. No glob needed. |
| 9 | WebSearch for benchmarks | Required vs. degradable | **Degradable** — attempt WebSearch for benchmark data on proposed hardware. If unavailable or search fails, fall back to Projected estimates. Never block on search failure. |

---

## 5. Deliverable Specification

### 5.1 File Details

- **File:** `.claude/skills/hardware-vetter/SKILL.md`
- **Type:** Claude Code skill file (markdown with imperative instructions)
- **Target length:** 600–700 lines
- **Tools used:** `Read`, `AskUserQuestion`, `Write`, `WebSearch` (degradable)

### 5.2 Skill Metadata Block

```markdown
---
name: hardware-vetter
description: Evaluate proposed hardware changes against registered and candidate AI models
model: opus
```

### 5.3 Overall Skill Structure (8 sections in order)

1. Critical Rules (top of file — highest attention)
2. Purpose and Scope
3. Data Loading
4. Question Flow
5. Analysis Engine
6. Benchmark Search (degradable)
7. Report Generation
8. Completion

### 5.4 Section 1: Critical Rules

Place these rules at the absolute top of SKILL.md, before any other content (after metadata block):

```
## CRITICAL RULES

- You MUST read `docs/model_catalog.json` and `src/pipeline/config.py` BEFORE asking any questions. NEVER ask the user for data that exists in these files.
- The RAM field in hardware_profile is `ram_gb`. NEVER reference `total_ram_gb`.
- The GPU VRAM fields are `gpu_vram_gb_q4` and `gpu_vram_gb_q8` ONLY. NEVER reference `gpu_vram_gb_fp16` — it does not exist.
- Match registered models from config.py to catalog via the `ollama_id` field. Config uses colon format (e.g., `qwen2.5:14b`), catalog uses `ollama_id` with the same colon format.
- Every numeric estimate MUST be labeled "(Verified)" if from catalog benchmarks or "(Projected)" if calculated from formulas.
- If `docs/model_catalog.json` cannot be read or parsed, STOP and tell the user. Do not proceed without the catalog.
- If `src/pipeline/config.py` cannot be read, treat ALL catalog models as candidates (no registered/candidate distinction). Warn the user and continue.
- NEVER ask the user to manually enter model specs, hardware specs, or benchmark numbers that exist in the catalog.
```

### 5.5 Section 2: Purpose and Scope

Brief section (10–15 lines) stating:
- This skill evaluates proposed hardware changes for the AI inference server
- Supports 4 change types: CPU upgrade, GPU addition, RAM change, full system replacement
- Reads all data from project files automatically
- Produces a before/after comparison report with per-model analysis
- Writes report to `docs/reports/`

### 5.6 Section 3: Data Loading

#### Step 3.1: Read Model Catalog

```
Use the Read tool to read `docs/model_catalog.json`.
Parse the JSON and extract:
- `hardware_profile` — the current server hardware specs
- `models` — all model entries (the object, not an array)
- `infrastructure_options` — for reference context

If the file cannot be read or JSON parsing fails, STOP immediately. Tell the user:
"Cannot read or parse docs/model_catalog.json. This file is required. Please ensure it exists and contains valid JSON."
```

#### Step 3.2: Read Pipeline Config

```
Use the Read tool to read `src/pipeline/config.py`.
Extract the three registered model Ollama IDs by finding these patterns:
- `default_model` assignment → extract the string value
- `fast_model` assignment → extract the string value
- `chat_model` assignment → extract the string value

These will be in Ollama colon format (e.g., "qwen2.5:14b").

If the file cannot be read or the patterns are not found:
- Warn the user: "Could not read src/pipeline/config.py. Proceeding with all models as candidates (no registered/candidate distinction)."
- Set registered_models to empty list
- Continue execution
```

#### Step 3.3: Classify Models

```
For each model in the catalog `models` object:
- If its `ollama_id` field matches any of the three extracted config IDs → classify as "registered"
- Otherwise → classify as "candidate"

Store two lists:
- registered_models: list of {key, display_name, ollama_id, role} where role is "default_model", "fast_model", or "chat_model"
- candidate_models: list of {key, display_name, ollama_id}
```

#### Step 3.4: Detect GPU Capability

```
Check whether GPU VRAM fields exist in any model's hardware_requirements:
- Look for `gpu_vram_gb_q4` in at least one model entry
- If present → set gpu_data_available = true
- If absent in ALL models → set gpu_data_available = false

Also check hardware_profile.gpu:
- If "none" → current_has_gpu = false
- Otherwise → current_has_gpu = true, parse GPU details
```

### 5.7 Section 4: Question Flow

All questions use `AskUserQuestion`. Present the data summary before the first question.

#### Step 4.1: Present Current Hardware Summary

Before asking anything, display to the user:

```
**Current Hardware Profile:**
- Server: {hardware_profile.server_name}
- CPU: {hardware_profile.cpu_model} ({hardware_profile.cpu_cores} cores, {hardware_profile.cpu_clock_ghz_base}–{hardware_profile.cpu_clock_ghz_turbo} GHz)
- RAM: {hardware_profile.ram_gb} GB
- GPU: {hardware_profile.gpu}
- Storage: {hardware_profile.storage_type}

**Registered Models (from pipeline config):**
- Default: {display_name} ({ollama_id})
- Fast: {display_name} ({ollama_id})
- Chat: {display_name} ({ollama_id})

**Candidate Models (catalog, not currently registered):**
- {display_name} ({parameter_count}) — for each candidate
```

#### Step 4.2: Ask Change Type

```
AskUserQuestion:
"What type of hardware change are you evaluating?

1. CPU upgrade — replacing the processor(s)
2. GPU addition — adding a GPU to the system
3. RAM change — increasing or changing system memory
4. Full system replacement — replacing the entire server

Enter a number (1–4):"
```

Valid responses: "1", "2", "3", "4" (or the text labels). Map to internal enum: `cpu_upgrade`, `gpu_addition`, `ram_change`, `full_system`.

If `full_system` is selected, ask ALL component questions below in sequence (4.3, 4.4, 4.5).
If a single component is selected, ask ONLY that component's question.

#### Step 4.3: CPU Details (asked for `cpu_upgrade` or `full_system`)

```
AskUserQuestion:
"Describe the proposed CPU:

Please provide:
- CPU model name (e.g., Intel Xeon w5-3435X, AMD EPYC 9354)
- Core count
- Base clock speed (GHz)
- Turbo/boost clock speed (GHz)
- Architecture (e.g., Sapphire Rapids, Zen 4)

You can paste a spec line or describe it naturally."
```

Parse the response to extract:
- `proposed_cpu_model`: string (full model name)
- `proposed_cpu_cores`: integer
- `proposed_cpu_clock_base`: float (GHz)
- `proposed_cpu_clock_turbo`: float (GHz)
- `proposed_cpu_architecture`: string

If any field cannot be parsed, ask a targeted follow-up:
```
AskUserQuestion:
"I couldn't determine the {missing_field}. Could you specify the {human_readable_field_name}?"
```

#### Step 4.4: GPU Details (asked for `gpu_addition` or `full_system`)

```
AskUserQuestion:
"Describe the proposed GPU:

Please provide:
- GPU model name (e.g., NVIDIA RTX 4090, NVIDIA A100 80GB)
- VRAM amount (GB)
- Memory bandwidth (GB/s) if known
- Number of GPUs if adding multiple

You can paste a spec line or describe it naturally."
```

Parse the response to extract:
- `proposed_gpu_model`: string
- `proposed_gpu_vram_gb`: float
- `proposed_gpu_bandwidth_gbs`: float or null
- `proposed_gpu_count`: integer (default 1)

If VRAM cannot be parsed, ask a targeted follow-up. Bandwidth is optional (used only for throughput estimates).

If `gpu_data_available` is false, warn:
```
"Note: The model catalog does not yet include GPU VRAM requirements for the models. GPU analysis will use parameter-based estimates and all GPU results will be marked as Projected. For verified GPU analysis, complete Task 1 (Augment Model Catalog for Hardware Evaluation) first."
```

#### Step 4.5: RAM Details (asked for `ram_change` or `full_system`)

```
AskUserQuestion:
"Describe the proposed RAM configuration:

Please provide:
- Total RAM amount (GB)
- RAM type/speed if known (e.g., DDR5-4800, DDR4-3200)

You can enter just the amount (e.g., '256 GB') or include details."
```

Parse:
- `proposed_ram_gb`: float
- `proposed_ram_type`: string or null

If amount cannot be parsed, ask a targeted follow-up.

#### Step 4.6: Build Proposed Hardware Profile

Construct `proposed_hardware` by copying the current `hardware_profile` and overriding changed fields:

- For `cpu_upgrade`: override cpu_model, cpu_cores, cpu_clock_ghz_base, cpu_clock_ghz_turbo, cpu_architecture
- For `gpu_addition`: override gpu with proposed GPU info string (e.g., "NVIDIA RTX 4090 24GB x1"), add gpu_vram_gb, gpu_count, gpu_bandwidth_gbs
- For `ram_change`: override ram_gb, optionally add ram_type
- For `full_system`: override all changed fields. Any component NOT specified stays as current.

#### Step 4.7: Confirm Proposed Configuration

```
AskUserQuestion:
"Here is the proposed hardware configuration:

**Proposed Hardware:**
- Server: {server_name} {or 'New System' if full replacement}
- CPU: {proposed or current}
- RAM: {proposed or current} GB
- GPU: {proposed or current}

**Changes from current:**
- {list only changed components with before → after}

Does this look correct? (yes/no)"
```

If "no", ask which component to correct, then re-ask that component's question. Loop until confirmed.

### 5.8 Section 5: Analysis Engine

#### 5.8.1 Core Data Structures

For each model, compute two assessment objects — one for current hardware, one for proposed hardware:

```
ModelAssessment:
  model_key: string
  display_name: string
  parameter_count: string (e.g., "14.7B")
  is_registered: boolean
  role: string or null ("default_model", "fast_model", "chat_model")

  current_hardware:
    feasibility_tier: "Comfortable" | "Tight" | "Infeasible"
    ram_required_gb: float (at recommended quantization)
    ram_headroom_pct: float (positive = spare, negative = deficit)
    gpu_fits: boolean or null (null if no GPU)
    gpu_vram_required_gb: float or null
    gpu_vram_headroom_pct: float or null
    throughput_estimate: string (e.g., "~15 tok/s") or null
    throughput_source: "Verified" | "Projected"
    concurrent_capacity: integer (how many instances fit in memory)

  proposed_hardware:
    (same fields as current_hardware)

  delta:
    feasibility_changed: boolean
    feasibility_before: string
    feasibility_after: string
    headroom_delta_pct: float
    throughput_delta: string or null
    concurrent_delta: integer
    newly_feasible: boolean (was Infeasible, now Comfortable or Tight)
```

#### 5.8.2 Feasibility Tier Calculation

For each model on each hardware configuration:

**Step A: Determine RAM requirement**
```
ram_required = model.hardware_requirements.recommended_ram_gb
If recommended_ram_gb is missing, fall back to ram_gb_q4.
If ram_gb_q4 is also missing, estimate: ram_required = parameter_count_billions * 0.6
  (This covers q4 quantization: ~0.5 bytes/param + overhead)
  Mark as Projected if estimated.
```

**Step B: Determine GPU VRAM requirement (if GPU present in hardware)**
```
If hardware has GPU:
  gpu_vram_required = model.hardware_requirements.gpu_vram_gb_q4
  If gpu_vram_gb_q4 is missing:
    gpu_vram_required = parameter_count_billions * 0.55
    (q4 VRAM: ~0.5 bytes/param + small overhead)
    Mark as Projected.
```

**Step C: Compute feasibility tier**
```
If hardware has GPU AND model.gpu_offload_support != "cpu_only_viable":
  # GPU path: model can use GPU
  If gpu_vram_required <= total_gpu_vram:
    # Full GPU offload possible
    resource_ratio = gpu_vram_required / total_gpu_vram
  Else:
    # Partial offload or CPU fallback — use RAM
    resource_ratio = ram_required / hardware_ram_gb
Else:
  # CPU-only path
  resource_ratio = ram_required / hardware_ram_gb

Tier assignment:
  resource_ratio <= 0.70 → "Comfortable" (30%+ headroom)
  resource_ratio <= 0.95 → "Tight" (5–30% headroom)
  resource_ratio > 0.95  → "Infeasible" (less than 5% headroom or deficit)
```

**Step D: Compute headroom percentage**
```
If GPU path:
  headroom_pct = ((total_gpu_vram - gpu_vram_required) / total_gpu_vram) * 100
Else:
  headroom_pct = ((hardware_ram_gb - ram_required) / hardware_ram_gb) * 100

Round to 1 decimal place.
Negative values mean deficit.
```

#### 5.8.3 Throughput Estimation

**Verified path:**
```
If model.raw_benchmarks exists AND contains throughput data (tokens_per_second or equivalent):
  Use the benchmark value directly.
  Label: "(Verified)"
```

**Projected path (CPU-only):**
```
If no benchmark data available:
  # Base formula: smaller models are faster, more cores help
  base_tokens_per_sec = (hardware_cpu_cores * hardware_cpu_clock_turbo) / (parameter_count_billions * 0.5)

  # Apply architecture generation multiplier
  # Newer architectures have better IPC
  arch_multiplier = lookup from:
    "Broadwell" → 1.0
    "Skylake" / "Cascade Lake" → 1.15
    "Ice Lake" → 1.25
    "Sapphire Rapids" → 1.40
    "Zen 3" → 1.20
    "Zen 4" → 1.35
    "Zen 5" → 1.45
    unknown → 1.0

  estimated_tokens_per_sec = base_tokens_per_sec * arch_multiplier
  Round to nearest integer.
  Label: "(Projected)"
  Format: "~{N} tok/s"
```

**Projected path (GPU):**
```
If GPU present and model can offload:
  If gpu_bandwidth_gbs is known:
    # Memory bandwidth is the primary bottleneck for LLM inference
    bytes_per_param_q4 = 0.5
    model_size_gb = parameter_count_billions * bytes_per_param_q4
    estimated_tokens_per_sec = gpu_bandwidth_gbs / (model_size_gb * 2)
    # Factor of 2 accounts for KV cache and overhead
  Else:
    # Rough estimate without bandwidth
    estimated_tokens_per_sec = (proposed_gpu_vram_gb * 10) / parameter_count_billions

  Round to nearest integer.
  Label: "(Projected)"
  Format: "~{N} tok/s"
```

**Important:** These formulas are rough order-of-magnitude estimates. The Projected label communicates this. Exact throughput depends on quantization method, batch size, context length, and other factors not modeled here.

#### 5.8.4 Concurrent Capacity

```
If GPU path:
  concurrent = floor(total_gpu_vram / gpu_vram_required)
Else:
  # Reserve 20% of RAM for OS and system processes
  available_ram = hardware_ram_gb * 0.80
  concurrent = floor(available_ram / ram_required)

Minimum: 0 (if model doesn't fit at all)
```

#### 5.8.5 Delta Computation

For each model, compute deltas between current and proposed assessments:
```
feasibility_changed = (current.feasibility_tier != proposed.feasibility_tier)
headroom_delta_pct = proposed.ram_headroom_pct - current.ram_headroom_pct
  (or GPU headroom if GPU path on proposed)
concurrent_delta = proposed.concurrent_capacity - current.concurrent_capacity
newly_feasible = (current.feasibility_tier == "Infeasible") AND (proposed.feasibility_tier != "Infeasible")

throughput_delta:
  If both throughput values exist as numbers:
    delta = proposed_tok_s - current_tok_s
    Format: "+{N} tok/s" or "-{N} tok/s"
  Else: null
```

### 5.9 Section 6: Benchmark Search (Degradable)

```
For each model where throughput_source would be "Projected" on the proposed hardware:
  Attempt a WebSearch query:
    "{model_display_name} {proposed_cpu_or_gpu_model} inference benchmark tokens per second"

  If WebSearch returns relevant results:
    Extract tokens/s figure from results.
    Update the proposed assessment:
      throughput_estimate = the found value
      throughput_source = "Verified"

  If WebSearch fails, returns no results, or results are not clearly relevant:
    Keep the Projected estimate. Do NOT block on search failure.
    Do NOT ask the user for benchmark data.

Limit: Perform at most 5 WebSearch calls total (prioritize registered models first, then largest candidate models). Skip search for models under 3B parameters (estimates are sufficient for small models).
```

### 5.10 Section 7: Report Generation

#### 5.10.1 File Naming

```
Date: current date in YYYY-MM-DD format

Slug rules by change type:
  cpu_upgrade → "{server_name}-cpu-upgrade" (lowercase, spaces to hyphens)
  gpu_addition → "{server_name}-{gpu_model_short}-addition" (e.g., "aos-ai-beta-rtx4090-addition")
  ram_change → "{server_name}-ram-{proposed_gb}gb"
  full_system → "{new_identifier}-full-replacement" (use server_name or "new-system" if unnamed)

All slugs: lowercase, alphanumeric and hyphens only, truncate to 60 chars.

Full path: docs/reports/hardware_eval_{date}_{slug}.md
```

#### 5.10.2 Report Template Structure

The complete report has these sections in order:

```markdown
# Hardware Evaluation Report: {Change Description}

**Date:** {YYYY-MM-DD}
**Evaluator:** Hardware Vetter Skill (Automated)
**Change Type:** {CPU Upgrade | GPU Addition | RAM Change | Full System Replacement}

---

## Executive Summary

{2–4 sentence summary covering:}
- What change was evaluated
- Overall verdict (Recommended / Recommended with Caveats / Not Recommended)
- Key impact (how many models affected, biggest gain)
- One critical caveat if any

---

## Hardware Comparison

| Component | Current | Proposed | Change |
|-----------|---------|----------|--------|
| CPU | {current} | {proposed or "No change"} | {description or "—"} |
| GPU | {current} | {proposed or "No change"} | {description or "—"} |
| RAM | {current} GB | {proposed or "No change"} GB | {"+N GB" or "—"} |
| Storage | {current} | {proposed or "No change"} | {description or "—"} |

---

## Registered Model Analysis

These models are currently configured in the pipeline (`src/pipeline/config.py`).

### {Model Display Name} ({role})

**Ollama ID:** `{ollama_id}`
**Parameters:** {parameter_count}
**Recommended Quantization:** {recommended_quantization}

| Metric | Current Hardware | Proposed Hardware | Delta |
|--------|-----------------|-------------------|-------|
| Feasibility | {tier} | {tier} | {changed or "No change"} |
| RAM Required | {N} GB | {N} GB | — |
| RAM Headroom | {N}% | {N}% | {+/-N}% |
| GPU VRAM Required | {N} GB or N/A | {N} GB or N/A | {+/-N}% or N/A |
| GPU VRAM Headroom | {N}% or N/A | {N}% or N/A | {+/-N}% or N/A |
| Est. Throughput | {~N tok/s} ({source}) | {~N tok/s} ({source}) | {+/-N tok/s} |
| Concurrent Instances | {N} | {N} | {+/-N} |

{1–2 sentence interpretation of this model's results.}

{Repeat this subsection for each registered model — there will be 3.}

---

## Candidate Model Analysis

These models are in the catalog but not currently registered in the pipeline.

| Model | Params | Current Tier | Proposed Tier | Newly Feasible? | Headroom (Proposed) | Est. Throughput (Proposed) |
|-------|--------|-------------|---------------|-----------------|--------------------|----|
| {display_name} | {param_count} | {tier} | {tier} | {Yes/No} | {N}% | {~N tok/s} ({source}) |
{... one row per candidate model}

### Newly Feasible Models

{If any models have newly_feasible == true:}

The following models become feasible with the proposed hardware:

- **{display_name}** ({parameter_count}) — moves from Infeasible to {tier}. {1 sentence on what this model offers, from its strengths field.}

{If no models become newly feasible:}

No additional models become feasible with the proposed hardware change.

---

## Upgrade Recommendation

**Verdict:** {Recommended | Recommended with Caveats | Not Recommended}

**Rationale:**
{3–5 bullet points covering:}
- Impact on registered models (performance gains or losses)
- Number of newly feasible candidate models
- Resource headroom changes
- Cost-benefit consideration (if full system, note scale of change)
- Any risks or caveats

**Suggested Next Steps:**
{2–3 actionable bullet points, e.g.:}
- Update model_catalog.json hardware_profile to reflect new hardware after installation
- Consider registering {model_name} as {role} given its feasibility on the new hardware
- Run actual benchmarks after installation to replace Projected estimates

---

## Methodology

**Data Sources:**
- Model specifications: `docs/model_catalog.json` (schema v{version})
- Registered models: `src/pipeline/config.py`
- Benchmark data: {list sources — "catalog benchmarks" and/or "web search results" and/or "none available"}

**Estimation Approach:**
- Feasibility tiers: Comfortable (>30% headroom), Tight (5–30%), Infeasible (<5%)
- RAM reservation: 20% of total RAM reserved for OS/system processes in concurrent capacity calculations
- Throughput estimates use {CPU formula description and/or GPU formula description}

**Data Confidence:**
- Verified data points: {N} of {total}
- Projected data points: {N} of {total}
- Projected estimates are order-of-magnitude approximations. Actual performance may vary significantly based on quantization method, context length, batch size, and system load.
```

#### 5.10.3 Verdict Logic

```
Compute verdict based on these rules (evaluate in order, first match wins):

"Not Recommended":
  - Any registered model moves from Comfortable/Tight to Infeasible on proposed hardware
  - OR all registered models show negative headroom_delta AND no newly feasible candidates

"Recommended with Caveats":
  - Any registered model moves from Comfortable to Tight
  - OR newly feasible count == 0 AND average headroom improvement < 10%
  - OR gpu_data_available == false AND change_type == gpu_addition (can't fully evaluate the GPU without VRAM data)

"Recommended":
  - All registered models stay at same or better tier
  - AND (headroom improves OR newly feasible models > 0 OR throughput improves)
```

#### 5.10.4 Write Report

```
Use the Write tool to write the complete report to the computed file path.
After writing, inform the user:
"Report written to: {file_path}"
```

### 5.11 Section 8: Completion

```
After writing the report, present a brief summary to the user:

"Hardware evaluation complete.

**Verdict:** {verdict}
**Report:** {file_path}

Key findings:
- {1-line summary for each registered model}
- {N} candidate model(s) become newly feasible
- {Any critical caveat}

The full report is available at the path above."
```

### 5.12 Error Handling Specification

| Error Condition | Behavior |
|----------------|----------|
| `docs/model_catalog.json` missing or unparseable | STOP. Inform user. Do not proceed. |
| `src/pipeline/config.py` missing or unparseable | WARN. Continue with all models as candidates. |
| `hardware_profile` key missing in catalog | STOP. Inform user catalog is malformed. |
| `models` key missing in catalog | STOP. Inform user catalog is malformed. |
| `gpu_vram_gb_q4` field missing on a model | Set gpu_vram_required to Projected estimate for that model. |
| `recommended_ram_gb` missing on a model | Fall back to `ram_gb_q4`. If also missing, use parameter-based estimate. Mark Projected. |
| `raw_benchmarks` missing or empty on a model | Use Projected throughput formula. |
| User enters unparseable hardware specs | Ask targeted follow-up for the specific missing field. Max 2 retries per field, then ask user to provide the complete spec in structured format. |
| WebSearch fails or returns irrelevant results | Silently keep Projected estimate. No user notification needed. |
| `docs/reports/` directory does not exist | Create it before writing the report. |
| Change type response not recognized | Re-ask the change type question with the numbered list. |
| User says "no" to confirmation | Ask which component to correct, re-ask that component's question. |

### 5.13 Worked Example

**Scenario:** GPU Addition — NVIDIA RTX 4090 (24GB VRAM) added to the current system (192 GB RAM, no GPU).

**Model: qwen2.5-14b (14.7B params, registered as default_model)**

Current hardware (CPU-only):
```
ram_required = recommended_ram_gb (from catalog, say 12 GB)
resource_ratio = 12 / 192 = 0.0625
feasibility_tier = "Comfortable" (0.0625 < 0.70)
headroom_pct = ((192 - 12) / 192) * 100 = 93.8%
concurrent = floor(192 * 0.80 / 12) = floor(12.8) = 12
throughput (Projected, CPU): base = (32 * 2.5) / (14.7 * 0.5) = 80 / 7.35 = 10.88
  arch_multiplier (Broadwell) = 1.0
  estimated = 10.88 * 1.0 = ~11 tok/s (Projected)
```

Proposed hardware (GPU added, 24GB VRAM):
```
gpu_offload_support = check catalog (say "full_offload")
gpu_vram_required = gpu_vram_gb_q4 (from catalog, say 9 GB)
24 >= 9 → full GPU offload
resource_ratio = 9 / 24 = 0.375
feasibility_tier = "Comfortable" (0.375 < 0.70)
headroom_pct = ((24 - 9) / 24) * 100 = 62.5%
concurrent (GPU) = floor(24 / 9) = 2
throughput (Projected, GPU, no bandwidth given):
  estimated = (24 * 10) / 14.7 = 16.3 → ~16 tok/s (Projected)
```

Delta:
```
feasibility_changed = false (Comfortable → Comfortable)
headroom_delta = 62.5 - 93.8 = -31.3% (NOTE: GPU headroom vs RAM headroom — different resource pools)
throughput_delta = +5 tok/s
concurrent_delta = 2 - 12 = -10 (but GPU vs RAM — different meaning)
newly_feasible = false
```

**Note on the delta:** When comparing GPU headroom vs RAM headroom, the numbers describe different resource pools. The report should contextualize this: "GPU offload provides ~16 tok/s throughput vs ~11 tok/s CPU-only, but GPU VRAM limits concurrent instances to 2 (vs 12 in RAM). RAM remains available for additional CPU-only instances."

**Model: llama3.3-70b (70B params, candidate, currently Infeasible)**

Current hardware (CPU-only):
```
ram_required = recommended_ram_gb (say 45 GB)
resource_ratio = 45 / 192 = 0.234
feasibility_tier = "Comfortable" (fits in RAM even at 70B with q4)
Note: This model is actually feasible in 192GB RAM — it's the throughput that's impractical, not the memory.
```

This example illustrates that feasibility is about memory fit, not performance. The report's throughput column handles the performance dimension.

### 5.14 Complete Question Flow Summary

```
1. Load data (silent — no user interaction)
2. Present hardware summary
3. Ask change type (1 question)
4. Ask component details (1–3 questions depending on type)
5. Present confirmation (1 question, may loop)
6. Run analysis (silent)
7. Run benchmark search (silent, degradable)
8. Generate and write report (silent)
9. Present completion summary
```

Total user interactions: 3–6 questions (minimum for single component, maximum for full system with a correction).

---

## 6. Acceptance Mapping

| AC # | Criterion | How Addressed |
|------|-----------|---------------|
| 1 | Accepts all four hardware change types | Section 5.7, Step 4.2: explicit 4-option question with enum mapping. Full system asks all component questions sequentially. |
| 2 | Reads current specs from catalog and config without manual entry | Section 5.6: Data Loading reads both files automatically. Critical Rule: NEVER ask for data in files. |
| 3 | Fit/no-fit verdict with VRAM/RAM estimates per model | Section 5.8.2: feasibility tier (Comfortable/Tight/Infeasible) with exact RAM and VRAM requirement figures per model. |
| 4 | Before/after comparison with performance impact | Section 5.10.2: Hardware Comparison table + per-model tables with Current/Proposed/Delta columns. Delta computation in 5.8.5. |
| 5 | Identifies newly feasible candidate models | Section 5.8.5: `newly_feasible` flag computed per model. Section 5.10.2: "Newly Feasible Models" subsection. |
| 6 | Upgrade recommendation with rationale | Section 5.10.2: Upgrade Recommendation section with verdict + rationale bullets. Verdict logic in 5.10.3. |
| 7 | Projected vs Verified labeling | Section 5.8.3: all throughput labeled (Verified)/(Projected). Section 5.8.2: RAM/VRAM estimates labeled when from formula. Section 5.10.2: Methodology section with confidence counts. |
| 8 | Timestamped markdown file | Section 5.10.1: file naming with date + slug. Section 5.10.4: Write tool output. |

---

## 7. Integration Points

| Integration | File Path | Fields/Format | Direction |
|-------------|-----------|---------------|-----------|
| Model catalog | `docs/model_catalog.json` | JSON: `hardware_profile` (object), `models` (object of objects), each model has `hardware_requirements`, `ollama_id`, `display_name`, `parameter_count`, `raw_benchmarks`, `feasibility`, `strengths` | Read |
| Pipeline config | `src/pipeline/config.py` | Python: `default_model`, `fast_model`, `chat_model` string assignments in Pydantic Settings class. Values in Ollama colon format. | Read |
| Report output | `docs/reports/hardware_eval_{date}_{slug}.md` | Markdown file. Complete structure in Section 5.10.2. | Write |
| User interaction | AskUserQuestion tool | String prompts, string responses. Question flow in Section 5.7. | Interactive |
| Benchmark search | WebSearch tool | Query strings per Section 5.9. Returns web results. Degradable — failure is silent. | Read (external) |

---

## 8. Open Items

| Item | Type | Resolution |
|------|------|------------|
| Exact `recommended_ram_gb` values for each model | [VERIFY] at execution time | Read from catalog at runtime. Values documented in catalog; skill reads them dynamically. |
| Exact `raw_benchmarks` field contents | [VERIFY] at execution time | Skill checks for existence and extracts throughput if present. Format varies by model. |
| GPU VRAM fields may not yet exist (Task 1 dependency) | Execution-time degradation | Skill detects missing fields and falls back to Projected. Warning issued per Section 5.7 Step 4.4. |
| Architecture multiplier table completeness | Execution-time | Unknown architectures default to 1.0 multiplier. User's proposed CPU architecture is parsed and matched. |

No blocking open items remain. All items above are runtime verifications or graceful degradations already specified in the blueprint.

---

## 9. Producer Handoff

**Output format:** Single markdown file containing a Claude Code skill
**Producer:** Code Writer
**Filename:** `.claude/skills/hardware-vetter/SKILL.md`
**Target line count:** 600–700 lines

**Content blocks in order:**

1. **Metadata block** (lines 1–4): YAML front matter with name, description, model
2. **Critical Rules** (lines 5–20): 8 imperative rules, all-caps keywords, highest attention position
3. **Purpose and Scope** (lines 21–35): Brief orientation, 4 change types, file paths
4. **Data Loading** (lines 36–95): Steps 3.1–3.4, Read tool instructions, model classification, GPU detection
5. **Question Flow** (lines 96–220): Steps 4.1–4.7, AskUserQuestion prompts (verbatim from blueprint), parsing instructions, confirmation loop
6. **Analysis Engine** (lines 221–370): All formulas from 5.8.1–5.8.5, tier thresholds, throughput estimation (CPU + GPU paths), concurrent capacity, delta computation
7. **Benchmark Search** (lines 371–400): WebSearch instructions, 5-query limit, priority order, failure handling
8. **Report Generation** (lines 401–640): Complete report template from 5.10.2 (verbatim structure), file naming rules, verdict logic, Write tool instruction
9. **Completion** (lines 641–660): Summary presentation format
10. **Error Handling** (lines 661–700): Error table from 5.12, all conditions and behaviors

**Instruction tone guidance:** Write all instructions as second-person imperative directives to Claude. Use "You MUST", "NEVER", "ALWAYS" for non-negotiable rules. Use "You should" for preferred behaviors. No persona names, no first-person. Every instruction tells Claude exactly what to do, in what order, with what tools.
