import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Loader2, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  | "bush_trimming"
  | "mulch_refresh"
  | "leaf_cleanup"
  | "edging_detail"
  | "flower_bed_weeding"
  | "flower_pop";

const TOUCHES: Array<{
  key: TouchKey;
  label: string;
  desc: string;
  basicAddonId?: string;
  premiumAddonId?: string;
}> = [
  {
    key: "bush_trimming",
    label: "Bush trimming",
    desc: "Shape, cleanup, and clippings hauled.",
    basicAddonId: "shrub_hedge_trimming",
  },
  {
    key: "mulch_refresh",
    label: "Mulch refresh",
    desc: "Fresh hardwood or pine bark for the beds.",
    basicAddonId: "mulch_install_4yards",
  },
  {
    key: "leaf_cleanup",
    label: "Leaf cleanup",
    desc: "Single-visit blow, rake & haul.",
    basicAddonId: "one_time_leaf_removal",
  },
  {
    key: "edging_detail",
    label: "Edging & weed control",
    desc: "Sharper lines, fewer weeds.",
    basicAddonId: "extra_weed_control",
  },
  {
    key: "flower_bed_weeding",
    label: "Flower bed weeding",
    desc: "Beds kept clean visit-to-visit.",
    basicAddonId: "extra_weed_control",
  },
  {
    key: "flower_pop",
    label: "Seasonal flower pop",
    desc: "Twice-a-year color installs.",
    premiumAddonId: "seasonal_color_flowers",
  },
];

const PLAN_ORDER: PlanId[] = ["basic", "premium", "executive"];
const PLAN_BULLETS: Record<PlanId, string[]> = {
  basic: [
    "Bi-weekly mowing in growing season",
    "Edging, trim & blow every visit",
    "Free yard plan after first month",
  ],
  premium: [
    "Weekly mowing in growing season",
    "Bush care + flower bed weeding included",
    "Service photo updates each visit",
  ],
  executive: [
    "Weekly mowing + bi-weekly off-season",
    "Up to 7 turf treatments / year",
    "Weed-free turf guarantee",
  ],
};

type ContactMethod = "text" | "phone" | "either";

interface BuilderState {
  step: 1 | 2 | 3 | 4;
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

/**
 * Try to open the GHL chat widget. The widget is loaded by GhlChatWidget.tsx
 * via a third-party script, so we look for its launcher in the DOM and click
 * it. If the widget isn't available (script not loaded, hidden route, etc.),
 * fall back to a tel: call.
 */
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
    // Allow ?plan=basic|premium|executive to preselect from a deep link.
    let plan: PlanId | null = initialPlan;
    if (!plan && typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("plan");
      if (param === "basic" || param === "premium" || param === "executive") {
        plan = param;
      }
    }
    return plan ? { ...INITIAL, plan, step: 2 } : INITIAL;
  });

  // Respond to parent passing a new initialPlan (e.g. user clicks a plan card).
  useEffect(() => {
    if (initialPlan && initialPlan !== state.plan) {
      setState((s) => ({ ...s, plan: initialPlan, step: s.step < 2 ? 2 : s.step }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPlan]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | {
    plan: PlanId;
    price: number;
    leadId?: string;
  }>(null);
  const { toast } = useToast();
  const topRef = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(false);

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

  const toggleTouch = (key: TouchKey) => {
    setState((s) => ({
      ...s,
      touches: s.touches.includes(key)
        ? s.touches.filter((t) => t !== key)
        : [...s.touches, key],
    }));
  };

  async function submit() {
    if (!state.plan || !state.yardSize) return;
    setSubmitting(true);
    try {
      const { basicAddons, premiumAddons } = mapTouchesToAddons(state.touches);
      const planDef = PLANS.find((p) => p.id === state.plan)!;
      const noteParts = [
        `[SimpleBuilder] 90-Day Yard Reset request`,
        `Yard scope: ${state.scope === "front" ? "Front yard only" : "Full property"}`,
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
          basePrice: String(basePrice),
          frontYardDiscount: String(frontYardDiscount),
          yardScope: state.scope === "front" ? "Front yard only" : "Full property",
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
            Your best-fit plan is locked in. A real Lawn Trooper will reach out shortly to walk through your 90-day reset.
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
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              data-testid="button-confirmation-book"
              onClick={() => {
                const url = (import.meta.env.VITE_GHL_BOOKING_URL as string | undefined) ?? "";
                if (url) window.open(url, "_blank", "noopener");
                else window.location.href = getTelHref();
              }}
            >
              Book / Reserve
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground max-w-md">
            Billed monthly. We'll walk through full plan details and the consultation refund window when we reach out.
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
          {state.step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold" data-testid="text-step1-title">How big is your yard?</h3>
                <p className="text-sm text-muted-foreground">Tap the closest match — we'll fine-tune the price after.</p>
              </div>
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
              <p className="text-xs text-muted-foreground" data-testid="text-yard-note">
                Not sure? Choose Small and we'll confirm after photos or your walkthrough.
              </p>
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

          {state.step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold" data-testid="text-step2-title">Pick your patrol level</h3>
                <p className="text-sm text-muted-foreground">Real monthly pricing. Tap to select.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PLAN_ORDER.map((id) => {
                  const planDef = PLANS.find((p) => p.id === id)!;
                  const active = state.plan === id;
                  const popular = id === "premium";
                  const displayName =
                    id === "basic"
                      ? "Standard Patrol"
                      : id === "premium"
                        ? "Premium Patrol"
                        : "Executive Command";
                  const price = priceFor(id, state.yardSize, false);
                  return (
                    <button
                      key={id}
                      type="button"
                      data-testid={`button-plan-${id}`}
                      onClick={() => {
                        update({ plan: id });
                        setTimeout(() => update({ step: 3 }), 180);
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
                        {active && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="mt-1 text-2xl font-bold text-primary" data-testid={`text-plan-price-${id}`}>
                        ${price}
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
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {state.step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold" data-testid="text-step3-title">
                  Quick custom touches <span className="text-sm font-normal text-muted-foreground">(optional)</span>
                </h3>
                <p className="text-sm text-muted-foreground">Pick any seasonal touches — or skip and we'll suggest them later.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TOUCHES.map((t) => {
                  const active = state.touches.includes(t.key);
                  return (
                    <button
                      key={t.key}
                      type="button"
                      data-testid={`button-touch-${t.key}`}
                      onClick={() => toggleTouch(t.key)}
                      className={`text-left rounded-xl border p-3 transition ${
                        active
                          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{t.label}</span>
                        {active && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(["front", "full"] as const).map((opt) => {
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
                      {opt === "front" ? "Front yard only" : "Full property"}
                    </button>
                  );
                })}
              </div>

              <div>
                <Label htmlFor="builder-goal" className="text-sm">Your lawn goal (optional)</Label>
                <Textarea
                  id="builder-goal"
                  data-testid="input-goal"
                  value={state.goal}
                  onChange={(e) => update({ goal: e.target.value })}
                  placeholder="e.g., kill the weeds, sharper edges, looks great by Memorial Day"
                  className="mt-1 min-h-[64px]"
                />
              </div>

              {state.plan === "executive" && (
                <button
                  type="button"
                  data-testid="button-executive-plus"
                  onClick={() => update({ executivePlus: !state.executivePlus })}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    state.executivePlus
                      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Add Executive+</span>
                    <span className="text-sm font-bold text-primary">+${EXECUTIVE_PLUS.price}/mo</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Quarterly strategy session, rapid-response priority, expanded coverage.
                  </div>
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <Label htmlFor="builder-name" className="text-sm">Your name</Label>
                  <Input
                    id="builder-name"
                    data-testid="input-name"
                    value={state.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="First & last"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="builder-phone" className="text-sm">Phone</Label>
                  <Input
                    id="builder-phone"
                    data-testid="input-phone"
                    value={state.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    placeholder="(256) 555-0123"
                    type="tel"
                    className="mt-1"
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
                  />
                </div>
              </div>

              <div>
                <div className="text-sm mb-1">Preferred contact</div>
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
                      {m === "text" ? "Text" : m === "phone" ? "Call" : "Either"}
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
