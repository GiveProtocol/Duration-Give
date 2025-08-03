module.exports = {
  extends: ['./.eslintrc.js'],
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/test-utils/**/*'],
      rules: {
        // Prevent 'any' type usage
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-unsafe-return': 'error',
        
        // Prevent unused variables
        '@typescript-eslint/no-unused-vars': ['error', {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }],
        
        // Require JSDoc comments
        'jsdoc/require-jsdoc': ['warn', {
          require: {
            FunctionDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ClassExpression: true
          },
          contexts: [
            'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression',
            'ExportDefaultDeclaration > ArrowFunctionExpression'
          ]
        }],
        
        // Enforce consistent type imports
        '@typescript-eslint/consistent-type-imports': ['error', {
          prefer: 'type-imports',
          disallowTypeAnnotations: true
        }]
      }
    }
  ]
};