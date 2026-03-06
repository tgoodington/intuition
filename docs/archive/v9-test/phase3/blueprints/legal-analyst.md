# Blueprint: Residential Lease Agreement — 24 Meadow St ADU

## 1. Task Reference

- **Plan Task**: Task 1 — Draft Residential Lease Agreement
- **Domain**: legal/contracts
- **Depth**: Deep
- **Output**: `deliverables/01_lease_agreement.md`
- **Acceptance Criteria** (from plan):
  1. Lease complies with NH RSA 540 and 540-A requirements
  2. Lead paint disclosure included (pre-1978 structure)
  3. Security deposit terms within NH statutory limits
  4. ADU-specific provisions address shared property boundaries
  5. All required NH landlord disclosures present

---

## 2. Research Findings

### Statutory Framework

**NH RSA 540 — Actions Against Tenants**
- 30-day written notice required for termination of month-to-month tenancy.
- During a fixed lease term, eviction requires specific grounds (nonpayment, lease violation, damage, criminal activity).
- All evictions must go through court process. Self-help eviction (lockouts, utility shutoffs, property removal) is prohibited.
- Landlord cannot retaliate against tenant for exercising legal rights (filing complaints, requesting repairs).

**NH RSA 540-A — Security Deposits**
- Maximum deposit: one month's rent OR $100, whichever is greater.
- Must be held in a separate escrow account at a New Hampshire bank or banking institution.
- Landlord must provide tenant written receipt with bank name and account number within 30 days of receiving the deposit.
- Interest must be paid to tenant on the deposit at the rate paid by the bank.
- Deposit must be returned within 30 days of lease termination, accompanied by an itemized list of any deductions.
- No separate "last month's rent" collection — only security deposit is permitted.
- [VERIFY] Whether NH law treats pet deposits as separate from the RSA 540-A security deposit cap, or whether all deposits are aggregated under the one-month maximum.
- [VERIFY] Whether failure to return deposit within 30 days triggers double damages under current statute.

**NH RSA 540-B — Lead Paint Disclosure**
- Applies to all residential rental properties built before 1978.
- Garage at 24 Meadow St was built in 1971 — disclosure is mandatory.
- Landlord must provide: (a) EPA-approved lead paint disclosure form, (b) "Protect Your Family from Lead in Your Home" pamphlet, (c) lead paint disclosure addendum incorporated into the lease.
- Landlord must disclose any known lead-based paint hazards and any available reports or records.
- Failure to disclose: tenant may void the lease; landlord is liable for damages.

**NH RSA 674:72 — Accessory Dwelling Units**
- Municipalities cannot prohibit ADUs in residential zones.
- Concord permits ADUs in all residential districts with no owner-occupancy requirement.
- ADU is a separate dwelling unit — a separate lease is legally appropriate.

### Property Facts

- Address: 24 Meadow St, Concord, NH 03301
- Owners: Taylor & Katelyn Goodington
- ADU: 1-bedroom unit above converted two-bay garage, private entrance
- Original garage construction: 1971 (pre-1978 — lead paint disclosure required)
- Shared elements: driveway, yard (boundaries TBD at time of research), utilities (sub-metering TBD)
- Site: in-ground pool in rear yard, regulated wetlands at rear
- Variance for 8-foot rear extension granted February 2026

### Required Disclosures Identified

1. Lead paint disclosure addendum with EPA form and pamphlet (mandatory — RSA 540-B)
2. Security deposit escrow bank name and account number (mandatory — RSA 540-A, within 30 days)
3. Landlord name and address or authorized agent (mandatory)
4. Utility responsibility disclosure (mandatory given shared property)
5. Radon disclosure — [VERIFY] whether Concord has local requirements beyond state recommendations

---

## 3. Approach

The lease agreement is structured as a standalone residential lease for the ADU unit, with an ADU-specific shared property addendum and a lead paint disclosure addendum. The approach treats the ADU as an independent rental unit while explicitly addressing the shared-property realities of an owner-occupied ADU situation.

**Key structural decisions:**
- 12-month fixed term with automatic conversion to month-to-month at expiration
- Utilities included in rent with a conversion clause for future sub-metering
- No tenant access to the in-ground pool
- Exclusive tenant outdoor area defined near ADU entrance; all other areas restricted
- Pet policy presented as two alternatives (landlord selects at execution)
- All NH statutory requirements embedded directly in clause language, not relegated to addenda alone
- Lead paint disclosure as a required addendum with signature acknowledgment

---

## 4. Decisions Made

### Decision 1: Lease Term Structure
- **Chosen**: 12-month fixed term with automatic month-to-month renewal after initial term
- **Alternatives considered**: (A) Month-to-month from start — maximum flexibility but less income security; (B) Fixed-term with fixed-term renewal — locks both parties for longer periods
- **Rationale**: Fixed initial term provides income stability while establishing the tenancy. Month-to-month conversion gives landlord flexibility to adjust terms or terminate with 30 days' notice if the ADU arrangement proves unworkable.

### Decision 2: Pool Access
- **Chosen**: No tenant access to pool area
- **Alternatives considered**: Shared access with liability waiver and rules
- **Rationale**: Eliminates significant liability exposure and insurance complications. Pool area is restricted to landlord household. Can be amended later if relationship warrants it.

### Decision 3: Utility Arrangement
- **Chosen**: Utilities included in rent, with automatic conversion to tenant-pays when sub-metering is installed
- **Alternatives considered**: (A) Tenant pays from day one (requires sub-metering infrastructure); (B) Percentage allocation formula (dispute-prone)
- **Rationale**: Sub-metering status is TBD. Including utilities in rent is simplest for launch. Conversion clause avoids needing a lease amendment when meters are installed. Reasonable-use provision protects landlord from abuse.

### Decision 4: Pet Policy
- **Chosen**: Blueprint specifies both alternatives (no pets / pets with restrictions); landlord selects at lease execution
- **Legal flag**: [VERIFY] whether NH RSA 540-A aggregates all deposits (including pet deposits) under the one-month maximum, which would make a separate pet deposit impermissible
- **Rationale**: New construction argues for no-pets to protect the unit. Pet-friendly argues for broader tenant pool. Decision deferred to execution with both options fully drafted.

### Decision 5: Shared Yard Boundaries
- **Chosen**: Exclusive tenant area defined as patio/deck and immediate area adjacent to ADU private entrance. Shared access to driveway and walkway to ADU entrance. All other yard areas (including pool area and wetland buffer zone) restricted to landlord use.
- **Alternatives considered**: Full shared yard access with rules — rejected due to friction potential in owner-occupied ADU situation.
- **Rationale**: Clear spatial boundaries reduce landlord-tenant friction. Exact dimensions to be specified in an exhibit diagram attached at execution.

---

## 5. Deliverable Specification

The lease agreement consists of a main document and two required addenda. Below is the section-by-section specification with actual clause language. The producer should assemble these into a single markdown document with clear section numbering.

### Document Header

```
RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement ("Lease") is entered into as of __________, 20__
("Effective Date"), by and between:

LANDLORD:
Taylor Goodington and Katelyn Goodington
24 Meadow St, Concord, NH 03301
(collectively, "Landlord")

TENANT:
__________________________ ("Tenant")

The Landlord and Tenant are collectively referred to as the "Parties."
```

### Section 1: Premises

```
1. PREMISES

Landlord hereby leases to Tenant the following described premises ("Premises"):

The accessory dwelling unit ("ADU") located at 24 Meadow St, Concord, NH 03301,
consisting of a one-bedroom apartment situated above the converted garage structure,
including the private entrance serving the unit.

The Premises is a lawfully permitted accessory dwelling unit under New Hampshire
RSA 674:72 and the City of Concord zoning ordinance. The ADU is a separate dwelling
unit from the primary residence located on the same property.

The Premises does NOT include:
- The primary residence at 24 Meadow St
- The in-ground pool and surrounding pool area
- Any portion of the yard or grounds except as specified in Section 15
  (Shared Property Areas)
- The garage bays below the ADU (if any remain in landlord use)

Year of original construction of the garage structure: 1971.
```

### Section 2: Term

```
2. TERM

A. Initial Term. The initial lease term shall be twelve (12) months, commencing
on __________, 20__ ("Commencement Date") and ending on __________, 20__
("Expiration Date").

B. Renewal. Upon expiration of the Initial Term, this Lease shall automatically
convert to a month-to-month tenancy under the same terms and conditions, unless
either Party provides written notice of termination at least thirty (30) days
prior to the end of the then-current term, in accordance with NH RSA 540.

C. Early Termination. During the Initial Term, neither Party may terminate this
Lease except for cause as permitted under NH RSA 540. During any month-to-month
renewal period, either Party may terminate with thirty (30) days' written notice
prior to the end of a monthly period.
```

### Section 3: Rent

```
3. RENT

A. Monthly Rent. Tenant shall pay Landlord monthly rent in the amount of
$__________ ("Monthly Rent"), due on the first (1st) day of each calendar month.

B. First Month. Rent for the first month shall be due on or before the
Commencement Date. If the Commencement Date is not the first day of a month,
rent for the partial first month shall be prorated on a daily basis.

C. Payment Method. Rent shall be paid by [check / electronic transfer / other
method specified by Landlord]. Payments by check shall be made payable to
"Taylor Goodington" and delivered to: 24 Meadow St, Concord, NH 03301, or such
other address as Landlord may designate in writing.

D. Late Fee. If rent is not received by the fifth (5th) day of the month, Tenant
shall pay a late fee of $__________ [not to exceed a reasonable amount — recommend
5% of monthly rent or $50, whichever is less]. Late fees shall not exceed the
actual administrative cost to Landlord caused by the late payment.

E. Returned Payments. If any payment is returned for insufficient funds, Tenant
shall pay a returned payment fee of $25.00 in addition to the late fee if
applicable.
```

### Section 4: Security Deposit

```
4. SECURITY DEPOSIT

This section is governed by New Hampshire RSA 540-A. Any provision of this Lease
that conflicts with RSA 540-A is superseded by the statute.

A. Amount. Tenant shall pay a security deposit in the amount of $__________
("Security Deposit") upon execution of this Lease. The Security Deposit shall not
exceed one (1) month's rent or one hundred dollars ($100.00), whichever is greater,
as required by NH RSA 540-A:1.

B. Escrow. Landlord shall hold the Security Deposit in a separate escrow account
at a New Hampshire bank or banking institution. Landlord shall not commingle the
Security Deposit with Landlord's personal funds.

C. Deposit Receipt. Within thirty (30) days of receiving the Security Deposit,
Landlord shall provide Tenant with a written receipt stating the name and address
of the bank or banking institution where the deposit is held and the account number.

D. Interest. The Security Deposit shall accrue interest at the rate paid by the
bank on the escrow account. Landlord shall pay or credit accrued interest to
Tenant annually.

E. Permitted Deductions. Landlord may deduct from the Security Deposit only for:
   (i) Unpaid rent;
   (ii) Damage to the Premises beyond normal wear and tear;
   (iii) Other charges permitted under this Lease and NH law.

F. Return. Within thirty (30) days after termination of the tenancy and Tenant's
surrender of the Premises, Landlord shall return the Security Deposit to Tenant,
less any lawful deductions. If deductions are made, Landlord shall provide Tenant
with an itemized written statement of each deduction and the amount thereof.

G. Forwarding Address. Tenant shall provide Landlord with a forwarding address
at or before the time of surrender. Landlord shall mail the deposit return and
any itemized statement to the forwarding address provided.

H. No Last Month's Rent. The Security Deposit shall not be applied as last
month's rent. Tenant may not withhold rent in the final month in lieu of the
Security Deposit.
```

### Section 5: Utilities and Services

```
5. UTILITIES AND SERVICES

A. Included Utilities. During such time as the Premises does not have separate
utility metering, the following utilities are included in the Monthly Rent:
   - Electricity
   - Heat (gas/electric — specify)
   - Water and sewer
   - Trash removal
   - Internet (if applicable — specify)

B. Reasonable Use. Tenant shall use utilities in a reasonable and customary
manner consistent with normal residential use for a one-bedroom dwelling. Landlord
reserves the right to address excessive utility usage (defined as usage materially
exceeding the average for a comparable one-bedroom unit in the Concord, NH area)
through written notice and good-faith discussion with Tenant.

C. Sub-Metering Conversion. If Landlord installs separate utility meters or
sub-meters for the Premises, Landlord shall provide Tenant with sixty (60) days'
written notice. Upon activation of separate metering:
   (i) Tenant shall establish utility accounts in Tenant's name and pay directly
       for metered utilities;
   (ii) The Monthly Rent shall be reduced by $__________ [amount to be determined
        at that time based on average utility costs during the preceding six months
        of tenancy, or if less than six months, based on reasonable estimate] to
        reflect the transfer of utility costs to Tenant;
   (iii) The rent reduction and effective date shall be documented in a written
         amendment signed by both Parties.

D. Service Interruptions. Landlord shall not be liable for temporary interruptions
in utility service caused by events beyond Landlord's reasonable control, including
utility provider outages, weather events, and necessary maintenance. Landlord shall
provide reasonable advance notice of any planned service interruptions.
```

### Section 6: Use and Occupancy

```
6. USE AND OCCUPANCY

A. Permitted Use. The Premises shall be used exclusively as a private residence
for Tenant and the following authorized occupants: __________________________.
The total number of occupants shall not exceed two (2) persons.

B. Prohibited Uses. Tenant shall not:
   (i) Conduct any business or commercial activity on the Premises, except for
       remote work or home office use that does not generate foot traffic,
       signage, or deliveries beyond normal residential levels;
   (ii) Use or permit the Premises to be used for any unlawful purpose;
   (iii) Create or permit any nuisance or unreasonably disturb the quiet enjoyment
         of neighboring residents, including the occupants of the primary residence;
   (iv) Store hazardous materials on the Premises beyond normal household quantities;
   (v) Make any structural alterations or modifications to the Premises without
       prior written consent of Landlord.

C. Smoking. Smoking of any substance (including tobacco, cannabis, and
e-cigarettes/vaping) is prohibited inside the Premises. Smoking outdoors is
permitted only in the Tenant's designated exclusive outdoor area as defined in
Section 15.

D. Compliance. Tenant shall comply with all applicable federal, state, and local
laws, ordinances, and regulations in connection with Tenant's use of the Premises.
```

### Section 7: Pet Policy

```
7. PET POLICY

[OPTION A — NO PETS]
No pets of any kind are permitted on the Premises without the prior written consent
of Landlord. This prohibition includes but is not limited to dogs, cats, birds,
reptiles, and fish tanks exceeding 10 gallons. Tenant acknowledges that unauthorized
pets constitute a material lease violation.

This restriction does not apply to service animals or emotional support animals as
required by applicable federal and state fair housing laws. Tenant must provide
Landlord with documentation of the need for such animal prior to bringing the
animal onto the Premises.

[OPTION B — PETS ALLOWED WITH RESTRICTIONS]
Tenant may keep the following pet(s) on the Premises, subject to the conditions
below:
   Pet description: __________________________
   Breed: __________________ Weight limit: ____ lbs

   (i) Maximum of one (1) pet unless otherwise agreed in writing.
   (ii) Tenant is responsible for all damage caused by the pet, including damage
        to flooring, walls, fixtures, and outdoor areas.
   (iii) Tenant shall not permit the pet to create unreasonable noise or
         disturbance.
   (iv) Tenant shall promptly clean up all pet waste from outdoor areas.
   (v) Pet deposit: $__________ [VERIFY: NH RSA 540-A may prohibit any deposit
       exceeding one month's rent in total. If pet deposits are aggregated with
       the security deposit under the statutory cap, this deposit may not be
       collected separately. Landlord should verify with a NH-licensed attorney
       before collecting a pet deposit in addition to the security deposit.]

Service animals and emotional support animals are exempt from these restrictions
as required by applicable federal and state fair housing laws.

[LANDLORD: SELECT OPTION A OR OPTION B AND DELETE THE OTHER BEFORE EXECUTION.]
```

### Section 8: Maintenance and Repairs

```
8. MAINTENANCE AND REPAIRS

A. Landlord Obligations. Landlord shall maintain the Premises in compliance with
all applicable housing codes and the implied warranty of habitability under New
Hampshire law, including but not limited to:
   (i) Structural elements (roof, walls, foundation, floors);
   (ii) Plumbing, electrical, and heating systems;
   (iii) Common areas and shared property elements;
   (iv) Snow and ice removal from shared driveway and walkways providing access
        to the Premises;
   (v) Exterior maintenance of the ADU structure.

B. Tenant Obligations. Tenant shall:
   (i) Keep the Premises in clean and sanitary condition;
   (ii) Dispose of garbage and waste in designated receptacles;
   (iii) Not damage or permit damage to the Premises beyond normal wear and tear;
   (iv) Promptly notify Landlord of any maintenance issues, defects, or needed
        repairs;
   (v) Replace light bulbs, smoke detector batteries (if battery-operated), and
       HVAC filters as needed;
   (vi) Maintain the Tenant's exclusive outdoor area in reasonable condition.

C. Repair Requests. Tenant shall submit repair requests to Landlord in writing
(email is acceptable). Landlord shall respond to non-emergency repair requests
within a reasonable time, not to exceed fourteen (14) days. Emergency repairs
(those involving immediate risk to health, safety, or substantial property damage)
shall be addressed as promptly as practicable.

D. Landlord Contact for Emergencies.
   Emergency contact: __________________________
   Phone: __________________________
   Email: __________________________
```

### Section 9: Landlord Access

```
9. LANDLORD ACCESS

A. Notice Required. Landlord may enter the Premises for inspection, maintenance,
repairs, or showing the unit to prospective tenants or purchasers, provided
Landlord gives Tenant reasonable advance notice. "Reasonable notice" means at
least twenty-four (24) hours' written or verbal notice, except in emergencies.

B. Emergency Access. Landlord may enter the Premises without prior notice in the
event of an emergency posing immediate risk to persons or property (including but
not limited to fire, flood, gas leak, or suspected medical emergency).

C. Timing. Non-emergency entries shall be scheduled during reasonable hours
(between 8:00 AM and 7:00 PM) unless otherwise agreed by Tenant.
```

### Section 10: Insurance

```
10. INSURANCE

A. Renter's Insurance. Tenant is [required / strongly encouraged — Landlord to
select] to obtain and maintain renter's insurance with a minimum coverage amount
of $__________ for personal property and $100,000 for personal liability
throughout the term of this Lease.

B. Proof of Insurance. If renter's insurance is required, Tenant shall provide
Landlord with proof of coverage prior to the Commencement Date and upon each
renewal of the policy.

C. Landlord's Insurance. Landlord shall maintain property insurance for the
structure. Landlord's insurance does not cover Tenant's personal property or
Tenant's liability.
```

### Section 11: Termination and Move-Out

```
11. TERMINATION AND MOVE-OUT

A. Notice. Termination of this Lease shall require written notice as follows:
   (i) During the Initial Term: only for cause as permitted by NH RSA 540.
   (ii) During month-to-month renewal: thirty (30) days' written notice by
        either Party, delivered before the start of the final monthly period.

B. Surrender. Upon termination, Tenant shall:
   (i) Remove all personal property from the Premises;
   (ii) Return all keys, access devices, and garage door openers (if applicable)
        to Landlord;
   (iii) Leave the Premises in broom-clean condition, ordinary wear and tear
         excepted;
   (iv) Provide Landlord with a forwarding address for return of the Security
        Deposit.

C. Holdover. If Tenant remains in possession after the termination date without
Landlord's written consent, Tenant shall be deemed a holdover tenant on a
month-to-month basis at a rent of 150% of the last Monthly Rent, subject to
Landlord's right to pursue eviction under NH RSA 540.

D. Abandonment. If Tenant abandons the Premises (defined as absence for thirty
(30) or more consecutive days without rent payment and without notice to
Landlord), Landlord may re-enter and re-let the Premises and dispose of any
remaining personal property in accordance with NH law.
```

### Section 12: Landlord Disclosures

```
12. LANDLORD DISCLOSURES

In accordance with New Hampshire law, Landlord makes the following disclosures:

A. Landlord Identity. The name and address of the Landlord (or authorized agent
for service of process and receipt of notices) is:
   Taylor Goodington and Katelyn Goodington
   24 Meadow St, Concord, NH 03301
   Phone: __________________________
   Email: __________________________

B. Lead-Based Paint. The garage structure containing the Premises was built in
1971. In accordance with federal law (42 U.S.C. 4852d) and NH RSA 540-B,
Landlord has provided the Lead-Based Paint Disclosure Addendum (Addendum A)
and the EPA pamphlet "Protect Your Family from Lead in Your Home." Tenant's
signature on Addendum A confirms receipt.

C. Security Deposit Account. [To be completed within 30 days of deposit receipt.]
   Bank name: __________________________
   Account number: __________________________
   Bank address: __________________________

D. Utility Responsibility. At the commencement of this Lease, utilities for the
Premises are included in the Monthly Rent as set forth in Section 5. Landlord
is responsible for utility accounts. If and when separate metering is installed,
utility responsibility will transfer to Tenant as described in Section 5(C).

E. Radon. [VERIFY: Include if Concord or NH requires radon disclosure for
rentals.] Radon is a naturally occurring radioactive gas that may be found in
any building in New Hampshire. Tenant may wish to conduct radon testing at
Tenant's expense. Landlord has no knowledge of elevated radon levels on the
Premises. [Modify if testing has been conducted.]
```

### Section 13: Eviction and Dispute Resolution

```
13. EVICTION AND DISPUTE RESOLUTION

A. Grounds for Eviction. Landlord may pursue eviction only for grounds permitted
under NH RSA 540, including but not limited to:
   (i) Nonpayment of rent;
   (ii) Substantial violation of lease terms after written notice and reasonable
        opportunity to cure;
   (iii) Behavior constituting a serious threat to other persons or the property;
   (iv) Other grounds as specified in RSA 540.

B. No Self-Help. Landlord shall not engage in self-help eviction, including
changing locks, removing Tenant's property, or shutting off utilities. All
eviction proceedings shall follow the judicial process required by NH RSA 540.

C. Non-Retaliation. Landlord shall not retaliate against Tenant for exercising
any legal right, including filing complaints with government agencies, requesting
repairs, or participating in tenant organizations.

D. Mediation. Before initiating formal legal proceedings for non-emergency
disputes (excluding nonpayment of rent), the Parties agree to attempt resolution
through good-faith discussion. Either Party may suggest mediation through a
mutually agreed mediator. Mediation costs, if any, shall be shared equally.
This clause does not waive either Party's right to pursue legal remedies.
```

### Section 14: Quiet Enjoyment

```
14. QUIET ENJOYMENT

A. Tenant's Right. Landlord covenants that Tenant, upon paying rent and
performing all obligations under this Lease, shall peacefully and quietly hold
and enjoy the Premises for the full term without interference from Landlord or
anyone claiming through Landlord.

B. Noise and Conduct. Given the proximity of the Premises to the primary
residence, both Parties agree to maintain reasonable noise levels. Quiet hours
are from 10:00 PM to 7:00 AM daily.

C. Guest Policy. Tenant may have guests on the Premises. Guests staying longer
than fourteen (14) consecutive days or more than thirty (30) days in any
twelve-month period shall be considered unauthorized occupants unless approved
in writing by Landlord.
```

### Section 15: Shared Property Areas (ADU-Specific)

```
15. SHARED PROPERTY AREAS

This section addresses the shared nature of the property at 24 Meadow St, which
includes both the primary residence occupied by Landlord and the ADU Premises
occupied by Tenant.

A. Tenant's Exclusive Area. Tenant has exclusive use of:
   (i) The interior of the ADU Premises;
   (ii) The private entrance to the ADU and immediately adjacent landing/stairway;
   (iii) The designated outdoor area adjacent to the ADU private entrance, as
         shown on the attached Exhibit B (Property Diagram). [Exhibit B to be
         prepared showing approximate boundaries of the Tenant's exclusive
         outdoor area.]

B. Shared Areas. The following areas are shared between Landlord and Tenant:
   (i) The driveway providing vehicular access to the property;
   (ii) The walkway from the driveway to the ADU private entrance.

   Rules for shared areas:
   - Tenant is assigned one (1) dedicated parking space as designated by Landlord.
     Tenant shall park only in the designated space.
   - Tenant shall keep shared walkways clear of personal belongings.
   - Snow and ice removal from shared areas is Landlord's responsibility.

C. Restricted Areas. The following areas are for Landlord's exclusive use, and
Tenant shall not access them without Landlord's express permission:
   (i) The primary residence and all entrances thereto;
   (ii) The in-ground pool and surrounding pool deck/patio area;
   (iii) All yard areas not designated as Tenant's exclusive area or shared areas;
   (iv) The rear yard area adjacent to regulated wetlands;
   (v) Any storage areas within the garage structure reserved by Landlord.

D. Boundary Modifications. Landlord may modify the boundaries of shared and
restricted areas with thirty (30) days' written notice to Tenant, provided that
Tenant's exclusive area and reasonable access to the Premises are not diminished.

E. Property Diagram. The Parties shall execute Exhibit B (Property Diagram)
showing the Tenant's exclusive outdoor area, shared areas, and restricted areas.
Exhibit B is incorporated into this Lease by reference.
```

### Section 16: Parking

```
16. PARKING

A. Assigned Space. Tenant is assigned one (1) parking space in the shared
driveway at the location designated by Landlord.

B. Vehicles. Tenant may park one (1) registered and operable motor vehicle in
the assigned space. Inoperable vehicles, recreational vehicles, trailers, and
commercial vehicles are not permitted without Landlord's written consent.

C. Guest Parking. Tenant's guests may park temporarily in the shared driveway
only if doing so does not obstruct Landlord's access or use of the driveway.
Overnight guest parking requires advance notice to Landlord.
```

### Section 17: General Provisions

```
17. GENERAL PROVISIONS

A. Entire Agreement. This Lease, together with all addenda and exhibits,
constitutes the entire agreement between the Parties and supersedes all prior
negotiations, representations, and agreements.

B. Amendments. This Lease may be amended only by a written instrument signed
by both Parties.

C. Severability. If any provision of this Lease is held invalid or unenforceable,
the remaining provisions shall continue in full force and effect.

D. Governing Law. This Lease shall be governed by the laws of the State of
New Hampshire. To the extent any provision of this Lease conflicts with
applicable New Hampshire statutes (including RSA 540, 540-A, and 540-B), the
statute shall control.

E. Notices. All notices required under this Lease shall be in writing and
delivered by hand, first-class mail, or email to the addresses specified in
Section 12(A) (for Landlord) and to the Premises address (for Tenant), or to
such other address as either Party may designate in writing.

F. Waiver. The failure of either Party to enforce any provision of this Lease
shall not constitute a waiver of the right to enforce that provision in the
future.

G. Binding Effect. This Lease shall be binding upon and inure to the benefit
of the Parties and their respective heirs, executors, administrators, and
permitted assigns.

H. Assignment and Subletting. Tenant shall not assign this Lease or sublet
the Premises, in whole or in part, without the prior written consent of Landlord.
```

### Section 18: Signatures

```
18. SIGNATURES

By signing below, the Parties acknowledge that they have read and agree to all
terms and conditions of this Lease, including all addenda and exhibits.

LANDLORD:

______________________________     Date: ______________
Taylor Goodington

______________________________     Date: ______________
Katelyn Goodington


TENANT:

______________________________     Date: ______________
[Tenant Name]
```

### Addendum A: Lead-Based Paint Disclosure

```
ADDENDUM A: LEAD-BASED PAINT DISCLOSURE

(Required by federal law for housing built before 1978 — 42 U.S.C. 4852d —
and NH RSA 540-B)

Property Address: 24 Meadow St (ADU), Concord, NH 03301
Year of Construction of Structure: 1971

LANDLORD'S DISCLOSURE:

(a) Presence of lead-based paint and/or lead-based paint hazards (check one):
    [ ] Known lead-based paint and/or lead-based paint hazards are present in
        the housing. Explain: ________________________________________________
    [ ] Landlord has no knowledge of lead-based paint and/or lead-based paint
        hazards in the housing.

(b) Records and reports available to Landlord (check one):
    [ ] Landlord has provided Tenant with all available records and reports
        pertaining to lead-based paint and/or lead-based paint hazards in the
        housing. List: _______________________________________________________
    [ ] Landlord has no reports or records pertaining to lead-based paint
        and/or lead-based paint hazards in the housing.

TENANT'S ACKNOWLEDGMENT:

(c) Tenant has received:
    [ ] The EPA pamphlet "Protect Your Family from Lead in Your Home."
    [ ] The above disclosure information from Landlord.

(d) Tenant has had the opportunity (check one):
    [ ] To conduct an independent lead-based paint inspection of the Premises
        at Tenant's expense. Tenant [did / did not] elect to conduct such an
        inspection.
    [ ] Tenant waives the opportunity to conduct a lead-based paint inspection.

CERTIFICATION:

Landlord has disclosed all known information regarding lead-based paint and
lead-based paint hazards. Tenant has received all required information.

LANDLORD:

______________________________     Date: ______________
Taylor Goodington

______________________________     Date: ______________
Katelyn Goodington

TENANT:

______________________________     Date: ______________
[Tenant Name]


AGENT (if applicable):

______________________________     Date: ______________
[Agent Name]
```

### Exhibit B: Property Diagram (Placeholder)

```
EXHIBIT B: PROPERTY DIAGRAM

[TO BE PREPARED BEFORE LEASE EXECUTION]

This exhibit shall contain a diagram or annotated photograph of the property
at 24 Meadow St showing:

1. The ADU Premises (outlined)
2. The Tenant's private entrance
3. The Tenant's exclusive outdoor area (shaded or outlined)
4. The shared driveway and walkway
5. The Tenant's assigned parking space
6. The restricted areas (pool, general yard, wetland buffer)

Both Parties shall sign and date the Property Diagram.

LANDLORD:

______________________________     Date: ______________
Taylor Goodington

______________________________     Date: ______________
Katelyn Goodington

TENANT:

______________________________     Date: ______________
[Tenant Name]
```

---

## 6. Acceptance Mapping

| # | Plan Acceptance Criterion | How Addressed |
|---|--------------------------|---------------|
| 1 | Lease complies with NH RSA 540 and 540-A requirements | RSA 540: Section 2 (term/notice periods), Section 11 (termination), Section 13 (eviction — no self-help, court process required, non-retaliation). RSA 540-A: Section 4 (full statutory compliance — deposit cap, escrow, receipt, interest, 30-day return, itemized deductions, no last-month's-rent). Section 17(D) explicitly states statutes override any conflicting lease language. |
| 2 | Lead paint disclosure included (pre-1978 structure) | Section 1 states 1971 construction year. Section 12(B) references the disclosure obligation and addendum. Addendum A provides the complete EPA-compliant lead paint disclosure form with landlord disclosure, tenant acknowledgment, and certification signatures. References both 42 U.S.C. 4852d and NH RSA 540-B. |
| 3 | Security deposit terms within NH statutory limits | Section 4 specifies: (A) cap at one month's rent or $100 whichever greater, (B) NH bank escrow, (C) 30-day written receipt with bank details, (D) interest payment, (E) permitted deductions only, (F) 30-day return with itemization, (G) forwarding address, (H) no application as last month's rent. Opens with statement that RSA 540-A supersedes any conflicting provision. |
| 4 | ADU-specific provisions address shared property boundaries | Section 15 (Shared Property Areas) defines three tiers: exclusive tenant area, shared areas with rules, and restricted areas. Section 16 (Parking) assigns dedicated space. Exhibit B (Property Diagram) provides a visual boundary reference. Section 14 (Quiet Enjoyment) addresses proximity to primary residence. Section 1 (Premises) explicitly defines what is and is not included in the ADU rental. |
| 5 | All required NH landlord disclosures present | Section 12 collects all disclosures: (A) landlord identity and contact, (B) lead paint with addendum reference, (C) security deposit bank information, (D) utility responsibility, (E) radon (flagged as [VERIFY]). Addendum A is the standalone lead paint disclosure document. |

---

## 7. Integration Points

- **Task 2 (Rental Market Analysis)**: The Monthly Rent amount in Section 3(A) and the utility cost estimate in Section 5(C) should be informed by the rental market analysis once completed. The producer should leave these as blanks.
- **Task 3 (Listing Copy)**: The lease terms summary (term length, pet policy, parking, utilities included) should be reflected in listing copy once the landlord selects final options.
- **Task 4 (Compliance Checklist)**: The compliance checklist may identify additional local registrations or permits (fire inspection, certificate of occupancy) that should be obtained before lease execution. The lease does not need to reference these, but they are preconditions to legally renting the unit.
- **Task 5 (Expense Tracker)**: The rent amount and utility cost assumptions from this lease feed into the expense tracking model.

---

## 8. Open Items

| # | Item | Type | Notes |
|---|------|------|-------|
| 1 | Pet deposit legality under NH RSA 540-A | [VERIFY] | Confirm whether NH aggregates all deposits under the one-month cap. If so, a separate pet deposit is not permissible. Consult a NH-licensed attorney. |
| 2 | Double damages for late deposit return | [VERIFY] | Confirm whether current NH RSA 540-A imposes double damages for failure to return deposit within 30 days. |
| 3 | Radon disclosure requirement | [VERIFY] | Confirm whether Concord has any local radon disclosure requirement for rental properties beyond the state recommendation. |
| 4 | Exhibit B — Property Diagram | Execution-time | Must be prepared before lease signing. Not a blueprint gap — this is a physical diagram that requires on-site measurement. |
| 5 | Rent amount | Execution-time | Dependent on Task 2 (Rental Market Analysis). |

All open items are either [VERIFY] legal questions requiring attorney consultation or execution-time fill-ins. No blueprint-level gaps remain.

---

## 9. Producer Handoff

- **Producer**: document-writer
- **Output format**: Markdown
- **Output file**: `deliverables/01_lease_agreement.md`
- **Instructions to producer**:
  1. Assemble the lease agreement as a single markdown document in the order specified in Section 5 above.
  2. Preserve all clause numbering and lettering exactly as written.
  3. Preserve all blank fill-in fields (__________ and [ ] checkboxes) — these are intentional execution-time fields.
  4. Include both Pet Policy options (A and B) with the instruction to landlord to select one and delete the other.
  5. Include Addendum A (Lead Paint Disclosure) as a clearly separated addendum at the end.
  6. Include Exhibit B (Property Diagram) placeholder as the final page.
  7. Do not add legal analysis, commentary, or footnotes. The document is the lease itself.
  8. Do not modify clause language. The specification is 95% final — the producer's role is assembly and formatting, not drafting.
  9. Use standard legal document formatting: section headers in bold, subsections indented, signature lines clearly delineated.
  10. The document title should be: **RESIDENTIAL LEASE AGREEMENT — 24 Meadow St ADU, Concord, NH 03301**

**Content block sequence:**
1. Document Header (parties, effective date)
2. Section 1: Premises
3. Section 2: Term
4. Section 3: Rent
5. Section 4: Security Deposit
6. Section 5: Utilities and Services
7. Section 6: Use and Occupancy
8. Section 7: Pet Policy (both options)
9. Section 8: Maintenance and Repairs
10. Section 9: Landlord Access
11. Section 10: Insurance
12. Section 11: Termination and Move-Out
13. Section 12: Landlord Disclosures
14. Section 13: Eviction and Dispute Resolution
15. Section 14: Quiet Enjoyment
16. Section 15: Shared Property Areas
17. Section 16: Parking
18. Section 17: General Provisions
19. Section 18: Signatures
20. Addendum A: Lead-Based Paint Disclosure
21. Exhibit B: Property Diagram (placeholder)
