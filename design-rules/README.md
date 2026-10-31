# Design rules (Material Design 3)

All the design-system rules for this app live in this folder. They are plain
scripts, so every check is deterministic and runs in CI like a test suite.

```
npm run design:check    # both layers
npm run design:lint     # static only (fast, also shows in the editor via ESLint)
npm run design:render   # rendered only (opens every screen in a browser)
npm run design:report   # open the HTML report with highlighted screenshots
npm run design:check:llm             # compact output for AI agents/CI: one line per violation
npm run design:check:llm -- --static # same, code checks only (seconds)
npm run design:check:llm -- --json   # same data as JSON
```

## Working with AI agents

Designers who build screens with an AI agent (Claude Code or similar) get two safeguards.

### 1. Instructions: `agent-instructions.md`

This file tells the agent which components and variants to use, to register new
screens, to run the check until it passes, and **not** to make the check pass by
editing `design-rules/`, adding `eslint-disable`, or adding `data-design-ignore`. If a
rule seems wrong, the agent should ask the user.

Claude Code loads it through the project's root `CLAUDE.md`, which contains one line:

```
@design-rules/agent-instructions.md
```

It is imported from the root because Claude Code reads a `CLAUDE.md` inside a
subfolder only when it opens files there, and agents mostly work in `src/`. Other
agents can be pointed at the same file.

### 2. Compact output: `check.js`

`npm run design:check:llm` prints one line per violation, grouped by file, with each
violation listed once across viewports. That is about 10× fewer tokens than the
Playwright output. A clean run prints a single line.

```
design:check FAIL — 33 violations in 2 files. Fix the code; do not edit design-rules/ or add ignores.
src/screens/Checkout.jsx
  12:19 allowed-prop-values: <Typography variant="h5"> is not an M3 value. Allowed: …
  38:11 component-size: Button "Pay later" is 36px tall; M3 Button allows 40px
  42:7 window-margins: Fab "Help" is 16px from the screen edge; expanded windows need 24px [expanded only]
```

| Option | Effect |
|---|---|
| `-- --static` | Code checks only (seconds) |
| `-- --json` | Same data as JSON: `{ ok, violations: [{ file, line, col, rule, message, screen?, viewports? }], errors }` |
| `-- --since <epoch ms>` | Only violations in files modified since then |

Exit codes: `0` = clean, `1` = violations, `2` = the check itself failed (an `ERROR` line says why).

### 3. Automatic check: `claude-stop-hook.js` (off by default)

A Claude Code **Stop hook** that you turn on with `npm run design:hook:on`. When the
agent tries to finish, the hook:

1. Runs the code checks (`check.js --static`), takes 2–3s.
2. Keeps only violations in files **modified during this session**. Existing
   violations elsewhere (like the demo `Checkout`/`Promo` screens) never block
   unrelated work.
3. If there are any, it **blocks the stop** and gives the agent the compact list,
   so the agent fixes them before handing back.
4. It blocks **at most once in a row**. If violations remain after the agent's
   attempt, the agent may stop, and the user sees
   `Design check: FAIL — N violations… Run npm run design:check:llm for details.`
   This prevents endless loops when a rule needs a human decision.

#### Turning it on and off

```bash
npm run design:hook:on                # on for everyone: .claude/settings.json (commit it to share)
npm run design:hook:on -- --local     # on just for you: .claude/settings.local.json (not committed)
npm run design:hook:on -- --rendered  # also run the rendered checks on every stop (about 30s each)
npm run design:hook:off               # off (add -- --local for the personal one)
npm run design:hook:status            # where it is on
```

`hook-toggle.js` only adds or removes the entry whose command runs
`claude-stop-hook.js`; other settings and hooks in the file are kept. If Claude Code
is already open, run `/hooks` once or restart it so it picks up the change. The
`/hooks` menu in Claude Code also lets you review or disable it by hand.

**When to leave it off:** while you work on files that break the rules on purpose
(like the demo screens). Every stop in that session would be blocked once.
Turn it on when designers start building screens with an agent.

To add the hook by hand, put this in `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [{ "hooks": [{
      "type": "command",
      "command": "node \"$CLAUDE_PROJECT_DIR/design-rules/claude-stop-hook.js\"",
      "timeout": 90,
      "statusMessage": "Checking design rules…"
    }] }]
  }
}
```

## Using this in another project

1. Copy the `design-rules/` folder to the project root.
2. `npm i -D eslint globals @playwright/test && npx playwright install chromium`
3. Spread `designRulesConfig` from `design-rules/eslint/index.js` into `eslint.config.js`.
4. Add `designSource()` from `design-rules/vite-plugin-source.js` to the Vite plugins.
5. Export your screens from `src/screens/registry.js` (`{ id, load }`), routed at `/#/<id>`,
   each rendered inside `<div data-screen={id}>`. Or adapt `rendered/rendered.spec.js` to your routes.
6. Copy the `design:*` scripts from this `package.json`.
7. Add `@design-rules/agent-instructions.md` to the project's `CLAUDE.md`.
8. Optional: turn on the Claude Code hook with `npm run design:hook:on`
   (it merges into any existing `.claude/settings.json`).

## Layout

```
design-rules/
  m3.js                 ← the M3 values. The theme (src/theme) and every rule read this file.
  eslint/               ← static rules: read the source code
  rendered/             ← rendered rules: measure the real page in Chromium
  playwright.config.js  ← which viewports (window size classes) to check
  vite-plugin-source.js ← dev-only: tags JSX elements with their file:line for the reports
  check.js              ← compact runner for AI agents/CI (npm run design:check:llm)
  claude-stop-hook.js   ← Claude Code hook: checks the agent's work before it finishes
  hook-toggle.js        ← turns that hook on/off (npm run design:hook:on|off|status)
  agent-instructions.md ← instructions AI agents follow (imported by /CLAUDE.md)
```

## Where a violation comes from

Static violations come with file and line from ESLint itself. For rendered ones,
`vite-plugin-source.js` (dev server only, registered in `/vite.config.js`) adds
`data-source="src/screens/Checkout.jsx:38:11"` to every JSX element in `src/`.
Each violation reports the nearest element with that attribute, in the
terminal (`at src/…:38:11`, clickable in VS Code) and in the HTML report
(Annotations box plus a code snippet of the line).

The location is the JSX element that rendered the offending DOM node. If the
cause is in a CSS file (see `Promo.jsx`), it points to the element that uses
that class, not to the CSS rule. If the node comes from your own wrapper
component, it points to the JSX inside that wrapper, unless the wrapper passes
the `data-source` prop through to its root.

## Two layers, and why

| | Static (`eslint/`) | Rendered (`rendered/`) |
|---|---|---|
| Looks at | JSX source | Pixels and computed styles in a real browser |
| Speed | Instant, in the editor | About 30s for all screens |
| Catches | Wrong variants, raw colors, off-grid spacing values, sibling buttons without a Stack, spec overrides via `sx`, native `<button>` | Real gaps, sizes, corner radii, type scale, touch-target overlap, dialog layout, window margins, number of FABs |
| Blind to | CSS files, computed values, composed components, layout | Intent (why something is wrong in the code) |

`src/screens/Promo.jsx` shows why you need both: it passes ESLint, but its CSS
file breaks five rendered rules.

## Static rules (`eslint/`)

| Rule | What it enforces |
|---|---|
| `m3/allowed-prop-values` | Only M3 variants/sizes (`m3.allowedProps`): Typography roles, Button `filled/tonal/elevated/outlined/text`, Fab `small/large`, TextField 56dp |
| `m3/buttons-in-group` | Sibling `<Button>`s must be inside `Stack` / `DialogActions` / `CardActions` |
| `m3/no-native-controls` | No `<button>`, `<input>`, `<select>`, `<textarea>`, `<a>` |
| `m3/no-raw-colors` | No hex / rgb / hsl / named colors; use theme color roles |
| `m3/no-spec-overrides` | No `sx`/`style` overrides of height, radius, type… on M3 components |
| `m3/spacing-on-grid` | Spacing values are theme numbers on the 4dp grid |

## Rendered rules (`rendered/`)

Every rule runs on every screen in `src/screens/registry.js`, at each viewport
in `playwright.config.js` (compact 412px, expanded 1280px).

| Rule | What it measures |
|---|---|
| `button-gap` | Horizontally adjacent buttons are exactly 8px apart |
| `one-filled-button-per-group` | At most one filled button per group of adjacent buttons |
| `component-size` | Heights/widths from `m3.components` (Button 40, FAB 40/56/96, Chip 32, TextField 56…) |
| `component-shape` | Corner radius from `m3.components` + `m3.shape` |
| `type-scale` | Every visible text matches an M3 type role (size + line height + weight) |
| `touch-target` | 48x48 touch targets don't overlap |
| `single-fab` | At most one FAB per screen |
| `dialog-layout` | Dialog 280–560px wide, 24px side padding, end-aligned actions |
| `spacing-grid` | Layout padding, gaps and the margins between items are multiples of 4px |
| `window-margins` | Content keeps 16px (compact) / 24px (medium, expanded) from the screen edge |

## Changing things

- **Change a value** (for example, button gap 8 → 12): edit `m3.js`. The theme and both layers update.
- **Add a static rule:** add a file in `eslint/` (a standard ESLint rule) and register it in `eslint/index.js`.
- **Add a rendered rule:** add a file in `rendered/` that exports
  `{ id, description, check(m3, h) { return [{ el, message }] } }` and list it in `rendered/index.js`.
  `check` is sent into the browser, so it may only use `m3` and the helpers `h` (`rendered/helpers.js`).
- **Add a screen:** add it to `src/screens/registry.js`. It is checked automatically.
- **Add a viewport:** add a project in `playwright.config.js`.

## Exceptions

- Static: `// eslint-disable-next-line m3/no-raw-colors -- brand logo color`
- Rendered: put `data-design-ignore="button-gap type-scale"` on an element; it and its subtree are skipped for those rules.

## Sources

Values come from the official M3 design tokens
(`material-components/material-web`, `tokens/versions/v0_192`: `md-sys-typescale`,
`md-sys-shape`, `md-comp-*`) and the material-web dialog and button implementations,
plus the M3 guidelines at m3.material.io (touch targets, window size classes).
MUI itself implements Material Design 2. `src/theme/m3Theme.js` maps M3 onto it.
