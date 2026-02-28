# Cross-Blueprint Consistency Check

## Blueprints Reviewed

1. **Legal-Analyst.md (Task 1)** — Draft Residential Lease Agreement (Phase 3b)
2. **Legal-Analyst-T4.md (Task 4)** — Landlord Registration & Compliance Checklist (Phase 4)
3. **Financial-Analyst-T2.md (Task 2)** — Rental Market Analysis (Phase 4)

---

## Consistency Findings

### Consistent Assumptions

#### Property Profile — Fully Aligned
All three blueprints share and consistently describe the property:

- **Address**: 24 Meadow St, Concord, NH 03301 — confirmed in all three (Legal-Analyst Section 2, Legal-Analyst-T4 Section 2, Financial-Analyst-T2 Section 2)
- **Owners**: Taylor & Katelyn Goodington — confirmed in all three
- **Structure**: ADU (1-bedroom) in garage conversion with 8-foot rear extension — confirmed in all three
- **Original construction year**: 1971 (pre-1978, triggers lead paint rules) — confirmed in all three
- **ADU legal basis**: NH RSA 674:72 (HB 577, effective July 2025) — confirmed in both Legal-Analyst and Legal-Analyst-T4
- **Owner-occupancy**: Owners live in primary residence on same property — confirmed in Legal-Analyst Section 2 and Financial-Analyst-T2 Section 2
- **Zoning**: RS District, Concord allows ADUs in all residential districts — confirmed in Legal-Analyst Section 2 and Legal-Analyst-T4 (implied)

#### Lead Paint Disclosure — Fully Aligned
- **Trigger**: Pre-1978 structure (1971 construction) requires federal EPA disclosure and NH RSA 540-B compliance
- Legal-Analyst Section 2.1.2, Acceptance Criteria #2: "Lead paint disclosure included (pre-1978 structure)"
- Legal-Analyst-T4 Section 2 (Lead Paint Disclosure): EPA disclosure mandatory, RSA 540-B + 42 U.S.C. 4852d
- Financial-Analyst-T2 Section 2 (Regulatory Factors): "Lead paint disclosure required (1971 structure) — mitigated if full abatement occurs during construction [VERIFY]"

**Note**: Financial-Analyst-T2 flags potential mitigation via abatement, which is accurate but conditional. Legal blueprints assume disclosure regardless.

#### Security Deposit Terms — Fully Aligned
- **Statutory limit**: One month's rent or $100, whichever is greater
- Financial-Analyst-T2 Section 2 (Regulatory Factors): "Security deposit capped at one month's rent or $100 (whichever greater)"
- Legal-Analyst-T4 Section 2 (Category 3): Item 3.4 "Security Deposit Receipt — Within 30 days of receiving deposit" and "Deposit held in separate escrow account"
- Legal-Analyst Section 2.1.3: Confirms NH RSA 540-A statutory framework for security deposits

#### Lease Term — Consistent
- Financial-Analyst-T2 Section 5 (Sheet 4 — Seasonal Analysis): Recommends "12-month lease recommended regardless of listing season"
- Legal-Analyst Acceptance Criteria mention lease compliance but do not specify term length (planning documents typically leave this to market analysis)
- No contradictions found

#### Shared Driveway & Utilities — Aligned with Conditions
- Legal-Analyst Section 2 (Property Profile): "Shared elements: Driveway, yard (boundaries per site diagram), utilities (sub-metering recommended)"
- Financial-Analyst-T2 Section 2 (Regulatory Factors): "Utilities: tenant-paid via sub-metering (per user decision)"
- Legal-Analyst-T4 Section 3 (Category 3), Item 3.6: "Utility Responsibility Disclosure — Best practice / lease term — RECOMMENDED — Specify which utilities landlord vs. tenant pays. Critical if ADU is not sub-metered — lease must address allocation method."

**Consistency**: All three acknowledge shared driveway and recommend sub-metering for utilities. Legal-Analyst-T4 adds critical point: if NOT sub-metered, lease must explicitly address allocation.

#### Fire Safety & Separation — Fully Aligned
- Legal-Analyst Section 2.2 (Statutory Framework): "Fire separation between ADU and primary residence mandatory per Concord ADU rules"
- Legal-Analyst-T4 Section 2 (Fire & Life Safety): "Fire separation between ADU and primary residence mandatory per Concord ADU rules"
- Legal-Analyst-T4 Section 3 (Category 2, Item 2.6): "Fire Separation Inspection — mandatory per Concord ADU ordinance"
- Legal-Analyst-T4 Section 3 (Category 4, Item 4.3): "Fire Separation Between Units — Concord ADU ordinance / Building Code — REQUIRED"

**All three aligned** on this mandatory requirement.

#### Smoke & CO Detectors — Fully Aligned
- Legal-Analyst-T4 Section 2 (Fire & Life Safety): "NH RSA 153:10a: CO detectors required every level, battery backup + electrical power; Smoke detectors required per NH fire code"
- Legal-Analyst-T4 Section 3 (Category 4, Items 4.1-4.2): Both listed as REQUIRED
- Legal-Analyst Section 2.2 mentions safety requirements but does not enumerate specific detector types (appropriate for lease document)
- **No contradictions**: Compliance checklist correctly specifies technical requirements from statute.

#### Rental Type — Fully Aligned
- Legal-Analyst Section 2 (Property Profile): "Rental type: Long-term residential (not short-term/Airbnb)"
- Financial-Analyst-T2 Section 2 (Property Profile): "Long-term rental only (not short-term/Airbnb)"
- **Consistency**: Both exclude short-term rental model.

#### Owner-Occupied Protection — Aligned
- Legal-Analyst Section 2 (Zoning): "Concord allows ADUs in all residential districts, no owner-occupancy requirement"
- Financial-Analyst-T2 Section 2 (Regulatory Factors): "Owner-occupied primary residence on same property"
- Legal-Analyst-T4 Section 4 (Decisions Made), Item: "Flag owner-occupancy discrepancy but note it is moot" — Property_facts.md shows owners live on-site regardless
- **Consistency**: All three confirm owner-occupancy; Legal-Analyst-T4 notes earlier conflicting research has been resolved (owners do live on-site).

---

### Inconsistencies Found

#### INCONSISTENCY #1: Utility Structure Assumptions — MEDIUM Severity

**What**: The blueprints differ on who pays utilities in their baseline assumptions.

**Evidence**:
- **Legal-Analyst Section 2** states: "utilities (sub-metering recommended)" — treats sub-metering as recommended but doesn't mandate it
- **Legal-Analyst-T4 Section 3, Item 3.6** states: "Specify which utilities landlord vs. tenant pays. Critical if ADU is **not** sub-metered — lease must address allocation method."
- **Financial-Analyst-T2 Section 2 (Regulatory Factors)** declares: "Utilities: **tenant-paid via sub-metering (per user decision)**" — assumes sub-metering is **decided** (Option B selected)
- **Financial-Analyst-T2 Section 4 (Decision 1)** elaborates: The analysis is built on the assumption that sub-metering is selected and tenant pays utilities. All rent figures in the market analysis exclude utilities.

**Conflict**: Financial-Analyst-T2 **commits** to sub-metering as the chosen approach, while Legal-Analyst and Legal-Analyst-T4 treat it as conditional/recommended. This creates misalignment:
- If sub-metering is NOT installed (e.g., due to construction complexity), the rent recommendations in Financial-Analyst-T2 would be **too high** (they assume tenant pays utilities).
- Conversely, if sub-metering IS the firm decision, Legal-Analyst-T4 Section 3, Item 3.6 should remove the "if not sub-metered" caveat.

**Severity**: **MEDIUM** — The inconsistency is not a contradiction in fact, but a difference in **assumption commitment level**. All three blueprints acknowledge sub-metering is possible; only Financial-Analyst-T2 treats it as decided. This must be clarified before the lease is drafted.

**Suggested Resolution**:
- Confirm with user/project stakeholder: Is sub-metering the **decided** utility model or still under consideration?
- If decided: Update Legal-Analyst and Legal-Analyst-T4 to reflect sub-metering as baseline, not conditional.
- If conditional: Update Financial-Analyst-T2 to include scenario analysis (rent under sub-metering vs. rent if utilities included).

---

#### INCONSISTENCY #2: Lead Paint Abatement Scope — MEDIUM Severity

**What**: Blueprints differ on whether lead paint will be "fully abated" during construction.

**Evidence**:
- **Financial-Analyst-T2 Section 2 (Regulatory Factors)** states: "Lead paint disclosure required (1971 structure) — **mitigated if full abatement occurs during construction [VERIFY]**"
  - This implies: If full abatement happens, disclosure requirement may be reduced or waived.
- **Legal-Analyst Section 2 (Acceptance Criteria)** states: "#2. Lead paint disclosure included (pre-1978 structure)" — no conditional language
- **Legal-Analyst Section 2.1.2 (Lead Paint Disclosure)** states: "Federal and State Law: Full disclosure required under 42 U.S.C. 4852d (Residential Lead-Based Paint Hazard Reduction Act) and NH RSA 540-B. Disclosure is **always required at lease signing**, regardless of remediation status."

**Conflict**: Financial-Analyst-T2 suggests disclosure can be "mitigated" by abatement; Legal-Analyst correctly states disclosure is **always required** under federal law, regardless of remediation. The [VERIFY] flag indicates uncertainty in the market analysis.

**Severity**: **MEDIUM** — The Financial-Analyst-T2 language is imprecise and could mislead stakeholders into thinking disclosure is optional if abatement occurs. Federal law (42 U.S.C. 4852d) requires disclosure at lease signing **always**, even if lead has been remediated.

**Suggested Resolution**:
- Update Financial-Analyst-T2 Section 2 (Regulatory Factors) to clarify: "Lead paint disclosure **required** (1971 structure). Disclosure is mandatory under 42 U.S.C. 4852d regardless of abatement scope. Lead abatement may reduce risk profile but does not eliminate disclosure obligation."
- Remove the conditional language "mitigated if full abatement occurs."
- Update the [VERIFY] flag to focus on: "Confirm scope and type of lead abatement (if any) for tenant disclosure."

---

### Missing Cross-References

#### MISSING REFERENCE #1: Lease Agreement Should Cite Compliance Checklist Items

**Issue**: Legal-Analyst (Task 1) does not explicitly reference that certain compliance items from Legal-Analyst-T4 (Task 4) must be incorporated into the lease document.

**Evidence**:
- Legal-Analyst-T4 Section 7 (Integration Points) states: "**Task 1 (Lease Agreement)**: The lease must incorporate several items from this checklist:
  - Lead paint disclosure addendum (Items 3.2, 3.3)
  - Security deposit terms and bank disclosure (Items 3.4, 5.4)
  - Landlord identity disclosure (Item 3.5)
  - Utility responsibility disclosure (Item 3.6)
  - Renter's insurance requirement if adopted (Item 5.3)
  - Radon disclosure if applicable (Item 3.7)"

- Legal-Analyst makes no explicit statement that it will reference or coordinate with Task 4's compliance checklist.

**Impact**: Legal-Analyst (the lease blueprint) could miss required legal disclosures if it does not read or coordinate with the compliance checklist. The lease author needs visibility to Legal-Analyst-T4.

**Suggested Resolution**: Add a statement to Legal-Analyst Section 7 (or equivalent) stating: "This lease must incorporate all legally required disclosures and terms identified in Task 4 (Landlord Registration & Compliance Checklist), specifically: [list from Legal-Analyst-T4 Section 7]."

---

#### MISSING REFERENCE #2: Market Analysis Should Cite Lease & Compliance Context

**Issue**: Financial-Analyst-T2 does not reference that pricing recommendations depend on assumptions made in the lease (e.g., utility responsibility, security deposit structure, insurance requirements).

**Evidence**:
- Financial-Analyst-T2 provides rent price ranges ($1,250–$1,550) and justifies them using comparable comps and adjustment factors.
- However, it does not note that if the lease structure changes (e.g., landlord absorbs utilities instead of sub-metering), the recommended rent would need to decrease.
- Financial-Analyst-T2 Section 7 (Integration Points) references Task 3 (Listing Copy) and Task 5 (Expense Tracker), but **does not reference Task 1 (Lease)** or **Task 4 (Compliance)**.

**Impact**: Task 3 (Listing Copy) and Task 5 (Expense Tracker) consumers will read the market analysis but may not understand that rent recommendations are contingent on the lease terms and compliance assumptions established in Tasks 1 and 4.

**Suggested Resolution**: Add to Financial-Analyst-T2 Section 2 (Research Findings) or Section 7 (Integration Points): "Pricing assumes sub-metered utility model (tenant-paid) and standard NH security deposit structure per Task 1 (Lease Agreement) and Task 4 (Compliance Checklist). If lease structure changes (e.g., landlord-paid utilities), rent recommendations must be adjusted downward."

---

### Dependency Gaps

#### DEPENDENCY GAP #1: Legal-Analyst Needs Explicit Utility Model from User

**Issue**: Legal-Analyst (Task 1) needs to know whether utilities will be sub-metered before drafting the lease.

**Evidence**:
- Legal-Analyst Section 2 (Property Profile) states utilities are "sub-metering recommended" but doesn't commit to the model.
- The lease must specify utility responsibility (Legal-Analyst Section 2.1.4: ADU-Specific Provisions).
- Financial-Analyst-T2 has already assumed sub-metering is decided (Section 4, Decision 1).

**Gap**: If Financial-Analyst-T2's assumption is correct, Legal-Analyst should be informed of this decision so the lease clearly states "Tenant pays utilities via sub-meter." If the decision has not yet been made, Financial-Analyst-T2's pricing is premature.

**Suggested Resolution**:
- Before Legal-Analyst is executed, confirm and document: Will utilities be sub-metered (Option B) or included in rent (Option A)?
- Pass this decision to both Legal-Analyst and Legal-Analyst-T4 as a constraint.

---

#### DEPENDENCY GAP #2: Legal-Analyst-T4 Flags Multiple [VERIFY] Items That Impact Other Tasks

**Issue**: Legal-Analyst-T4 (Compliance Checklist) contains 9 [VERIFY] items (Section 8) that must be resolved before downstream tasks (lease drafting, pricing, expense planning) can finalize.

**Examples**:
- [VERIFY] Concord building permit fee schedule (impacts Task 5 expense planning)
- [VERIFY] Whether Concord fire dept inspection required for CO (impacts construction timeline, which impacts lease start date)
- [VERIFY] Landlord registration renewal frequency (impacts ongoing compliance, which impacts lease renewal clauses)
- [VERIFY] Concord radon disclosure requirement (impacts lease disclosures in Task 1)
- [VERIFY] Insurance premium estimates (impacts Task 5 expense projections)
- [VERIFY] Sewage/sewer connection approval process (impacts occupancy timeline)
- [VERIFY] Owner-occupancy requirement discrepancy in historical research (resolved but documented; no impact)
- [VERIFY] Lead paint abatement scope (impacts Financial-Analyst-T2's regulatory assumptions)

**Gap**: Legal-Analyst-T4 identifies these gaps correctly but does not establish a **handoff protocol** stating which downstream tasks are **blocked** until verification is complete.

**Suggested Resolution**:
- Create a dependency map: Which [VERIFY] items are blockers for Tasks 1, 3, 5, etc.?
- Examples of critical blockers:
  - Certificate of Occupancy timeline (Item 2.10) blocks lease start date → impacts Task 1 and Task 5
  - Radon disclosure requirement (Item 3.7) blocks lease finalization → impacts Task 1
  - Permit fees (Items 1.2-1.5) impact financial projections → impacts Task 5
- Mark these as handoff dependencies in project state.

---

#### DEPENDENCY GAP #3: Financial-Analyst-T2 Depends on Unknown ADU Specifications

**Issue**: Financial-Analyst-T2's price recommendations depend on three [VERIFY] items that are not yet confirmed.

**Evidence from Section 8 (Open Items)**:
1. **"ADU square footage"** — "if <550 sq ft, trend toward lower bound"
2. **"Laundry plans"** — "in-unit washer/dryer supports upper bound pricing; no laundry pushes toward lower bound"
3. **"Heating system type"** — affects tenant utility cost estimates

**Gap**: These variables are significant pricing drivers:
- Square footage affects perceived value (item 1 could swing pricing by $50–$150/month)
- Laundry changes recommendation from $1,400 (no laundry) to $1,550 (in-unit W/D)
- Heating system type affects tenant utility cost estimates, which impacts listing disclosure language

**Dependency**: Legal-Analyst should not finalize without confirming these specs (e.g., stating "ADU is 650 sq ft with in-unit washer/dryer" in the lease document). Task 1 (lease) must wait for Task 2 (market analysis) to confirm these details, or vice versa.

**Suggested Resolution**:
- Before finalizing either blueprint, confirm with user/project:
  - ADU square footage
  - Laundry location/availability
  - Heating system type (electric heat pump vs. gas/propane)
- Document these in a shared property specification (e.g., property_facts.md) that all three blueprints reference.
- Update Financial-Analyst-T2 price range if specs differ from [ESTIMATE] values.

---

## Overall Assessment

**Status**: **MINOR ISSUES**

### Summary

The three blueprints are substantially **consistent** in describing the property, legal framework, and high-level requirements. However, three **medium-severity gaps** must be resolved before execution:

1. **Utility Model Commitment** (Medium): Legal-Analyst and Legal-Analyst-T4 treat sub-metering as conditional; Financial-Analyst-T2 assumes it's decided. Must confirm decision and align all three blueprints.

2. **Lead Paint Abatement Misstatement** (Medium): Financial-Analyst-T2 incorrectly suggests disclosure can be "mitigated" by abatement. Federal law requires disclosure always. Update Financial-Analyst-T2 to correct this.

3. **Unresolved [VERIFY] Items** (Medium): Legal-Analyst-T4 flags 9 items requiring external verification; some block downstream tasks (lease finalization, expense planning). Establish dependency map and resolve critical items before legal and pricing blueprints are finalized.

### What Is Working Well

- **Property profile** aligned across all three
- **Statutory framework** (lead paint, fire safety, security deposits) consistent
- **ADU-specific requirements** (fire separation, egress, utilities) uniform
- **Integration points identified** (Legal-Analyst-T4 Section 7 explicitly maps lease dependencies)
- **Scope and depth appropriate** for each domain (legal precision in Task 1/4, financial modeling in Task 2)

### Recommendations Before Producer Handoff

1. **Resolve Utility Decision**: Confirm sub-metering is decided (Option B in Financial-Analyst-T2 Section 4). Update Legal-Analyst and Legal-Analyst-T4 to remove conditional language if confirmed.

2. **Correct Lead Paint Language**: Update Financial-Analyst-T2 Section 2 to clarify that disclosure is always required, regardless of abatement scope.

3. **Create [VERIFY] Resolution Map**:
   - Identify which items are blockers for Tasks 1, 3, 5
   - Prioritize resolution of critical items (CO timeline, radon requirement, lease-dependent specs)
   - Document resolution status before any downstream task is executed

4. **Confirm ADU Specifications**: Before finalizing Financial-Analyst-T2 pricing or Legal-Analyst lease language, lock in:
   - Square footage
   - Laundry location/type
   - Heating system type
   - Lead abatement scope

5. **Cross-Reference Update**: Add statements to both Legal-Analyst and Financial-Analyst-T2 Section 7 (Integration Points) explicitly referencing the other blueprint's constraints and dependencies.

---

## Conclusion

The three blueprints form a coherent, complementary analysis of the ADU rental project. No contradictions in **fact** exist; the inconsistencies are in **assumption commitment level** and **precision**. With the above clarifications, all three blueprints can proceed to producer handoff without risk of misalignment.

