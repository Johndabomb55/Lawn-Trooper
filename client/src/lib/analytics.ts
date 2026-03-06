type EventProperties = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: string, properties: EventProperties = {}): void {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    ...properties,
    ts: Date.now(),
  };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }

  window.dispatchEvent(new CustomEvent("lt_analytics_event", { detail: payload }));
}

