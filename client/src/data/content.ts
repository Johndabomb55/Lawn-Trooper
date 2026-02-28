/**
 * Marketing Content Configuration
 * 
 * All marketing copy is centralized here for easy updates.
 * Keep pricing values in plans.ts and promotions.ts.
 */

export const HERO_CONTENT = {
  title: "Your Dream Lawn Starts Here",
  subtitle: "Build your plan in 60 seconds — no payment required.",
};

export const TRUST_BAR_COMPACT = [
  "25+ Years in North Alabama",
  "100+ Beautification Awards",
  "Quiet Electric Equipment",
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
      title: "AI-Powered Efficiency",
      description: "Smart routing and scheduling means honest pricing with no hidden fees."
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
  sectionSubtitle: "All plans include mowing, edging, trimming, and blowing. Upgrade conversion available on every plan.",
  plans: [
    {
      id: "basic",
      name: "Basic Patrol",
      perfectFor: "Homeowners who want reliable maintenance with minimal fuss.",
      highlights: [
        "Bi-weekly mowing (growing season)",
        "Monthly property check (off-season)",
        "2 Basic Upgrades included",
        "Dream Yard Recon\u2122 — AI landscape plan",
        "Upgrade swap: Convert 2 Basic \u2192 1 Premium"
      ]
    },
    {
      id: "premium",
      name: "Premium Patrol",
      perfectFor: "Families who want a consistently great-looking yard all year.",
      highlights: [
        "Weekly mowing (growing season)",
        "Bi-weekly off-season service",
        "Monthly bed weed control",
        "3 Basic + 1 Premium Upgrades",
        "Account Manager access",
        "Seasonal Landscape Refresh Allowance\u2122"
      ]
    },
    {
      id: "executive",
      name: "Executive Command",
      perfectFor: "Those who want the best lawn on the block without lifting a finger.",
      highlights: [
        "Year-round weekly property monitoring",
        "Executive Turf Defense\u2122 (up to 7 apps/year)",
        "Weed-Free Turf Guarantee",
        "3 Basic + 3 Premium Upgrades",
        "Dedicated Account Manager",
        "Premier Landscape Allowance\u2122"
      ]
    }
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
  phone: "(256) 555-0000",
  serviceArea: "Serving Athens, Huntsville, Madison, Decatur, and all of North Alabama",
};

// Seasonal scheduling disclaimer - display once site-wide (footer or add-on section)
export const SEASONAL_DISCLAIMER = "Some add-on services are seasonal in nature and may be scheduled during appropriate times of the year or during off-season periods when Lawn Trooper's service schedule allows. Timing and availability may vary based on weather, workload, and operational considerations.";

export const CTA_BUTTONS = {
  buildMyPlan: "Build My Subscription",
  getStarted: "Get Started",
  viewPlans: "View Plans",
};
