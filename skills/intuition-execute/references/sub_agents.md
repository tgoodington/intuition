# Architect Sub-Agents Reference

## Available Execution Sub-Agents

Delegate to these specialized agents (all run on Sonnet by default):

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **Code Writer** | Implements features, writes/edits code | New features, bug fixes, refactoring |
| **Test Runner** | Executes tests, reports results | After code changes, CI verification |
| **Documentation** | Updates docs, README, comments | After feature completion |
| **Research** | Explores codebase, investigates issues | Unknown territory, debugging |
| **Code Reviewer** | Reviews code quality | After Code Writer completes |
| **Security Expert** | Scans for secrets, vulnerabilities | Before any commit (MANDATORY) |
| **Technical Spec Writer** | Creates comprehensive technical specifications | After planning, before code implementation |
| **Communications Specialist** | Creates human-centric audience-specific documents | When new human-facing docs are needed |

## Task Delegation Patterns

### Code Writer Delegation

Use the Code Writer agent for implementing features and fixing bugs.

**When to use:**
- New feature implementation
- Bug fixes
- Code refactoring
- Adding new modules or components

**Example delegation:**
```
Code Writer Task: Implement user authentication module

Objective: Create a secure authentication system with login and registration

Files to create/modify:
- src/auth/auth.service.ts (new)
- src/auth/auth.controller.ts (new)
- src/auth/jwt.strategy.ts (new)

Acceptance Criteria:
- [ ] Login endpoint accepts email/password and returns JWT
- [ ] Registration creates new user with hashed password
- [ ] JWT validation works for protected routes
- [ ] Password reset functionality implemented

Constraints:
- Use bcrypt for password hashing
- Follow existing project code style
- Include proper error handling
```

### Test Runner Delegation

Use the Test Runner agent to execute tests and verify code quality.

**When to use:**
- After code changes to verify tests pass
- Running full test suite
- CI/CD integration verification
- Regression testing

**Example delegation:**
```
Test Runner Task: Execute test suite for authentication module

Objective: Verify all tests pass and no regressions introduced

Acceptance Criteria:
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Test coverage reported
- [ ] No failing tests in full suite

Files to test:
- src/auth/* (authentication module)
```

### Documentation Delegation

Use the Documentation agent to update docs and create reference materials.

**When to use:**
- After feature completion
- Updating README with new capabilities
- Adding API documentation
- Creating usage examples

**Example delegation:**
```
Documentation Task: Update API documentation for authentication endpoints

Objective: Document new authentication endpoints in API docs

Acceptance Criteria:
- [ ] Login endpoint documented with examples
- [ ] Registration endpoint documented
- [ ] Error responses documented
- [ ] Authentication flow explained
- [ ] Links are valid

Files to update:
- docs/api.md
- docs/authentication.md (create if needed)
- README.md (usage section)
```

### Research Delegation

Use the Research agent to explore and understand the codebase.

**When to use:**
- Investigating unknown parts of codebase
- Finding where to make changes
- Understanding existing patterns
- Debugging unknown issues

**Example delegation:**
```
Research Task: Investigate database connection handling

Objective: Understand how database connections are currently managed

Explore:
- Where database initialization happens
- How connection pooling is configured
- What patterns are used for database queries
- Error handling for connection failures

Report findings and recommendations.
```

### Code Reviewer Delegation

Use the Code Reviewer agent to review code quality and standards compliance.

**When to use:**
- After Code Writer completes implementation
- Before merging to main branch
- Ensuring code quality standards
- Catching potential issues

**Example delegation:**
```
Code Reviewer Task: Review authentication module implementation

Objective: Verify code quality and best practices

Review criteria:
- [ ] Code follows project style guide
- [ ] Error handling is comprehensive
- [ ] No code smells or anti-patterns
- [ ] Documentation is complete
- [ ] Tests are adequate

Files to review:
- src/auth/auth.service.ts
- src/auth/auth.controller.ts
- src/auth/jwt.strategy.ts
```

### Security Expert Delegation

Use the Security Expert agent to scan for vulnerabilities and security issues. **This is MANDATORY before any code is committed.**

**When to use:**
- Before merging any code (MANDATORY)
- Scanning for secrets in code
- Verifying no hardcoded credentials
- Checking for common vulnerabilities
- Reviewing security-sensitive changes

**Example delegation:**
```
Security Expert Task: Security scan for authentication module

Objective: Verify no security vulnerabilities or secrets in code

Check for:
- [ ] No hardcoded secrets or credentials
- [ ] No sensitive data in logs
- [ ] No common authentication vulnerabilities
- [ ] Proper input validation
- [ ] Secure password handling
- [ ] JWT security best practices

Files to scan:
- src/auth/* (entire authentication module)
- src/config/* (configuration files)
```

## Technical Spec Writer Delegation

Use the Technical Spec Writer agent to create detailed technical specifications before implementation begins.

**When to use:**
- After planning phase, before code implementation
- When feature complexity requires clear specification
- To prevent implementation rework from unclear requirements
- When multiple developers/teams need shared understanding
- To document architectural decisions and trade-offs

**Example delegation:**
```
Technical Spec Writer Task: Create specification for user authentication feature

Objective: Create comprehensive technical specification for authentication implementation

Source Materials:
- Plan from Waldo planning phase
- Existing authentication patterns in codebase
- Security requirements and compliance needs

Specification should include:
- [ ] API endpoint specifications (methods, paths, request/response formats)
- [ ] Data model and schema design
- [ ] Authentication flow diagram
- [ ] Error handling and edge cases
- [ ] Performance requirements
- [ ] Security considerations
- [ ] Integration points with existing systems
- [ ] Acceptance criteria for implementation

Output Location: docs/specs/authentication-spec.md
```

**Output:**
- Detailed technical specification in `docs/specs/` directory
- Human-facing documentation for developer reference
- NOT part of project memory system
- Ready for Code Writer to implement with clarity

## Communications Specialist Delegation

Use the Communications Specialist agent to create human-centric documents from technical specifications when different audiences need tailored information.

**When to use:**
- When creating getting-started guides from technical specs
- When translating technical features into user-facing documentation
- When creating executive summaries or business value docs
- When different audiences (users, developers, stakeholders) need different versions
- When existing technical docs need an accessible companion guide

**NOT when to use:**
- Modifying existing technical specifications
- Creating marketing materials
- Post-processing existing documentation
- Single-audience technical documents (use Documentation agent instead)

**Example delegation:**
```
Communications Specialist Task: Create user-facing guide from technical authentication spec

Objective: Create getting-started guide for end-users based on technical spec

Source Material:
- docs/specs/authentication-spec.md (technical specification)
- Existing user guides for reference on tone/style

Audience: End users (non-technical)

Create NEW document including:
- [ ] Overview of what authentication does (for users)
- [ ] Step-by-step guide for users to authenticate
- [ ] Common tasks and how to do them
- [ ] Troubleshooting common issues
- [ ] When to contact support
- [ ] Link to advanced/developer documentation

Output Location: docs/guides/authentication-user-guide.md
```

**Output:**
- NEW human-facing document in appropriate location
- Emits `[DOCUMENT: communication]` flag
- NOT a modification of technical spec
- Accessible language, audience-appropriate tone

## Dynamic Sub-Agent Discovery

When executing a plan that requires a specialized agent type not in the above list, you can discover and employ new agent archetypes:

**Process:**
1. Identify the need: "I need [deployment/monitoring/performance/etc] expertise"
2. Request Research agent to find best practices for that agent type
3. Document findings in `docs/intuition-framework-improvements.md` with date, archetype needed, and best practices found
4. Use findings to adapt task for existing agent OR clearly describe need for base Claude to implement framework-wide

**Example:** If executing a plan involving infrastructure deployment, delegate to Research to investigate deployment agent patterns. Research finds CI/CD and infrastructure-as-code best practices. Document in framework-improvements.md. Use findings to adapt Code Writer instructions OR describe deployment need for future framework adoption.

## Parallel Task Delegation Patterns

### Pattern 1: Multiple Code Writers (Different Files)

When implementing features across different files with no dependencies:

```
Task 1: Code Writer - Implement User model (models/user.ts)
Task 2: Code Writer - Implement Order model (models/order.ts)
Task 3: Code Writer - Implement Product model (models/product.ts)
```

**Why parallel?** Different files, no dependencies, all create similar models.

### Pattern 2: Code + Documentation

After a code change is complete, run testing and documentation in parallel:

```
Task 1: Test Runner - Run test suite
Task 2: Documentation - Update API documentation
```

**Why parallel?** Documentation doesn't need test results; both reference the completed code.

### Pattern 3: Multiple Research Tasks

Exploring different areas of unknown codebase:

```
Task 1: Research - Investigate authentication implementation
Task 2: Research - Investigate database schema design
Task 3: Research - Investigate API routing structure
```

**Why parallel?** Each explores independent area; results combine for full picture.

### Pattern 4: Multi-Component Feature

Implementing a feature with clear component boundaries:

```
Task 1: Code Writer - Add frontend form component (components/UserForm.tsx)
Task 2: Code Writer - Add backend API endpoint (routes/users.ts)
Task 3: Code Writer - Add database migration (migrations/001_add_users.sql)
```

**Why parallel?** If the interface is pre-defined, each can be implemented independently.

## Sequential Task Patterns

### Pattern 1: Code Then Verify

Code must be written before it can be tested:

```
Task 1: Code Writer - Implement feature
[Wait for completion]
Task 2: Test Runner - Run tests
[Wait for completion]
Task 3: Code Reviewer - Review code
[Wait for completion]
Task 4: Security Expert - Security scan
```

### Pattern 2: Exploration Then Implementation

Must understand codebase before implementing changes:

```
Task 1: Research - Investigate authentication patterns
[Wait for findings]
Task 2: Code Writer - Implement new authentication method (informed by research)
```

### Pattern 3: Verification Before Security Scan

Security Expert reviews code that exists:

```
Task 1: Code Writer - Implement changes
[Wait for completion]
Task 2: Security Expert - Scan for vulnerabilities (MANDATORY)
```

## Delegation Checklist

Before delegating a task, ensure:

- [ ] **Clear objective** - What should the agent accomplish?
- [ ] **Context provided** - What information does the agent need?
- [ ] **Acceptance criteria** - How will I know it's complete?
- [ ] **Files specified** - What files should be modified?
- [ ] **Constraints listed** - What limitations apply?
- [ ] **Failure strategy** - What if something goes wrong?
- [ ] **Dependencies resolved** - Does the agent have what it needs?
