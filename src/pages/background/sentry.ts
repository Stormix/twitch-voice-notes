import * as Sentry from '@sentry/browser';

// @ts-expect-error - This is a hack to make Sentry work in the background script
Sentry.WINDOW.document = {
  visibilityState: 'hidden',
  addEventListener: () => {},
};

Sentry.init({
  dsn: 'https://42f7bf861a0e0a5e12b2bf965c2ec032@o84215.ingest.sentry.io/4506496890044416',
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/twitch-voice-notes\.lab\.stormix\.dev/],
    }),
  ],

  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
