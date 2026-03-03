# Decision Framework — Direction Summary

**Status**: IMPLEMENTED — see `decision-framework-implementation.md` for build details
**Date**: 2026-03-03

## Problem Statement

In v9 workflows, the user (creative director) experiences two failure modes:

1. **Rubber-stamping**: Specialists surface technical decisions the user doesn't care about. The user always accepts the recommendation, making the interaction feel like wasted time.
2. **Silent decisions**: Specialists confidently make choices about user-facing experience, interaction patterns, and outputs without surfacing them. The user discovers these downstream when they're harder to change.

The root cause is structural: the system lacks a principled framework for classifying **who should make which decisions**. Classification currently relies on individual specialist judgment — and the classifier is the same entity making the decision, creating a blind spot.

## Core Insight

The user is the **creative director**, not the tech lead. They care about **what the user experiences** — outputs, interactions, workflows, look-and-feel. They do not care about **how the machine achieves it** — algorithms, patterns, internal architecture.

This maps to a universal pattern across creative industries (film, architecture, advertising, product management, music production): the principal retains control over the **experiential outcome**; specialists own the **technical method**.

## Research Foundations

Five external frameworks inform this direction:

### Appelo's 7 Levels of Delegation
A spectrum from "user decides" to "full autonomy." For practical use, the roundtable collapsed this to three tiers (see Framework below).

### RAPID (Bain & Company)
Separates "Recommend" from "Decide." Key insight: the specialist's job is *always* to recommend. The routing system determines whether the user reviews or the recommendation is auto-approved.

### Commander's Intent (Military / Product Management)
State the desired end state and why it matters. Let specialists determine how to get there. The prompt brief is the user's intent statement — it must be clear enough that downstream phases can classify decisions without guessing.

### Principal-Agent Theory (Economics)
The strongest alignment mechanism is **information forcing** — requiring specialists to show reasoning, surface assumptions, and present alternatives rather than just conclusions. When a specialist is confident and picks a direction silently, that's the exact scenario where blind spots occur.

### Decision Fatigue (Cognitive Psychology)
Every decision drains the same cognitive pool regardless of importance. The solution isn't "ask less" — it's "ask only the right things." Decision policies (rules that handle categories automatically) reduce fatigue more than individual case-by-case delegation.

## Professional Practice Patterns

Across film, architecture, advertising, product management, and music production:

- **Principal always retains**: Emotional register, strategic alignment, user/audience experience, approval gates, cross-specialist coordination
- **Specialist always owns**: Technical execution, tool selection, craft-level decisions, method of achieving stated outcome
- **Communication artifacts** (creative briefs, lookbooks, performance specs, reference tracks) all share a structure: **"here is what success feels like"** + **"here are the hard constraints"**
- The explicit anti-pattern in every domain is micromanagement — prescribing method when you should be evaluating outcome

## Proposed Framework: Three-Layer Decision System

### Layer 1: Prompt — Capture Intent + Posture

Prompt currently produces a brief through iterative refinement. Two additions:

**Commander's Intent Block** — a new section in the prompt brief:
- Desired end state: what success feels like to the end user
- Non-negotiables: the 2-3 things that would make the user reject the result
- Boundaries: constraints on the solution space (not prescribed solutions)

**Decision Posture Map** — the user's engagement preferences per brief element:
- "I decide" — surface with full options and tradeoffs
- "Show me options" — specialist recommends, user approves or redirects
- "Just handle it" — specialist has full autonomy

The posture map is coarse at this stage — it gets refined as plan decomposes tasks. Prompt can be somewhat longer here; the tradeoff is that more clarity upfront means fewer and faster questions in every downstream phase.

### Layer 2: Plan — Classify Decisions Per Task

Plan decomposes work into tasks. Each task gets a `Decisions` field with classified decision points:

**Three delegation tiers:**

| Label | Meaning | Appelo Equivalent |
|-------|---------|-------------------|
| `[USER]` | Specialist recommends, user decides | L2-L3 |
| `[SPEC]` | Specialist decides, reports rationale | L5-L6 |
| `[SILENT]` | Full autonomy, no report needed | L7 |

**Classification heuristic (2x2):**

| | Human-facing | Machine-facing |
|---|---|---|
| **Hard to reverse** | `[USER]` always | `[SPEC]` (reported with full reasoning) |
| **Easy to reverse** | `[USER]` by default, user can downgrade | `[SILENT]` |

Plan uses the Commander's Intent and Decision Posture from the prompt brief to determine what counts as "human-facing" from the user's perspective. Without that signal, plan defaults conservative.

**User confirmation**: After presenting the full task breakdown, one question: "Here are the decisions I'd surface to you during detail work. Want to reclassify any?" Shows `[USER]` and `[SPEC]` items only. One pass, not per-task. Capped at ~2-3 decisions per task to prevent overload.

### Layer 3: Downstream Phases — Follow, Log, Escalate

All phases after plan follow the delegation assignments:

**Detail / Specialists:**
- Follow `[USER]` / `[SPEC]` / `[SILENT]` labels from plan
- During Stage 1a research planning, explicitly separate "technical questions I'll resolve" from "experience questions I need principal input on"
- User gate surfaces `[USER]` decisions with full options + tradeoffs
- `[SPEC]` decisions logged with rationale
- New decisions discovered during work get classified using the 2x2 before being routed

**Engineer (v8 compat):**
- Simple boundary test: "Would the user notice this from the outside?"
- Decisions appended to a decision log with: decision, tier, rationale (one line), user-facing flag
- Gray area: implementation choices that constrain future UX get elevated to joint decisions

**Build:**
- Decision log is a read-only verification artifact
- Build report includes "Decision Compliance" section: user-reserved honored, expert-delegated applied, deviations noted
- Unanticipated decisions with user-facing impact: pause task and escalate, never guess
- Build's only autonomous domain: production logistics (task ordering, retries, format validation)

## The ECD Lens on Decision Ownership

The existing ECD framework (Elements, Connections, Dynamics) maps naturally:

- **Elements** (what exists): *Selection* of elements = user decision. *Internal composition* = specialist.
- **Connections** (how elements relate): Primarily user — these define experience flow. Technical protocol of connections = specialist.
- **Dynamics** (behavior over time): The danger zone. Experiential dynamics (loading states, error messages, progressive disclosure) = user. Mechanical dynamics (retry logic, caching strategy) = specialist. This is where implicit UX theft happens most — specialists make "technical" choices that shape what users perceive.

## Agent Architecture Considerations

- Decision policies must be serialized into agent spawn prompts (agents can't discover files)
- Structured decision artifacts (not free-text summaries) for reliable parsing by parent skills
- Classification belongs in plan (opus), not a separate agent or step
- Haiku research subagents never classify decisions — they flag potential decision points, opus synthesizes and classifies
- Decision policy blocks kept under 30 lines to avoid context bloat in agent prompts

## Open Questions

1. **Where does the decision log live?** Options include: inline in existing artifacts (code_specs.md, blueprints), a structured `decisions.json`, or a unified format that serves multiple consumers. Needs design-phase exploration.

2. **Default when unclassified.** Conservative (ask before deciding) vs. aggressive (specialist decides + reports). May be calibrated by the user's posture map — hands-on users get conservative defaults, delegators get aggressive defaults.

3. **Cross-specialist decisions.** When a decision spans multiple specialists (e.g., a database schema choice that affects API design that affects frontend display), who classifies and who decides? Likely needs coordination at the plan or handoff level.

4. **Learning over time.** Can the system build precedent? ("Last time you upgraded font choice from SILENT to USER — should I default color/typography decisions to USER going forward?") This is a future enhancement, not a v1 requirement.

5. **Metrics / feedback loop.** How does the user signal that the framework is calibrated well vs. still asking too much or too little? Post-build retrospective? Lightweight thumbs-up/down on decision quality?

## Roundtable Participants

Direction synthesized from perspectives of: Prompt, Plan, Design, Engineer, Build, Agent-Advisor — run as parallel consultation on 2026-03-03.
