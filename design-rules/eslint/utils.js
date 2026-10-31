// Small AST helpers shared by the static rules.

export function elementName(openingElement) {
  const n = openingElement.name;
  if (n.type === 'JSXIdentifier') return n.name;
  if (n.type === 'JSXMemberExpression') return n.property.name;
  return null;
}

export function getAttribute(openingElement, name) {
  return openingElement.attributes.find(
    (a) => a.type === 'JSXAttribute' && a.name.name === name,
  );
}

// The expression inside an attribute value: `x="a"` -> Literal, `x={...}` -> expression.
export function attributeExpression(attr) {
  if (!attr || !attr.value) return null;
  if (attr.value.type === 'JSXExpressionContainer') return attr.value.expression;
  return attr.value;
}

export function propertyKey(prop) {
  if (prop.type !== 'Property') return null;
  if (prop.key.type === 'Identifier') return prop.key.name;
  if (prop.key.type === 'Literal') return String(prop.key.value);
  return null;
}

// Visit every `key: value` in an object expression, recursing into nested
// objects (responsive values, `&:hover`, slotProps.paper.sx…).
export function walkObject(node, visit) {
  if (!node || node.type !== 'ObjectExpression') return;
  for (const prop of node.properties) {
    const key = propertyKey(prop);
    if (key === null) continue;
    visit(key, prop.value, prop);
    walkObject(prop.value, visit);
  }
}
