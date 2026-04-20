import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Check,
  Sparkles,
  ShieldCheck,
  Leaf,
  Zap,
  Star,
  Award,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SimpleBuilder from "@/components/SimpleBuilder";
import { PLANS } from "@/data/plans";
import { getTelHref, LT_PHONE_DISPLAY } from "@/data/callFirst";
import { TESTIMONIALS, FOOTER_CONTENT } from "@/data/content";

const PAGE_TITLE = "Lawn Trooper | The 90-Day Yard Reset";

const PLAN_CARDS = [
  {
    id: "basic" as const,
    name: "Standard Patrol",
    price: 169,
    bullets: [
      "Bi-weekly mowing in growing season",
      "Edging, trim & blow every visit",
      "Free yard plan after first month",
    ],
  },
  {
    id: "premium" as const,
    name: "Premium Patrol",
    price: 299,
    popular: true,
    bullets: [
      "Weekly mowing in growing season",
      "Bush care + flower bed weeding",
      "Service photo updates",
    ],
  },
  {
    id: "executive" as const,
    name: "Executive Command",
    price: 399,
    bullets: [
      "Weekly mowing + bi-weekly off-season",
      "Up to 7 turf treatments / year",
      "Weed-free turf guarantee",
    ],
  },
];

const VALUE_PROPS = [
  { icon: Award, title: "25+ years local", body: "Built in North Alabama. 100+ beautification awards." },
  { icon: Leaf, title: "Quiet electric crew", body: "Battery mowers, zero emissions, neighbor-friendly." },
  { icon: ShieldCheck, title: "Loyalty price drop", body: "Your rate goes down the longer you stay." },
  { icon: Zap, title: "Real human account manager", body: "No call center. A real person owns your yard." },
];

const RESET_STEPS = [
  { n: 1, title: "Day 1 — Recon", body: "Quick property walk + AI yard plan emailed to you." },
  { n: 2, title: "Days 2–30 — Reset", body: "Heavy lift: catch-up trim, mow, edge, beds reset." },
  { n: 3, title: "Days 31–90 — Lock-in", body: "Weekly rhythm dialed. Yard locked into mission-ready." },
];

const FAQ = [
  {
    q: "How fast can you start?",
    a: "Most new patrols start within 7 days. Talk to Lawn Trooper AI 24/7 and we'll lock a date.",
  },
  {
    q: "What if I don't love it?",
    a: "After your first month, schedule a consultation. If it's not a fit, you get a full refund.",
  },
  {
    q: "Do you handle big yards?",
    a: "Yes — we tier price by yard size. Yards over an acre get a custom quote after a quick photo review.",
  },
  {
    q: "Is this only mowing?",
    a: "No. Every plan includes mowing, edging, trim, and blow. Add bush care, mulch, leaf cleanup, more.",
  },
  {
    q: "Where do you serve?",
    a: "Athens, Huntsville, Madison, Decatur, and the rest of North Alabama.",
  },
];

function scrollToBuilder() {
  const el = document.getElementById("builder");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function HomeV2() {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top phone bar */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between gap-3">
          <a href="#top" className="font-bold tracking-tight text-lg" data-testid="link-brand">
            Lawn <span className="text-primary">Trooper</span>
          </a>
          <a
            href={getTelHref()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            data-testid="link-header-call"
          >
            <Phone className="h-4 w-4" /> {LT_PHONE_DISPLAY}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-12 sm:pt-16 sm:pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold tracking-wide uppercase mb-4" data-testid="badge-hero">
              <Sparkles className="h-3.5 w-3.5" /> The 90-Day Yard Reset
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto" data-testid="text-hero-headline">
              Your yard, locked into mission-ready in 90 days.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto" data-testid="text-hero-sub">
              Real monthly pricing. Real local crew. Build your plan in 60 seconds — or talk to Lawn Trooper AI right now.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <a href={getTelHref()} className="sm:w-auto" data-testid="link-hero-call">
                <Button size="lg" className="w-full sm:w-auto">
                  <Phone className="h-4 w-4 mr-2" /> Talk to Lawn Trooper AI
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={scrollToBuilder}
                data-testid="button-hero-build"
              >
                Build My Plan in 60 Seconds <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Licensed & insured · 25+ years in the Tennessee Valley
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plan cards */}
      <section className="bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" data-testid="text-plans-title">
            Three patrol levels. Real monthly prices.
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto text-sm">
            No haggling. No mystery quotes. Pick a level — fine-tune the touches in the builder.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLAN_CARDS.map((p) => (
              <div
                key={p.id}
                data-testid={`card-plan-${p.id}`}
                className={`relative rounded-2xl border bg-card p-5 ${
                  p.popular ? "border-primary shadow-lg" : "border-border"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
                    Most Popular
                  </span>
                )}
                <div className="text-sm uppercase tracking-wide text-muted-foreground">{p.name}</div>
                <div className="mt-1 text-3xl font-bold text-primary">
                  ${p.price}
                  <span className="text-sm font-medium text-muted-foreground">/mo</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-5 w-full"
                  variant={p.popular ? "default" : "outline"}
                  onClick={scrollToBuilder}
                  data-testid={`button-see-plan-${p.id}`}
                >
                  See My Plan
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" data-testid="text-why-title">
          Why choose the Trooper
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-card p-4" data-testid={`card-value-${v.title.toLowerCase().replace(/\s+/g, "-")}`}>
              <v.icon className="h-6 w-6 text-primary" />
              <div className="mt-2 font-semibold">{v.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{v.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 90-Day Yard Reset */}
      <section className="bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              The 90-Day Yard Reset
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold" data-testid="text-reset-title">
              What actually happens
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {RESET_STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-5" data-testid={`card-reset-${s.n}`}>
                <div className="text-primary text-3xl font-extrabold">0{s.n}</div>
                <div className="mt-1 font-semibold">{s.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Reports (before/after placeholders) */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" data-testid="text-mission-title">Mission Reports</h2>
        <p className="text-center text-muted-foreground mb-8 text-sm">Before & after from real North Alabama yards.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            "/attached_assets/alabama-problem-yard-overgrown.jpg",
            "/attached_assets/alabama-shrub-care-commercial-tools.jpg",
            "/attached_assets/image_1773038395368.jpg",
            "/attached_assets/image_1773038646682.jpg",
            "/attached_assets/image_1771515240048.png",
            "/attached_assets/image_1771515499043.png",
          ].map((src, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-muted overflow-hidden border border-border" data-testid={`img-mission-${i}`}>
              <img
                src={src}
                alt="Mission report"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  (e.currentTarget.parentElement as HTMLElement).classList.add("bg-gradient-to-br", "from-primary/20", "to-primary/5");
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" data-testid="text-testimonials-title">
            {TESTIMONIALS.sectionTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.reviews.slice(0, 3).map((t) => (
              <div key={t.id} className="rounded-xl border border-border bg-card p-5" data-testid={`card-testimonial-${t.id}`}>
                <div className="flex gap-0.5 text-yellow-500 mb-2">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm">"{t.quote}"</p>
                <div className="mt-3 text-xs text-muted-foreground">— {t.name}, {t.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions strip */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-5" data-testid="card-promo-birthday">
            <div className="text-xs uppercase tracking-wide text-primary font-semibold">Birthday Bonus</div>
            <div className="mt-1 font-semibold">A free service month on us</div>
            <div className="text-sm text-muted-foreground mt-1">
              Sign up during your birthday month and we'll add a bonus visit to your patrol.
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5" data-testid="card-promo-commitment">
            <div className="text-xs uppercase tracking-wide text-primary font-semibold">Loyalty Savings</div>
            <div className="mt-1 font-semibold">Lower price the longer you stay</div>
            <div className="text-sm text-muted-foreground mt-1">
              Our loyalty price drop rewards Troopers who stick with us — not punishes them.
            </div>
          </div>
        </div>
      </section>

      {/* Referral */}
      <section className="bg-primary/5 border-y border-primary/20">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold" data-testid="text-referral-title">Refer a neighbor — both yards win.</div>
            <div className="text-sm text-muted-foreground">Get a service credit when they enlist. They get a Yard Reset bonus.</div>
          </div>
          <a href={getTelHref()} data-testid="link-referral-call">
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" /> Ask about referrals
            </Button>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6" data-testid="text-faq-title">Quick answers</h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} data-testid={`faq-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Builder */}
      <section id="builder" className="bg-muted/30 border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" /> 60-second builder
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold" data-testid="text-builder-title">
              Build your patrol plan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Three quick steps. We'll handle the rest.
            </p>
          </div>
          <SimpleBuilder />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-bold text-lg">
              Lawn <span className="text-primary">Trooper</span>
            </div>
            <p className="text-muted-foreground mt-2">{FOOTER_CONTENT.serviceArea}</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Contact</div>
            <a href={getTelHref()} className="block hover:text-primary" data-testid="link-footer-call">
              <Phone className="inline h-3.5 w-3.5 mr-1.5" />
              {LT_PHONE_DISPLAY}
            </a>
            <a href={`mailto:${FOOTER_CONTENT.email}`} className="block hover:text-primary mt-1" data-testid="link-footer-email">
              {FOOTER_CONTENT.email}
            </a>
          </div>
          <div>
            <div className="font-semibold mb-2">Legal</div>
            <a href="/privacy-policy" className="block hover:text-primary" data-testid="link-footer-privacy">Privacy Policy</a>
            <a href="/terms-of-service" className="block hover:text-primary mt-1" data-testid="link-footer-terms">Terms of Service</a>
            <a href="/legacy" className="block hover:text-muted-foreground mt-1 text-xs text-muted-foreground" data-testid="link-footer-legacy">Classic site</a>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Lawn Trooper. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
