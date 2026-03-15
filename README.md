# XSLTDebugX — SAP Cloud Integration XSLT IDE

> A browser-based XSLT 3.0 IDE and XPath evaluator built specifically for SAP Cloud Integration (CPI) developers. Test and debug XSLT mappings and XPath expressions locally — with full CPI runtime simulation — before ever deploying to your tenant.

---

## Why This Exists

SAP CPI's built-in mapping editor has no debugger, no live validation, and no way to test an XSLT stylesheet without deploying it to an integration flow and running an actual message through. Every iteration means a deploy cycle.

XSLTDebugX runs entirely in the browser. There is nothing to install, no build step, and no server. Open the page, paste your XML and XSLT, press **Ctrl+Enter**, and see the output — with your headers, properties, and `xsl:message` traces in a live console.

---

## Two Modes

XSLTDebugX has two distinct operating modes, toggled with the **ƒx XPath** button in the header.

### XSLT Mode (default)

The full three-column layout:

```
[ XML Input Message ] [ XSLT Stylesheet + Console ] [ Output Message ]
```

- Edit XML and XSLT side by side
- Run the transform with **Run XSLT** or `Ctrl+Enter`
- CPI headers and properties injected as `xsl:param` values
- Output shown formatted with headers/properties panels

### XPath Mode

A focused two-column layout for exploring XML structure:

```
[ XQuery header + input + XML Source ] [ XPath Results ]
         [ Console (full width) ]
```

- The **XQuery** bar sits at the top of the left column
- Type an XPath 3.0 expression and press **Enter** or **Run XPath**
- Matching nodes are highlighted in amber in the XML editor
- Results are shown syntax-coloured using the same Monaco tokenizer
- XSLT pane, Headers, Properties, and Output section are hidden
- Console spans the full width below both panes

Switching modes automatically: loading an XPath example switches to XPath mode; loading an XSLT example switches back to XSLT mode.

---

## Features

### Editor
- **Monaco Editor** — the same engine powering VS Code, with full XML syntax highlighting, bracket pair colourisation, auto-close tags, attribute `=""` insertion, and indent guides
- **Live validation** — XML and XSLT validated as you type with inline red squiggles and glyph margin markers
- **Format** — pretty-print any pane with a single click or via right-click menu
- **Upload / Download / Drag-drop** — load files directly into the XML or XSLT pane
- **Right-click context menu** — Format XML, Minify XML, Comment/Uncomment Lines, Copy XPath of Element (Exact and General)

### XPath Evaluator (XPath Mode)
- **XPath 3.0** expressions evaluated against the XML input using Saxon-JS
- **Syntax-coloured results** — node results rendered with the same Monaco XML tokenizer and theme
- **Pretty-printed nodes** — matched elements formatted using the built-in `prettyXML` formatter
- **Editor highlighting** — matched nodes highlighted with amber glyph markers and line backgrounds; scroll to first match
- **Copy XPath of Element** — right-click any element to copy its absolute XPath (exact with positional predicates, or general pattern) to clipboard and populate the XQuery bar
- **Mode-aware Ctrl+Enter** — runs XPath in XPath mode, XSLT in XSLT mode

### Transform Engine
- **XSLT 3.0** powered by [Saxon-JS 2.x](https://www.saxonica.com/saxon-js/documentation/index.html) — full spec support including `xsl:iterate`, higher-order functions, maps, arrays, and `xsl:message`
- **Pre-flight validation** — well-formedness checked before Saxon ever sees your XML or XSLT
- **Pretty-printed output** — XML output is auto-formatted; non-XML output shown as-is

### SAP CPI Simulation
- **Headers and Properties** — enter name/value pairs in the left panel; injected as `xsl:param` values exactly as the CPI runtime passes them
- **`cpi:setHeader` / `cpi:setProperty`** — CPI extension calls intercepted, static values extracted and shown in Output panels, stripped before Saxon runs
- **`$exchange` param** — always injected automatically
- **`xsl:message` in console** — surfaced as amber console entries in correct execution order
- **`terminate="yes"` shown as intentional halt** — logged as a warning, not an error

### Examples Library
24 built-in examples across 5 categories. Loading an example automatically switches to the correct mode.

| Category | Count | Examples |
|---|---|---|
| **Data Transformation** | 4 | Identity Transform, Rename Elements & Attributes, Filter / Conditional Output, Namespace Handling |
| **Aggregation & Splitting** | 3 | Aggregate Line Items, Multi-Source Merge, Group By Key |
| **Format Conversion** | 3 | XML to Flat File, Flat File to XML, IDoc Segments to XML |
| **SAP CPI Patterns** | 6 | Set Headers & Properties, SuccessFactors Upsert Mapping, Batch Key Recovery, xsl:message Debugging, and more |
| **XPath Explorer** | 8 | Navigation & Predicates, Aggregation Functions, String Functions, tokenize/string-join, Regex, Date & Duration, Namespace-Agnostic Selection, Batch Error Detection |

### Share
A full XSLT session — XML, XSLT, headers, properties — encoded into a single URL. Recipients always land in XSLT mode. Encoding: JSON → `TextEncoder` → `pako.deflateRaw` (level 9) → base64url in the URL hash fragment. Never hits a server.

### Session Persistence
Everything auto-saved to `localStorage` 800ms after you stop typing. Editors, headers, properties, column states, XPath expression, and current mode all restored on reload. The restore log shows the active mode: `Session restored · saved 2m ago · XPath mode ✓`.

### Status Bar
- Transform/XPath status and message
- Saxon-JS 2.x · XSLT 3.0 Engine
- **Mode pill** — `XSLT` (blue) or `XPath` (amber)
- ● Saved indicator
- Author links and SAP® trademark notice

---

## CPI Developer Reference

### How CPI passes params to XSLT

```xslt
<!-- Declare in your stylesheet -->
<xsl:param name="SAPClient"/>
<xsl:param name="TargetSystem"/>

<!-- Use it -->
<xsl:value-of select="$SAPClient"/>
```

Add `SAPClient` and `TargetSystem` to the Headers panel with your test values.

### How CPI extension calls are handled

```xslt
<xsl:value-of select="cpi:setHeader($exchange, 'Content-Type', 'application/xml')"/>
<xsl:value-of select="cpi:setProperty($exchange, 'OrderStatus', 'APPROVED')"/>
```

1. **Extract** — static string values captured and shown in Output Headers / Output Properties panels
2. **Strip** — `xmlns:cpi` declaration and all matching `xsl:value-of` elements removed before Saxon sees the XSLT

Dynamic values (`concat(...)`, variables) show `— none —` in output panels but the stylesheet logic executes correctly.

### Namespace declarations for CPI stylesheets

```xslt
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:cpi="http://sap.com/it/cpi/scripting"
  xmlns:sap="http://www.sap.com"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:fn="http://www.w3.org/2005/xpath-functions"
  exclude-result-prefixes="cpi sap xs fn">
```

For multi-mapping: also add `xmlns:multimap="http://sap.com/xi/XI/SplitAndMerge"`.

### Using `xsl:message` for debugging

```xslt
<xsl:message select="concat('DEBUG orderCount = ', $orderCount)"/>
<xsl:message select="concat('DEBUG processing ', position(), ' of ', last())"/>
<xsl:message terminate="yes" select="concat('FATAL: unknown status [', $status, ']')"/>
```

### XPath expressions for CPI payloads

In XPath mode, right-click any element for:

- **Copy XPath — Exact**: `/Orders/Order[2]/Amount` — positional, targets that specific occurrence
- **Copy XPath — General**: `/Orders/Order/Amount` — pattern, matches all siblings

Both populate the XQuery bar and run immediately. In XSLT mode, the same options copy to clipboard and log to console without switching mode.

---

## Getting Started

### Use online

Open the GitHub Pages URL. No account, no install.

### Run locally

```bash
git clone https://github.com/SunilPharswan/XSLTDebugX.git
cd XSLTDebugX
open index.html    # macOS
```

No build step. No `npm install`. No server required.

### Keyboard shortcuts

| Shortcut | XSLT Mode | XPath Mode |
|---|---|---|
| `Ctrl+Enter` / `Cmd+Enter` | Run XSLT | Run XPath |
| `Enter` (in XQuery bar) | — | Run XPath |
| `Escape` | Close modal | Close modal |

---

## Deployment

### GitHub Pages

1. Push to GitHub
2. **Settings → Pages → Source** → branch `main`, folder `/`
3. Live at `https://your-org.github.io/XSLTDebugX/`

### CDN dependencies

| Resource | URL |
|---|---|
| Monaco Editor | `cdn.jsdelivr.net/npm/monaco-editor@0.44.0` |
| Pako | `cdnjs.cloudflare.com/ajax/libs/pako/2.1.0` |
| JetBrains Mono | `fonts.googleapis.com` |

Saxon-JS is bundled locally in `lib/SaxonJS2.js`.

---

## Project Structure

```
XSLTDebugX/
├── index.html              # App shell — layout, modals, script tags
├── css/
│   └── style.css           # All styles, themes (light/dark), component CSS
├── js/
│   ├── state.js            # Global state, console, status bar, localStorage
│   ├── validate.js         # XML validation, Monaco markers
│   ├── panes.js            # clearPane, copyPane, prettyXML, fmtEditor
│   ├── transform.js        # CPI simulation, KV panels, runTransform
│   ├── examples-data.js    # 24 built-in examples
│   ├── modal.js            # Examples library, loadExample, mode-switching
│   ├── files.js            # Upload, download, drag-and-drop
│   ├── ui.js               # Column collapse, console, theme toggle
│   ├── share.js            # Share URL encode/decode
│   ├── xpath.js            # XPath evaluator, highlighting, mode toggle
│   └── editor.js           # Monaco init, context menu, Saxon init, session restore
└── lib/
    └── SaxonJS2.js         # Saxon-JS 2.x (bundled, no CDN)
```

### Script load order

```
pako → Monaco loader → SaxonJS2.js → state.js → validate.js → panes.js
→ transform.js → examples-data.js → modal.js → files.js → ui.js
→ share.js → xpath.js → editor.js
```

Breaking this order causes reference errors as each file depends on globals from files above it.

---

## Architecture Notes

### Two-mode layout system

`_applyXPathToggleState()` in `xpath.js` is the single function for all DOM changes when switching modes. It toggles: XQuery bar, XSLT column collapse, KV panels, Output section, Share button visibility, Run button label and handler, mode pill, console label, and console panel DOM position (inside `colCenter` in XSLT mode, below workspace in XPath mode using `insertAdjacentElement`).

### XPath node range finder

`_findNodeRange` locates each matched element in raw XML source using precise regex (`<tagName(?=[\s>/])`) to avoid partial tag name matches. It walks attribute quotes to find the opening tag end, then tracks nesting depth with two regex scanners to find the matching close tag. Offsets are converted to Monaco line/column via `_offsetToLineCol`.

### Share URL encoding

```
{ xml, xslt, headers, properties }
  → JSON.stringify → TextEncoder → pako.deflateRaw (level 9)
  → chunked btoa → base64url → URL hash #share/<encoded>
```

Hash stripped via `history.replaceState` after decoding. Recipients always land in XSLT mode.

---

## Contributing

### Adding an XSLT example

```js
myExample: {
  label: 'My Example', icon: '🗂️', desc: 'One sentence',
  cat: 'cpi',   // transform | aggregation | format | cpi
  xml:  `<Root>...</Root>`,
  xslt: `<xsl:stylesheet version="3.0" ...>...</xsl:stylesheet>`,
  headers:    [['Content-Type', 'application/xml']],  // optional
  properties: [['SAPClient', '100']],                 // optional
}
```

### Adding an XPath example

```js
myXPathExample: {
  label: 'My XPath Example', icon: '🔍', desc: 'One sentence',
  cat: 'xpath',
  xml:       `<Root>...</Root>`,
  xslt:      '',   // empty — not used in XPath mode
  xpathExpr: '//Element[@attr="value"]',  // pre-filled and auto-runs on load
}
```

---

## Browser Compatibility

| Browser | Status |
|---|---|
| Chrome / Edge (Chromium) | ✅ Fully supported |
| Firefox | ✅ Fully supported |
| Safari | ✅ Supported |
| `file://` protocol | ✅ Works — clipboard falls back to `execCommand` |

---

## Known Limitations

| Limitation | Detail |
|---|---|
| CPI line number offset | `stripCPICalls` removes lines before Saxon sees the XSLT. Error glyphs attempt a best-effort line match. |
| Dynamic CPI values | `cpi:setHeader`/`cpi:setProperty` with variables or `concat()` show `— none —` in output panels. |
| XPath colours after theme switch | Colorized results don't update on theme change. Re-run the expression to refresh. |
| Share is XSLT only | XPath expressions and XPath mode are not included in share URLs. Recipients always land in XSLT mode. |

---

## License

MIT

---

## Trademarks

SAP®, SAP Cloud Integration, and SAP Cloud Platform Integration (CPI) are registered trademarks of SAP SE. SuccessFactors® and IDoc® are trademarks or registered trademarks of SAP SE.

This project is not affiliated with, endorsed by, or in any way officially connected with SAP SE.