# Documentation Guidelines for Give Protocol

## When to Add JSDoc Comments

### Required Documentation

1. **All exported functions in utility files**
```typescript
/**
 * Validates an Ethereum wallet address
 * @param address - The wallet address to validate
 * @returns true if valid Ethereum address, false otherwise
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
```

2. **Custom hooks**
```typescript
/**
 * Hook for managing charity profile data and operations
 * @param charityId - The ID of the charity to load
 * @returns Object containing charity data, loading state, and CRUD operations
 */
export function useCharityProfile(charityId: string) {
  // implementation
}
```

3. **Context providers and their interfaces**
```typescript
/**
 * Authentication context providing user state and auth operations
 */
export interface AuthContextType {
  /** Currently authenticated user */
  user: User | null;
  /** User's role in the system */
  userType: 'donor' | 'charity' | 'admin' | null;
  /** Authenticates user with email and password */
  login: (email: string, password: string) => Promise<void>;
}
```

4. **Complex business logic functions**
```typescript
/**
 * Calculates the platform fee for a donation
 * @param amount - Donation amount in Wei
 * @param isRecurring - Whether this is a recurring donation
 * @returns Fee amount in Wei (2.5% for one-time, 2% for recurring)
 */
export function calculatePlatformFee(amount: bigint, isRecurring: boolean): bigint {
  // implementation
}
```

### Documentation NOT Required

1. **React component props** (TypeScript interfaces are sufficient)
```typescript
// No JSDoc needed - interface is self-documenting
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
}
```

2. **Simple UI components**
```typescript
// No JSDoc needed for simple presentational components
export const LoadingSpinner = () => <div className="spinner" />;
```

3. **Test utilities and test files**
```typescript
// No JSDoc needed in test files
export const mockUser = { id: '123', email: 'test@example.com' };
```

4. **Internal/private functions**
```typescript
// No JSDoc needed for non-exported functions
function internalHelper() { }
```

## Documentation Format

Use TSDoc format for consistency:

```typescript
/**
 * Brief description of what the function does
 * 
 * @param paramName - Description of the parameter
 * @returns Description of return value
 * @throws {ErrorType} Description of when this error is thrown
 * @example
 * ```typescript
 * const result = myFunction('input');
 * ```
 */
```

## Priority Order for Adding Documentation

1. **Critical** - Security functions, payment processing, authentication
2. **High** - Public API hooks, data fetching utilities, validation functions  
3. **Medium** - UI utilities, formatting functions, helper functions
4. **Low** - Simple components, test utilities, type definitions

## Automating Documentation

Consider using tools like:
- `eslint-plugin-jsdoc` - Enforce documentation standards
- `typedoc` - Generate documentation from TypeScript
- VS Code snippets for common documentation patterns