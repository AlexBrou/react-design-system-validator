# React Design System Validator

> A React project that runs an automatic design system validator (using Material Design 3).

![React Design System Validator: design rules that run like tests, for apps built with AI agents](docs/images/banner.svg)

**Design-system rules that run like tests.** This project checks that a React + MUI app actually follows
[Material Design 3](https://m3.material.io): spacing, sizes, corner shapes, type scale, touch targets,
dialog layout and more. Every check is a plain script. No AI judges the result, so the same code
always gives the same answer.

It is built for designers who create apps directly with AI coding agents (such as Claude Code)
instead of drawing them in Figma. The agent writes the screens, the validator tells it exactly
what breaks the design system and where, and the agent fixes it.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

| A screen that follows M3 | A screen that breaks it, with every violation outlined |
|---|---|
| <img src="docs/images/compliant-screen.png" width="300" alt="Settings screen following Material Design 3"> | <img src="docs/images/violations-highlighted.png" width="300" alt="Checkout screen with design violations outlined in red"> |

```
$ npm run design:check:llm
design:check FAIL — 33 violations in 2 files. Fix the code; do not edit design-rules/ or add ignores.
src/screens/Checkout.jsx
  21:13 touch-target: IconButton "Decrease" and IconButton "Increase" have overlapping 48x48 touch targets (8px overlap)
  37:19 allowed-prop-values: <Button variant="contained"> is not an M3 value. Allowed: filled, tonal, elevated, outlined, text.
  38:11 component-size: Button "Pay later" is 36px tall; M3 Button allows 40px
  45:7 single-fab: 2 FABs on screen; M3 allows 1 (the FAB is the screen's single primary action)
  …
```

## How it works

The rules check the app in two layers, because some rules can be decided by reading the code
and others only by looking at the rendered screen.

| | Static layer | Rendered layer |
|---|---|---|
| Tool | Custom [ESLint](https://eslint.org) rules | [Playwright](https://playwright.dev) opens every screen in Chromium and measures it |
| Looks at | The JSX source | Real pixels and computed styles |
| Speed | Instant, shown in the editor | About 30s for all screens |
| Catches | Wrong variants, hardcoded colors, off-grid spacing values, native `<button>`s, spec overrides via `sx` | Actual gaps between buttons, component sizes, corner radii, type scale, touch-target overlap, dialog width, screen-edge margins |

The two layers complement each other. The demo screen `Promo.jsx` passes ESLint, because its
violations are in a CSS file, but fails five rendered checks.

All Material Design 3 values live in **one file**, [`design-rules/m3.js`](design-rules/m3.js).
The MUI theme and both layers of checks read it, so changing a value updates the app and the rules together.

Every rendered violation points to the **file and line** of the JSX that produced it. A small
dev-only Vite plugin tags each element with its source location. In the HTML report, each failing
check shows the location, the offending code, and a screenshot with the problem outlined.

<img src="docs/images/html-report.png" width="700" alt="Playwright HTML report showing a violation with its source file and line">

## Quick start

Requires **Node.js 22 or later**. Clone the repository, then:

```bash
cd react-design-system-validator
npm install
npx playwright install chromium   # browser used by the rendered checks
npm run dev                       # open http://localhost:5173 to browse the demo screens
npm run design:check              # run all checks
```

| Command | What it does |
|---|---|
| `npm run design:check` | Both layers, full output |
| `npm run design:lint` | Static layer only (also shown as squiggles in your editor) |
| `npm run design:render` | Rendered layer only |
| `npm run design:report` | Open the HTML report with screenshots and source locations |
| `npm run design:check:llm` | Both layers, compact output for AI agents and CI ([details](#working-with-ai-agents)) |
| `npm run design:hook:on` / `off` / `status` | Turn the automatic check for Claude Code on or off ([details](#turning-the-automatic-check-on-and-off)) |

The demo app has five screens. `settings`, `product` and `confirm-dialog` follow M3 and pass every check.
`checkout` and `promo` break the rules on purpose, to show what gets caught.

## The rules

**Static (ESLint):**

| Rule | Enforces |
|---|---|
| `m3/allowed-prop-values` | Only M3 variants: type roles (`titleLarge`, `bodyMedium`…), Button `filled/tonal/elevated/outlined/text`, Fab `small/large`, 56dp text fields |
| `m3/buttons-in-group` | Sibling buttons must be in a `Stack`, `DialogActions` or `CardActions` |
| `m3/no-native-controls` | No raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<a>` |
| `m3/no-raw-colors` | No hex, rgb, hsl or named colors; use theme color roles |
| `m3/no-spec-overrides` | No per-screen overrides of height, corner radius or typography on M3 components |
| `m3/spacing-on-grid` | Spacing values sit on the 4dp grid |

**Rendered (Playwright), at a compact (412px) and an expanded (1280px) window size:**

| Rule | Measures |
|---|---|
| `button-gap` | Adjacent buttons are exactly 8dp apart |
| `one-filled-button-per-group` | At most one filled button per group of buttons |
| `component-size` | Button 40, FAB 40/56/96, chip 32, text field 56, top app bar 64… |
| `component-shape` | Corner radius matches the M3 shape scale |
| `type-scale` | All visible text uses an M3 type role |
| `touch-target` | 48×48dp touch targets don't overlap |
| `single-fab` | At most one FAB per screen |
| `dialog-layout` | Dialogs are 280–560dp wide, with 24dp padding and end-aligned actions |
| `spacing-grid` | Padding, gaps and margins are multiples of 4dp |
| `window-margins` | Content keeps 16dp (compact) or 24dp (medium, expanded) from the screen edge |

Values come from Google's official M3 design tokens, published in
[material-components/material-web](https://github.com/material-components/material-web/tree/main/tokens),
and from the M3 guidelines.

## Working with AI agents

The project gives AI agents three things:

1. **Instructions.** [`design-rules/agent-instructions.md`](design-rules/agent-instructions.md) tells the agent
   which components to use, to run the check until it passes, and **not** to make the check pass by editing
   the rules or adding ignores. Claude Code loads it automatically through the root [`CLAUDE.md`](CLAUDE.md).
2. **Compact output.** `npm run design:check:llm` prints one line per violation, grouped by file, using about
   10× fewer tokens than the full test output. `-- --static` runs only the fast code checks, and `-- --json`
   returns the same data as JSON.
3. **An automatic check (optional, off by default).** A Claude Code Stop hook runs the code checks whenever the
   agent tries to finish. If files it changed in this session have violations, the hook sends them back and
   the agent fixes them before handing back to you. It never blocks on violations in files the agent didn't
   touch, and it blocks at most once in a row, so it can't loop forever.

### Turning the automatic check on and off

```bash
npm run design:hook:on                # turn on for everyone (writes .claude/settings.json, commit it to share)
npm run design:hook:on -- --local     # turn on just for you (.claude/settings.local.json, not committed)
npm run design:hook:on -- --rendered  # also run the browser checks on every finish (about 30s each time)
npm run design:hook:off               # turn off (add -- --local to turn off the personal one)
npm run design:hook:status            # show where it is on
```

These commands only add or remove the hook's own entry; any other Claude Code settings are kept.
If Claude Code is already open, run `/hooks` once or restart it so it picks up the change.
You can also review or disable any hook from the `/hooks` menu inside Claude Code.

## Project structure

```
design-rules/               ← everything about the rules lives here
  m3.js                     ← the Material Design 3 values (single source of truth)
  eslint/                   ← static rules
  rendered/                 ← rendered rules + Playwright runner
  playwright.config.js      ← which window sizes to check
  vite-plugin-source.js     ← tags JSX with file:line for the reports (dev only)
  check.js                  ← compact runner for AI agents and CI
  claude-stop-hook.js       ← Claude Code hook
  hook-toggle.js            ← turns the hook on/off (npm run design:hook:on|off)
  agent-instructions.md     ← instructions for AI agents
  README.md                 ← detailed documentation
src/
  theme/m3Theme.js          ← maps M3 onto MUI (which implements Material Design 2)
  screens/                  ← demo screens + registry.js (the list of screens to check)
.claude/settings.json       ← Claude Code project settings (the hook goes here when turned on)
CLAUDE.md                   ← loads the agent instructions in Claude Code
```

## Customizing

- **Change a value** (for example, an 8dp → 12dp gap between buttons): edit `design-rules/m3.js`.
- **Add a rule:** add a file to `design-rules/eslint/` or `design-rules/rendered/` and register it in that folder's `index.js`.
- **Add a screen:** add it to `src/screens/registry.js`, and it is checked automatically.
- **Make an exception:** `// eslint-disable-next-line m3/<rule>` in code, or `data-design-ignore="<rule>"` on an element.

To add the validator to an existing React + MUI project, follow
[Using this in another project](design-rules/README.md#using-this-in-another-project).
The full documentation is in [`design-rules/README.md`](design-rules/README.md).

## Limitations

- **MUI implements Material Design 2.** The included theme maps M3 onto it as closely as possible.
- **The rules use the standard M3 token set.** The extra sizes from the 2025 "M3 Expressive" update are not included yet.
- **CSS files are not checked statically.** The rendered layer still catches their effects, and
  [Stylelint](https://stylelint.io) would cover them statically.
- **Color contrast is not checked.** Adding [axe-core](https://github.com/dequelabs/axe-core) would cover it.

## License

[MIT](LICENSE)

This is an independent project, not affiliated with or endorsed by Google or MUI.
Material Design is a trademark of Google LLC.
