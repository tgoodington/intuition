# Stage 1 Exploration: Task 3 — Build the Model Recommendation Engine

## Research Findings

Research subagents examined the following project context:

- `models/catalog.json` — 47 model entries with fields: `ollama_id`, `name`, `parameter_count`, `quantization`, `context_length`, `ram_requirement_gb`, `gpu_vram_gb`
- `config/hardware-profile.json` — user hardware: `ram_gb: 32`, `gpu_model: "RTX 4070"`, `gpu_vram_gb: 12`, `storage_available_gb: 200`
- `reports/model_eval_2026-02-15_llama3.md` — existing evaluation report showing current output format
- `skills/model-recommender/SKILL.md` — does not exist yet (greenfield task)

Key findings:
1. The catalog uses `ram_requirement_gb` (not `ram_gb`) as the field name for model RAM needs
2. Context length varies from 2048 to 128000 — significant factor for recommendation
3. Hardware profile has no CPU field — CPU-based inference not trackable
4. Existing evaluation reports use a 3-tier rating: "excellent_fit", "acceptable_fit", "poor_fit"
5. No existing recommendation logic — all current evaluations are manual

## ECD Analysis

### Elements
- **Model entries**: 47 models with varying resource requirements
- **Hardware profile**: Single JSON describing user's machine capabilities
- **Recommendation output**: Markdown report ranking models by fit
- **Fit score**: Composite metric weighing RAM, VRAM, and context requirements
- **Use-case tags**: Models tagged with capabilities (chat, code, creative, reasoning)

### Connections
- Model requirements → Hardware profile: comparison determines feasibility
- Use-case tags → User intent: filters the candidate list before scoring
- Fit score → Ranking: determines output order
- Existing report format → New output: should maintain consistency

### Dynamics
- User provides a use-case query ("I need a coding model")
- Skill filters catalog by use-case tags
- Remaining models scored against hardware profile
- Top N models presented with fit explanations
- Edge case: no models match the use-case → fallback to general recommendations

## Assumptions

### A1: Output Format Consistency
- **Default**: Use the existing 3-tier rating system ("excellent_fit", "acceptable_fit", "poor_fit") from current evaluation reports
- **Rationale**: Established convention in the project, no reason to introduce a new scale

### A2: Single-File Skill Structure
- **Default**: Implement as a single SKILL.md file
- **Rationale**: Platform constraint — Claude Code skills must be single SKILL.md files with all instructions inline

### A3: Model Selection for Execution
- **Default**: Use `sonnet` as the execution model
- **Rationale**: Standard model for task-type skills; recommendation logic doesn't require opus-level reasoning

### A4: Hardware Profile Path
- **Default**: Read hardware profile from `config/hardware-profile.json`
- **Rationale**: Only hardware profile in the project, no alternative location

### A5: Report Naming Convention
- **Default**: `model_rec_YYYY-MM-DD_[use-case-slug].md`
- **Rationale**: Matches the existing `model_eval_YYYY-MM-DD_[slug].md` pattern with appropriate prefix change

## Key Decisions

### D1: Scoring Formula Approach
- **Options**:
  - A) Weighted percentage — RAM fit (40%), VRAM fit (40%), context fit (20%) — recommended
  - B) Binary pass/fail per dimension, then rank by headroom
  - C) Single composite ratio (available/required) averaged across dimensions
- **Recommendation**: A, because weighted percentage lets us tune importance per dimension and produces a continuous score for ranking
- **Risk if wrong**: Wrong weights could rank a model with plenty of RAM but insufficient VRAM above a model that actually runs well

### D2: Use-Case Filtering Strategy
- **Options**:
  - A) Strict tag match — only show models tagged with the requested use-case — recommended
  - B) Fuzzy match — show tagged models first, then "might also work" models without the tag
- **Recommendation**: A, because fuzzy matching risks confusing recommendations and the catalog tags are comprehensive
- **Risk if wrong**: Strict filtering might miss capable models that lack tags (catalog completeness issue)

### D3: Top-N Presentation Count
- **Options**:
  - A) Top 5 models — recommended
  - B) Top 3 models
  - C) All models that score above "acceptable_fit" threshold
- **Recommendation**: A, because 5 gives enough variety without overwhelming, and the user can always ignore lower-ranked results
- **Risk if wrong**: Too many results dilute the recommendation quality; too few might miss a good option
