#!/bin/bash

# Setup script for Duration-Backend-Private repository
# Run this after creating the empty private repo on GitHub

echo "Setting up Duration-Backend-Private repository..."

# Change to parent directory
cd ..

# Clone the private repository (replace with your actual repo URL)
echo "Cloning private repository..."
git clone https://github.com/GiveProtocol/Duration-Backend-Private.git

# Enter the private repo directory
cd Duration-Backend-Private

# Create directory structure
echo "Creating directory structure..."
mkdir -p supabase/functions
mkdir -p supabase/migrations
mkdir -p src/lib/api
mkdir -p src/pages/admin
mkdir -p src/utils/monitoring
mkdir -p src/middleware

# Copy all Supabase files (database migrations, functions, config)
echo "Copying Supabase database files..."
cp -r ../Duration-Give/supabase/migrations/* supabase/migrations/ 2>/dev/null || echo "No migrations to copy"
cp -r ../Duration-Give/supabase/functions/* supabase/functions/ 2>/dev/null || echo "No functions to copy"
cp ../Duration-Give/supabase/config.toml supabase/ 2>/dev/null || echo "No config.toml to copy"

# Copy backend library files
echo "Copying backend library files..."
cp ../Duration-Give/src/lib/supabase.ts src/lib/
cp ../Duration-Give/src/lib/auth.ts src/lib/
cp ../Duration-Give/src/lib/sentry.ts src/lib/
cp -r ../Duration-Give/src/lib/api/* src/lib/api/

# Copy admin panel (entire directory)
echo "Copying admin panel..."
cp -r ../Duration-Give/src/pages/admin/* src/pages/admin/

# Copy monitoring and security utilities
echo "Copying monitoring utilities..."
cp -r ../Duration-Give/src/utils/monitoring/* src/utils/monitoring/ 2>/dev/null || echo "No monitoring utils to copy"
cp ../Duration-Give/src/middleware/security.ts src/middleware/ 2>/dev/null || echo "No security middleware to copy"

# Create package.json for dependencies
echo "Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "duration-backend-private",
  "version": "1.0.0",
  "description": "Private backend infrastructure for Duration Give Protocol",
  "main": "index.js",
  "scripts": {
    "dev": "supabase start",
    "stop": "supabase stop",
    "reset": "supabase db reset",
    "generate-types": "supabase gen types typescript --local > src/types/database.ts"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.7",
    "@sentry/react": "^9.24.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
EOF

# Create README.md
echo "Creating README..."
cat > README.md << 'EOF'
# Duration Backend Private

Private backend infrastructure for Duration Give Protocol.

## Contents

- **Database Migrations**: Complete schema and RLS policies
- **Admin Panel**: Administrative interface components  
- **Authentication**: User auth and session management
- **API Layer**: Supabase client and queries
- **Monitoring**: Error tracking and performance monitoring

## Security

This repository contains sensitive business logic and should remain private.

- Database schema reveals complete platform architecture
- Admin functions provide operational control
- API implementations show integration patterns

## Setup

1. Install Supabase CLI
2. Run `npm install`
3. Configure environment variables
4. Run `supabase start` for local development

## Access Control

Only authorized team members should have access to this repository.
EOF

# Create .gitignore
echo "Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*.log

# Environment variables
.env
.env.*
!.env.example

# Supabase
.supabase/
supabase/.temp/

# Build artifacts
dist/
build/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF

# Initialize git and commit
echo "Initializing git repository..."
git add .
git commit -m "Initial backend setup

- Add 45+ database migrations with complete schema
- Include 9 admin panel components (131KB+ of admin functionality)  
- Backend API layer with Supabase client and authentication
- Monitoring and error tracking utilities
- Security middleware and utilities

Contains sensitive business logic - keep private."

echo "Repository setup complete!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Verify all files were copied correctly"
echo "3. Remove these files from the public repository"
echo ""
echo "Files ready to commit: $(git ls-files | wc -l) files"
EOF