import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/SiteHeader";
import { Link } from "wouter";
import { Phone, MessageSquare, Mail, CheckCircle2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getTelHref,
  getSmsHref,
  LAWN_TROOPER_AI,
  CALLBACK_MAILTO,
  LT_PHONE_DISPLAY,
  CALL_FIRST_REQUIRED_LINES,
  CALL_FIRST_LANDING_COPY,
  CALL_FIRST_BUILDER_COPY,
  CALL_FIRST_ALTERNATE_START,
  CALL_FIRST_CURB_SECTION,
  CALL_FIRST_RESET_SECTION,
  getCallFirstHeroCopy,
  CALL_FUNNEL_COPY,
  CALL_NAV_PRIMARY_SHORT,
  CALL_NAV_BUILDER_SHORT,
} from "@/data/callFirst";
import { trackEvent } from "@/lib/analytics";

function trackStart(action: string, extra?: Record<string, string>) {
  trackEvent("call_first_lp", { page: "/start", action, ...extra });
  if (action.includes("tel")) trackEvent("call_first_tel", { page: "/start", source: action, ...extra });
  if (action === "sms" || action === "sticky_sms") trackEvent("call_first_sms", { page: "/start", source: action, ...extra });
  if (action === "callback") trackEvent("call_first_callback", { page: "/start" });
  if (action === "builder" || action === "sticky_builder")
    trackEvent("call_first_builder", { page: "/start", source: action, ...extra });
}

function CtaBand({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center ${className}`}>
      <a href={getTelHref()} className="w-full sm:w-auto" onClick={() => trackStart("tel")}>
        <Button
          size="lg"
          className="w-full gap-2 bg-primary text-base font-bold uppercase tracking-wide text-primary-foreground sm:min-w-[260px]"
        >
          <Phone className="h-5 w-5 shrink-0" />
          {getCallFirstHeroCopy().primaryCta}
        </Button>
      </a>
      <div className="flex w-full flex-col gap-2 sm:flex-1 sm:max-w-md sm:flex-row">
        <a href={getSmsHref()} className="flex-1" onClick={() => trackStart("sms")}>
          <Button variant="outline" size="lg" className="w-full gap-2 font-semibold">
            <MessageSquare className="h-4 w-4 shrink-0" />
            {CALL_FUNNEL_COPY.secondaryText}
          </Button>
        </a>
        <a href={CALLBACK_MAILTO} className="flex-1" onClick={() => trackStart("callback")}>
          <Button variant="outline" size="lg" className="w-full gap-2 font-semibold">
            <Mail className="h-4 w-4 shrink-0" />
            {CALL_FUNNEL_COPY.callbackCta}
          </Button>
        </a>
      </div>
    </div>
  );
}

function BuilderCard() {
  const b = CALL_FIRST_BUILDER_COPY;
  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6 text-center">
      <h3 className="font-heading text-lg font-bold text-primary">{b.title}</h3>
      <p className="mt-2 text-sm font-medium text-foreground">{b.body}</p>
      <p className="mt-2 text-xs text-muted-foreground">{b.secondaryLine}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link href="/#builder">
          <Button
            variant="secondary"
            className="w-full font-semibold sm:w-auto"
            onClick={() => trackStart("builder", { target: "homepage-builder" })}
          >
            {b.primaryButton}
          </Button>
        </Link>
        <a href="/#builder">
          <Button
            variant="outline"
            className="w-full font-semibold sm:w-auto"
            onClick={() => trackStart("builder", { target: "home-builder" })}
          >
            {b.secondaryButton}
          </Button>
        </a>
      </div>
    </div>
  );
}

function RepeatedCtaSection() {
  const { title, subtitle } = CALL_FIRST_LANDING_COPY.repeatedCta;
  return (
    <section className="rounded-2xl border border-border bg-muted/40 px-4 py-8 text-center md:px-8">
      <h2 className="font-heading text-xl font-bold text-primary md:text-2xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6">
        <a
          href={getTelHref()}
          className="inline-block w-full max-w-sm"
          onClick={() => trackStart("repeated_tel")}
        >
          <Button size="lg" className="w-full gap-2 bg-primary font-bold uppercase tracking-wide">
            <Phone className="h-5 w-5" />
            {getCallFirstHeroCopy().primaryCta}
          </Button>
        </a>
        <p className="mt-3 font-mono text-lg font-bold tabular-nums text-primary">{LT_PHONE_DISPLAY}</p>
      </div>
    </section>
  );
}

export default function CallFirstPage() {
  useEffect(() => { document.title = "Get Started — Call Lawn Trooper | Lawn Trooper"; }, []);
  const hero = getCallFirstHeroCopy();
  const { whenYouCall, howItWorks, corePlans, trust, faq, objections, hoa, specialRequests } =
    CALL_FIRST_LANDING_COPY;

  return (
    <div className="min-h-screen bg-background pb-28 text-foreground md:pb-12">
      <SiteHeader />

      <main className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* Hero — call-first hierarchy */}
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">{LAWN_TROOPER_AI.tagline}</p>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-primary md:text-4xl">
            {hero.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-snug text-foreground">{hero.subhead}</p>

          <a
            href={getTelHref()}
            className="mt-6 block px-1 sm:mt-8"
            onClick={() => trackStart("hero_tel_giant")}
            aria-label={`Call ${LT_PHONE_DISPLAY}`}
          >
            <span className="font-mono text-[clamp(2.85rem,12vw,5.75rem)] font-black leading-none tracking-tight text-primary sm:tracking-tighter">
              {LT_PHONE_DISPLAY}
            </span>
          </a>
          <p className="mt-3 text-sm font-medium text-muted-foreground">{CALL_FIRST_REQUIRED_LINES.giantNumberLabel}</p>

          <div className="mt-8">
            <CtaBand />
          </div>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {CALL_FIRST_REQUIRED_LINES.heroMicrocopy}
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-snug text-foreground">
            {CALL_FIRST_REQUIRED_LINES.aiInvestment}
          </p>
        </header>

        <div className="mt-10">
          <BuilderCard />
        </div>

        <div className="mt-10">
          <RepeatedCtaSection />
        </div>

        {/* What happens when you call */}
        <section className="mt-12 border-t border-border pt-10" aria-labelledby="when-call-heading">
          <h2 id="when-call-heading" className="font-heading text-xl font-bold text-primary md:text-2xl">
            {whenYouCall.title}
          </h2>
          {whenYouCall.subtitle ? (
            <p className="mt-2 text-sm font-medium text-foreground">{whenYouCall.subtitle}</p>
          ) : null}
          <ul className="mt-6 space-y-5">
            {whenYouCall.steps.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <CtaBand />
        </div>

        {/* How it works */}
        <section className="mt-12 border-t border-border pt-10" aria-labelledby="how-heading">
          <h2 id="how-heading" className="font-heading text-xl font-bold text-primary md:text-2xl">
            {howItWorks.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{howItWorks.subtitle}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {howItWorks.steps.map((step) => (
              <div key={step.title} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h3 className="font-heading text-sm font-bold text-primary">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core plans */}
        <section className="mt-12 border-t border-border pt-10" aria-labelledby="plans-heading">
          <h2 id="plans-heading" className="font-heading text-xl font-bold text-primary md:text-2xl">
            {corePlans.title}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">{corePlans.subtitle}</p>
          <div className="mt-6 space-y-4">
            {corePlans.plans.map((plan) => (
              <div key={plan.name} className="rounded-xl border border-border bg-card p-4">
                <h3 className="font-heading text-lg font-bold text-primary">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.blurb}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">{corePlans.footnote}</p>
          <div className="mt-6">
            <BuilderCard />
          </div>
        </section>

        <div className="mt-10">
          <RepeatedCtaSection />
        </div>

        {/* Not ready — Curb + Reset */}
        <section className="mt-12 border-t border-border pt-10" aria-labelledby="alternate-start-heading">
          <h2 id="alternate-start-heading" className="font-heading text-xl font-bold text-primary md:text-2xl">
            {CALL_FIRST_ALTERNATE_START.sectionTitle}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{CALL_FIRST_ALTERNATE_START.sectionSubtitle}</p>

          <article className="mt-8 rounded-xl border border-primary/15 bg-primary/[0.02] p-4 md:p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-primary/80">
              {CALL_FIRST_CURB_SECTION.cardLabel}
            </p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-foreground">{CALL_FIRST_CURB_SECTION.body}</p>
          </article>

          <article className="mt-6 rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {CALL_FIRST_RESET_SECTION.cardLabel}
            </p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-foreground">{CALL_FIRST_RESET_SECTION.body}</p>
          </article>
        </section>

        {/* Trust */}
        <section className="mt-12 border-t border-border pt-10" aria-labelledby="trust-heading">
          <h2 id="trust-heading" className="font-heading text-xl font-bold text-primary md:text-2xl">
            {trust.title}
          </h2>
          <p className="mt-3 text-sm font-medium text-foreground">{trust.lead}</p>
          <ul className="mt-6 space-y-3">
            {trust.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-12 border-t border-border pt-10" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-heading text-xl font-bold text-primary md:text-2xl">
            FAQ
          </h2>
          <Accordion type="single" collapsible className="mt-4 w-full">
            {faq.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-semibold">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Objections */}
        <section className="mt-12 border-t border-border pt-10" aria-labelledby="obj-heading">
          <h2 id="obj-heading" className="font-heading text-xl font-bold text-primary md:text-2xl">
            Quick answers
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {objections.map((o) => (
              <div key={o.title} className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="text-sm font-bold text-foreground">{o.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{o.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOA + Special requests */}
        <section className="mt-12 grid gap-4 border-t border-border pt-10 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-primary">{hoa.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{hoa.body}</p>
            <Link href={hoa.href}>
              <Button
                variant="outline"
                className="mt-4 w-full border-primary font-semibold text-primary sm:w-auto"
                onClick={() => trackStart("hoa_link")}
              >
                {hoa.cta}
              </Button>
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-primary">{specialRequests.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{specialRequests.body}</p>
            <a href={getTelHref()} onClick={() => trackStart("special_tel")}>
              <Button className="mt-4 w-full gap-2 font-semibold sm:w-auto" size="sm">
                <Phone className="h-4 w-4" />
                {specialRequests.cta}
              </Button>
            </a>
          </div>
        </section>

        <div className="mt-10">
          <BuilderCard />
        </div>

        <div className="mt-10">
          <RepeatedCtaSection />
        </div>

        <p className="mt-10 text-center">
          <Link
            href={CALL_FIRST_LANDING_COPY.footerLink.home}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            onClick={() => trackStart("full_site")}
          >
            {CALL_FIRST_LANDING_COPY.footerLink.fullSite}
          </Link>
        </p>
      </main>

      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/90 md:hidden"
        role="region"
        aria-label="Quick actions"
      >
        <div className="mx-auto flex max-w-lg gap-2">
          <a href={getTelHref()} className="min-w-0 flex-1" onClick={() => trackStart("sticky_tel")}>
            <Button size="lg" className="w-full gap-1.5 truncate bg-primary font-bold">
              <Phone className="h-4 w-4 shrink-0" />
              <span className="truncate">{CALL_NAV_PRIMARY_SHORT}</span>
            </Button>
          </a>
          <a href={getSmsHref()} className="w-[52px] shrink-0 sm:w-auto" onClick={() => trackStart("sticky_sms")}>
            <Button size="lg" variant="outline" className="h-full w-full px-3" aria-label="Text Lawn Trooper">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </a>
          <Link href="/#builder" className="w-[52px] shrink-0">
            <Button
              size="lg"
              variant="secondary"
              className="h-full w-full px-2 text-[10px] font-bold leading-tight"
              onClick={() => trackStart("sticky_builder")}
            >
              {CALL_NAV_BUILDER_SHORT}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
