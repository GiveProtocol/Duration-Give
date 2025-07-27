# Security Implementation

## Content Security Policy (CSP)

The Give Protocol documentation site implements a comprehensive Content Security Policy to prevent XSS attacks and other security vulnerabilities.

### Current CSP Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval'
  https://www.googletagmanager.com
  https://translate.google.com
  https://translate.googleapis.com
  https://consent.cookiebot.com;
style-src 'self' 'unsafe-inline'
  https://fonts.googleapis.com
  https://cdnjs.cloudflare.com;
font-src 'self'
  https://fonts.gstatic.com
  https://cdnjs.cloudflare.com
  data:;
img-src 'self' data: blob:
  https://www.googletagmanager.com
  https://www.google-analytics.com
  https://consent.cookiebot.com;
connect-src 'self'
  https://www.googletagmanager.com
  https://www.google-analytics.com
  https://consent.cookiebot.com
  https://translate.googleapis.com;
frame-src 'self'
  https://consent.cookiebot.com;
media-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

### Trusted Domains

**Analytics & Tracking:**

- `www.googletagmanager.com` - Google Analytics
- `www.google-analytics.com` - Google Analytics

**Translation Services:**

- `translate.google.com` - Google Translate widget
- `translate.googleapis.com` - Google Translate API

**Consent Management:**

- `consent.cookiebot.com` - Cookiebot GDPR compliance

**Fonts & CSS:**

- `fonts.googleapis.com` - Google Fonts CSS
- `fonts.gstatic.com` - Google Fonts files
- `cdnjs.cloudflare.com` - Font Awesome icons

### Additional Security Headers

- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **X-Frame-Options**: `DENY` - Prevents clickjacking attacks
- **X-XSS-Protection**: `1; mode=block` - Enables browser XSS protection
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Controls referrer information

### Security Fixes Applied

1. **XSS Prevention**: Fixed DOM-based XSS vulnerability in test-search.html
2. **Input Sanitization**: Added HTML escaping for user input in search functionality
3. **CSP Implementation**: Comprehensive policy blocking unauthorized resource loading
4. **Security Headers**: Multiple layers of protection against common attacks

### Maintenance

- CSP policy is configured in `_config.yml` under `security.content_security_policy`
- Applied to all layouts: `modern.html`, `documentation.html`, `default.html`
- Review and update quarterly or when adding new external resources

### Testing CSP

To test CSP compliance:

1. Open browser developer tools
2. Check Console for CSP violations
3. Review Network tab for blocked resources
4. Test with CSP Evaluator: https://csp-evaluator.withgoogle.com/

### Known Limitations

- `'unsafe-inline'` and `'unsafe-eval'` are allowed for scripts due to:
  - Google Analytics requirements
  - Dynamic search functionality
  - Google Translate widget
- Future improvement: Move inline scripts to external files with nonces
