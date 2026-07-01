import { sentryLogIntegrations, sentryTracesSampleRate } from "@/app/lib/sentry-config";

export async function register() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      enableLogs: true,
      integrations: sentryLogIntegrations(Sentry),
      tracesSampleRate: sentryTracesSampleRate(),
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      enableLogs: true,
      integrations: sentryLogIntegrations(Sentry),
      tracesSampleRate: sentryTracesSampleRate(),
    });
  }
}

export async function onRequestError(...args: Parameters<NonNullable<typeof import("@sentry/nextjs").captureRequestError>>) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(...args);
}
