# Quick Jekyll Setup (Permissions Fix)

## Fix Ruby Gem Permissions

Instead of installing system-wide, install to your user directory:

```bash
# Install bundler to user directory (no sudo needed)
gem install bundler --user-install

# Add user gem path to your PATH (for this session)
export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH"

# To make this permanent, add to your ~/.bashrc or ~/.zshrc:
echo 'export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH"' >> ~/.bashrc
```

## Alternative: Use rbenv (Recommended for long-term)

If you plan to do more Ruby development:

```bash
# Install rbenv
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash

# Add to PATH
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc

# Install Ruby through rbenv
rbenv install 3.2.0
rbenv global 3.2.0
gem install bundler
```

## Quick Test

After installing bundler, test the documentation:

```bash
cd docs
bundle install
bundle exec jekyll serve --livereload
```

Then visit: http://localhost:4000

## What You'll See

The modern documentation with:
- Dark/light theme toggle
- Multi-language dropdown (12 languages)
- Advanced search functionality
- Braver-inspired clean layout
- Mobile responsive design
- Analytics tracking

## Files to Check

Key updated files you can review:
- `docs/_layouts/default.html` - Main layout with modern features
- `docs/index.md` - Homepage content
- `docs/assets/css/main.scss` - Modern styling
- `docs/search.json` - Search functionality data