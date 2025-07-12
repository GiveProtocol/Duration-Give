# Private Repository Setup Guide

## URGENT: Create these private repositories IMMEDIATELY

### 1. Duration-Infrastructure-Private
```bash
# Create private repo on GitHub first, then:
git clone https://github.com/GiveProtocol/Duration-Infrastructure-Private.git
cd Duration-Infrastructure-Private

# Copy these directories/files from main repo:
mkdir -p .github/workflows scripts volumes
cp -r ../Duration-Give/.github/workflows/* .github/workflows/
cp -r ../Duration-Give/scripts/* scripts/
cp ../Duration-Give/docker-compose.yml .
cp ../Duration-Give/netlify.toml .
cp ../Duration-Give/vite.config.ts .
cp ../Duration-Give/hardhat.config.ts .
cp ../Duration-Give/hardhat.config.cjs .
cp ../Duration-Give/cypress.config.ts .
cp ../Duration-Give/volumes/kong.yml volumes/
cp ../Duration-Give/.env.example .

git add .
git commit -m "Initial infrastructure setup with deployment configs"
git push
```

### 2. Duration-Backend-Private
```bash
# Create private repo on GitHub first, then:
git clone https://github.com/GiveProtocol/Duration-Backend-Private.git
cd Duration-Backend-Private

# Copy backend components:
mkdir -p supabase/functions supabase/migrations src/lib src/utils/monitoring src/pages
cp -r ../Duration-Give/supabase/* supabase/
cp -r ../Duration-Give/src/lib/* src/lib/
cp -r ../Duration-Give/src/utils/monitoring/* src/utils/monitoring/
cp -r ../Duration-Give/src/pages/admin/* src/pages/
cp -r ../Duration-Give/src/middleware src/

git add .
git commit -m "Initial backend setup with database and admin functions"
git push
```

### 3. Duration-Business-Logic-Private
```bash
# Create private repo on GitHub first, then:
git clone https://github.com/GiveProtocol/Duration-Business-Logic-Private.git
cd Duration-Business-Logic-Private

# Copy business logic:
mkdir -p src/hooks src/utils src/data test
cp ../Duration-Give/src/hooks/useAdminPanel.ts src/hooks/
cp ../Duration-Give/src/hooks/useDonationAnalytics.ts src/hooks/
cp ../Duration-Give/src/hooks/useTransactionTracking.ts src/hooks/
cp ../Duration-Give/src/hooks/useWalletAlias.ts src/hooks/
cp ../Duration-Give/src/utils/caching.ts src/utils/
cp ../Duration-Give/src/utils/performance.ts src/utils/
cp ../Duration-Give/src/utils/export.ts src/utils/
cp ../Duration-Give/src/utils/logger.ts src/utils/
cp ../Duration-Give/src/utils/money.ts src/utils/
cp ../Duration-Give/src/data/charities.ts src/data/
cp -r ../Duration-Give/test/* test/

git add .
git commit -m "Initial business logic setup with analytics and utilities"
git push
```

### 4. Duration-Config-Private
```bash
# Create private repo on GitHub first, then:
git clone https://github.com/GiveProtocol/Duration-Config-Private.git
cd Duration-Config-Private

# Copy configurations:
mkdir -p src/config src/utils src/middleware
cp -r ../Duration-Give/src/config/* src/config/
cp ../Duration-Give/src/utils/csrf.ts src/utils/
cp ../Duration-Give/src/utils/inputValidation.ts src/utils/
cp ../Duration-Give/src/utils/validation.ts src/utils/
cp ../Duration-Give/src/middleware/errorBoundary.tsx src/middleware/
cp ../Duration-Give/.env.example .
cp ../Duration-Give/jest.config.ts .
cp ../Duration-Give/postcss.config.js .
cp ../Duration-Give/tailwind.config.js .

git add .
git commit -m "Initial configuration setup with security and validation"
git push
```

## FILES TO REMOVE FROM PUBLIC REPO

After copying to private repos, remove these from Duration-Give:

### Critical Security Files (REMOVE IMMEDIATELY):
- `supabase/functions/subscribe/index.ts` (contains exposed API keys)
- `supabase/migrations/*.sql` (all migration files)
- `src/pages/admin/` (entire admin directory)

### Infrastructure Files:
- `.github/workflows/`
- `scripts/`
- `docker-compose.yml`
- `netlify.toml`
- `vite.config.ts`
- `hardhat.config.ts`
- `hardhat.config.cjs`
- `cypress.config.ts`

### Backend Files:
- `src/lib/supabase.ts`
- `src/lib/auth.ts`
- `src/lib/sentry.ts`
- `src/utils/monitoring/`
- `src/middleware/security.ts`

### Business Logic Files:
- `src/hooks/useAdminPanel.ts`
- `src/hooks/useDonationAnalytics.ts`
- `src/hooks/useTransactionTracking.ts`
- `src/utils/caching.ts`
- `src/utils/performance.ts`
- `src/utils/money.ts`
- `src/data/charities.ts`
- `test/`

### Configuration Files:
- `src/config/env.ts`
- `src/config/contracts.ts`
- `src/utils/validation.ts`

## IMMEDIATE SECURITY ACTIONS:

1. **Change MailChimp API keys** in your MailChimp dashboard
2. **Remove subscribe function** from public repo immediately  
3. **Check access logs** for any unauthorized API usage
4. **Create private repos** and move sensitive files
5. **Update deployment** to use new private configurations

## GitHub Repository Settings:

For each private repository:
1. Set visibility to "Private"
2. Add team members with appropriate permissions
3. Enable security features (dependency alerts, secret scanning)
4. Set up branch protection rules
5. Configure automated security updates