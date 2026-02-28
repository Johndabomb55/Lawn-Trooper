import React, { useState, useEffect } from "react";
import MultiStepQuoteWizard from "@/components/MultiStepQuoteWizard";
import CTAButton from "@/components/CTAButton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Shield, 
  Clock, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Menu, 
  X,
  MapPin,
  Calendar,
  Zap,
  Leaf,
  Info,
  AlertCircle,
  Facebook,
  Instagram,
  Mail
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
  PROMO_CONFIG
} from "@/data/plans";

// Assets
import heroBg from "@assets/generated_images/manicured_lawn_with_mower_stripes.png";
import heroMascot from "@assets/Lawn_Trooper_in_front_of_luxury_home_1771794280044.png";
import camoPattern from "@assets/generated_images/subtle_camo_texture_background.png";
import heroFlag from "@assets/generated_images/wavy_american_flag.png";
import mascotAtWork from "@assets/Lawn_Trooper_at_work_in_the_yard_2_1771794299342.png";
import mascotHolidayLights from "@assets/Holiday_lights_on_a_festive_home_1771794249376.png";

// Stock Assets
import heroLuxury from "@assets/generated_images/southern_home_with_wrap-around_porch_and_fall_flowers.png";
import imgEstateMadison from "@assets/generated_images/madison_al_home_dark_red_brick.png";
import imgGardenHuntsville from "@assets/generated_images/basic_neat_lawn_without_flowers.png";

import imgLeaf from "@assets/stock_images/leaf_removal_lawn_ca_457548d2.jpg";
import imgMulch from "@assets/stock_images/installing_mulch_in__9ec6d6e1.jpg";
import imgXmas from "@assets/stock_images/professional_christm_4b6754bb.jpg";
import imgWash from "@assets/stock_images/pressure_washing_con_d670d4c2.jpg";
import imgXmasPremium from "@assets/stock_images/christmas_lights_dec_50e6447b.jpg";
import imgMulchInstall from "@assets/stock_images/landscaper_installin_4e11602e.jpg";
import imgSeasonalFlowers from "@assets/stock_images/colorful_seasonal_fl_f56cde03.jpg";
import imgTrashBinWash from "@assets/stock_images/residential_garbage__c1c3e341.jpg";
import imgPineStrawInstall from "@assets/stock_images/man_trimming_hedges__4f4ec72f.jpg";
import imgAlabamaYard1 from "@assets/stock_images/beautiful_green_lawn_e7c60690.jpg";
import imgAlabamaYard2 from "@assets/stock_images/flower_bed_landscapi_f38aa87f.jpg";
import imgAlabamaYard3 from "@assets/stock_images/manicured_lawn_curb__32de1fed.jpg";
import imgSmallYard1 from "@assets/generated_images/athens_al_home_with_pansies.png";
import imgSmallYard2 from "@assets/generated_images/manicured_small_garden.png";
import imgSmallYard3 from "@assets/generated_images/basic_neat_lawn_without_flowers.png";
import bgLandscape from "@assets/generated_images/beautiful_landscaped_yard_background.png";


import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Countdown Timer Component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(PROMO_CONFIG.cutoffDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
        setHasEnded(false);
      } else {
        setTimeLeft(null);
        setHasEnded(true);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, []);

  if (hasEnded) {
    return (
      <div className="bg-destructive/90 text-white py-2 px-4 shadow-lg text-center">
        <div className="font-bold uppercase tracking-widest text-xs md:text-sm">
          Early Bird Bonus Expired
        </div>
      </div>
    );
  }

  if (!timeLeft) return null;

  return (
    <div className="bg-destructive/90 text-white py-2 px-4 shadow-lg text-center relative z-50">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 font-bold uppercase tracking-widest text-xs md:text-sm">
        <div className="flex items-center gap-2 animate-pulse">
          <AlertCircle className="w-4 h-4" />
          <span>{PROMO_CONFIG.saleLabel}</span>
        </div>
        <div className="bg-black/20 px-3 py-1 rounded font-mono text-base flex gap-2 items-center">
           <span>{String(timeLeft.days).padStart(2, '0')}d</span>:
           <span>{String(timeLeft.hours).padStart(2, '0')}h</span>:
           <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>:
           <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPromoBar, setShowPromoBar] = useState(true);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };


  const mascotLogo = heroMascot;

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

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Launch-ready promo banner: single, concise, dismissible */}
      {showPromoBar && (
        <div className="fixed top-0 left-0 right-0 z-[70] bg-[#5D4037] text-white border-b border-white/10">
          <div className="container mx-auto px-4 py-2 text-center text-sm md:text-base font-bold tracking-wide relative">
            <span>25th Anniversary Pricing Event — Ends March 25</span>
            <button
              aria-label="Dismiss promotion banner"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white transition-colors"
              onClick={() => setShowPromoBar(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className={`sticky md:fixed ${showPromoBar ? "top-11" : "top-0"} w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={mascotLogo} alt="Lawn Trooper" className="h-10 w-10 object-contain rounded-full" />
            <span className="font-heading font-bold text-xl tracking-tight text-primary">LAWN TROOPER</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium hover:text-primary transition-colors">How It Works</button>
            <button onClick={() => scrollToSection('plans')} className="text-sm font-medium hover:text-primary transition-colors">Plans</button>
            <button onClick={() => scrollToSection('faq')} className="text-sm font-medium hover:text-primary transition-colors">FAQ</button>
            <Button onClick={() => scrollToSection('quote')} className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider text-center">
              Get Instant Quote
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-border bg-background"
            >
              <div className="flex flex-col p-4 gap-4">
                <button onClick={() => scrollToSection('how-it-works')} className="text-left font-medium py-2">How It Works</button>
                <button onClick={() => scrollToSection('plans')} className="text-left font-medium py-2">Plans</button>
                <button onClick={() => scrollToSection('faq')} className="text-left font-medium py-2">FAQ</button>
                <Button onClick={() => scrollToSection('quote')} className="w-full bg-primary text-white font-bold uppercase tracking-wider text-center">Get Instant Quote</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col pt-32 pb-20 overflow-hidden bg-primary/5">

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
           <img src={bgLandscape} alt="Lawn Trooper Team" className="w-full h-full object-cover brightness-[0.65]" />
           {/* Removed fade to background so image stays visible */}
           <div className="absolute inset-0 bg-black/50"></div>
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${camoPattern})`, backgroundSize: '400px' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center items-center text-center mt-12">
          
          {/* Logo Centerpiece */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-8 relative w-full max-w-4xl"
          >
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full transform scale-150 pointer-events-none"></div>
            <img src={mascotLogo} alt="Cartoon lawn-care professional holding a weed trimmer" className="w-full object-contain relative z-10 drop-shadow-2xl max-h-[300px] mb-6" />
            
            {/* Big Intimidating Camo Banner */}
            <div className="mt-4 relative z-20 w-full">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-4 leading-none" 
                  style={{ 
                    backgroundImage: `url(${camoPattern})`, 
                    backgroundSize: '200px',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.7))'
                  }}>
                Lawn Trooper
              </h1>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase mb-6 leading-tight" 
                  style={{ 
                    backgroundImage: `url(${camoPattern})`, 
                    backgroundSize: '250px',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.6))'
                  }}>
                Landscape Maintenance<br/>& Exterior Home Care
              </h2>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white/90 uppercase tracking-widest mt-2 drop-shadow-md bg-black/40 px-4 py-2 rounded inline-block backdrop-blur-sm border border-[#8B7355]/30 max-w-3xl leading-relaxed">
                Total maintenance plans for under-1-acre neighborhood yards starting at $169/month
              </h3>
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-4">
              <button
                onClick={() => scrollToSection('quote')}
                className="text-white/80 hover:text-white underline underline-offset-4 text-sm font-medium transition-colors"
              >
                Get your free quote below
              </button>
            </div>
          </motion.div>

          
          {/* Mission Plan (Moved Up) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            id="how-it-works" className="w-full max-w-6xl mx-auto mb-12 scroll-mt-24 relative"
          >
            <div className="text-center mb-8">
               <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2 drop-shadow-md">Your Mission Plan</h3>
               <p className="text-white/80 max-w-2xl mx-auto text-sm">Three simple steps to a yard that commands respect.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: MapPin, 
                  title: "1. Choose Plan & Size", 
                  desc: "Select your service level and yard size. Pricing is clear and upfront based on acreage." 
                },
                { 
                  icon: Zap, 
                  title: "2. We Deploy The Crew", 
                  desc: "Our pro troopers and smart tech mobilize to keep your perimeter secure and tidy." 
                },
                { 
                  icon: Leaf, 
                  title: "3. Enjoy The Results", 
                  desc: "Your yard stays always-ready. Just set and forget. No scheduling calls, no equipment maintenance." 
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

      {/* About Us Section */}
      <section className="py-12 bg-background border-b border-border">
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

      {/* Quote Wizard Section - Primary CTA */}
      <section id="quote" className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <MultiStepQuoteWizard />
        </div>
      </section>

      {/* How It Works */}
      

      {/* Pricing Plans */}
      
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
              Quietly Powerful. Environmentally Responsible.
            </h2>
            <p className="text-[#1a3d24] text-lg leading-relaxed max-w-3xl mx-auto mb-6">
              Lawn Trooper utilizes <span className="text-amber-500 font-bold">electric service vehicles</span>, <span className="text-amber-500 font-bold">battery-powered mowers</span>, and <span className="text-amber-500 font-bold">electric handheld equipment</span> across many of our crews. This means reduced emissions, quieter operation, and a smaller environmental footprint for your neighborhood.
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 rounded-full px-6 py-3">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-[#0f2f1a] font-bold">So quiet, you might not even notice we just mowed your lawn.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="py-24 bg-primary/5 relative">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url(${camoPattern})`, backgroundSize: '400px' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0f2f1a] mb-4">
              Service <span className="text-amber-500">Deployment</span> Levels
            </h2>
            <p className="text-[#1a3d24] text-lg font-bold max-w-2xl mx-auto tracking-wide">
              Transparent pricing. Simple annual plans. No hidden fees.
            </p>
          </div>
          
          {/* Alabama Yards Gallery */}
          <div className="mb-16">
            <h3 className="text-center text-xl font-bold text-[#0f2f1a] mb-6">
              Examples of Tennessee Valley Yards We Maintain
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative group overflow-hidden rounded-xl aspect-[16/10] shadow-lg border-2 border-white/20">
                <img src={imgAlabamaYard1} alt="Beautiful Alabama Home with Landscaping" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-sm font-bold">Madison, AL - Executive Command</span>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl aspect-[16/10] shadow-lg border-2 border-white/20">
                <img src={imgAlabamaYard2} alt="Southern Home Front Yard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-sm font-bold">Huntsville, AL - Premium Patrol</span>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl aspect-[16/10] shadow-lg border-2 border-white/20">
                <img src={imgAlabamaYard3} alt="Landscaped Front Yard with Flowers" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-sm font-bold">Athens, AL - Basic Patrol</span>
                </div>
              </div>
            </div>
          </div>

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

      {/* Why Lawn Trooper */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">Why Enlist Lawn Trooper?</h2>
              <div className="space-y-6">
                {[
                  { title: "Locally Owned Command", desc: "Not a faceless national chain. We live here, we work here." },
                  { title: "Tech-Forward Tactics", desc: "Smart routing and robotic mowers where appropriate for maximum efficiency." },
                  { title: "Consistent Personnel", desc: "You'll know who is on your property. Friendly, vetted, and professional." },
                  { title: "The Mission Mindset", desc: "We treat every yard like an assignment we must complete with excellence." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src={mascotAtWork} 
                alt="Lawn Trooper at work" 
                className="w-full h-auto rounded-xl shadow-2xl relative z-10 border-4 border-white object-contain object-top"
              />
              <div className="bg-card p-6 rounded-2xl border border-border relative mt-4 z-20 mx-4 shadow-xl">
                <div className="text-6xl text-primary/20 font-serif absolute top-4 left-6">"</div>
                <p className="text-lg italic text-foreground/80 relative z-10 pt-4 mb-6">
                  I used to dread weekends because it meant mowing. Now I don't even think about it. The crew is like clockwork, and the billing is totally predictable. Best decision I made for my home.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">LP</div>
                  <div>
                    <div className="font-bold">Loretta P.</div>
                    <div className="text-xs text-muted-foreground">Premium Command Member since 2023</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section id="why-different" aria-labelledby="why-different-heading" className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 id="why-different-heading" className="text-3xl font-heading font-bold text-center text-primary mb-10">
            Why We're Different
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "25 Years Serving the Community",
                desc: "Over two decades of trusted service in the Tennessee Valley with 100+ beautification awards."
              },
              {
                title: "Industry-Leading Knowledge",
                desc: "Our founder has attended 3 AI and landscaping conferences to bring the latest innovations to your yard."
              },
              {
                title: "Investment in Efficiency",
                desc: "We invest in automation and operational efficiency so we can pass real savings to you."
              },
              {
                title: "Loyalty Price Drop Guarantee",
                desc: "Your pricing decreases over time as a loyal customer. We reward commitment, not punish it."
              },
              {
                title: "Dedicated Account Manager",
                desc: "Premium and Executive members get a real person managing their property — not a call center."
              },
              {
                title: "AI-Assisted Dream Yard Recon\u2122",
                desc: "Every plan includes an AI-generated landscape plan personalized to your property and goals."
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 bg-muted/30 rounded-lg border border-border" data-testid={`why-different-${i}`}>
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

      {/* HOA Partnership Section */}
      <section id="hoa-partnership" className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">HOA Partnership Program</h2>
            <p className="text-muted-foreground">
              If your HOA partners with Lawn Trooper, residents receive additional benefits.
            </p>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">HOA Name</label>
                <input 
                  type="text" 
                  data-testid="input-hoa-name"
                  placeholder="e.g., Oakwood Estates HOA"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Contact Name</label>
                  <input 
                    type="text" 
                    data-testid="input-hoa-contact-name"
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                  <input 
                    type="tel" 
                    data-testid="input-hoa-phone"
                    placeholder="(256) 555-0000"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input 
                  type="email" 
                  data-testid="input-hoa-email"
                  placeholder="contact@hoa.com"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Notes / Directions</label>
                <textarea 
                  data-testid="input-hoa-notes"
                  placeholder="Any additional information about your HOA..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <Button type="submit" data-testid="button-submit-hoa" className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider">
                Submit HOA Inquiry
              </Button>
            </form>
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
                  <span className="text-white/90">Basic & Premium seasonal lighting packages</span>
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

      {/* Testimonials - Field Reports */}
      <section className="py-20 bg-background relative border-t border-border">
        <div className="container mx-auto px-4">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Field Reports</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Debriefings from homeowners across the sector.</p>
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
                 <img src={imgSmallYard1} alt="Athens Home" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
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
                   <div className="font-bold font-heading text-primary">Lt. Col. James R. (Ret)</div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider">Executive Command Member</div>
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
                 <img src={imgSmallYard3} alt="Huntsville Home" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
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
                 <p className="text-muted-foreground italic mb-4 flex-1">"I love the Early Bird deal. Getting signed up early for 2026 saved us a ton. The yard looks amazing even in winter."</p>
                 <div>
                   <div className="font-bold font-heading text-primary">The Davidson Family</div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider">Basic Patrol Members</div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Referral section placed directly above FAQ for launch clarity */}
      <section className="py-14 bg-accent/15 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-3">
            NO ONE LEFT BEHIND — REFERRAL PROGRAM
          </h2>
          <p className="text-muted-foreground mb-6">
            Refer a neighbor and you both earn service rewards.
          </p>
          <ul className="space-y-2 text-left max-w-xl mx-auto mb-7">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>1 successful referral = 1 complimentary month</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>2 referrals = upgrade bonus</span>
            </li>
          </ul>
          <Button
            onClick={() => window.location.href = "mailto:John@lawn-trooper.com?subject=Neighbor%20Referral%20Program"}
            className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider"
          >
            Refer a Neighbor
          </Button>
        </div>
      </section>

      {/* Launch FAQ near footer for stronger conversion support */}
      <section id="faq" aria-labelledby="faq-heading" className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 id="faq-heading" className="text-3xl font-heading font-bold text-center text-primary mb-10">
            Mission Intel (FAQ)
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Most-asked questions first. Scroll for the full list.
          </p>
          {/* Prioritized February FAQ list in a scrollable accordion container. */}
          <div className="max-h-[560px] overflow-y-auto pr-1">
            <Accordion type="single" collapsible className="w-full" aria-label="Frequently asked questions">
              {[
                {
                  q: "What does the Basic Patrol plan include?",
                  a: "Basic Patrol includes bi-weekly mowing during the growing season, monthly property checks in the off-season, 2 Basic Upgrades, and a Dream Yard Recon\u2122 AI landscape plan. You can also convert 2 Basic Upgrades into 1 Premium Upgrade."
                },
                {
                  q: "What's the difference between Basic, Premium, and Executive?",
                  a: "Basic Patrol is bi-weekly mowing with 2 Basic Upgrades. Premium Patrol is weekly mowing with 3 Basic + 1 Premium Upgrades, bed weed control, Account Manager access, and a Seasonal Landscape Refresh Allowance\u2122. Executive Command includes year-round weekly monitoring, Executive Turf Defense\u2122 (up to 7 applications), Weed-Free Turf Guarantee, 3 Basic + 3 Premium Upgrades, Dedicated Account Manager, and Premier Landscape Allowance\u2122."
                },
                {
                  q: "What is Executive+ and how does it work?",
                  a: "Executive+ is an optional upgrade for Executive Command members (+$99/mo). It adds +1 Basic and +1 Premium Upgrade, Quarterly Strategy Sessions, Rapid Response Priority, and an Expanded Landscape Allowance\u2122 tier."
                },
                {
                  q: "What is the Landscape Allowance\u2122?",
                  a: "The Landscape Allowance\u2122 is included with Premium and Executive plans. It covers standard materials and installation for seasonal bed refresh, mulch, or pine straw. It resets annually, does not roll over, and specialty materials may require an additional upgrade. Installation is scheduled seasonally based on availability."
                },
                {
                  q: "What is Dream Yard Recon\u2122?",
                  a: "Dream Yard Recon\u2122 is an AI-generated landscape plan personalized to your property and goals. Every plan includes it. Premium and Executive members also receive a personalized review with their Account Manager."
                },
                {
                  q: "Can I convert Basic Upgrades to Premium?",
                  a: "Yes. All plans allow you to convert 2 Basic Upgrades into 1 Premium Upgrade. This gives you flexibility to choose higher-tier services even on the Basic plan."
                },
                {
                  q: "Do I have to sign a contract?",
                  a: `We offer annual subscription pricing for maximum value. ${GLOBAL_CONSTANTS.CONSULTATION_REFUND_POLICY} Month-to-month options are also available.`
                },
                {
                  q: "How does billing work?",
                  a: "Billing is automated monthly through Jobber Payments. You receive customer login details by email to manage your account. Complimentary months are applied at the end of your agreement term."
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
                  q: "Can I switch plans later?",
                  a: "Yes. You can upgrade or adjust plans at any time; a plan change starts a new subscription term at the new rate."
                },
                {
                  q: "What if I need to cancel early?",
                  a: "If you cancel early, you are only responsible for services already performed. Any remaining balance is settled at standard per-visit pricing."
                },
                {
                  q: "I am an existing customer. Do loyalty discounts still apply?",
                  a: GLOBAL_CONSTANTS.EXISTING_CUSTOMER_LOYALTY
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
                <div
                  className="fb-page"
                  data-href="https://www.facebook.com/profile.php?id=61588087766755"
                  data-tabs="timeline"
                  data-width="500"
                  data-height="600"
                  data-small-header="false"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                >
                  <blockquote cite="https://www.facebook.com/profile.php?id=61588087766755" className="fb-xfbml-parse-ignore">
                    <a href="https://www.facebook.com/profile.php?id=61588087766755" target="_blank" rel="noopener noreferrer">Lawn Trooper on Facebook</a>
                  </blockquote>
                </div>
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
                <a href="https://www.facebook.com/share/18D5pQyZio/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" data-testid="link-facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
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
                <div className="flex items-center gap-3 mt-6">
                  <Mail className="w-5 h-5 shrink-0 text-accent" />
                  <a href="mailto:John@lawn-trooper.com" className="hover:text-white transition-colors">John@lawn-trooper.com</a>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-accent">Service Area</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Huntsville</li>
                <li>Madison</li>
                <li>Harvest</li>
                <li>Athens</li>
                <li>Owens Cross Roads</li>
                <li>Meridianville</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p>&copy; {new Date().getFullYear()} Lawn Trooper. All rights reserved.</p>
              <span className="hidden md:inline text-white/30">|</span>
              <p className="text-xs italic text-primary-foreground/50">Military-style branding. Landscaping tools only.</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </TooltipProvider>
  );
}
