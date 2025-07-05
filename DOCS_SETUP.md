# Documentation Setup Guide

This guide explains how to integrate your Jekyll documentation site with the Duration Give Protocol application.

## Current Configuration

The documentation links in the Duration app are currently configured to redirect to GitBook. All documentation URLs are now centralized in a single configuration file for easy management.

### Documentation URL Configuration

The documentation URL is configured in `/src/config/docs.ts`:

```typescript
export const DOCS_CONFIG = {
  url: process.env.VITE_DOCS_URL || 'https://give-protocol.gitbook.io',
};
```

## Switching to Jekyll Documentation

To switch from GitBook to your Jekyll documentation site:

### 1. Update the Environment Variable

Add the following to your `.env` file:

```bash
# For production Jekyll site
VITE_DOCS_URL=https://docs.giveprotocol.org

# For local development
VITE_DOCS_URL=http://localhost:4000
```

### 2. Alternative: Update the Default URL

You can also update the default URL in `/src/config/docs.ts`:

```typescript
export const DOCS_CONFIG = {
  // Change from GitBook to Jekyll site
  url: process.env.VITE_DOCS_URL || 'https://docs.giveprotocol.org',
};
```

## Jekyll Site Logo Integration

To add the Give Protocol logo to your Jekyll documentation site at `/mnt/c/Projects/Duration-Give/_docs`, you'll need to:

### 1. Copy the Logo Asset

The Give Protocol logo SVG can be found in the main app. You'll need to:

1. Copy the logo from the Duration project
2. Place it in your Jekyll site's assets folder (e.g., `/_docs/assets/images/`)

### 2. Update Jekyll Configuration

In your Jekyll `_config.yml`, add:

```yaml
# Site settings
title: Give Protocol Documentation
logo: /assets/images/give-protocol-logo.svg
```

### 3. Update Jekyll Layout

In your default layout (typically `_layouts/default.html`), add the logo to the header:

```html
<header>
  <nav>
    <a href="{{ site.baseurl }}/" class="logo">
      <img src="{{ site.baseurl }}{{ site.logo }}" alt="Give Protocol" height="32">
      <span>{{ site.title }}</span>
    </a>
    <!-- Rest of navigation -->
  </nav>
</header>
```

### 4. Style the Logo

Add appropriate CSS to style the logo:

```css
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo img {
  height: 32px;
  margin-right: 0.5rem;
}
```

## Files Updated

The following files have been updated to use the centralized documentation configuration:

1. `/src/components/AppNavbar.tsx` - Main app navigation bar
2. `/src/components/Navbar.tsx` - Landing page navigation
3. `/src/components/Footer.tsx` - Footer documentation link
4. `/src/pages/Documentation.tsx` - Documentation redirect page
5. `/src/routes/index.tsx` - Route configuration
6. `/src/config/docs.ts` - New centralized documentation configuration

## Testing the Integration

1. Start your Jekyll documentation site:
   ```bash
   cd /mnt/c/Projects/Duration-Give/_docs
   bundle exec jekyll serve
   ```

2. Update the `.env` file in the Duration project to point to your local Jekyll site:
   ```bash
   VITE_DOCS_URL=http://localhost:4000
   ```

3. Start the Duration development server:
   ```bash
   npm run dev
   ```

4. Click on any "Documentation" or "Docs" link in the app - it should now redirect to your Jekyll site.

## Notes

- All documentation links open in a new tab (`target="_blank"`) for better user experience
- The `/docs` route redirects to `/documentation` which then redirects to the external documentation site
- The configuration supports both environment variables and hardcoded URLs for flexibility