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

## CRITICAL: Code Quality & SonarCloud Guidelines

**ALWAYS run `npm run lint` before committing code. Fix ALL errors, not just warnings.**

### Testing Best Practices

1. **Comprehensive Coverage**: Focus test coverage on files modified within the last 15 days (SonarCloud's "New Code" definition)
2. **Test File Organization**: Use shared test helpers in `/src/test-utils/` to reduce duplication
3. **Mock Patterns**: Consolidate repetitive mock setups using helper functions
4. **Async Testing**: Always await async test helper functions and add proper assertions

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

## Quality Gate Requirements

- **Coverage**: ≥80% on new code (last 15 days)
- **Duplication**: ≤3% on new code
- **Security Hotspots**: 0 (no hard-coded secrets)
- **Reliability**: A rating (no ESLint errors)

## Git Workflow

1. Always run `npm run lint` before committing
2. Write descriptive commit messages explaining the "why" not just "what"
3. Keep commits focused on single logical changes
4. Test changes locally before pushing
5. Use conventional commit format when possible
