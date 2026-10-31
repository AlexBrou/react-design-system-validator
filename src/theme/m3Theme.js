// Material Design 3 theme for MUI. MUI ships Material Design 2, so this maps
// M3 color roles, type scale, shapes and component specs onto MUI.
// Every value comes from design-rules/m3.js — the same file the checkers read.

import { createTheme } from '@mui/material/styles';
import { argbFromHex, hexFromArgb, Hct, MaterialDynamicColors, SchemeTonalSpot } from '@material/material-color-utilities';
import { m3 } from '../../design-rules/m3.js';

const ROLES = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'surface', 'onSurface', 'onSurfaceVariant', 'surfaceContainerLowest', 'surfaceContainerLow',
  'surfaceContainer', 'surfaceContainerHigh', 'surfaceContainerHighest',
  'outline', 'outlineVariant', 'inverseSurface', 'inverseOnSurface', 'shadow', 'scrim',
];

function colorScheme(sourceHex) {
  const scheme = new SchemeTonalSpot(Hct.fromInt(argbFromHex(sourceHex)), false, 0);
  return Object.fromEntries(ROLES.map((r) => [r, hexFromArgb(MaterialDynamicColors[r].getArgb(scheme))]));
}

function type(role) {
  const t = m3.typeScale[role];
  return {
    fontSize: `${t.size / 16}rem`,
    lineHeight: `${t.lineHeight}px`,
    fontWeight: t.weight,
    letterSpacing: `${t.tracking}px`,
  };
}

const c = colorScheme(m3.sourceColor);
const s = m3.shape;
const typeRoles = Object.fromEntries(Object.keys(m3.typeScale).map((role) => [role, type(role)]));

export const theme = createTheme({
  spacing: m3.muiSpacingUnit,
  shape: { borderRadius: s.extraSmall },
  palette: {
    m3: c,
    primary: { main: c.primary, contrastText: c.onPrimary },
    secondary: { main: c.secondary, contrastText: c.onSecondary },
    error: { main: c.error, contrastText: c.onError },
    background: { default: c.surface, paper: c.surfaceContainerLow },
    text: { primary: c.onSurface, secondary: c.onSurfaceVariant },
    divider: c.outlineVariant,
  },
  typography: {
    fontFamily: 'Roboto, system-ui, sans-serif',
    ...typeRoles,
    // MUI components use these names internally; point them at M3 roles.
    h1: typeRoles.displayLarge,
    h2: typeRoles.displayMedium,
    h3: typeRoles.displaySmall,
    h4: typeRoles.headlineMedium,
    h5: typeRoles.headlineSmall,
    h6: typeRoles.headlineSmall,
    subtitle1: typeRoles.titleMedium,
    subtitle2: typeRoles.titleSmall,
    body1: typeRoles.bodyLarge,
    body2: typeRoles.bodyMedium,
    caption: typeRoles.bodySmall,
    overline: typeRoles.labelSmall,
    button: { ...typeRoles.labelLarge, textTransform: 'none' },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          displayLarge: 'h1', displayMedium: 'h1', displaySmall: 'h1',
          headlineLarge: 'h2', headlineMedium: 'h2', headlineSmall: 'h2',
          titleLarge: 'h3', titleMedium: 'h4', titleSmall: 'h5',
          bodyLarge: 'p', bodyMedium: 'p', bodySmall: 'p',
          labelLarge: 'span', labelMedium: 'span', labelSmall: 'span',
        },
      },
    },
    MuiButton: {
      defaultProps: { variant: 'filled', disableElevation: true },
      styleOverrides: {
        root: {
          height: 40,
          minWidth: 0,
          borderRadius: s.full,
          padding: '0 24px',
          variants: [
            { props: { variant: 'filled' }, style: { backgroundColor: c.primary, color: c.onPrimary } },
            { props: { variant: 'tonal' }, style: { backgroundColor: c.secondaryContainer, color: c.onSecondaryContainer } },
            {
              props: { variant: 'elevated' },
              style: { backgroundColor: c.surfaceContainerLow, color: c.primary, boxShadow: '0 1px 2px rgba(0,0,0,.3), 0 1px 3px 1px rgba(0,0,0,.15)' },
            },
            { props: { variant: 'outlined' }, style: { borderColor: c.outlineVariant, color: c.primary } },
            { props: { variant: 'text' }, style: { padding: '0 12px', color: c.primary } },
          ],
        },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { width: 40, height: 40, padding: 8, color: c.onSurfaceVariant } },
    },
    MuiFab: {
      defaultProps: { size: 'large' },
      styleOverrides: {
        root: { borderRadius: s.large, backgroundColor: c.primaryContainer, color: c.onPrimaryContainer, textTransform: 'none' },
        sizeSmall: { borderRadius: s.medium },
        extended: { height: 56, padding: '0 16px', ...typeRoles.labelLarge },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { height: 32, borderRadius: s.small, ...typeRoles.labelLarge },
        label: { padding: '0 16px' },
      },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: s.medium } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: { root: { backgroundColor: c.surface, color: c.onSurface } },
    },
    MuiToolbar: {
      styleOverrides: { root: { minHeight: 64, '@media (min-width:0px)': { minHeight: 64 } } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: s.extraLarge,
          minWidth: m3.dialog.minWidth,
          maxWidth: m3.dialog.maxWidth,
          backgroundColor: c.surfaceContainerHigh,
          backgroundImage: 'none',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { padding: '24px 24px 16px' } },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: '0 24px' } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: 24 } },
    },
    MuiInputBase: {
      styleOverrides: { root: typeRoles.bodyLarge, input: { lineHeight: '24px', height: 24 } },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: s.extraSmall }, input: { padding: 16 } },
    },
    MuiInputLabel: {
      styleOverrides: { root: { lineHeight: '24px' } },
    },
  },
});
