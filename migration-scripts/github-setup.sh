#!/bin/bash

# GitHub Setup Script for Give Protocol Repositories
# This script helps set up git remotes and push to GitHub

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Give Protocol - GitHub Setup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Get GitHub username/org
echo -e "${YELLOW}Enter your GitHub username or organization name:${NC}"
read -p "> " GITHUB_ORG

if [ -z "$GITHUB_ORG" ]; then
    echo "Error: GitHub username/org is required"
    exit 1
fi

echo ""
echo -e "${YELLOW}Choose repository visibility:${NC}"
echo "1) Private (recommended)"
echo "2) Public"
read -p "> " VISIBILITY_CHOICE

if [ "$VISIBILITY_CHOICE" == "2" ]; then
    VISIBILITY="public"
else
    VISIBILITY="private"
fi

echo ""
echo -e "${GREEN}Configuration:${NC}"
echo "  GitHub Org/User: $GITHUB_ORG"
echo "  Visibility: $VISIBILITY"
echo ""

read -p "Continue? (yes/no): " CONFIRM
if [[ $CONFIRM != "yes" ]]; then
    echo "Setup cancelled."
    exit 0
fi

# Repositories
REPOS=(
    "give-protocol-contracts"
    "give-protocol-webapp"
    "give-protocol-backend"
    "give-protocol-docs"
)

echo ""
echo -e "${BLUE}Step 1: Create Repositories on GitHub${NC}"
echo -e "${YELLOW}Please create the following repositories on GitHub:${NC}"
echo ""

for repo in "${REPOS[@]}"; do
    echo "  ✓ $GITHUB_ORG/$repo ($VISIBILITY)"
done

echo ""
echo "Go to: https://github.com/new"
echo ""
read -p "Press Enter when you've created all 4 repositories on GitHub..."

echo ""
echo -e "${BLUE}Step 2: Setting up Git Remotes and Pushing${NC}"
echo ""

# Function to setup and push repository
setup_repo() {
    local repo_name=$1
    local repo_path="/home/drigo/projects/$repo_name"

    echo -e "${GREEN}Setting up $repo_name...${NC}"

    cd "$repo_path"

    # Initialize git if needed
    if [ ! -d ".git" ]; then
        git init
    fi

    # Set default branch to main
    git branch -M main 2>/dev/null || git checkout -b main

    # Add all files
    git add .

    # Create initial commit if needed
    if ! git rev-parse HEAD >/dev/null 2>&1; then
        git commit -m "Initial commit: Migrated from Duration monorepo

- Repository restructure following multi-repo architecture
- Separated concerns: contracts, webapp, backend, docs
- Preserved all functionality and git history where applicable

Generated with Give Protocol migration scripts"
    fi

    # Add remote
    if git remote get-url origin >/dev/null 2>&1; then
        echo "  Remote 'origin' already exists, removing..."
        git remote remove origin
    fi

    git remote add origin "git@github.com:$GITHUB_ORG/$repo_name.git"

    # Push to GitHub
    echo "  Pushing to GitHub..."
    git push -u origin main --force

    echo -e "${GREEN}✓ $repo_name pushed successfully${NC}\n"
}

# Setup each repository
for repo in "${REPOS[@]}"; do
    setup_repo "$repo"
done

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All repositories pushed to GitHub!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your repositories:"
for repo in "${REPOS[@]}"; do
    echo "  • https://github.com/$GITHUB_ORG/$repo"
done
echo ""
echo "Next steps:"
echo "  1. Configure branch protection rules"
echo "  2. Set up GitHub Actions (CI/CD)"
echo "  3. Add collaborators if needed"
echo "  4. Configure repository secrets for deployments"
echo ""
echo "See MIGRATION-GUIDE.md for detailed next steps."
