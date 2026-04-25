import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Loader2, MessageCircle, Phone, ShieldCheck, Sparkles, Scissors, Leaf, Flower2, Flower, Trash2, Wind, Shovel, Droplets, Bug } from "lucide-react";
import touchMulchImg from "@assets/mulch-brown-refresh-alabama.jpg";
import touchWeedImg from "@assets/weed-control-fertilizer-upgrade.png";
import touchShrubImg from "@assets/alabama-shrub-care-commercial-tools.jpg";
import touchLeafImg from "@assets/pine-straw-upgrade.jpg";
import touchFlowerImg from "@assets/stock_images/colorful_seasonal_fl_f56cde03.jpg";
import touchTrashImg from "@assets/stock_images/residential_garbage__c1c3e341.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PLANS, EXECUTIVE_PLUS, type PlanId } from "@/data/plans";
import { getTelHref, LT_PHONE_DISPLAY } from "@/data/callFirst";

type YardSizeKey = "small" | "medium" | "large";

const YARD_SIZES: Array<{ key: YardSizeKey; title: string; sub: string; helper?: string; multiplier: number }> = [
  { key: "small", title: "Small", sub: "Up to 1/3 acre", helper: "Most homes · Not sure? Start here", multiplier: 1.0 },
  { key: "medium", title: "Medium", sub: "1/3 – 2/3 acre", multiplier: 1.2 },
  { key: "large", title: "Large", sub: "2/3 – 1 acre", helper: "1+ acre? We'll send a custom quote.", multiplier: 1.44 },
];

const FRONT_YARD_DISCOUNT_RATE = 0.3;

type TouchKey =
  | "mulch_refresh"
  | "weed_control"
  | "flower_bed_flowers"
  | "trash_can_cleaning"
  | "shrub_trimming"
  | "leaf_cleanup"
  | "aeration"
  | "flower_bed_weeding"
  | "seasonal_flower_pop";

type TouchIcon = typeof Leaf;

const TOUCHES: Array<{
  key: TouchKey;
  label: string;
  desc: string;
  icon: TouchIcon;
  thumb?: string;
  basicAddonId?: string;
  premiumAddonId?: string;
}> = [
  {
    key: "mulch_refresh",
    label: "Mulch refresh",
    desc: "Fresh hardwood or pine bark for the beds.",
    icon: Leaf,
    thumb: touchMulchImg,
    basicAddonId: "mulch_install_4yards",
  },
  {
    key: "weed_control",
    label: "Weed control",
    desc: "Sharper lines, fewer weeds across the lawn.",
    icon: Bug,
    thumb: touchWeedImg,
    basicAddonId: "extra_weed_control",
  },
  {
    key: "flower_bed_flowers",
    label: "Flower bed flowers",
    desc: "Seasonal color installs in your beds.",
    icon: Flower2,
    thumb: touchFlowerImg,
    premiumAddonId: "seasonal_color_flowers",
  },
  {
    key: "trash_can_cleaning",
    label: "Trash can cleaning",
    desc: "Fresh-smelling bins, no scrubbing on your end.",
    icon: Trash2,
    thumb: touchTrashImg,
    basicAddonId: "quarterly_trash_bin_cleaning",
  },
  {
    key: "shrub_trimming",
    label: "Shrub trimming",
    desc: "Shape, cleanup, and clippings hauled.",
    icon: Scissors,
    thumb: touchShrubImg,
    basicAddonId: "shrub_hedge_trimming",
  },
  {
    key: "leaf_cleanup",
    label: "Leaf cleanup",
    desc: "Single-visit blow, rake & haul.",
    icon: Wind,
    thumb: touchLeafImg,
    basicAddonId: "one_time_leaf_removal",
  },
  {
    key: "aeration",
    label: "Aeration",
    desc: "Stronger roots, better water absorption.",
    icon: Shovel,
    premiumAddonId: "aeration_dethatching",
  },
  {
    key: "flower_bed_weeding",
    label: "Flower bed weeding",
    desc: "Beds kept clean visit-to-visit.",
    icon: Droplets,
    basicAddonId: "extra_weed_control",
  },
  {
    key: "seasonal_flower_pop",
    label: "Seasonal flower pop",
    desc: "Twice-a-year highlight color refresh.",
    icon: Flower,
    premiumAddonId: "seasonal_color_flowers",
  },
];

const PLAN_ORDER: PlanId[] = ["basic", "premium", "executive"];
const PLAN_BULLETS: Record<PlanId, string[]> = {
  basic: ["Bi-weekly mowing + 1 Seasonal Touch per season"],
  premium: ["Weekly mowing + 2 Seasonal Touches per season"],
  executive: ["Priority service + 3 Seasonal Touches per season"],
};

type ContactMethod = "text" | "phone" | "either";

interface BuilderState {
  step: 1 | 2 | 3;
  yardSize: YardSizeKey | null;
  address: string;
  plan: PlanId | null;
  touches: TouchKey[];
  scope: "front" | "full";
  goal: string;
  name: string;
  phone: string;
  email: string;
  contactMethod: ContactMethod;
  executivePlus: boolean;
}

const INITIAL: BuilderState = {
  step: 1,
  yardSize: null,
  address: "",
  plan: null,
  touches: [],
  scope: "full",
  goal: "",
  name: "",
  phone: "",
  email: "",
  contactMethod: "text",
  executivePlus: false,
};

function priceFor(plan: PlanId | null, yard: YardSizeKey | null, executivePlus: boolean): number {
  if (!plan) return 0;
  const planDef = PLANS.find((p) => p.id === plan);
  if (!planDef) return 0;
  const mult = YARD_SIZES.find((y) => y.key === yard)?.multiplier ?? 1;
  const base = Math.round(planDef.price * mult);
  return base + (plan === "executive" && executivePlus ? EXECUTIVE_PLUS.price : 0);
}

function openChatWithTelFallback() {
  if (typeof document !== "undefined") {
    const candidates = [
      "#leadconnector-chat-widget button",
      "[data-chat-provider='ghl'] button",
      "[id*='lc_chat'] button",
      "[class*='chat-widget'] button",
    ];
    for (const sel of candidates) {
      const el = document.querySelector<HTMLElement>(sel);
      if (el) {
        el.click();
        return;
      }
    }
  }
  window.location.href = getTelHref();
}

function mapTouchesToAddons(touches: TouchKey[]) {
  const basic = new Set<string>();
  const premium = new Set<string>();
  for (const key of touches) {
    const t = TOUCHES.find((x) => x.key === key);
    if (!t) continue;
    if (t.basicAddonId) basic.add(t.basicAddonId);
    if (t.premiumAddonId) premium.add(t.premiumAddonId);
  }
  return { basicAddons: Array.from(basic), premiumAddons: Array.from(premium) };
}

interface SimpleBuilderProps {
  initialPlan?: PlanId | null;
}

export default function SimpleBuilder({ initialPlan = null }: SimpleBuilderProps = {}) {
  const [state, setState] = useState<BuilderState>(() => {
    let plan: PlanId | null = initialPlan;
    if (!plan && typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("plan");
      if (param === "basic" || param === "premium" || param === "executive") {
        plan = param;
      }
    }
    return plan ? { ...INITIAL, plan, step: 1 } : INITIAL;
  });

  useEffect(() => {
    if (initialPlan && initialPlan !== state.plan) {
      setState((s) => ({ ...s, plan: initialPlan }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPlan]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | {
    plan: PlanId;
    price: number;
    leadId?: string;
  }>(null);
  const [touchesOpen, setTouchesOpen] = useState(false);
  const [postTouches, setPostTouches] = useState<TouchKey[]>([]);

  const { toast } = useToast();
  const topRef = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = (patch: Partial<BuilderState>) => setState((s) => ({ ...s, ...patch }));

  const basePrice = useMemo(
    () => priceFor(state.plan, state.yardSize, state.executivePlus),
    [state.plan, state.yardSize, state.executivePlus],
  );

  const currentPrice = useMemo(() => {
    if (state.scope === "front" && basePrice > 0) {
      return Math.round(basePrice * (1 - FRONT_YARD_DISCOUNT_RATE));
    }
    return basePrice;
  }, [basePrice, state.scope]);

  const frontYardDiscount = state.scope === "front" ? basePrice - currentPrice : 0;

  const canAdvance = useMemo(() => {
    if (state.step === 1) return Boolean(state.yardSize);
    if (state.step === 2) return Boolean(state.plan);
    if (state.step === 3)
      return (
        state.name.trim().length >= 2 &&
        state.phone.replace(/\D/g, "").length >= 7
      );
    return false;
  }, [state]);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state.step, submitted]);

  const goNext = () => {
    if (!canAdvance) return;
    if (state.step < 3) {
      update({ step: (state.step + 1) as BuilderState["step"] });
    } else {
      submit();
    }
  };

  const goBack = () => {
    if (state.step > 1) update({ step: (state.step - 1) as BuilderState["step"] });
  };

  const togglePostTouch = (key: TouchKey) => {
    setPostTouches((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  useEffect(() => {
    if (!submitted?.leadId || postTouches.length === 0) return;
    if (touchSaveTimerRef.current) clearTimeout(touchSaveTimerRef.current);
    touchSaveTimerRef.current = setTimeout(() => {
      fetch(`/api/leads/${submitted.leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ touches: postTouches }),
      }).catch(() => {});
    }, 600);
  }, [postTouches, submitted?.leadId]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      if (touchSaveTimerRef.current) clearTimeout(touchSaveTimerRef.current);
    };
  }, []);

  async function submit() {
    if (!state.plan || !state.yardSize) return;
    setSubmitting(true);
    try {
      const { basicAddons, premiumAddons } = mapTouchesToAddons(state.touches);
      const planDef = PLANS.find((p) => p.id === state.plan)!;
      const scopeLabel = state.scope === "front" ? "Front yard only" : "Full property";
      const noteParts = [
        `[SimpleBuilder] 90-Day Yard Reset request`,
        `Yard scope: ${scopeLabel}`,
        `Pricing: base $${basePrice}/mo${state.scope === "front" ? `, front-yard discount −$${frontYardDiscount}/mo` : ""}, total $${currentPrice}/mo`,
        state.goal ? `Lawn goal: ${state.goal}` : null,
        `Contact pref: ${state.contactMethod}`,
        state.touches.length
          ? `Touches: ${state.touches.map((k) => TOUCHES.find((t) => t.key === k)?.label).join(", ")}`
          : null,
        state.executivePlus ? `Executive+ add-on requested` : null,
      ].filter(Boolean);

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          phone: state.phone.trim(),
          email: state.email.trim() || null,
          address: state.address.trim() || null,
          contactMethod: state.contactMethod,
          yardSize: state.yardSize,
          plan: planDef.name,
          basicAddons,
          premiumAddons,
          notes: noteParts.join(" | "),
          totalPrice: String(currentPrice),
          monthlyPrice: String(currentPrice),
          executivePlus: state.executivePlus ? "true" : "false",
          basePrice: String(basePrice),
          frontYardDiscount: String(frontYardDiscount),
          yardScope: state.scope,
          upgradeOverage: "0",
          term: "monthly",
          segments: ["simple_builder", "home_v2"],
          appliedPromos: ["90 Day Yard Reset"],
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Could not submit your request. Please try again.");
      }

      setSubmitted({ plan: state.plan, price: currentPrice, leadId: data.leadId });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    const planDef = PLANS.find((p) => p.id === submitted.plan)!;
    return (
      <div ref={topRef} className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm" data-testid="builder-confirmation">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold tracking-wide uppercase" data-testid="badge-yard-reset">
            <Sparkles className="h-3.5 w-3.5" /> 90-Day Yard Reset
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold" data-testid="text-confirmation-title">
            You're set, {state.name.split(" ")[0] || "Trooper"}.
          </h3>
          <p className="text-muted-foreground max-w-md">
            Your plan is locked in. A real Lawn Trooper will reach out within 24 hours to confirm your start date and walk through the 90-Day Reset.
          </p>
          <div className="mt-2 w-full max-w-sm rounded-xl border border-border bg-background p-4 text-left">
            <div className="flex items-baseline justify-between">
              <span className="text-sm uppercase tracking-wide text-muted-foreground">Best-fit plan</span>
              <span className="text-xs text-muted-foreground">Monthly</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-lg font-semibold" data-testid="text-confirmation-plan">{planDef.name}</span>
              <span className="text-2xl font-bold text-primary" data-testid="text-confirmation-price">
                ${submitted.price}/mo
              </span>
            </div>
          </div>
          <div className="mt-4 grid w-full max-w-sm grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              className="w-full"
              size="lg"
              data-testid="link-confirmation-call"
              onClick={openChatWithTelFallback}
            >
              <MessageCircle className="h-4 w-4 mr-2" /> Talk to Lawn Trooper AI
            </Button>
            <a href={getTelHref()} className="w-full" data-testid="button-confirmation-book">
              <Button variant="outline" size="lg" className="w-full">
                <Phone className="h-4 w-4 mr-2" /> Call to schedule
              </Button>
            </a>
          </div>

          {/* Optional seasonal touches — captured post-submit, discussed on the call */}
          <div className="mt-4 w-full max-w-sm">
            <button
              type="button"
              data-testid="button-touches-toggle"
              onClick={() => setTouchesOpen((o) => !o)}
              className="w-full flex items-center justify-between rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
            >
              <span>Anything to add to your yard plan?</span>
              {touchesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {touchesOpen && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-left">
                {TOUCHES.map((t) => {
                  const active = postTouches.includes(t.key);
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      data-testid={`button-post-touch-${t.key}`}
                      onClick={() => togglePostTouch(t.key)}
                      className={`relative rounded-xl border overflow-hidden transition flex flex-col ${
                        active
                          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                          : "border-border hover:border-primary/40 bg-card"
                      }`}
                    >
                      <div className="relative h-16 w-full bg-muted">
                        {t.thumb ? (
                          <img src={t.thumb} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                        ) : (
                          <div className={`flex h-full w-full items-center justify-center ${active ? "text-primary" : "text-muted-foreground"}`}>
                            <Icon className="h-7 w-7" />
                          </div>
                        )}
                        {active && (
                          <span className="absolute top-1 right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </div>
                      <div className="p-2">
                        <div className="font-semibold text-xs leading-tight">{t.label}</div>
                      </div>
                    </button>
                  );
                })}
                {postTouches.length > 0 && (
                  <p className="col-span-2 text-xs text-muted-foreground text-center pt-1">
                    We'll go over these when we call. No commitment needed.
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="mt-2 text-xs text-muted-foreground max-w-md">
            Billed monthly. No long-term commitment to get started — we'll cover everything on the call.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm" data-testid="simple-builder">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-2 w-8 rounded-full transition ${
                n <= state.step ? "bg-primary" : "bg-muted"
              }`}
              data-testid={`progress-step-${n}`}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-muted-foreground" data-testid="text-step-label">
          Step {state.step} of 3
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={state.step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── Step 1: Yard size + scope ── */}
          {state.step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold" data-testid="text-step1-title">How big is your yard?</h3>
                <p className="text-sm text-muted-foreground">Tap the closest match — we'll fine-tune the price after.</p>
              </div>
              {state.plan && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-sm" data-testid="banner-plan-preselected">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    <span className="font-semibold text-primary">
                      {state.plan === "basic" ? "Standard Patrol" : state.plan === "premium" ? "Premium Patrol" : "Executive Command"}
                    </span>
                    {" "}selected — choose your yard size to confirm pricing.
                  </span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {YARD_SIZES.map((y) => {
                  const active = state.yardSize === y.key;
                  return (
                    <button
                      key={y.key}
                      type="button"
                      onClick={() => update({ yardSize: y.key })}
                      data-testid={`button-yard-${y.key}`}
                      className={`text-left rounded-xl border p-3 sm:p-4 transition active:scale-[0.98] ${
                        active
                          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{y.title}</span>
                        {active && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{y.sub}</div>
                      {y.helper && (
                        <div className="text-[11px] text-primary mt-1 font-medium">{y.helper}</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Scope toggle */}
              <div>
                <div className="text-sm font-medium mb-1.5">Which part of the property?</div>
                <div className="grid grid-cols-2 gap-2">
                  {(["full", "front"] as const).map((opt) => {
                    const active = state.scope === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        data-testid={`button-scope-${opt}`}
                        onClick={() => update({ scope: opt })}
                        className={`rounded-xl border p-3 text-sm font-medium transition ${
                          active
                            ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="font-semibold">{opt === "full" ? "Full property" : "Front yard only"}</div>
                        {opt === "front" && (
                          <div className="text-[11px] text-primary mt-0.5 font-medium">Save ~30%</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-muted-foreground" data-testid="text-yard-note">
                Not sure? Choose Small and we'll confirm after photos or your walkthrough.
              </p>
              <div
                className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                data-testid="custom-quote-handoff"
              >
                <div>
                  <div className="text-sm font-semibold">Yard over 1 acre?</div>
                  <div className="text-xs text-muted-foreground">
                    Acreage, HOA, or commercial — we'll send a custom quote.
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    data-testid="button-custom-quote-call"
                    onClick={() => { window.location.href = getTelHref(); }}
                  >
                    <Phone className="h-3.5 w-3.5 mr-1" /> {LT_PHONE_DISPLAY}
                  </Button>
                  <Button
                    size="sm"
                    data-testid="button-custom-quote-chat"
                    onClick={openChatWithTelFallback}
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1" /> Custom quote
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="builder-address" className="text-sm">Neighborhood or address (optional)</Label>
                <Input
                  id="builder-address"
                  data-testid="input-address"
                  value={state.address}
                  onChange={(e) => update({ address: e.target.value })}
                  placeholder="e.g., Twickenham, Huntsville"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Plan selection + exec+ inline ── */}
          {state.step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold" data-testid="text-step2-title">Pick your patrol level</h3>
                <p className="text-sm text-muted-foreground">Real monthly pricing. Tap to select.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PLAN_ORDER.map((id) => {
                  const active = state.plan === id;
                  const popular = id === "premium";
                  const displayName =
                    id === "basic"
                      ? "Standard Patrol"
                      : id === "premium"
                        ? "Premium Patrol"
                        : "Executive Command";
                  const price = priceFor(id, state.yardSize, false);
                  const scopedPrice = id && state.scope === "front"
                    ? Math.round(price * (1 - FRONT_YARD_DISCOUNT_RATE))
                    : price;
                  return (
                    <button
                      key={id}
                      type="button"
                      data-testid={`button-plan-${id}`}
                      onClick={() => {
                        if (id === "executive") {
                          update({ plan: id });
                          if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
                          advanceTimerRef.current = setTimeout(() => update({ step: 3 }), 600);
                        } else {
                          update({ plan: id, executivePlus: false });
                          if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
                          advanceTimerRef.current = setTimeout(() => update({ step: 3 }), 180);
                        }
                      }}
                      className={`relative text-left rounded-xl border p-4 transition active:scale-[0.99] ${
                        active
                          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      {popular && (
                        <span className="absolute -top-2 right-3 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                          Most Popular
                        </span>
                      )}
                      <div className="flex items-baseline justify-between">
                        <span className="font-semibold">{displayName}</span>
                        {active && id !== "executive" && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="mt-1 text-2xl font-bold text-primary" data-testid={`text-plan-price-${id}`}>
                        ${scopedPrice}
                        <span className="text-sm font-medium text-muted-foreground">/mo</span>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {PLAN_BULLETS[id].map((b) => (
                          <li key={b} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Executive+ inline toggle — only shows when executive card is selected */}
                      {id === "executive" && active && (
                        <div
                          className={`mt-3 rounded-lg border p-2.5 transition ${
                            state.executivePlus
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            update({ executivePlus: !state.executivePlus });
                            if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
                            advanceTimerRef.current = setTimeout(() => update({ step: 3 }), 600);
                          }}
                          data-testid="button-executive-plus"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Add Executive+</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-primary">+${EXECUTIVE_PLUS.price}/mo</span>
                              {state.executivePlus && <Check className="h-3.5 w-3.5 text-primary" />}
                            </div>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            Strategy sessions, priority response, expanded coverage.
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {state.plan === "executive" && (
                <p className="text-xs text-center text-muted-foreground">
                  Executive+ is optional — you have a moment to decide.
                </p>
              )}
            </div>
          )}

          {/* ── Step 3: Contact info ── */}
          {state.step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold" data-testid="text-step3-title">Last step — who are we sending this to?</h3>
                <p className="text-sm text-muted-foreground">We'll reach out to confirm your plan and schedule the first visit.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="builder-name" className="text-sm">Your name *</Label>
                  <Input
                    id="builder-name"
                    data-testid="input-name"
                    value={state.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="First & last"
                    className="mt-1"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <Label htmlFor="builder-phone" className="text-sm">Phone *</Label>
                  <Input
                    id="builder-phone"
                    data-testid="input-phone"
                    value={state.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    placeholder="(256) 555-0123"
                    type="tel"
                    className="mt-1"
                    autoComplete="tel"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="builder-email" className="text-sm">Email (optional)</Label>
                  <Input
                    id="builder-email"
                    data-testid="input-email"
                    value={state.email}
                    onChange={(e) => update({ email: e.target.value })}
                    placeholder="you@example.com"
                    type="email"
                    className="mt-1"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-1.5">Best way to reach you</div>
                <div className="grid grid-cols-3 gap-2">
                  {(["text", "phone", "either"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      data-testid={`button-contact-${m}`}
                      onClick={() => update({ contactMethod: m })}
                      className={`rounded-lg border p-2 text-sm font-medium transition ${
                        state.contactMethod === m
                          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      {m === "text" ? "Text me" : m === "phone" ? "Call me" : "Either"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div
        className="sticky bottom-0 left-0 right-0 -mx-4 sm:-mx-6 mt-6 px-4 sm:px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-card border-t border-border flex items-center gap-3"
        data-testid="builder-footer"
      >
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Estimated</div>
          <div className="text-lg font-bold text-primary" data-testid="text-current-price">
            {currentPrice > 0 ? `$${currentPrice}/mo` : "—"}
          </div>
        </div>
        {state.step > 1 && (
          <Button variant="outline" size="lg" onClick={goBack} data-testid="button-back">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="lg"
          onClick={goNext}
          disabled={!canAdvance || submitting}
          data-testid="button-continue"
          className="min-w-[140px]"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : state.step === 3 ? (
            <>
              <ShieldCheck className="h-4 w-4 mr-2" /> Lock in plan
            </>
          ) : (
            <>
              Continue <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Prefer to talk?{" "}
        <a href={getTelHref()} className="font-semibold text-primary underline-offset-2 hover:underline" data-testid="link-builder-call">
          Call {LT_PHONE_DISPLAY}
        </a>
      </p>
    </div>
  );
}
