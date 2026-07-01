import { sentryLogIntegrations, sentryTracePropagationTargets, sentryTracesSampleRate } from "@/app/lib/sentry-config";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      enableLogs: true,
      integrations: [Sentry.browserTracingIntegration(), ...sentryLogIntegrations(Sentry)],
      tracePropagationTargets: sentryTracePropagationTargets(),
      tracesSampleRate: sentryTracesSampleRate(),
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
    });
  });
}
