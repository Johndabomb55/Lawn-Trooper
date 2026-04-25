/**
 * Marketing Content Configuration
 * 
 * All marketing copy is centralized here for easy updates.
 * Keep pricing values in plans.ts and promotions.ts.
 */

export const HERO_CONTENT = {
  title: "North Alabama yard care, handled like a membership",
  subtitle:
    "Annual membership, billed monthly. Call Lawn Trooper AI first — or explore instant pricing in the plan builder.",
};

export const TRUST_BAR_COMPACT = [
  "25+ Years in North Alabama",
  "100+ Beautification Awards",
  "Electric Equipment Options",
  "Honest Pricing"
];

export const WHY_LAWN_TROOPER = {
  sectionTitle: "Why Lawn Trooper?",
  bullets: [
    {
      id: "electric",
      icon: "Leaf",
      title: "Electric Equipment",
      description: "Low noise, zero emissions, and a quieter neighborhood experience."
    },
    {
      id: "experience",
      icon: "Award",
      title: "25+ Years Experience",
      description: "Over 100 beautification awards and deep local expertise in North Alabama."
    },
    {
      id: "ai",
      icon: "Cpu",
      title: "Lawn Trooper AI",
      description:
        "24/7 answers on membership and next steps; our team follows up during business hours for scheduling and contracts.",
    },
    {
      id: "licensed",
      icon: "Shield",
      title: "Licensed & Insured",
      description: "Full coverage for your peace of mind. We take care of everything."
    }
  ]
};

export const PLAN_SUMMARIES = {
  sectionTitle: "Choose Your Total Maintenance Plan",
  sectionSubtitle:
    "Annual membership, billed monthly. All plans include mowing, edging, trimming, and blowing.",
  plans: [
    {
      id: "basic",
      name: "Standard Patrol",
      perfectFor: "Homeowners who want reliable maintenance with minimal fuss.",
      highlights: [
        "Bi-weekly mowing, edging and cleanup every visit",
        "Weed control support throughout your season",
        "4 Yard Boosts per year (1 per 90-day season)",
        "Monthly property check (off-season)",
        "Shrub Care Package: 1 annual visit + AI shrub assessment",
        "Dream Yard Recon\u2122 — AI landscape plan",
      ],
    },
    {
      id: "premium",
      name: "Premium Patrol",
      perfectFor: "Families who want a consistently great-looking yard all year.",
      highlights: [
        "Weekly mowing, edging and cleanup",
        "Expanded weed control support",
        "8 Yard Boosts per year (2 per 90-day season)",
        "Bi-weekly off-season service",
        "Shrub Care Package: 2 annual visits + monitored plant health",
        "Priority support and service photo updates",
      ],
    },
    {
      id: "executive",
      name: "Executive Command",
      perfectFor: "Those who want the best lawn on the block without lifting a finger.",
      highlights: [
        "Priority service and premium curb-appeal focus",
        "Maximum weed control support",
        "12 Yard Boosts per year (3 per 90-day season)",
        "Executive Turf Defense\u2122 for stronger turf over time",
        "Weed-Free Turf Guarantee",
        "Executive Shrub Command visits and dedicated account manager",
      ],
    },
  ]
};

export const TESTIMONIALS = {
  sectionTitle: "What Our Customers Say",
  reviews: [
    {
      id: 1,
      quote: "Lawn Trooper transformed our yard. The neighbors keep asking who does our landscaping!",
      stars: 5,
      name: "Sarah M.",
      location: "Huntsville, AL",
    },
    {
      id: 2,
      quote: "Finally found a lawn service that shows up on time and does exactly what they promise.",
      stars: 5,
      name: "Mike R.",
      location: "Madison, AL",
    },
    {
      id: 3,
      quote: "The electric equipment is so quiet. I don't even know they've been here until I see my perfect lawn.",
      stars: 5,
      name: "Jennifer L.",
      location: "Athens, AL",
    },
    {
      id: 4,
      quote: "Best investment we've made for our home. Our curb appeal has never looked better.",
      stars: 5,
      name: "David & Karen P.",
      location: "Decatur, AL",
    },
    {
      id: 5,
      quote: "The AI scheduling is genius - they always come at the perfect time for our lawn conditions.",
      stars: 5,
      name: "Tom H.",
      location: "Harvest, AL",
    },
    {
      id: 6,
      quote: "After 3 years with Lawn Trooper, I can't imagine going back to doing it myself.",
      stars: 4,
      name: "Angela W.",
      location: "Florence, AL",
    }
  ]
};

export const TRUST_BAR = {
  items: [
    "Licensed & Insured",
    "25+ Years in North Alabama",
    "100+ Beautification Awards"
  ]
};

export const FOOTER_CONTENT = {
  email: "John@lawn-trooper.com",
  phone: "256-795-2949",
  serviceArea: "Serving Athens, Huntsville, Madison, Decatur, and all of North Alabama",
};

// ─── Home V2 — 90-Day Yard Reset (April 2026) ────────────────────────────────

export const TRUST_STRIP = [
  "25 Years Serving North Alabama",
  "Licensed & Insured",
  "Seasonal Lawn Care, Billed Monthly",
  "Pause or adjust between seasons",
];

/** Trust story (replaces time-limited promo framing on site). */
export const TRUST_CELEBRATION_COPY = {
  headline: "25 Years Serving North Alabama",
  body:
    "We're celebrating by helping more homeowners reset their yards and simplifying lawn care for our community.",
};

export const YARD_RESET_VIDEO = {
  title: "See the Yard Reset in Action",
  subtitle: "Watch how Lawn Trooper helps homeowners and HOAs get back in shape fast.",
  // Wire these constants up later when the real assets are ready.
  videoUrl: "" as string,         // e.g. "https://stream.mux.com/.../high.mp4" or YouTube embed
  posterUrl: "" as string,        // optional poster image override
};

export const HOMEPAGE_PLAN_SUMMARIES = [
  {
    id: "basic" as const,
    name: "Standard Patrol",
    price: 169,
    summary:
      "Bi-weekly mowing, edging and cleanup every visit • Weed control support throughout your season • 4 Yard Boosts per year (1 per 90-day season)",
  },
  {
    id: "premium" as const,
    name: "Premium Patrol",
    price: 299,
    summary:
      "Weekly mowing, edging and cleanup • Expanded weed control support • 8 Yard Boosts per year (2 per 90-day season)",
  },
  {
    id: "executive" as const,
    name: "Executive Command",
    price: 399,
    summary:
      "Priority service and premium curb-appeal focus • Maximum weed control support • 12 Yard Boosts per year (3 per 90-day season)",
  },
];

export const YARD_RESET_BOOST_LINE =
  "All new plans start with a Yard Reset boost in Month 1.";

/** Shared note under plan grids (homepage + builder Step 2). */
export const PLAN_YARD_BOOST_SHARED_NOTE =
  "All plans are built around a 90-day Yard Reset and billed monthly. Yard Boosts are scheduled across your active season based on your yard's needs, weather, and route timing.";

export const SEASONAL_FRAMING = {
  oneLiner:
    "Built around a 90-day Yard Reset • Billed monthly • Yard Boosts scheduled across your active season based on your yard, weather, and route timing.",
};

export const MEET_MIGUEL = {
  name: "Miguel",
  role: "Lead Field Trooper",
  tenure: "25 years in the field",
  blurb:
    "Miguel has been turning North Alabama yards into showpieces for a quarter century. Funny, reliable, and the guy our customers trust with their property — week in, week out.",
  // Replace later with a real headshot or short video.
  photoUrl: "" as string,
  quote: "" as string,
};

export const MEET_FOUNDER = {
  name: "John",
  role: "Founder, Lawn Trooper",
  blurb:
    "Lawn Trooper started with one mower, a beat-up trailer, and a promise: treat every yard like it belongs to a friend. Twenty-five years and a few setbacks later, that promise hasn't changed. We're a relationships-first company — your yard, our reputation.",
  // Replace later with a real founder photo and pull quote.
  photoUrl: "" as string,
  quote: "" as string,
  videoUrl: "" as string,
};

// Seasonal scheduling disclaimer - display once site-wide (footer or upgrade section)
export const SEASONAL_DISCLAIMER = "Some upgrade services are seasonal in nature and may be scheduled during appropriate times of the year or during off-season periods when Lawn Trooper's service schedule allows. Timing and availability may vary based on weather, workload, and operational considerations.";

export const CTA_BUTTONS = {
  buildMyPlan: "Reserve My Plan",
  getStarted: "Reserve My Plan",
  viewPlans: "View Plans",
};

/** Why We're Different — professional, reassuring tone. Combined from plan builder + Why Enlist sections. */
export const WHY_DIFFERENT = {
  sectionTitle: "Why We're Different",
  bullets: [
    {
      title: "25 years serving our community",
      desc: "Over two decades of trusted service in the Tennessee Valley with 100+ beautification awards.",
    },
    {
      title: "Electric equipment — eco-friendly and quiet",
      desc: "Battery-powered mowers and electric handheld equipment mean zero emissions and much quieter operation. We don't disturb your neighborhood — so quiet you might not notice we just mowed.",
    },
    {
      title: "Loyalty Price Drop Guarantee",
      desc: "Your pricing decreases over time as a loyal customer. We reward commitment, not punish it.",
    },
    {
      title: "Dedicated Account Manager",
      desc: "Every plan includes a real person managing your property — not a call center.",
    },
    {
      title: "AI-assisted Dream Yard Recon™",
      desc: "Every plan includes an AI-generated landscape plan personalized to your property and goals.",
    },
    {
      title: "Locally owned — not a faceless chain",
      desc: "We live here, we work here. You'll know who is on your property — friendly, vetted, and professional.",
    },
    {
      title: "Tech-forward tactics",
      desc: "Smart routing, automation, and robotic mowers where appropriate for maximum efficiency and honest pricing.",
    },
    {
      title: "Licensed and insured",
      desc: "Full coverage for your peace of mind. We take full responsibility for any liability while performing services.",
    },
  ],
};
