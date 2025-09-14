#!/bin/bash

# Fix React imports in test files
echo "Fixing React imports in test files..."
find src -name "*.test.tsx" -o -name "*.test.ts" | while read file; do
  # Check if file uses React JSX
  if grep -q "<\w\+\s*" "$file" 2>/dev/null; then
    # Check if React is already imported
    if ! grep -q "^import React from 'react'" "$file"; then
      # Check if there's an existing React import to replace
      if grep -q "^import _React from 'react'" "$file"; then
        sed -i "s/^import _React from 'react'/import React from 'react'/" "$file"
      else
        # Add React import at the beginning after any existing imports
        sed -i '1s/^/import React from '\''react'\'';\n/' "$file"
      fi
    fi
  fi
done

# Fix jest imports in test files
echo "Fixing jest imports in test files..."
find src -name "*.test.tsx" -o -name "*.test.ts" | while read file; do
  # Check if file uses jest
  if grep -q "jest\." "$file" 2>/dev/null; then
    # Check if jest is already imported from @jest/globals
    if ! grep -q "import.*{.*jest.*}.*from.*'@jest/globals'" "$file"; then
      # Add jest import after React import or at the beginning
      if grep -q "^import React from 'react'" "$file"; then
        sed -i "/^import React from 'react'/a import { jest } from '@jest/globals';" "$file"
      else
        sed -i '1s/^/import { jest } from '\''@jest\/globals'\'';\n/' "$file"
      fi
    fi
  fi
done

# Fix mockSetup.tsx to import jest
echo "Fixing mockSetup.tsx..."
if ! grep -q "import { jest } from '@jest/globals'" src/test-utils/mockSetup.tsx; then
  sed -i '1s/^/import { jest } from '\''@jest\/globals'\'';\n/' src/test-utils/mockSetup.tsx
fi

echo "Import fixes completed!"