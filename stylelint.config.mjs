// mcbcMERN/stylelint.config.js
/** @type {import('stylelint').Config} */
import stylelintOrder from 'stylelint-order'
import stylelintPrettier from 'stylelint-prettier'

export default {
  extends: [
    'stylelint-prettier/recommended', // Ensures Prettier rules are applied last
  ],
  plugins: [
    'stylelint-order', // Plugin to enforce the order of properties
    'stylelint-prettier', // Integrates Prettier with Stylelint
  ],
  rules: {
    'prettier/prettier': true, // Ensures Prettier formatting is enforced
    'order/properties-alphabetical-order': true, // Ensure properties are ordered alphabetically

    // Rule to enforce camelCase naming convention
    'selector-class-pattern': '^[a-z][a-zA-Z0-9_-]+$',

    // Disable the no-descending-specificity rule as it is not compatible with Prettier
    'no-descending-specificity': null,
  },
  ignoreFiles: [
    'node_modules/**/*',
    'dist/**/*.css',
    'TODO.md',
    'Notes.md',
    'stylelint.config.mjs',
    'tsconfig.json',
    'tsconfig.build.json',
    'tsconfig.eslint.json',
    'vite.config.ts',
    'postcss.config.cjs',
    'package.json',
    '.prettierrc',
    'commitlint.config.mjs',
  ], // Ignore specific folders
}
