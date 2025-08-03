# Test Code Guidelines

This document outlines best practices for writing test code in the Duration project to prevent common issues caught by DeepSource and other static analysis tools.

## TypeScript Best Practices

### 1. Never Use `any` Type
```typescript
// ❌ Bad
const mockData: any = { id: '123' };
jest.mock('@/components/Modal', () => ({
  Modal: ({ onClose }: any) => <div onClick={onClose}>Modal</div>
}));

// ✅ Good
const mockData: MockUser = { id: '123', email: 'test@example.com' };
jest.mock('@/components/Modal', () => ({
  Modal: ({ onClose }: { onClose: () => void }) => <div onClick={onClose}>Modal</div>
}));
```

### 2. Define Proper Types for All Mock Functions
```typescript
// ❌ Bad
export const createMockClient = (overrides: any = {}) => ({ ... });

// ✅ Good
interface MockClientOverrides {
  data?: unknown;
  error?: Error | null;
}
export const createMockClient = (overrides: MockClientOverrides = {}) => ({ ... });
```

### 3. Use Type Imports
```typescript
// ❌ Bad
import { User, Profile } from './types';

// ✅ Good
import type { User, Profile } from './types';
```

## Code Quality Practices

### 1. Handle Unused Variables
```typescript
// ❌ Bad
routes.forEach(({ path, testId, name }) => {
  // testId is extracted but never used
  expect(screen.getByText(name)).toBeInTheDocument();
});

// ✅ Good - Option 1: Use the variable
routes.forEach(({ path, testId, name }) => {
  expect(screen.getByTestId(testId)).toBeInTheDocument();
});

// ✅ Good - Option 2: Prefix with underscore
routes.forEach(({ path, testId: _testId, name }) => {
  expect(screen.getByText(name)).toBeInTheDocument();
});

// ✅ Good - Option 3: Don't extract it
routes.forEach(({ path, name }) => {
  expect(screen.getByText(name)).toBeInTheDocument();
});
```

### 2. Document Public Functions
```typescript
// ❌ Bad
export const setupMocks = (config?: Config) => {
  // implementation
};

// ✅ Good
/**
 * Sets up common mocks for testing
 * @param config - Optional configuration for mock behavior
 * @returns void
 */
export const setupMocks = (config?: Config): void => {
  // implementation
};
```

## Common Patterns to Use

### 1. Create Typed Mock Utilities
```typescript
// In test-utils/types.ts
export interface MockComponentProps {
  onClose?: () => void;
  children?: React.ReactNode;
  [key: string]: unknown;
}

// In your test
jest.mock('@/components/Modal', () => ({
  Modal: ({ onClose, children }: MockComponentProps) => (
    <div onClick={onClose}>{children}</div>
  )
}));
```

### 2. Use Shared Mock Creation Functions
```typescript
// In test-utils/mocks.ts
/**
 * Creates a mock user object for testing
 * @param overrides - Partial user properties to override defaults
 * @returns Complete mock user object
 */
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  email: 'test@example.com',
  role: 'donor',
  ...overrides
});
```

## Pre-commit Checklist

Before committing test code, ensure:

1. ✅ No `any` types used (run: `grep -r "any" src/**/*.test.*`)
2. ✅ All exported functions have JSDoc comments
3. ✅ No unused variables (check ESLint warnings)
4. ✅ All mock props are properly typed
5. ✅ Type imports use `import type` syntax

## Running Checks Locally

```bash
# Run ESLint on test files
npm run lint -- --ext .test.ts,.test.tsx

# Run TypeScript compiler
npm run typecheck

# Check for any types
grep -r ": any" src/**/*.test.* src/test-utils/**/*
```

## Automated Prevention

These issues are prevented by:
- ESLint configuration (`.eslintrc.test.js`)
- TypeScript strict mode
- Pre-commit hooks (if configured)
- CI/CD pipeline checks