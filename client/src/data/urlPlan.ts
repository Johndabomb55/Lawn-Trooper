import type { PlanId } from "@/data/plans";

const VALID_PLAN_IDS: readonly string[] = ["basic", "premium", "executive"];

function isValidPlanId(value: string | null): value is PlanId {
  return !!value && VALID_PLAN_IDS.includes(value);
}

export function getPlanFromUrl(): PlanId | null {
  if (typeof window === "undefined") return null;
  const searchParam = new URLSearchParams(window.location.search).get("plan");
  if (isValidPlanId(searchParam)) return searchParam;
  if (window.location.hash.includes("?")) {
    const hashParam = new URLSearchParams(window.location.hash.split("?")[1]).get("plan");
    if (isValidPlanId(hashParam)) return hashParam;
  }
  return null;
}
