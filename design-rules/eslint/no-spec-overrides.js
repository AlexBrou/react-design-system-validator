// Spec-defined dimensions, shapes and typography of M3 components come from
// the theme and must not be overridden per screen.
//   bad:  <Button sx={{ borderRadius: 1, height: 36 }}>
//   good: <Button>   (or change the token in m3.js for everyone)

import { m3 } from '../m3.js';
import { elementName, walkObject } from './utils.js';

const LOCKED = new Set(m3.specLockedProps);
const STYLE_ATTRS = new Set(['sx', 'style', 'PaperProps', 'slotProps']);

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow overriding M3 spec values (size, shape, type) on design-system components' },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const component = elementName(node);
        if (!m3.specLockedComponents.includes(component)) return;
        for (const attr of node.attributes) {
          if (attr.type !== 'JSXAttribute' || !STYLE_ATTRS.has(attr.name.name)) continue;
          if (attr.value?.type !== 'JSXExpressionContainer') continue;
          walkObject(attr.value.expression, (key, _value, prop) => {
            if (LOCKED.has(key)) {
              context.report({
                node: prop,
                message: `"${key}" of <${component}> is defined by the M3 spec. Don't override it per screen; change design-rules/m3.js instead.`,
              });
            }
          });
        }
      },
    };
  },
};
