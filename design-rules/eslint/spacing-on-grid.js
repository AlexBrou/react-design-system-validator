// Spacing must use theme spacing numbers that land on the M3 4dp grid.
//   bad:  <Stack spacing={0.75}>   sx={{ mt: '13px' }}   sx={{ p: 1.3 }}
//   good: <Stack spacing={1}>      sx={{ mt: 1.5 }}      sx={{ p: 2 }}

import { m3 } from '../m3.js';
import { attributeExpression, walkObject } from './utils.js';

const SPACING_KEYS = new Set([
  'm', 'mt', 'mr', 'mb', 'ml', 'mx', 'my',
  'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'marginInline', 'marginBlock',
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'paddingInline', 'paddingBlock',
  'gap', 'rowGap', 'columnGap', 'spacing',
]);
const STEP = m3.grid / m3.muiSpacingUnit;

export default {
  meta: {
    type: 'problem',
    docs: { description: `Spacing must be a theme spacing number on the ${m3.grid}dp grid (multiple of ${STEP})` },
    schema: [],
  },
  create(context) {
    function checkValue(node) {
      if (!node) return;
      if (node.type === 'UnaryExpression' && node.operator === '-') return checkValue(node.argument);
      if (node.type === 'ObjectExpression') {
        // responsive value: { xs: 1, md: 2 }
        for (const p of node.properties) if (p.type === 'Property') checkValue(p.value);
        return;
      }
      if (node.type === 'ArrayExpression') return node.elements.forEach(checkValue);
      if (node.type !== 'Literal') return;

      if (typeof node.value === 'number') {
        if (Math.abs(node.value / STEP - Math.round(node.value / STEP)) > 1e-9) {
          context.report({
            node,
            message: `Spacing ${node.value} = ${node.value * m3.muiSpacingUnit}px is off the ${m3.grid}dp grid. Use a multiple of ${STEP}.`,
          });
        }
      } else if (typeof node.value === 'string' && /\d/.test(node.value)) {
        context.report({ node, message: `Raw spacing "${node.value}". Use a theme spacing number (1 = ${m3.muiSpacingUnit}px).` });
      }
    }

    return {
      JSXAttribute(attr) {
        const name = attr.name.name;
        const expr = attributeExpression(attr);
        if (SPACING_KEYS.has(name)) checkValue(expr);
        if (name === 'sx' || name === 'style') {
          walkObject(expr, (key, value) => {
            if (SPACING_KEYS.has(key)) checkValue(value);
          });
        }
      },
    };
  },
};
