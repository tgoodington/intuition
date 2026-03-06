# Quick Testing Checklist - Waldo v3 Validation

**Use this checklist to verify critical functionality during testing.**

**Version:** 3.0.0 | **Date:** February 5, 2026

---

## Pre-Testing Validation

- [ ] Version in package.json is 3.0.0
- [ ] All skill files present (start, initialize, discovery, handoff, plan, execute)
- [ ] WALDO_V3_COMPLETE_DOCUMENTATION.md exists and is readable
- [ ] .claude/USER_PROFILE.json template exists
- [ ] Skills can be activated (npm install -g intuition)

---

## Test Session 1: Waldo v3 Core Features

### Setup
- [ ] Create test project directory
- [ ] Run `/intuition-initialize` to set up project memory
- [ ] Verify docs/project_notes/ created with all templates

### Dialogue Mode Selection
- [ ] Run `/intuition-discovery`
- [ ] Waldo greets with mode selection question
- [ ] Guided mode option available
- [ ] Open-Ended mode option available
- [ ] Can select mode without error
- [ ] Mode stored in .project-memory-state.json > discovery.dialogue_mode

### Research Agent Launch
- [ ] User describes context
- [ ] Waldo identifies domain from context
- [ ] Waldo launches 3 research tasks (check Task tool calls)
- [ ] All 3 research tasks run in parallel (not sequential)
- [ ] Research completes while dialogue continues
- [ ] Research findings are available in state

### Guided Mode Dialogue
- [ ] Questions use AskUserQuestion format
- [ ] 2-4 options presented per question
- [ ] "Other" option always available
- [ ] Never more than 2 questions per turn
- [ ] Questions informed by research findings
- [ ] "Yes, and..." building evident in dialogue
- [ ] Gentle steering (if applicable) is non-prescriptive

### Open-Ended Mode Dialogue
- [ ] Questions are conversational (no options)
- [ ] Natural dialogue flow
- [ ] Never more than 2 questions per turn
- [ ] Questions informed by research findings
- [ ] Covers same GAPP dimensions as Guided mode
- [ ] Same depth and rigor as Guided mode

### Discovery Completion
- [ ] All GAPP dimensions explored (Problem, Goals, Context, Motivation)
- [ ] Assumptions documented with confidence levels
- [ ] User profile information discovered naturally
- [ ] discovery_brief.md created with complete structure
- [ ] discovery_output.json created with structured data
- [ ] user_profile_learnings populated in discovery_output.json

---

## Test Session 2: Handoff Orchestration

### User Profile Extraction & Merging
- [ ] Handoff reads discovery_output.json
- [ ] Extracts user_profile_learnings
- [ ] .claude/USER_PROFILE.json created or updated
- [ ] Null fields populated from discovery learnings
- [ ] Existing fields NOT overwritten (unless high confidence)
- [ ] last_updated timestamp updated
- [ ] projects_contributed_to includes current project
- [ ] confidence_scores updated for each property

### Memory Updates
- [ ] key_facts.md updated with discovered facts
- [ ] Facts include dates and sources
- [ ] decisions.md updated with new ADRs (if applicable)
- [ ] ADRs include Context/Decision/Consequences
- [ ] issues.md updated with work logged
- [ ] All updates use proper formatting

### Brief Generation
- [ ] planning_brief.md created (if discovery→planning)
- [ ] planning_brief includes all required sections
- [ ] Brief is focused and actionable for Magellan
- [ ] execution_brief.md created (if planning→execution)
- [ ] execution_brief includes all required sections
- [ ] Brief is focused and actionable for Faraday

### State Transition
- [ ] workflow.status updated correctly
- [ ] Timestamps for phase starts/completes updated
- [ ] discovery.completed = true (after discovery handoff)
- [ ] planning.started = true (after discovery handoff)
- [ ] All state changes consistent

---

## Test Session 3: Dual Dialogue Mode Equivalence

### Setup
- [ ] Run /intuition-discovery in Guided mode (Project A)
- [ ] Run /intuition-discovery in Open-Ended mode (Project B)
- [ ] Use same context/topic for both

### Comparison
- [ ] discovery_brief.md content is substantially same
- [ ] GAPP coverage is equivalent
- [ ] Assumptions are equivalent
- [ ] Tone differs (options vs. conversational)
- [ ] Depth and rigor are equivalent
- [ ] Both route to /intuition-handoff

---

## Test Session 4: User Profile Persistence

### Setup
- [ ] Complete discovery in Project A
- [ ] Handoff merges profile
- [ ] Check .claude/USER_PROFILE.json has data

### Verify Persistence
- [ ] Start Project B
- [ ] .claude/USER_PROFILE.json already populated
- [ ] Magellan reads existing profile (if testing planning)
- [ ] Faraday reads existing profile (if testing execution)
- [ ] Run discovery in Project B
- [ ] New learnings merged into profile
- [ ] Profile completeness increases
- [ ] Projects list includes both projects

---

## Test Session 5: Five-Skill Coordination

### Full Flow (Discovery → Plan → Execution)
- [ ] /intuition-start shows discovery not started
- [ ] /intuition-discovery creates discovery outputs
- [ ] /intuition-start shows discovery complete
- [ ] /intuition-handoff processes discovery
- [ ] /intuition-start shows planning ready
- [ ] /intuition-plan reads planning_brief.md
- [ ] /intuition-plan creates plan.md
- [ ] /intuition-plan routes to user approval
- [ ] /intuition-handoff processes planning
- [ ] /intuition-start shows execution ready
- [ ] /intuition-execute reads execution_brief.md
- [ ] /intuition-execute completes workflow

### State Consistency
- [ ] .project-memory-state.json updated at each phase
- [ ] No data loss between phases
- [ ] File paths consistent
- [ ] Timestamps accurate and ordered

---

## Test Session 6: Resume Capability

### Interrupt & Resume Discovery
- [ ] Start /intuition-discovery
- [ ] Partial dialogue (2-3 turns)
- [ ] Interrupt (don't complete)
- [ ] Check state tracking
- [ ] Run /intuition-discovery again
- [ ] Waldo resumes from last turn
- [ ] Can complete discovery
- [ ] Quality score shows same coverage

### Interrupt & Resume Handoff
- [ ] Run /intuition-handoff (partial execution simulated)
- [ ] Interrupt mid-way through updates
- [ ] Run /intuition-handoff again
- [ ] Resumes and completes
- [ ] No duplicate updates in memory

---

## Test Session 7: File Management & State

### File Creation & Integrity
- [ ] discovery_brief.md well-formed markdown
- [ ] discovery_output.json valid JSON
- [ ] planning_brief.md well-formed markdown
- [ ] plan.md well-formed markdown
- [ ] execution_brief.md well-formed markdown
- [ ] .project-memory-state.json valid JSON (v3 schema)
- [ ] USER_PROFILE.json valid JSON

### File Organization
- [ ] All discovery files in docs/project_notes/
- [ ] USER_PROFILE.json in .claude/
- [ ] No files created outside expected locations
- [ ] File naming conventions followed

### Timestamp Accuracy
- [ ] Timestamps in ISO 8601 format
- [ ] Ordered correctly (start < complete)
- [ ] Consistent across related files

---

## Test Session 8: Cross-Sector Testing

### Test Domain 1: e-commerce
- [ ] Run /intuition-discovery with e-commerce context
- [ ] Research agents find e-commerce relevant practices
- [ ] Questions are domain-appropriate
- [ ] Profile learnings are domain-agnostic

### Test Domain 2: EdTech
- [ ] Run /intuition-discovery with EdTech context
- [ ] Research agents find EdTech relevant practices
- [ ] Questions are domain-appropriate
- [ ] Profile learnings are domain-agnostic

### Test Domain 3: Infrastructure/DevOps
- [ ] Run /intuition-discovery with DevOps context
- [ ] Research agents find infrastructure practices
- [ ] Questions are domain-appropriate
- [ ] Profile learnings are domain-agnostic

**Result:** Waldo adapts to different domains without modification

---

## Test Session 9: Edge Cases

### Missing Files
- [ ] Run handoff without discovery_output.json
- [ ] Handoff falls back to reading discovery_brief.md
- [ ] Completes with available data
- [ ] Doesn't error out

### Poor Quality Output
- [ ] Simulate incomplete discovery brief
- [ ] Handoff documents as-is (doesn't "fix")
- [ ] Quality score is low but handoff completes
- [ ] User can request re-discovery

### Confidence Scoring in Profile Merge
- [ ] Low confidence property discovered
- [ ] Profile property still null
- [ ] New low confidence value NOT overwritten
- [ ] High confidence property discovered
- [ ] Profile property with old value IS overwritten

### Corrupted State File
- [ ] Corrupt .project-memory-state.json intentionally
- [ ] Skill detects corruption
- [ ] Falls back to file existence checking
- [ ] Offers recovery option

---

## Test Session 10: Personalization (Magellan & Faraday)

### Magellan Reads Profile
- [ ] Run /intuition-plan
- [ ] Magellan reads .claude/USER_PROFILE.json
- [ ] Plan detail adjusts based on user seniority
- [ ] Communication matches user preference
- [ ] Complexity matches user expertise

### Faraday Reads Profile
- [ ] Run /intuition-execute
- [ ] Faraday reads .claude/USER_PROFILE.json
- [ ] Execution communication adjusted for user
- [ ] Team size considered in delegation
- [ ] Authority level respected in decisions

### Personalization Increases Over Time
- [ ] Cycle 1: Profile is sparse, limited personalization
- [ ] Cycle 2: Profile has more data, better personalization
- [ ] Cycle 3: Profile is comprehensive, highly personalized

---

## Test Session 11: Quality & User Experience

### Wise Confidant Model
- [ ] Waldo feels knowledgeable (not neutral)
- [ ] Research insights come through in dialogue
- [ ] User feels guided by peer, not interrogated
- [ ] Trust builds through conversation

### "Yes, and..." Building
- [ ] Waldo expands on user's ideas
- [ ] Never negates or challenges user
- [ ] Feels collaborative, not critical
- [ ] Steers gently toward efficiency

### Gentle Steering
- [ ] When flagging inefficiency, tone is respectful
- [ ] User feels aware, not lectured
- [ ] Steering is collaborative
- [ ] User retains agency and decision-making

### Question Quality
- [ ] Questions are thoughtful and relevant
- [ ] 1-2 per turn is comfortable (not overwhelming)
- [ ] Build naturally on previous responses
- [ ] Guide toward deeper understanding

---

## Critical Gate: Security Review

### Faraday Security Gate
- [ ] /intuition-execute includes security review step
- [ ] Security review is MANDATORY (not optional)
- [ ] No execution completion without security review
- [ ] Security review status is tracked in state
- [ ] All code passes security review before completion

---

## Regression Testing (v2 → v3 Compatibility)

### Project Memory Still Works
- [ ] Existing bugs.md can be updated
- [ ] Existing decisions.md can be updated
- [ ] Existing issues.md can be updated
- [ ] Existing key_facts.md can be updated
- [ ] Old project memory accessible and usable

### Workflow Still Works
- [ ] Discovery still produces outputs
- [ ] Planning still creates structured plan
- [ ] Execution still implements tasks
- [ ] No breaking changes to workflow

### Resume Still Works
- [ ] Can resume interrupted discovery
- [ ] Can resume interrupted planning
- [ ] Can resume interrupted execution
- [ ] State preservation is reliable

---

## Success Criteria

### Functional Success
- [x] All items in "Critical Gate" section pass
- [x] All items in "Test Session 1-11" sections pass
- [x] No critical errors during full workflow

### Quality Success
- [x] Wise confidant model is evident
- [x] "Yes, and..." building is noticeable
- [x] Gentle steering is effective and respectful
- [x] Questions feel natural and informed
- [x] User feels like thinking partner is engaged

### Architecture Success
- [x] File-based handoffs work correctly
- [x] State management is reliable
- [x] Memory consistency maintained
- [x] Resume capability functional
- [x] No data loss between phases

### v3 Specific Success
- [x] Dual dialogue modes work
- [x] User profile persistence works
- [x] Profile merging uses correct logic
- [x] Handoff orchestration is smooth
- [x] Research agents launch and integrate findings

---

## Test Report Template

```markdown
# Waldo v3 Testing Report

**Date:** [Date]
**Tester:** [Name]
**Version Tested:** 3.0.0

## Overview
[Summary of what was tested]

## Test Results

### Test Session 1: Waldo v3 Core Features
- [ ] Dialogue mode selection ............ [PASS/FAIL]
- [ ] Research agent launch ............. [PASS/FAIL]
- [ ] Guided mode dialogue .............. [PASS/FAIL]
- [ ] Open-ended mode dialogue .......... [PASS/FAIL]
- [ ] Discovery completion .............. [PASS/FAIL]

### Test Session 2: Handoff Orchestration
- [ ] User profile extraction ........... [PASS/FAIL]
- [ ] Memory updates .................... [PASS/FAIL]
- [ ] Brief generation .................. [PASS/FAIL]
- [ ] State transition .................. [PASS/FAIL]

[Continue for all test sessions]

## Issues Found

### Critical Issues
[List any critical blockers]

### High Priority Issues
[List important issues]

### Medium Priority Issues
[List normal issues]

### Low Priority Issues
[List minor issues]

## Recommendations

[Testing findings and suggestions]

## Sign-Off

- [x] Ready for production deployment
- [ ] Needs additional testing
- [ ] Blockers must be resolved
```

---

## Notes for Testers

1. **File Locations:** Always check `docs/project_notes/` for project-specific memory and `.claude/` for global profile

2. **State Tracking:** Review `.project-memory-state.json` after each phase to verify state consistency

3. **Mode Testing:** Test both Guided and Open-Ended modes with same context to verify equivalence

4. **Profile Building:** Use multiple projects to verify profile persistence and merging logic

5. **Research Integration:** Check that research findings are evident in question formulation (not obvious, but present)

6. **Documentation:** Refer to:
   - WALDO_V3_COMPLETE_DOCUMENTATION.md (full implementation)
   - SKILL_INTERACTION_GUIDE.md (how skills work together)
   - skills/intuition-discovery/references/waldo_core.md (detailed patterns)
   - skills/intuition-handoff/references/handoff_core.md (orchestration logic)

7. **When Tests Fail:**
   - Check state file first (often the root cause)
   - Verify file paths and locations
   - Review skill output for error messages
   - Consult documentation for expected behavior
   - Document exact failure scenario in test report

---

**Testing Complete Checklist:**
- [ ] All test sessions executed
- [ ] Results documented
- [ ] Issues categorized by severity
- [ ] Test report generated
- [ ] Go/no-go decision made
