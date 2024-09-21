import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import typescriptEslintParser from '@typescript-eslint/parser';
import googleConfig from 'eslint-config-google';
import prettierConfig from 'eslint-config-prettier';

//** @type {import('eslint').FlatConfig[]} */

export default [
  js.configs.recommended,
  googleConfig,
  prettierConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptEslintParser,
      globals: globals.browser,
    },
    plugins: {
      react: eslintPluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': eslintPluginJsxA11y,
      import: eslintPluginImport,
      unicorn: eslintPluginUnicorn,
      // Removed tsdoc and jsdoc plugins to avoid any validation of comments
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': ['error', { case: ['camelCase', 'pascalCase'] }],
      // Removed any rules related to TSDoc or JSDoc
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'stylelint.config.mjs',
      'tsconfig.json',
      'tsconfig.build.json',
      'tsconfig.eslint.json',
      'vite.config.ts',
      'postcss.config.cjs',
      'package.json',
      '.prettierrc',
      'commitlint.config.mjs',
    ],
  },
];
