# Phase 4: Multi-Specialist Coordination Test

## Objective
Validate that multiple specialists can work on the same project, at different depth levels, and that cross-blueprint dependency checking catches inconsistencies.

## Test Cases

### Test 4A: Light Mode Specialist (Legal-Analyst, Task 4)
- **Task**: Landlord Registration & Compliance Checklist
- **Depth**: Light (autonomous — no user gate)
- **Expected**: Single subagent writes stage1 + blueprint in one pass (abbreviated exploration, no decisions presented to user)
- **Pass criteria**: Blueprint produced without user interaction, covers all acceptance criteria

### Test 4B: Standard Mode Specialist (Financial-Analyst, Task 2)
- **Task**: Rental Market Analysis
- **Depth**: Standard (confirmatory gate)
- **Expected**: Stage 1 produces abbreviated findings (Research + Approach + 1-2 decisions), user gate confirms, Stage 2 produces blueprint
- **Pass criteria**: User gate triggers with fewer decisions than Deep mode, blueprint covers all acceptance criteria

### Test 4C: Cross-Blueprint Dependency Check
- **Input**: Task 4 blueprint (legal) + Task 1 blueprint (legal, from Phase 3b) + Task 2 blueprint (financial)
- **Check**: Haiku scans all blueprints for shared assumptions, conflicting terms, missing cross-references
- **Pass criteria**: Detects any inconsistencies (or confirms consistency) with specific evidence

## Execution Order
1. Test 4A (Light, parallel-safe — no user interaction needed)
2. Test 4B (Standard, needs user gate)
3. Test 4C (dependency check, needs 4A + 4B complete)

## Project Context
Same as Phase 3: property_facts.md + nh_landlord_tenant_notes.md
Plan: docs/v9/test/phase2/mock_plan.md (Tasks 2 and 4)
