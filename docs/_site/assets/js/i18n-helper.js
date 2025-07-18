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

  // Update UI elements with translations
  function updateUITranslations() {
    const currentLang = getCurrentLanguage();
    
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