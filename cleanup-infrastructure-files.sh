#!/bin/bash

echo "Cleaning up infrastructure files from public repository..."

# Remove GitHub Actions workflows (keep .github directory for potential future public workflows)
if [ -f ".github/workflows/deploy-docs.yml" ]; then
    rm .github/workflows/deploy-docs.yml
    echo "Removed deploy-docs.yml"
fi

if [ -f ".github/workflows/solhint.yml" ]; then
    rm .github/workflows/solhint.yml
    echo "Removed solhint.yml"
fi

# Remove deployment scripts
if [ -f "scripts/deploy.ts" ]; then
    rm scripts/deploy.ts
    echo "Removed deploy.ts"
fi

if [ -f "scripts/deploy-verification.ts" ]; then
    rm scripts/deploy-verification.ts
    echo "Removed deploy-verification.ts"
fi

if [ -f "scripts/deploy-distribution.ts" ]; then
    rm scripts/deploy-distribution.ts
    echo "Removed deploy-distribution.ts"
fi

# Remove Docker configuration
if [ -f "docker-compose.yml" ]; then
    rm docker-compose.yml
    echo "Removed docker-compose.yml"
fi

# Remove Netlify configuration
if [ -f "netlify.toml" ]; then
    rm netlify.toml
    echo "Removed netlify.toml"
fi

# Check if any infrastructure files remain
echo ""
echo "Checking for remaining infrastructure files..."
remaining_files=0

if [ -f ".github/workflows/deploy-docs.yml" ] || [ -f ".github/workflows/solhint.yml" ]; then
    echo "WARNING: GitHub Actions workflows still present"
    remaining_files=$((remaining_files + 1))
fi

if [ -f "scripts/deploy.ts" ] || [ -f "scripts/deploy-verification.ts" ] || [ -f "scripts/deploy-distribution.ts" ]; then
    echo "WARNING: Deployment scripts still present"
    remaining_files=$((remaining_files + 1))
fi

if [ -f "docker-compose.yml" ]; then
    echo "WARNING: Docker configuration still present"
    remaining_files=$((remaining_files + 1))
fi

if [ -f "netlify.toml" ]; then
    echo "WARNING: Netlify configuration still present"
    remaining_files=$((remaining_files + 1))
fi

if [ $remaining_files -eq 0 ]; then
    echo "All infrastructure files successfully removed from public repository"
else
    echo "WARNING: $remaining_files infrastructure file(s) still remain"
fi

echo ""
echo "Summary of cleaned files:"
echo "- GitHub Actions workflows moved to private repo"
echo "- Deployment scripts moved to private repo"  
echo "- Docker configuration moved to private repo"
echo "- Netlify configuration moved to private repo"
echo ""
echo "Infrastructure files are now secure in Duration-Infrastructure-Private"