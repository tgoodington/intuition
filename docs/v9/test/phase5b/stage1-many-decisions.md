# Stage 1 Exploration: Task 5 — Build the API Integration Testing Skill

## Research Findings

Research subagents examined the following project context:

- `src/api/routes/` — 14 route files covering auth, users, projects, billing, notifications, search, admin
- `src/api/middleware/` — 6 middleware files (auth, rate-limit, cors, logging, validation, error-handler)
- `tests/api/` — 23 existing test files, mostly unit tests on individual route handlers
- `config/test.env` — test environment configuration with mock service URLs
- `docs/api-spec.yaml` — OpenAPI 3.0 specification covering 42 endpoints

Key findings:
1. Existing tests are unit-level — no integration tests that exercise the full middleware stack
2. OpenAPI spec is comprehensive but some endpoints are undocumented (admin routes)
3. Auth middleware uses JWT with refresh tokens — integration tests need token management
4. Rate limiting is per-IP in production, needs different handling in tests
5. 3 external service dependencies: payment processor, email service, search index
6. No test database seeding — tests currently use mocked data stores

## ECD Analysis

### Elements
- **Endpoints**: 42 documented + ~6 undocumented admin endpoints
- **Middleware stack**: 6 layers that transform requests/responses
- **External services**: 3 dependencies requiring mocks or stubs
- **Test database**: Needs seeding strategy for integration tests
- **Auth flows**: JWT issue, refresh, revoke — all need test coverage
- **OpenAPI spec**: Source of truth for expected request/response shapes

### Connections
- Routes → Middleware: each route passes through the full stack
- Auth middleware → All protected routes: token validation required
- External services → Route handlers: payment, email, search called from handlers
- OpenAPI spec → Test assertions: response shapes validate against spec
- Test DB → Route handlers: data layer needs realistic seeded state

### Dynamics
- Test setup: seed database, start mock services, configure auth tokens
- Test execution: HTTP requests through the full stack (not bypassing middleware)
- Assertion: response status, body shape (vs OpenAPI), headers, side effects
- Teardown: clean database, verify no leaked state between tests
- Edge cases: expired tokens, rate limit triggers, service timeouts, malformed requests

## Assumptions

### A1: Test Framework
- **Default**: Use Jest with supertest (already in devDependencies)
- **Rationale**: Project already uses Jest for unit tests; supertest is the standard HTTP assertion library for Node.js integration testing

### A2: Single-File Skill Structure
- **Default**: Implement as a single SKILL.md file
- **Rationale**: Platform constraint — Claude Code skills must be single SKILL.md files

### A3: Model Selection
- **Default**: Use `sonnet` as the execution model
- **Rationale**: Test generation is pattern-heavy, doesn't require opus-level reasoning

## Key Decisions

### D1: Test Scope — Which Endpoints
- **Options**:
  - A) All 42 documented endpoints — recommended
  - B) Critical paths only (auth, billing, core CRUD) — ~15 endpoints
  - C) All 48 including undocumented admin routes
- **Recommendation**: A, because the OpenAPI spec provides a clear boundary and admin routes lack documentation to test against
- **Risk if wrong**: All 42 is a large test suite; critical-only misses coverage; including admin routes means inventing expected behavior

### D2: External Service Mocking Strategy
- **Options**:
  - A) In-process mocks (nock/msw) — intercept HTTP calls — recommended
  - B) Sidecar mock servers — separate processes that mimic services
  - C) Real staging services — use actual test instances
- **Recommendation**: A, because in-process mocks are fastest, most deterministic, and don't require infrastructure
- **Risk if wrong**: In-process mocks can mask real HTTP issues; sidecar is more realistic but harder to set up

### D3: Database Strategy
- **Options**:
  - A) SQLite in-memory for tests — fast, isolated — recommended
  - B) Dockerized test database (matching production)
  - C) Shared test database with transaction rollback
- **Recommendation**: A, because speed and isolation matter most for integration tests that run frequently
- **Risk if wrong**: SQLite may have dialect differences from production DB; Docker is slower but more faithful

### D4: Auth Token Management
- **Options**:
  - A) Pre-generated static tokens with known payloads — recommended
  - B) Full auth flow per test (login → get token → use token)
  - C) Bypass auth middleware in test environment
- **Recommendation**: A, because static tokens are fastest and most deterministic for non-auth tests
- **Risk if wrong**: Static tokens don't test the auth flow itself; bypassing auth misses middleware bugs

### D5: Test Organization
- **Options**:
  - A) One test file per route file (14 files) — recommended
  - B) One test file per endpoint (42 files)
  - C) Grouped by domain (auth, billing, etc.) — ~6 files
- **Recommendation**: A, because it mirrors the source structure and keeps related endpoint tests together
- **Risk if wrong**: Large route files produce large test files; per-endpoint is more granular but creates file sprawl

### D6: Response Validation Depth
- **Options**:
  - A) Schema validation against OpenAPI spec + key field assertions — recommended
  - B) Full response body deep-equal matching
  - C) Status code + content-type only
- **Recommendation**: A, because schema validation catches structural issues while key field assertions verify business logic
- **Risk if wrong**: Deep-equal is brittle (breaks on any field addition); status-only misses body bugs

### D7: Error Case Coverage
- **Options**:
  - A) All documented error codes per endpoint — recommended
  - B) Common errors only (400, 401, 404, 500)
  - C) Happy path only, errors in a follow-up task
- **Recommendation**: A, because error handling is where most integration bugs hide
- **Risk if wrong**: Full error coverage is time-intensive; common-only misses domain-specific error cases

### D8: Rate Limiting Test Approach
- **Options**:
  - A) Configurable rate limits — lower limits in test env for fast triggering — recommended
  - B) Real rate limits — send enough requests to trigger
  - C) Skip rate limit testing
- **Recommendation**: A, because real limits make tests slow and flaky; skipping misses a critical middleware
- **Risk if wrong**: Configurable limits might not catch production-specific rate limit bugs

### D9: Test Data Seeding Strategy
- **Options**:
  - A) Fixture files loaded per test suite — recommended
  - B) Factory functions that generate random data
  - C) Shared seed script that populates a standard dataset
- **Recommendation**: A, because fixtures are deterministic and reviewable; per-suite gives isolation
- **Risk if wrong**: Fixtures can become stale; factories add complexity; shared seeds create test interdependencies

### D10: CI Integration
- **Options**:
  - A) Separate CI job for integration tests (run on PR, not on every commit) — recommended
  - B) Combined with unit tests in the same job
  - C) Manual trigger only
- **Recommendation**: A, because integration tests are slower and shouldn't block every commit
- **Risk if wrong**: Separate job means integration failures discovered later; combined job slows all commits
