# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Duration is a blockchain-based charitable giving platform (Give Protocol) built with React, TypeScript, and Solidity smart contracts targeting the Moonbeam Network.

## Essential Commands

### Development

```bash
npm run dev          # Start Vite dev server (port 5173)
npm run lint         # Run ESLint
npm run build        # Production build (TypeScript + Vite)
```

### Smart Contracts

```bash
npm run compile              # Compile Solidity contracts
npm run test                 # Run Hardhat tests
npm run deploy:moonbase      # Deploy contracts to Moonbase Alpha testnet
npm run deploy:verification  # Deploy VolunteerVerification contract
npm run deploy:distribution  # Deploy CharityScheduledDistribution contract
```

### Testing

```bash
npm test                     # Run Hardhat smart contract tests
npm run test:e2e            # Run Cypress E2E tests (if configured)
```

## Architecture Overview

### Frontend Architecture

- **Pages**: Route components in `/src/pages/` organized by feature (charity/, donor/, volunteer/, admin/)
- **Components**: Reusable UI in `/src/components/` with subdirectories for feature-specific components
- **Hooks**: Custom React hooks in `/src/hooks/` including web3-specific hooks in `/src/hooks/web3/`
- **Contexts**: Global state management via React Context (Auth, Web3, Settings, Toast)
- **API Layer**: Supabase client and queries in `/src/lib/`

### Smart Contract Architecture

- **DurationDonation.sol**: Main donation contract handling direct, scheduled, and portfolio donations
- **CharityScheduledDistribution.sol**: Manages scheduled charity distributions
- **VolunteerVerification.sol**: Handles volunteer hour verification and NFT minting
- **DistributionExecutor.sol**: Executes scheduled distributions

### Key Patterns

1. **Web3 Integration**: Uses both ethers.js v6 and viem for blockchain interactions
2. **Transaction Forms**: Reusable transaction components in `/src/components/web3/`
3. **Multi-language Support**: i18n configured with 12+ languages in `/src/i18n/resources/`
4. **Type Safety**: Comprehensive TypeScript types in `/src/types/`
5. **Error Handling**: Global error boundary and transaction tracking hooks

## Development Notes

### Environment Setup

Create a `.env` file with required variables:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for backend
- `VITE_MOONBASE_RPC_URL` for blockchain connection
- Private keys for contract deployment (never commit!)

### Working with Smart Contracts

1. Contracts are in `/contracts/` directory
2. Compiled artifacts go to `/src/contracts/[ContractName].sol/`
3. Always run `npm run compile` after contract changes
4. Test thoroughly before deploying to testnet

### State Management

- Authentication state managed by AuthContext
- Web3 wallet connection handled by Web3Context
- Use React Query for server state (charity data, donations)
- Local state for UI-only concerns

### Common Development Tasks

- Adding a new page: Create in `/src/pages/`, add route in `/src/routes/`
- Adding translations: Update all language files in `/src/i18n/resources/`
- Modifying contracts: Update Solidity, compile, update TypeScript types, redeploy
- Testing blockchain features: Use local Hardhat node with `npm run node`

## ⚠️ CRITICAL: Code Quality Rules - MUST FOLLOW ALWAYS ⚠️

### 🚫 NEVER DO (Will Cause CI/CD Failures)

1. **NEVER leave unused variables** (DeepSource JS-0356 - Major)

   ```typescript
   // ❌ WRONG
   const mockSpy = jest.spyOn(module, "method");
   // mockSpy never used

   // ✅ CORRECT - Use underscore prefix for intentionally unused
   const _mockSpy = jest.spyOn(module, "method");

   // ✅ CORRECT - Use the variable
   const mockSpy = jest.spyOn(module, "method");
   expect(mockSpy).toHaveBeenCalled();
   ```

2. **NEVER use empty functions without comments** (DeepSource JS-0321 - Minor)

   ```typescript
   // ❌ WRONG
   jest.spyOn(obj, "method").mockImplementation(() => {});

   // ✅ CORRECT - Add explanatory comment
   jest.spyOn(obj, "method").mockImplementation(() => {
     // Empty mock to prevent actual execution
   });

   // ✅ CORRECT - Use jest.fn() for simple mocks
   jest.spyOn(obj, "method").mockImplementation(jest.fn());
   ```

3. **NEVER use `any` type** (DeepSource JS-0323 - Critical)

   ```typescript
   // ❌ WRONG
   const props: any = { ... };
   jest.mock('@/component', () => ({ Component: (props: any) => ... }));

   // ✅ CORRECT
   interface Props { onClose: () => void; children: React.ReactNode; }
   jest.mock('@/component', () => ({ Component: ({ onClose, children }: Props) => ... }));
   ```

4. **NEVER use `require()` statements** (DeepSource JS-0359 - Major)

   ```typescript
   // ❌ WRONG
   const module = require("./module");
   jest.spyOn(require("./module"), "function");

   // ✅ CORRECT
   import * as module from "./module";
   jest.spyOn(module, "function");
   ```

5. **NEVER leave unused variables** (DeepSource JS-0356 - Major)

   ```typescript
   // ❌ WRONG
   routes.forEach(({ path, testId, name }) => {
     // testId extracted but never used
   });

   // ✅ CORRECT - Option 1: Use it
   routes.forEach(({ path, testId, name }) => {
     expect(screen.getByTestId(testId)).toBeInTheDocument();
   });

   // ✅ CORRECT - Option 2: Prefix with _
   routes.forEach(({ path, testId: _testId, name }) => {
   ```

6. **NEVER export functions without JSDoc** (DeepSource JS-D1001 - Minor)

   ```typescript
   // ❌ WRONG
   export const createMock = (data) => ({ ... });

   // ✅ CORRECT
   /**
    * Creates a mock object for testing
    * @param data - The data to include in the mock
    * @returns Mock object with jest functions
    */
   export const createMock = (data: MockData) => ({ ... });
   ```

7. **NEVER use explicit type annotations where inferred** (DeepSource JS-0331 - Major)

   ```typescript
   // WRONG
   const message: string = 'Operation cancelled by user';
   const active: boolean = true;
   const count: number = 0;

   // CORRECT
   const message = 'Operation cancelled by user';
   const active = true;  
   const count = 0;
   ```

8. **NEVER use non-null assertions without explicit checks** (DeepSource JS-0339 - Major)

   ```typescript
   // WRONG
   const block = await ethers.provider.getBlock("latest");
   const timestamp = block!.timestamp;

   // CORRECT
   const block = await ethers.provider.getBlock("latest");
   if (!block) throw new Error("Could not get latest block");
   const timestamp = block.timestamp;
   ```

9. **NEVER use .to.be.true/.to.be.false in Chai tests** (DeepSource JS-0354 - Minor)

   ```typescript
   // WRONG (flagged as unused expression)
   expect(result.isActive).to.be.true;
   expect(result.isValid).to.be.false;

   // CORRECT (explicit function calls)
   expect(result.isActive).to.equal(true);
   expect(result.isValid).to.equal(false);
   ```

10. **NEVER forget React import when using JSX**

    ```typescript
    // WRONG (will cause "React is not defined")
    const Component = () => <div>Hello</div>;

    // CORRECT
    import React from 'react';
    const Component = () => <div>Hello</div>;
    ```

11. **NEVER use arrow functions directly in JSX props** (DeepSource JS-0417 - Performance)

    ```typescript
    // WRONG (creates new function on every render)
    <Button onClick={(e) => handleClick(e)}>Click</Button>
    
    // CORRECT (use useCallback)
    const handleClick = useCallback((e: React.MouseEvent) => {
      // handle click
    }, [dependencies]);
    <Button onClick={handleClick}>Click</Button>
    ```

12. **NEVER use process.exit() in scripts** (DeepSource JS-0263 - Bug Risk)

    ```typescript
    // WRONG
    if (error) {
      console.error('Error:', error);
      process.exit(1);
    }
    
    // CORRECT
    class ScriptError extends Error {
      constructor(message: string, public exitCode: number = 1) {
        super(message);
      }
    }
    
    if (error) {
      console.error('Error:', error);
      process.exitCode = 1;
      throw new ScriptError('Operation failed');
    }
    ```

13. **NEVER use array index as React key** (DeepSource JS-0437 - Bug Risk)

    ```typescript
    // WRONG
    {items.map((item, index) => <Item key={index} />)}
    
    // CORRECT
    {items.map((item) => <Item key={item.id} />)}
    // OR generate stable IDs
    {items.map((item) => <Item key={`${item.type}-${item.timestamp}`} />)}
    ```

### ✅ ALWAYS DO (Before Writing Any Code)

1. **Define types first**, then write implementation
2. **Import React when creating JSX elements**
3. **Use `import type` for type-only imports**
4. **Check test-utils/ for existing patterns before creating new ones**
5. **Add JSDoc to all exported functions and classes**
6. **Use shared mock utilities to prevent duplication**

### 🔍 Pre-Code Checklist (MANDATORY)

Before writing ANY code, verify:

- [ ] All types explicitly defined (no `any`)
- [ ] All variables used or prefixed with `_`
- [ ] ES6 imports only (no `require()`)
- [ ] React imported when using JSX
- [ ] JSDoc on all exported functions
- [ ] Followed existing patterns in test-utils/

**ALWAYS run `npm run lint` before committing code. Fix ALL errors, not just warnings.**

### Testing Best Practices

1. **Comprehensive Coverage**: Focus test coverage on files modified within the last 15 days (SonarCloud's "New Code" definition)
2. **Test File Organization**: Use shared test helpers in `/src/test-utils/` to reduce duplication
3. **Mock Patterns**: Consolidate repetitive mock setups using helper functions
4. **Async Testing**: Always await async test helper functions and add proper assertions

#### ⚠️ CRITICAL: Test Writing Rules (From Session Experience)

5. **ALWAYS mark test functions as `async` when using `await`** - Missing `async` causes "Unexpected strict mode reserved word" syntax errors
6. **Singleton Pattern Testing**: Use `resetInstanceForTesting()` methods when testing singletons to ensure test isolation
7. **Configuration Testing**: Test config merging with partial configs - don't assume full config objects
8. **Capacity Management**: When testing cache/storage limits, use realistic numbers that work with default configurations
9. **Mock TypeScript Interfaces**: Always create proper TypeScript interfaces for mocks instead of using `any` - prevents DeepSource violations

### Security Requirements

- **NEVER use hard-coded passwords/secrets** in tests - use `expect.any(String)` or constants
- **Always sanitize user inputs** and validate data before processing
- **Never commit sensitive data** like API keys, private keys, or passwords

### ESLint Error Prevention

- **Unused Variables**: Name unused parameters with `_` prefix (e.g., `_unusedParam`) or remove them
- **Reserved Keywords**: Avoid using `import`, `export`, `class` as property names in interfaces
- **TypeScript Interfaces**:
  - Avoid `extends typeof globalThis` - use simple interfaces instead
  - Replace `NodeJS.*` types with generic equivalents when ESLint complains
  - Use `Record<string, unknown>` instead of `NodeJS.ProcessEnv` in tests
- **Test Assertions**: Ensure all test functions contain assertions or disable ESLint with `// eslint-disable-next-line jest/expect-expect`

### Code Duplication Prevention

1. **Extract Common Patterns**: Create shared utilities for repetitive code
2. **Test Helpers**: Use `/src/test-utils/` for common mock objects and setup functions
3. **Constants**: Define reusable constants (like `MOCK_USER`) to avoid duplication
4. **Helper Functions**: Extract common test flows into reusable functions

### File Naming & Structure

- **Test Files**: Use `.test.tsx` for React components, `.test.ts` for utilities
- **Mock Files**: Place mocks in `/src/test-utils/` with descriptive names
- **Helper Files**: Create focused helper files (e.g., `authTestHelpers.ts`) for specific domains

### Performance Considerations

- **Lazy Loading**: Use React.lazy() for large components
- **Memoization**: Apply React.memo() and useMemo() for expensive calculations
- **Bundle Analysis**: Regularly check bundle size and optimize imports

### Known Integration Issues

1. **Jest + Supabase**: Mock Supabase client to avoid ES module issues in tests
2. **Viem + Ethers**: Use appropriate library for each use case, don't mix in same file
3. **TypeScript + ESLint**: Some global type references need simplification for ESLint compatibility

#### ⚠️ CRITICAL: Session-Learned Issues to Avoid

4. **React Import Consistency**: Never remove React import and then re-add underscore prefix (`_React`) - this creates a loop of ESLint errors. When JSX is used, keep `import React from 'react'` or use `import _React from 'react'` consistently throughout the session.
5. **Test Coverage Context**: When SonarCloud reports low coverage, always check if files already have comprehensive tests before writing new ones. Run `npx jest --coverage` to verify actual coverage.
6. **Git Push Failures**: Always check for remote changes with `git status` before pushing. Use `git pull --rebase` to handle conflicts, but stash unstaged changes first.
7. **DeepSource Violations**: The most common violations are JS-0323 ('any' types), JS-0356 (unused variables), JS-0339 (non-null assertions), JS-0331 (explicit type annotations), JS-0354 (unused expressions in tests), JS-0263 (process.exit usage), JS-0437 (array index as key), and JS-0417 (arrow functions in JSX). Always prefix unused variables with `_` and create proper TypeScript interfaces.

#### 🔧 CRITICAL: DeepSource Configuration and Code Quality Patterns

8. **DeepSource Configuration**: Always verify configuration options in `.deepsource.toml` against official documentation. Use correct `skip_doc_coverage` options: `["function-expression", "arrow-function-expression", "class-expression", "method-definition"]` instead of invalid options like `"test-function"`.
9. **Strategic Over Complete**: When fixing 400+ code quality issues, prioritize strategically - implement functionality rather than removing unused code, focus documentation on critical exports (auth, Web3, security), and configure tools to skip low-value warnings.
10. **Namespace Classes Pattern**: Classes used only for static methods should either: (a) have private constructor to prevent instantiation (for classes with state like Logger), or (b) be converted to const objects with `as const` (for pure utility functions like InputValidator).
11. **Function Declaration Order**: Organize code to avoid "used before defined" issues by: (a) placing helper functions before their first usage, (b) moving component definitions before JSX usage, (c) restructuring files when necessary to maintain logical flow.
12. **TypeScript Directive Best Practices**: Use `@ts-expect-error` instead of `@ts-ignore` for intentional errors in tests. Always include detailed explanations: `// @ts-expect-error - Intentionally calling undefined function to test Sentry's ReferenceError capture`.
13. **Proper Type Inference**: Instead of `any`, use `typeof MOCK_USER` or create proper interfaces. For test callbacks, define exact signatures like `(event: string, session: { user: typeof MOCK_USER } | null) => void`.
14. **React Fragment Optimization**: Remove unnecessary fragments that wrap single children - use `return children` instead of `return <>{children}</>` in components.

#### 🔧 CRITICAL: SonarCloud/DeepSource Issue Patterns (Session Learned)

8. **Promise Misuse (S6544)**: Always `await` Promise-returning methods in boolean conditions. Check method signatures - if they return `Promise<boolean>`, use `if (await method())` not `if (method())`.
9. **Array.reduce() Safety (S6959)**: Always provide initial value to `reduce()` calls: `array.reduce((a, b) => a + b, 0)` prevents TypeError on empty arrays.
10. **Form Accessibility (S6853)**: For radio button groups, use `<fieldset><legend>` instead of nested labels. For single controls, wrap with label: `<label><input/>Label Text</label>`.
11. **Intentional Overwrites (S4143)**: In tests that verify overwrite behavior, always verify the initial value first, then overwrite, to make intent clear to static analysis tools.
12. **Method Documentation (JS-D1001)**: Always add JSDoc to exported functions and public methods. Include `@param` and `@returns` tags with types and descriptions.

## Quality Gate Requirements

- **Coverage**: ≥80% on new code (last 15 days)
- **Duplication**: ≤3% on new code
- **Security Hotspots**: 0 (no hard-coded secrets)
- **Reliability**: A rating (no ESLint errors)

### 📋 Systematic Quality Issue Resolution (Session Learned)

**When fixing SonarCloud/DeepSource issues:**

1. **Group by Type**: Fix similar issues together (all Promise misuse, all accessibility issues, etc.)
2. **Use TodoWrite Tool**: Track progress when handling multiple files/issues
3. **Verify Method Signatures**: Before fixing Promise issues, check if methods are actually async
4. **Test Semantics**: In tests that intentionally violate patterns (overwrites, duplicates), add verification steps to make intent clear
5. **Accessibility Patterns**:
   - Radio groups: `<fieldset><legend>`
   - Single inputs: `<label><input/>Text</label>`
   - Custom components: Treat as controls and wrap with labels
6. **Commit Patterns**: Group related fixes in single commits with descriptive messages explaining the rule violation and fix

### 🎯 Code Quality Issue Resolution Strategy (Session Learned)

**Strategic Approach for Large-Scale Quality Issues:**

1. **Implement vs Remove**: When code quality tools flag "unused" variables/functions, first determine if they represent incomplete but valuable functionality. Implement the intended functionality rather than removing it (e.g., fix-supabase-performance.js had unused variables that represented incomplete but critical database optimization features).

2. **Documentation Strategy**: For 400+ documentation warnings, use `.deepsource.toml` configuration to skip low-value cases and focus documentation on:
   - Authentication hooks and contexts
   - Web3/blockchain utilities  
   - Security and validation functions
   - Complex business logic
   Skip documentation for test files, simple UI components, and internal helpers.

3. **Tool Configuration First**: Before mass fixes, configure quality tools properly:
   - Verify configuration options against official docs
   - Use strategic `skip_` options to reduce noise
   - Focus on high-impact issues (Critical/Major over Minor)

4. **Preserve Functionality**: Maintain all existing behavior while improving code quality. Never break working features to satisfy static analysis tools.

### 🔧 Performance Optimization Script Patterns (Session Learned)

**When working with database/performance optimization scripts:**

1. **Complete Implementation Over Removal**: Scripts like `fix-supabase-performance.js` often contain "unused" variables that represent incomplete but critical functionality:
   - `policyFixes` mapping was intended for RLS optimization 
   - `rlsPatterns` contained reusable security patterns
   - `multiplePermissivePolicies` identified consolidation opportunities
   - Always implement the intended functionality rather than removing as "unused"

2. **Database Migration Generation**: Performance scripts should generate actual migration files:
   - RLS performance fixes (wrap auth.uid() in subqueries)
   - Index deduplication with documentation of kept vs removed indexes
   - Policy consolidation with proper OR logic combinations
   - Include comprehensive comments explaining the performance benefits

3. **Systematic Approach**: For 66+ performance issues:
   - Create pattern-to-table mapping objects
   - Generate migrations systematically using the patterns
   - Document which optimizations were applied and why
   - Preserve development vs production behavior differences

## Git Workflow

1. Always run `npm run lint` before committing
2. Write descriptive commit messages explaining the "why" not just "what"
3. Keep commits focused on single logical changes
4. Test changes locally before pushing
5. Use conventional commit format when possible
6. When fixing multiple code quality issues, disable quality gates temporarily by adding `if: false` to workflow jobs
7. Group related DeepSource/SonarCloud fixes in single commits with clear descriptions
