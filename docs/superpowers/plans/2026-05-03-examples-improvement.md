# Examples Library Improvement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Comprehensively improve the examples library — polish all 47 existing examples for consistency, add 14 new high-quality examples, introduce an "XSLT 3.0 Advanced" category, and update tests.

**Architecture:** Single-file enhancement to `js/examples-data.js`. No structural changes to load order or module system. Tests extended via the existing parametrized approach in `examples-comprehensive.spec.js`.

**Tech Stack:** Vanilla JS (examples-data.js), Playwright (E2E tests), XSLT 3.0 / XPath 3.1 / Saxon-JS 2

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `js/examples-data.js` | Modify | All examples + categories |
| `tests/e2e/workflows/examples-comprehensive.spec.js` | Modify | Parametrized example tests |
| `.github/docs/reference/examples-data.md` | Modify | Reference documentation |

---

## Task 1: Polish Existing Examples — Data Transformation Category (8 examples)

**Files:**
- Modify: `js/examples-data.js:19-278` (identityTransform, renameElements, filterNodes, namespaceHandling, unwrapRewrap, sortRecords, fieldInjection, emptyElementCleanup)

Apply these fixes to each example in the Data Transformation category:

**Standards checklist:**
- Comment block: 3-5 lines (what, when to use, CPI relevance)
- `desc` field: ≤60 chars, action-oriented
- `exclude-result-prefixes` present when `xs` is declared
- XML declaration present on all `xml` fields
- No duplicate icons within category
- Numeric casts use `xs:decimal()` consistently

- [ ] **Step 1: Audit and fix `identityTransform`**

Current state is good. No changes needed — it already has a clean 3-line comment, proper desc (51 chars), and correct structure. Leave as-is.

- [ ] **Step 2: Audit and fix `renameElements`**

Current state is good. Comment is clear, desc is 51 chars, `exclude-result-prefixes="xs"` present. Leave as-is.

- [ ] **Step 3: Audit and fix `filterNodes`**

Current state is good. Comment is clear (3 lines), desc is 48 chars, `exclude-result-prefixes="xs"` present. Leave as-is.

- [ ] **Step 4: Audit and fix `namespaceHandling`**

Verify desc ≤60 chars: "Strip ns prefixes, remap namespaces, enrich inline" = 52 chars. Good. Verify comment block present. Leave as-is if compliant.

- [ ] **Step 5: Audit and fix `unwrapRewrap`**

Check that `exclude-result-prefixes` is present, desc ≤60 chars. Fix if needed.

- [ ] **Step 6: Audit and fix `sortRecords`**

Check desc length and comment block. Fix if needed.

- [ ] **Step 7: Audit and fix `fieldInjection`**

Check desc length and comment block. Fix if needed.

- [ ] **Step 8: Audit and fix `emptyElementCleanup`**

Check desc length and comment block. Fix if needed.

- [ ] **Step 9: Commit**

```bash
git add js/examples-data.js
git commit -m "polish: audit Data Transformation examples for consistency"
```

---

## Task 2: Polish Existing Examples — Aggregation & Splitting (3 examples)

**Files:**
- Modify: `js/examples-data.js:280-470` (groupBy, splitMessage, mergeMessages)

- [ ] **Step 1: Audit `groupBy`**

Desc is "Nested grouping with subtotals — xsl:for-each-group" = 52 chars. Comment is 3 lines. `exclude-result-prefixes="xs"` present. Good.

- [ ] **Step 2: Audit `splitMessage`**

Desc is "Wrap each record as standalone message with index" = 50 chars. Good. Comment is 4 lines. Good.

- [ ] **Step 3: Audit `mergeMessages`**

Check desc, comment, `exclude-result-prefixes`. Fix if needed.

- [ ] **Step 4: Commit**

```bash
git add js/examples-data.js
git commit -m "polish: audit Aggregation & Splitting examples for consistency"
```

---

## Task 3: Polish Existing Examples — Format Conversion (6 examples)

**Files:**
- Modify: `js/examples-data.js:470-680` (dateFormatting, currencyAmount, multiCurrencyReport) and `:3390-3675` (xmlToJson, xmlToCsv, xmlToFixedLength)

- [ ] **Step 1: Audit `dateFormatting`**

Check desc ≤60 chars, comment block, `exclude-result-prefixes`.

- [ ] **Step 2: Audit `currencyAmount`**

Check desc ≤60 chars, comment block, numeric casts use `xs:decimal()`.

- [ ] **Step 3: Audit `multiCurrencyReport`**

Check desc ≤60 chars, comment block, `exclude-result-prefixes`.

- [ ] **Step 4: Audit `xmlToJson`**

Desc is "Convert SAP sales order XML to JSON using XSLT 3.0 maps and arrays — method=\"json\"" = 83 chars. **FIX:** Shorten to ≤60 chars:
```javascript
desc: 'XML to JSON via XSLT 3.0 maps and arrays — method="json"',
```
That's 59 chars.

- [ ] **Step 5: Audit `xmlToCsv`**

Check desc ≤60 chars, comment block.

- [ ] **Step 6: Audit `xmlToFixedLength`**

Desc is "Produce fixed-width flat file for legacy mainframe/EDI systems — padded and truncated fields at exact column positions" = 119 chars. **FIX:** Shorten:
```javascript
desc: 'Fixed-width flat file with padded/truncated fields',
```
That's 52 chars.

- [ ] **Step 7: Commit**

```bash
git add js/examples-data.js
git commit -m "polish: audit Format Conversion examples — fix long descriptions"
```

---

## Task 4: Polish Existing Examples — SAP CPI Patterns (16 examples)

**Files:**
- Modify: `js/examples-data.js` — all CPI examples

The main fix here is the `cpiGetSet` example which has a 35+ line ASCII-art comment block. Trim to 3-5 lines.

- [ ] **Step 1: Trim `cpiGetSet` comment block**

Replace the massive ASCII-art comment (lines ~883-918) with:
```xslt
  <!--
    CPI Headers & Properties: get/set headers and exchange properties.
    Demonstrates routing logic based on customer tier and source channel.
    Uses xsl:message for console debugging of intermediate values.
  -->
```

- [ ] **Step 2: Audit all CPI examples for desc length**

Check each of the 16 CPI examples. Fix any desc >60 chars. Known candidates:
- `cpiGetSet`: "Set + Get headers/properties with console debugging" = 51 chars. OK.
- `sfEmployeeMapping`: Check length, fix if over 60.
- `xmlToText` (if CPI): Check length.

- [ ] **Step 3: Audit `exclude-result-prefixes` on all CPI examples**

Every CPI example should have `exclude-result-prefixes="xs cpi"` (or just `"cpi"` if `xs` is not used). Check each and fix.

- [ ] **Step 4: Verify icon uniqueness within CPI category**

List all icons used in CPI examples. Fix any duplicates by choosing a more descriptive emoji.

- [ ] **Step 5: Commit**

```bash
git add js/examples-data.js
git commit -m "polish: audit CPI examples — trim verbose comments, fix descriptions"
```

---

## Task 5: Polish Existing Examples — XPath Explorer (16 examples)

**Files:**
- Modify: `js/examples-data.js` — all xpath examples

- [ ] **Step 1: Audit all XPath example `desc` lengths**

Check each of the 16 XPath examples for desc ≤60 chars. Fix any that overflow.

- [ ] **Step 2: Verify all XPath examples have `xslt: ''`**

XPath examples must have empty xslt field and a populated `xpathExpr` and `xpathHints` array.

- [ ] **Step 3: Verify icon uniqueness within XPath category**

Fix any duplicate icons.

- [ ] **Step 4: Commit**

```bash
git add js/examples-data.js
git commit -m "polish: audit XPath Explorer examples for consistency"
```

---

## Task 6: Add New Category — XSLT 3.0 Advanced

**Files:**
- Modify: `js/examples-data.js:4-10` (CATEGORIES object)

- [ ] **Step 1: Add `advanced` category**

Insert after the `format` entry in `CATEGORIES`:

```javascript
const CATEGORIES = {
  transform:   { label: 'Data Transformation',    accent: '#3fb950' },
  aggregation: { label: 'Aggregation & Splitting', accent: '#f5a524' },
  format:      { label: 'Format Conversion',       accent: '#c084fc' },
  advanced:    { label: 'XSLT 3.0 Advanced',      accent: '#e06c75' },
  cpi:         { label: 'SAP CPI Patterns',        accent: '#0070f2' },
  xpath:       { label: 'XPath Explorer',          accent: '#f5a524' },
};
```

- [ ] **Step 2: Commit**

```bash
git add js/examples-data.js
git commit -m "feat: add 'XSLT 3.0 Advanced' category to examples library"
```

---

## Task 7: Add New Examples — XSLT 3.0 Advanced (6 examples)

**Files:**
- Modify: `js/examples-data.js` — insert after the last `format` example and before CPI section

- [ ] **Step 1: Add `mapsAndArrays` example**

Insert after the Format Conversion section divider area (before CPI section):

```javascript
  // ── XSLT 3.0 ADVANCED ──────────────────────────────────────────

  mapsAndArrays: {
    label: 'Maps & Arrays',
    icon: '🗺️',
    desc: 'XPath 3.1 maps and arrays for structured data routing',
    cat:  'advanced',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Products>
  <Product id="P-001" category="electronics">
    <Name>Industrial Sensor XR20</Name>
    <Price currency="EUR">125.00</Price>
    <Stock warehouse="WH-01">42</Stock>
    <Stock warehouse="WH-02">18</Stock>
  </Product>
  <Product id="P-002" category="mechanical">
    <Name>Hydraulic Pump 50bar</Name>
    <Price currency="USD">890.00</Price>
    <Stock warehouse="WH-01">7</Stock>
    <Stock warehouse="WH-03">23</Stock>
  </Product>
  <Product id="P-003" category="electronics">
    <Name>Control Module CM50</Name>
    <Price currency="EUR">450.00</Price>
    <Stock warehouse="WH-02">31</Stock>
  </Product>
</Products>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:map="http://www.w3.org/2005/xpath-functions/map"
  xmlns:array="http://www.w3.org/2005/xpath-functions/array"
  exclude-result-prefixes="xs map array">
  <xsl:output method="xml" indent="yes"/>

  <!--
    XPath 3.1 maps and arrays: build a lookup map from product data,
    then use it to route products by category to different targets.
    Demonstrates map{}, array{}, map:keys(), map:get().
  -->

  <xsl:template match="/">
    <xsl:variable name="priceMap" select="
      map:merge(
        for $p in /Products/Product
        return map{ string($p/@id): xs:decimal($p/Price) }
      )
    "/>

    <xsl:variable name="categories" select="
      array{ distinct-values(/Products/Product/@category) }
    "/>

    <RoutingPlan>
      <PriceIndex>
        <xsl:for-each select="map:keys($priceMap)">
          <Entry id="{.}" price="{map:get($priceMap, .)}"/>
        </xsl:for-each>
      </PriceIndex>
      <Categories count="{array:size($categories)}">
        <xsl:for-each select="1 to array:size($categories)">
          <xsl:variable name="cat" select="array:get($categories, .)"/>
          <Category name="{$cat}"
                    products="{count(/Products/Product[@category = $cat])}"/>
        </xsl:for-each>
      </Categories>
    </RoutingPlan>
  </xsl:template>

</xsl:stylesheet>`
  },
```

- [ ] **Step 2: Add `higherOrderFilter` example**

```javascript
  higherOrderFilter: {
    label: 'Higher-Order: filter() & sort()',
    icon: '⚡',
    desc: 'Functional filter() and sort() with custom comparator',
    cat:  'advanced',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Shipments>
  <Shipment id="SH-001">
    <Origin>Frankfurt</Origin>
    <Destination>Singapore</Destination>
    <Weight unit="kg">1250</Weight>
    <Priority>HIGH</Priority>
    <DueDate>2024-04-01</DueDate>
  </Shipment>
  <Shipment id="SH-002">
    <Origin>Mumbai</Origin>
    <Destination>London</Destination>
    <Weight unit="kg">340</Weight>
    <Priority>LOW</Priority>
    <DueDate>2024-04-15</DueDate>
  </Shipment>
  <Shipment id="SH-003">
    <Origin>Shanghai</Origin>
    <Destination>New York</Destination>
    <Weight unit="kg">2100</Weight>
    <Priority>HIGH</Priority>
    <DueDate>2024-03-28</DueDate>
  </Shipment>
  <Shipment id="SH-004">
    <Origin>Berlin</Origin>
    <Destination>Tokyo</Destination>
    <Weight unit="kg">890</Weight>
    <Priority>MEDIUM</Priority>
    <DueDate>2024-04-05</DueDate>
  </Shipment>
</Shipments>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs">
  <xsl:output method="xml" indent="yes"/>

  <!--
    Higher-order functions: filter() selects elements by predicate,
    sort() orders with a custom key function. Avoids verbose
    xsl:for-each with nested xsl:sort for simple cases.
  -->

  <xsl:template match="/">
    <xsl:variable name="shipments" select="/Shipments/Shipment"/>

    <!-- filter(): keep only heavy shipments (>500kg) -->
    <xsl:variable name="heavy" select="
      filter($shipments, function($s) { xs:decimal($s/Weight) gt 500 })
    "/>

    <!-- sort(): order by DueDate ascending -->
    <xsl:variable name="sorted" select="
      sort($heavy, (), function($s) { xs:date($s/DueDate) })
    "/>

    <HeavyShipments count="{count($sorted)}">
      <xsl:for-each select="$sorted">
        <Shipment id="{@id}" priority="{Priority}">
          <Route><xsl:value-of select="concat(Origin, ' → ', Destination)"/></Route>
          <Weight><xsl:value-of select="Weight"/> kg</Weight>
          <DueDate><xsl:value-of select="DueDate"/></DueDate>
        </Shipment>
      </xsl:for-each>
    </HeavyShipments>
  </xsl:template>

</xsl:stylesheet>`
  },
```

- [ ] **Step 3: Add `higherOrderFold` example**

```javascript
  higherOrderFold: {
    label: 'Higher-Order: fold-left()',
    icon: '🔄',
    desc: 'Running totals via fold-left() — no recursion needed',
    cat:  'advanced',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Transactions>
  <Transaction>
    <Date>2024-03-01</Date>
    <Type>CREDIT</Type>
    <Amount>5000.00</Amount>
    <Description>Opening balance</Description>
  </Transaction>
  <Transaction>
    <Date>2024-03-05</Date>
    <Type>DEBIT</Type>
    <Amount>1200.00</Amount>
    <Description>Supplier payment</Description>
  </Transaction>
  <Transaction>
    <Date>2024-03-12</Date>
    <Type>CREDIT</Type>
    <Amount>3400.00</Amount>
    <Description>Customer receipt</Description>
  </Transaction>
  <Transaction>
    <Date>2024-03-18</Date>
    <Type>DEBIT</Type>
    <Amount>800.00</Amount>
    <Description>Office supplies</Description>
  </Transaction>
  <Transaction>
    <Date>2024-03-25</Date>
    <Type>DEBIT</Type>
    <Amount>2500.00</Amount>
    <Description>Equipment lease</Description>
  </Transaction>
</Transactions>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:map="http://www.w3.org/2005/xpath-functions/map"
  exclude-result-prefixes="xs map">
  <xsl:output method="xml" indent="yes"/>

  <!--
    fold-left(): compute running balance without recursion.
    Each transaction adds or subtracts from an accumulator.
    Replaces complex recursive templates in XSLT 1.0/2.0.
  -->

  <xsl:template match="/">
    <xsl:variable name="txns" select="/Transactions/Transaction"/>

    <xsl:variable name="withBalance" select="
      fold-left($txns, map{ 'balance': 0, 'rows': () },
        function($acc, $txn) {
          let $amt := xs:decimal($txn/Amount),
              $delta := if ($txn/Type = 'CREDIT') then $amt else -$amt,
              $newBal := map:get($acc, 'balance') + $delta
          return map{
            'balance': $newBal,
            'rows': (map:get($acc, 'rows'), map{ 'txn': $txn, 'bal': $newBal })
          }
        }
      )
    "/>

    <Ledger finalBalance="{map:get($withBalance, 'balance')}">
      <xsl:for-each select="map:get($withBalance, 'rows')">
        <Entry date="{map:get(., 'txn')/Date}"
               type="{map:get(., 'txn')/Type}"
               amount="{map:get(., 'txn')/Amount}"
               balance="{map:get(., 'bal')}">
          <xsl:value-of select="map:get(., 'txn')/Description"/>
        </Entry>
      </xsl:for-each>
    </Ledger>
  </xsl:template>

</xsl:stylesheet>`
  },
```

- [ ] **Step 4: Add `groupByAdjacent` example**

```javascript
  groupByAdjacent: {
    label: 'Group-by Adjacent',
    icon: '📊',
    desc: 'Detect consecutive runs with group-adjacent',
    cat:  'advanced',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<SensorReadings device="TEMP-01">
  <Reading time="08:00" value="22.1" status="NORMAL"/>
  <Reading time="08:15" value="22.3" status="NORMAL"/>
  <Reading time="08:30" value="28.7" status="WARNING"/>
  <Reading time="08:45" value="31.2" status="WARNING"/>
  <Reading time="09:00" value="35.8" status="WARNING"/>
  <Reading time="09:15" value="24.1" status="NORMAL"/>
  <Reading time="09:30" value="23.9" status="NORMAL"/>
  <Reading time="09:45" value="29.5" status="WARNING"/>
  <Reading time="10:00" value="22.0" status="NORMAL"/>
</SensorReadings>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs">
  <xsl:output method="xml" indent="yes"/>

  <!--
    group-adjacent: detect consecutive runs of the same status.
    Groups readings into "episodes" where each episode is an
    unbroken sequence of the same status value. Essential for
    alerting, time-series analysis, and CPI batch error detection.
  -->

  <xsl:template match="SensorReadings">
    <AlertReport device="{@device}">
      <xsl:for-each-group select="Reading" group-adjacent="@status">
        <Episode status="{current-grouping-key()}"
                 readings="{count(current-group())}"
                 from="{current-group()[1]/@time}"
                 to="{current-group()[last()]/@time}">
          <xsl:if test="current-grouping-key() = 'WARNING'">
            <MaxValue><xsl:value-of select="max(current-group()/xs:decimal(@value))"/></MaxValue>
          </xsl:if>
        </Episode>
      </xsl:for-each-group>
    </AlertReport>
  </xsl:template>

</xsl:stylesheet>`
  },
```

- [ ] **Step 5: Add `groupByStartingWith` example**

```javascript
  groupByStartingWith: {
    label: 'Group Starting-With',
    icon: '📑',
    desc: 'Flat-to-hierarchy via group-starting-with pattern',
    cat:  'advanced',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<FlatRecords>
  <Record type="HEADER" id="H001" customer="ACME Corp" date="2024-03-15"/>
  <Record type="ITEM" lineNo="10" material="MAT-001" qty="5" price="120.00"/>
  <Record type="ITEM" lineNo="20" material="MAT-002" qty="3" price="85.50"/>
  <Record type="HEADER" id="H002" customer="GlobalTech" date="2024-03-16"/>
  <Record type="ITEM" lineNo="10" material="MAT-005" qty="12" price="43.00"/>
  <Record type="ITEM" lineNo="20" material="MAT-008" qty="1" price="1250.00"/>
  <Record type="ITEM" lineNo="30" material="MAT-003" qty="8" price="67.00"/>
</FlatRecords>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs">
  <xsl:output method="xml" indent="yes"/>

  <!--
    group-starting-with: convert flat sequential records into
    nested hierarchy. Each HEADER record starts a new group
    that includes all following ITEM records until the next HEADER.
    Common pattern for IDoc flat segments and EDI parsing.
  -->

  <xsl:template match="FlatRecords">
    <Orders>
      <xsl:for-each-group select="Record" group-starting-with="Record[@type='HEADER']">
        <xsl:variable name="hdr" select="current-group()[1]"/>
        <Order id="{$hdr/@id}" customer="{$hdr/@customer}" date="{$hdr/@date}">
          <Items>
            <xsl:for-each select="current-group()[position() gt 1]">
              <Item lineNo="{@lineNo}" material="{@material}">
                <Qty><xsl:value-of select="@qty"/></Qty>
                <Price><xsl:value-of select="format-number(xs:decimal(@price), '#,##0.00')"/></Price>
              </Item>
            </xsl:for-each>
          </Items>
          <Total><xsl:value-of select="format-number(
            sum(current-group()[position() gt 1]/(xs:decimal(@qty) * xs:decimal(@price))),
            '#,##0.00')"/></Total>
        </Order>
      </xsl:for-each-group>
    </Orders>
  </xsl:template>

</xsl:stylesheet>`
  },
```

- [ ] **Step 6: Add `inlineFunctions` example**

```javascript
  inlineFunctions: {
    label: 'User-Defined Functions (xsl:function)',
    icon: '🧩',
    desc: 'Reusable xsl:function for DRY stylesheets',
    cat:  'advanced',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Invoices>
  <Invoice id="INV-001" currency="EUR">
    <LineItems>
      <Line qty="5" unitPrice="120.00" taxRate="0.19"/>
      <Line qty="3" unitPrice="85.50" taxRate="0.19"/>
      <Line qty="10" unitPrice="22.00" taxRate="0.07"/>
    </LineItems>
  </Invoice>
  <Invoice id="INV-002" currency="USD">
    <LineItems>
      <Line qty="2" unitPrice="450.00" taxRate="0.08"/>
      <Line qty="1" unitPrice="1200.00" taxRate="0.08"/>
    </LineItems>
  </Invoice>
</Invoices>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:f="urn:xsltdebugx:fn"
  exclude-result-prefixes="xs f">
  <xsl:output method="xml" indent="yes"/>

  <!--
    xsl:function: define reusable functions to avoid repeating
    calculation logic. Keeps templates clean and enables unit-testable
    business logic. Use a custom namespace (f:) to avoid collisions.
  -->

  <xsl:function name="f:line-total" as="xs:decimal">
    <xsl:param name="line" as="element()"/>
    <xsl:sequence select="xs:decimal($line/@qty) * xs:decimal($line/@unitPrice)"/>
  </xsl:function>

  <xsl:function name="f:line-tax" as="xs:decimal">
    <xsl:param name="line" as="element()"/>
    <xsl:sequence select="f:line-total($line) * xs:decimal($line/@taxRate)"/>
  </xsl:function>

  <xsl:function name="f:format-amount" as="xs:string">
    <xsl:param name="amount" as="xs:decimal"/>
    <xsl:param name="currency" as="xs:string"/>
    <xsl:sequence select="concat($currency, ' ', format-number($amount, '#,##0.00'))"/>
  </xsl:function>

  <xsl:template match="Invoices">
    <InvoiceSummary>
      <xsl:for-each select="Invoice">
        <xsl:variable name="lines" select="LineItems/Line"/>
        <xsl:variable name="subtotal" select="sum(for $l in $lines return f:line-total($l))"/>
        <xsl:variable name="tax" select="sum(for $l in $lines return f:line-tax($l))"/>
        <Invoice id="{@id}">
          <Subtotal><xsl:value-of select="f:format-amount($subtotal, @currency)"/></Subtotal>
          <Tax><xsl:value-of select="f:format-amount($tax, @currency)"/></Tax>
          <GrandTotal><xsl:value-of select="f:format-amount($subtotal + $tax, @currency)"/></GrandTotal>
        </Invoice>
      </xsl:for-each>
    </InvoiceSummary>
  </xsl:template>

</xsl:stylesheet>`
  },
```

- [ ] **Step 7: Commit**

```bash
git add js/examples-data.js
git commit -m "feat: add 6 XSLT 3.0 Advanced examples (maps, HOF, grouping, functions)"
```

---

## Task 8: Add New Examples — S/4HANA & CPI (4 examples)

**Files:**
- Modify: `js/examples-data.js` — insert in the CPI section

- [ ] **Step 1: Add `s4BusinessPartner` example**

```javascript
  s4BusinessPartner: {
    label: 'S/4HANA Business Partner',
    icon: '👤',
    desc: 'Map BP OData API response to canonical partner format',
    cat:  'cpi',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<BusinessPartner xmlns="http://sap.com/s4/bupa/v1">
  <BusinessPartnerNumber>BP-0010042</BusinessPartnerNumber>
  <BusinessPartnerCategory>1</BusinessPartnerCategory>
  <FirstName>Thomas</FirstName>
  <LastName>Mueller</LastName>
  <BusinessPartnerFullName>Thomas Mueller</BusinessPartnerFullName>
  <CreationDate>2023-06-15</CreationDate>
  <IsFemale>false</IsFemale>
  <IsMale>true</IsMale>
  <Language>DE</Language>
  <Addresses>
    <Address>
      <AddressID>1</AddressID>
      <Country>DE</Country>
      <Region>BY</Region>
      <CityName>Munich</CityName>
      <PostalCode>80331</PostalCode>
      <StreetName>Marienplatz</StreetName>
      <HouseNumber>8</HouseNumber>
    </Address>
  </Addresses>
  <Roles>
    <Role>FLCU00</Role>
    <Role>BUP003</Role>
  </Roles>
  <BankAccounts>
    <BankAccount>
      <BankCountry>DE</BankCountry>
      <BankNumber>70050000</BankNumber>
      <BankAccountNumber>123456789</BankAccountNumber>
      <IBAN>DE89370400440532013000</IBAN>
    </BankAccount>
  </BankAccounts>
</BusinessPartner>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:s4="http://sap.com/s4/bupa/v1"
  exclude-result-prefixes="xs s4">
  <xsl:output method="xml" indent="yes"/>

  <!--
    S/4HANA Business Partner OData mapping: transform the BUPA API
    response into a canonical partner format for downstream systems.
    Strips S/4 namespace, maps category codes, flattens address.
  -->

  <xsl:template match="s4:BusinessPartner">
    <Partner>
      <Id><xsl:value-of select="s4:BusinessPartnerNumber"/></Id>
      <Type>
        <xsl:choose>
          <xsl:when test="s4:BusinessPartnerCategory = '1'">Person</xsl:when>
          <xsl:when test="s4:BusinessPartnerCategory = '2'">Organization</xsl:when>
          <xsl:otherwise>Group</xsl:otherwise>
        </xsl:choose>
      </Type>
      <Name>
        <First><xsl:value-of select="s4:FirstName"/></First>
        <Last><xsl:value-of select="s4:LastName"/></Last>
        <Full><xsl:value-of select="s4:BusinessPartnerFullName"/></Full>
      </Name>
      <Gender>
        <xsl:choose>
          <xsl:when test="s4:IsMale = 'true'">M</xsl:when>
          <xsl:when test="s4:IsFemale = 'true'">F</xsl:when>
          <xsl:otherwise>X</xsl:otherwise>
        </xsl:choose>
      </Gender>
      <Language><xsl:value-of select="s4:Language"/></Language>
      <CreatedOn><xsl:value-of select="s4:CreationDate"/></CreatedOn>
      <xsl:apply-templates select="s4:Addresses/s4:Address[1]"/>
      <Roles>
        <xsl:for-each select="s4:Roles/s4:Role">
          <Role code="{.}"/>
        </xsl:for-each>
      </Roles>
    </Partner>
  </xsl:template>

  <xsl:template match="s4:Address">
    <Address primary="true">
      <Street><xsl:value-of select="concat(s4:StreetName, ' ', s4:HouseNumber)"/></Street>
      <City><xsl:value-of select="s4:CityName"/></City>
      <PostalCode><xsl:value-of select="s4:PostalCode"/></PostalCode>
      <Region><xsl:value-of select="s4:Region"/></Region>
      <Country><xsl:value-of select="s4:Country"/></Country>
    </Address>
  </xsl:template>

</xsl:stylesheet>`
  },
```

- [ ] **Step 2: Add `s4SalesOrder` example**

```javascript
  s4SalesOrder: {
    label: 'S/4HANA Sales Order A2X',
    icon: '🛒',
    desc: 'Transform S/4 Sales Order API to internal schema',
    cat:  'cpi',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<SalesOrder xmlns="http://sap.com/s4/sd/v1">
  <SalesOrderNumber>SO-0000045678</SalesOrderNumber>
  <SalesOrderType>OR</SalesOrderType>
  <SalesOrganization>1000</SalesOrganization>
  <DistributionChannel>10</DistributionChannel>
  <SoldToParty>C-10042</SoldToParty>
  <PurchaseOrderByCustomer>CUST-PO-9981</PurchaseOrderByCustomer>
  <CreationDate>2024-03-20</CreationDate>
  <RequestedDeliveryDate>2024-04-05</RequestedDeliveryDate>
  <OverallSDProcessStatus>B</OverallSDProcessStatus>
  <TotalNetAmount>18750.00</TotalNetAmount>
  <TransactionCurrency>EUR</TransactionCurrency>
  <Items>
    <Item>
      <SalesOrderItem>000010</SalesOrderItem>
      <Material>FG-2000</Material>
      <MaterialDescription>Electric Motor 5kW</MaterialDescription>
      <RequestedQuantity>5</RequestedQuantity>
      <RequestedQuantityUnit>EA</RequestedQuantityUnit>
      <NetAmount>12500.00</NetAmount>
      <Plant>1000</Plant>
      <StorageLocation>0001</StorageLocation>
    </Item>
    <Item>
      <SalesOrderItem>000020</SalesOrderItem>
      <Material>FG-3010</Material>
      <MaterialDescription>Control Panel CP-A</MaterialDescription>
      <RequestedQuantity>2</RequestedQuantity>
      <RequestedQuantityUnit>EA</RequestedQuantityUnit>
      <NetAmount>6250.00</NetAmount>
      <Plant>2000</Plant>
      <StorageLocation>0002</StorageLocation>
    </Item>
  </Items>
</SalesOrder>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:sd="http://sap.com/s4/sd/v1"
  exclude-result-prefixes="xs sd">
  <xsl:output method="xml" indent="yes"/>

  <!--
    S/4HANA Sales Order A2X API mapping: transform the SD API
    response to an internal order schema. Maps process status codes,
    computes line-level unit prices, and normalizes item numbers.
  -->

  <xsl:template match="sd:SalesOrder">
    <Order>
      <OrderNumber><xsl:value-of select="sd:SalesOrderNumber"/></OrderNumber>
      <Type><xsl:value-of select="sd:SalesOrderType"/></Type>
      <CustomerRef><xsl:value-of select="sd:PurchaseOrderByCustomer"/></CustomerRef>
      <Customer><xsl:value-of select="sd:SoldToParty"/></Customer>
      <Status>
        <xsl:choose>
          <xsl:when test="sd:OverallSDProcessStatus = 'A'">NOT_STARTED</xsl:when>
          <xsl:when test="sd:OverallSDProcessStatus = 'B'">IN_PROGRESS</xsl:when>
          <xsl:when test="sd:OverallSDProcessStatus = 'C'">COMPLETED</xsl:when>
          <xsl:otherwise>UNKNOWN</xsl:otherwise>
        </xsl:choose>
      </Status>
      <Dates>
        <Created><xsl:value-of select="sd:CreationDate"/></Created>
        <RequestedDelivery><xsl:value-of select="sd:RequestedDeliveryDate"/></RequestedDelivery>
      </Dates>
      <Totals currency="{sd:TransactionCurrency}">
        <NetAmount><xsl:value-of select="format-number(xs:decimal(sd:TotalNetAmount), '#,##0.00')"/></NetAmount>
      </Totals>
      <LineItems>
        <xsl:for-each select="sd:Items/sd:Item">
          <LineItem number="{xs:integer(sd:SalesOrderItem)}">
            <Material><xsl:value-of select="sd:Material"/></Material>
            <Description><xsl:value-of select="sd:MaterialDescription"/></Description>
            <Quantity uom="{sd:RequestedQuantityUnit}"><xsl:value-of select="sd:RequestedQuantity"/></Quantity>
            <UnitPrice><xsl:value-of select="format-number(xs:decimal(sd:NetAmount) div xs:decimal(sd:RequestedQuantity), '#,##0.00')"/></UnitPrice>
            <NetAmount><xsl:value-of select="format-number(xs:decimal(sd:NetAmount), '#,##0.00')"/></NetAmount>
            <Fulfillment plant="{sd:Plant}" storageLocation="{sd:StorageLocation}"/>
          </LineItem>
        </xsl:for-each>
      </LineItems>
    </Order>
  </xsl:template>

</xsl:stylesheet>`
  },
```

- [ ] **Step 3: Add `cpiDynamicConfig` example**

```javascript
  cpiDynamicConfig: {
    label: 'CPI Dynamic Configuration',
    icon: '⚙️',
    desc: 'Set receiver and interface dynamically from payload',
    cat:  'cpi',
    headers: [['SAP_Sender', 'ERP_PROD']],
    properties: [['routingMode', 'CONTENT_BASED']],
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Message>
  <Header>
    <MessageType>ORDERS</MessageType>
    <SenderSystem>ERP_PROD</SenderSystem>
    <ReceiverSystem>CRM_EU</ReceiverSystem>
    <Priority>HIGH</Priority>
    <Country>DE</Country>
  </Header>
  <Payload>
    <OrderId>PO-2024-88123</OrderId>
    <Amount currency="EUR">42500.00</Amount>
    <Customer>C-20017</Customer>
  </Payload>
</Message>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:cpi="http://sap.com/it/"
  exclude-result-prefixes="xs cpi">
  <xsl:output method="xml" indent="yes"/>

  <!--
    Dynamic Configuration: set SAP CPI receiver determination and
    interface at runtime based on message content. Used when routing
    cannot be determined statically in the iFlow configuration.
  -->

  <xsl:param name="exchange"/>

  <xsl:template match="/">
    <xsl:variable name="msg" select="/Message"/>
    <xsl:variable name="country" select="$msg/Header/Country"/>
    <xsl:variable name="msgType" select="$msg/Header/MessageType"/>
    <xsl:variable name="amount" select="xs:decimal($msg/Payload/Amount)"/>

    <!-- Determine receiver based on country -->
    <xsl:variable name="receiver" select="
      if ($country = ('DE', 'AT', 'CH')) then 'CRM_EU_CENTRAL'
      else if ($country = ('US', 'CA')) then 'CRM_AMERICAS'
      else 'CRM_DEFAULT'
    "/>

    <!-- Determine interface based on message type + amount threshold -->
    <xsl:variable name="interface" select="
      if ($amount gt 50000) then concat($msgType, '_PRIORITY')
      else $msgType
    "/>

    <!-- Set dynamic configuration headers for CPI routing -->
    <xsl:value-of select="cpi:setHeader($exchange, 'SAP_Receiver', $receiver)"/>
    <xsl:value-of select="cpi:setHeader($exchange, 'SAP_Interface', $interface)"/>
    <xsl:value-of select="cpi:setProperty($exchange, 'resolvedReceiver', $receiver)"/>
    <xsl:value-of select="cpi:setProperty($exchange, 'resolvedInterface', $interface)"/>

    <xsl:message select="concat('[ROUTING] ', $receiver, '/', $interface, ' for ', $msg/Payload/OrderId)"/>

    <!-- Pass through payload unchanged -->
    <xsl:copy-of select="$msg/Payload"/>
  </xsl:template>

</xsl:stylesheet>`
  },
```

- [ ] **Step 4: Add `cpiMultiMapping` example**

```javascript
  cpiMultiMapping: {
    label: 'Multi-Mapping (1:N Split)',
    icon: '🔱',
    desc: 'Produce multiple output documents with routing context',
    cat:  'cpi',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<BatchOrder>
  <OrderId>BO-2024-5501</OrderId>
  <Customer>C-10042</Customer>
  <Lines>
    <Line plant="1000" material="MAT-A" qty="10" type="STANDARD"/>
    <Line plant="1000" material="MAT-B" qty="5" type="STANDARD"/>
    <Line plant="2000" material="MAT-C" qty="3" type="CONSIGNMENT"/>
    <Line plant="2000" material="MAT-D" qty="8" type="STANDARD"/>
    <Line plant="3000" material="MAT-E" qty="1" type="SUBCONTRACT"/>
  </Lines>
</BatchOrder>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs">
  <xsl:output method="xml" indent="yes"/>

  <!--
    Multi-Mapping 1:N: split a single batch order into one output
    document per plant. Each sub-document carries routing metadata
    so a CPI Splitter step can send each to the correct receiver.
    Uses xsl:for-each-group to partition by plant.
  -->

  <xsl:template match="/">
    <xsl:variable name="order" select="/BatchOrder"/>
    <MultiMessages>
      <xsl:for-each-group select="$order/Lines/Line" group-by="@plant">
        <Message index="{position()}" targetPlant="{current-grouping-key()}">
          <PlantOrder>
            <SourceOrder><xsl:value-of select="$order/OrderId"/></SourceOrder>
            <Customer><xsl:value-of select="$order/Customer"/></Customer>
            <Plant><xsl:value-of select="current-grouping-key()"/></Plant>
            <Items>
              <xsl:for-each select="current-group()">
                <Item material="{@material}" qty="{@qty}" type="{@type}"/>
              </xsl:for-each>
            </Items>
            <TotalQty><xsl:value-of select="sum(current-group()/xs:decimal(@qty))"/></TotalQty>
          </PlantOrder>
        </Message>
      </xsl:for-each-group>
    </MultiMessages>
  </xsl:template>

</xsl:stylesheet>`
  },
```

- [ ] **Step 5: Commit**

```bash
git add js/examples-data.js
git commit -m "feat: add 4 S/4HANA and CPI examples (BP, Sales Order, Dynamic Config, Multi-Mapping)"
```

---

## Task 9: Add New Examples — XPath Explorer (3 examples)

**Files:**
- Modify: `js/examples-data.js` — insert in the XPath section

- [ ] **Step 1: Add `xpathMapsArrays` example**

```javascript
  xpathMapsArrays: {
    label: 'XPath Maps & Arrays',
    icon: '🗂️',
    desc: 'Construct and query XPath 3.1 maps and arrays',
    cat:  'xpath',
    xpathExpr: "map{ 'name': //Product[1]/Name, 'price': xs:decimal(//Product[1]/Price) }",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Catalog>
  <Product id="P-001" category="sensor">
    <Name>Temperature Probe XR-20</Name>
    <Price>125.00</Price>
    <InStock>true</InStock>
  </Product>
  <Product id="P-002" category="actuator">
    <Name>Servo Motor SM-50</Name>
    <Price>890.00</Price>
    <InStock>false</InStock>
  </Product>
  <Product id="P-003" category="sensor">
    <Name>Pressure Gauge PG-10</Name>
    <Price>45.00</Price>
    <InStock>true</InStock>
  </Product>
</Catalog>`,
    xslt: '',
    xpathHints: [
      "map{ 'a': 1, 'b': 2 }                             — literal map",
      "map{ 'name': //Product[1]/Name, 'price': xs:decimal(//Product[1]/Price) } — map from data",
      "['one', 'two', 'three']                            — array literal",
      "array{ //Product/Name }                            — array from sequence",
      "array{ //Product/Name }?2                          — array lookup (2nd item)",
      "map{ 'x': 10, 'y': 20 }?x                        — map lookup shorthand",
      "map:keys(map{ 'a': 1, 'b': 2 })                  — get map keys",
      "map:merge((map{'a':1}, map{'b':2}))               — merge two maps",
      "array:size(array{ //Product })                    — array size",
      "array:flatten([1, [2, 3], 4])                     — flatten nested arrays",
    ]
  },
```

- [ ] **Step 2: Add `xpathLetExpressions` example**

```javascript
  xpathLetExpressions: {
    label: 'let Expressions',
    icon: '📝',
    desc: 'Readable complex expressions with let $x := ... return',
    cat:  'xpath',
    xpathExpr: "let $items := //Item, $total := sum($items/xs:decimal(Price) * xs:decimal(Qty)) return $total",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<PurchaseOrder id="PO-7712" currency="EUR">
  <Vendor>Bosch Rexroth AG</Vendor>
  <Items>
    <Item status="confirmed">
      <Material>BRX-CYL-40</Material>
      <Description>Hydraulic Cylinder 40mm</Description>
      <Qty>4</Qty>
      <Price>780.00</Price>
    </Item>
    <Item status="confirmed">
      <Material>BRX-VALVE-DN25</Material>
      <Description>Directional Valve DN25</Description>
      <Qty>8</Qty>
      <Price>145.00</Price>
    </Item>
    <Item status="pending">
      <Material>BRX-PUMP-A10</Material>
      <Description>Axial Piston Pump A10</Description>
      <Qty>1</Qty>
      <Price>4200.00</Price>
    </Item>
  </Items>
</PurchaseOrder>`,
    xslt: '',
    xpathHints: [
      "let $items := //Item return count($items)                             — bind and use",
      "let $items := //Item, $total := sum($items/xs:decimal(Price) * xs:decimal(Qty)) return $total — multi-bind",
      "let $confirmed := //Item[@status='confirmed'] return sum($confirmed/xs:decimal(Price) * xs:decimal(Qty)) — filtered sum",
      "let $avg := avg(//Item/xs:decimal(Price)) return //Item[xs:decimal(Price) gt $avg]/Material — above average",
      "let $max := max(//Item/xs:decimal(Price)) return //Item[xs:decimal(Price) = $max]/Description — most expensive",
      "for $i in //Item let $lineTotal := xs:decimal($i/Price) * xs:decimal($i/Qty) return concat($i/Material, ': ', $lineTotal) — per-item totals",
    ]
  },
```

- [ ] **Step 3: Add `xpathQuantified` example**

```javascript
  xpathQuantified: {
    label: 'Quantified Expressions',
    icon: '∀',
    desc: 'some/every for existence and universal checks',
    cat:  'xpath',
    xpathExpr: "every $item in //Item satisfies xs:decimal($item/Stock) gt 0",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<Warehouse id="WH-CENTRAL">
  <Items>
    <Item sku="SKU-001">
      <Name>Industrial Sensor XR20</Name>
      <Stock>42</Stock>
      <MinStock>10</MinStock>
      <Price>125.00</Price>
    </Item>
    <Item sku="SKU-002">
      <Name>Control Module CM50</Name>
      <Stock>0</Stock>
      <MinStock>5</MinStock>
      <Price>450.00</Price>
    </Item>
    <Item sku="SKU-003">
      <Name>Hydraulic Pump HP-30</Name>
      <Stock>7</Stock>
      <MinStock>3</MinStock>
      <Price>890.00</Price>
    </Item>
    <Item sku="SKU-004">
      <Name>Servo Drive SD-100</Name>
      <Stock>15</Stock>
      <MinStock>8</MinStock>
      <Price>1250.00</Price>
    </Item>
  </Items>
</Warehouse>`,
    xslt: '',
    xpathHints: [
      "some $i in //Item satisfies xs:decimal($i/Stock) = 0              — any out of stock?",
      "every $i in //Item satisfies xs:decimal($i/Stock) gt 0            — all in stock?",
      "every $i in //Item satisfies xs:decimal($i/Stock) ge xs:decimal($i/MinStock) — all above minimum?",
      "some $i in //Item satisfies xs:decimal($i/Stock) lt xs:decimal($i/MinStock)  — any below minimum?",
      "some $i in //Item satisfies xs:decimal($i/Price) gt 1000          — any expensive items?",
      "every $i in //Item satisfies string-length($i/Name) le 30         — all names short?",
      "//Item[xs:decimal(Stock) lt xs:decimal(MinStock)]/@sku            — SKUs below minimum",
      "count(//Item[xs:decimal(Stock) = 0])                              — count out-of-stock",
    ]
  },
```

- [ ] **Step 4: Commit**

```bash
git add js/examples-data.js
git commit -m "feat: add 3 XPath examples (maps/arrays, let expressions, quantified)"
```

---

## Task 10: Add New Example — Aggregation (Pivot/Cross-Tab)

**Files:**
- Modify: `js/examples-data.js` — insert in Aggregation section

- [ ] **Step 1: Add `pivotCrossTab` example**

```javascript
  pivotCrossTab: {
    label: 'Pivot / Cross-Tab',
    icon: '📈',
    desc: 'Rotate rows to columns — months as column headers',
    cat:  'aggregation',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<MonthlySales>
  <Entry region="North" month="Jan" amount="12500"/>
  <Entry region="North" month="Feb" amount="14200"/>
  <Entry region="North" month="Mar" amount="11800"/>
  <Entry region="South" month="Jan" amount="9800"/>
  <Entry region="South" month="Feb" amount="10500"/>
  <Entry region="South" month="Mar" amount="13200"/>
  <Entry region="East" month="Jan" amount="7600"/>
  <Entry region="East" month="Feb" amount="8100"/>
  <Entry region="East" month="Mar" amount="9400"/>
</MonthlySales>`,
    xslt: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs">
  <xsl:output method="xml" indent="yes"/>

  <!--
    Pivot / Cross-Tab: rotate row-oriented data so that months
    become columns and regions become rows. Common for reporting
    transformations where downstream systems expect tabular layout.
  -->

  <xsl:variable name="months" select="distinct-values(/MonthlySales/Entry/@month)"/>

  <xsl:template match="MonthlySales">
    <SalesPivot>
      <xsl:for-each-group select="Entry" group-by="@region">
        <xsl:sort select="current-grouping-key()"/>
        <Region name="{current-grouping-key()}">
          <xsl:for-each select="$months">
            <xsl:variable name="m" select="."/>
            <xsl:variable name="val" select="current-group()[@month = $m]/@amount"/>
            <Month name="{$m}">
              <xsl:value-of select="format-number(xs:decimal($val), '#,##0')"/>
            </Month>
          </xsl:for-each>
          <Total>
            <xsl:value-of select="format-number(sum(current-group()/xs:decimal(@amount)), '#,##0')"/>
          </Total>
        </Region>
      </xsl:for-each-group>
    </SalesPivot>
  </xsl:template>

</xsl:stylesheet>`
  },
```

- [ ] **Step 2: Commit**

```bash
git add js/examples-data.js
git commit -m "feat: add Pivot/Cross-Tab aggregation example"
```

---

## Task 11: Update Test File — Add New Example Keys

**Files:**
- Modify: `tests/e2e/workflows/examples-comprehensive.spec.js:22-143`

- [ ] **Step 1: Add new example keys to `EXAMPLE_KEYS` array**

Add these entries in the appropriate positions:

```javascript
const EXAMPLE_KEYS = [
  // Data Transformation (8) — unchanged
  'identityTransform',
  'renameElements',
  'filterNodes',
  'namespaceHandling',
  'groupBy',
  'splitMessage',
  'mergeMessages',
  'xmlToText',
  
  // Aggregation & Splitting (4) — +1 new
  'batchProcessing',
  'sortRecords',
  'fieldInjection',
  'pivotCrossTab',                    // NEW
  
  // Format Conversion (6) — unchanged
  'dateFormatting',
  'currencyAmount',
  'idocToXml',
  'xmlToJson',
  'xmlToCsv',
  'xmlToFixedLength',

  // XSLT 3.0 Advanced (6) — NEW CATEGORY
  'mapsAndArrays',
  'higherOrderFilter',
  'higherOrderFold',
  'groupByAdjacent',
  'groupByStartingWith',
  'inlineFunctions',
  
  // SAP CPI Patterns (17) — +4 new
  'cpiGetSet',
  'lookupEnrich',
  'errorHandling',
  'multiCurrencyReport',
  'batchKeyRecovery',
  'xslMessageDebug',
  'soapFaultHandling',
  'conditionalRouting',
  'unwrapRewrap',
  'emptyElementCleanup',
  'stripSoapEnvelope',
  'addXmlWrapper',
  'sfEmployeeMapping',
  's4BusinessPartner',                // NEW
  's4SalesOrder',                     // NEW
  'cpiDynamicConfig',                 // NEW
  'cpiMultiMapping',                  // NEW

  // XPath Explorer (19) — +3 new
  'xpathNavigation',
  'xpathAggregation',
  'xpathStringFunctions',
  'xpathTokenizeJoin',
  'xpathRegexReplace',
  'xpathDateFunctions',
  'xpathNamespaceAgnostic',
  'xpathBatchErrorDetect',
  'xpathConditional',
  'xpathNodeInspection',
  'xpathSOAPNavigation',
  'xpathDistinctValues',
  'xpathSiblingAxes',
  'xpathSequenceOps',
  'xpathDeepEqual',
  'xpathTypeCasting',
  'xpathMapsArrays',                 // NEW
  'xpathLetExpressions',             // NEW
  'xpathQuantified',                 // NEW
  
  // IDoc Examples (2) — unchanged
  'idocInvoic01',
];
```

- [ ] **Step 2: Add new entries to `EXAMPLE_CATEGORIES` map**

```javascript
  // Advanced (NEW)
  mapsAndArrays: 'advanced',
  higherOrderFilter: 'advanced',
  higherOrderFold: 'advanced',
  groupByAdjacent: 'advanced',
  groupByStartingWith: 'advanced',
  inlineFunctions: 'advanced',

  // CPI (new additions)
  s4BusinessPartner: 'cpi',
  s4SalesOrder: 'cpi',
  cpiDynamicConfig: 'cpi',
  cpiMultiMapping: 'cpi',

  // XPath (new additions)
  xpathMapsArrays: 'xpath',
  xpathLetExpressions: 'xpath',
  xpathQuantified: 'xpath',

  // Aggregation (new addition)
  pivotCrossTab: 'aggregation',
```

- [ ] **Step 3: Update file header comment**

Change line 7 from:
```javascript
 * Tests ALL 47 XSLT and XPath examples to verify:
```
to:
```javascript
 * Tests ALL 61 XSLT and XPath examples to verify:
```

And line 19 from:
```javascript
// METADATA: All 47 examples for parametrized testing
```
to:
```javascript
// METADATA: All 61 examples for parametrized testing
```

- [ ] **Step 4: Add `xmlToJson` to the JSON output format allowlist**

In the output format validation section, update the `textOutputExamples` array if needed. The `xmlToJson` example outputs JSON (starts with `{`), which is already handled by the `isStructured` check. No change needed — the existing logic checks for `{` or `[` starts.

- [ ] **Step 5: Run the test suite to verify it passes**

```bash
npm run test:e2e -- tests/e2e/workflows/examples-comprehensive.spec.js --workers=2
```

Expected: All 183 parametrized tests pass (61 examples × 3 tests each).

- [ ] **Step 6: Commit**

```bash
git add tests/e2e/workflows/examples-comprehensive.spec.js
git commit -m "test: add 14 new example keys to comprehensive test suite (61 total)"
```

---

## Task 12: Update Documentation Reference

**Files:**
- Modify: `.github/docs/reference/examples-data.md`

- [ ] **Step 1: Add `advanced` category to categories section**

After the `format` entry, add:
```markdown
- `advanced` — XSLT 3.0 Advanced (#e06c75, coral)
```

- [ ] **Step 2: Update example count references**

Update any mention of "47 examples" to "61 examples".

- [ ] **Step 3: Add new example descriptions to reference**

Add a section for the new advanced examples and note the new CPI/XPath/Aggregation additions.

- [ ] **Step 4: Commit**

```bash
git add .github/docs/reference/examples-data.md
git commit -m "docs: update examples reference with new category and 14 new examples"
```

---

## Task 13: Final Verification

- [ ] **Step 1: Run full E2E test suite**

```bash
npm run test:e2e
```

Expected: All tests pass including the 183 parametrized example tests.

- [ ] **Step 2: Manual verification — start dev server and check examples modal**

```bash
npm run serve
```

Open http://localhost:8000, click Examples button, verify:
- New "XSLT 3.0 Advanced" category tab appears with coral accent
- All 6 advanced examples are listed and load correctly
- New CPI examples (S/4HANA BP, Sales Order, Dynamic Config, Multi-Mapping) appear
- New XPath examples appear and switch to XPath mode
- Pivot example appears in Aggregation
- Search works for new example labels

- [ ] **Step 3: Run transform on each new XSLT example manually**

Load each of the 11 new XSLT examples and click Run. Verify output is well-formed XML with no Saxon errors.

- [ ] **Step 4: Test each new XPath example**

Load each of the 3 new XPath examples, verify the default expression evaluates without error.

- [ ] **Step 5: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: address issues found during final verification"
```
