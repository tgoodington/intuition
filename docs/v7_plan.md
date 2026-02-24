# Intuition v7.0 — Execution Plan

## Plan-Execute Contract v1.0 | Standard Tier

---

## 1. Objective

Intuition v7.0 introduces a branch/trunk workflow model and a new coding expert skill (`intuition-engineer`). The trunk represents the first prompt-to-execute cycle as a permanent foundation; branches enable subsequent independent cycles that build on, extend, or diverge from trunk or other completed branches. The engineer skill provides post-execution holistic troubleshooting with subagent delegation, serving as both a user-invoked diagnostic tool and a Senior Engineer subagent available to execute.

---

## 2. Discovery Summary

- **Problem**: v6.0 treats each workflow cycle as a standalone pass. Users who complete execution and want to iterate must start from scratch with no lineage tracking, no awareness of prior plans, and no way to fix issues without re-running the full workflow.
- **Goals**: (1) Enable iterative development through a branch/trunk model where each cycle is context-aware of its parent. (2) Provide a dedicated troubleshooting skill that can diagnose and fix issues holistically without re-running the workflow. (3) Unify file path resolution across all skills via a `context_path` abstraction.
- **Constraints**: State schema must migrate from v3.0 to v4.0 with backward compatibility. SKILL.md files must stay under 500 lines. Handoff remains the sole state writer. Start remains read-only. All behavioral instructions must live in SKILL.md (reference files are not auto-loaded).
- **Key Findings**: Every skill that reads or writes workflow artifacts needs context-path awareness. Handoff undergoes the heaviest changes (branch creation, tree state management, migration logic). The engineer skill is fully specified in the design document. Plan gains a new Parent Context section and a third research subagent for branch intersection analysis. Execute gains a Senior Engineer (opus) subagent tier.

---

## 3. Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Context path abstraction | Dynamic `{context_path}` resolved from `active_context` in state | Single formula used by all skills; trunk resolves to `docs/project_notes/trunk/`, branches to `docs/project_notes/branches/{key}/` |
| State schema structure | v4.0: top-level `trunk` object + `branches` map + `active_context` | Each context gets its own independent workflow pipeline; `active_context` drives all path resolution |
| Shared vs isolated memory | Shared files (`key_facts.md`, `decisions.md`, `issues.md`, `bugs.md`) at root; workflow artifacts isolated per context | Project-wide knowledge accumulates; workflow artifacts stay scoped to their cycle |
| Engineer model | opus | Holistic codebase reasoning requires the strongest model; delegates code changes to sonnet subagents |
| Senior Engineer subagent (execute) | opus | Complex multi-file tasks with architectural implications need holistic reasoning |
| Migration strategy | Auto-migration in handoff (detect v3.0, restructure to v4.0) + initialize offers upgrade | Seamless for existing projects; deliberate option also available |
| Branch lineage | `created_from` field in branch entry | Enables plan to read parent context for intersection analysis; supports tree structures (branch from branch) |
| Post-completion routing | Start presents two choices (create branch / open engineer) | Replaces the dead-end "complete" state with actionable next steps |

---

## 6. Task Sequence

### Task 1: Update state template and initialize skill

- **Component**: `intuition-initialize`
- **Description**: Update the state template JSON from v3.0 to v4.0 schema. Update the initialize skill's SKILL.md to create `trunk/` and `branches/` directories during project setup. Update the CLAUDE.md template to describe the trunk-and-branch model and engineer skill. Update the INTUITION.md template to include branch workflow and engineer skill in the skill table.
- **Acceptance Criteria**:
  1. `state_template.json` matches the v4.0 schema exactly as specified in design spec Section 3 (includes `active_context`, `trunk` object, `branches` map, version `"4.0"`)
  2. Initialize SKILL.md creates `docs/project_notes/trunk/` and `docs/project_notes/branches/` directories during initialization
  3. CLAUDE.md template includes trunk/branch model description, engineer skill mention, and updated workflow flow
  4. INTUITION.md template includes engineer skill in the skill table and branch workflow in the quick start
- **Dependencies**: None
- **Files**:
  - `C:\Projects\Intuition\skills\intuition-initialize\references\state_template.json`
  - `C:\Projects\Intuition\skills\intuition-initialize\SKILL.md`
  - `C:\Projects\Intuition\skills\intuition-initialize\references\claude_template.md`
  - `C:\Projects\Intuition\skills\intuition-initialize\references\intuition_readme_template.md`

---

### Task 2: Update handoff skill — context path resolution and state writes

- **Component**: `intuition-handoff`
- **Description**: Update handoff to resolve `active_context` and `context_path` before every transition. All file path references change from hardcoded `docs/project_notes/` to `{context_path}`. All state writes target the correct context object (`state.trunk` or `state.branches[active_context]`). Embed the v4.0 state schema. Update the transition detection tree to read the active context's workflow object.
- **Acceptance Criteria**:
  1. Handoff resolves `context_path` from `active_context` at the start of every transition (trunk maps to `docs/project_notes/trunk/`, branches map to `docs/project_notes/branches/{key}/`)
  2. All five existing transitions (prompt->plan, plan->design, design->design, design->execute, plan->execute, execute->complete) use `{context_path}` for all artifact file references
  3. State writes update the correct context object based on `active_context`
  4. Embedded state schema is v4.0
- **Dependencies**: Task 1
- **Files**:
  - `C:\Projects\Intuition\skills\intuition-handoff\SKILL.md`
  - `C:\Projects\Intuition\skills\intuition-handoff\references\handoff_core.md`

---

### Task 3: Update handoff skill — branch creation and v3 migration

- **Component**: `intuition-handoff`
- **Description**: Add Transition 0 (branch creation) to handoff. When start routes to handoff with branch creation intent, handoff validates the branch name, creates the branch directory, adds the branch entry to state, sets `active_context` to the new branch, and routes user to `/intuition-prompt`. Also implement v3.0-to-v4.0 auto-migration: detect v3.0 state, create `trunk/` directory, move existing artifacts, restructure state to v4.0. Update the execute->complete transition to route to `/intuition-start` instead of `/intuition-prompt`.
- **Acceptance Criteria**:
  1. Branch creation transition validates kebab-case name, rejects duplicate branch keys, creates `docs/project_notes/branches/{key}/` directory, adds branch entry with `display_name`, `created_from`, `created_at`, `purpose`, and full workflow object
  2. After branch creation, `active_context` is set to the new branch key and user is routed to `/intuition-prompt`
  3. When handoff detects a v3.0 state file (version "3.0" or missing `active_context`), it auto-migrates: creates trunk directory, moves artifacts, restructures state to v4.0
  4. Execute->complete transition routes to `/intuition-start` (not `/intuition-prompt`)
- **Dependencies**: Task 2
- **Files**:
  - `C:\Projects\Intuition\skills\intuition-handoff\SKILL.md`
  - `C:\Projects\Intuition\skills\intuition-handoff\references\handoff_core.md`

---

### Task 4: Update start skill — post-completion routing and status tree

- **Component**: `intuition-start`
- **Description**: Add post-completion phase detection to start. When any context is complete and no context is in-progress, display a status tree and present the two-choice flow (create branch or open engineer). Add context-path awareness for reading artifacts. Add v3.0 detection with migration warning. Start remains read-only (no Write tool).
- **Acceptance Criteria**:
  1. When trunk or any branch has `status == "complete"` and no context is in-progress, start displays the status tree and presents two options via AskUserQuestion: "Create a new branch" or "Troubleshoot an issue"
  2. Status tree shows trunk and all branches with their status, purpose, and lineage
  3. "Create a new branch" path collects branch name, purpose, and parent context, then routes to `/intuition-handoff`
  4. Start detects v3.0 state and warns user to run `/intuition-handoff` or `/intuition-initialize` to upgrade
  5. Start does NOT use the Write tool anywhere in its protocol
- **Dependencies**: Task 2
- **Files**:
  - `C:\Projects\Intuition\skills\intuition-start\SKILL.md`
  - `C:\Projects\Intuition\skills\intuition-start\references\start_core.md`

---

### Task 5: Update prompt skill — context-path awareness

- **Component**: `intuition-prompt`
- **Description**: Update prompt to read `active_context` from state on startup and resolve `context_path`. Change all file write paths to use `{context_path}` (discovery_brief.md, discovery_output.json). Update resume logic to check `{context_path}` for existing files. When running on a branch, include branch lineage context in the opening message.
- **Acceptance Criteria**:
  1. Prompt reads `.project-memory-state.json` on startup and resolves `context_path` from `active_context`
  2. All output files are written to `{context_path}/` (not `docs/project_notes/` directly)
  3. When `active_context` is a branch, the opening message includes branch display_name, parent context, and branch purpose
  4. A critical rule is added: "NEVER write to the root `docs/project_notes/` — always write to the resolved context_path"
- **Dependencies**: Task 2
- **Files**:
  - `C:\Projects\Intuition\skills\intuition-prompt\SKILL.md`

---

### Task 6: Update plan skill — branch intersection and context-path

- **Component**: `intuition-plan`
- **Description**: Update plan to resolve `context_path` from `active_context` on startup. Change all file read/write paths to use `{context_path}`. When planning on a branch, read the parent context's plan.md, add a third orientation research subagent for parent intersection analysis, and include a new Section 2.5 (Parent Context) in the output plan. Extend ARCH framework's Reach dimension to include parent intersection on branches.
- **Acceptance Criteria**:
  1. Plan reads `.project-memory-state.json` on startup and resolves `context_path`
  2. All artifact reads (discovery_brief, planning_brief) and writes (plan.md, .planning_research/) use `{context_path}`
  3. When `active_context` is a branch, plan reads the parent's plan.md and launches a third research subagent for parent intersection analysis, writing results to `{context_path}/.planning_research/parent_intersection.md`
  4. Branch plans include Section 2.5 (Parent Context) with shared components, inherited decisions, intersection points, and divergence
  5. A critical rule is added about inherited architectural decisions being binding unless user overrides
- **Dependencies**: Task 2
- **Files**:
  - `C:\Projects\Intuition\skills\intuition-plan\SKILL.md`
  - `C:\Projects\Intuition\skills\intuition-plan\references\magellan_core.md`
  - `C:\Projects\Intuition\skills\intuition-plan\references\sub_agents.md`

---

### Task 7: Update design skill — context-path awareness

- **Component**: `intuition-design`
- **Description**: Update design to resolve `context_path` from `active_context` on startup. Change all file read/write paths to use `{context_path}`. When designing on a branch, optionally read parent design specs for related components to inform the ECD exploration.
- **Acceptance Criteria**:
  1. Design reads `.project-memory-state.json` on startup and resolves `context_path`
  2. All artifact reads (plan.md, design_brief.md) and writes (design_spec_*.md) use `{context_path}`
  3. When designing on a branch with a parent that has design specs for related components, design reads them for context
- **Dependencies**: Task 2
- **Files**:
  - `C:\Projects\Intuition\skills\intuition-design\SKILL.md`

---

### Task 8: Update execute skill — Senior Engineer subagent and context-path

- **Component**: `intuition-execute`
- **Description**: Update execute to resolve `context_path` from `active_context` on startup. Change all file read paths to use `{context_path}`. Add the Senior Engineer (opus) subagent to the available subagents table with usage criteria (3+ interdependent files, architectural implications, tasks with design specs). Include the holistic protocol in the Senior Engineer prompt template. Add branch-aware execution notes to subagent prompts when on a branch.
- **Acceptance Criteria**:
  1. Execute reads `.project-memory-state.json` on startup and resolves `context_path`
  2. All artifact reads (plan.md, design specs, execution_brief) use `{context_path}`
  3. Senior Engineer (opus) subagent is defined in the subagents table with clear usage criteria and a prompt template that includes holistic protocol steps
  4. A critical rule mandates Senior Engineer delegation for tasks with design specs or touching 3+ interdependent files
  5. When executing on a branch, subagent prompts include parent context awareness
- **Dependencies**: Task 2
- **Files**:
  - `C:\Projects\Intuition\skills\intuition-execute\SKILL.md`
  - `C:\Projects\Intuition\skills\intuition-execute\references\faraday_core.md`
  - `C:\Projects\Intuition\skills\intuition-execute\references\sub_agents.md`

---

### Task 9: Create engineer skill

- **Component**: `intuition-engineer` (new)
- **Description**: Create the new `intuition-engineer` skill directory and SKILL.md. The engineer is an opus-level holistic troubleshooter that works on completed contexts. It follows a 9-step protocol: context selection, artifact loading, issue description, holistic investigation (trace symptom, map blast radius, check upstream/downstream, cross-reference plan, check patterns), diagnosis presentation, fix delegation to subagents, verification, and reporting. Delegates code changes to sonnet subagents with holistic context. Logs all fixes to `docs/project_notes/bugs.md`.
- **Acceptance Criteria**:
  1. `C:\Projects\Intuition\skills\intuition-engineer\SKILL.md` exists with correct YAML frontmatter (name, description, model: opus, tools list, allowed-tools list)
  2. SKILL.md implements the full 9-step protocol as specified in design spec Section 4
  3. All 10 critical rules from the design spec are present in the SKILL.md
  4. Subagent table defines Code Writer (sonnet), Research/Explorer (haiku), Test Runner (haiku), and Impact Analyst (haiku) with usage criteria
  5. SKILL.md is under 500 lines
- **Dependencies**: None
- **Files**:
  - `C:\Projects\Intuition\skills\intuition-engineer\SKILL.md` (new file)

---

### Task 10: Update install and uninstall scripts

- **Component**: Install scripts
- **Description**: Add `intuition-engineer` to the skills array in `install-skills.js`. Add the corresponding log line for the new skill. Add `intuition-engineer` to the cleanup list in `uninstall-skills.js`.
- **Acceptance Criteria**:
  1. `install-skills.js` skills array includes `'intuition-engineer'` between `'intuition-execute'` and `'intuition-initialize'`
  2. Install success message includes a log line for `/intuition-engineer`
  3. `uninstall-skills.js` skillsToRemove array includes `'intuition-engineer'`
- **Dependencies**: Task 9
- **Files**:
  - `C:\Projects\Intuition\scripts\install-skills.js`
  - `C:\Projects\Intuition\scripts\uninstall-skills.js`

---

### Task 11: Update initialize reference templates

- **Component**: Initialize reference files
- **Description**: Update the planning_brief_template, execution_brief_template, and design_brief_template to use `{context_path}` placeholder references where they mention file paths. These templates are used by handoff to generate briefs, so they need to reflect the new path structure.
- **Acceptance Criteria**:
  1. Brief templates reference `{context_path}/` for workflow artifact paths instead of hardcoded `docs/project_notes/`
  2. Templates remain valid as standalone reference documents
- **Dependencies**: None
- **Files**:
  - `C:\Projects\Intuition\skills\intuition-initialize\references\planning_brief_template.md`
  - `C:\Projects\Intuition\skills\intuition-initialize\references\execution_brief_template.md`
  - `C:\Projects\Intuition\skills\intuition-initialize\references\design_brief_template.md`

---

### Task 12: Update MEMORY.md

- **Component**: Project memory
- **Description**: Update MEMORY.md with v7.0 project overview (11 skills, trunk-and-branch model), updated skill list (add engineer), updated state ownership (v4.0 schema), updated workflow architecture (branch model, Senior Engineer, context_path), updated handoff transitions (Transition 0, post-completion routing), and updated install script notes. All updates are specified verbatim in design spec Section 13.
- **Acceptance Criteria**:
  1. Project Overview reflects v7.0 (11 skills, trunk-and-branch workflow, state schema v4.0)
  2. All Skills section lists 11 skills with engineer included and updated descriptions
  3. Handoff Transitions section includes Transition 0 (branch creation) and post-completion routing
  4. Workflow Architecture section describes branch model, context_path resolution, Senior Engineer subagent, and shared memory
- **Dependencies**: All other tasks (Task 12 is the final documentation task)
- **Files**:
  - `C:\Users\tgoodington\.claude\projects\C--Projects-Intuition\memory\MEMORY.md`

---

## 6.5. Design Recommendations

All tasks are **ready for execution**. The design specification at `C:\Projects\Intuition\docs\v7_design_spec.md` provides the full behavioral specification for every skill change:

| Task | Design Reference |
|------|-----------------|
| Task 1 (Initialize + templates) | Spec Sections 11, 3 (state schema) |
| Task 2 (Handoff: context-path + state writes) | Spec Section 10 (path resolution, state writes, transition detection) |
| Task 3 (Handoff: branch creation + migration) | Spec Sections 10 (Transition 0), 14 (migration path) |
| Task 4 (Start: post-completion) | Spec Section 5 |
| Task 5 (Prompt: context-path) | Spec Section 6 |
| Task 6 (Plan: branch intersection) | Spec Section 7 |
| Task 7 (Design: context-path) | Spec Section 8 |
| Task 8 (Execute: Senior Engineer) | Spec Section 9 |
| Task 9 (Engineer: new skill) | Spec Section 4 (complete SKILL.md specification) |
| Task 10 (Install scripts) | Spec Section 12 |
| Task 11 (Brief templates) | Spec Section 2 (folder structure, path resolution) |
| Task 12 (MEMORY.md) | Spec Section 13 (verbatim update text provided) |

No additional design exploration is needed. The design spec is the design output.

---

## 7. Testing Strategy

### Per-Skill Verification

1. **Initialize**: Run `/intuition-initialize` on a fresh project. Verify `trunk/` and `branches/` directories are created, state file is v4.0 schema, CLAUDE.md mentions trunk/branch model, INTUITION.md lists engineer skill.

2. **Handoff — context-path**: Run a trunk workflow through prompt->handoff->plan. Verify all artifacts land in `docs/project_notes/trunk/` (not the root). Verify state writes update `state.trunk.workflow`.

3. **Handoff — branch creation**: After trunk completes, route from start to handoff with branch info. Verify branch directory is created, state has branch entry with correct fields, `active_context` is set to new branch.

4. **Handoff — v3 migration**: Take a project with v3.0 state and existing artifacts at `docs/project_notes/`. Run `/intuition-handoff`. Verify artifacts move to `trunk/`, state restructures to v4.0, shared files stay at root.

5. **Start — post-completion**: With a completed trunk, run `/intuition-start`. Verify status tree displays, two choices are presented. Select "Create a branch" and verify name/purpose/parent collection. Select "Troubleshoot" and verify routing to `/intuition-engineer`.

6. **Prompt — branch context**: Create a branch, then run `/intuition-prompt`. Verify opening message mentions branch name, parent, and purpose. Verify output files go to `docs/project_notes/branches/{key}/`.

7. **Plan — branch intersection**: Run `/intuition-plan` on a branch. Verify it reads parent's plan.md, launches intersection analysis subagent, and outputs plan with Section 2.5 (Parent Context).

8. **Design — branch context**: Run `/intuition-design` on a branch. Verify it reads/writes from `{context_path}` and checks parent design specs if relevant.

9. **Execute — Senior Engineer**: Run `/intuition-execute` on a task flagged for design. Verify it delegates to Senior Engineer (opus) subagent instead of standard Code Writer. Verify branch-aware prompts when on a branch.

10. **Engineer**: With a completed context, run `/intuition-engineer`. Verify context selection, artifact loading, issue prompting, and that it attempts holistic investigation before proposing fixes.

11. **Install scripts**: Run `node scripts/install-skills.js`. Verify `intuition-engineer` directory appears in `~/.claude/skills/`. Run uninstall and verify cleanup.

### Integration Test

Run a full trunk workflow (prompt -> handoff -> plan -> handoff -> execute -> handoff), then create a branch, run its full workflow, then invoke the engineer on the completed trunk. Verify all paths resolve correctly and state tracks both contexts independently.

---

## 8. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Context-path bugs (wrong path resolution) | Artifacts written to wrong directory, state corruption | Medium | Every skill uses the same resolution formula; test with both trunk and branch active contexts |
| State migration data loss | Existing project artifacts lost during v3->v4 migration | Low | Migration moves files (not deletes); recommend users back up `docs/project_notes/` before upgrading |
| Handoff complexity explosion | SKILL.md exceeds 500-line limit with branch creation + migration + existing transitions | Medium | Move detailed migration logic to a migration section within the SKILL.md; keep the protocol flow concise with clear conditional branches |
| SKILL.md length limits (engineer) | Engineer's 9-step protocol plus critical rules may exceed 500 lines | Medium | Write concisely; the design spec is verbose for clarity but the SKILL.md should use compressed imperative directives |
| Branch-from-branch depth | Deep branch trees could create complex lineage | Low | v7.0 supports it structurally but documentation should recommend shallow trees; deeper support can be refined in v8.0 |
| Senior Engineer subagent cost | Opus subagent invocations are expensive | Low | Usage criteria gate: only for 3+ file tasks with dependencies or design specs; standard Code Writer handles everything else |
| v3 backward compatibility burden | Dual-schema support adds conditional logic to every skill | Medium | Only handoff and initialize handle migration; other skills warn and suggest migration rather than handling both schemas |

---

## 10. Execution Notes

### Recommended Execution Order

**Wave 1 — Foundation (no dependencies)**:
- Task 1 (Initialize + state template)
- Task 9 (Engineer skill — new file, no dependencies)
- Task 11 (Brief templates — independent reference files)

**Wave 2 — State owner (depends on Task 1)**:
- Task 2 (Handoff: context-path + state writes)

**Wave 3 — Handoff completion (depends on Task 2)**:
- Task 3 (Handoff: branch creation + migration)

**Wave 4 — Downstream skills (depend on Task 2, can run in parallel)**:
- Task 4 (Start)
- Task 5 (Prompt)
- Task 6 (Plan)
- Task 7 (Design)
- Task 8 (Execute)

**Wave 5 — Finalization (depend on previous waves)**:
- Task 10 (Install scripts — depends on Task 9)
- Task 12 (MEMORY.md — last, after all changes are confirmed)

### Parallelization Opportunities

- Tasks 1, 9, and 11 are fully independent and can execute simultaneously.
- Tasks 4, 5, 6, 7, and 8 are independent of each other (all depend only on Task 2) and can execute simultaneously.
- Task 10 only needs Task 9 complete, so it can run as soon as the engineer skill is written.

### Watch Points

- **Handoff is the critical path.** Tasks 2 and 3 must be correct before any downstream skill can be verified in integration. Spend extra verification time here.
- **SKILL.md line counts.** Handoff and engineer are at highest risk of exceeding 500 lines. Monitor during execution and compress if needed.
- **Context-path consistency.** Every skill must use the identical resolution formula. A typo in one skill (e.g., `branches` vs `branch`) creates subtle path bugs. Use the exact formula from design spec Section 2.
- **State write isolation.** Only handoff and initialize write state. If any other skill accidentally gains Write access to `.project-memory-state.json`, it violates the core architectural constraint.
- **The design spec at `C:\Projects\Intuition\docs\v7_design_spec.md` contains the full behavioral specifications for every skill change.** Execution should read the relevant section of the design spec before implementing each task — the spec provides exact protocol flows, prompt templates, critical rules, and schema definitions.
