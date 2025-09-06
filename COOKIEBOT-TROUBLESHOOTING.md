# Cookiebot Troubleshooting Guide

## Current Issues Fixed

I've identified and fixed the main issue with your Cookiebot setup. The problem was that the consent update listeners were missing. I've added the following code to `index.html`:

```javascript
// Listen for Cookiebot consent updates
window.addEventListener("CookiebotOnConsentReady", function () {
  if (Cookiebot.consent.statistics) {
    gtag("consent", "update", {
      analytics_storage: "granted",
    });
  }
  if (Cookiebot.consent.marketing) {
    gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  }
  if (Cookiebot.consent.preferences) {
    gtag("consent", "update", {
      functionality_storage: "granted",
      personalization_storage: "granted",
    });
  }
});
```

## Testing Cookiebot

### 1. Verify Domain Configuration

First, ensure your domain is properly configured in your Cookiebot account:

1. Log in to your Cookiebot account
2. Go to Settings → Domains
3. Verify that your domain (both localhost for development and your production domain) are listed
4. Check that the Domain Group ID matches: `319f86f1-9698-4506-8ddf-e6245f77b1d6`

### 2. Test in Development

Run the development server and check:

```bash
npm run dev
```

Open Developer Tools (F12) and check:

1. **Console Tab**: Look for any errors related to Cookiebot
2. **Network Tab**: Verify that `https://consent.cookiebot.com/uc.js` loads successfully
3. **Application Tab → Cookies**: Check if Cookiebot cookies are set

### 3. Common Issues and Solutions

#### Banner Not Showing

1. **Check Console for Errors**:

   ```javascript
   // In browser console, check if Cookiebot is loaded
   console.log(
     typeof Cookiebot !== "undefined"
       ? "Cookiebot loaded"
       : "Cookiebot NOT loaded",
   );
   ```

2. **Verify CSP Headers**: The Content Security Policy must include:
   - `script-src`: `https://consent.cookiebot.com https://consentcdn.cookiebot.com`
   - `frame-src`: `https://consentcdn.cookiebot.com`

3. **Check Domain Whitelist**: In Cookiebot dashboard, ensure your development domain (localhost:5173) is whitelisted

#### Consent Not Updating

1. **Test Consent Events**:

   ```javascript
   // Add this temporarily to test
   window.addEventListener("CookiebotOnConsentReady", function () {
     console.log("Cookiebot consent ready:", Cookiebot.consent);
   });
   ```

2. **Manual Consent Test**:
   ```javascript
   // Force show banner for testing
   Cookiebot.show();
   ```

#### Google Analytics Not Tracking

1. **Verify Consent State**:

   ```javascript
   // Check current consent state
   console.log("Analytics consent:", Cookiebot.consent.statistics);
   ```

2. **Check DataLayer**:
   ```javascript
   // View consent events
   console.log(window.dataLayer);
   ```

### 4. Production Deployment Checklist

- [ ] Domain is configured in Cookiebot dashboard
- [ ] Production domain is whitelisted
- [ ] SSL certificate is valid (Cookiebot requires HTTPS)
- [ ] CSP headers include Cookiebot domains
- [ ] Consent update listeners are in place
- [ ] Cookie declaration page is accessible at `/safety-security/cookie-policy/`

### 5. Debug Mode

For detailed debugging, you can enable Cookiebot debug mode:

```javascript
// Add this before the Cookiebot script
window.CookiebotDebug = true;
```

### 6. Testing Different Scenarios

1. **First-time visitor**: Clear all cookies and reload
2. **Returning visitor**: Accept cookies, reload, check if preferences persist
3. **Consent withdrawal**: Use Cookiebot.withdraw() to test consent removal
4. **Different regions**: Use VPN to test GDPR vs non-GDPR behavior

### 7. Verification Steps

After implementation, verify:

1. Banner appears on first visit
2. Consent choices are saved
3. Google Analytics only tracks after consent
4. Cookie declaration page works
5. Consent can be withdrawn

## Contact Support

If issues persist after following this guide:

1. Check Cookiebot status page: https://status.cookiebot.com/
2. Contact Cookiebot support with:
   - Your Domain Group ID: `319f86f1-9698-4506-8ddf-e6245f77b1d6`
   - Browser console errors
   - Network tab screenshots
   - Description of the issue

## Additional Resources

- [Cookiebot Developer Documentation](https://www.cookiebot.com/en/developer/)
- [Google Consent Mode Guide](https://support.google.com/analytics/answer/9976101)
- [CSP Testing Tool](https://csp-evaluator.withgoogle.com/)
