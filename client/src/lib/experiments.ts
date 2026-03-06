import { trackEvent } from "./analytics";

export type ExperimentKey =
  | "hero_simplification"
  | "addons_optional_flow"
  | "short_contact_form";

const exposedExperiments = new Set<string>();

export function getExperimentVariant(
  key: ExperimentKey,
  defaultVariant: "control" | "variant" = "variant"
): string {
  if (typeof window === "undefined") return defaultVariant;
  const params = new URLSearchParams(window.location.search);
  return params.get(`exp_${key}`) || defaultVariant;
}

export function trackExperimentExposure(key: ExperimentKey, variant: string): void {
  const token = `${key}:${variant}`;
  if (exposedExperiments.has(token)) return;
  exposedExperiments.add(token);
  trackEvent("experiment_exposure", { experiment: key, variant });
}

