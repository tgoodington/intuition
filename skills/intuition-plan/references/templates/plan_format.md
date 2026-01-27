# Plan Output Format

When the plan is ready, output it in this format:

```markdown
# Plan: [Title]

## Objective
[Clear statement of what will be accomplished]

## Assumptions
[Explicit list of assumptions made during planning]
- Assumption 1: [description] - Confidence: High/Medium/Low
- Assumption 2: [description] - Confidence: High/Medium/Low

## Context
[Relevant background information gathered during planning]

## Approach
[High-level strategy and rationale]

## Tasks
1. [ ] Task 1 - [Description]
   - Confidence: High/Medium/Low
   - Sub-task details
   - Acceptance criteria
   - Assigned to: [suggested sub-agent]

2. [ ] Task 2 - [Description]
   - Confidence: High/Medium/Low
   ...

## Dependencies
[Task dependencies and ordering constraints]
- Task 2 depends on Task 1
- Task 3 and 4 can run in parallel

## Security Considerations
[Security concerns identified by Security Expert]

## Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Risk 1 | High/Med/Low | High/Med/Low | [strategy] |

## Open Questions
[Any unresolved items needing user input]

## Self-Reflection Notes
[Key insights from your reflection process]
- What was refined and why
- Remaining uncertainties
```

## Format Guidelines

### Objective Section
- Clear, concise statement of what will be accomplished
- Measurable outcome when possible
- Aligned with user's stated goals

### Assumptions Section
- Every assumption should be explicitly listed
- Include confidence score (High/Medium/Low)
- Flag low-confidence assumptions for user attention

### Context Section
- Relevant background information
- Project state and constraints
- Important discoveries from exploration

### Approach Section
- High-level strategy
- Rationale for chosen approach
- Why alternatives were not selected

### Tasks Section
- Each task is a discrete, implementable unit
- Include confidence score
- Provide acceptance criteria
- Suggest assignment to specific sub-agent type
- Break down into sub-tasks if needed
- Task size: Not too big (hard to execute), not too small (too granular)

### Dependencies Section
- Clear ordering constraints
- Identify parallel execution opportunities
- Document task relationships

### Security Considerations Section
- Include findings from Security Expert sub-agent
- Identify security concerns specific to plan
- Recommend security best practices

### Risks & Mitigations Section
- Identify potential risks
- Estimate likelihood (High/Medium/Low)
- Estimate impact (High/Medium/Low)
- Provide mitigation strategy for each

### Open Questions Section
- Unresolved items needing user input
- Information gaps that could affect execution
- Clarifications needed before proceeding

### Self-Reflection Notes Section
- What was refined during planning and why
- Key insights discovered
- Remaining uncertainties
- Confidence assessment of overall plan
