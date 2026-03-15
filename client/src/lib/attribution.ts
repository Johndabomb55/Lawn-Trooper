export type TrafficSourceTag = "fb_ads" | "qr" | "website_chat";

export interface AttributionContext {
  sourceTag: TrafficSourceTag;
  sourceDetail: string;
  landingPath: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

const normalize = (value: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export function getAttributionContext(): AttributionContext {
  if (typeof window === "undefined") {
    return {
      sourceTag: "website_chat",
      sourceDetail: "server",
      landingPath: "/",
      referrer: "",
    };
  }

  const url = new URL(window.location.href);
  const params = url.searchParams;
  const utmSource = normalize(params.get("utm_source"))?.toLowerCase();
  const utmMedium = normalize(params.get("utm_medium"))?.toLowerCase();
  const utmCampaign = normalize(params.get("utm_campaign"));
  const utmContent = normalize(params.get("utm_content"));
  const utmTerm = normalize(params.get("utm_term"));
  const sourceHint = normalize(params.get("source"))?.toLowerCase();
  const hasFbClickId = Boolean(normalize(params.get("fbclid")));
  const isQr = params.get("qr") === "1" || sourceHint === "qr" || utmMedium === "qr";
  const isFb = hasFbClickId || /(^|_)(fb|facebook|ig|instagram)($|_)/.test([utmSource, utmMedium, sourceHint].filter(Boolean).join("_"));

  let sourceTag: TrafficSourceTag = "website_chat";
  if (isQr) {
    sourceTag = "qr";
  } else if (isFb) {
    sourceTag = "fb_ads";
  }

  const sourceDetail = [
    utmSource ? `utm_source=${utmSource}` : "",
    utmMedium ? `utm_medium=${utmMedium}` : "",
    utmCampaign ? `utm_campaign=${utmCampaign}` : "",
    hasFbClickId ? "fbclid=true" : "",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    sourceTag,
    sourceDetail: sourceDetail || "direct_or_unknown",
    landingPath: `${window.location.pathname}${window.location.search}`,
    referrer: window.document.referrer || "",
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
  };
}

export function appendAttributionNotes(notes: string | null | undefined, context: AttributionContext): string {
  const existing = (notes || "").trim();
  if (existing.includes("[Attribution]")) return existing;

  const parts = [
    `Source: ${context.sourceTag}`,
    context.sourceDetail ? `Detail: ${context.sourceDetail}` : "",
    context.landingPath ? `Landing: ${context.landingPath}` : "",
    context.referrer ? `Referrer: ${context.referrer}` : "",
  ].filter(Boolean);

  const attributionLine = `[Attribution] ${parts.join(" | ")}`;
  return existing ? `${existing}\n\n${attributionLine}` : attributionLine;
}
