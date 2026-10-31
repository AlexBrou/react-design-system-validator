// Colors must come from the theme (M3 color roles), never hardcoded.
//   bad:  sx={{ color: '#ff0000' }}   sx={{ bgcolor: 'red' }}
//   good: sx={{ color: 'error.main' }}   sx={{ bgcolor: 'm3.secondaryContainer' }}

import { propertyKey } from './utils.js';

const RAW_COLOR = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|\b(?:rgb|hsl)a?\s*\(/i;
const COLOR_KEYS = new Set(['color', 'bgcolor', 'backgroundColor', 'background', 'borderColor', 'fill', 'stroke', 'outlineColor']);
const NAMED_COLORS = new Set(['red', 'blue', 'green', 'black', 'white', 'gray', 'grey', 'orange', 'yellow', 'purple', 'pink', 'brown', 'cyan', 'magenta']);

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow hardcoded colors; use M3 color roles from the theme' },
    schema: [],
  },
  create(context) {
    function check(node, text) {
      if (RAW_COLOR.test(text)) {
        context.report({ node, message: `Hardcoded color "${text}". Use an M3 color role from the theme (e.g. "primary.main", "m3.surfaceContainer").` });
      }
    }
    return {
      Literal(node) {
        if (typeof node.value === 'string') check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
      Property(node) {
        const key = propertyKey(node);
        if (COLOR_KEYS.has(key) && node.value.type === 'Literal' && NAMED_COLORS.has(String(node.value.value).toLowerCase())) {
          context.report({ node: node.value, message: `Named color "${node.value.value}". Use an M3 color role from the theme.` });
        }
      },
    };
  },
};
