# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**XSLTDebugX** is a zero-build, zero-dependency browser-based IDE for XSLT 3.0 and XPath 3.1, targeting SAP Cloud Integration (CPI) developers. It simulates the CPI runtime (headers, properties, extension functions) so developers can test transformations locally without deploying.

- **Stack:** Vanilla JS + Monaco Editor + Saxon-JS 2 (XSLT/XPath engine) + localStorage
- **No build step.** Edit files and refresh the browser.
- **Deployed** to Cloudflare Pages on push to `main`.

## Commands

```bash
# Serve locally
npm run serve                          # http-server on port 8000

# E2E tests (requires server running)
npm run test:e2e                       # All tests (Playwright, Chromium)
npm run test:e2e:ui                    # Interactive UI mode
npm run test:e2e:headed                # Visual browser (Chromium)
npm run test:e2e:debug                 # Step-through debugger

# Run a single test file
npx playwright test tests/e2e/workflows/xslt-transform.spec.js
npx playwright test --grep "some test name"
```

Tests live in `tests/e2e/` with a Page Object Model in `tests/utils/test-helpers.js` and fixtures in `tests/fixtures/sample-data.js`.

## Architecture

### Module System

There is **no bundler or module system**. All 12 modules are plain `<script>` tags in `index.html` and share a single global namespace. **Load order is critical** — each module depends on the ones before it:

```
state.js → editor.js → transform.js → validate.js → mode-manager.js
→ xpath.js → panes.js → files.js → share.js → modal.js → ui.js → examples-data.js
```

| Module | Lines | Responsibility |
|--------|-------|----------------|
| `state.js` | 195 | Global state, console (`clog`), localStorage save/load |
| `editor.js` | 1,012 | Monaco init, themes, keyboard shortcuts, context menus |
| `transform.js` | 518 | XSLT execution, CPI simulation, output rendering |
| `validate.js` | 170 | XML/XSLT validation, Saxon error parsing, error markers |
| `mode-manager.js` | 384 | XSLT ↔ XPath mode switching (state + UI + column collapse) |
| `xpath.js` | 810 | XPath evaluation, history, node highlighting, syntax coloring |
| `panes.js` | 203 | Word wrap, copy/clear/format pane actions |
| `files.js` | 93 | File upload/download, drag-drop |
| `share.js` | 151 | URL-encode/decode full session state |
| `modal.js` | 236 | Examples library modal, search/filter, load |
| `ui.js` | 191 | Console panel state, theme toggle, help modal |
| `examples-data.js` | 3,675 | 46 built-in examples across 5 categories |

### Dual XML Models (Critical)

Monaco has **two separate XML models** — one per mode:
- `xmlModelXslt` — used in XSLT transform mode
- `xmlModelXpath` — used in XPath evaluation mode

Always use the correct model. Mixing them corrupts cursor positions, decorations, and validation markers. `mode-manager.js` handles switching between them.

### Global State (state.js)

Key globals you'll encounter everywhere:
- `eds` — `{ xml, xslt, out }` Monaco editor instances
- `xmlModelXslt`, `xmlModelXpath` — the dual XML models
- `xpathEnabled` — boolean, current mode
- `kvData` — `{ headers: [], properties: [] }` for CPI simulation
- `saxonReady` — boolean; check before any XSLT/XPath call
- `clog_msgs`, `_wrapState`, `_xpathHistory` — console/UI state
- `xsltDebounce`, `xmlDebounce`, `saveDebounce` — 800ms debounce timers
- `_suppressNextValidation` — skip validation after programmatic editor changes

### CPI Simulation (transform.js)

The CPI `xmlns:cpi` namespace is **rewritten to `xmlns:js`** at runtime so Saxon-JS can call JavaScript interceptors. This rewriting is fragile — error line numbers shift by the injected lines. Don't modify `rewriteCPICalls()` without running the full CPI test suite.

### Session Persistence

All state auto-saves to localStorage key `xdebugx-session-v1` via `scheduleSave()` (500ms debounce). If you change the saved-state schema, bump the version key to avoid loading stale data.

## Code Conventions

- **Private functions** are prefixed with `_` (e.g., `_highlightXPath`, `_toggleXmlComment`). Public API is unprefixed.
- **HTML element IDs** use camelCase: `xmlEd`, `runBtn`, `xpathInput`
- **CSS classes** use hyphens: `.pane-bar`, `.log-line`, `.xf-error-glyph`
- Section dividers in JS: `// ════════ SECTION NAME ════════`
- Comment *why*, not *what*.

## Critical Constraints

1. **No module system** — everything is global. Avoid name collisions; check `state.js` for existing globals before adding new ones.
2. **Check `saxonReady`** before calling Saxon-JS for transforms or XPath evaluation.
3. **Validation debouncing** — use `_suppressNextValidation = true` before programmatic editor changes to avoid spurious error markers.
4. **Share URL limit** — browser URLs max ~2,000 chars; large XSLT payloads may silently fail to encode.
5. **localStorage versioning** — bump `xdebugx-session-v1` if changing the saved state schema.

## Deeper References

- `.github/docs/ARCHITECTURE.md` — data flow diagrams, design patterns, full module API
- `.github/copilot-instructions.md` — AI-specific workspace guidance, common patterns
- `.github/instructions/` — detailed feature catalog, CPI simulation deep dive, example format spec
- `.github/docs/TESTING.md` — Playwright patterns, POM design, test coverage map
