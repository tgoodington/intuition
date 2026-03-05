# Confidence Scoring

## Overview

Confidence scoring helps distinguish between well-understood tasks and those with uncertainty. This allows The Architect to prioritize and adjust execution strategy accordingly.

## Scoring Levels

### High Confidence
**Definition:** Well-understood, clear path forward, low uncertainty

**Characteristics:**
- Clear implementation approach
- Similar work done before in project
- Established patterns or conventions available
- Low risk of unexpected issues
- Well-defined acceptance criteria
- Team has experience with this type of work

**Example Tasks:**
- "Add new API endpoint following existing patterns"
- "Update documentation to match code changes"
- "Run existing test suite"
- "Implement feature using established library/framework"

### Medium Confidence
**Definition:** Reasonable approach but some unknowns

**Characteristics:**
- Generally understood approach
- Some aspects require research or investigation
- Minor unknowns that can be resolved during execution
- Moderate complexity
- Some similar patterns in codebase but not identical
- May require some experimentation

**Example Tasks:**
- "Integrate new third-party service (researched but not yet integrated)"
- "Refactor existing module for better performance"
- "Add new database feature with custom logic"
- "Implement feature using less familiar technology"

### Low Confidence
**Definition:** Significant uncertainty, may need iteration

**Characteristics:**
- Unclear implementation approach
- Novel for the team/project
- Multiple possible solutions with trade-offs
- Significant unknowns or research gaps
- High complexity
- May require architectural decisions
- Likely to need iteration or exploration

**Example Tasks:**
- "Redesign authentication system" (significant change)
- "Integrate with completely unfamiliar external system"
- "Implement novel feature with unclear requirements"
- "Solve problem with multiple viable approaches"

## Application

### Confidence in Assumptions

Rate assumptions about project state and requirements:

```markdown
## Assumptions
- Assumption 1: We'll continue using current authentication approach - Confidence: High
- Assumption 2: Integration with new service will follow existing patterns - Confidence: Medium
- Assumption 3: Performance requirements are achievable with current architecture - Confidence: Low
```

### Confidence in Tasks

Rate each task in the plan:

```markdown
## Tasks
1. [ ] Task 1 - Create User model
   - Confidence: High
   - Rationale: We have clear patterns for models in this project

2. [ ] Task 2 - Implement real-time notifications
   - Confidence: Medium
   - Rationale: We've done WebSocket work before, but this is a new use case

3. [ ] Task 3 - Optimize database query performance
   - Confidence: Low
   - Rationale: Requires investigation and performance testing
```

## Flagging Low-Confidence Items

When you identify low-confidence tasks or assumptions:

1. **Document explicitly** - Make it visible in the plan
2. **Provide rationale** - Explain why confidence is low
3. **Suggest approach** - How can confidence be increased?
4. **Call out for user attention** - Flag in Open Questions or explicitly

**Example:**
```markdown
## Open Questions

- [ ] **Low Confidence Alert:** Task 3 (optimize queries) has significant unknowns
      We should research current bottlenecks before planning detailed optimization
      Suggestion: Have Research agent investigate query performance first
```

## Confidence Throughout Execution

### Before Execution
- Use confidence scores to adjust plan detail level
- Low-confidence items may need research phase first
- Consider breaking low-confidence tasks into exploration + execution

### During Execution
- The Architect will see confidence scores
- May request clarification on low-confidence items
- May suggest different approach for low-confidence tasks

### After Execution
- Actual experience may increase or decrease confidence
- Update project knowledge for future planning

## Building Confidence

### How to Increase Confidence

1. **Research**: Delegate to Research agent to investigate unknowns
2. **Examples**: Find similar patterns in codebase
3. **Prototyping**: Suggest quick prototype or spike
4. **Expertise**: Consult with team members on complex decisions
5. **Decomposition**: Break large low-confidence tasks into smaller, better-understood pieces

### When Low Confidence is Acceptable

Low confidence is acceptable when:
- Task is exploratory in nature
- Clear mitigation strategy exists
- The Architect is aware and prepared
- User understands and approves

Low confidence is problematic when:
- It indicates insufficient planning
- Mitigation strategy is unclear
- It could derail entire plan
- User has not been informed

## Confidence vs. Complexity

Important distinction:

**High-confidence complex task:**
- Complicated to execute but well-understood approach
- Example: "Implement comprehensive test suite for new module"
- Can proceed with confidence despite complexity

**Low-confidence simple task:**
- Simple scope but unclear what needs to be done
- Example: "Choose and integrate new authentication library"
- May need research before execution

Confidence measures understanding, not difficulty.

## Common Confidence Issues

### Issue 1: Over-Confidence
**Problem:** Marking tasks High confidence without sufficient understanding
**Impact:** Execution surprises, task failures
**Solution:** Be honest about unknowns; mark items accurately

### Issue 2: Under-Confidence
**Problem:** Marking everything Low confidence due to uncertainty
**Impact:** Plan appears weak, user loses confidence
**Solution:** Increase confidence through research and decomposition

### Issue 3: Mixed Confidence
**Problem:** Plan has mixture of High and Low confidence items
**Response:** Document rationale for each; this is normal and acceptable
**Best Practice:** Flag which items need execution-time flexibility

## Reporting Confidence

In the plan's Self-Reflection Notes, summarize confidence:

```markdown
## Self-Reflection Notes

**Overall Plan Confidence:** High

- Most core tasks (1-4) are High confidence: they follow established patterns
- Task 5 (real-time notifications) is Medium confidence: new to project but researched
- Task 6 (performance optimization) is Low confidence: requires investigation

**Recommendation:** Proceed with execution. Task 6 should include research phase
before optimization begins. Tasks 1-5 can proceed in parallel.
```
