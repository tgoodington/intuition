# Execution Report Format

## Overview

When execution is complete, provide a comprehensive report demonstrating what was accomplished and verifying all quality gates have been met.

## Complete Execution Report Format

```markdown
## Execution Complete

**Plan:** [Plan title]
**Status:** Success / Partial / Failed

**Tasks Completed:**
- [x] Task 1 - [Brief outcome]
- [x] Task 2 - [Brief outcome]

**Verification Results:**
- Security Review: PASS
- Code Review: PASS (if applicable)
- Tests: X passed, Y failed (if applicable)

**Files Modified:**
- path/to/file.ts - [what changed]

**Issues Encountered:**
- [Any problems and how they were resolved]

**Recommendations:**
- [Follow-up items or suggestions]
```

## Section Details

### Plan Header

**Plan Title:** Exactly as presented to user
**Status:** One of:
- **Success**: All tasks completed successfully, all quality gates passed
- **Partial**: Some tasks completed, some failed but escalated/handled appropriately
- **Failed**: Plan could not be executed, escalated to user

**Example:**
```markdown
## Execution Complete

**Plan:** Add Real-Time Notifications Feature
**Status:** Success
```

### Tasks Completed

List all tasks with outcomes. Use checkbox format to show completion status.

**Format:**
```markdown
**Tasks Completed:**
- [x] Task 1 - Brief description of what was accomplished
- [x] Task 2 - Brief description of what was accomplished
- [ ] Task 3 - Was not completed (explain why)
```

**Example:**
```markdown
**Tasks Completed:**
- [x] Task 1 - Create Notification model and database schema
- [x] Task 2 - Implement WebSocket server for real-time updates
- [x] Task 3 - Add notification API endpoints (create, list, mark as read)
- [x] Task 4 - Implement frontend notification components
- [x] Task 5 - Add unit tests for notification service
```

### Verification Results

Report results of all verification activities. Include results of:
- **Security Review**: Mandatory - PASS or FAIL
- **Code Review**: If code was written
- **Tests**: If tests were run

**Format:**
```markdown
**Verification Results:**
- Security Review: PASS
- Code Review: PASS (no issues found, follows project conventions)
- Tests: 45 passed, 0 failed, 2 skipped
```

**Details to include:**
- Security Review: Any issues found? Remediated?
- Code Review: Code quality assessment, any improvements suggested?
- Tests: Coverage percentage, any failing tests, regressions?

**Example:**
```markdown
**Verification Results:**
- Security Review: PASS - No hardcoded secrets, input validation verified, password hashing secure
- Code Review: PASS - Code follows TypeScript conventions, error handling comprehensive, documentation complete
- Tests: 52 passed, 0 failed, 1 skipped - Coverage: 89% for auth module
```

### Files Modified

List all files that were created or modified. Include brief description of changes.

**Format:**
```markdown
**Files Modified:**
- src/auth/auth.service.ts - Created new service with login/register functions
- src/auth/auth.controller.ts - Created new controller with POST endpoints
- src/app.module.ts - Added AuthModule import and JWT configuration
- src/__tests__/auth.spec.ts - Created test suite with 15 test cases
```

**Best Practices:**
- Include created files (mark as "Created:" or "New:")
- Include modified files with brief change description
- Include deleted files if any (mark as "Deleted:")
- Use relative paths from project root

**Example:**
```markdown
**Files Modified:**
- src/notifications/notifications.model.ts (Created) - Notification entity with user and timestamp fields
- src/notifications/notifications.service.ts (Created) - Service with CRUD operations
- src/notifications/notifications.controller.ts (Created) - REST API endpoints
- src/notifications/notifications.gateway.ts (Created) - WebSocket gateway for real-time updates
- src/notifications/__tests__/notifications.service.spec.ts (Created) - 15 unit tests
- src/app.module.ts (Modified) - Added NotificationsModule and WebSocketGateway configuration
- docs/api.md (Modified) - Added notification endpoints documentation
- package.json (Modified) - Added @nestjs/websockets dependency
```

### Issues Encountered

Document any problems that occurred and how they were resolved.

**Format:**
```markdown
**Issues Encountered:**
- Issue 1: [Description] - Resolution: [How it was fixed]
- Issue 2: [Description] - Resolution: [How it was fixed]
```

**When to include:**
- Any task failures that were retried
- Fallbacks that were used
- Unexpected complications
- Workarounds implemented
- Assumptions that proved incorrect

**When NOT to include:**
- Minor warnings or notices
- Expected temporary debug output
- Normal task execution messages

**Example:**
```markdown
**Issues Encountered:**
- WebSocket test failures due to timing issues - Resolution: Added proper async/await and increased timeout delays
- Database migration failed first attempt - Resolution: Checked existing tables, updated migration script, re-ran successfully
- Initial code review requested refactoring - Resolution: Code Writer updated to follow patterns, re-reviewed and approved
```

### Recommendations

Suggest follow-up items, improvements, or next steps.

**Categories:**
- **Follow-up tasks**: Work that should happen next
- **Improvements**: Enhancements for existing code
- **Testing**: Additional testing needed
- **Documentation**: Further documentation needed
- **Optimization**: Performance or maintainability improvements
- **Future phases**: What should be done next

**Example:**
```markdown
**Recommendations:**
- Next: Implement push notifications to mobile app
- Next: Add notification preferences/settings UI
- Improvement: Add caching for notification queries (performance optimization)
- Testing: Add end-to-end tests for notification flow
- Documentation: Create user guide for notification preferences feature
- Follow-up: Monitor WebSocket connection stability in production
```

## Report Sections for Different Scenarios

### Successful Execution (All Tasks Passed)

```markdown
## Execution Complete

**Plan:** Add Real-Time Notifications
**Status:** Success

All 5 tasks completed successfully. All quality gates passed.

**Tasks Completed:**
- [x] Task 1 - Create notification models and schema
- [x] Task 2 - Implement WebSocket server
- [x] Task 3 - Build notification API endpoints
- [x] Task 4 - Create frontend components
- [x] Task 5 - Add comprehensive tests

**Verification Results:**
- Security Review: PASS - No vulnerabilities found
- Code Review: PASS - High quality, well-documented
- Tests: 48 passed, 0 failed - 91% coverage

**Files Modified:**
- src/notifications/ (Created) - Full notification module
- src/app.module.ts (Modified) - Added NotificationsModule
- docs/api.md (Modified) - Added API documentation

**Issues Encountered:**
None - smooth execution throughout.

**Recommendations:**
- Monitor WebSocket connection performance in production
- Plan for notification preferences feature in next phase
- Consider adding read receipts for notifications
```

### Partial Execution (Some Issues Resolved)

```markdown
## Execution Complete

**Plan:** Add Real-Time Notifications
**Status:** Partial

4 of 5 tasks completed. 1 task required escalation.

**Tasks Completed:**
- [x] Task 1 - Create notification models and schema
- [x] Task 2 - Implement WebSocket server
- [x] Task 3 - Build notification API endpoints
- [x] Task 4 - Create frontend components
- [ ] Task 5 - Add comprehensive tests (Escalated)

**Verification Results:**
- Security Review: PASS - No vulnerabilities found
- Code Review: PASS - Minor improvements suggested, implemented
- Tests: 32 passed, 0 failed - 76% coverage (incomplete)

**Files Modified:**
- src/notifications/ (Created) - Core notification module
- src/app.module.ts (Modified) - Added NotificationsModule
- docs/api.md (Modified) - Added API documentation

**Issues Encountered:**
- Test environment setup required additional configuration - Resolved by researching and configuring WebSocket test utilities
- Code review requested refactoring of error handling - Resolved in second iteration
- Task 5 requires integration testing setup beyond scope - Escalated to user for prioritization

**Recommendations:**
- Task 5 (integration tests) should be scheduled separately as dedicated task
- Production monitoring setup should be planned before deployment
- Plan for notification preferences as follow-up feature
```

### Failed Execution (Major Issues)

```markdown
## Execution Complete

**Plan:** Add Real-Time Notifications
**Status:** Failed

Plan execution halted due to architectural concerns. Escalated to user.

**Tasks Completed:**
- [x] Task 1 - Create notification models and schema
- [ ] Task 2 - Implement WebSocket server (Not Started)
- [ ] Task 3 - Build notification API endpoints (Not Started)
- [ ] Task 4 - Create frontend components (Not Started)
- [ ] Task 5 - Add comprehensive tests (Not Started)

**Verification Results:**
- Task 1 schema review passed
- Architecture review for WebSocket revealed compatibility issues

**Files Modified:**
- src/notifications/notification.model.ts (Created)

**Issues Encountered:**
- Database schema implementation raised architectural questions about scalability
- WebSocket approach may conflict with current load balancing strategy
- Security Expert identified potential concerns with real-time message handling
- Plan assumptions about system load capacity need validation

**Recommendations:**
- Conduct architecture review with team before proceeding
- Verify WebSocket compatibility with current deployment infrastructure
- Revisit scalability assumptions in plan
- User input needed on approach before execution continues
```

## Quality Gate Verification Checklist

Before submitting execution report, verify:

### Mandatory Gates
- [ ] All tasks completed or properly escalated
- [ ] Security Expert has reviewed (NO EXCEPTIONS)
- [ ] All acceptance criteria verified or documented as incomplete

### If Code Was Written
- [ ] Code Reviewer has approved
- [ ] Tests pass (or documented why)
- [ ] No regressions introduced

### If Docs Were Updated
- [ ] Documentation is accurate
- [ ] Links are valid

### Report Quality
- [ ] Report is complete and accurate
- [ ] All files listed and described
- [ ] Issues and resolutions documented
- [ ] Recommendations are actionable
