# ARCHIVED - Give Protocol Monorepo

> This repository has been archived and migrated to a distributed multi-repository architecture.
>
> Please use the new repositories below for active development.

## Migration to Distributed Architecture

This monorepo has been split into four specialized repositories for better separation of concerns, faster CI/CD, and easier maintenance:

### New Repository Structure

| Repository | Purpose | Link |
|------------|---------|------|
| **give-protocol-webapp** | React Progressive Web App | https://github.com/civicmastery/give-protocol-webapp |
| **give-protocol-contracts** | Solidity smart contracts + Hardhat | https://github.com/civicmastery/give-protocol-contracts |
| **give-protocol-docs** | Jekyll documentation site | https://github.com/civicmastery/give-protocol-docs |
| **give-protocol-backend** | Supabase backend + admin functions | https://github.com/civicmastery/give-protocol-backend |

## Migration Guide

For detailed information about the migration, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

## Quick Start (New Architecture)

### Clone All Repositories
```bash
mkdir give-protocol && cd give-protocol
git clone https://github.com/civicmastery/give-protocol-webapp.git
git clone https://github.com/civicmastery/give-protocol-contracts.git
git clone https://github.com/civicmastery/give-protocol-docs.git
git clone https://github.com/civicmastery/give-protocol-backend.git
```

### Install Dependencies
```bash
cd give-protocol-webapp && npm install && cd ..
cd give-protocol-contracts && npm install && cd ..
cd give-protocol-docs && bundle install && cd ..
cd give-protocol-backend && npm install && cd ..
```

### Start Development
```bash
# Webapp (Terminal 1)
cd give-protocol-webapp && npm run dev

# Contracts (as needed)
cd give-protocol-contracts && npm test

# Docs (Terminal 2, optional)
cd give-protocol-docs && bundle exec jekyll serve

# Backend (Terminal 3, optional)
cd give-protocol-backend && npm run dev
```

## Documentation

- **User Documentation**: https://civicmastery.github.io/give-protocol-docs/
- **Developer Guides**: See CLAUDE.md in each repository
- **Migration Guide**: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

## Why Migrate?

The distributed architecture provides:

- Separation of Concerns: Each repo has a single, well-defined purpose
- Independent Versioning: Components can be versioned independently
- Faster CI/CD: Smaller repos = faster builds and deployments
- Clearer Permissions: Fine-grained access control per repository
- Easier Onboarding: New contributors can focus on one component
- Better Dependencies: Dependencies scoped to what's actually needed

## About Give Protocol

A blockchain-based charitable giving platform built with:

- React + TypeScript + Vite
- Solidity smart contracts on Moonbeam Network
- Supabase backend
- Jekyll documentation

### Key Features

- Transparent donation tracking using blockchain
- Volunteer opportunity matching
- Skill endorsement system
- Multiple donation methods (direct, equity pools, portfolio funds)
- Charity verification system
- Monthly donation scheduling

## For Existing Contributors

If you have local changes in this monorepo:

1. **Identify which repository your changes belong to**:
   - `src/` → give-protocol-webapp
   - `contracts/`, `test/`, `scripts/` → give-protocol-contracts
   - `docs/` → give-protocol-docs
   - `supabase/` → give-protocol-backend

2. **Clone the appropriate new repository**

3. **Apply your changes to the new repository**

4. **Test in the new structure**

5. **Submit PRs to the new repositories**

## Questions?

- **Migration Questions**: See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **Technical Issues**: Open issues in the relevant repository
- **General Questions**: Contact the maintainers

## License

MIT

---

**Archive Date**: October 10, 2024

**Last Active Commit**: See git history

**Migration Completed**: October 10, 2024
