# Project Plan Template

This file demonstrates the format for creating a comprehensive project plan. Use this template during first-time activation to collaboratively build a shared understanding of the project with the user.

## Format

A project plan should include:
- Metadata (creation date, current status)
- Project overview (brief description of what you're building)
- Goals (primary objectives)
- Current phase (where you are in the development lifecycle)
- Architecture overview (high-level technical approach)
- Completed milestones (what's been done)
- Next steps (actionable items)
- Open questions (unresolved decisions)
- Notes (additional context)

## Example Structure

---

# Project Plan: [Project Name]

**Created:** 2025-01-15
**Last Updated:** 2025-01-20
**Status:** Planning / In Implementation / Complete

## Project Overview

[2-3 sentence description of what you're building and why]

**Example:**
Building a contact management API using FastAPI and AlloyDB on GCP. The API will provide CRUD operations for contacts with authentication and will be deployed to Cloud Run with CI/CD via GitHub Actions.

## Goals

[Primary objectives for this project - what success looks like]

**Example:**
- Create a production-ready REST API for contact management
- Implement secure authentication and authorization
- Deploy to GCP Cloud Run with automated CI/CD
- Achieve <100ms response time for read operations
- Support 1000+ concurrent users

## Current Phase

[Where you are in the development lifecycle]

**Possible phases:**
- Discovery / Planning
- Initial Setup / Scaffolding
- MVP Development
- Feature Enhancement
- Testing & Refinement
- Production Deployment
- Maintenance & Support

**Example:**
MVP Development - Core CRUD operations implemented, working on authentication integration.

## Architecture Overview

[High-level technical approach - key technologies and how they fit together]

**Example:**
- **Backend:** FastAPI (Python 3.11) with Pydantic validation
- **Database:** AlloyDB for PostgreSQL with Alembic migrations
- **Authentication:** OAuth 2.0 with Google Sign-In
- **Deployment:** Cloud Run (containerized with Docker)
- **CI/CD:** GitHub Actions with Workload Identity Federation
- **Infrastructure:** Pulumi for IaC
- **Monitoring:** Cloud Logging and Cloud Monitoring

## Completed Milestones

[What's been accomplished so far - include dates for context]

**Example:**
- **2025-01-10:** Initial project setup and repository creation
  - Created FastAPI project structure
  - Set up development environment with Poetry
  - Configured pre-commit hooks and linting

- **2025-01-12:** Database setup completed
  - Provisioned AlloyDB cluster in GCP
  - Implemented Alembic migrations
  - Created Contact model with SQLAlchemy

- **2025-01-15:** Core CRUD operations implemented
  - Added POST /contacts endpoint
  - Added GET /contacts and GET /contacts/{id} endpoints
  - Added PUT and DELETE endpoints
  - Implemented input validation with Pydantic

## Next Steps

[Actionable checklist items - what needs to be done next]

**Example:**
- [ ] Implement OAuth 2.0 authentication
  - [ ] Set up Google OAuth client credentials
  - [ ] Add authentication middleware to FastAPI
  - [ ] Protect endpoints with auth decorators
- [ ] Write unit tests for CRUD operations
  - [ ] Set up pytest with coverage
  - [ ] Test happy paths and error cases
  - [ ] Achieve 80%+ code coverage
- [ ] Create Dockerfile and container image
  - [ ] Write optimized multi-stage Dockerfile
  - [ ] Test local container build
  - [ ] Push to Artifact Registry
- [ ] Set up CI/CD pipeline
  - [ ] Configure GitHub Actions workflow
  - [ ] Set up Workload Identity Federation
  - [ ] Automate deployments to Cloud Run

## Open Questions

[Unresolved items that need decisions or clarification]

**Example:**
- How should we handle rate limiting? (per-user vs. global)
- Do we need pagination for GET /contacts? What page size?
- Should we implement soft deletes or hard deletes?
- What monitoring alerts do we need to set up?
- Do we need a staging environment or just dev/prod?

## Notes

[Additional context, constraints, or important information]

**Example:**
- AlloyDB cluster is in `us-central1` - all other resources should use same region
- OAuth client ID is approved for company domain only
- Cloud Run quotas: max 10 instances to control costs
- Database backup retention: 7 days (configured in AlloyDB)
- Team timezone: PST - schedule deployments accordingly

---

## Tips

- Update the plan regularly as the project evolves
- Move completed next steps to the milestones section with dates
- Keep the overview concise - details go in other memory files
- Use open questions to track decisions that need to be made
- Reference architectural decisions by ADR number (e.g., "See ADR-003")
- Mark deprecated goals or cancelled features clearly
- Keep next steps actionable and specific
- Break large tasks into smaller checklist items
