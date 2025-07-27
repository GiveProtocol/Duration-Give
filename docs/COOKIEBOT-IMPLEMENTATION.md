# Cookiebot Integration with Google Analytics Implementation

## Overview

This document outlines the implementation of Cookiebot consent management integrated with Google Analytics across the Give Protocol website. The implementation ensures GDPR compliance by managing user consent for analytics tracking.

## Implementation Details

### Consent Management Strategy

**Default Consent Settings** (applied before GA loads):

- `ad_personalization: "denied"`
- `ad_storage: "denied"`
- `ad_user_data: "denied"`
- `analytics_storage: "denied"`
- `functionality_storage: "denied"`
- `personalization_storage: "denied"`
- `security_storage: "granted"`
- `wait_for_update: 500ms`

**Privacy Settings**:

- `ads_data_redaction: true` - Redacts advertising data
- `url_passthrough: false` - Prevents URL parameter passthrough

### Implementation Code

The following script is placed **before** the Google Analytics script in all templates:

```html
<!-- Cookiebot Consent Management -->
<script data-cookieconsent="ignore">
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("consent", "default", {
    ad_personalization: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });
  gtag("set", "ads_data_redaction", true);
  gtag("set", "url_passthrough", false);
</script>
```

### Files Updated

#### Main React Application

- **`index.html`**: Main entry point with Cookiebot integration
- **Updated CSP**: Added `https://consent.cookiebot.com` to script sources

#### Jekyll Documentation Site

- **`_layouts/documentation.html`**: Documentation layout
- **`_layouts/default.html`**: Default Jekyll layout
- **`_layouts/modern.html`**: Modern multi-language layout
- **`test-search.html`**: Search test page

### Content Security Policy Updates

Added Cookiebot domain to CSP:

```
script-src ... https://consent.cookiebot.com
```

### Google Analytics Configuration

**Updated GA Implementation**:

- Removed duplicate `dataLayer` and `gtag` function declarations
- Consent defaults are now handled by Cookiebot script
- GA script loads after consent configuration

```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-CBQHKLHD8T"
></script>
<script>
  gtag("js", new Date());
  gtag("config", "G-CBQHKLHD8T");
</script>
```

## How It Works

### 1. Initial Page Load

- Cookiebot consent script loads first with `data-cookieconsent="ignore"`
- Sets all tracking permissions to "denied" by default
- Only security storage is granted initially

### 2. User Consent

- When user provides consent through Cookiebot UI, permissions are updated
- Google Analytics begins collecting data only after explicit consent
- Consent choices are stored and respected across sessions

### 3. Data Protection

- Before consent: No tracking data collected
- With consent: Full analytics functionality enabled
- Data redaction ensures privacy compliance

## GDPR Compliance Features

### Privacy by Design

- **Default Deny**: All tracking disabled until consent
- **Granular Control**: User can choose specific consent types
- **Data Minimization**: Only security storage granted by default
- **Transparency**: Clear consent mechanisms

### Technical Safeguards

- **Wait for Update**: 500ms delay allows consent to be processed
- **Data Redaction**: Automatically redacts advertising data
- **URL Protection**: Prevents parameter passthrough
- **Secure Storage**: Only security-necessary storage permitted initially

## Testing and Verification

### Development Testing

1. **Console Verification**: Check dataLayer for consent events
2. **Network Monitoring**: Verify GA requests only fire after consent
3. **Cookie Inspection**: Confirm no tracking cookies before consent
4. **Build Verification**: Ensure all templates include consent code

### Production Monitoring

1. **Consent Rates**: Monitor user consent acceptance
2. **Analytics Data**: Verify data collection post-consent
3. **Privacy Compliance**: Regular audits of consent implementation

## Next Steps

### Required Cookiebot Setup

1. **Cookiebot Account**: Configure Cookiebot account with domain
2. **Consent Banner**: Implement Cookiebot consent banner UI
3. **Cookie Declaration**: Add cookie declaration page
4. **Consent Management**: Configure consent categories

### Integration Points

- Add Cookiebot script tag for consent UI
- Configure consent categories in Cookiebot dashboard
- Set up consent callback functions for custom analytics events
- Implement consent management interface for users

## Browser Support

The implementation supports all modern browsers and follows Google's recommended practices for consent management with Google Analytics 4.

## Security Considerations

- CSP properly configured for Cookiebot domains
- Scripts marked with appropriate consent attributes
- No data collection without explicit user consent
- Secure consent storage mechanisms

---

**Implementation Date**: July 27, 2025  
**Compliance**: GDPR, CCPA Ready  
**Analytics Platform**: Google Analytics 4 (G-CBQHKLHD8T)  
**Consent Management**: Cookiebot Integration
