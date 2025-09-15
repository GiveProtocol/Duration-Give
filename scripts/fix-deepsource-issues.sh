#!/bin/bash

echo "Fixing DeepSource issues..."

# 1. Remove unused React imports from non-JSX test files
echo "Removing unused React imports from non-JSX test files..."
files=(
  "src/utils/__tests__/volunteer.test.ts"
  "src/utils/__tests__/validation.test.ts"
  "src/utils/__tests__/errors.test.ts"
  "src/types/__tests__/volunteer.test.ts"
  "src/test-utils/__tests__/types.test.ts"
  "src/test-utils/__tests__/templates.test.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # Remove the React import line
    sed -i '/^import React from '\''react'\'';$/d' "$file"
  fi
done

# 2. Fix duplicate React imports
echo "Fixing duplicate React imports..."
duplicate_files=(
  "src/contexts/__tests__/AuthContext.test.tsx"
  "src/components/donor/__tests__/ScheduledDonations.test.tsx"
  "src/components/contribution/__tests__/GlobalContributions.test.tsx"
  "src/components/contribution/__tests__/ContributionFilters.test.tsx"
  "src/components/charity/__tests__/SearchBar.test.tsx"
  "src/components/charity/__tests__/OpportunityManagement.test.tsx"
  "src/components/auth/__tests__/ForgotCredentials.test.tsx"
  "src/components/auth/__tests__/DonorLogin.test.tsx"
  "src/components/auth/__tests__/CharityVettingForm.test.tsx"
  "src/components/auth/__tests__/CharityLogin.test.tsx"
)

for file in "${duplicate_files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # Remove the duplicate React import (the one with useCallback or without jest)
    sed -i '/^import React.*\/\/ eslint-disable-line no-unused-vars$/d' "$file"
    # Also remove standalone duplicate React imports after jest import
    sed -i '3s/^import React from "react";$//' "$file"
  fi
done

echo "DeepSource issue fixes completed!"
echo "Note: The isowsMock.js issues will be fixed separately as they require code changes."