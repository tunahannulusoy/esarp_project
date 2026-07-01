export function sentryTracesSampleRate(): number {
  return process.env.NODE_ENV === "development" ? 1.0 : 0.1;
}

export function sentryTracePropagationTargets(): (string | RegExp)[] {
  const targets: (string | RegExp)[] = ["localhost"];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      const origin = new URL(appUrl).origin;
      targets.push(new RegExp(`^${origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    } catch {
      // geçersiz URL yoksay
    }
  }

  return targets;
}

export function sentryLogIntegrations(Sentry: typeof import("@sentry/nextjs")) {
  return [Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] })];
}
