# Planning Process (Plan-Reflect-Refine)

## The Process

```
1. UNDERSTAND
   - Clarify goals, constraints, preferences
   - Document assumptions explicitly

2. EXPLORE
   - Delegate research to sub-agents
   - Gather security considerations

3. DRAFT PLAN
   - Create initial structured plan
   - Include confidence scores

4. REFLECT (Self-Critique)
   - Is the plan complete?
   - Are there gaps or risks?
   - Are assumptions valid?
   - Is scope appropriate?

5. REFINE
   - Address critique findings
   - Iterate until satisfied

6. PRESENT
   - Submit refined plan for user approval
```

## Step-by-Step Guidance

### 1. UNDERSTAND Phase

**Goal:** Clarify what the user wants to accomplish

**Actions:**
- Ask clarifying questions about goals
- Understand constraints and preferences
- Document assumptions explicitly
- Explore user's broader context and objectives
- Challenge assumptions respectfully

**Key Questions:**
- What is the primary goal?
- What constraints exist (time, budget, resources)?
- Are there preferences on approach?
- What does success look like?
- Are there risks or concerns?

**Output:** Clear understanding of what needs to be planned

### 2. EXPLORE Phase

**Goal:** Gather information to inform planning

**Actions:**
- Delegate research to Research agent for codebase exploration
- Delegate to Security Expert for security analysis
- Gather technical understanding
- Identify architectural patterns
- Understand dependencies and constraints

**Sub-Agent Delegation:**
- **Research Agent**: Explore codebase, find patterns, understand current architecture
- **Security Expert**: Identify security concerns in proposed changes

**Parallel Execution:** You can run these up to 3 sub-agents simultaneously for efficiency

**Output:** Comprehensive understanding of technical context, security concerns, and architectural patterns

### 3. DRAFT PLAN Phase

**Goal:** Create initial structured plan

**Actions:**
- Decompose goal into discrete tasks
- Structure tasks hierarchically if complex
- Assign confidence scores to each task
- Identify dependencies
- Create acceptance criteria
- Suggest assignments to sub-agents

**Confidence Scoring:**
- **High**: Well-understood, clear path forward, low uncertainty
- **Medium**: Reasonable approach but some unknowns
- **Low**: Significant uncertainty, may need iteration

**Output:** Initial plan following the Plan Output Format

### 4. REFLECT Phase (Self-Critique)

**Goal:** Critically evaluate the plan before presenting

**Actions:**
- Ask yourself the Self-Reflection Checklist questions:
  - [ ] Is the objective clearly stated?
  - [ ] Are all assumptions documented?
  - [ ] Have I explored alternatives?
  - [ ] Are tasks appropriately sized?
  - [ ] Are dependencies identified?
  - [ ] Has Security Expert reviewed for concerns?
  - [ ] Are risks and mitigations realistic?
  - [ ] Would I be confident handing this to The Architect?

**What to Look For:**
- Gaps in coverage
- Risks not identified
- Tasks that are too large or too small
- Missing dependencies
- Low-confidence items that need clarification
- Assumptions that haven't been validated

**Output:** List of refinements needed

### 5. REFINE Phase

**Goal:** Address critique findings and improve the plan

**Actions:**
- Address each critique finding
- Decompose oversized tasks
- Combine tasks that are too small
- Add missing dependencies
- Research gaps further if needed
- Increase confidence scores where possible
- Iterate until satisfied

**When to Iterate:**
- If you found significant gaps in reflection
- If confidence scores are mostly Low
- If risks are not well-mitigated
- If the plan doesn't feel ready for execution

**Output:** Refined, high-confidence plan ready for presentation

### 6. PRESENT Phase

**Goal:** Submit plan for user approval

**Actions:**
- Present the refined plan clearly
- Highlight low-confidence items
- Explain key decisions and trade-offs
- Answer user questions
- Iterate if user requests changes
- Get explicit approval before moving to execution

**Output:** User-approved plan ready for The Architect

## Reflection Checklist

Before finalizing any plan, ask yourself:

- [ ] Is the objective clearly stated?
- [ ] Are all assumptions documented?
- [ ] Have I explored alternatives?
- [ ] Are tasks appropriately sized (not too big, not too small)?
- [ ] Are dependencies identified?
- [ ] Has Security Expert reviewed for concerns?
- [ ] Are risks and mitigations realistic?
- [ ] Would I be confident handing this to The Architect?

## Common Refinements

### Task Sizing Issues

**Problem:** Task too large
**Refinement:** Break into smaller, more discrete units
- Example: "Add user authentication" → "Create User model", "Implement login endpoint", "Add JWT validation"

**Problem:** Task too small
**Refinement:** Combine related tasks
- Example: "Add login button", "Add password field", "Add submit handler" → "Implement login form"

### Confidence Issues

**Problem:** Low-confidence task
**Refinement:**
- Research further to increase understanding
- Decompose into smaller, better-understood pieces
- Document unknowns explicitly

### Missing Dependencies

**Problem:** Task ordering not clear
**Refinement:**
- Map task dependencies explicitly
- Identify parallel execution opportunities
- Ensure sequential tasks are properly ordered

### Risk Identification

**Problem:** Risks identified but not mitigated
**Refinement:**
- For each risk, define clear mitigation strategy
- Consider contingency plans
- Adjust timeline if needed

## Iteration Pattern

The Plan-Reflect-Refine cycle may iterate multiple times:

```
Draft Plan
    ↓
Reflect
    ↓
Found Issues?
    ├─ Yes → Refine → [back to Reflect]
    └─ No → Present to User
```

Continue iterating until:
1. All checklist items satisfied
2. Confidence scores are mostly High/Medium
3. Plan is clear and actionable
4. You would confidently hand to The Architect
