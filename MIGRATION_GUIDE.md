# Migration Guide: Monorepo to Distributed Architecture

This guide documents the migration of the Give Protocol (formerly Duration) from a monorepo structure to a distributed multi-repository architecture.

## Repository Structure

### Old Structure (Monorepo)
```
GiveProtocol/Duration-Give
├── src/              # React webapp source
├── contracts/        # Solidity contracts
├── docs/             # Jekyll documentation
├── supabase/         # Backend database
├── scripts/          # Deployment scripts
└── package.json      # All dependencies
```

### New Structure (Distributed)
```
civicmastery/give-protocol-webapp      # React Progressive Web App
civicmastery/give-protocol-contracts   # Smart contracts + Hardhat
civicmastery/give-protocol-docs        # Jekyll documentation site
civicmastery/give-protocol-backend     # Supabase backend
```

## Repositories

### 1. give-protocol-webapp
**Purpose**: React/Vite Progressive Web Application

**Location**: https://github.com/civicmastery/give-protocol-webapp

**Contents**:
- `/src/` - React application source code
- `/public/` - Static assets
- `vite.config.ts` - Vite configuration
- GitHub Actions workflows for testing, linting, and deployment

**Commands**:
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run Jest tests
npm run test:e2e     # Run Cypress tests
npm run lint         # Run ESLint
```

### 2. give-protocol-contracts
**Purpose**: Solidity smart contracts and deployment infrastructure

**Location**: https://github.com/civicmastery/give-protocol-contracts

**Contents**:
- `/contracts/` - Solidity smart contracts
- `/scripts/` - Deployment and testing scripts
- `/test/` - Hardhat test suites
- `hardhat.config.cjs` - Hardhat configuration
- GitHub Actions workflows for testing, compilation, and security scanning

**Commands**:
```bash
npm run compile              # Compile contracts
npm run test                 # Run tests
npm run test:coverage        # Coverage report
npm run deploy:moonbase      # Deploy to Moonbase
npm run lint:sol             # Solidity linting
```

### 3. give-protocol-docs
**Purpose**: Jekyll documentation website

**Location**: https://github.com/civicmastery/give-protocol-docs

**Contents**:
- `/docs/` - Markdown documentation files
- `/_layouts/` - Jekyll templates
- `_config.yml` - Jekyll configuration
- GitHub Actions workflow for automated deployment

**Commands**:
```bash
bundle install               # Install dependencies
bundle exec jekyll serve     # Local preview
bundle exec jekyll build     # Build static site
```

**Live Site**: https://civicmastery.github.io/give-protocol-docs/

### 4. give-protocol-backend
**Purpose**: Private backend infrastructure and database

**Location**: https://github.com/civicmastery/give-protocol-backend

**Contents**:
- `/src/` - Backend TypeScript code
- `/supabase/migrations/` - Database migrations
- `/supabase/functions/` - Edge Functions
- GitHub Actions workflow for security scanning

**Commands**:
```bash
npm run dev              # Start local Supabase
npm run generate-types   # Generate DB types
npm run migrate          # Push migrations
npm run seed             # Seed test data
```

## Migration Checklist

### ✅ Completed Migrations

- [x] Webapp source code and dependencies
- [x] Smart contracts and deployment scripts
- [x] Documentation site with deployment workflow
- [x] Backend infrastructure and Supabase config
- [x] GitHub Actions workflows for all repositories
- [x] CLAUDE.md files updated for each repo
- [x] Security scanning workflows (Trivy)
- [x] README files for each repository

### Repository-Specific Configurations

#### Webapp
- DeepSource integration configured
- Code quality checks in CI/CD
- E2E testing with Cypress
- Sentry error tracking integration

#### Contracts
- Hardhat test suite
- Solhint linting
- Coverage reporting
- Fuzzing support (Scribble)
- Moonscan verification scripts

#### Docs
- GitHub Pages deployment
- Automatic build on push to main
- Jekyll 3.9.x with GitHub Pages gem

#### Backend
- Supabase local development setup
- Type generation from database schema
- Mailchimp integration
- Sentry monitoring

## Development Workflow

### Working Across Repositories

1. **Clone all repositories**:
```bash
mkdir give-protocol && cd give-protocol
git clone https://github.com/civicmastery/give-protocol-webapp.git
git clone https://github.com/civicmastery/give-protocol-contracts.git
git clone https://github.com/civicmastery/give-protocol-docs.git
git clone https://github.com/civicmastery/give-protocol-backend.git
```

2. **Set up each repository**:
```bash
cd give-protocol-webapp && npm install && cd ..
cd give-protocol-contracts && npm install && cd ..
cd give-protocol-docs && bundle install && cd ..
cd give-protocol-backend && npm install
```

3. **Development servers**:
```bash
# Terminal 1 - Webapp
cd give-protocol-webapp && npm run dev

# Terminal 2 - Docs (optional)
cd give-protocol-docs && bundle exec jekyll serve

# Terminal 3 - Backend (optional)
cd give-protocol-backend && npm run dev
```

### Contract Development

When making changes to smart contracts:

1. Make changes in `give-protocol-contracts` repository
2. Test: `npm test`
3. Deploy to Moonbase: `npm run deploy:moonbase`
4. Update contract addresses in `give-protocol-webapp` config files
5. Update documentation in `give-protocol-docs` if needed

### Environment Variables

Each repository needs its own `.env` file:

**Webapp**:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_MOONBASE_RPC_URL=
```

**Contracts**:
```
MOONBASE_RPC_URL=
PRIVATE_KEY=
MOONSCAN_API_KEY=
```

**Backend**:
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MAILCHIMP_API_KEY=
```

## CI/CD Pipeline

### Webapp Workflows
- **Code Quality**: ESLint, TypeScript checks, tests
- **Security Scan**: Trivy vulnerability scanning
- **DeepSource**: Automated code quality analysis

### Contracts Workflows
- **Test**: Hardhat tests and coverage
- **Lint**: Solhint on all contracts
- **Compile**: Contract compilation check
- **Security**: Trivy and npm audit

### Docs Workflow
- **Deploy**: Automatic GitHub Pages deployment

### Backend Workflow
- **Security**: Trivy scanning and dependency audit

## Benefits of Distributed Architecture

1. **Separation of Concerns**: Each repository has a single, well-defined purpose
2. **Independent Versioning**: Repositories can be versioned independently
3. **Faster CI/CD**: Smaller repos = faster builds and deployments
4. **Clearer Permissions**: Fine-grained access control per repository
5. **Easier Onboarding**: New contributors can focus on one component
6. **Better Dependency Management**: Dependencies scoped to what's needed

## Common Tasks

### Adding a New Feature

1. **Frontend changes**: Work in `give-protocol-webapp`
2. **Contract changes**: Work in `give-protocol-contracts`
3. **Documentation**: Update `give-protocol-docs`
4. **Backend changes**: Work in `give-protocol-backend`

### Deploying to Production

1. Deploy contracts: `cd give-protocol-contracts && npm run deploy:moonbase`
2. Update contract addresses in webapp configuration
3. Build webapp: `cd give-protocol-webapp && npm run build`
4. Deploy webapp (Vercel/Netlify/etc.)
5. Update docs if needed

### Running Full Test Suite

```bash
# Test all repositories
(cd give-protocol-webapp && npm test)
(cd give-protocol-contracts && npm test)
# Docs don't have automated tests
# Backend tests TBD
```

## Troubleshooting

### Monorepo References Still Present
- Check for hardcoded paths referencing monorepo structure
- Update import statements that may reference old paths
- Search for "Duration-Give" and replace with appropriate repo name

### Contract Address Mismatches
- Ensure webapp config has latest deployed contract addresses
- Check that `contracts/deployments/` contains correct addresses
- Verify network configuration matches (Moonbase Alpha)

### GitHub Actions Failures
- Check workflow files for deprecated action versions
- Verify repository secrets are set correctly
- Ensure npm scripts referenced in workflows exist

## Migration Timeline

- **2024-10-07**: Initial repository setup
- **2024-10-08**: Migration of core code and configs
- **2024-10-10**: Added CI/CD workflows to all repositories
- **2024-10-10**: Updated CLAUDE.md files for distributed architecture
- **2024-10-10**: Created this migration guide

## Next Steps

1. **Archive Monorepo**: Mark `GiveProtocol/Duration-Give` as archived with redirect
2. **Update External Links**: Update any external references to point to new repos
3. **Team Onboarding**: Familiarize team with new structure
4. **Documentation Review**: Ensure all docs reflect new architecture

## Questions?

For questions about the migration or new architecture, please:
- Check repository-specific CLAUDE.md files
- Review this migration guide
- Open an issue in the relevant repository
- Contact the maintainers

---

**Old Monorepo**: https://github.com/GiveProtocol/Duration-Give (archived)

**New Repositories**:
- Webapp: https://github.com/civicmastery/give-protocol-webapp
- Contracts: https://github.com/civicmastery/give-protocol-contracts
- Docs: https://github.com/civicmastery/give-protocol-docs
- Backend: https://github.com/civicmastery/give-protocol-backend
