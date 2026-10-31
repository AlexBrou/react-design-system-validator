// Only M3 variants/sizes may be used (table in m3.js -> allowedProps).
//   bad:  <Typography variant="h5">   <Button variant="contained">   <Fab size="medium">
//   good: <Typography variant="headlineSmall">   <Button variant="filled">   <Fab size="large">

import { m3 } from '../m3.js';
import { attributeExpression, elementName } from './utils.js';

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Restrict component props to the M3 values listed in m3.allowedProps' },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const component = elementName(node);
        const rules = m3.allowedProps[component];
        if (!rules) return;
        for (const attr of node.attributes) {
          if (attr.type !== 'JSXAttribute') continue;
          const allowed = rules[attr.name.name];
          const expr = attributeExpression(attr);
          if (!allowed || !expr || expr.type !== 'Literal') continue;
          if (!allowed.includes(expr.value)) {
            context.report({
              node: attr,
              message: `<${component} ${attr.name.name}="${expr.value}"> is not an M3 value. Allowed: ${allowed.join(', ')}.`,
            });
          }
        }
      },
    };
  },
};
