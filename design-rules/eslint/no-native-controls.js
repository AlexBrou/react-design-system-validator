// Use the design-system components, not raw HTML controls.
//   bad:  <button>Pay</button>
//   good: <Button variant="filled">Pay</Button>

const REPLACEMENTS = {
  button: 'Button / IconButton',
  input: 'TextField / Checkbox / Switch',
  select: 'TextField select / Select',
  textarea: 'TextField multiline',
  a: 'Link',
};

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow native HTML controls; use the MUI (M3-themed) components' },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        const replacement = REPLACEMENTS[node.name.name];
        if (replacement) {
          context.report({ node, message: `Native <${node.name.name}> bypasses the design system. Use ${replacement}.` });
        }
      },
    };
  },
};
