// Material Design 3 values used by the theme (src/theme) AND by every checker
// in this folder. Change a value here and both the app and the rules follow.
//
// Sources: the official M3 design tokens published in material-web
//   https://github.com/material-components/material-web/tree/main/tokens/versions/v0_192
// and the M3 guidelines at https://m3.material.io.
//
// Keep this file plain data (no functions): it is serialized and sent into the
// browser for the rendered checks.

export const m3 = {
  sourceColor: '#6750A4',

  // M3 lays everything out on a 4dp grid. MUI's theme.spacing(1) is 8px, so
  // `spacing`, `m`, `p`, `gap`… values must be multiples of 0.5.
  grid: 4,
  muiSpacingUnit: 8,

  // md-sys-typescale (px). weight 400 = regular, 500 = medium.
  typeScale: {
    displayLarge: { size: 57, lineHeight: 64, weight: 400, tracking: -0.25 },
    displayMedium: { size: 45, lineHeight: 52, weight: 400, tracking: 0 },
    displaySmall: { size: 36, lineHeight: 44, weight: 400, tracking: 0 },
    headlineLarge: { size: 32, lineHeight: 40, weight: 400, tracking: 0 },
    headlineMedium: { size: 28, lineHeight: 36, weight: 400, tracking: 0 },
    headlineSmall: { size: 24, lineHeight: 32, weight: 400, tracking: 0 },
    titleLarge: { size: 22, lineHeight: 28, weight: 400, tracking: 0 },
    titleMedium: { size: 16, lineHeight: 24, weight: 500, tracking: 0.15 },
    titleSmall: { size: 14, lineHeight: 20, weight: 500, tracking: 0.1 },
    bodyLarge: { size: 16, lineHeight: 24, weight: 400, tracking: 0.5 },
    bodyMedium: { size: 14, lineHeight: 20, weight: 400, tracking: 0.25 },
    bodySmall: { size: 12, lineHeight: 16, weight: 400, tracking: 0.4 },
    labelLarge: { size: 14, lineHeight: 20, weight: 500, tracking: 0.1 },
    labelMedium: { size: 12, lineHeight: 16, weight: 500, tracking: 0.5 },
    labelSmall: { size: 11, lineHeight: 16, weight: 500, tracking: 0.5 },
  },

  // md-sys-shape (px)
  shape: {
    none: 0,
    extraSmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    extraLarge: 28,
    full: 9999,
  },

  // md-comp-* sizes and shapes, keyed by the MUI class that renders them.
  // `height` / `width` list the allowed px values; `shape` is a key of `shape`
  // above, or a map from height to shape key when it depends on the size.
  components: {
    button: { label: 'Button', selector: '.MuiButton-root', height: [40], shape: 'full' },
    iconButton: { label: 'Icon button', selector: '.MuiIconButton-root', height: [40], width: [40], shape: 'full' },
    fab: {
      label: 'FAB',
      selector: '.MuiFab-root:not(.MuiFab-extended)',
      height: [40, 56, 96],
      shape: { 40: 'medium', 56: 'large', 96: 'extraLarge' },
    },
    extendedFab: { label: 'Extended FAB', selector: '.MuiFab-extended', height: [56], shape: 'large' },
    chip: { label: 'Chip', selector: '.MuiChip-root', height: [32], shape: 'small' },
    card: { label: 'Card', selector: '.MuiCard-root', shape: 'medium' },
    dialog: { label: 'Dialog', selector: '.MuiDialog-paper', shape: 'extraLarge' },
    textField: { label: 'Text field', selector: '.MuiOutlinedInput-root', height: [56], shape: 'extraSmall' },
    topAppBar: { label: 'Top app bar', selector: '.MuiAppBar-root .MuiToolbar-root', height: [64] },
  },

  buttons: {
    // Horizontal space between two adjacent buttons.
    gap: 8,
    // Buttons further apart than this are not considered "adjacent".
    adjacencyThreshold: 32,
    // Max filled buttons in one group of adjacent buttons.
    maxFilledPerGroup: 1,
  },

  fab: {
    maxPerScreen: 1,
  },

  dialog: {
    minWidth: 280,
    maxWidth: 560,
    padding: 24,
    actionsAlign: 'end',
  },

  accessibility: {
    // Every interactive element needs a 48x48dp touch target that does not
    // overlap another element's target.
    touchTarget: 48,
  },

  // Window size classes and their horizontal margins.
  windowClasses: [
    { name: 'compact', maxWidth: 599, margin: 16 },
    { name: 'medium', maxWidth: 839, margin: 24 },
    { name: 'expanded', maxWidth: null, margin: 24 },
  ],

  // Allowed prop values on MUI components (checked statically by ESLint).
  allowedProps: {
    Typography: {
      variant: [
        'displayLarge', 'displayMedium', 'displaySmall',
        'headlineLarge', 'headlineMedium', 'headlineSmall',
        'titleLarge', 'titleMedium', 'titleSmall',
        'bodyLarge', 'bodyMedium', 'bodySmall',
        'labelLarge', 'labelMedium', 'labelSmall',
      ],
    },
    // M3 button types. MUI's "contained" is replaced by filled / tonal / elevated.
    Button: { variant: ['filled', 'tonal', 'elevated', 'outlined', 'text'] },
    // M3 FABs are 40 (small) and 56 (large); MUI's 48px "medium" does not exist in M3.
    Fab: { size: ['small', 'large'] },
    // M3 text fields are always 56dp tall.
    TextField: { size: ['medium'] },
  },

  // Components whose spec-defined dimensions/typography must not be
  // overridden via `sx` / `style`.
  specLockedProps: ['height', 'minHeight', 'width', 'borderRadius', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing'],
  specLockedComponents: ['Button', 'IconButton', 'Fab', 'Chip', 'Card', 'Dialog', 'TextField', 'AppBar', 'Toolbar'],

  // Parents allowed to hold two or more sibling buttons.
  buttonGroupParents: ['Stack', 'DialogActions', 'CardActions'],
};
