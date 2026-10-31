// Dev-only Vite plugin: stamps every JSX element in src/ with the place it is
// written, e.g. <Button data-source="src/screens/Checkout.jsx:37:11">.
// The rendered checks read it to report the file and line of each violation.
// Only attributes are inserted, so line numbers (and source maps) don't shift.

import path from 'node:path'
import { parseAst } from 'vite'

const FRAGMENT = /(^|\.)Fragment$/

function lineStarts(code) {
  const starts = [0]
  for (let i = 0; i < code.length; i++) if (code[i] === '\n') starts.push(i + 1)
  return starts
}

function position(starts, offset) {
  let lo = 0
  let hi = starts.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (starts[mid] <= offset) lo = mid
    else hi = mid - 1
  }
  return `${lo + 1}:${offset - starts[lo] + 1}`
}

function elementName(name) {
  if (name.type === 'JSXIdentifier') return name.name
  if (name.type === 'JSXMemberExpression') return `${elementName(name.object)}.${name.property.name}`
  return ''
}

export function designSource() {
  let root
  return {
    name: 'design-rules:source',
    apply: 'serve',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    transform(code, id) {
      const file = id.split('?')[0]
      if (!file.endsWith('.jsx') || file.includes('/node_modules/')) return null

      const rel = path.relative(root, file)
      const starts = lineStarts(code)
      const inserts = []
      ;(function walk(node) {
        if (!node || typeof node !== 'object') return
        if (Array.isArray(node)) return node.forEach(walk)
        if (node.type === 'JSXOpeningElement' && !FRAGMENT.test(elementName(node.name))) {
          inserts.push({ at: node.name.end, text: ` data-source="${rel}:${position(starts, node.start)}"` })
        }
        for (const key in node) if (key !== 'parent') walk(node[key])
      })(parseAst(code, { lang: 'jsx' }))

      if (!inserts.length) return null
      let out = code
      for (const { at, text } of inserts.sort((a, b) => b.at - a.at)) out = out.slice(0, at) + text + out.slice(at)
      return { code: out, map: null }
    },
  }
}
