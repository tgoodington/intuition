# Task Delegation Format

## Overview

When delegating work to sub-agents, use this format to ensure complete context and clear expectations.

## Complete Task Delegation Format

```markdown
## Task Assignment

**Agent:** [agent-name]
**Priority:** High/Medium/Low

**Objective:**
[Clear description of what to accomplish]

**Context:**
[Relevant information from the plan]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

**Files:** [Specific files to work with, if known]

**Constraints:**
- [Any limitations or requirements]

**On Failure:**
- Retry: [yes/no, conditions]
- Fallback: [alternative approach]
```

## Section Guidelines

### Agent
- Name of the sub-agent receiving the task
- Options: Code Writer, Test Runner, Documentation, Research, Code Reviewer, Security Expert

### Priority
- **High**: Critical path, blocks other work, must complete before proceeding
- **Medium**: Important but some flexibility on timing
- **Low**: Nice to have, can defer if needed

### Objective
- **What:** Clear description of what to accomplish
- **Why:** Why this task matters to the overall plan
- **Success:** What does success look like?

**Example:**
```
Implement user authentication module

This module is the foundation for access control. Users must be able to:
1. Register with email and password
2. Log in with credentials
3. Receive JWT token for authenticated requests
4. Access protected resources with token

Success = Users can complete registration/login flow and access protected endpoints
```

### Context
- **From the Plan:** Relevant background information
- **Dependencies:** What other work relates to this?
- **Constraints:** What limitations apply?
- **Background:** What should the agent know about this feature?

**Example:**
```
This authentication module supports the user management system. We're using:
- Node.js/Express for the backend
- PostgreSQL for user storage
- JWT for session management

The user registration API endpoint should be at POST /api/auth/register
Login endpoint at POST /api/auth/login

This task is Task 1 in the plan; other tasks depend on completion.
```

### Acceptance Criteria
- Specific, measurable outcomes
- Each criterion should be verifiable
- Include both functional and quality criteria
- Use checkbox format for tracking

**Example:**
```
- [ ] User model created with email and password fields
- [ ] Email validation implemented
- [ ] Password hashed using bcrypt
- [ ] Login endpoint accepts email/password, returns JWT
- [ ] Registration endpoint creates new user and returns JWT
- [ ] Invalid credentials rejected with appropriate error
- [ ] Code follows project style guide
- [ ] Unit tests written and passing
```

### Files
- Specific files to create or modify
- Include relative paths from project root
- Be explicit about new files vs. modifications

**Example:**
```
Files to create:
- src/auth/auth.service.ts (new)
- src/auth/auth.controller.ts (new)
- src/auth/jwt.strategy.ts (new)
- src/auth/auth.module.ts (new)

Files to modify:
- src/app.module.ts (import AuthModule)
- src/main.ts (if middleware configuration needed)
```

### Constraints
- **Limitations:** What can't be done?
- **Requirements:** Must-follow rules?
- **Standards:** Code style, patterns to follow?
- **Integrations:** What systems must this work with?

**Example:**
```
- Must use bcrypt for password hashing (security requirement)
- Must follow existing project code style and conventions
- Must use TypeScript, no JavaScript
- Must be compatible with existing Express middleware
- Password must be at least 8 characters
- Must support both email/password and OAuth in future
```

### On Failure

#### Retry Strategy
- **Yes**: Retry with what conditions/changes?
- **No**: Don't retry, escalate immediately

**When to retry:**
- Transient failures (network issues, temporary service outage)
- Ambiguous requirements (request clarification and retry)
- Minor issues (syntax errors, easy fixes)

**When not to retry:**
- Architectural issues (design doesn't fit)
- Scope creep (task has become unclear)
- Security concerns (something feels unsafe)

**Example:**
```
- Retry: Yes, if tests fail due to environment issues. Provide more detailed instructions and retry.
- Retry: No, if architecture doesn't support the approach. Escalate for design review.
```

#### Fallback Options
- **Decompose:** Break task into smaller pieces
- **Research:** Gather more information first
- **Escalate:** Ask Architect for guidance
- **Alternative Approach:** Different way to accomplish goal

**Example:**
```
Fallback strategy:
1. If JWT approach has issues: Use session-based authentication instead
2. If performance is inadequate: Optimize queries and caching
3. If complexity exceeds expectations: Break into smaller tasks
```

## Delegation Examples

### Example 1: Code Writer - Feature Implementation

```markdown
## Task Assignment

**Agent:** Code Writer
**Priority:** High

**Objective:**
Implement the authentication module providing user registration and login functionality.
This is the foundation for user access control and enables all subsequent user-related features.

**Context:**
Plan: User Authentication System
Task: Create authentication service with JWT support

Current project uses:
- Node.js/Express
- PostgreSQL
- TypeScript
- JWT for sessions

**Acceptance Criteria:**
- [ ] User model with email and password fields
- [ ] Email validation (valid format, not already registered)
- [ ] Password hashing with bcrypt (salt rounds: 10)
- [ ] POST /api/auth/register - creates user, returns JWT
- [ ] POST /api/auth/login - validates credentials, returns JWT
- [ ] Invalid credentials return 401 with descriptive message
- [ ] Password constraints enforced (min 8 chars, complexity rules)
- [ ] Unit tests covering happy path and error cases
- [ ] Code follows project TypeScript conventions
- [ ] Error handling is comprehensive

**Files:**
Create:
- src/auth/auth.service.ts
- src/auth/auth.controller.ts
- src/auth/jwt.strategy.ts
- src/auth/auth.module.ts
- src/auth/__tests__/auth.service.spec.ts

Modify:
- src/app.module.ts (import AuthModule)

**Constraints:**
- Must use bcrypt for password hashing
- Must follow NestJS patterns (already in project)
- Must be compatible with PostgreSQL
- Must work with existing Express middleware

**On Failure:**
- Retry: Yes, if tests fail due to database setup. Provide database initialization details and retry.
- Retry: No, if architecture conflicts with project design. Escalate to Architect.
- Fallback: If complexity exceeds timeline, use simpler session-based auth instead
```

### Example 2: Test Runner - Verification

```markdown
## Task Assignment

**Agent:** Test Runner
**Priority:** High

**Objective:**
Run complete test suite to verify authentication implementation and ensure no regressions.
All tests must pass before code review.

**Context:**
Authentication module has been implemented in latest commit.
Need to verify all unit tests pass and integration tests work.

**Acceptance Criteria:**
- [ ] All unit tests pass (auth.service.spec.ts)
- [ ] All integration tests pass (auth.controller.spec.ts)
- [ ] Test coverage reported
- [ ] No failing tests in full project test suite (regression check)
- [ ] Performance acceptable (tests complete in <30 seconds)

**Files:**
Test files:
- src/auth/__tests__/auth.service.spec.ts
- src/auth/__tests__/auth.controller.spec.ts
- Full suite: npm test

**Constraints:**
- Must use existing test framework (Jest)
- Database must be seeded for integration tests
- Use test database, not production

**On Failure:**
- Retry: Yes, with additional debugging output if tests fail intermittently
- Fallback: If environment issue, run tests individually to identify failure
```

### Example 3: Security Expert - Vulnerability Scan

```markdown
## Task Assignment

**Agent:** Security Expert
**Priority:** High

**Objective:**
Scan authentication module for security vulnerabilities and best practice violations.
MANDATORY before any code is merged. Must identify and report any issues.

**Context:**
Authentication module implementation complete at /src/auth/
Must verify no security vulnerabilities before accepting code.

**Acceptance Criteria:**
- [ ] No hardcoded secrets or credentials in code
- [ ] No sensitive data (passwords, tokens) in logs
- [ ] Password hashing uses secure algorithm (bcrypt verified)
- [ ] JWT implementation follows security best practices
- [ ] Input validation prevents injection attacks
- [ ] No exposure of internal system information in errors
- [ ] Database queries use parameterized statements
- [ ] Security headers properly configured
- [ ] Rate limiting suitable for auth endpoints
- [ ] Full report provided with findings and recommendations

**Files:**
Scan:
- src/auth/ (entire authentication module)
- src/config/ (configuration files)
- .env (environment configuration - verify no hardcoded secrets)

**Constraints:**
- Must follow OWASP security guidelines
- Must check for common auth vulnerabilities (brute force, timing attacks, etc.)
- Must verify JWT secret is sufficiently random

**On Failure:**
- Retry: Yes, after addressing identified issues. Re-run scan to verify fixes.
- Escalate: If critical vulnerabilities found, escalate to Architect before proceeding
```

## Key Principles for Effective Delegation

1. **Be Specific**: Avoid vague objectives. State exactly what should be done.

2. **Provide Context**: Agent needs to understand why this task matters.

3. **Clear Success Criteria**: Agent knows exactly when task is complete.

4. **Realistic Constraints**: State limitations so agent can plan accordingly.

5. **Failure Handling**: Agent knows what to do if problems arise.

6. **File Specificity**: Exact paths prevent confusion and errors.

7. **One Task at a Time**: Each delegation has clear, singular focus.
