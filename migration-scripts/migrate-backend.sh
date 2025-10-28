#!/bin/bash

# Migrate backend to give-protocol-backend repository

set -e

SOURCE_DIR="/home/drigo/projects/Duration-Backend-Private"
TARGET_DIR="/home/drigo/projects/give-protocol-backend"

echo "Creating give-protocol-backend repository..."

# Check if source exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "WARNING: $SOURCE_DIR not found. Skipping backend migration."
    echo "You can manually rename Duration-Backend-Private to give-protocol-backend later."
    exit 0
fi

# Create target directory
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

# Copy entire backend repository
echo "Copying backend application..."
cp -r "$SOURCE_DIR/"* .
cp -r "$SOURCE_DIR/".git* . 2>/dev/null || true

# Update package.json name if it exists
if [ -f "package.json" ]; then
    echo "Updating package.json..."
    if command -v jq &> /dev/null; then
        jq '.name = "give-protocol-backend"' package.json > package.json.tmp && mv package.json.tmp package.json
    else
        sed -i 's/"name": "[^"]*"/"name": "give-protocol-backend"/' package.json
    fi
fi

# Create comprehensive .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    cat > .gitignore <<'GITIGNORE'
# Dependencies
node_modules
.pnp
.pnp.js

# Environment
.env
.env.local
.env.production.local
.env.development.local
.env.test.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Testing
coverage
.nyc_output

# Build
dist
build
.next
out
.cache

# Supabase
.supabase

# Editor
.vscode
.idea
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Misc
.temp
tmp
GITIGNORE
fi

# Update or create README.md
echo "Creating/updating README.md..."
cat > README.md <<'EOF'
# Give Protocol - Backend API

Backend services and API for Give Protocol, including GraphQL endpoints, database management, and blockchain indexing.

## Features

- 🔌 RESTful API endpoints
- 📊 GraphQL API (optional)
- 🗄️ Database management with Supabase
- 🔗 Blockchain event indexing
- 📧 Email integrations (MailChimp)
- 🔐 Authentication & authorization
- 📈 Analytics and reporting

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express/Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Blockchain Indexing**: SubQuery / The Graph
- **Email**: MailChimp API

## Setup

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env`:

```env
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
MOONBASE_RPC_URL=
MAILCHIMP_API_KEY=
```

## Development

```bash
# Start dev server
npm run dev

# Run tests
npm run test

# Database migrations
npm run migrate
```

## API Documentation

API documentation is available at `/api/docs` when running in development mode.

## Deployment

Configure your deployment platform with the necessary environment variables and deploy.

## License

UNLICENSED - Private Repository
EOF

# Create .env.example if it doesn't exist
if [ ! -f ".env.example" ]; then
    echo "Creating .env.example..."
    cat > .env.example <<'ENVEXAMPLE'
# Database
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_ANON_KEY=

# Blockchain
MOONBASE_RPC_URL=https://rpc.api.moonbase.moonbeam.network
MOONBEAM_RPC_URL=

# Contract Addresses
DONATION_CONTRACT_ADDRESS=
VERIFICATION_CONTRACT_ADDRESS=
DISTRIBUTION_CONTRACT_ADDRESS=

# Email
MAILCHIMP_API_KEY=
MAILCHIMP_SERVER_PREFIX=
MAILCHIMP_LIST_ID=

# Authentication
JWT_SECRET=
JWT_EXPIRY=7d

# API Keys
API_KEY_SALT=

# Environment
NODE_ENV=development
PORT=3001
ENVEXAMPLE
fi

echo "✓ give-protocol-backend repository created successfully at $TARGET_DIR"
echo ""
echo "NOTE: The original Duration-Backend-Private directory is still intact."
echo "After verifying the migration, you can safely delete it."
