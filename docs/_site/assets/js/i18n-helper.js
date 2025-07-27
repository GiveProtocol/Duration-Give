// i18n helper for UI elements
(function() {
  'use strict';

  /* global google */

  // Translation data embedded from Jekyll
  window.translations = {
    {% for translation in site.data.translations %}
    '{{ translation[0] }}': {{ translation[1] | jsonify }},
    {% endfor %}
  };

  // Get current language from localStorage or Google Translate
  function getCurrentLanguage() {
    // Check saved preference first
    const savedLang = localStorage.getItem('docs-language');
    if (savedLang && savedLang !== 'en') {
      return savedLang;
    }

    // Check Google Translate hash
    const hash = window.location.hash;
    if (hash.includes('googtrans')) {
      const match = hash.match(/googtrans\(en\|(\w+)\)/);
      if (match) {
        return match[1];
      }
    }

    return 'en';
  }

  // Get translated text
  function t(key, lang) {
    lang = lang || getCurrentLanguage();
    const keys = key.split('.');
    let value = window.translations[lang];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback to English
        value = window.translations['en'];
        for (const k of keys) {
          if (value && value[k]) {
            value = value[k];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }
    
    return value || key;
  }

  // Refresh Google Translate for dynamic content
  function refreshGoogleTranslate() {
    if (typeof google !== 'undefined' && google.translate && google.translate.TranslateElement) {
      // Force Google Translate to re-scan the page
      try {
        const translateElement = google.translate.TranslateElement.getInstance();
        if (translateElement) {
          // Trigger a re-scan of the page content
          setTimeout(() => {
            const event = new Event('resize');
            window.dispatchEvent(event);
          }, 100);
        }
      } catch (e) {
        console.warn('Could not refresh Google Translate:', e);
      }
    }
  }

  // Update navigation translations
  function updateNavigationTranslations(currentLang) {
    // Update navigation section titles
    const navigationMap = {
      'Give Protocol Help Center': 'help_center',
      'Introduction': 'introduction', 
      'Getting Started': 'getting_started',
      'User Guides': 'user_guides',
      'Platform Features': 'platform_features',
      'Technical Documentation': 'technical_docs',
      'Safety & Security': 'safety_security',
      'Resources & Tools': 'resources_tools',
      'Community & Support': 'community_support'
    };

    // Update section titles
    document.querySelectorAll('.section-title').forEach(title => {
      const englishText = title.textContent.trim();
      const translationKey = navigationMap[englishText];
      if (translationKey) {
        title.textContent = t('ui.navigation.' + translationKey, currentLang);
      }
    });

    // Update navigation links
    const linkMap = {
      'Frequently Asked Questions': 'faq',
      'Need Help?': 'need_help',
      'Report An Issue': 'report_issue',
      'What is Give Protocol': 'what_is_give_protocol',
      'How To Join Give Protocol?': 'how_to_join',
      'Creating Your Account': 'creating_account',
      'Setting Up Your Profile': 'setting_up_profile',
      'Wallet Connection Guide': 'wallet_connection',
      'First Steps Walkthrough': 'first_steps',
      'Dashboard Overview': 'dashboard',
      'For Donors': 'for_donors',
      'For Recipients/Organizations': 'for_organizations',
      'For Volunteers': 'for_volunteers',
      'Search & Discovery Tools': 'search_discovery',
      'Verification & Trust Badges': 'verification',
      'Impact Tracking & Metrics': 'impact_tracking',
      'Community Features': 'community_features',
      'Blockchain Integration': 'blockchain_integration',
      'Smart Contract Interactions': 'smart_contracts',
      'Supported Cryptocurrencies': 'cryptocurrencies',
      'Transaction Fees & Gas': 'fees',
      'API Documentation': 'api_docs',
      'Smart Giving Practices': 'smart_giving',
      'Volunteer Safety': 'volunteer_safety',
      'Platform Security': 'platform_security',
      'Educational Content': 'educational_content',
      'Donation Planning Tools': 'calculator',
      'Volunteer Time Tracking': 'time_tracking',
      'Templates & Guides': 'templates',
      'Community Forums': 'forums',
      'Contact Information': 'contact',
      'Social Media Links': 'social'
    };

    // Update navigation links (only text content, not the icon)
    document.querySelectorAll('.nav-item a').forEach(link => {
      const textNode = Array.from(link.childNodes).find(node => 
        node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      );
      if (textNode) {
        const englishText = textNode.textContent.trim();
        const translationKey = linkMap[englishText];
        if (translationKey) {
          textNode.textContent = ' ' + t('ui.navigation.' + translationKey, currentLang);
        }
      }
    });
  }

  // Update UI elements with translations
  function updateUITranslations(event) {
    const currentLang = event && event.detail && event.detail.lang ? event.detail.lang : getCurrentLanguage();
    
    // Update search placeholder
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.placeholder = t('ui.search.placeholder', currentLang);
      searchInput.setAttribute('aria-label', t('ui.search.aria_label', currentLang));
      searchInput.setAttribute('title', t('ui.search.placeholder', currentLang));
    }

    // Update settings elements
    const settingsTitle = document.querySelector('.settings-title');
    if (settingsTitle) {
      settingsTitle.textContent = t('ui.settings.title', currentLang);
    }

    // Update theme section
    const themeHeading = document.querySelector('.theme-heading');
    if (themeHeading) {
      themeHeading.textContent = t('ui.settings.theme', currentLang);
    }

    // Update theme options
    const lightOption = document.querySelector('[data-theme="light"]');
    if (lightOption) {
      lightOption.textContent = t('ui.settings.light', currentLang);
    }

    const darkOption = document.querySelector('[data-theme="dark"]');
    if (darkOption) {
      darkOption.textContent = t('ui.settings.dark', currentLang);
    }

    // Update language section
    const languageHeading = document.querySelector('.language-heading');
    if (languageHeading) {
      languageHeading.textContent = t('ui.settings.language', currentLang);
    }

    // Update language options
    document.querySelectorAll('.language-option').forEach(option => {
      const langCode = option.dataset.lang;
      if (langCode && window.translations[currentLang] && window.translations[currentLang].ui.languages[langCode]) {
        option.textContent = t('ui.languages.' + langCode, currentLang);
      }
    });

    // Update search no results (if visible)
    const noResults = document.querySelector('.search-no-results');
    if (noResults) {
      noResults.textContent = t('ui.search.no_results', currentLang);
    }

    // Update edit page link
    const editPageLink = document.querySelector('.edit-page-link');
    if (editPageLink) {
      editPageLink.textContent = t('ui.navigation.edit_page', currentLang);
    }

    // Update navigation section titles and links
    updateNavigationTranslations(currentLang);

    // Refresh Google Translate for dynamic content after UI updates
    setTimeout(refreshGoogleTranslate, 200);
  }

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', updateUITranslations);

  // Listen for language changes
  document.addEventListener('languageChanged', updateUITranslations);

  // Update when Google Translate changes
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(updateUITranslations, 100);
  };

  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(updateUITranslations, 100);
  };

  window.addEventListener('hashchange', function() {
    setTimeout(updateUITranslations, 100);
  });

  // Export functions for global use
  window.i18n = {
    t: t,
    getCurrentLanguage: getCurrentLanguage,
    updateUITranslations: updateUITranslations,
    refreshGoogleTranslate: refreshGoogleTranslate
  };
})();