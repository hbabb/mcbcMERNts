// mcbcMERN/eslint.config.js

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import typescriptEslintParser from '@typescript-eslint/parser';
import google from 'eslint-config-google';
import { extend } from 'lodash';

//** @type {import('eslint').FlatConfig[]} */

export default [
  {
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:unicorn/recommended',
      'plugin:react-hooks/recommended',
      'plugin:react-refresh/recommended',
      'plugin:js',
      'plugin:jsdoc/recommended',
      'plugin:prettier/recommended',
      'google',
    ],
    // Combine file patterns to cover both JavaScript and TypeScript files
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest', // Ensures compatibility with modern JavaScript
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
    },
    rules: {
      // Merge rules from mcbcMERN and mcbcTypescript configurations
      'react/react-in-jsx-scope': 'off',
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': [
        'error',
        {
          case: ['camelCase', 'pascalCase'],
        },
      ],
    },
    settings: {
      react: {
        version: 'detect', // Automatically detects the React version
      },
    },
  },
  {
    ignores: [
      // Combine ignore patterns from both configurations
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
]
