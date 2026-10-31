# Design rules: instructions for AI agents

This project's UI must follow Material Design 3. The rules are enforced by the
scripts in `design-rules/` (values in `design-rules/m3.js`).

## Building screens

- Use MUI components (`@mui/material`). The theme maps them to M3. Never use
  native `<button>`, `<input>`, `<a>`, and so on.
- Typography variants: `displayLarge|Medium|Small`, `headline…`, `title…`, `body…`, `label…`
  (not `h1`–`h6`, `body1`, `caption`…).
- Button variants: `filled` (default), `tonal`, `elevated`, `outlined`, `text`.
  At most one `filled` button per group.
- Put two or more buttons side by side in `<Stack direction="row" spacing={1}>`,
  `DialogActions` or `CardActions`.
- Colors come from the theme (`primary.main`, `text.secondary`, `m3.surfaceContainer`…).
  Spacing values are theme numbers in steps of 0.5 (`p: 2`, `spacing={1.5}`), never px strings.
- Don't set `height`, `borderRadius` or font properties on M3 components via `sx`,
  `style` or CSS files.
- Register every new screen in `src/screens/registry.js`, or it won't be checked.

## Checking your work

After creating or changing a screen, run:

```
npm run design:check:llm               # full check (about 30s)
npm run design:check:llm -- --static   # code-only check (seconds), useful while iterating
```

Output is one line per violation, grouped by file:
`<line>:<col> <rule>: <message> [<viewports> only]`. Exit code 0 = clean,
1 = violations, 2 = the check itself failed (an ERROR line says why).
Repeat until it prints `design:check OK`.

If the design-check Stop hook is on (`npm run design:hook:status`), it runs the
code-only check when you finish, on the files you changed in this session. If it
reports violations, fix them in the code before finishing.
Violations in files you didn't touch are not your task unless the user asks.

## Don't

- Don't edit anything in `design-rules/`, add `eslint-disable` comments, add
  `data-design-ignore` attributes, or turn off the design-check hook to make the check pass. If a rule seems wrong
  for a case, stop and ask the user.
