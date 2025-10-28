#!/bin/bash

# Migrate webapp to give-protocol-webapp repository

set -e

SOURCE_DIR="/home/drigo/projects/Duration"
TARGET_DIR="/home/drigo/projects/give-protocol-webapp"

echo "Creating give-protocol-webapp repository..."

# Create target directory
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

# Initialize git if not exists
if [ ! -d ".git" ]; then
    git init
    echo "Git repository initialized"
fi

# Copy source code
echo "Copying React application source..."
cp -r "$SOURCE_DIR/src" .

# Copy public assets
echo "Copying public assets..."
cp -r "$SOURCE_DIR/public" .

# Copy root files
echo "Copying HTML entry point..."
cp "$SOURCE_DIR/index.html" .
cp "$SOURCE_DIR/main.ts" . 2>/dev/null || true

# Copy configuration files
echo "Copying build configurations..."
cp "$SOURCE_DIR/vite.config.ts" .
cp "$SOURCE_DIR/tsconfig.json" .
cp "$SOURCE_DIR/tsconfig.app.json" .
cp "$SOURCE_DIR/tsconfig.node.json" .
cp "$SOURCE_DIR/tailwind.config.js" .
cp "$SOURCE_DIR/postcss.config.js" .

# Copy linting and formatting
echo "Copying code quality configs..."
cp "$SOURCE_DIR/.eslintrc.cjs" . 2>/dev/null || true
cp "$SOURCE_DIR/.eslintrc.json" . 2>/dev/null || true
cp "$SOURCE_DIR/.eslintrc.test.js" . 2>/dev/null || true

# Copy testing configs
echo "Copying test configurations..."
cp "$SOURCE_DIR/jest.config.cjs" . 2>/dev/null || true
cp "$SOURCE_DIR/jest.config.mjs" . 2>/dev/null || true
cp "$SOURCE_DIR/jest.env.cjs" . 2>/dev/null || true
cp "$SOURCE_DIR/babel.config.cjs" . 2>/dev/null || true
cp "$SOURCE_DIR/cypress.config.ts" . 2>/dev/null || true
if [ -d "$SOURCE_DIR/cypress" ]; then
    cp -r "$SOURCE_DIR/cypress" .
fi

# Copy Supabase
echo "Copying Supabase configuration..."
if [ -d "$SOURCE_DIR/supabase" ]; then
    cp -r "$SOURCE_DIR/supabase" .
fi

# Copy deployment configs
echo "Copying deployment configurations..."
cp "$SOURCE_DIR/vercel.json" . 2>/dev/null || true
cp "$SOURCE_DIR/nginx.conf" . 2>/dev/null || true

# Copy GitHub workflows (if any webapp-specific ones)
if [ -d "$SOURCE_DIR/.github" ]; then
    mkdir -p .github
    cp -r "$SOURCE_DIR/.github/"* .github/ 2>/dev/null || true
fi

# Copy VSCode settings
if [ -d "$SOURCE_DIR/.vscode" ]; then
    cp -r "$SOURCE_DIR/.vscode" .
fi

# Copy Claude Code configs
if [ -d "$SOURCE_DIR/.claude" ]; then
    cp -r "$SOURCE_DIR/.claude" .
fi

# Copy documentation
echo "Copying development documentation..."
cp "$SOURCE_DIR/CLAUDE.md" . 2>/dev/null || true
cp "$SOURCE_DIR/CLAUDE_CODE_RULES.md" . 2>/dev/null || true
cp "$SOURCE_DIR/TEST_GUIDELINES.md" . 2>/dev/null || true
cp "$SOURCE_DIR/CODE_QUALITY_REPORT.md" . 2>/dev/null || true

# Copy quality tools configs
cp "$SOURCE_DIR/.deepsource.toml" . 2>/dev/null || true
cp "$SOURCE_DIR/sonar-project.properties" . 2>/dev/null || true

# Copy Sentry setup
cp "$SOURCE_DIR/SENTRY_SETUP.md" . 2>/dev/null || true

# Create package.json for webapp
echo "Creating package.json..."
cat > package.json <<'EOF'
{
  "name": "give-protocol-webapp",
  "version": "1.0.0",
  "description": "Progressive Web App for Give Protocol - Blockchain-based charitable giving platform",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:app": "tsc && vite build --mode app",
    "preview": "vite preview",
    "lint": "npx eslint@8.57.0 src --ext .ts,.tsx,.js,.jsx --max-warnings 200",
    "lint:report": "eslint src --ext .ts,.tsx,.js,.jsx --format json --output-file eslint-report.json || true",
    "test": "NODE_OPTIONS='--experimental-vm-modules' jest --config jest.config.mjs --passWithNoTests",
    "test:e2e": "cypress open",
    "test:e2e:headless": "cypress run",
    "sonar": "sonar-scanner"
  },
  "dependencies": {
    "@sentry/react": "^9.24.0",
    "@supabase/supabase-js": "^2.39.7",
    "@tailwindcss/typography": "^0.5.10",
    "@tanstack/react-query": "^5.24.1",
    "@tiptap/core": "^2.2.4",
    "@tiptap/extension-link": "^2.2.4",
    "@tiptap/pm": "^2.2.4",
    "@tiptap/react": "^2.2.4",
    "@tiptap/starter-kit": "^2.2.4",
    "buffer": "^6.0.3",
    "clsx": "^2.1.0",
    "ethers": "^6.14.0",
    "fp-ts": "^2.16.10",
    "gray-matter": "^4.0.3",
    "html2canvas": "^1.4.1",
    "i18next": "^23.10.0",
    "i18next-browser-languagedetector": "^7.2.0",
    "jspdf": "^3.0.2",
    "lucide-react": "^0.344.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^14.0.5",
    "react-router-dom": "^6.22.3",
    "react-window": "^1.8.10",
    "tailwind-merge": "^2.2.1",
    "viem": "^2.7.9"
  },
  "devDependencies": {
    "@babel/core": "^7.28.0",
    "@babel/preset-env": "^7.28.0",
    "@babel/preset-react": "^7.27.1",
    "@babel/preset-typescript": "^7.27.1",
    "@jest/globals": "^30.1.2",
    "@testing-library/jest-dom": "^6.6.4",
    "@testing-library/react": "^16.3.0",
    "@types/jest": "^30.0.0",
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "@types/react-window": "^1.8.8",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "babel-jest": "^30.0.5",
    "cypress": "^13.0.0",
    "dotenv": "^16.4.7",
    "eslint": "^8.57.0",
    "eslint-plugin-jest": "^27.9.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "globals": "^15.0.0",
    "jest": "^30.0.5",
    "jest-environment-jsdom": "^30.0.5",
    "postcss": "^8.4.35",
    "sonarqube-scanner": "^4.3.0",
    "tailwindcss": "^3.4.1",
    "terser": "^5.27.2",
    "ts-jest": "^29.4.0",
    "typescript": "^5.3.3",
    "typescript-eslint": "^7.1.0",
    "vite": "^5.4.20",
    "vite-plugin-compression": "^0.5.1"
  }
}
EOF

# Create .gitignore
echo "Creating .gitignore..."
cat > .gitignore <<'EOF'
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage
.nyc_output
cypress/videos
cypress/screenshots

# Production
dist
build
*.tsbuildinfo

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
lerna-debug.log*

# Editor
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build outputs
vite.log
dev-server.log
eslint-report.json

# SonarQube
.scannerwork

# Misc
.cache
.temp
tmp
EOF

# Create README.md
echo "Creating README.md..."
cat > README.md <<'EOF'
# Give Protocol - Web Application

Progressive Web App (PWA) for Give Protocol, a blockchain-based charitable giving platform.

## Features

- 🎯 Donor dashboard with real-time donation tracking
- 🏢 Charity management portal
- 💼 Volunteer verification system
- 📊 Analytics and impact reporting
- 🔐 Web3 wallet integration (MetaMask, WalletConnect)
- 🌍 Multi-language support (i18next)
- 📱 Progressive Web App capabilities

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Blockchain**: ethers.js, viem
- **Backend**: Supabase
- **Monitoring**: Sentry
- **Testing**: Jest, Cypress

## Setup

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_MOONBASE_RPC_URL=
```

## Development

```bash
# Start dev server
npm run dev

# Run tests
npm run test

# Run linter
npm run lint

# E2E tests
npm run test:e2e
```

## Building

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Code Quality

This project follows strict code quality standards:
- DeepSource analysis
- SonarQube integration
- See CLAUDE_CODE_RULES.md for detailed guidelines

## Deployment

Deploy to Vercel or any static hosting provider:

```bash
npm run build
# Deploy dist/ folder
```

## Documentation

- [Development Guidelines](CLAUDE.md)
- [Code Quality Rules](CLAUDE_CODE_RULES.md)
- [Testing Guidelines](TEST_GUIDELINES.md)

## License

UNLICENSED - Private Repository
EOF

# Create .env.example
echo "Creating .env.example..."
cat > .env.example <<'EOF'
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Blockchain
VITE_MOONBASE_RPC_URL=https://rpc.api.moonbase.moonbeam.network
VITE_MOONBEAM_RPC_URL=

# Contract Addresses
VITE_DONATION_CONTRACT_ADDRESS=
VITE_VERIFICATION_CONTRACT_ADDRESS=
VITE_DISTRIBUTION_CONTRACT_ADDRESS=

# Monitoring (Optional)
VITE_SENTRY_DSN=
VITE_MONITORING_API_KEY=
VITE_MONITORING_APP_ID=
VITE_MONITORING_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_WEB3=true
EOF

echo "✓ give-protocol-webapp repository created successfully at $TARGET_DIR"
