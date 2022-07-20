module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    'no-var': [ 'error' ],
    'prefer-const': 'warn',
    'eol-last': [ 'error', 'always' ],
    'dot-location': [ 'error', 'property' ],

    'no-trailing-spaces': 'error',

    'quotes': [ 'error', 'single' ],

    'semi': [ 'error', 'never' ],

    'operator-linebreak': [ 'error', 'before' ],
  },
};
