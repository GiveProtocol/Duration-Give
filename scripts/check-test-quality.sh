#!/bin/bash

echo "🔍 Checking test code quality..."

# Check for 'any' types in test files
echo "Checking for 'any' types..."
ANY_COUNT=$(grep -r ": any" src/**/*.test.* src/test-utils/**/* 2>/dev/null | grep -v "// eslint-disable" | wc -l)
if [ "$ANY_COUNT" -gt 0 ]; then
  echo "❌ Found $ANY_COUNT instances of 'any' type in test files:"
  grep -r ": any" src/**/*.test.* src/test-utils/**/* 2>/dev/null | grep -v "// eslint-disable"
  exit 1
fi

# Check for unused variables (using ESLint)
echo "Checking for unused variables..."
npm run lint -- src/**/*.test.* src/test-utils/**/* --quiet

# Check for missing JSDoc comments on exported functions
echo "Checking for missing JSDoc comments..."
MISSING_DOCS=$(grep -B1 "^export\s\+(const\|function)" src/test-utils/**/*.ts 2>/dev/null | grep -v "^\*" | grep -v "^/\*\*" | wc -l)
if [ "$MISSING_DOCS" -gt 0 ]; then
  echo "⚠️  Found exported functions without JSDoc comments"
fi

echo "✅ Test code quality checks passed!"