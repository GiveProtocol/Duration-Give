# Documentation Preview Options

## Current Status
Jekyll server is running but localhost connection may be blocked by WSL networking.

## Option 1: WSL Port Forwarding (Try this first)
```bash
# In Windows PowerShell (as Administrator), run:
netsh interface portproxy add v4tov4 listenport=4000 listenaddress=0.0.0.0 connectport=4000 connectaddress=127.0.0.1

# Then visit: http://localhost:4000
```

## Option 2: Use WSL IP Address
```bash
# Find your WSL IP address:
hostname -I

# Then visit: http://[WSL_IP]:4000
# Example: http://172.24.123.45:4000
```

## Option 3: Static File Preview
Since Jekyll has already built the site, you can preview the generated files:

```bash
# The built site is in: docs/_site/
# You can open the HTML files directly or serve with Python:

cd docs/_site
python3 -m http.server 8080

# Then visit: http://localhost:8080
```

## Option 4: Manual File Review
You can examine the key files directly to see the changes:

### Updated Layout File
- `docs/_layouts/default.html` - Main layout with modern features

### Homepage Content  
- `docs/index.md` - Homepage with new design

### Key Features to Look For
1. **Modern Header**: Logo + "Give Protocol Docs" title
2. **Settings Dropdown**: Gear icon with theme/language options
3. **Sidebar Navigation**: Organized sections (Getting Started, User Guides, etc.)
4. **Search Box**: At top of sidebar
5. **Footer**: Copyright with links to main site, privacy, terms, GitHub

### Design Elements
- Clean, minimal design
- Dark/light theme support
- 12-language multi-language dropdown
- Responsive mobile layout
- Breadcrumb navigation
- Page metadata (publish/update dates)

## Summary of This Week's Updates
Based on git commits, the major changes include:
- Complete layout redesign with Braver-inspired styling
- Advanced search functionality with SimpleJekyllSearch
- Multi-language support with Google Translate integration
- Cookie-based analytics for page tracking
- Theme switching (light/dark mode)
- Mobile-responsive navigation
- Enhanced typography and spacing