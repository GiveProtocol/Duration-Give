#!/bin/bash

echo "Setting up Duration-Infrastructure-Private repository..."

# Create the directory structure
mkdir -p ../Duration-Infrastructure-Private/.github/workflows
mkdir -p ../Duration-Infrastructure-Private/scripts/deploy
mkdir -p ../Duration-Infrastructure-Private/docker
mkdir -p ../Duration-Infrastructure-Private/netlify

# Initialize git repository
cd ../Duration-Infrastructure-Private
git init
git remote add origin https://github.com/civicmastery/Duration-Infrastructure-Private.git

# Copy infrastructure files
echo "Copying infrastructure files..."

# Copy GitHub Actions workflows
cp ../Duration/.github/workflows/*.yml .github/workflows/

# Copy deployment scripts
cp ../Duration/scripts/deploy*.ts scripts/deploy/

# Copy Docker configuration
cp ../Duration/docker-compose.yml docker/

# Copy Netlify configuration  
cp ../Duration/netlify.toml netlify/

# Create README
cat > README.md << 'EOF'
# Duration Infrastructure Private

🔒 **PRIVATE REPOSITORY** - Contains deployment configurations and CI/CD workflows for Duration Give Protocol.

## Contents

### GitHub Actions Workflows
- **deploy-docs.yml**: Jekyll documentation deployment to GitHub Pages
- **solhint.yml**: Solidity smart contract linting and quality checks

### Deployment Scripts (TypeScript)
- **deploy.ts**: Main DurationDonation contract deployment to Moonbase Alpha
- **deploy-verification.ts**: VolunteerVerification contract deployment
- **deploy-distribution.ts**: CharityScheduledDistribution and DistributionExecutor deployment

### Docker Configuration
- **docker-compose.yml**: Complete Supabase local development stack
  - PostgreSQL database with secure environment variables
  - Supabase Studio, Kong gateway, Auth (GoTrue)
  - PostgREST API, Realtime, and Meta services

### Netlify Configuration
- **netlify.toml**: Production deployment settings
  - Security headers (CSP, HSTS, X-Frame-Options)
  - Asset optimization and caching
  - Environment-specific build commands

## Security Notice

⚠️ **KEEP THIS REPOSITORY PRIVATE**

This repository contains:
- Complete deployment infrastructure and CI/CD pipelines
- Docker configurations with service orchestration details
- Netlify security configurations and headers
- Smart contract deployment strategies and network configurations

## Architecture Revealed

The infrastructure exposes:
- **Deployment Process**: Complete smart contract deployment flow
- **Security Configuration**: Headers, CSP policies, and security measures
- **Service Architecture**: Complete Supabase stack configuration
- **CI/CD Pipeline**: Automated testing and deployment workflows
- **Network Configuration**: Moonbase Alpha testnet deployment details

## Setup Instructions

1. **Prerequisites**:
   ```bash
   npm install -g @supabase/cli
   docker-compose --version
   ```

2. **Local Development**:
   ```bash
   cd docker
   docker-compose up -d    # Start local Supabase stack
   ```

3. **Smart Contract Deployment**:
   ```bash
   cd scripts/deploy
   npm run deploy:moonbase           # Deploy main contracts
   npm run deploy:verification       # Deploy verification system
   npm run deploy:distribution       # Deploy distribution system
   ```

4. **CI/CD Setup**:
   - GitHub Actions workflows in `.github/workflows/`
   - Requires repository secrets for deployment keys
   - Netlify deployment via `netlify.toml` configuration

## Access Control

**Authorized Personnel Only**:
- DevOps engineers
- Infrastructure team
- Security team
- Senior developers
- Platform administrators

## Compliance

This repository contains infrastructure configurations subject to:
- Security audit requirements
- Deployment approval processes
- Change management protocols
- Infrastructure access controls

---

**⚠️ DO NOT SHARE ACCESS TO THIS REPOSITORY WITHOUT EXPLICIT AUTHORIZATION**
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables and secrets
.env
.env.*
.env.local
.env.production
.env.staging
!.env.example

# Docker
.docker/
docker-compose.override.yml
volumes/

# Build artifacts
dist/
build/
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Deployment outputs
deployments.json
*.deployment.json

# Temporary files
*.tmp
*.temp
.cache/

# Security
*.pem
*.key
*.p12
*.p8
secrets/
config/secrets.json

# CI/CD
.github/workflows/*.local.yml
EOF

# Create package.json for infrastructure management
cat > package.json << 'EOF'
{
  "name": "duration-infrastructure-private",
  "version": "1.0.0",
  "description": "Private infrastructure configurations for Duration Give Protocol - CI/CD, Docker, and Deployment",
  "scripts": {
    "start:docker": "cd docker && docker-compose up -d",
    "stop:docker": "cd docker && docker-compose down",
    "deploy:main": "cd scripts/deploy && npx ts-node deploy.ts",
    "deploy:verification": "cd scripts/deploy && npx ts-node deploy-verification.ts",
    "deploy:distribution": "cd scripts/deploy && npx ts-node deploy-distribution.ts",
    "lint:solidity": "solhint 'contracts/**/*.sol'",
    "build:docs": "cd docs && bundle exec jekyll build"
  },
  "dependencies": {
    "hardhat": "^2.19.4",
    "ethers": "^6.10.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.24",
    "ts-node": "^10.9.2"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/civicmastery/Duration-Infrastructure-Private.git"
  },
  "private": true
}
EOF

echo "Infrastructure repository structure created!"
echo ""
echo "Next steps:"
echo "1. Create the GitHub repository: https://github.com/civicmastery/Duration-Infrastructure-Private"
echo "2. Run the commit script to push files"