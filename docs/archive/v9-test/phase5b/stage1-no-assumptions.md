# Stage 1 Exploration: Task 4 — Build the Dependency Audit Skill

## Research Findings

Research subagents examined the following project context:

- `package.json` — 12 dependencies, 8 devDependencies
- `package-lock.json` — full dependency tree with 340 transitive dependencies
- `config/audit-policy.json` — does not exist (no current audit configuration)
- `reports/` — no existing audit reports

Key findings:
1. No existing audit tooling in the project
2. `npm audit` available as baseline but produces verbose, hard-to-read output
3. Several dependencies are 2+ major versions behind
4. No license compliance checking currently

## ECD Analysis

### Elements
- **Direct dependencies**: 20 packages declared in package.json
- **Transitive dependencies**: 340 packages in the full tree
- **Vulnerability database**: npm advisory database (via `npm audit`)
- **License types**: Mix of MIT, Apache-2.0, ISC across the tree
- **Audit report**: Markdown summary of findings

### Connections
- Direct deps → Transitive deps: each direct dep pulls in a subtree
- Vulnerability DB → Dep versions: advisories match specific version ranges
- License types → Compliance policy: some licenses may conflict with project goals
- Audit report → User action: findings need clear next-step recommendations

### Dynamics
- Skill runs `npm audit --json` to get vulnerability data
- Parses output into severity categories (critical, high, moderate, low)
- Checks each dependency's license against an allow-list
- Produces a ranked report: critical issues first, then version staleness, then license concerns
- Edge case: private registry packages may not have advisory data

## Key Decisions

### D1: Scope of Audit
- **Options**:
  - A) Vulnerabilities only — focus on security advisories — recommended
  - B) Vulnerabilities + license compliance
  - C) Vulnerabilities + license compliance + version staleness
- **Recommendation**: A, because it's the highest-value check and keeps the skill focused
- **Risk if wrong**: Missing license issues could cause compliance problems; missing staleness info means outdated deps go unnoticed

### D2: Transitive Dependency Depth
- **Options**:
  - A) Full tree — audit all 340 transitive dependencies — recommended
  - B) Direct only — audit only the 20 declared dependencies
- **Recommendation**: A, because vulnerabilities in transitive deps are the most common attack vector
- **Risk if wrong**: Full tree is slower and noisier; direct-only misses the majority of real vulnerabilities

### D3: Output Verbosity
- **Options**:
  - A) Summary with expandable details — top-level counts + per-issue breakdown — recommended
  - B) Full verbose — every advisory for every package
  - C) Executive summary only — just counts by severity
- **Recommendation**: A, because it balances actionability with readability
- **Risk if wrong**: Too verbose and users skip it; too brief and users can't act on it

### D4: Remediation Suggestions
- **Options**:
  - A) Include fix commands — `npm update package@version` for each issue — recommended
  - B) Flag issues only — user figures out the fix
- **Recommendation**: A, because actionable output is more valuable than just flagging
- **Risk if wrong**: Suggested commands might not account for breaking changes in major version bumps
