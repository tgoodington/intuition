# Intuition — Framework Vision

## What Intuition Is

Intuition is a workflow system for Claude Code that gives anyone a team of domain specialists. You describe what you want to build or change, and Intuition assembles the right experts, explores the problem space, makes a plan, and produces the deliverables — code, documents, spreadsheets, presentations, whatever the project needs.

The user's role is **creative director**. You set the vision, make the calls that matter, and the framework handles the rest. You should never feel like a project manager routing work between departments.

## Core Principles

### 1. Dreams to Reality
The framework exists to close the gap between "I want this" and "here it is." Every phase serves that goal. If a phase doesn't move the project forward, it shouldn't exist.

### 2. Minimum Viable Ceremony
Every interaction should earn its place. If the system can figure something out without asking, it should. If a handoff adds no value, eliminate it. The right amount of process is the least amount that produces reliable results.

### 3. Decisions Belong to the Right People
Not every decision needs the user's attention. The framework classifies decisions by who should make them — the user decides what matters to the end result, specialists decide domain internals, and routine choices happen silently. The user controls how much they want to be involved.

### 4. Domain Expertise on Demand
Specialists aren't generic assistants wearing hats. Each one carries real domain knowledge — what to research, what questions to ask, what patterns to follow, what risks to watch for. When a legal analyst explores a problem, it thinks like a legal analyst. When a database architect designs a schema, it applies database architecture principles.

### 5. Professional Output by Default
Deliverables that a person opens should look professional without the blueprint specifying every visual detail. Code should follow project conventions. Documents should have proper typography. Spreadsheets should have frozen headers and formatted numbers. The baseline is polished, not bare.

### 6. Scale to the Task
A simple change shouldn't require a 17-step pipeline. A complex project shouldn't cut corners. The framework adapts — fast track for straightforward work, full specialist pipeline for ambitious projects, and the user always has the option to choose.

## What the Framework Does

**Captures intent** — Through focused dialogue, distills a rough vision into a precise brief with clear success criteria, scope boundaries, and decision authority.

**Plans strategically** — Maps stakeholders, evaluates options, resolves architectural decisions, and produces an executable outline with tasks, dependencies, and acceptance criteria.

**Assembles expertise** — Matches tasks to domain specialists from a registry, checks prerequisites, and presents the team for user confirmation.

**Explores deeply** — Each specialist researches the problem space, surfaces assumptions and decisions, gets user input where needed, and produces a detailed blueprint.

**Produces deliverables** — Format-specific producers (code, documents, spreadsheets, presentations, forms, data files) execute against blueprints with three-layer review: specialist domain review, builder verification against acceptance criteria, and mandatory security review.

**Guards the vision** — After all specialist designs are complete, a vision review checks whether the blueprints collectively deliver the Commander's Intent. It catches coverage gaps, seam gaps between specialists, intent drift, and inconsistencies — problems that no individual specialist would notice because each one's scope is correct. The build report traces every success criterion and non-negotiable to the produced output.

**Tests what was built** — When code is produced, designs a test strategy, creates tests, runs them, fixes what it can, and escalates what it can't.

## What the Framework Does Not Do

- **Replace judgment.** It presents options and recommends, but the user decides. It challenges weak assumptions but respects the user's authority.
- **Guarantee perfection.** It applies structured review and testing, but complex projects have complex failure modes. The framework is honest about what it doesn't know.
- **Lock you in.** Every phase reads from disk artifacts. You can skip phases, restart from any point, or abandon the framework and use the artifacts directly.
- **Hide what it's doing.** Briefs, blueprints, decisions, and reports are all readable files. The user can inspect, override, or edit any artifact at any point.

## Architecture in Brief

```
Prompt → Outline → Assemble → Detail (per specialist) → Build → Test → Complete
```

- **Skills** are slash commands that run in the main conversation. They handle multi-turn dialogue and orchestrate the workflow.
- **Agents** are subprocesses spawned by skills for specific tasks — research, production, review. They run in isolation and return results.
- **Specialists** carry domain expertise. They don't run directly — the detail skill loads their knowledge into agents that do the exploration and specification work.
- **Producers** handle output format. A code-writer produces code. A document-writer produces .docx files. A presentation-creator produces .pptx files. Specialists decide what to build; producers decide how to render it.
- **State** tracks where the project is. Each skill updates state when it finishes and routes to the next step. No central coordinator needed for the standard flow.

## The User Experience We're After

You type `/intuition-start`. It tells you where you are and what's next. You follow the thread. Along the way, the framework asks you the questions that actually matter — not busywork questions, not confirmation theater, but genuine decision points where your input changes the outcome. Between those moments, the team works. At the end, you have deliverables that match what you asked for, built by specialists who understood the domain.

It should feel like having a capable team that speaks your language, respects your time, and delivers professional work.
