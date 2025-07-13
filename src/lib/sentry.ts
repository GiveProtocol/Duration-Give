import * as Sentry from '@sentry/react';

export function initSentry() {
  // Only initialize Sentry in production
  if (!import.meta.env.PROD) {
    console.log('Sentry: Skipping initialization in development');
    return;
  }

  // Check if DSN is configured
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.warn('Sentry: No DSN configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // Performance monitoring
    tracesSampleRate: 0.1, // 10% of transactions
    
    // Session replay for debugging
    replaysSessionSampleRate: 0.01, // 1% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Mask sensitive data in replays
        maskAllText: false,
        maskAllInputs: true,
        blockAllMedia: true,
      }),
    ],

    // Filter out noise and sensitive data
    beforeSend(event) {
      // Filter out browser extension errors
      if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
        frame => frame.filename?.includes('extension://')
      )) {
        return null;
      }

      // Filter out user cancellation errors (wallet rejections, etc.)
      if (event.exception?.values?.[0]?.value?.includes('User rejected') ||
          event.exception?.values?.[0]?.value?.includes('User denied')) {
        return null;
      }

      // Filter out ResizeObserver warnings
      if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
        return null;
      }

      return event;
    },

    // Filter sensitive data from transactions
    beforeSendTransaction(event) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.Cookie;
        delete event.request.headers['X-API-Key'];
      }

      return event;
    },
  });

  console.log('Sentry: Initialized successfully');
}

// Helper functions for custom tracking
export function trackError(error: Error, context?: Record<string, any>) {
  if (import.meta.env.PROD) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('custom', context);
      }
      Sentry.captureException(error);
    });
  } else {
    console.error('Error tracked:', error, context);
  }
}

export function trackEvent(name: string, data?: Record<string, any>) {
  if (import.meta.env.PROD) {
    Sentry.addBreadcrumb({
      message: name,
      data,
      level: 'info',
    });
  } else {
    console.log('Event tracked:', name, data);
  }
}

export function setUserContext(user: { id: string; email?: string; type?: string }) {
  if (import.meta.env.PROD) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      type: user.type,
    });
  }
}

export function clearUserContext() {
  if (import.meta.env.PROD) {
    Sentry.setUser(null);
  }
}