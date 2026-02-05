# Testing Resources for Waldo v3

This directory now contains comprehensive documentation for understanding and testing Waldo v3 (version 3.0.0) - a major architectural upgrade from v2.

## Quick Navigation

### For Understanding the Architecture
1. **TESTING_SUMMARY.md** - START HERE
   - Executive summary of v3 changes
   - Current project state
   - Major architectural changes
   - Five-skill orchestration
   - Testing scope and recommendations
   - 10+ pages of comprehensive context

2. **SKILL_INTERACTION_GUIDE.md** - How Skills Work Together
   - Detailed spec for each of the 5 skills
   - Memory file ownership chart
   - Data flow diagrams
   - Common workflows
   - Troubleshooting guide
   - File sizes and performance notes

3. **QUICK_TEST_CHECKLIST.md** - For Running Tests
   - Pre-testing validation
   - 11 focused test sessions
   - Edge case testing
   - Success criteria
   - Test report template

### Original Documentation
- **WALDO_V3_COMPLETE_DOCUMENTATION.md** - Full v3 implementation guide
- **WALDO_V3_DESIGN_SUMMARY.md** - Design philosophy and rationale
- **docs/intuition-architecture.md** - System design overview
- **docs/intuition-workflow.md** - Workflow explanation
- **docs/PROJECT_CONTEXT.md** - Current v2 context (being superseded)

### Skill References
- **skills/intuition-discovery/references/waldo_core.md** - Waldo v3 implementation
- **skills/intuition-handoff/references/handoff_core.md** - Handoff orchestration
- **skills/intuition-plan/references/magellan_core.md** - Planning logic
- **skills/intuition-execute/references/faraday_core.md** - Execution logic

## Testing Path

### Phase 1: Understanding (2-3 hours)
1. Read TESTING_SUMMARY.md (Executive Summary through Part 5)
2. Review SKILL_INTERACTION_GUIDE.md (The Five Skills at a Glance)
3. Understand the dual dialogue modes and user profile system

### Phase 2: Preparation (1 hour)
1. Review QUICK_TEST_CHECKLIST.md "Pre-Testing Validation"
2. Verify all skills are installed
3. Confirm v3.0.0 in package.json
4. Set up test project directory

### Phase 3: Testing (4-6 hours depending on depth)
1. Run Test Session 1-4 (Core functionality)
2. Run Test Session 5 (Skill coordination)
3. Run Test Session 6-11 (Specialized testing)
4. Document findings in test report

### Phase 4: Reporting (1-2 hours)
1. Compile results using template in QUICK_TEST_CHECKLIST.md
2. Categorize issues by severity
3. Make go/no-go decision
4. Document recommendations for production

## What Changed in v3

### Major Changes
1. **Waldo Redesign** - From interrogator to research-informed thinking partner
2. **Dual Dialogue Modes** - Guided (structured) and Open-Ended (natural)
3. **User Profile System** - Persistent cross-project profile
4. **Handoff Orchestration** - Explicit phase coordinator
5. **Profile Integration** - All skills read profile for personalization

### Files Created (v3)
- `.claude/USER_PROFILE.json` - Global persistent user profile
- `.claude/USER_PROFILE_template.json` - Template
- `WALDO_V3_COMPLETE_DOCUMENTATION.md` - Full implementation guide
- `WALDO_V3_DESIGN_SUMMARY.md` - Design philosophy
- Testing documentation (this file + others)

### Files Modified (v3)
- `skills/intuition-discovery/references/waldo_core.md` - Complete redesign
- `skills/intuition-discovery/SKILL.md` - Updated description
- `skills/intuition-handoff/references/handoff_core.md` - Profile integration
- `skills/intuition-plan/references/magellan_core.md` - Profile reading
- `skills/intuition-execute/references/faraday_core.md` - Profile reading
- `package.json` - Version 3.0.0

## Key Architectural Concepts

### Research-Informed Thinking Partnership
Waldo now launches research agents immediately, then engages as a knowledgeable peer who brings insights to dialogue.

### Dual Dialogue Modes
- **Guided:** Structured options (AskUserQuestion)
- **Open-Ended:** Natural conversational flow
- Both produce identical discovery outcomes
- User choice determines dialogue style only

### Persistent User Profile
- Located in `.claude/USER_PROFILE.json` (global)
- Naturally discovered through dialogue
- Merged by Handoff after each discovery
- Read by Magellan and Faraday for personalization
- Tracks role, expertise, communication style, motivation, etc.
- Includes confidence scores for each property
- Tracks which projects informed each property

### File-Based Handoffs
All skill communication happens through files (not APIs):
- Discovery → `discovery_brief.md` + `discovery_output.json`
- Handoff → `planning_brief.md` or `execution_brief.md`
- Planning → `plan.md`
- Execution → Implemented code + updated memory

### Five-Skill Orchestration
```
/intuition-start → Load context, suggest next step
  ↓
/intuition-discovery → Research + dialogue, create discovery outputs
  ↓
/intuition-handoff → Extract insights, update memory, merge profile, create planning brief
  ↓
/intuition-plan → Synthesize plan, personalize based on profile
  ↓
/intuition-handoff → Prepare execution brief
  ↓
/intuition-execute → Implement, update memory, personalize based on profile
```

## Success Criteria

### Functional
- ✅ Waldo launches research agents in parallel
- ✅ Dual modes produce equivalent outcomes with different style
- ✅ User profile discovered naturally and merged accurately
- ✅ Handoff detects transitions and updates memory correctly
- ✅ All five skills coordinate via file-based handoffs
- ✅ Resume capability works across all phases

### Quality
- ✅ Waldo feels like thinking partner, not interrogator
- ✅ "Yes, and..." building is evident
- ✅ Gentle steering is respectful
- ✅ 1-2 questions per turn feels natural
- ✅ Cross-sector capability works
- ✅ Personalization from profile is noticeable

### Architecture
- ✅ No breaking changes to v2 workflows
- ✅ File-based architecture maintained
- ✅ Tool-agnostic (works across Claude Code, Cursor, Copilot)
- ✅ Security review enforcement maintained

## Important Notes for Testers

1. **Always Check State:** Review `.project-memory-state.json` after each phase - it's the source of truth for workflow status

2. **Profile is Cross-Project:** `.claude/USER_PROFILE.json` is NOT in docs/project_notes/ - it's global

3. **Handoff is Critical:** Never skip handoff between phases. It updates memory and merges profile.

4. **Research is Parallel:** All 3 research agents should launch simultaneously in Waldo's first substantive message

5. **Dialogue Modes are Equivalent:** Both modes should explore same GAPP dimensions with same depth - only style differs

6. **Confidence Scoring Matters:** Profile merge logic uses confidence scores to avoid overwriting with uncertain data

7. **Resume from Files:** All resume capability comes from reading state.json - test this explicitly

## Getting Help During Testing

If you encounter issues:

1. **Check SKILL_INTERACTION_GUIDE.md "Troubleshooting Guide"** - covers common issues
2. **Review relevant skill's core.md** - detailed implementation patterns
3. **Check state.json** - often reveals the actual issue
4. **Consult QUICK_TEST_CHECKLIST.md** - may have a similar test scenario

## Version Info

- **Current Version:** 3.0.0
- **Latest Commit:** bbfa9ff - "feat: Waldo v3 - Research-informed thinking partnership..."
- **Major Changes:** Dual dialogue modes, persistent user profile, handoff orchestration
- **Status:** Production Ready - Ready for Testing

## Documents at a Glance

| Document | Purpose | Length | When to Read |
|----------|---------|--------|------------|
| **TESTING_SUMMARY.md** | Comprehensive project overview | 20+ pages | First - understanding |
| **SKILL_INTERACTION_GUIDE.md** | How skills work together | 15+ pages | Before testing |
| **QUICK_TEST_CHECKLIST.md** | Test execution guide | 10+ pages | During testing |
| **WALDO_V3_COMPLETE_DOCUMENTATION.md** | Full implementation guide | 30+ pages | Deep dives |
| **WALDO_V3_DESIGN_SUMMARY.md** | Design philosophy | 15+ pages | Understanding rationale |

## Next Steps

1. **Read TESTING_SUMMARY.md** to understand what changed and why
2. **Read SKILL_INTERACTION_GUIDE.md** to understand how skills work together
3. **Use QUICK_TEST_CHECKLIST.md** to systematically test functionality
4. **Document findings** using the test report template
5. **Make go/no-go decision** based on success criteria

---

**Ready to test?** Start with TESTING_SUMMARY.md. It's the complete context you need.

**Questions?** Consult the skill-specific core.md files and the troubleshooting guide in SKILL_INTERACTION_GUIDE.md.

**Let's ship it!**
