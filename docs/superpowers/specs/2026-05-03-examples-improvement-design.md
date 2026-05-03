# Examples Library Improvement — Design Spec

**Date:** 2026-05-03  
**Scope:** Comprehensive overhaul of `js/examples-data.js` — polish all 47 existing examples, add ~14 new examples, add 1 new category, update tests.

---

## 1. Approach

**Single-file enhancement (Approach A).** All examples remain in `examples-data.js`. No structural or load-order changes. File grows from ~3,675 to ~5,500 lines (all string content).

---

## 2. New Category

Add one new category after `format`:

```javascript
advanced: { label: 'XSLT 3.0 Advanced', accent: '#e06c75' }  // coral/red
```

Signals to users that these patterns require deeper XSLT 3.0 / XPath 3.1 knowledge. Distinct from the beginner-friendly "Data Transformation" category.

---

## 3. New Examples (~14)

### XSLT 3.0 Advanced (6)

| Key | Label | Pattern |
|-----|-------|---------|
| `mapsAndArrays` | Maps & Arrays | Construct XPath 3.1 maps/arrays for complex data routing |
| `higherOrderFilter` | Higher-Order: filter() & sort() | Functional-style processing with custom comparators |
| `higherOrderFold` | Higher-Order: fold-left() | Running totals / accumulation without recursion |
| `groupByAdjacent` | Group-by Adjacent | `group-adjacent` for consecutive run detection |
| `groupByStartingWith` | Group-by Starting-With | `group-starting-with` for flat-to-hierarchy |
| `inlineFunctions` | User-Defined Functions | Reusable `xsl:function` within a stylesheet |

### S/4HANA / CPI (4)

| Key | Label | Pattern |
|-----|-------|---------|
| `s4BusinessPartner` | S/4HANA Business Partner | Map BP OData response to canonical format |
| `s4SalesOrder` | S/4HANA Sales Order A2X | Transform A2X API response to internal schema |
| `cpiDynamicConfig` | CPI Dynamic Configuration | Set receiver/interface dynamically from payload |
| `cpiMultiMapping` | Multi-Mapping (1:N Split) | Produce multiple output docs with routing context |

### XPath Explorer (3)

| Key | Label | Pattern |
|-----|-------|---------|
| `xpathMapsArrays` | XPath Maps & Arrays | Construct and query maps/arrays in XPath |
| `xpathLetExpressions` | let Expressions | `let $x := ... return ...` for complex queries |
| `xpathQuantified` | Quantified Expressions | `some`/`every` for existence/universal checks |

### Aggregation (1)

| Key | Label | Pattern |
|-----|-------|---------|
| `pivotCrossTab` | Pivot / Cross-Tab | Rotate rows to columns (months as column headers) |

---

## 4. Polish Audit — All 47 Existing Examples

### Quality Standards

| Criterion | Standard |
|-----------|----------|
| Comment block | 3-5 lines: what pattern does, when to use it, CPI relevance |
| XML data | Realistic SAP domain data, 2-5 records, XML declaration present |
| XSLT style | `version="3.0"`, `exclude-result-prefixes` when needed, consistent indentation |
| Description | ≤60 chars, action-oriented ("Map X to Y"), no "This example shows..." |
| Icon | Meaningful emoji, no duplicates within same category |
| Namespaces | `xs` declared when `xs:` is used, `cpi` only in CPI examples |
| Consistency | All numeric casts use `xs:decimal()`, dates use XSLT 3.0 date functions |

### Known Issues to Fix

1. **Overly verbose comments** — CPI Headers example (`cpiGetSet`) has ASCII-art comment block spanning 35+ lines. Trim to 3-5 line standard.
2. **Missing `exclude-result-prefixes`** — Some examples declare `xs` but don't exclude it from output.
3. **Description length** — Verify all ≤60 chars; truncate any that overflow.
4. **Icon duplicates** — Check for duplicate emojis within same category and fix.
5. **Inconsistent numeric handling** — Some examples use `number()`, others `xs:decimal()`. Standardize on `xs:decimal()` for CPI-style precision.
6. **Missing XML declarations** — Ensure every `xml` field starts with `<?xml version="1.0" encoding="UTF-8"?>`.

---

## 5. Testing Updates

### Existing Test Infrastructure

`tests/e2e/workflows/examples-comprehensive.spec.js` uses parametrized testing:
- `EXAMPLE_KEYS` array — flat list of all example keys
- `EXAMPLE_CATEGORIES` map — key → category string
- Auto-generates 3 tests per XSLT example: Load & Verify, Run Transform, Output Format
- Auto-generates 3 tests per XPath example: Load & Mode Switch, Evaluate Expression, Verify Content

### Changes Required

1. **Add 14 new keys** to `EXAMPLE_KEYS` array in correct position
2. **Add 14 entries** to `EXAMPLE_CATEGORIES` map
3. **Add `'advanced'` category** to XSLT test group (not XPath)
4. **Update text-output allowlist** if any new examples produce non-XML (e.g., JSON output from maps/arrays)
5. **Update header comment** from "47 examples" to reflect new count (~61)

This generates ~42 new test cases automatically (14 examples × 3 tests each).

### Total Test Count After

- Existing: 47 examples × 3 tests = 141 parametrized tests + integration tests
- New: 14 examples × 3 tests = 42 parametrized tests
- **Total: ~183 parametrized tests**

---

## 6. Documentation Updates

Update `.github/docs/reference/examples-data.md`:
- Add `advanced` category to the categories section
- Add the new example keys/descriptions to the reference
- Update total example count

---

## 7. File Changes Summary

| File | Change |
|------|--------|
| `js/examples-data.js` | Add `advanced` category, add 14 new examples, polish all 47 existing |
| `tests/e2e/workflows/examples-comprehensive.spec.js` | Add 14 keys + categories, update counts |
| `.github/docs/reference/examples-data.md` | Add new category, update reference |

---

## 8. Implementation Order

1. Polish all 47 existing examples (comments, descriptions, icons, namespaces)
2. Add `advanced` category to `CATEGORIES` object
3. Add 6 XSLT 3.0 Advanced examples
4. Add 4 S/4HANA / CPI examples
5. Add 3 XPath Explorer examples
6. Add 1 Aggregation example (pivot)
7. Update test file with new keys and categories
8. Update documentation reference
9. Run full test suite to verify all examples load and execute
