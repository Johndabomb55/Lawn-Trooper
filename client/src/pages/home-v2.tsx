import { useEffect, useState, useRef, useCallback } from "react";
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
  Facebook,
  Instagram,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SimpleBuilder from "@/components/SimpleBuilder";
import { getTelHref, LT_PHONE_DISPLAY } from "@/data/callFirst";
import { TESTIMONIALS, FOOTER_CONTENT } from "@/data/content";

// Brand assets
import companyLogo from "@assets/lawn-trooper-logo-badge-2026-transparent.png";
import bgLandscape from "@assets/generated_images/beautiful_landscaped_yard_background.png";
import camoPattern from "@assets/generated_images/subtle_camo_texture_background.png";

// Plan lifestyle photos
import imgBasic from "@assets/generated_images/athens_al_middle_class_home_landscaping.png";
import imgPremium from "@assets/stock_images/flower_bed_landscapi_f38aa87f.jpg";
import imgExecutive from "@assets/stock_images/beautiful_green_lawn_e7c60690.jpg";

// Mission report before/after photos
import missionBefore1 from "@assets/alabama-problem-yard-overgrown.jpg";
import missionAfter1 from "@assets/mulch-brown-refresh-alabama.jpg";
import missionBefore2 from "@assets/generated_images/madison_al_home_with_fewer_flowers.png";
import missionAfter2 from "@assets/generated_images/madison_al_home_with_trimmed_shrubs.png";
import missionBefore3 from "@assets/generated_images/basic_neat_lawn_without_flowers.png";
import missionAfter3 from "@assets/generated_images/manicured_lawn_with_mower_stripes.png";
import missionBefore4 from "@assets/generated_images/huntsville_al_home_landscaping.png";
import missionAfter4 from "@assets/generated_images/manicured_garden_huntsville.png";

const PAGE_TITLE = "Lawn Trooper | The 90-Day Yard Reset";

const PLAN_CARDS = [
  {
    id: "basic" as const,
    name: "Standard Patrol",
    price: 169,
    img: imgBasic,
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
    img: imgPremium,
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
    img: imgExecutive,
    bullets: [
      "Weekly mowing + bi-weekly off-season",
      "Up to 7 turf treatments / year",
      "Weed-free turf guarantee",
    ],
  },
];

const VALUE_PROPS = [
  { icon: Award, title: "25+ years local", body: "Built in North Alabama. 100+ beautification awards." },
  { icon: Leaf, title: "Electric crew options", body: "Battery mowers, lower emissions, neighbor-friendly." },
  { icon: ShieldCheck, title: "Loyalty price drop", body: "Your rate goes down the longer you stay." },
  { icon: Zap, title: "Real human account manager", body: "No call center. A real person owns your yard." },
];

const RESET_STEPS = [
  { n: 1, title: "Day 1 — Recon", body: "Quick property walk + AI yard plan emailed to you." },
  { n: 2, title: "Days 2–30 — Reset", body: "Heavy lift: catch-up trim, mow, edge, beds reset." },
  { n: 3, title: "Days 31–90 — Lock-in", body: "Weekly rhythm dialed. Yard locked into mission-ready." },
];

const MISSION_REPORTS = [
  {
    before: missionBefore1,
    after: missionAfter1,
    caption: "90-Day Yard Reset — overgrown beds cleared, edged, and refreshed with brown mulch.",
    real: true,
  },
  {
    before: missionBefore2,
    after: missionAfter2,
    caption: "Madison brick two-story — shrubs shaped, beds re-mulched, seasonal color added.",
    real: false,
  },
  {
    before: missionBefore3,
    after: missionAfter3,
    caption: "Mowing plan upgrade — fresh stripes, crisp edges, and a thicker, deeper green.",
    real: false,
  },
  {
    before: missionBefore4,
    after: missionAfter4,
    caption: "Huntsville curb appeal — bed lines reshaped, hedges tightened, fresh edging installed.",
    real: false,
  },
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

let _sliderHintShown = false;

function BeforeAfterSlider({ before, after, caption }: { before: string; after: string; caption: string }) {
  const [pos, setPos] = useState(50);
  const [showHint, setShowHint] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (!_sliderHintShown) {
      _sliderHintShown = true;
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 2200);
      return () => clearTimeout(timer);
    }
  }, []);

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  const dismissHint = useCallback(() => {
    setShowHint(false);
    setInteracted(true);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    dismissHint();
    updatePos(e.clientX);
  }, [updatePos, dismissHint]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    updatePos(e.clientX);
  }, [updatePos]);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragging.current = true;
    dismissHint();
    updatePos(e.touches[0].clientX);
  }, [updatePos, dismissHint]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging.current) return;
    updatePos(e.touches[0].clientX);
  }, [updatePos]);

  const onTouchEnd = useCallback(() => { dragging.current = false; }, []);
  const onTouchCancel = useCallback(() => { dragging.current = false; }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + 5));
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none overflow-hidden rounded-lg cursor-col-resize"
      style={{ aspectRatio: "4/3", touchAction: "none" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
      data-testid="slider-before-after"
    >
      <img
        src={after}
        alt={`After: ${caption}`}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={before}
          alt={`Before: ${caption}`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <span className="absolute top-3 left-3 z-10 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          Before
        </span>
      </div>
      <span className="absolute top-3 right-3 z-10 rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">
        After
      </span>
      <div
        className="absolute top-0 bottom-0 z-20 flex items-center justify-center"
        style={{ left: `calc(${pos}% - 1px)` }}
      >
        <div className="w-0.5 h-full bg-white/80 shadow" />
        <div
          role="slider"
          aria-label="Before/after comparison slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className={`absolute flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg border border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring${showHint ? " animate-slider-nudge animate-pulse-ring" : ""}`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 9H12.5M5.5 9L7.5 7M5.5 9L7.5 11M12.5 9L10.5 7M12.5 9L10.5 11" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-black/50 px-3 py-1 text-[10px] text-white tracking-wide pointer-events-none transition-opacity duration-500"
        style={{ opacity: interacted ? 0 : 1 }}
        aria-hidden={interacted}
      >
        Drag to compare
      </div>
    </div>
  );
}

export default function HomeV2() {
  const [selectedMission, setSelectedMission] = useState<number | null>(null);

  const navigateMission = useCallback((dir: 1 | -1) => {
    setSelectedMission((prev) => {
      if (prev === null) return prev;
      return (prev + dir + MISSION_REPORTS.length) % MISSION_REPORTS.length;
    });
  }, []);

  useEffect(() => {
    if (selectedMission === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.getAttribute("role") === "slider") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); navigateMission(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); navigateMission(1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedMission, navigateMission]);

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
      <SiteHeader />

      {/* ── Hero ── */}
      <section id="top" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgLandscape}
            alt="Beautifully landscaped North Alabama yard"
            className="w-full h-full object-cover brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: `url(${camoPattern})`, backgroundSize: "400px" }}
          />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-8 pb-16 text-center">
          {/* Animated logo */}
          <motion.img
            src={companyLogo}
            alt="Lawn Trooper Premium Exterior Care logo"
            className="mx-auto w-56 sm:w-72 md:w-96 object-contain drop-shadow-2xl mb-4"
            initial={{ opacity: 0, scale: 0.75, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            data-testid="img-hero-logo"
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/30 text-white px-3 py-1 text-xs font-semibold tracking-wide uppercase mb-4"
              data-testid="badge-hero"
            >
              <Sparkles className="h-3.5 w-3.5" /> The 90-Day Yard Reset
            </span>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg leading-none"
              data-testid="text-hero-headline"
            >
              Your yard, locked into<br className="hidden sm:block" /> mission-ready in 90 days.
            </h1>
            <p
              className="mt-4 text-base sm:text-lg text-white/90 max-w-xl mx-auto"
              data-testid="text-hero-sub"
            >
              Real monthly pricing. Real local crew. Build your plan in 60 seconds — or talk to Lawn Trooper AI right now.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <a href={getTelHref()} className="w-full sm:w-auto" data-testid="link-hero-call">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wide py-6"
                >
                  <Phone className="h-5 w-5 mr-2" /> Talk to Lawn Trooper AI
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/60 bg-white/10 text-white hover:bg-white/20 font-semibold py-6"
                onClick={scrollToBuilder}
                data-testid="button-hero-build"
              >
                Build My Plan in 60 Seconds <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <p className="mt-5 text-xs text-white/70">
              Licensed &amp; insured · 25+ years in the Tennessee Valley
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Plan cards ── */}
      <section className="bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" data-testid="text-plans-title">
            Three patrol levels. Real monthly prices.
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto text-sm">
            No haggling. No mystery quotes. Pick a level — fine-tune the touches in the builder below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PLAN_CARDS.map((p) => (
              <div
                key={p.id}
                data-testid={`card-plan-${p.id}`}
                className={`relative rounded-2xl border bg-card overflow-hidden flex flex-col ${
                  p.popular ? "border-primary shadow-xl ring-2 ring-primary/20" : "border-border"
                }`}
              >
                {p.popular && (
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-full bg-primary text-primary-foreground px-3 py-1 text-[11px] font-semibold tracking-wide uppercase shadow">
                    Most Popular
                  </span>
                )}
                {/* Lifestyle photo */}
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    data-testid={`img-plan-${p.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                {/* Card body */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{p.name}</div>
                  <div className="mt-1 text-3xl font-bold text-primary">
                    ${p.price}
                    <span className="text-sm font-medium text-muted-foreground">/mo</span>
                  </div>
                  <ul className="mt-4 space-y-2 flex-1">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" data-testid="text-why-title">
          Why choose the Trooper
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_PROPS.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border border-border bg-card p-5"
              data-testid={`card-value-${v.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <v.icon className="h-7 w-7 text-primary" />
              <div className="mt-3 font-semibold">{v.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{v.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 90-Day Yard Reset ── */}
      <section className="bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" /> The 90-Day Yard Reset
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold" data-testid="text-reset-title">
              What actually happens
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {RESET_STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-6" data-testid={`card-reset-${s.n}`}>
                <div className="text-primary text-4xl font-extrabold">0{s.n}</div>
                <div className="mt-2 font-semibold text-base">{s.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Reports ── */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" data-testid="text-mission-title">
          Mission Reports
        </h2>
        <p className="text-center text-muted-foreground mb-10 text-sm max-w-2xl mx-auto">
          Before &amp; after transformations from the 90-Day Yard Reset playbook.{" "}
          <span className="text-xs">
            Pairs marked <span className="font-semibold text-primary">Real Job</span> are actual North Alabama customers; others are representative renders.
          </span>
        </p>
        <div className="grid grid-cols-1 gap-8">
          {MISSION_REPORTS.map((pair, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              className="rounded-2xl border border-border bg-card overflow-hidden text-left w-full cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setSelectedMission(i)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedMission(i); } }}
              data-testid={`card-mission-${i}`}
              aria-label={`Expand mission report: ${pair.caption}`}
            >
              <div className="relative grid grid-cols-2 gap-1 bg-border">
                {/* Before */}
                <div className="relative h-[300px] md:h-[400px] overflow-hidden" data-testid={`img-mission-${i}-before`}>
                  <span className="absolute top-3 left-3 z-10 rounded-md bg-black/75 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                    Before
                  </span>
                  <img
                    src={pair.before}
                    alt={`Before: ${pair.caption}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                {/* After */}
                <div className="relative h-[300px] md:h-[400px] overflow-hidden" data-testid={`img-mission-${i}-after`}>
                  <span className="absolute top-3 left-3 z-10 rounded-md bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow">
                    After
                  </span>
                  <img
                    src={pair.after}
                    alt={`After: ${pair.caption}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white tracking-wide">
                    Tap to compare
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <p className="text-sm text-muted-foreground" data-testid={`text-mission-caption-${i}`}>
                  {pair.caption}
                </p>
                {pair.real ? (
                  <span
                    className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary"
                    data-testid={`badge-mission-real-${i}`}
                  >
                    Real Job
                  </span>
                ) : (
                  <span
                    className="shrink-0 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                    data-testid={`badge-mission-sample-${i}`}
                  >
                    Sample
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <Dialog open={selectedMission !== null} onOpenChange={(open) => { if (!open) setSelectedMission(null); }}>
          <DialogContent
            className="max-w-2xl w-full p-0 overflow-hidden gap-0"
            data-testid="dialog-mission-lightbox"
          >
            {selectedMission !== null && (() => {
              const pair = MISSION_REPORTS[selectedMission];
              return (
                <div className="flex flex-col">
                  <DialogTitle className="sr-only">Mission Report: {pair.caption}</DialogTitle>
                  <div className="relative">
                    <BeforeAfterSlider
                      key={selectedMission}
                      before={pair.before}
                      after={pair.after}
                      caption={pair.caption}
                    />
                    <button
                      aria-label="Previous photo"
                      data-testid="button-lightbox-prev"
                      onClick={() => navigateMission(-1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white shadow-lg hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      aria-label="Next photo"
                      data-testid="button-lightbox-next"
                      onClick={() => navigateMission(1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white shadow-lg hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 pointer-events-none">
                      {MISSION_REPORTS.map((_, i) => (
                        <span
                          key={i}
                          className={`block h-1.5 rounded-full transition-all ${i === selectedMission ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-2 px-4 py-3">
                    <p className="text-sm text-muted-foreground" data-testid="text-lightbox-caption">
                      {pair.caption}
                    </p>
                    {pair.real ? (
                      <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        Real Job
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Sample
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" data-testid="text-testimonials-title">
            {TESTIMONIALS.sectionTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.reviews.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-border bg-card p-5"
                data-testid={`card-testimonial-${t.id}`}
              >
                <div className="flex gap-0.5 text-yellow-500 mb-3">
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

      {/* ── Promotions ── */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

      {/* ── Referral ── */}
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

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6" data-testid="text-faq-title">
          Quick answers
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} data-testid={`faq-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── Builder ── */}
      <section id="builder" className="bg-muted/30 border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" /> 60-second builder
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold" data-testid="text-builder-title">
              Build your patrol plan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Three quick steps. We'll handle the rest.</p>
          </div>
          <SimpleBuilder />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-primary text-primary-foreground pt-14 pb-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand column */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={companyLogo}
                  alt="Lawn Trooper"
                  className="h-12 w-12 object-contain rounded-full bg-white/10"
                />
                <span className="font-bold text-2xl tracking-tight">LAWN TROOPER</span>
              </div>
              <p className="text-primary-foreground/80 max-w-sm mb-5 text-sm">
                Deploying elite lawn care services across North Alabama. Professional, reliable, and always mission-ready.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61588087766755"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-facebook"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://www.instagram.com/lawntrooper"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-instagram"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            {/* Contact column */}
            <div>
              <h4 className="font-bold text-base mb-4 text-accent">Headquarters</h4>
              <p className="text-primary-foreground/80 mb-3 text-sm">Athens, AL</p>
              <div className="space-y-3 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0 text-accent" />
                  <a href={getTelHref()} className="hover:text-white transition-colors" data-testid="link-footer-call">
                    {FOOTER_CONTENT.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-accent" />
                  <a href={`mailto:${FOOTER_CONTENT.email}`} className="hover:text-white transition-colors" data-testid="link-footer-email">
                    {FOOTER_CONTENT.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Service area column */}
            <div>
              <h4 className="font-bold text-base mb-4 text-accent">Service Area</h4>
              <ul className="space-y-1.5 text-sm text-primary-foreground/80">
                {["Huntsville", "Madison", "Athens", "Harvest", "Hampton Cove", "Meridianville"].map((city) => (
                  <li key={city}>{city}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-primary-foreground/60">
                {FOOTER_CONTENT.serviceArea}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-primary-foreground/60">
            <p>© {new Date().getFullYear()} Lawn Trooper. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <Link href="/service-area" className="hover:text-white transition-colors">Service Area</Link>
              <Link href="/hoa-partnerships" className="hover:text-white transition-colors">HOA</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors" data-testid="link-footer-privacy">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors" data-testid="link-footer-terms">Terms of Service</Link>
              <Link href="/legacy" className="hover:text-white/60 transition-colors text-xs text-primary-foreground/40">Classic site</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
