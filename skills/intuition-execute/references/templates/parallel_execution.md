# Parallel Task Delegation

## Overview

One of the most powerful capabilities in execution is delegating multiple independent tasks in parallel. When tasks don't depend on each other, running them simultaneously dramatically improves execution speed and efficiency.

## When to Parallelize

**ALWAYS evaluate if tasks can run in parallel.** Delegate multiple tasks in a single message when:

- **File Independence**: Tasks modify different files with no overlap
- **Data Independence**: Tasks don't depend on each other's outputs
- **Resource Independence**: Tasks don't compete for the same resources
- **Order Irrelevance**: Execution order doesn't affect outcomes

## Benefits of Parallel Execution

- **Speed**: Multiple agents work simultaneously instead of waiting in queue
- **Efficiency**: Maximize throughput on multi-step plans
- **User Experience**: Faster results mean happier users
- **Resource Utilization**: Better use of available compute

## Requirements for Parallelization

Before parallelizing, verify:

1. **No Data Dependencies**: Task B doesn't need Task A's output
2. **No File Conflicts**: Tasks won't edit the same files
3. **Clear Boundaries**: Each task has well-defined scope
4. **Independent Verification**: Each task can be verified separately

## Parallel Patterns (When to Use)

### Pattern 1: Multiple Code Writers (Different Files)

When implementing features across different files:

```markdown
Task 1: Code Writer - Implement User model (models/user.ts)
Task 2: Code Writer - Implement Order model (models/order.ts)
Task 3: Code Writer - Implement Product model (models/product.ts)
```

**Why parallel?** Different files, no dependencies, all create models.

**Verification:**
- Each model can be tested independently
- No file conflicts
- All follow same patterns

**When to Use:**
- Creating multiple similar components
- Adding models across different domains
- Creating API endpoints that don't interact

### Pattern 2: Code + Documentation

After a code change is complete, run testing and documentation in parallel:

```markdown
Task 1: Test Runner - Run test suite and report results
Task 2: Documentation - Update README with new API endpoints
```

**Why parallel?** Documentation doesn't need test results; both reference same code.

**Verification:**
- Tests verify code correctness
- Documentation can be updated from code
- No ordering dependency

**When to Use:**
- Code is complete and stable
- Tests can verify independently
- Documentation doesn't depend on test results

### Pattern 3: Multiple Research Tasks

Exploring different areas of unknown codebase:

```markdown
Task 1: Research - Investigate authentication implementation
Task 2: Research - Investigate database schema design
Task 3: Research - Investigate API routing structure
```

**Why parallel?** Each explores independent area; results combine for full picture.

**Verification:**
- Each research task is independent
- Results combine to form complete picture
- No dependencies between explorations

**When to Use:**
- Understanding multiple independent modules
- Gathering information on different topics
- Investigating unrelated architectural concerns

### Pattern 4: Multi-Component Feature

Implementing a feature with clear component boundaries:

```markdown
Task 1: Code Writer - Add frontend form component (components/UserForm.tsx)
Task 2: Code Writer - Add backend API endpoint (routes/users.ts)
Task 3: Code Writer - Add database migration (migrations/001_add_users.sql)
```

**Why parallel?** If the interface is pre-defined, each can be implemented independently.

**Key Requirement:** Interface/contract must be pre-defined (from plan)

**Verification:**
- Frontend and backend contract is clear
- Database schema is specified
- Integration testing verifies they work together

**When to Use:**
- Feature architecture is well-defined
- Contracts/interfaces are clear
- Components can be implemented independently

### Pattern 5: Code Review + Security Scan

After code implementation completes, run multiple verification tasks:

```markdown
Task 1: Code Reviewer - Review code quality and style
Task 2: Security Expert - Scan for vulnerabilities
```

**Why parallel?** Code review and security scan are independent evaluations.

**Verification:**
- Code review checks style and quality
- Security scan checks for vulnerabilities
- Both evaluate same code, no conflicts

**When to Use:**
- Code implementation is complete
- Both reviews use same source
- Results don't affect each other

## Anti-Patterns (When NOT to Parallelize)

### Anti-Pattern 1: Sequential Dependencies

```markdown
DON'T:
Task 1: Code Writer - Implement feature X
Task 2: Test Runner - Test feature X  // Needs Task 1 to complete!
```

**Why not?** Task 2 requires Task 1's output. Run sequentially.

**Correct approach:**
```markdown
Task 1: Code Writer - Implement feature X
[Wait for completion]
Task 2: Test Runner - Test feature X
```

### Anti-Pattern 2: File Conflicts

```markdown
DON'T:
Task 1: Code Writer - Add function to utils.ts
Task 2: Code Writer - Refactor utils.ts  // Same file!
```

**Why not?** Both modify the same file. Merge conflicts likely.

**Correct approach:** Combine into single task or do sequentially with file-level locking

### Anti-Pattern 3: Verification Before Implementation

```markdown
DON'T:
Task 1: Security Expert - Scan for vulnerabilities
Task 2: Code Writer - Implement authentication  // Should scan AFTER
```

**Why not?** Security should verify code that exists, not future code.

**Correct approach:**
```markdown
Task 1: Code Writer - Implement authentication
[Wait for completion]
Task 2: Security Expert - Scan for vulnerabilities
```

### Anti-Pattern 4: Dependent Research

```markdown
DON'T:
Task 1: Research - Find all authentication files
Task 2: Code Writer - Update authentication  // Needs findings first
```

**Why not?** Code Writer needs research results to know what to update.

**Correct approach:**
```markdown
Task 1: Research - Find all authentication files
[Wait for findings]
Task 2: Code Writer - Update authentication (based on findings)
```

### Anti-Pattern 5: Overloading with Parallel Tasks

```markdown
DON'T:
Task 1: Code Writer - Implement X
Task 2: Code Writer - Implement Y
Task 3: Code Writer - Implement Z
Task 4: Code Writer - Implement W
Task 5: Test Runner - Test all of above
Task 6: Code Reviewer - Review all of above
Task 7: Security Expert - Scan all of above
// 7 tasks in parallel = context overload
```

**Why not?** Too many parallel tasks strain context and coordination.

**Better approach:** Limit to 3-4 parallel implementation tasks, then verify in parallel batch

## How to Delegate in Parallel

**CRITICAL:** Use a **single message** with multiple Task tool calls. Do NOT send tasks one at a time.

### Correct Approach

```
I'll delegate these three model implementations in parallel:

[Task tool call 1: Code Writer for User model]
[Task tool call 2: Code Writer for Product model]
[Task tool call 3: Code Writer for Order model]
```

All three Code Writer agents work simultaneously on different files.

### Incorrect Approach

```
First task: Code Writer for User model
[Wait for completion]

Next task: Code Writer for Product model
[Wait for completion]

Final task: Code Writer for Order model
```

This is sequential, defeats parallelization benefits.

## Monitoring Parallel Tasks

After delegating parallel tasks:

1. **Wait for all to complete** - You'll receive results from each task
2. **Review each output** - Verify acceptance criteria for all tasks
3. **Check for conflicts** - Ensure no unexpected file overlaps occurred
4. **Aggregate results** - Combine outputs into coherent execution report

### Handling Partial Failures

If one task fails while others succeed:

1. **Accept successful tasks** - Keep passing work
2. **Retry failed task** - With additional context
3. **Don't re-run successful tasks** - Unless they depend on the failed one

**Example:**
```markdown
Results from parallel execution:

Task 1 (User model): SUCCESS
Task 2 (Product model): SUCCESS
Task 3 (Order model): FAILED - Name conflict with existing model

Action: Retry Task 3 with different name or investigation of existing Order model
```

## Decision Framework

Before delegating, ask yourself:

```
Can these tasks run in parallel?
├─ Do they modify different files?
│  ├─ Yes → Check next question
│  └─ No → Run sequentially
├─ Does Task B need Task A's output?
│  ├─ Yes → Run sequentially
│  └─ No → Check next question
├─ Can they be verified independently?
│  ├─ Yes → PARALLELIZE!
│  └─ No → Run sequentially
```

**Default mindset:** Look for parallelization opportunities. Sequential execution should be the exception, not the rule.

## Parallel Execution Examples

### Example 1: Create Multiple Models (3 in Parallel)

```markdown
I'll implement the three core models in parallel - User, Product, and Order.
Each is independent, follows the same pattern, and doesn't depend on others.

[Task 1: Code Writer - User model]
[Task 2: Code Writer - Product model]
[Task 3: Code Writer - Order model]

After all three complete, I'll run tests in parallel:

[Task 4: Test Runner - Test User model]
[Task 5: Test Runner - Test Product model]
[Task 6: Test Runner - Test Order model]
```

### Example 2: Investigation + Implementation

```markdown
First, I'll research the current authentication and database structure in parallel:

[Task 1: Research - Current authentication implementation]
[Task 2: Research - Database user schema]

After gathering information, I'll implement in parallel:

[Task 3: Code Writer - Add OAuth provider integration]
[Task 4: Code Writer - Add user profile fields]
```

### Example 3: Implementation + Verification

```markdown
Code Writer completes User model implementation.

Now I'll verify in parallel:

[Task 1: Code Reviewer - Review User model code quality]
[Task 2: Test Runner - Run User model tests]
[Task 3: Security Expert - Scan User model for vulnerabilities]

All three verification tasks happen simultaneously.
```

## Scalability Considerations

### Small Parallel Batch (1-3 tasks)
- Very safe, low coordination overhead
- Fast execution
- Easy to verify
- Recommended default

### Medium Parallel Batch (4-5 tasks)
- Good parallelization benefit
- Manageable coordination
- Requires clear task boundaries
- Monitor for file conflicts

### Large Parallel Batch (6+ tasks)
- Significant speedup
- Higher coordination complexity
- Risk of conflicts or confusion
- Reserve for well-understood work

**Recommendation:** Start with 2-3 parallel tasks. Increase if proven safe.
