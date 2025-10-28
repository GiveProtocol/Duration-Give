#!/bin/bash

# Migrate documentation to give-protocol-docs repository

set -e

SOURCE_DIR="/home/drigo/projects/Duration"
TARGET_DIR="/home/drigo/projects/give-protocol-docs"

echo "Creating give-protocol-docs repository..."

# Create target directory
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

# Initialize git if not exists
if [ ! -d ".git" ]; then
    git init
    echo "Git repository initialized"
fi

# Copy docs directory
echo "Copying documentation site..."
if [ -d "$SOURCE_DIR/docs" ]; then
    cp -r "$SOURCE_DIR/docs/"* .
fi

# Copy documentation markdown files
echo "Copying documentation files..."
mkdir -p guides
cp "$SOURCE_DIR/DOCS_SETUP.md" guides/ 2>/dev/null || true
cp "$SOURCE_DIR/DOCS-PREVIEW-GUIDE.md" guides/ 2>/dev/null || true
cp "$SOURCE_DIR/documentation-guidelines.md" guides/ 2>/dev/null || true
cp "$SOURCE_DIR/DEPLOY_TO_MOONBASE.md" guides/ 2>/dev/null || true
cp "$SOURCE_DIR/PRIVATE_REPOS_SETUP.md" guides/ 2>/dev/null || true
cp "$SOURCE_DIR/MANUAL_SETUP_STEPS.md" guides/ 2>/dev/null || true
cp "$SOURCE_DIR/SSH_SETUP.md" guides/ 2>/dev/null || true

# Create technical documentation directory
mkdir -p technical
cp "$SOURCE_DIR/SECURITY.md" technical/ 2>/dev/null || true
cp "$SOURCE_DIR/FUZZING.md" technical/ 2>/dev/null || true

# Create .gitignore
echo "Creating .gitignore..."
cat > .gitignore <<'EOF'
# Jekyll
_site
.sass-cache
.jekyll-cache
.jekyll-metadata
vendor
.bundle

# Ruby
Gemfile.lock
*.gem

# Build outputs
dist
build
out

# Logs
*.log

# OS
.DS_Store
Thumbs.db

# Editor
.vscode
.idea
*.swp
*.swo
*~

# Temp
.temp
tmp
EOF

# Create or update README.md
echo "Creating README.md..."
cat > README.md <<'EOF'
# Give Protocol - Documentation

Comprehensive documentation for Give Protocol, including user guides, technical documentation, API references, and integration guides.

## Overview

This repository contains the official documentation site for Give Protocol, built with Jekyll and hosted on GitHub Pages.

## Documentation Structure

```
├── introduction/          # Project overview and concepts
├── getting-started/       # Quick start guides
├── user-guides/           # User documentation
│   ├── donor/            # Donor guides
│   ├── charity/          # Charity guides
│   └── volunteer/        # Volunteer guides
├── platform-features/     # Feature documentation
├── technical/             # Technical documentation
│   ├── contracts/        # Smart contract docs
│   ├── api/              # API documentation
│   └── integration/      # Integration guides
├── resources/             # Additional resources
├── safety-security/       # Security guidelines
└── help-center/          # FAQ and support
```

## Local Development

### Prerequisites

- Ruby 2.7+
- Bundler
- Jekyll

### Setup

```bash
# Install dependencies
bundle install

# Run local server
bundle exec jekyll serve

# View at http://localhost:4000
```

### Building

```bash
# Production build
JEKYLL_ENV=production bundle exec jekyll build
```

## Contributing to Documentation

### Adding New Pages

1. Create a new markdown file in the appropriate directory
2. Add front matter with layout and title
3. Write content using Markdown
4. Test locally before committing

Example front matter:
```yaml
---
layout: default
title: Your Page Title
description: Brief description
---
```

### Search Index

After adding or updating documentation:

```bash
# Regenerate search index
node generate-search.cjs
```

## Translation

Documentation is available in multiple languages:
- English (default)
- Spanish (`/es`)
- Chinese (`/zh`)

To add a new language:
1. Create language directory (e.g., `/fr`)
2. Copy English documentation structure
3. Translate content
4. Update `_config.yml` with new language

## Deployment

Documentation is automatically deployed to GitHub Pages on push to main branch.

Manual deployment:
```bash
# Build production site
JEKYLL_ENV=production bundle exec jekyll build

# Deploy _site directory to hosting
```

## Documentation Guidelines

- Use clear, concise language
- Include code examples where appropriate
- Add images/diagrams for complex concepts
- Keep technical accuracy high
- Cross-reference related pages

See `guides/documentation-guidelines.md` for detailed guidelines.

## Links

- [Live Documentation](https://docs.giveprotocol.io)
- [Main Repository](https://github.com/give-protocol)
- [Report Issues](https://github.com/give-protocol/give-protocol-docs/issues)

## License

UNLICENSED - Private Repository
EOF

# Create package.json for search generation
echo "Creating package.json..."
cat > package.json <<'EOF'
{
  "name": "give-protocol-docs",
  "version": "1.0.0",
  "description": "Documentation site for Give Protocol",
  "private": true,
  "scripts": {
    "serve": "bundle exec jekyll serve",
    "build": "JEKYLL_ENV=production bundle exec jekyll build",
    "search": "node generate-search.cjs",
    "deploy": "npm run build && npm run deploy:site"
  },
  "devDependencies": {}
}
EOF

# Create Gemfile if it doesn't exist
if [ ! -f "Gemfile" ]; then
    echo "Creating Gemfile..."
    cat > Gemfile <<'EOF'
source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "webrick", "~> 1.7"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
end
EOF
fi

# Create GitHub Pages deployment workflow
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml <<'EOF'
name: Deploy Documentation

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          bundler-cache: true

      - name: Build site
        run: bundle exec jekyll build
        env:
          JEKYLL_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: _site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
EOF

echo "✓ give-protocol-docs repository created successfully at $TARGET_DIR"
