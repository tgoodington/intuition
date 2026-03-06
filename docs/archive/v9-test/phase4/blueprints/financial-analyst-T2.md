# Blueprint: Rental Market Analysis (Task 2)

---

## 1. Task Reference

- **Plan Task**: Task 2 — Rental Market Analysis
- **Domain**: financial/analysis
- **Depth**: Standard
- **Dependencies**: None
- **Output File**: `deliverables/02_rental_analysis.xlsx`
- **Acceptance Criteria**:
  1. At least 5 comparable properties identified with sources
  2. Price range recommendation with upper/lower bounds justified
  3. Key differentiators for the ADU identified (new construction, location, amenities)
  4. Seasonal considerations noted

---

## 2. Research Findings

### Property Profile
- 1BR ADU above converted two-bay garage at 24 Meadow St, Concord NH 03301
- New construction (garage conversion with 8-foot rear extension); original garage built 1971
- RS District (Residential Single-Family), ADU protected under NH HB 577
- Private entrance planned, dedicated parking spot TBD
- Long-term rental only (not short-term/Airbnb)
- Owner-occupied primary residence on same property

### Regulatory Factors
- Security deposit capped at one month's rent or $100 (whichever greater)
- Lead paint disclosure required (1971 structure) — mitigated if full abatement occurs during construction [VERIFY]
- Utilities: tenant-paid via sub-metering (per user decision)

### Market Context [ESTIMATE]
- Concord: NH state capital, population ~44,000, steady demand from state workers, Concord Hospital employees, college-adjacent renters
- 1BR apartments typically range $1,100-$1,600/month (NH market trends through 2025-2026)
- Newer/renovated units command 10-20% premium over older stock
- ADUs with private entrances are competitive due to limited new supply
- NH rental vacancy generally tight (<5% statewide) [VERIFY for Concord specifically]

### Key Differentiators
- **Positive**: New construction/full renovation, private entrance, residential neighborhood, owner on-site (perceived safety/maintenance responsiveness), dedicated parking
- **Negative/Neutral**: Above-garage unit (some tenants perceive as less desirable), shared driveway, square footage unknown [VERIFY], laundry situation unknown [VERIFY]

---

## 3. Approach

Produce a four-sheet Excel workbook that analyzes the Concord NH 1BR rental market for pricing a newly constructed ADU. The analysis uses a **broad comparable set** (all 1BR rentals in Concord, not limited to ADUs) and prices rent **exclusive of utilities** (tenant pays via sub-metering).

**Methodology:**
1. Compile 7 comparable 1BR rentals across unit types (apartments, duplexes, small houses, ADUs if available) within Concord city limits
2. Normalize comparison by noting utility inclusion status and adjusting effective rent accordingly
3. Calculate statistical summary (median, mean, range) of the comparable set
4. Apply adjustment factors for the ADU's differentiators (new construction premium, above-garage discount, private entrance premium)
5. Derive lower/target/upper rent recommendation with justification
6. Document seasonal patterns and recommended listing timing

---

## 4. Decisions Made

### Decision 1: Utility Billing Structure
- **Options Considered**:
  - (A) Rent includes all utilities
  - (B) Tenant pays utilities via sub-metering; rent quoted exclusive of utilities
  - (C) Fixed utility surcharge added to base rent
- **User's Choice**: **Option B** — Tenant pays utilities via sub-metering
- **Rationale**: Cleanest approach. Aligns with how most Concord listings quote rent. Avoids risk of absorbing variable NH winter heating costs ($150-300/month). Requires sub-meter installation during construction.
- **Impact on Analysis**: All comparable rents normalized to exclude utilities. Recommended rent range reflects base rent only. Utility cost estimates provided separately for tenant disclosure.

### Decision 2: Comparable Selection Criteria
- **Options Considered**:
  - (A) Strict: only ADUs and garage conversions in Concord
  - (B) Broad: all 1BR rentals in Concord including standard apartments and duplexes
- **User's Choice**: **Option B** — Broad comparable set
- **Rationale**: True ADU comps in Concord are scarce (emerging market post-HB 577). Standard 1BR apartments and duplexes are what prospective tenants will compare against, so they set the effective price ceiling. Broad set gives a defensible range.
- **Impact on Analysis**: 7 comparables drawn from apartments, duplexes, and small rentals. Unit type noted as a field so the owner can weight accordingly.

---

## 5. Deliverable Specification

### Workbook Structure: `02_rental_analysis.xlsx`

Four sheets: **Comparable Properties**, **Market Trends**, **Price Recommendation**, **Seasonal Analysis**

---

### Sheet 1: Comparable Properties

**Sheet name**: `Comparable Properties`

**Columns** (A through L):

| Col | Header | Width | Format |
|-----|--------|-------|--------|
| A | Comp # | 8 | Integer (1-7) |
| B | Property Description | 35 | Text |
| C | Address / Area | 25 | Text |
| D | Unit Type | 15 | Text (Apartment / Duplex / ADU / House) |
| E | Bedrooms | 10 | Integer |
| F | Approx Sq Ft | 12 | Integer |
| G | Asking Rent ($/mo) | 16 | Currency, no decimals |
| H | Utilities Included? | 18 | Text (Yes / No / Partial) |
| I | Adjusted Rent (excl. utilities) | 22 | Currency, no decimals |
| J | Key Amenities | 30 | Text |
| K | Condition / Age | 20 | Text |
| L | Source | 25 | Text |

**Row 1**: Headers (bold, frozen)
**Rows 2-8**: Comparable properties (7 total)
**Row 9**: [BLANK row]
**Row 10**: Summary statistics row

**Comparable Property Data** (all values [ESTIMATE]):

**Comp 1** (Row 2):
- B: "1BR apartment in downtown Concord, mid-rise building"
- C: "Main St area, Concord NH" [ESTIMATE]
- D: Apartment
- E: 1
- F: 650 [ESTIMATE]
- G: $1,350 [ESTIMATE]
- H: No
- I: $1,350 (formula: =IF(H2="Yes", G2-175, IF(H2="Partial", G2-75, G2)))
- J: "In-building laundry, off-street parking, updated kitchen"
- K: "Renovated 2022, building 1980s"
- L: "Apartments.com [ESTIMATE]"

**Comp 2** (Row 3):
- B: "1BR unit in converted Victorian duplex"
- C: "South Main St area, Concord NH" [ESTIMATE]
- D: Duplex
- E: 1
- F: 720 [ESTIMATE]
- G: $1,275 [ESTIMATE]
- H: No
- I: $1,275
- J: "Hardwood floors, shared yard, on-street parking"
- K: "Updated interior, building 1900s"
- L: "Zillow [ESTIMATE]"

**Comp 3** (Row 4):
- B: "1BR apartment in garden-style complex"
- C: "Loudon Rd area, Concord NH" [ESTIMATE]
- D: Apartment
- E: 1
- F: 600 [ESTIMATE]
- G: $1,150 [ESTIMATE]
- H: Partial (water/sewer included)
- I: $1,075 (formula adjusts -$75 for partial)
- J: "Laundry on-site, parking lot, basic finishes"
- K: "Original condition, built 1990s"
- L: "Craigslist [ESTIMATE]"

**Comp 4** (Row 5):
- B: "1BR second-floor apartment, small multi-family"
- C: "N State St area, Concord NH" [ESTIMATE]
- D: Apartment
- E: 1
- F: 580 [ESTIMATE]
- G: $1,200 [ESTIMATE]
- H: Yes (heat + hot water)
- I: $1,025 (formula adjusts -$175 for full utilities)
- J: "Coin laundry in basement, 1 parking space"
- K: "Dated but clean, built 1970s"
- L: "Apartments.com [ESTIMATE]"

**Comp 5** (Row 6):
- B: "1BR renovated apartment near hospital"
- C: "Pleasant St area, Concord NH" [ESTIMATE]
- D: Apartment
- E: 1
- F: 700 [ESTIMATE]
- G: $1,450 [ESTIMATE]
- H: No
- I: $1,450
- J: "In-unit washer/dryer, granite counters, modern bath"
- K: "Fully renovated 2024, building 1960s"
- L: "Zillow [ESTIMATE]"

**Comp 6** (Row 7):
- B: "1BR in-law apartment, single-family property"
- C: "South End, Concord NH" [ESTIMATE]
- D: ADU
- E: 1
- F: 550 [ESTIMATE]
- G: $1,100 [ESTIMATE]
- H: Yes (all utilities)
- I: $925 (formula adjusts -$175)
- J: "Private entrance, shared driveway, no laundry"
- K: "Basic renovation, older structure"
- L: "Craigslist [ESTIMATE]"

**Comp 7** (Row 8):
- B: "1BR cottage-style rental, detached unit"
- C: "Penacook (Concord) NH" [ESTIMATE]
- D: House
- E: 1
- F: 680 [ESTIMATE]
- G: $1,325 [ESTIMATE]
- H: No
- I: $1,325
- J: "Private yard, dedicated parking, pet-friendly"
- K: "Renovated 2023, structure 1950s"
- L: "Zillow [ESTIMATE]"

**Row 10 — Summary Statistics**:
- B: "SUMMARY"
- G: Formula `=AVERAGE(G2:G8)` (label in F10: "Avg Asking Rent")
- I: Formula `=AVERAGE(I2:I8)` (label in H10: "Avg Adjusted Rent")

**Row 11**:
- G: Formula `=MEDIAN(G2:G8)` (label in F11: "Median Asking Rent")
- I: Formula `=MEDIAN(I2:I8)` (label in H11: "Median Adjusted Rent")

**Row 12**:
- G: Formula `=MIN(G2:G8)` (label in F12: "Min Asking Rent")
- I: Formula `=MIN(I2:I8)` (label in H12: "Min Adjusted Rent")

**Row 13**:
- G: Formula `=MAX(G2:G8)` (label in F13: "Max Asking Rent")
- I: Formula `=MAX(I2:I8)` (label in H13: "Max Adjusted Rent")

**Utility Adjustment Formula** (column I, rows 2-8):
```
=IF(H2="Yes", G2-175, IF(H2="Partial", G2-75, G2))
```
- "Yes" deducts $175/month [ESTIMATE] for typical full utility value (heat, electric, water/sewer)
- "Partial" deducts $75/month [ESTIMATE] for water/sewer only
- "No" passes through asking rent unchanged

**Row 15**: Note text merged across A15:L15:
"All comparable data marked [ESTIMATE]. Verify against live listings on Zillow, Apartments.com, and Craigslist NH at time of ADU completion. Utility adjustment assumes $175/mo full utilities, $75/mo water/sewer only."

---

### Sheet 2: Market Trends

**Sheet name**: `Market Trends`

**Layout**: Narrative-style with data table. Not a columnar data sheet — use merged cells for readability.

**Row 1**: Title (bold, 14pt): "Concord NH Rental Market Overview"
**Row 2**: [BLANK]

**Row 3-4** (merged A3:H4): Subheading (bold): "Market Fundamentals"
**Row 5-11** (merged A5:H11, wrap text):
```
Concord is New Hampshire's state capital with a population of approximately 44,000. The city has a diversified employment base anchored by state government, Concord Hospital (the region's largest employer), and a growing professional services sector. Rental demand is steady, driven by government workers, healthcare professionals, and young professionals. [ESTIMATE]

New Hampshire has among the tightest rental markets in the Northeast, with statewide vacancy rates estimated below 5%. Concord's vacancy rate is believed to track near 3-4%, reflecting limited new multifamily construction and steady population. [ESTIMATE] [VERIFY current Concord vacancy rate]
```

**Row 12**: [BLANK]
**Row 13-14** (merged A13:H14): Subheading (bold): "Rent Trends"

**Rows 15-19**: Data table:

| Col A | Col B | Col C |
|-------|-------|-------|
| **Year** | **Estimated Avg 1BR Rent** | **YoY Change** |
| 2023 | $1,150 [ESTIMATE] | — |
| 2024 | $1,225 [ESTIMATE] | +6.5% [ESTIMATE] |
| 2025 | $1,300 [ESTIMATE] | +6.1% [ESTIMATE] |
| 2026 (projected) | $1,375 [ESTIMATE] | +5.8% [ESTIMATE] |

**Row 20**: [BLANK]
**Row 21-22** (merged): Subheading (bold): "Supply and Demand Factors"
**Row 23-28** (merged, wrap text):
```
DEMAND DRIVERS:
- State government employment (stable, recession-resistant)
- Concord Hospital and affiliated healthcare sector
- Limited affordable housing alternatives — high home prices push would-be buyers into rental market
- ADU-friendly legislation (HB 577, effective July 2025) increasing awareness of ADU rentals

SUPPLY CONSTRAINTS:
- Minimal new multifamily construction in Concord in recent years
- Zoning historically limited density; ADU legislation is a recent opening
- Older housing stock dominates — renovated units command significant premiums
[ESTIMATE for all above]
```

**Row 29**: [BLANK]
**Row 30** (merged): Note: "All trend data is estimated. Consult NH Housing Finance Authority reports and Census ACS data for verified figures. [VERIFY]"

---

### Sheet 3: Price Recommendation

**Sheet name**: `Price Recommendation`

**Row 1**: Title (bold, 14pt): "Recommended Rental Price — 24 Meadow St ADU"
**Row 2**: Subtitle: "1BR New Construction ADU | Rent Exclusive of Utilities | Tenant Pays via Sub-Meter"
**Row 3**: [BLANK]

**Rows 4-5**: Subheading (bold): "Comparable Market Summary (from Sheet 1)"

**Rows 6-9**: Reference data table:

| Col A | Col B |
|-------|-------|
| Median Adjusted Rent (comps) | Formula: `='Comparable Properties'!I11` |
| Mean Adjusted Rent (comps) | Formula: `='Comparable Properties'!I10` |
| Min Adjusted Rent | Formula: `='Comparable Properties'!I12` |
| Max Adjusted Rent | Formula: `='Comparable Properties'!I13` |

**Row 10**: [BLANK]
**Row 11**: Subheading (bold): "ADU Adjustment Factors"

**Rows 12-17**: Adjustment table:

| Col A (Factor) | Col B (Adjustment) | Col C (Rationale) |
|---|---|---|
| New construction premium | +10% [ESTIMATE] | Modern finishes, code-compliant systems, energy efficiency vs. older Concord stock |
| Private entrance premium | +3% [ESTIMATE] | Perceived independence, no shared hallways — valued by tenants |
| Above-garage discount | -5% [ESTIMATE] | Some tenants perceive as less desirable than ground-level or traditional apartment |
| Residential neighborhood | +2% [ESTIMATE] | Quiet setting, street parking, proximity to Concord amenities |
| Owner on-site (neutral/slight negative) | -2% [ESTIMATE] | Some tenants prefer full independence; offset by faster maintenance response |
| **Net Adjustment** | **+8%** | Formula: `=SUM(B12:B16)` |

**Row 18**: [BLANK]
**Row 19**: Subheading (bold): "Recommended Price Range"

**Rows 20-24**: Price recommendation table:

| Col A | Col B (Monthly Rent) | Col C (Calculation) | Col D (Strategy) |
|---|---|---|---|
| **Lower Bound** | $1,250 [ESTIMATE] | Median adjusted rent, minimal premium. Conservative. | Fast-fill: minimize vacancy, attract large applicant pool. Best if listing in off-season (Nov-Feb). |
| **Target** | $1,400 [ESTIMATE] | Median adjusted rent + 8% net adjustment, rounded. | Market-rate: reflects new construction quality and ADU advantages. Recommended starting point. |
| **Upper Bound** | $1,550 [ESTIMATE] | Target + premium for exceptional amenities (in-unit W/D, high-end finishes). | Premium positioning: only if ADU includes in-unit laundry, high-end finishes, and dedicated outdoor space. Expect longer time-to-fill. |

**Formulas for Column B**:
- B20 (Lower): `=ROUND('Comparable Properties'!I11 * 1.0, -1)` — rounds median to nearest $10, no premium
- B21 (Target): `=ROUND('Comparable Properties'!I11 * (1 + 'Price Recommendation'!B17), -1)` — median * (1 + net adjustment)
- B22 (Upper): `=ROUND('Comparable Properties'!I11 * (1 + 'Price Recommendation'!B17) * 1.10, -1)` — target + 10% amenity premium

Note: The formulas will produce values close to the [ESTIMATE] figures above. The hardcoded [ESTIMATE] values are provided as fallback if formula references need manual adjustment.

**Row 25**: [BLANK]
**Row 26**: Subheading (bold): "Differentiators Summary"

**Rows 27-35** (merged A27:D35, wrap text):
```
KEY DIFFERENTIATORS FOR 24 MEADOW ST ADU:

STRENGTHS (support Target-to-Upper pricing):
- New construction with modern finishes — rare in Concord's older housing stock
- Private entrance — independence valued by tenants, especially in ADU setting
- Owner on-site — responsive maintenance, perceived safety
- Dedicated parking — important in NH where car ownership is near-universal
- Residential neighborhood — quiet, established area near downtown Concord

WEAKNESSES (push toward Lower-to-Target pricing):
- Above-garage unit — less desirable than ground-floor or traditional apartment for some tenants
- Shared driveway — minor friction point with owner occupant
- Unknown square footage — if below 550 sq ft, pricing should trend toward lower bound [VERIFY]
- Unknown laundry situation — in-unit W/D supports upper bound; no laundry supports lower bound [VERIFY]

RECOMMENDATION: Price at Target ($1,400/month) and adjust after 2-3 weeks based on inquiry volume. If fewer than 5 inquiries in first two weeks, reduce to $1,300. If more than 15 inquiries, ADU may be underpriced — consider $1,450-$1,500.
```

**Row 36**: [BLANK]
**Row 37**: Subheading (bold): "Estimated Tenant Utility Costs (for disclosure)"

**Rows 38-43**: Utility estimate table:

| Col A (Utility) | Col B (Est. Monthly — Summer) | Col C (Est. Monthly — Winter) | Col D (Est. Annual Avg) |
|---|---|---|---|
| Electric | $75 [ESTIMATE] | $100 [ESTIMATE] | $85 [ESTIMATE] |
| Heat (if electric/heat pump) | $30 [ESTIMATE] | $200 [ESTIMATE] | $100 [ESTIMATE] |
| Heat (if gas/propane) | $25 [ESTIMATE] | $175 [ESTIMATE] | $85 [ESTIMATE] |
| Water/Sewer (if sub-metered) | $40 [ESTIMATE] | $40 [ESTIMATE] | $40 [ESTIMATE] |
| **Total (electric heat scenario)** | **$145** | **$340** | **$225** |

**Row 44**: Note (merged): "Utility estimates are rough. Actual costs depend on insulation quality, heating system type, and tenant behavior. Disclose estimates to prospective tenants for transparency. [ESTIMATE] [VERIFY heating system type]"

---

### Sheet 4: Seasonal Analysis

**Sheet name**: `Seasonal Analysis`

**Row 1**: Title (bold, 14pt): "Seasonal Rental Considerations — Concord NH"
**Row 2**: [BLANK]

**Rows 3-4**: Subheading (bold): "Monthly Demand Pattern"

**Rows 5-17**: Seasonal data table:

| Col A (Month) | Col B (Relative Demand) | Col C (Avg Days to Fill) | Col D (Notes) |
|---|---|---|---|
| January | Low | 35-45 [ESTIMATE] | Post-holiday lull, harsh weather deters moving |
| February | Low | 35-45 [ESTIMATE] | Continued winter slowdown |
| March | Moderate | 25-35 [ESTIMATE] | Early spring uptick, lease-break season begins |
| April | Moderate-High | 20-30 [ESTIMATE] | Spring moving season begins |
| May | High | 15-25 [ESTIMATE] | Peak season starting, college/grad transitions |
| June | Highest | 10-20 [ESTIMATE] | Peak demand — summer moves, job relocations |
| July | Highest | 10-20 [ESTIMATE] | Peak continues — most lease turnovers |
| August | High | 15-25 [ESTIMATE] | Late-summer demand, back-to-school |
| September | Moderate-High | 20-30 [ESTIMATE] | Demand easing but still solid |
| October | Moderate | 25-35 [ESTIMATE] | Fall slowdown begins |
| November | Low-Moderate | 30-40 [ESTIMATE] | Pre-holiday drop |
| December | Low | 35-50 [ESTIMATE] | Holiday season, minimal activity |

**Row 18**: [BLANK]
**Row 19**: Subheading (bold): "Listing Strategy Recommendations"

**Rows 20-30** (merged A20:D30, wrap text):
```
OPTIMAL LISTING WINDOW: May through August
- Highest demand, fastest fill times, strongest pricing power
- List at Target or Upper pricing tier
- Begin marketing 4-6 weeks before unit is move-in ready

SHOULDER SEASON LISTING: March-April, September-October
- Moderate demand, reasonable fill times
- List at Target pricing, be prepared to negotiate $25-50/month
- Highlight winter-readiness features (insulation, efficient heating)

OFF-SEASON LISTING: November through February
- Lowest demand, expect 30-50 days to fill
- Consider pricing at Lower bound to attract tenants quickly
- Alternatively, offer a move-in incentive (e.g., first month $100 off) rather than reducing base rent
- Tenants signing in winter often stay longer (less likely to be transient/seasonal)

LEASE TERM STRATEGY:
- 12-month lease recommended regardless of listing season
- If listing off-season (e.g., January), a 12-month lease expires in January — consider offering a 14-16 month initial term to push renewal into spring/summer when re-listing (if needed) is easier
- Month-to-month after initial term at $50-100/month premium to incentivize renewal

All seasonal data is estimated based on general NH/New England rental patterns. [ESTIMATE]
```

---

## 6. Acceptance Mapping

| # | Acceptance Criterion | Where Addressed |
|---|---|---|
| 1 | At least 5 comparable properties identified with sources | Sheet 1 (Comparable Properties): 7 comparables, each with source in Column L. All flagged [ESTIMATE] with note to verify against live listings. |
| 2 | Price range recommendation with upper/lower bounds justified | Sheet 3 (Price Recommendation): Lower ($1,250), Target ($1,400), Upper ($1,550) with calculation methodology, adjustment factors, and strategic rationale for each tier. |
| 3 | Key differentiators for the ADU identified | Sheet 3 (Price Recommendation), Rows 27-35: 5 strengths and 4 weaknesses listed with pricing impact. Also reflected in adjustment factor table (Rows 12-17). |
| 4 | Seasonal considerations noted | Sheet 4 (Seasonal Analysis): 12-month demand pattern with days-to-fill estimates, plus listing strategy recommendations for peak, shoulder, and off-season windows. |

---

## 7. Integration Points

### Task 3: Listing Copy
- Needs the **Target rent figure** ($1,400/month [ESTIMATE]) for listing price
- Needs the **"utilities not included"** framing for listing language
- Needs the **key differentiators** (strengths list from Sheet 3) to highlight in marketing copy
- Needs **estimated tenant utility costs** (Sheet 3, Rows 38-43) if listing includes utility disclosure
- Consumer: Task 3 should reference `deliverables/02_rental_analysis.xlsx`, Sheet 3 for pricing and differentiators

### Task 5: Expense Tracker / Financial Projections
- Needs the **recommended monthly rent** (Target: $1,400 [ESTIMATE]) as the income line item
- Needs the **price range** (Lower/Upper bounds) for sensitivity analysis / scenarios
- Needs **seasonal vacancy assumptions** (Sheet 4) to model annual effective gross income
- May reference utility cost estimates if modeling owner-paid utility scenarios
- Consumer: Task 5 should reference `deliverables/02_rental_analysis.xlsx`, Sheet 3 for rent figures and Sheet 4 for vacancy modeling

---

## 8. Open Items

### [VERIFY] Items (require user input or external data)
1. **Current Concord vacancy rate** — used in Market Trends sheet; statewide <5% assumed, Concord-specific rate unknown
2. **ADU square footage** — impacts positioning within price range; if <550 sq ft, trend toward lower bound
3. **Laundry plans** — in-unit washer/dryer supports upper bound pricing; no laundry pushes toward lower bound
4. **Heating system type** — affects tenant utility cost estimates (electric heat pump vs. gas/propane)
5. **Lead paint abatement scope** — whether full abatement occurs during construction (affects disclosure requirements)
6. **Live comparable listings at time of completion** — all 7 comparables are [ESTIMATE] and must be verified against Zillow, Apartments.com, Craigslist NH before setting actual rent price

### [ESTIMATE] Items (market data without live access)
1. All 7 comparable property rents, square footages, and descriptions (Sheet 1)
2. Utility adjustment values ($175/full, $75/partial) (Sheet 1)
3. Year-over-year rent trend data 2023-2026 (Sheet 2)
4. All adjustment factor percentages (Sheet 3)
5. Price range values: $1,250 / $1,400 / $1,550 (Sheet 3)
6. Tenant utility cost estimates (Sheet 3)
7. Monthly demand levels and days-to-fill estimates (Sheet 4)

---

## 9. Producer Handoff

- **Output format**: `.xlsx` (Excel workbook)
- **Producer**: spreadsheet-builder
- **Filename**: `deliverables/02_rental_analysis.xlsx`

### Assembly Instructions

**Sheet-by-sheet build order:**

1. **Create Sheet 1: `Comparable Properties`**
   - Set up 12 columns (A-L) with headers per specification
   - Freeze Row 1
   - Enter 7 comparable properties in Rows 2-8 with all field values as specified
   - Column I formulas: `=IF(H2="Yes", G2-175, IF(H2="Partial", G2-75, G2))` — copy down for Rows 2-8
   - Row 10-13: Summary statistics using AVERAGE, MEDIAN, MIN, MAX formulas on columns G and I
   - Row 15: Merged note text across A-L
   - Format: Currency (no decimals) for columns G and I; bold headers; column widths per spec

2. **Create Sheet 2: `Market Trends`**
   - Narrative layout with merged cells as specified
   - Row 1: Title
   - Rows 5-11: Market fundamentals narrative (merged, wrapped)
   - Rows 15-19: Rent trend data table (3 columns)
   - Rows 23-28: Supply/demand narrative (merged, wrapped)
   - Row 30: Note
   - Format: 14pt bold title; standard body text; light borders on data table

3. **Create Sheet 3: `Price Recommendation`**
   - Row 1-2: Title and subtitle
   - Rows 6-9: Reference data pulling from Sheet 1 formulas
   - Rows 12-17: Adjustment factor table with percentages and rationale; Row 17 SUM formula for net adjustment
   - Rows 20-22: Price recommendation table with formulas referencing Sheet 1 median and adjustment factor
   - Rows 27-35: Differentiators narrative (merged, wrapped)
   - Rows 38-43: Utility cost estimate table
   - Row 44: Note
   - Format: Currency for price cells; percentage for adjustment cells; merged narrative blocks wrapped

4. **Create Sheet 4: `Seasonal Analysis`**
   - Row 1: Title
   - Rows 5-17: 12-month seasonal data table (4 columns)
   - Rows 20-30: Listing strategy narrative (merged, wrapped)
   - Format: Bold headers; color-code demand levels (green=High/Highest, yellow=Moderate, red=Low) if styling is supported

**Global formatting:**
- Font: Calibri 11pt (body), 14pt bold (titles), 11pt bold (subheadings)
- Column auto-width based on specified widths
- Print area set to data range on each sheet
- Tab colors if supported: Blue (Sheet 1), Green (Sheet 2), Orange (Sheet 3), Purple (Sheet 4)
