/**
 * Call-first funnel — single source for production phone links.
 * Display number lives in FOOTER_CONTENT; keep in sync with marketing.
 */
import { FOOTER_CONTENT } from "./content";

export const LT_PHONE_DISPLAY = FOOTER_CONTENT.phone;

const digitsOnly = FOOTER_CONTENT.phone.replace(/\D/g, "");
export const LT_PHONE_E164 = digitsOnly.length === 10 ? `+1${digitsOnly}` : `+${digitsOnly}`;

export function getTelHref(): string {
  return `tel:${LT_PHONE_E164}`;
}

export function getSmsHref(prefill?: string): string {
  const body = encodeURIComponent(
    prefill ?? "Hi Lawn Trooper — I'd like to talk about yard membership.",
  );
  return `sms:${LT_PHONE_E164}?body=${body}`;
}

export const LAWN_TROOPER_AI = {
  name: "Lawn Trooper AI",
  tagline: "Lawn Trooper AI · 24/7",
  subline:
    "Real crew. Real follow-up. Answers first — scheduling and contracts with our team when you’re ready.",
} as const;

/** Short labels for cramped nav / sticky bars (full primary CTA on hero buttons). */
export const CALL_NAV_PRIMARY_SHORT = "Call now";
export const CALL_NAV_BUILDER_SHORT = "Builder";

/** Shared funnel strings (homepage, header, /start fallbacks). */
export const CALL_FUNNEL_COPY = {
  heroHeadline: "Your yard shouldn’t be a project you keep putting off.",
  heroSubhead:
    "Call Lawn Trooper AI 24/7. Pricing, plans, next steps — fast. No forms. No callback wait. No pressure.",
  primaryCta: "Talk to Lawn Trooper AI",
  secondaryText: "Text us",
  callbackCta: "Have us call you",
  builderSecondary:
    "Rather see it first? Explore instant pricing and photos in the plan builder.",
  builderCta: "See pricing & photos",
  trustLine:
    "Licensed and insured · 25+ years in the Tennessee Valley · Local crew, modern systems",
} as const;

export const OFFER_LANES = {
  curbAppeal: {
    title: "Curb Appeal Plan",
    body:
      "Big yard? Only care about the front? Front yard and high-visibility areas only. Same Lawn Trooper standards. Lower investment because we maintain less ground, not because we cut corners.",
  },
  yardReset: {
    title: "30-Day Yard Reset",
    body:
      "Yard out of control? We’ll get the property back under control, keep it maintained for 30 days, and show you exactly how Lawn Trooper works. If the property needs heavy catch-up, we’ll quote that clearly first.",
  },
} as const;

/** Homepage offer-lane section intro (under H2) — aligns with /start “Not ready” idea. */
export const OFFER_LANES_SECTION_INTRO =
  "Same standards as our full recurring plans — scoped for your property. Quoted after a quick review. Specialty and material-heavy work: custom quote or member add-on.";

/** Parts for homepage `#quote` intro (phone linked in JSX). */
export const QUOTE_SECTION_CALLOUT_PARTS = {
  before: "Call Lawn Trooper AI first if you want to talk it through — ",
  after: " — or build your plan below for instant pricing and photos.",
} as const;

export const CALLBACK_MAILTO = `mailto:${FOOTER_CONTENT.email}?subject=${encodeURIComponent("Callback request — Lawn Trooper")}&body=${encodeURIComponent("Please call me back. Best number:\nBest time:\nAddress (optional):\n")}`;

// --- /start landing page — conversion-focused copy ---

export const CALL_FIRST_REQUIRED_LINES = {
  talk247: "Talk to Lawn Trooper AI 24/7.",
  noCallbackWait:
    "Get answers, pricing, and quotes without waiting on callbacks.",
  askAnything:
    "Ask about lawn care, service plans, front-yard-only options, availability, or scheduling.",
  aiInvestment: "We use AI so you get answers now — not tomorrow. Your yard is handled by a local team, not a call center.",
  fastAnswers: "Fast answers. Clear plans. No pressure.",
  builderSecondary:
    "Rather see it first? Explore instant pricing and photos in the plan builder.",
  heroMicrocopy:
    "Tap the number. Ask about your yard, plans, or scheduling — no runaround.",
  giantNumberLabel: "Tap the number to call",
} as const;

/** Default hero = index 0 (swap for tests). */
export const CALL_FIRST_HERO_HEADLINE_OPTIONS = [
  "Your yard shouldn’t be a project you keep putting off.",
  "Fix your yard without waiting on callbacks.",
  "Call now. Get clear answers — then get it on the calendar.",
  "Stop wondering what lawn care should cost.",
  "North Alabama homeowners call us first for a reason.",
] as const;

export const CALL_FIRST_HERO_SUBHEAD_OPTIONS = [
  "Call Lawn Trooper AI 24/7. Pricing, plans, next steps — fast. No forms. No callback wait. No pressure.",
  "Lawn Trooper AI is live 24/7. Ask about your yard, plans, or scheduling. Humans handle walkthroughs and contracts — without the runaround.",
  "One call: what you need, what it takes, what happens next. Builder optional if you’d rather browse photos and pricing first.",
  "Direct. Local. Professional. The AI is how we serve people faster — not a gimmick.",
  "Big yard, tight timeline, or just tired of no-shows? Start with a conversation.",
] as const;

export const CALL_FIRST_PRIMARY_CTA_OPTIONS = [
  "Talk to Lawn Trooper AI",
  "Get help now",
  "Ask about your yard",
  "Tap to talk to Lawn Trooper AI",
  "Call — answers in seconds",
] as const;

/** Builder block (/start + repeated). */
export const CALL_FIRST_BUILDER_COPY = {
  title: "Rather see it first?",
  body: "Explore instant pricing and photos in the plan builder. Built for people who want to browse before they talk.",
  secondaryLine: "Don’t want to call yet? Click below — self-serve, no obligation.",
  primaryButton: "See pricing & photos",
  secondaryButton: "Open builder on the homepage",
} as const;

/** Single conversion-focused blocks (replaces multi-variant curb/reset stacks). */
export const CALL_FIRST_ALTERNATE_START = {
  sectionTitle: "Not Ready for a Full Plan Yet?",
  sectionSubtitle: "Two scoped starts — same standards, less guesswork.",
} as const;

export const CALL_FIRST_CURB_SECTION = {
  cardLabel: "Curb Appeal Plan",
  body:
    "Big yard? Only care about the front? Front yard and high-visibility areas only. Same Lawn Trooper standards. Lower investment because we maintain less ground, not because we cut corners.",
} as const;

export const CALL_FIRST_RESET_SECTION = {
  cardLabel: "30-Day Yard Reset",
  body:
    "Yard out of control? We’ll get the property back under control, keep it maintained for 30 days, and show you exactly how Lawn Trooper works. If the property needs heavy catch-up, we’ll quote that clearly first.",
} as const;

export const CALL_FIRST_LANDING_COPY = {
  hero: {
    headlineIndex: 0 as const,
    subheadIndex: 0 as const,
    primaryCtaIndex: 0 as const,
  },
  whenYouCall: {
    title: "What happens in one call",
    subtitle: "",
    steps: [
      {
        title: "You tell us what you’re dealing with",
        body: "Yard size, trouble spots, how polished you want it, timeline.",
      },
      {
        title: "You get clear guidance",
        body: "Plan fit, pricing direction, and what “done right” looks like for your property.",
      },
      {
        title: "We handle the next step",
        body: "Walkthrough, scheduling, or a simple handoff — your call, your pace.",
      },
    ],
  },
  howItWorks: {
    title: "Simple path forward",
    subtitle: "Call first for speed — or open the builder if you want visuals.",
    steps: [
      {
        title: "Call or text",
        body: "Lawn Trooper AI 24/7. Text for a fast human follow-up.",
      },
      {
        title: "Lock your fit",
        body: "Full plan, Curb Appeal, or Yard Reset — whatever matches.",
      },
      {
        title: "We execute",
        body: "Local crew. Clear communication. No pressure close.",
      },
    ],
  },
  corePlans: {
    title: "The three ways most homeowners start",
    subtitle:
      "Three recurring plans. Same professional standard — different levels of coverage and cadence. Compare fast, then lock what fits.",
    footnote: "Exact fit is confirmed after a quick scope check — no guesswork, no surprises.",
    plans: [
      {
        name: "Standard Patrol",
        blurb: "Reliable rhythm for homeowners who want consistency without fuss.",
      },
      {
        name: "Premium Patrol",
        blurb: "Stepped-up cadence and included extras when the yard is always on display.",
      },
      {
        name: "Executive Command",
        blurb: "Maximum coverage, priority support, dedicated account management on qualifying memberships.",
      },
    ],
  },
  trust: {
    title: "Real people. Real property care.",
    lead:
      "Lawn Trooper AI gets you answers now. Your yard is managed by a local team — not a call center.",
    bullets: [
      "Licensed and insured",
      "25+ years in the Tennessee Valley",
      "100+ beautification awards",
      "Fast response, clear communication, modern systems",
      "We don’t promise vague “unlimited” work in flat packages",
    ],
  },
  faq: [
    {
      q: "Is Lawn Trooper AI a real person?",
      a: "It’s an AI assistant trained on how we work — so you get fast, accurate guidance. Real people handle walkthroughs, contracts, and scheduling. We built it because waiting shouldn’t be the default.",
    },
    {
      q: "Can I talk to a real person?",
      a: "Yes. Call and ask anytime — or use “Have us call you.” Service and contracts are always with our local team.",
    },
    {
      q: "Do I have to fill out a form?",
      a: "No. Call or text. The plan builder is optional — not a gate.",
    },
    {
      q: "Can I get a quick price?",
      a: "Yes — ask on the call. Unusual scope gets a fast human confirmation. Still quicker than waiting days.",
    },
    {
      q: "I only want the front done.",
      a: "That’s often Curb Appeal — front and high-visibility zones, scoped so pricing matches the work.",
    },
    {
      q: "I don’t know which plan I need.",
      a: "Normal. We narrow it in a few questions.",
    },
    {
      q: "Are you pushy?",
      a: "Direct, yes. Pushy, no.",
    },
    {
      q: "Can I browse photos and pricing first?",
      a: "Open the builder. Then call if you want help choosing.",
    },
    {
      q: "HOAs or neighborhoods?",
      a: "We work with communities. See HOA & partnerships — or call.",
    },
  ],
  objections: [
    {
      title: "Talk to a human",
      body: "Anytime. Or use “Have us call you.” AI is for speed — crews and staff run your service.",
    },
    {
      title: "No forms",
      body: "Call or text. The builder is optional — not a requirement.",
    },
    {
      title: "Quick price",
      body: "Ask on the call. Unusual scope gets a fast human confirmation — still quicker than waiting days.",
    },
    {
      title: "Don’t know the plan",
      body: "Normal. We narrow it in a few questions.",
    },
    {
      title: "Answers now",
      body: "That’s why AI is live 24/7.",
    },
    {
      title: "Front only",
      body: "Often Curb Appeal — scoped, not guessed.",
    },
    {
      title: "Try before committing",
      body: "Yard Reset is built for that — defined scope, no cheesy discount story.",
    },
    {
      title: "Pushy sales",
      body: "Direct, yes. Pushy, no.",
    },
    {
      title: "AI annoying?",
      body: "It’s trained on how we work — so you skip the runaround. Humans handle contracts and scheduling.",
    },
    {
      title: "Pictures first",
      body: "Open the builder. Then call if you want help deciding.",
    },
  ],
  hoa: {
    title: "HOA & community maintenance",
    body: "Neighborhood contracts, common areas, partnerships — we route you to the right person fast.",
    cta: "HOA & partnerships",
    href: "/hoa-partnerships",
  },
  specialRequests: {
    title: "Special requests & specialty work",
    body:
      "Mulch, plantings, pressure washing, holiday installs, and material-heavy work aren’t casually bundled into flat packages. Tell us what you’re thinking — member add-on or custom quote.",
    cta: "Ask about add-ons & specialty work",
  },
  repeatedCta: {
    title: "Still deciding?",
    subtitle: "One call clears it up. Or browse pricing in the builder — your pace.",
  },
  footerLink: {
    fullSite: "Full Lawn Trooper site",
    home: "/",
  },
} as const;

/**
 * Alternative tone packs — experiments / future A-B.
 */
export const CALL_FIRST_TONE_VARIANTS = {
  premium: {
    heroHeadline: "Exterior care that respects your time — and your property.",
    heroSubhead:
      "Lawn Trooper AI for immediate guidance. Local crew for execution. No runaround.",
    primaryCta: "Talk to Lawn Trooper AI",
    repeatedTitle: "Prefer a brief conversation first?",
    repeatedSubtitle: "24/7 answers. Human handoff for scheduling.",
  },
  directResponse: {
    heroHeadline: "Stop guessing. Call Lawn Trooper AI.",
    heroSubhead:
      "Plans, pricing direction, front-yard options, availability. No form. Builder optional.",
    primaryCta: "Get help now",
    repeatedTitle: "One call. Clear next step.",
    repeatedSubtitle: "Lawn Trooper AI · Local company · Real crew",
  },
  warmService: {
    heroHeadline: "Good help shouldn’t wait until Monday.",
    heroSubhead:
      "Lawn Trooper AI is here 24/7 because service matters. Our team takes it from there for scheduling and walkthroughs.",
    primaryCta: "Talk to Lawn Trooper AI",
    repeatedTitle: "Questions welcome",
    repeatedSubtitle: "No pressure — just options and honest next steps.",
  },
} as const;

/** Resolve hero strings from option arrays + indices. */
export function getCallFirstHeroCopy(indices?: {
  headline?: number;
  subhead?: number;
  cta?: number;
}) {
  const hi = indices?.headline ?? CALL_FIRST_LANDING_COPY.hero.headlineIndex;
  const si = indices?.subhead ?? CALL_FIRST_LANDING_COPY.hero.subheadIndex;
  const ci = indices?.cta ?? CALL_FIRST_LANDING_COPY.hero.primaryCtaIndex;
  return {
    headline: CALL_FIRST_HERO_HEADLINE_OPTIONS[hi] ?? CALL_FIRST_HERO_HEADLINE_OPTIONS[0],
    subhead: CALL_FIRST_HERO_SUBHEAD_OPTIONS[si] ?? CALL_FIRST_HERO_SUBHEAD_OPTIONS[0],
    primaryCta: CALL_FIRST_PRIMARY_CTA_OPTIONS[ci] ?? CALL_FIRST_PRIMARY_CTA_OPTIONS[0],
  };
}
