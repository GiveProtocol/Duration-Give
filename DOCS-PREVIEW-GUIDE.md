# Documentation Preview Guide

## Current Status
The documentation has been updated with a modern Braver-inspired layout including:
- Dark/light theme toggle
- Multi-language support (12 languages)
- Advanced search functionality
- Analytics tracking with cookies
- Responsive design
- Settings dropdown

## Quick Local Preview

### Prerequisites
```bash
# Install Ruby (if not already installed)
sudo apt update
sudo apt install ruby-full build-essential zlib1g-dev

# Install Bundler
gem install bundler
```

### Start Local Development Server
```bash
# Navigate to docs directory
cd docs

# Install dependencies
bundle install

# Start Jekyll development server
bundle exec jekyll serve --livereload

# Or with custom configuration
bundle exec jekyll serve --config _config.yml,_config.production.yml --livereload
```

### Preview URL
After starting the server, visit: http://localhost:4000

### What You'll See
1. **Modern Layout**: Clean, Braver-inspired design with sidebar navigation
2. **Theme Toggle**: Light/dark mode switch in settings dropdown
3. **Language Options**: 12 language options with Google Translate integration
4. **Search Functionality**: Advanced search with live results
5. **Analytics**: Cookie-based page activity tracking
6. **Responsive Design**: Mobile-friendly navigation and layout

## Key Files Changed This Week
- `_layouts/default.html` - Complete redesign with modern layout
- `search.json` - Enhanced search data structure
- `assets/css/main.scss` - Modern styling with theme support
- `assets/js/i18n-helper.js` - Multi-language support
- Various content pages updated

## Testing Checklist
- [ ] Homepage loads correctly
- [ ] Search functionality works
- [ ] Theme toggle (light/dark) functions
- [ ] Language switching operates
- [ ] Mobile responsive design
- [ ] All navigation links work
- [ ] Analytics tracking functions (check browser dev tools)

## Live Site Issue
The GitHub Pages deployment was broken when infrastructure files were moved to private repository. 
The `deploy-docs.yml` workflow needs to be restored to public repo for automatic deployment.

## Next Steps
1. Preview changes locally
2. Confirm design meets expectations
3. Deploy workflow restoration if approved
4. Monitor live site deployment