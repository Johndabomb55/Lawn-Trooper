/**
 * Marketing Configuration File
 * 
 * This file contains all promotional copy, banners, micro-content, and feature flags.
 * Marketing team can update this file without touching component code.
 * 
 * HOW TO UPDATE:
 * 1. LOCAL_TIPS: Add/remove lawn tips with { tip, source } objects
 * 2. PROMO_BANNERS: Add rotating promotional banners with { title, subtitle, cta, link }
 * 3. FUN_FACTS: Add local area fun facts for the rotating banner
 * 4. FEATURE_FLAGS: Toggle features on/off for A/B testing or seasonal campaigns
 * 5. MILITARY_RANKS: Customize the rank progression labels and icons
 * 6. CELEBRATION_MESSAGES: Update step completion celebration copy
 */

// Feature Flags - Toggle features without code changes
// All flags default to safe fallback values if undefined
export const FEATURE_FLAGS = {
  showWaitlistSignup: true,        // Show early-access waitlist on confirmation
  showConfetti: true,              // Show confetti animation on step completion
  showLocalTipsBanner: true,       // Show rotating local tips between steps
  showSocialSharing: true,         // Show social share buttons on confirmation
  showPdfDownload: true,           // Allow PDF quote download
  requireAddons: true,             // Enforce add-on selection requirements
} as const;

// Helper to safely get feature flag with default
export function getFeatureFlag(key: keyof typeof FEATURE_FLAGS, defaultValue = false): boolean {
  return FEATURE_FLAGS[key] ?? defaultValue;
}

// Military Rank Progression for Gamification
export const MILITARY_RANKS = [
  { 
    id: 1, 
    rank: "Recruit", 
    label: "Yard Size", 
    description: "Beginning your mission",
    completionMessage: "Recon complete! Moving to plan selection."
  },
  { 
    id: 2, 
    rank: "Sergeant", 
    label: "Plan Tier", 
    description: "Earning your stripes",
    completionMessage: "You've earned your stripes – on to the next mission!"
  },
  { 
    id: 3, 
    rank: "Commander", 
    label: "Upgrades", 
    description: "Commanding your arsenal",
    completionMessage: "Arsenal locked and loaded! Final briefing ahead."
  },
  { 
    id: 4, 
    rank: "General", 
    label: "Contact", 
    description: "Mission ready",
    completionMessage: "Mission accomplished, General!"
  },
];

// Local Lawn Tips - Rotating micro-content for North Alabama
export const LOCAL_TIPS = [
  {
    tip: "In Huntsville's humid summers, water your lawn early morning to reduce evaporation and fungal growth.",
    source: "Alabama Extension Office"
  },
  {
    tip: "Madison County soils are often clay-heavy. Aeration in fall helps roots breathe and absorb nutrients.",
    source: "Local Lawn Experts"
  },
  {
    tip: "Bermuda grass thrives in North Alabama's heat. Keep it mowed at 1-2 inches for optimal health.",
    source: "Tennessee Valley Turf Guide"
  },
  {
    tip: "Decatur's proximity to the Tennessee River means higher humidity – choose disease-resistant grass varieties.",
    source: "Alabama Master Gardeners"
  },
  {
    tip: "Apply pre-emergent herbicide in early March to prevent crabgrass before it takes hold.",
    source: "Huntsville Lawn Care Association"
  },
  {
    tip: "Fall is the best time to overseed Fescue lawns in the Tennessee Valley region.",
    source: "Auburn University Extension"
  },
  {
    tip: "Mulching leaves in autumn returns nutrients to your soil and saves disposal time.",
    source: "North Alabama Green Team"
  },
];

// Fun Facts about Local Area
export const FUN_FACTS = [
  {
    fact: "Huntsville is home to the U.S. Space & Rocket Center – and some of the most beautiful lawns in Alabama!",
    icon: "rocket"
  },
  {
    fact: "Madison is one of the fastest-growing cities in Alabama, with homeowners who take pride in curb appeal.",
    icon: "trending"
  },
  {
    fact: "The Tennessee Valley receives about 54 inches of rain annually – great for lush lawns, but timing is key.",
    icon: "cloud"
  },
  {
    fact: "Decatur's historic districts feature some of the most well-maintained gardens in North Alabama.",
    icon: "award"
  },
];

// Promotional Banners for Rotating Display
export const PROMO_BANNERS = [
  {
    id: "birthday",
    title: "25-Year Birthday Bonus",
    subtitle: "Celebrating 25 years — long-term subscribers may qualify for our Birthday Bonus",
    cta: "Get Your Quote",
    active: true,
    priority: 1
  },
  {
    id: "referral",
    title: "Refer a Neighbor",
    subtitle: "Get in touch to learn more",
    cta: "Learn More",
    active: true,
    priority: 2
  },
  {
    id: "spring",
    title: "Spring Prep Special",
    subtitle: "Early bird pricing for annual contracts",
    cta: "Reserve Now",
    active: false,
    priority: 3
  },
];

// Celebration Messages for Step Completion
export const CELEBRATION_MESSAGES = {
  step1Complete: "Recon complete! Moving to plan selection.",
  step2Complete: "You've earned your stripes – on to the next mission!",
  step3Complete: "Arsenal locked and loaded! Final briefing ahead.",
  formComplete: "Mission Accomplished! Your quote is ready.",
};

// Social Sharing Templates
export const SOCIAL_SHARING = {
  twitter: {
    text: "Just got my yard mission-ready with Lawn Trooper! Professional lawn care with military precision.",
    hashtags: ["LawnTrooper", "LawnCare", "MissionReady"],
  },
  facebook: {
    quote: "Getting my yard mission-ready with Lawn Trooper's professional lawn care service!",
  },
  referralMessage: "Tell a neighbor about Lawn Trooper — get in touch to learn more!",
};

// Waitlist Configuration
export const WAITLIST_CONFIG = {
  title: "Join the Command Center",
  subtitle: "More advanced autonomy is coming soon, providing daily mows for weekly prices.",
  features: [
    "Premium upgrade coming soon",
    "Daily-mow autonomy at weekly-plan pricing",
    "Exclusive member discounts",
    "Priority scheduling"
  ],
  buttonText: "Join Waitlist",
  successMessage: "You're on the list, Commander! We'll notify you when new features launch.",
};

// PDF Quote Template Config
export const PDF_QUOTE_CONFIG = {
  companyName: "Lawn Trooper",
  tagline: "Landscape Maintenance & Exterior Home Care",
  footerText: "Thank you for choosing Lawn Trooper. We look forward to serving you!",
  validityDays: 30,
};
