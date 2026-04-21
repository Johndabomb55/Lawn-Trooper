import React, { useEffect, useState } from "react";
import MultiStepQuoteWizard from "@/components/MultiStepQuoteWizard";
import CTAButton from "@/components/CTAButton";
import { motion, useReducedMotion } from "framer-motion";
import { 
  Check, 
  Shield, 
  Clock, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  MapPin,
  Calendar,
  Zap,
  Leaf,
  Info,
  Facebook,
  Instagram,
  Mail,
  MessageSquare,
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  GLOBAL_CONSTANTS,
} from "@/data/plans";
import { ANNIVERSARY_DEADLINE_LINE } from "@/data/promotions";
import { WHY_DIFFERENT } from "@/data/content";
import PromoBanner from "@/components/PromoBanner";
import HomepageUpgradesGallery from "@/components/HomepageUpgradesGallery";
import { Link } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import {
  getTelHref,
  getSmsHref,
  LAWN_TROOPER_AI,
  CALL_FUNNEL_COPY,
  OFFER_LANES,
  OFFER_LANES_SECTION_INTRO,
  CALLBACK_MAILTO,
  LT_PHONE_DISPLAY,
  QUOTE_SECTION_CALLOUT_PARTS,
  CALL_FIRST_BUILDER_COPY,
} from "@/data/callFirst";

// Assets
import heroBg from "@assets/generated_images/manicured_lawn_with_mower_stripes.png";
import companyLogo from "@assets/lawn-trooper-logo-badge-2026-transparent.png";
import camoPattern from "@assets/generated_images/subtle_camo_texture_background.png";
import heroFlag from "@assets/generated_images/wavy_american_flag.png";
import mascotHolidayLights from "@assets/Holiday_lights_on_a_festive_home_1771794249376.png";

// Stock Assets
import heroLuxury from "@assets/generated_images/southern_home_with_wrap-around_porch_and_fall_flowers.png";
import imgEstateMadison from "@assets/generated_images/madison_al_home_dark_red_brick.png";

import imgProblemYard from "@assets/alabama-problem-yard-overgrown.jpg";
import imgXmas from "@assets/stock_images/professional_christm_4b6754bb.jpg";
import imgWash from "@assets/stock_images/pressure_washing_con_d670d4c2.jpg";
import imgXmasPremium from "@assets/stock_images/christmas_lights_dec_50e6447b.jpg";
import imgMulchInstall from "@assets/mulch-brown-refresh-alabama.jpg";
import imgYardAfter from "@assets/generated_images/manicured_lawn_with_summer_flowers.png";
import imgSeasonalFlowers from "@assets/stock_images/colorful_seasonal_fl_f56cde03.jpg";
import imgAlabamaYardBasic from "@assets/generated_images/athens_al_middle_class_home_landscaping.png";
import imgAlabamaYardPremium from "@assets/stock_images/flower_bed_landscapi_f38aa87f.jpg";
import imgAlabamaYardExecutive from "@assets/stock_images/beautiful_green_lawn_e7c60690.jpg";
import imgHuntsvilleHome from "@assets/generated_images/huntsville_al_home_landscaping.png";
import bgLandscape from "@assets/generated_images/beautiful_landscaped_yard_background.png";


import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trackEvent } from "../lib/analytics";
import { getExperimentVariant, trackExperimentExposure } from "../lib/experiments";

export default function LandingPage() {
  useEffect(() => { document.title = "Lawn Trooper | Mission-Ready Yard Care"; }, []);
  const [showHeroCelebration, setShowHeroCelebration] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleQuoteCtaClick = (source: string) => {
    trackEvent("hero_cta_click", { source });
    scrollToSection("quote");
  };

  const trackCallFunnel = (action: string, extra?: Record<string, string>) => {
    trackEvent("call_funnel", { action, ...extra });
  };


  const mascotLogo = companyLogo;

  useEffect(() => {
    const w = window as any;
    if (w.FB) {
      w.FB.XFBML.parse();
    } else {
      const checkFB = setInterval(() => {
        if (w.FB) {
          w.FB.XFBML.parse();
          clearInterval(checkFB);
        }
      }, 1000);
      return () => clearInterval(checkFB);
    }
  }, []);

  useEffect(() => {
    const variant = getExperimentVariant("hero_simplification", "variant");
    trackExperimentExposure("hero_simplification", variant);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) {
      setShowHeroCelebration(false);
      return;
    }
    const timer = window.setTimeout(() => setShowHeroCelebration(false), 6500);
    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion]);

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <SiteHeader />
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col pt-32 pb-20 overflow-hidden bg-primary/5">

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
           <img src={bgLandscape} alt="Lawn Trooper Team" className="w-full h-full object-cover brightness-[0.82]" />
           {/* Removed fade to background so image stays visible */}
           <div className="absolute inset-0 bg-black/34"></div>
           <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url(${camoPattern})`, backgroundSize: '400px' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center items-center text-center mt-12">
          {/* Logo Centerpiece */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6 relative w-full max-w-4xl"
          >
            {showHeroCelebration && (() => {
              const speechTagline = "Celebrating 25 years serving the Tennessee Valley.";
              const bannerTagline = "25-Year Anniversary Client Rewards - Proudly serving the Tennessee Valley for 25+ years.";
              return (
                <>
                  {!shouldReduceMotion && (
                    <>
                      <motion.div
                        className="pointer-events-none absolute left-1/2 top-5 h-8 w-[72%] -translate-x-1/2 rounded-full bg-emerald-300/65 blur-[2px]"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: ["0%", "72%", "72%", "0%"], opacity: [0, 0.85, 0.7, 0] }}
                        transition={{ duration: 5.2, times: [0, 0.2, 0.78, 1], ease: "easeInOut" }}
                      />
                      {Array.from({ length: 16 }).map((_, idx) => (
                        <motion.span
                          key={`hero-logo-particle-${idx}`}
                          className="pointer-events-none absolute top-8 h-1.5 w-1.5 rounded-full bg-emerald-200"
                          style={{ left: `${18 + idx * 4}%` }}
                          initial={{ y: 0, opacity: 0 }}
                          animate={{ y: [0, -10, 12], opacity: [0, 0.9, 0] }}
                          transition={{ duration: 0.9, delay: 0.8 + idx * 0.05, ease: "easeOut" }}
                        />
                      ))}
                    </>
                  )}
                  <motion.div
                    className="pointer-events-none absolute right-4 top-1 z-20 max-w-[240px] md:max-w-[320px] rounded-2xl border border-amber-200 bg-white/90 px-3 py-2 text-[10px] md:text-xs font-black tracking-wide text-primary shadow-lg"
                    initial={{ opacity: 0, y: 8, scale: 0.92 }}
                    animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -2], scale: [0.92, 1, 1, 0.99] }}
                    transition={{ duration: 6.0, times: [0, 0.15, 0.84, 1], ease: "easeInOut" }}
                  >
                    {speechTagline}
                  </motion.div>
                  <motion.div
                    className="pointer-events-none absolute inset-x-4 bottom-2 z-20 rounded-xl border border-amber-200/70 bg-gradient-to-r from-amber-50/95 via-yellow-100/95 to-amber-50/95 px-3 py-2 text-center text-[11px] md:text-sm font-extrabold tracking-wide text-primary shadow-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 0.95, 0.95, 0], y: [10, 0, 0, -2] }}
                    transition={{ duration: 6.3, times: [0, 0.12, 0.86, 1], ease: "easeInOut" }}
                  >
                    {bannerTagline}
                  </motion.div>
                </>
              );
            })()}
            <motion.img
              src={mascotLogo}
              alt="Lawn Trooper Premium Exterior Care logo"
              className="w-full object-contain relative z-10 drop-shadow-2xl max-h-[520px] mb-6"
              initial={shouldReduceMotion ? { opacity: 1, scale: 1, y: 0, rotate: 0 } : { opacity: 0, scale: 0.58, y: 30, rotate: -4 }}
              animate={shouldReduceMotion
                ? { opacity: 1, scale: 1.06, y: 0, rotate: 0 }
                : { opacity: [0, 1, 1], scale: [0.58, 1.22, 1.14], y: [30, -16, 0], rotate: [-4, 2, 0] }}
              transition={shouldReduceMotion
                ? { duration: 0.5 }
                : { duration: 2.4, times: [0, 0.64, 1], ease: "easeOut" }}
            />
            
            {/* Plain-language value proposition */}
            <div className="mt-4 relative z-20 w-full">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/90 drop-shadow-md">
                {LAWN_TROOPER_AI.tagline}
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-4 leading-none text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]">
                Lawn Trooper
              </h1>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {CALL_FUNNEL_COPY.heroHeadline}
              </h2>
              <p className="text-base md:text-xl font-semibold text-white/95 mt-2 mb-2 max-w-2xl mx-auto">
                {CALL_FUNNEL_COPY.heroSubhead}
              </p>
              <p className="text-sm md:text-base text-white/85 max-w-2xl mx-auto">
                {LAWN_TROOPER_AI.subline}
              </p>
            </div>
            
            <div className="mt-6 flex w-full max-w-lg flex-col items-stretch gap-3 mx-auto">
              <a
                href={getTelHref()}
                onClick={() => trackCallFunnel("hero_tel")}
                className="w-full"
              >
                <Button
                  type="button"
                  className="w-full gap-2 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider py-6 text-base md:text-lg"
                >
                  <Phone className="h-5 w-5 shrink-0" />
                  {CALL_FUNNEL_COPY.primaryCta}
                </Button>
              </a>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <a href={getSmsHref()} onClick={() => trackCallFunnel("hero_sms")} className="w-full">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full gap-2 border border-white/30 bg-white/15 text-white hover:bg-white/25 font-semibold"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    {CALL_FUNNEL_COPY.secondaryText}
                  </Button>
                </a>
                <a href={CALLBACK_MAILTO} onClick={() => trackCallFunnel("hero_callback")} className="w-full">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full gap-2 border border-white/30 bg-white/15 text-white hover:bg-white/25 font-semibold"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    {CALL_FUNNEL_COPY.callbackCta}
                  </Button>
                </a>
              </div>
              <p className="text-center text-sm font-semibold text-white/90">{LT_PHONE_DISPLAY}</p>
              <div className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-center backdrop-blur-sm">
                <p className="text-xs text-white/85">{CALL_FUNNEL_COPY.builderSecondary}</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Link href="/#builder" onClick={() => trackCallFunnel("hero_builder", { target: "quote-wizard" })}>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-white/50 bg-transparent text-white hover:bg-white/10 font-bold uppercase tracking-wide sm:w-auto"
                    >
                      {CALL_FUNNEL_COPY.builderCta}
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-white/90 hover:bg-white/10 hover:text-white sm:w-auto"
                    onClick={() => handleQuoteCtaClick("hero_scroll_builder")}
                  >
                    {CALL_FIRST_BUILDER_COPY.secondaryButton}
                  </Button>
                </div>
              </div>
              <p className="text-xs md:text-sm text-white/75 text-center">
                Walkthroughs are no-pressure. We confirm scope, membership fit, and scheduling — not a hard sell.
              </p>
              <p className="text-[11px] md:text-xs text-white/65 text-center">
                {ANNIVERSARY_DEADLINE_LINE}
              </p>
            </div>
          </motion.div>

          
          {/* How It Works */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            id="how-it-works" className="w-full max-w-6xl mx-auto mb-12 scroll-mt-24 relative"
          >
            <div className="text-center mb-8">
               <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2 drop-shadow-md">How It Works</h3>
               <p className="text-white/80 max-w-2xl mx-auto text-sm">Call or text first, confirm scope, then we keep it consistent.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: Phone, 
                  title: "1. Call or text first", 
                  desc: "Reach Lawn Trooper AI anytime, or text for a fast human follow-up during business hours." 
                },
                { 
                  icon: MapPin, 
                  title: "2. Confirm fit & scope", 
                  desc: "We align on membership level, property scope, and cadence — or you explore the visual plan builder at your pace." 
                },
                { 
                  icon: Leaf, 
                  title: "3. Schedule & maintain", 
                  desc: "Walkthrough if needed, then recurring care with photo updates and a dedicated account manager on qualifying plans." 
                }
              ].map((step, i) => (
                <div 
                  key={i}
                  className="relative p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-black/60 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mb-4 text-accent">
                    <step.icon size={20} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-white mb-2">{step.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
    
        </div>
      </section>

      {/* Subtle trust strip directly under hero */}
      <section className="bg-primary/5 border-y border-primary/10 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 text-sm font-semibold text-primary">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Licensed &amp; Insured</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> 25+ Years Serving the Tennessee Valley</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Military-Level Reliability</span>
          </div>
        </div>
      </section>

      {/* Offer lanes — scope-defined options; pricing after review */}
      <section className="border-b border-border bg-background py-12 md:py-16" aria-labelledby="offer-lanes-heading">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <h2 id="offer-lanes-heading" className="font-heading text-2xl font-bold text-primary md:text-3xl">
              Not Ready for a Full Plan Yet?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{OFFER_LANES_SECTION_INTRO}</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-primary">{OFFER_LANES.curbAppeal.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{OFFER_LANES.curbAppeal.body}</p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-primary">{OFFER_LANES.yardReset.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{OFFER_LANES.yardReset.body}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Quote Wizard Section — visual builder path */}
      <section id="quote" className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="mb-6 w-full max-w-3xl mx-auto">
            <PromoBanner variant="inline" compact storageKey="lt_anniversary_builder_compact_dismissed" ctaHref="#quote" />
          </div>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {QUOTE_SECTION_CALLOUT_PARTS.before}
            <a
              className="font-semibold text-primary underline-offset-4 hover:underline"
              href={getTelHref()}
              onClick={() => trackCallFunnel("quote_section_tel")}
            >
              {LT_PHONE_DISPLAY}
            </a>
            {QUOTE_SECTION_CALLOUT_PARTS.after}
          </p>
          <div className="mb-6 grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="font-semibold text-primary">Serving local neighborhoods</p>
              <p className="text-muted-foreground text-xs mt-1">Athens, Huntsville, Madison, Harvest, and nearby Tennessee Valley communities.</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="font-semibold text-primary">Proven experience</p>
              <p className="text-muted-foreground text-xs mt-1">25+ years serving homeowners and 100+ beautification awards.</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="font-semibold text-primary">Fast follow-up</p>
              <p className="text-muted-foreground text-xs mt-1">No payment today. Account manager outreach within 1 business day.</p>
            </div>
          </div>
          <MultiStepQuoteWizard />
        </div>
      </section>

      {/* Pricing Plans */}
      
      <section id="plans" className="py-24 bg-primary/5 relative">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url(${camoPattern})`, backgroundSize: '400px' }}></div>
        <div className="absolute inset-0 z-0 opacity-[0.14]" style={{ backgroundImage: `url(${bgLandscape})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Trust Line */}
          <div className="text-center mb-6">
            <p className="text-lg font-semibold text-[#0f2f1a]">Trusted by North Alabama homeowners for 25+ years</p>
            <p className="text-sm text-[#1a3d24]">Licensed &bull; Insured &bull; Satisfaction Guaranteed</p>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0f2f1a] mb-4">
              Choose Your <span className="text-amber-500">Total Maintenance</span> Plan
            </h2>
            <p className="text-[#1a3d24] text-lg font-bold max-w-2xl mx-auto tracking-wide">
              Annual membership, billed monthly. Clear tiers — fit confirmed on a quick walkthrough or right here.
            </p>
          </div>

          {/* One-stop-shop messaging */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-base text-[#1a3d24] leading-relaxed">
              We're not just a mower on a trailer. <span className="font-bold text-[#0f2f1a]">Lawn Trooper is a complete property maintenance service.</span> No matter which plan you choose, we help keep your yard looking sharp so you don't have to worry about it.
            </p>
          </div>
          
          {/* Plan Cards with pricing info */}
          <div className="mb-16">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative group overflow-hidden rounded-xl shadow-lg border-2 border-white/20">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={imgAlabamaYardBasic} alt="Athens, AL - Standard Patrol - Middle class Alabama home with nice landscaping" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="bg-white p-4 text-center">
                  <h3 className="font-heading font-bold text-lg text-primary">Standard Patrol</h3>
                  <p className="text-sm text-muted-foreground">Starting at $169/mo</p>
                  <p className="text-xs font-semibold text-primary/80 mt-1">Includes 3 upgrade credits</p>
                  <div className="mt-2 inline-block bg-amber-50 border border-amber-300 rounded-full px-3 py-1">
                    <span className="text-xs font-bold text-amber-800">25-Year Anniversary Client Rewards</span>
                  </div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl shadow-lg border-2 border-amber-400/40">
                <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={imgAlabamaYardPremium} alt="Huntsville, AL - Premium Patrol - Southern home front yard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="bg-white p-4 text-center">
                  <h3 className="font-heading font-bold text-lg text-primary">Premium Patrol</h3>
                  <p className="text-sm text-muted-foreground">Starting at $299/mo</p>
                  <p className="text-xs font-semibold text-amber-600 mt-1">Includes 5 upgrade credits</p>
                  <div className="mt-2 inline-block bg-amber-50 border border-amber-300 rounded-full px-3 py-1">
                    <span className="text-xs font-bold text-amber-800">25-Year Anniversary Client Rewards</span>
                  </div>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl shadow-lg border-2 border-accent/30">
                <div className="absolute top-2 right-2 z-10 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">Best Value</div>
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={imgAlabamaYardExecutive} alt="Madison, AL - Executive Command - Beautiful Alabama home with landscaping" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="bg-white p-4 text-center">
                  <h3 className="font-heading font-bold text-lg text-primary">Executive Command</h3>
                  <p className="text-sm text-muted-foreground">Starting at $399/mo</p>
                  <p className="text-xs font-semibold text-accent mt-1">Includes 9 upgrade credits</p>
                  <div className="mt-2 inline-block bg-amber-50 border border-amber-300 rounded-full px-3 py-1">
                    <span className="text-xs font-bold text-amber-800">25-Year Anniversary Client Rewards</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 mx-auto max-w-2xl rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
              <p className="text-sm font-bold text-primary">Flexible Upgrade System</p>
              <p className="text-xs text-muted-foreground">Choose the services your yard needs most.</p>
              <p className="text-xs font-medium text-primary/90 mt-1">Credit rule: Standard upgrades (1 credit) • Premium upgrades (2 credits).</p>
            </div>
            <div className="text-center mt-6">
              <Button onClick={() => scrollToSection('quote')} variant="outline" className="border-primary text-primary font-bold uppercase tracking-wider">
                Continue to Plan Builder
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Review options first, then reserve the plan that fits your yard.</p>
              <Button onClick={() => scrollToSection('quote')} className="mt-3 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider">
                Reserve My Plan
              </Button>
            </div>
          </div>

          <HomepageUpgradesGallery />

          {/* Limited Spots Message */}
          <div className="mt-8 text-center" data-testid="limited-spots-message">
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 max-w-3xl mx-auto">
              <p className="text-sm text-amber-800 font-medium">
                We only onboard a limited number of new properties each month to protect service quality. When this month's route is full, new customers are placed on our priority waitlist.
              </p>
            </div>
          </div>

          {/* Service Method Disclaimer */}
          <div className="mt-8 text-center">
            <div className="bg-white/80 border border-border rounded-lg p-4 max-w-3xl mx-auto">
              <h4 className="font-bold text-sm text-primary mb-2">Service Method Disclaimer</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Lawn Trooper utilizes a combination of advanced lawn care technologies and professional equipment to deliver consistent, high-quality results. You are paying for results. Lawn Trooper assesses the property, selects the appropriate service method, and executes the mission to maintain your yard at the highest standard.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground bg-white/50 inline-block px-4 py-2 rounded-lg border border-border">
              <strong>Note:</strong> {GLOBAL_CONSTANTS.YARD_ELIGIBILITY}
            </p>
          </div>
        </div>
      </section>

      {/* Problem Yard + Local Results */}
      <section className="py-16 md:py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-10">
            <p className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-800">
              Local Results Across North Alabama
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-primary">What Lawn Trooper Delivers</h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              We fix the common warning signs fast and maintain a clean, premium finish all season.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="overflow-hidden rounded-2xl border border-rose-200/70 bg-card shadow-sm">
              <div className="relative">
                <img
                  src={imgProblemYard}
                  alt="North Alabama yard showing overgrowth, weak flower beds, and uneven landscaping"
                  className="h-56 w-full object-cover md:h-72"
                  loading="lazy"
                 />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute left-3 top-3 rounded-full bg-rose-800/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Problem Yard Signs
                </span>
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-rose-100 border border-rose-300/30">
                    Overgrowth
                  </span>
                  <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-rose-100 border border-rose-300/30">
                    Weed Pressure
                  </span>
                  <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-rose-100 border border-rose-300/30">
                    Faded Beds
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-primary">Common issues we correct</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>- Overgrown shrubs and weak bed definition</li>
                  <li>- Weed pressure around flower beds and edges</li>
                  <li>- Faded mulch and uneven curb appeal</li>
                </ul>
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-emerald-300/60 bg-card shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-primary">Local Results Gallery</p>
                <p className="text-xs text-muted-foreground mt-1">Dark green turf, fresh mulch, and healthier flower beds with routine precision care.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 overflow-hidden">
                <img
                  src={imgYardAfter}
                  alt="Alabama lawn with dark green stripes after maintenance"
                  className="h-28 w-full rounded-lg object-cover sm:h-40 hover:scale-110 transition-transform duration-300 cursor-zoom-in"
                  loading="lazy"
                />
                <img
                  src={imgMulchInstall}
                  alt="Fresh brown mulch in clean flower beds"
                  className="h-28 w-full rounded-lg object-cover sm:h-40 hover:scale-110 transition-transform duration-300 cursor-zoom-in"
                  loading="lazy"
                />
                <img
                  src={imgSeasonalFlowers}
                  alt="Seasonal flowers in a tidy residential landscape bed"
                  className="h-28 w-full rounded-lg object-cover sm:h-40 hover:scale-110 transition-transform duration-300 cursor-zoom-in"
                  loading="lazy"
                />
              </div>
            </article>
          </div>

          <p className="mt-5 text-center text-sm font-medium text-primary/90">
            Trusted by North Alabama homeowners for 25+ years of disciplined, consistent landscape care.
          </p>
        </div>
      </section>

      {/* Testimonials - Field Reports */}
      <section className="py-20 bg-background relative border-t border-border">
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `url(${heroLuxury})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="container mx-auto px-4 relative z-10">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Customer Reviews</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">What homeowners across the Tennessee Valley say about their results.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Report 1 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-card rounded-xl overflow-hidden shadow-lg border border-border flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                 <img src={imgAlabamaYardBasic} alt="Athens, AL lawn care result" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                 <div className="absolute bottom-0 left-0 bg-primary/90 text-white text-xs px-3 py-1 font-bold uppercase tracking-widest">
                   Sector: Athens, AL
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                 <div className="flex gap-1 text-accent mb-3">
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                 </div>
                 <p className="text-muted-foreground italic mb-4 flex-1">"The tactical approach is no joke. My yard has never looked this sharp. The pricing is transparent and the crew is incredibly disciplined."</p>
                 <div>
                   <div className="font-bold font-heading text-primary">James R.</div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider">Executive Plan Member</div>
                 </div>
              </div>
            </motion.div>

            {/* Report 2 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="bg-card rounded-xl overflow-hidden shadow-lg border border-border flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                 <img src={imgEstateMadison} alt="Madison Home" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                 <div className="absolute bottom-0 left-0 bg-primary/90 text-white text-xs px-3 py-1 font-bold uppercase tracking-widest">
                   Sector: Madison, AL
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                 <div className="flex gap-1 text-accent mb-3">
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                 </div>
                 <p className="text-muted-foreground italic mb-4 flex-1">"I signed a 2 year pact, paid in full, and saved well over $2,000. Lawn Trooper really does deliver and the jobber app makes customer requests and bill pay easy as pie."</p>
                 <div>
                   <div className="font-bold font-heading text-primary">Sarah & Mike T.</div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider">Premium Patrol Members</div>
                 </div>
              </div>
            </motion.div>

            {/* Report 3 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="bg-card rounded-xl overflow-hidden shadow-lg border border-border flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                 <img src={imgHuntsvilleHome} alt="Huntsville, AL - Alabama style home with landscaping" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                 <div className="absolute bottom-0 left-0 bg-primary/90 text-white text-xs px-3 py-1 font-bold uppercase tracking-widest">
                   Sector: Huntsville, AL
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                 <div className="flex gap-1 text-accent mb-3">
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                   <Star className="w-4 h-4 fill-accent" />
                 </div>
                 <p className="text-muted-foreground italic mb-4 flex-1">"I love the Anniversary pricing. Getting signed up early for 2026 saved us a ton. The yard looks amazing even in winter."</p>
                 <div>
                   <div className="font-bold font-heading text-primary">The Davidson Family</div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider">Standard Patrol Members</div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Launch FAQ near footer for stronger conversion support */}
      <section id="faq" aria-labelledby="faq-heading" className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 id="faq-heading" className="text-3xl font-heading font-bold text-center text-primary mb-10">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Most-asked questions first. Scroll for the full list.
          </p>
          {/* Prioritized February FAQ list in a scrollable accordion container. */}
          <div className="max-h-[560px] overflow-y-auto pr-1">
            <Accordion type="single" collapsible className="w-full" aria-label="Frequently asked questions">
              {[
                {
                  q: "What does the Standard Patrol plan include?",
                  a: "Standard Patrol includes bi-weekly mowing during the growing season, monthly off-season property checks, 3 Standard-only upgrade credits, and a Dream Yard Recon\u2122 landscape plan."
                },
                {
                  q: "What's the difference between Standard, Premium, and Executive?",
                  a: "Standard Patrol includes bi-weekly mowing with monthly off-season checks and 3 upgrade credits. Premium Patrol includes weekly mowing during growing season, bi-weekly off-season service, 5 upgrade credits, two annual Shrub Care Package visits, and No Shrub Left Behind replacement coverage for maintained plants that cannot be saved. Executive Command includes weekly mowing during growing season, bi-weekly off-season service, up to 7 turf applications, 9 upgrade credits, and dedicated account-manager support."
                },
                {
                  q: "What is Executive+ and how does it work?",
                  a: "Executive+ is an optional upgrade for Executive Command members (+$99/mo). It adds +1 Standard and +1 Premium upgrade, plus quarterly strategy sessions, rapid response priority, advanced turf defense support, and executive-level property care enhancements."
                },
                {
                  q: "What is Dream Yard Recon\u2122?",
                  a: "Dream Yard Recon\u2122 is an AI-generated landscape plan personalized to your property and goals. Every plan includes it, along with a personalized review from your Dedicated Account Manager."
                },
                {
                  q: "Can I convert Standard upgrades to Premium upgrades?",
                  a: "Yes. 2 Standard credits = 1 Premium upgrade, and you can mix services however you like based on your total upgrade credits."
                },
                {
                  q: "Do I have to sign a contract?",
                  a: `We offer 1-year and 2-year subscriptions (no month-to-month plan at this time). ${GLOBAL_CONSTANTS.CONSULTATION_REFUND_POLICY}`
                },
                {
                  q: "How does billing work?",
                  a: "Billing runs monthly through Jobber Payments. You receive customer login details by email to manage your account, and any complimentary months are applied as credits at the end of your agreement term."
                },
                {
                  q: "How do complimentary months work?",
                  a: "Choose a longer commitment and receive complimentary service months. 1-Year: 1 complimentary month. 2-Year: 3 complimentary months. Pay in full and we'll double your complimentary months. Get up to 6 complimentary months with a 2-year paid-in-full plan."
                },
                {
                  q: "Can existing clients use a client code?",
                  a: "Existing clients may qualify for loyalty pricing with a client code. Final eligibility and adjustments are confirmed by your account manager."
                },
                {
                  q: "When does an account manager contact me?",
                  a: "An account manager typically reaches out within 1 business day using your preferred contact method to confirm property details and next steps."
                },
                {
                  q: "What happens after I submit my quote request?",
                  a: "You will receive confirmation, then your account manager reviews your selections, confirms fit, and helps finalize service details before onboarding."
                },
                {
                  q: "Is the price guaranteed?",
                  a: "Yes. Once your quote is issued for your yard size, your seasonal plan pricing is locked with no surprise surcharges."
                },
                {
                  q: "What areas do you serve?",
                  a: "We serve Huntsville, Madison, Harvest, Athens, Owens Cross Roads, Meridianville, and nearby Tennessee Valley neighborhoods."
                },
                {
                  q: "What if it rains on my service day?",
                  a: "If weather prevents service, we reschedule as soon as conditions allow, typically within one to two days."
                },
                {
                  q: "Can I change my plan after enrollment?",
                  a: "Yes. Plan changes are available and are reviewed with your account manager. Approved changes begin a new subscription term at the updated rate."
                },
                {
                  q: "What if I need to cancel early?",
                  a: "If you cancel early, you are only responsible for services already performed. Any remaining balance is settled at standard per-visit pricing."
                },
                {
                  q: "I am an existing customer. Do loyalty discounts still apply?",
                  a: `${GLOBAL_CONSTANTS.EXISTING_CUSTOMER_LOYALTY} You can also provide your client code in the quote form so your account manager can verify your account.`
                },
                {
                  q: "Do you use robots or AI technology?",
                  a: GLOBAL_CONSTANTS.AI_TECH_EXPLANATION
                }
              ].map((faq, i) => (
                <AccordionItem key={faq.q} value={`launch-faq-${i}`}>
                  <AccordionTrigger className="text-left font-bold text-lg hover:text-accent transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Referral section — contact-only, no bonus promise */}
      <section className="py-14 bg-accent/15 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-3">
            NO ONE LEFT BEHIND — REFERRAL PROGRAM
          </h2>
          <p className="text-muted-foreground mb-7">
            Know a neighbor who could use a great lawn? Refer them and get in touch to learn more.
          </p>
          <Button
            onClick={() => window.location.href = "mailto:John@lawn-trooper.com?subject=Neighbor%20Referral%20Program"}
            className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider"
          >
            Refer a Neighbor
          </Button>
        </div>
      </section>

      {/* HOA Partnership Section */}
      <section id="hoa-partnership" className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">HOA Partnership Program</h2>
            <p className="text-muted-foreground">
              Reliable service plans for communities, shared spaces, and neighborhood entrances across North Alabama.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg border border-border text-center">
            <p className="text-sm md:text-base text-muted-foreground">
              If your community needs a dependable maintenance partner, submit a dedicated HOA consultation request and
              our team will follow up with scheduling details.
            </p>
            <div className="mt-5">
              <Link href="/hoa-partnerships">
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider">
                  Request HOA Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Services Highlight */}
      <section className="py-16 bg-gradient-to-b from-[#0a1628] to-[#1a2744] border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-white/10">
              <img
                src={mascotHolidayLights}
                alt="Lawn Trooper holiday lights installation"
                data-testid="img-mascot-holiday-lights"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="text-white text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Year-Round Curb Appeal</h2>
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                From spring landscaping to holiday light installation, Lawn Trooper keeps your property looking its best every season.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-white/90">Standard & Premium seasonal lighting packages</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-white/90">Holiday Hustle pre-event cleanup</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-white/90">Full seasonal flower installs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Feeds */}
      <section id="social" aria-labelledby="social-heading" className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 id="social-heading" className="text-3xl font-heading font-bold text-center text-primary mb-3">
            Follow the Troops
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            See our work in action. Follow us on Facebook and Instagram for lawn transformations, tips, and exclusive deals.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden" data-testid="facebook-embed">
              <div className="px-4 py-3 bg-primary/5 border-b flex items-center gap-2">
                <Facebook size={20} className="text-blue-600" />
                <span className="font-bold text-sm text-primary">Facebook</span>
              </div>
              <div className="flex justify-center p-4">
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61588087766755&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                  width="500"
                  height="600"
                  style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Lawn Trooper Facebook Page"
                ></iframe>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden" data-testid="instagram-embed">
              <div className="px-4 py-3 bg-primary/5 border-b flex items-center gap-2">
                <Instagram size={20} className="text-pink-600" />
                <span className="font-bold text-sm text-primary">Instagram</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 min-h-[400px] text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center mb-6">
                  <Instagram size={40} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-xl text-primary mb-2">@lawntrooper</h3>
                <p className="text-muted-foreground mb-6 max-w-xs">
                  Follow us on Instagram for before &amp; after photos, lawn care tips, and behind-the-scenes content.
                </p>
                <a
                  href="https://www.instagram.com/lawntrooper"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-instagram-follow"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-bold hover:opacity-90 transition-opacity"
                >
                  <Instagram size={18} />
                  Follow on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting details after core conversion flow */}
      {/* About Us Section */}
      <section className="py-12 bg-background border-y border-border">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            <span className="text-primary font-bold">Lawn Trooper</span> is built on commitment, efficiency, and loyalty.
            We've spent decades putting relationships before scale.
            As we adopt new automation, technology, and processes,
            we're passing those savings back to our customers.
            <span className="font-semibold text-primary">Commit to us, and we commit to you.</span>
          </p>
        </div>
      </section>

      {/* 2026 Savings Banner */}
      <section className="py-8 px-4 bg-amber-100 border-y-4 border-amber-400">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-xl md:text-2xl lg:text-3xl font-extrabold text-amber-900 leading-snug drop-shadow-sm">
            2026 Efficiency Pricing is live: smarter routing and automation help keep monthly rates lower.
          </p>
        </div>
      </section>

      {/* Why We're Different */}
      <section id="why-different" aria-labelledby="why-different-heading" className="py-12 bg-muted/20 border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 id="why-different-heading" className="text-2xl md:text-3xl font-heading font-bold text-center text-primary mb-8">
            {WHY_DIFFERENT.sectionTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {WHY_DIFFERENT.bullets.map((item, i) => (
              <div key={i} className="flex gap-3 p-4 bg-background rounded-lg border border-border" data-testid={`why-different-${i}`}>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="bg-background py-8 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-primary/5 border border-primary/10 rounded-lg px-8 py-4">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-primary mb-1">
              Lawn Trooper — 25+ years serving the Tennessee Valley. 100+ beautification awards.
            </h2>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest mb-2">
              Military-level reliability. Premium results.
            </p>
            <p className="text-xs text-muted-foreground/80 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Lawn Trooper LLC is licensed and insured. We take full responsibility for any liability or damage to property while performing services.
            </p>
          </div>
        </div>
      </section>

      {/* Eco-Friendly Operations Section */}
      <section className="py-12 bg-gradient-to-r from-green-900/20 via-emerald-900/10 to-green-900/20 border-y border-green-500/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0f2f1a] mb-4">
              Quietly Powerful. More Environmentally Responsible.
            </h2>
            <p className="text-[#1a3d24] text-lg leading-relaxed max-w-3xl mx-auto mb-6">
              Lawn Trooper is expanding low-emission operations with electric service options across parts of our fleet, including battery-powered mowers and handheld equipment on select crews and routes. That means quieter service and lower emissions where electric equipment is deployed, while we continue transitioning more of our operation over time.
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 rounded-full px-6 py-3">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-[#0f2f1a] font-bold">Ask your account manager about all-electric service preference availability in your area.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-accent/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src={mascotLogo} alt="Lawn Trooper" className="h-12 w-12 object-contain rounded-full bg-white/10" />
                <span className="font-heading font-bold text-2xl tracking-tight">LAWN TROOPER</span>
              </div>
              <p className="text-primary-foreground/80 max-w-sm mb-6">
                Deploying elite lawn care services across North Alabama. Professional, reliable, and always mission-ready.
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/profile.php?id=61588087766755" target="_blank" rel="noopener noreferrer" data-testid="link-facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://www.instagram.com/lawntrooper" target="_blank" rel="noopener noreferrer" data-testid="link-instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-accent">Headquarters</h4>
              <p className="text-primary-foreground/80 mb-4">Athens, AL</p>
              <div className="space-y-4 text-primary-foreground/80">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 shrink-0 text-accent" />
                  <a href={getTelHref()} className="hover:text-white transition-colors">{LT_PHONE_DISPLAY}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 shrink-0 text-accent" />
                  <a href="mailto:John@lawn-trooper.com" className="hover:text-white transition-colors">John@lawn-trooper.com</a>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-accent">Service Area</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-accent/80 font-semibold mb-2">Core Areas</p>
                  <ul className="space-y-2 text-primary-foreground/80">
                    <li>Huntsville</li>
                    <li>Madison</li>
                    <li>Harvest</li>
                    <li>Athens</li>
                    <li>Hampton Cove</li>
                    <li>Owens Cross Roads</li>
                    <li>Meridianville</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-accent/80 font-semibold mb-2">Expanding Areas</p>
                  <ul className="space-y-2 text-primary-foreground/80">
                    <li>Monrovia</li>
                    <li>Toney</li>
                    <li>Hazel Green</li>
                    <li>New Market</li>
                    <li>Gurley</li>
                  </ul>
                </div>
              </div>
              <p className="mt-3 text-xs text-primary-foreground/70">
                Plus surrounding Tennessee Valley communities as we continue expanding our routes.
              </p>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p>&copy; {new Date().getFullYear()} Lawn Trooper. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <Link href="/dream-yard-recon" className="hover:text-white transition-colors">Dream Yard Recon</Link>
              <Link href="/service-area" className="hover:text-white transition-colors">Service Area</Link>
              <Link href="/hoa-partnerships" className="hover:text-white transition-colors">HOA Partnerships</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </TooltipProvider>
  );
}
