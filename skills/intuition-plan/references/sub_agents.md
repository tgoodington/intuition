# Waldo Sub-Agents Reference

## Available Planning Sub-Agents

You can orchestrate these sub-agents for planning purposes:

| Agent | Use For |
|-------|---------|
| **Research** | Explore codebase, find patterns, understand architecture |
| **Security Expert** | Identify security concerns in proposed changes |

Delegate specific questions, synthesize their findings into your plan.

## Working with Sub-Agents

### Research Agent

Use the Research agent to explore and understand the codebase. Delegate when you need to:
- Understand existing architecture and patterns
- Find examples of similar implementations
- Discover file locations and dependencies
- Understand current state and structure
- Investigate specific components or modules

**Example delegation:**
```
Research Task: Explore the authentication system to understand:
- How authentication is currently implemented
- What patterns are used for session management
- Where user credentials are stored
- What security measures are in place

Report back with findings.
```

### Security Expert Agent

Use the Security Expert to identify security concerns in your proposed changes. Delegate when you need to:
- Review proposed architectural changes for security implications
- Identify potential vulnerabilities
- Check for compliance concerns
- Assess risks from external integrations
- Review authentication and authorization approaches

**Example delegation:**
```
Security Review Task: Review the proposed authentication changes:
- Are there any security concerns with the approach?
- What vulnerabilities should we be aware of?
- Are there missing security considerations?
- What best practices should we follow?

Report findings and recommendations.
```

## Dynamic Sub-Agent Discovery

When planning a feature that requires a specialized agent type you don't recognize or don't have, you can discover and employ new agent archetypes:

**Process:**
1. Identify the need: "This feature requires [deployment/monitoring/performance/etc] expertise"
2. Request Research agent to find best practices for that agent type
   ```
   Research Task: Discover best practices for a [deployment/monitoring/performance/etc] agent

   Find and document:
   - Agent capabilities and responsibilities
   - Typical workflow/process
   - Tools and integrations needed
   - When and how this agent should be used
   - Success criteria
   - Common patterns from similar systems
   ```
3. Review Research findings with confidence scores and sources
4. Document discovery findings in `docs/intuition-framework-improvements.md` with:
   - Date discovered
   - Agent archetype needed (e.g., deployment, monitoring, performance)
   - Best practices found (with citations)
   - Recommendation for framework adoption
5. Use adapted approach: Use findings to adjust task for closest existing agent OR clearly describe specialized need for base Claude to consider for framework-wide adoption

**Example:** While planning a feature involving infrastructure deployment, you identify the need for specialized deployment expertise. You delegate to Research to investigate deployment agent patterns. Research finds best practices from DevOps tools, CI/CD systems, and infrastructure-as-code frameworks. You document findings in framework-improvements.md. You either adapt the Research recommendations to use Code Writer with deployment context, or clearly describe the deployment need for base Claude to implement if it's adopted framework-wide.

**Documentation:** The pattern is available for the current planning session and documented in `docs/intuition-framework-improvements.md` for future system-wide adoption review.

## Parallel Sub-Agent Execution

When exploring large codebases or gathering information across multiple areas, launch sub-agents in parallel for efficiency. You can execute up to 3 sub-agents simultaneously in a single message.

### When to Parallelize

**Good candidates for parallel execution:**
- Exploring multiple independent modules or features
- Gathering information from different parts of the codebase
- Researching separate architectural concerns
- Independent fact-finding missions

**NOT suitable for parallel execution:**
- Tasks where one depends on another's results
- Iterative refinement (need to see results before next step)
- Tasks that build on each other sequentially

### How to Execute in Parallel

Use multiple Task tool calls in a single message. Each sub-agent works independently on different aspects of the exploration.

**Example parallel execution:**
```
I'll explore three independent areas of the codebase in parallel:

1. Research agent explores authentication patterns
2. Research agent explores database schema
3. Research agent explores API endpoints

[3 Task calls in same message]
```

### Synthesis

After parallel execution completes, synthesize findings from all sub-agents into a coherent plan. Cross-reference their discoveries and identify patterns or conflicts that inform your planning.

## Information Flow

1. **Delegate to Sub-Agents**: Ask specific questions and request targeted analysis
2. **Collect Results**: Gather findings from all sub-agents
3. **Synthesize**: Combine findings into coherent understanding
4. **Inform Planning**: Use synthesized findings to develop your plan
5. **Include in Plan**: Reference security concerns and architectural insights in final plan output
