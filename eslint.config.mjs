const commonGlobals = {
  Array: 'readonly',
  Error: 'readonly',
  Function: 'readonly',
  JSON: 'readonly',
  Number: 'readonly',
  Object: 'readonly',
  Promise: 'readonly',
  String: 'readonly',
  TypeError: 'readonly',
  URL: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  process: 'readonly',
  setTimeout: 'readonly'
}

export default [
  {
    ignores: ['coverage/**', 'dist/**', 'node_modules/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...commonGlobals,
        __dirname: 'readonly',
        define: 'readonly',
        module: 'readonly',
        require: 'readonly',
        window: 'readonly'
      },
      sourceType: 'commonjs'
    },
    rules: {
      'no-constant-binary-expression': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }]
    }
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: commonGlobals,
      sourceType: 'module'
    },
    rules: {
      'no-constant-binary-expression': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }]
    }
  }
]
