# Blueprint: Build the Model Recommendation Engine

## 1. Task Reference

- **Plan Task**: Task 3 — Build the Model Recommendation Engine
- **Type**: Greenfield — no prior implementation exists
- **Acceptance Criteria**:
  - AC1: Skill reads `models/catalog.json` and `config/hardware-profile.json` to produce recommendations
  - AC2: Models scored using weighted percentage formula (RAM 40%, VRAM 40%, context 20%)
  - AC3: Use-case filtering narrows candidates by tag match (plus "general" tag inclusion)
  - AC4: Output is a Markdown report listing all models above the "acceptable_fit" threshold
  - AC5: Report uses the existing 3-tier rating system (excellent_fit, acceptable_fit, poor_fit)
  - AC6: Report filename follows `recommendation_[use-case-slug].md` convention
- **Dependencies**: None — greenfield task, catalog and hardware profile already exist

## 2. Research Findings

Source: Stage 1 exploration of project context.

| Finding | Source | Blueprint Impact |
|---------|--------|-----------------|
| Catalog field is `ram_requirement_gb` (not `ram_gb`) | `models/catalog.json` inspection | Scoring logic must reference the correct field name |
| 47 model entries with fields: `ollama_id`, `name`, `parameter_count`, `quantization`, `context_length`, `ram_requirement_gb`, `gpu_vram_gb` | `models/catalog.json` schema | Defines the data contract for model iteration |
| Hardware profile fields: `ram_gb`, `gpu_model`, `gpu_vram_gb`, `storage_available_gb` | `config/hardware-profile.json` | Defines the data contract for hardware comparison |
| No CPU field in hardware profile | `config/hardware-profile.json` | CPU-based inference scoring is out of scope |
| Context length varies 2048–128000 | `models/catalog.json` range analysis | Context scoring needs normalization across wide range |
| Existing reports use 3-tier rating: excellent_fit, acceptable_fit, poor_fit | `reports/model_eval_2026-02-15_llama3.md` | Output format must use this established convention (confirmed by A1) |
| Use-case tags exist on models: chat, code, creative, reasoning | Stage 1 ECD analysis | Filtering logic requires tag-based candidate narrowing |
| No existing recommendation logic | Stage 1 survey | Entire scoring and filtering system is new |

## 3. Approach

### Strategy: Single SKILL.md implementing filter-then-score-then-report pipeline

The skill operates as a three-phase pipeline:

1. **Filter phase** — Narrow the 47-model catalog to candidates matching the user's use-case tag, always including models tagged "general" regardless of query (per D2 user override).
2. **Score phase** — Compute a weighted percentage fit score for each candidate against the user's hardware profile: RAM fit 40%, VRAM fit 40%, context fit 20% (per D1).
3. **Report phase** — Classify each scored model into the 3-tier rating system, filter out "poor_fit" models, and write a Markdown report containing all models at or above "acceptable_fit" (per D3).

### Rationale

- **Filter-then-score** avoids wasted computation on irrelevant models and produces a focused candidate set.
- **Weighted percentage** (D1 choice A) produces a continuous score enabling fine-grained ranking within tiers, and allows per-dimension tuning.
- **Including "general" models** (D2 user override) ensures versatile models are never excluded by narrow tag matching.
- **All above threshold** (D3 choice C) respects the user's preference to see every viable option rather than an arbitrary top-N cutoff.

## 4. Decisions Made

### From User Decisions (decisions.json)

| ID | Decision | Resolution | Source |
|----|----------|------------|--------|
| A1 | Output Format Consistency | Use existing 3-tier rating system (excellent_fit, acceptable_fit, poor_fit) | Accepted — user confirmed default |
| A2 | Single-File Skill Structure | Implement as a single SKILL.md file | Accepted — user confirmed default |
| A3 | Model Selection for Execution | **Use `opus`** (not sonnet) | **Promoted** — user override: "wants deeper reasoning for model comparison analysis" |
| A4 | Hardware Profile Path | Read from `config/hardware-profile.json` | Accepted — user confirmed default |
| A5 | Report Naming Convention | **Use `recommendation_[use-case-slug].md`** (no date prefix) | **Promoted** — user override: "prefers simpler naming without dates" |
| D1 | Scoring Formula Approach | Weighted percentage — RAM 40%, VRAM 40%, context 20% | Option A chosen — user confirmed recommendation |
| D2 | Use-Case Filtering Strategy | Strict tag match **plus always include models tagged "general"** | **User "other"** — custom override combining strict filtering with general-tag inclusion |
| D3 | Top-N Presentation Count | Show **all models above "acceptable_fit" threshold** | Option C chosen — user selected over recommended option A |

### Architectural Decisions (derived from above)

| Decision | Rationale | Traced To |
|----------|-----------|-----------|
| Fit score is a float 0.0–1.0 | Weighted percentage formula naturally produces a 0–1 range | D1 |
| Tier thresholds: excellent_fit >= 0.85, acceptable_fit >= 0.55, poor_fit < 0.55 | Three tiers need two boundaries; 0.85 captures models with significant headroom, 0.55 captures models that fit but are tight | A1 + D1 (see Open Items — thresholds not specified by Stage 1 or user) |
| Report written to `reports/` directory | Existing evaluation reports live in `reports/`; consistency with project conventions | Stage 1 finding (report location) |
| Use-case slug derived from query by lowercasing and replacing spaces with hyphens | Standard slug convention; matches project naming patterns | A5 |

## 5. Deliverable Specification

### 5.1 File to Produce

**File**: `skills/model-recommender/SKILL.md`
**Type**: Claude Code skill definition (single Markdown file with all behavioral instructions)

### 5.2 Skill Metadata Block

```yaml
---
model: opus
description: Recommends AI models from the catalog based on user hardware and use-case
```

- Model is `opus` per A3 user override.

### 5.3 Skill Invocation

The skill is invoked by the user with a use-case query. The SKILL.md must instruct Claude to:

1. Ask the user: "What use case do you need a model for?" if not provided as an argument.
2. Accept free-text input and map it to one of the known use-case tags: `chat`, `code`, `creative`, `reasoning`.
3. If the input does not clearly map to a tag, ask the user to clarify by presenting the available tags.

### 5.4 Data Contracts

#### Input: `models/catalog.json`

Expected structure (array of objects):

```json
[
  {
    "ollama_id": "string",
    "name": "string",
    "parameter_count": "number (billions)",
    "quantization": "string (e.g., Q4_K_M)",
    "context_length": "number",
    "ram_requirement_gb": "number",
    "gpu_vram_gb": "number",
    "use_case_tags": ["string"]
  }
]
```

Note: The RAM field is `ram_requirement_gb` (not `ram_gb`). The producer MUST use this exact field name.

#### Input: `config/hardware-profile.json`

Expected structure:

```json
{
  "ram_gb": "number",
  "gpu_model": "string",
  "gpu_vram_gb": "number",
  "storage_available_gb": "number"
}
```

#### Output: `reports/recommendation_[use-case-slug].md`

Filename convention per A5 user override. The `[use-case-slug]` is the use-case tag in lowercase (e.g., `recommendation_code.md`, `recommendation_chat.md`).

### 5.5 Filtering Logic (D2 — User Override)

```
candidates = []
for each model in catalog:
    if model.use_case_tags contains requested_tag:
        add model to candidates
    else if model.use_case_tags contains "general":
        add model to candidates
```

- Strict tag match: model must have the exact requested tag in its `use_case_tags` array.
- General inclusion: models tagged "general" are always included regardless of the requested use-case.
- If no models match after filtering (edge case): fall back to scoring ALL models in the catalog and note in the report that no models matched the use-case filter.

### 5.6 Scoring Formula (D1 — Option A)

For each candidate model, compute a fit score as a weighted percentage:

```
ram_ratio   = min(hardware.ram_gb / model.ram_requirement_gb, 1.0)
vram_ratio  = min(hardware.gpu_vram_gb / model.gpu_vram_gb, 1.0)
context_ratio = model.context_length / 128000

fit_score = (ram_ratio * 0.40) + (vram_ratio * 0.40) + (context_ratio * 0.20)
```

**Dimension details:**

- **RAM ratio** (weight 0.40): `hardware.ram_gb / model.ram_requirement_gb`, capped at 1.0. A ratio of 1.0 means the hardware meets or exceeds the requirement. A ratio below 1.0 means the model may not run or will swap.
- **VRAM ratio** (weight 0.40): `hardware.gpu_vram_gb / model.gpu_vram_gb`, capped at 1.0. Same semantics as RAM ratio. Models with `gpu_vram_gb` of 0 or null get a VRAM ratio of 1.0 (CPU-only model, no VRAM needed).
- **Context ratio** (weight 0.20): `model.context_length / 128000`. Not capped — 128000 is the observed maximum in the catalog, so this normalizes to a 0.0–1.0 range. Rewards models with larger context windows.

**Fit score range**: 0.0 to 1.0.

### 5.7 Tier Classification (A1)

| Tier | Score Range | Meaning |
|------|------------|---------|
| `excellent_fit` | >= 0.85 | Hardware comfortably exceeds model requirements with headroom |
| `acceptable_fit` | >= 0.55 and < 0.85 | Hardware meets model requirements but with limited headroom |
| `poor_fit` | < 0.55 | Hardware insufficient or severely constrained for this model |

### 5.8 Report Generation (D3 — Option C)

The report includes **all models that score at or above the "acceptable_fit" threshold** (fit_score >= 0.55). Models classified as "poor_fit" are excluded from the report entirely.

#### Report Structure

```markdown
# Model Recommendation: [Use Case]

**Hardware Profile**: [gpu_model] | [ram_gb] GB RAM | [gpu_vram_gb] GB VRAM
**Use Case**: [requested use-case tag]
**Models Evaluated**: [total candidates after filtering]
**Models Recommended**: [count of models at or above acceptable_fit]

## Excellent Fit

| Model | Parameters | Quantization | Context | RAM Required | VRAM Required | Score |
|-------|-----------|--------------|---------|-------------|---------------|-------|
| [name] | [parameter_count]B | [quantization] | [context_length] | [ram_requirement_gb] GB | [gpu_vram_gb] GB | [fit_score as percentage] |

[For each excellent_fit model, a 1–2 sentence explanation of why it fits well.]

## Acceptable Fit

| Model | Parameters | Quantization | Context | RAM Required | VRAM Required | Score |
|-------|-----------|--------------|---------|-------------|-------------- |-------|
| [name] | [parameter_count]B | [quantization] | [context_length] | [ram_requirement_gb] GB | [gpu_vram_gb] GB | [fit_score as percentage] |

[For each acceptable_fit model, a 1–2 sentence explanation noting the constraints.]

## Summary

[2–3 sentence summary: top recommendation, key trade-offs, any notable exclusions.]
```

- Models within each tier are sorted by fit_score descending (highest score first).
- If a tier has zero models, omit that section entirely.
- If zero models meet the acceptable_fit threshold, the report states: "No models in the catalog meet the minimum fit threshold for your hardware. Consider upgrading RAM or VRAM, or reducing context length requirements."
- Fit scores displayed as percentages (e.g., 0.87 shown as "87%").

### 5.9 Edge Cases

| Edge Case | Handling |
|-----------|----------|
| No models match use-case filter | Score ALL catalog models, include note in report header: "No models tagged for [use-case]. Showing general recommendations." |
| Model has `gpu_vram_gb` of 0 or null | Treat VRAM ratio as 1.0 (model does not require GPU) |
| Model has `ram_requirement_gb` of 0 or null | Skip model, log warning (invalid catalog entry) |
| Hardware profile missing or unreadable | Report error to user: "Cannot read hardware profile at config/hardware-profile.json. Run /intuition-initialize to set up your hardware profile." |
| Catalog missing or unreadable | Report error to user: "Cannot read model catalog at models/catalog.json." |
| Use-case query ambiguous | Present available tags and ask user to select one |

### 5.10 SKILL.md Structure

The SKILL.md file must contain the following sections in this order:

1. **YAML frontmatter** — model: opus, description
2. **Critical rules block** — MUST/NEVER directives at the top (per MEMORY.md skill-writing rules)
3. **Purpose** — one-sentence functional description
4. **Invocation instructions** — how to obtain the use-case from the user
5. **Data loading instructions** — read catalog and hardware profile, with error handling
6. **Filtering logic** — strict tag match + general inclusion (full pseudocode from 5.5)
7. **Scoring logic** — weighted percentage formula (full pseudocode from 5.6)
8. **Tier classification** — thresholds table from 5.7
9. **Report generation** — output template from 5.8, written to `reports/recommendation_[slug].md`
10. **Edge case handling** — table from 5.9
11. **Post-completion** — inform user of report location, offer to open it

All behavioral instructions written as imperative directives to Claude (second-person: "You MUST"), not user-facing documentation. Per A2, everything is in this single file.

## 6. Acceptance Mapping

| Criterion | Blueprint Section | How Addressed |
|-----------|------------------|---------------|
| AC1: Reads catalog.json and hardware-profile.json | 5.4 Data Contracts | Exact file paths and field names specified; error handling for missing files |
| AC2: Weighted percentage scoring (40/40/20) | 5.6 Scoring Formula | Complete formula with per-dimension calculation, capping, and edge cases |
| AC3: Use-case filtering with general inclusion | 5.5 Filtering Logic | Pseudocode covers strict match + general tag; fallback for zero matches |
| AC4: Markdown report with all above-threshold models | 5.8 Report Generation | Full report template; D3 option C implemented (all above acceptable_fit) |
| AC5: 3-tier rating system | 5.7 Tier Classification | Thresholds mapped to established tier names from existing reports |
| AC6: Correct filename convention | 5.4 Output specification | `recommendation_[use-case-slug].md` per A5 user override |

## 7. Integration Points

| Integration | Direction | Details |
|-------------|-----------|---------|
| `models/catalog.json` | Read | Skill reads but never writes; catalog managed externally |
| `config/hardware-profile.json` | Read | Skill reads but never writes; profile set by `/intuition-initialize` |
| `reports/` directory | Write | Skill writes recommendation report here; consistent with existing `model_eval_*` reports |
| Existing evaluation reports | Reference | Report format maintains consistency with `model_eval_2026-02-15_llama3.md` 3-tier system |
| `/intuition-initialize` | Dependency | Hardware profile must exist before this skill runs; error message references initialize if missing |

## 8. Open Items

| Item | Context | Impact |
|------|---------|--------|
| Tier threshold values (0.85, 0.55) | Stage 1 established the 3-tier system but did not specify numeric boundaries. User decisions did not address thresholds. Values 0.85 and 0.55 are design choices made in this blueprint based on the scoring formula's 0–1 range, targeting roughly top-15% as excellent and top-60% as acceptable. | Low — thresholds can be tuned after initial deployment by editing SKILL.md. If real-world results show poor tier distribution, adjust boundaries. |
| "general" tag existence in catalog | D2 user override assumes models in the catalog have a "general" tag. Stage 1 identified tags (chat, code, creative, reasoning) but did not confirm "general" exists as an actual tag value. | Medium — if no models are tagged "general", the D2 override has no effect. Producer should verify catalog contains "general" tags; if not, flag to user. |
| `use_case_tags` field name | Stage 1 listed model fields but did not explicitly confirm the array field name for use-case tags. This blueprint assumes `use_case_tags` based on ECD analysis. | Medium — producer must verify exact field name in catalog.json. |

## 9. Producer Handoff

- **Target Producer**: Code Writer
- **Execution Model**: `opus` (per A3 user override)
- **Output Format**: Single Markdown file (Claude Code SKILL.md)
- **Output Filename**: `SKILL.md`
- **Output Directory**: `skills/model-recommender/`
- **Full Output Path**: `skills/model-recommender/SKILL.md`
- **Instructions to Producer**: Implement the SKILL.md exactly as specified in Section 5. All behavioral instructions must be imperative directives to Claude. The YAML frontmatter must specify `model: opus`. Follow the SKILL.md writing rules from project conventions: critical rules at top, MUST/NEVER/ALWAYS for non-negotiable behaviors, under 500 lines. Do not add any scoring logic, filtering behavior, or report structure beyond what this blueprint specifies. The three open items in Section 8 require verification during implementation — read `models/catalog.json` to confirm the exact field name for use-case tags and whether "general" exists as a tag value.
