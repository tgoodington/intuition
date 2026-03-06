# Stage 1 Exploration: Task 2 — Build the Hardware Vetter Claude Code Skill

## Research Findings

### Files Examined

| File | Path | Key Data |
|------|------|----------|
| Model Catalog | `C:/Projects/District_AI_Agent_Implementation/docs/model_catalog.json` | Schema v1.2, 11 models, `hardware_profile`, `infrastructure_options` |
| Pipeline Config | `C:/Projects/District_AI_Agent_Implementation/src/pipeline/config.py` | Pydantic Settings, 3 registered Ollama model IDs: `qwen2.5:14b`, `qwen2.5:7b`, `llama3.1:8b` |
| Existing Skill | `C:/Projects/District_AI_Agent_Implementation/.claude/skills/hardware-vetter/SKILL.md` | 708-line complete skill implementation already exists |

### Critical Finding: Skill Already Exists

The file `.claude/skills/hardware-vetter/SKILL.md` is a **complete, 708-line implementation** — not a stub. It includes full YAML frontmatter, 8 workflow sections, detailed question flow via AskUserQuestion, GPU-primary and CPU-only analysis paths, benchmark search protocol (8-call cap), full report template, 7 error handling scenarios, and a completion message format.

### Codebase Conventions

- Single-file skill pattern: everything in `SKILL.md` (no reference files loaded by Claude Code)
- Frontmatter format: `name`, `description`, `model`, `tools` fields
- Report output directory: `docs/reports/` with naming convention `hardware_eval_YYYY-MM-DD_[slug].md`
- Catalog field `hardware_profile.ram_gb` (not `total_ram_gb` as referenced in current skill)
- Ollama IDs use colon format in config.py (`qwen2.5:14b`) but hyphen format as catalog keys (`qwen2.5-14b`); matching via `ollama_id` field

### Data Field Issues Found

1. **Field name mismatch:** Skill Section 2.1 references `hardware_profile.total_ram_gb` but catalog uses `hardware_profile.ram_gb`
2. **Nonexistent field reference:** Skill Section 4.2a references `gpu_vram_gb_fp16` which does not exist in any model's `hardware_requirements`; only `ram_gb_fp16` exists
3. **Unused tool:** `Glob` listed in frontmatter but never referenced in skill body

## ECD Analysis

### Elements

- **Skill file:** Single `SKILL.md` at `.claude/skills/hardware-vetter/SKILL.md`
- **Data source 1:** `docs/model_catalog.json` — 11 models, hardware profile, infrastructure options
- **Data source 2:** `src/pipeline/config.py` — 3 registered model IDs (default, fast, chat)
- **Output artifact:** Markdown report at `docs/reports/hardware_eval_YYYY-MM-DD_[slug].md`
- **Model catalog schema fields per model:** `display_name`, `ollama_id`, `parameter_count`, `size_tier`, `hardware_requirements` (with `ram_gb_q4`, `ram_gb_q8`, `ram_gb_fp16`, `recommended_ram_gb`, `gpu_vram_gb_q4`, `gpu_vram_gb_q8`, `gpu_offload_support`), `feasibility`, `raw_benchmarks`, `category_scores`

### Connections

- Skill reads `model_catalog.json` to extract hardware profile and all 11 model entries
- Skill reads `config.py` to extract 3 registered Ollama IDs, then matches via `ollama_id` field to catalog entries
- AskUserQuestion collects proposed hardware changes from user (4 change types: CPU, GPU, RAM, full system)
- Analysis engine branches on GPU presence: GPU-primary path or CPU-only path
- WebSearch (up to 8 calls) finds published benchmarks to upgrade estimates from "Projected" to "Verified"
- Write tool outputs the final report to `docs/reports/`

### Dynamics

- **Execution flow:** Data loading → question flow → analysis → benchmark search → report writing → completion message
- **Graceful degradation:** GPU fields missing → CPU-only path; benchmarks return nothing → projected estimates; config.py unreadable → all 11 as candidates; catalog missing → STOP
- **Unhandled edge cases:** Unified memory architectures (e.g., DGX Spark), multi-GPU configurations, adding a separate node (vs upgrading existing), models not in catalog, concurrent multi-model loading analysis

## Assumptions

### A1: Single-File Skill Structure
- **Default**: Keep the entire skill as a single `SKILL.md` file with no companion files
- **Rationale**: Claude Code only injects `SKILL.md` into context (the "Reference File Problem"). All existing Intuition skills follow this pattern. Splitting into multiple files would break skill loading.

### A2: Fix the `total_ram_gb` Field Name Mismatch
- **Default**: Change `total_ram_gb` to `ram_gb` in Section 2.1 to match the actual catalog field
- **Rationale**: The catalog field is definitively `ram_gb`. The current reference is incorrect and could cause runtime confusion for the sonnet model executing the skill.

### A3: Fix the `gpu_vram_gb_fp16` Nonexistent Field Reference
- **Default**: Remove or correct the FP16 case in the GPU analysis path (Section 4.2a), since `gpu_vram_gb_fp16` does not exist in any model's hardware_requirements
- **Rationale**: No model uses FP16 as its recommended quantization, and the field does not exist. The reference is dead code that could confuse the executor.

### A4: Preserve Existing Report Format and Naming Convention
- **Default**: Keep the existing `hardware_eval_YYYY-MM-DD_[slug].md` naming convention and report structure
- **Rationale**: An existing report (`hardware_eval_2026-02-20_thinkstation-pgx-addition.md`) already demonstrates this format works well. Changing it would create inconsistency with prior reports.

### A5: Match via `ollama_id` Field for Config-to-Catalog Linking
- **Default**: Continue matching config.py model IDs to catalog entries via the `ollama_id` field (colon format)
- **Rationale**: The skill already implements this correctly. Catalog keys use hyphen format but `ollama_id` uses colon format matching config.py exactly.

### A6: Keep `sonnet` as the Execution Model
- **Default**: Retain `model: sonnet` in frontmatter for skill execution
- **Rationale**: The skill is data-reading, question-asking, and report-writing — tasks well-suited to sonnet. Opus would be overkill for the structured analysis and report generation this skill performs.

### A7: Lightweight Schema Validation (Existence Checks Only)
- **Default**: Validate only that `model_catalog.json` exists, is readable, and `hardware_profile` is present — no deep schema validation
- **Rationale**: Full JSON schema validation would require code execution tools not available to the skill. The existing approach of reading data and gracefully degrading when fields are missing is the correct pattern for a Claude Code skill.

## Key Decisions

### D1: Scope of Changes — Fix Only vs Enhancement
- **Options**:
  - A) Fix data field issues only (Issues 1-3) — recommended: Minimal, low-risk changes to a working skill. Corrects the `ram_gb` mismatch, removes `gpu_vram_gb_fp16` dead reference, optionally removes unused `Glob` tool. Does not change functionality.
  - B) Fix issues + add unified memory architecture support: Adds a sub-path in Section 4.2 for systems like DGX Spark where GPU VRAM and system RAM are unified. Medium scope increase.
  - C) Fix issues + add unified memory + add concurrent model loading analysis: Also adds a check that sums RAM/VRAM requirements for all 3 registered models loaded simultaneously. Largest scope.
- **Recommendation**: A, because the skill is already production-quality and complete. The acceptance criteria are already met. Scope creep into new features (unified memory, concurrent loading) should be separate tasks with their own planning.
- **Risk if wrong**: If option A is chosen but unified memory systems are evaluated soon, the skill will produce incorrect VRAM/RAM split analysis for those architectures. However, this can be addressed in a follow-up task.

### D2: Remove or Keep Unused `Glob` Tool in Frontmatter
- **Options**:
  - A) Remove `Glob` from the tools list — recommended: Reduces the tool surface to only what the skill actually uses (Read, WebSearch, AskUserQuestion, Write).
  - B) Keep `Glob` and add a use case: Add a step to check if `docs/reports/` directory exists before writing, giving Glob a purpose.
- **Recommendation**: A, because the Write tool will create the file regardless, and adding a directory check adds complexity for negligible benefit. Smaller tool surface means fewer tokens spent on tool descriptions.
- **Risk if wrong**: Negligible either way. If a future skill revision needs Glob, it can be re-added.

### D3: How to Handle the Existing Skill — Review-and-Patch vs Rewrite
- **Options**:
  - A) Review-and-patch — recommended: Treat the existing 708-line skill as the baseline. Apply targeted fixes (field name corrections, dead reference removal). Verify against acceptance criteria. Minimal diff.
  - B) Rewrite from scratch: Produce a new SKILL.md from the blueprint, incorporating lessons learned but potentially losing working edge case handling.
- **Recommendation**: A, because the existing skill handles 7 error scenarios, has a well-structured question flow, and covers all 8 acceptance criteria. A rewrite risks losing subtle handling that the existing implementation got right.
- **Risk if wrong**: If the existing skill has deeper structural problems beyond the data field issues, patching may be insufficient. However, research found no structural issues — only data reference mismatches.

## Risks Identified

### Risk 1: Runtime Field Name Confusion (Low Severity)
- **Description**: Even after fixing the `total_ram_gb` reference, the sonnet model executing the skill reads the actual JSON. If the instruction says one thing and the data says another, sonnet may adapt — but inconsistency between instruction text and data structure creates ambiguity.
- **Mitigation**: Fix the field name references to exactly match the catalog. This eliminates the ambiguity entirely.

### Risk 2: Future Catalog Schema Changes (Low Severity)
- **Description**: The skill hardcodes field names from schema v1.2. If the catalog schema changes, field references will break.
- **Mitigation**: The lightweight validation approach means the skill will gracefully degrade (missing fields trigger fallback paths). No action needed now.

### Risk 3: Existing Skill Untested End-to-End (Medium Severity)
- **Description**: The 708-line skill has never been run. Subtle issues in question flow branching, analysis calculations, or report formatting may exist but are invisible until runtime.
- **Mitigation**: The code spec should include a mental walkthrough trace of at least one scenario (e.g., "Add RTX 4090 GPU") to verify the logic flow.

## Recommended Approach

The existing Hardware Vetter skill at `.claude/skills/hardware-vetter/SKILL.md` is a comprehensive, production-quality implementation that meets all 8 acceptance criteria. The engineering work should be a **review-and-patch** operation:

1. Fix the `total_ram_gb` → `ram_gb` field name mismatch in Section 2.1
2. Fix or remove the `gpu_vram_gb_fp16` nonexistent field reference in Section 4.2a
3. Remove `Glob` from the tools list (if decided)
4. Verify all remaining field references against the actual catalog schema
5. Mental walkthrough of at least one complete scenario to validate logic flow
6. No new files to create — single-file SKILL.md pattern maintained
