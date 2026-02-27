import { track as vercelTrack } from "@vercel/analytics";

type AnalyticsPayload = Record<string, string | number | boolean | undefined | null>;

export const trackPageView = (path: string) => {
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics] page_view", path);
  }
  // Vercel Analytics automatically tracks page views, so we might just leave this or manually track it as a custom event if really needed.
  // We'll leave it as a log for debug unless explicitly disabled.
};

export const trackEvent = (event: string, payload?: AnalyticsPayload) => {
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics] event", event, payload ?? {});
  }
  try {
    vercelTrack(event, payload);
  } catch (err) {
    console.error("[analytics] error tracking event", err);
  }
};
