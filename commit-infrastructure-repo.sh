#!/bin/bash

echo "Committing files to Duration-Infrastructure-Private repository..."

# Navigate to the private repository
cd ../Duration-Infrastructure-Private

# Set the default branch to main
git branch -m main

# Add all files
git add .

# Show what's being committed
echo "Files to be committed:"
git status --porcelain

# Create commit
git commit -m "Initial infrastructure repository setup

🔒 PRIVATE: Critical deployment and CI/CD infrastructure

GitHub Actions Workflows:
- deploy-docs.yml - Jekyll documentation deployment to GitHub Pages
- solhint.yml - Solidity smart contract linting and quality checks

Deployment Scripts (TypeScript):
- deploy.ts - Main DurationDonation contract deployment to Moonbase Alpha
- deploy-verification.ts - VolunteerVerification contract deployment
- deploy-distribution.ts - CharityScheduledDistribution and DistributionExecutor deployment

Docker Configuration:
- docker-compose.yml - Complete Supabase local development stack
  - PostgreSQL database with secure environment variables
  - Supabase Studio, Kong gateway, Auth (GoTrue)
  - PostgREST API, Realtime, and Meta services

Netlify Configuration:
- netlify.toml - Production deployment settings
  - Security headers (CSP, HSTS, X-Frame-Options)
  - Asset optimization and caching
  - Environment-specific build commands

CONTAINS SENSITIVE INFRASTRUCTURE - KEEP PRIVATE

This code reveals:
- Complete deployment infrastructure and CI/CD pipelines
- Docker configurations with service orchestration details
- Netlify security configurations and headers
- Smart contract deployment strategies and network configurations
- Service architecture and infrastructure patterns"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "Private infrastructure repository setup complete!"
echo ""
echo "Repository contains:"
echo "- $(find .github/workflows -name "*.yml" | wc -l) GitHub Actions workflow files"
echo "- $(find scripts/deploy -name "*.ts" | wc -l) deployment script files"
echo "- 1 Docker Compose configuration"
echo "- 1 Netlify deployment configuration"
echo ""
echo "Repository is PRIVATE and secure."