import globals from 'globals'
import { designRulesConfig } from './design-rules/eslint/index.js'

export default [
  { ignores: ['dist', '.design-report'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // Material Design 3 rules — see design-rules/
  designRulesConfig,
]
