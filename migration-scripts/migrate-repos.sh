#!/bin/bash

# Give Protocol Repository Migration Script
# This script helps migrate from monorepo to multi-repo structure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CURRENT_DIR="/home/drigo/projects/Duration"
PROJECTS_DIR="/home/drigo/projects"
MIGRATION_DIR="$CURRENT_DIR/migration-scripts"

# Repository names
CONTRACTS_REPO="give-protocol-contracts"
WEBAPP_REPO="give-protocol-webapp"
BACKEND_REPO="give-protocol-backend"
DOCS_REPO="give-protocol-docs"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Give Protocol Repository Migration${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to print step
print_step() {
    echo -e "${GREEN}==>${NC} $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}WARNING:${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}ERROR:${NC} $1"
}

# Safety check
echo -e "${YELLOW}This will create 4 new repositories in: $PROJECTS_DIR${NC}"
echo -e "${YELLOW}The following repositories will be created:${NC}"
echo "  1. $CONTRACTS_REPO"
echo "  2. $WEBAPP_REPO"
echo "  3. $BACKEND_REPO"
echo "  4. $DOCS_REPO"
echo ""
echo -e "${YELLOW}Your current repositories will NOT be modified.${NC}"
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [[ $confirm != "yes" ]]; then
    echo "Migration cancelled."
    exit 0
fi

# Create backup
print_step "Creating backup timestamp file..."
date +%Y%m%d_%H%M%S > "$MIGRATION_DIR/migration-timestamp.txt"

# Run individual migration scripts
print_step "Step 1/4: Migrating smart contracts..."
bash "$MIGRATION_DIR/migrate-contracts.sh"

print_step "Step 2/4: Migrating webapp..."
bash "$MIGRATION_DIR/migrate-webapp.sh"

print_step "Step 3/4: Migrating backend..."
bash "$MIGRATION_DIR/migrate-backend.sh"

print_step "Step 4/4: Migrating documentation..."
bash "$MIGRATION_DIR/migrate-docs.sh"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Migration Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "New repositories created in: $PROJECTS_DIR"
echo ""
echo "Next steps:"
echo "  1. Review each repository for completeness"
echo "  2. Initialize git repositories if not already done"
echo "  3. Create GitHub repositories and push"
echo "  4. Set up CI/CD for each repository"
echo "  5. Update cross-repository references"
echo ""
echo "See MIGRATION-GUIDE.md for detailed next steps."
