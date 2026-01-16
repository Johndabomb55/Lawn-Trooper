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
  Twitter,
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
import heroMascot from "@assets/generated_images/camo_soldier_mascot_weedeating.png";
import camoPattern from "@assets/generated_images/subtle_camo_texture_background.png";
import heroDiverseCrew from "@assets/generated_images/black_woman_waving_from_porch.png";
import heroFlag from "@assets/generated_images/wavy_american_flag.png";

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
import { Mascot } from "@/components/Mascot";

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };


  const mascotLogo = heroMascot;

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Top Announcement Banner */}
      <div className="bg-[#5D4037] text-white py-3 px-4 text-center font-bold relative z-[60]">
        <div className="container mx-auto relative flex flex-col md:flex-row items-center justify-center gap-2 text-sm md:text-base leading-tight">
           <div className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 h-10">
              <img src={heroFlag} alt="American Flag" className="h-full object-contain w-auto opacity-90 hover:opacity-100 transition-opacity" />
           </div>
           <span className="uppercase tracking-wide md:pl-16">🎉 25th Anniversary Early Bird Bonus + AI Cost Reductions! 🎉</span>
           <span className="hidden md:inline mx-2 text-white/50">|</span>
           <span>Act by <span className="underline decoration-white/50 underline-offset-4">January 25, 2026</span> to lock in your pricing for up to 3 years!</span>
           <span className="bg-white/20 px-2 py-0.5 rounded text-xs uppercase tracking-widest ml-1 animate-pulse">
             + Up to 6 Months Free
           </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-[calc(3rem)] md:top-[3rem] w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={mascotLogo} alt="Lawn Trooper" className="h-10 w-10 object-contain rounded-full bg-primary/10" />
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
        
        {/* Urgency Top Bar */}
        <div className="absolute top-24 left-0 right-0 z-20 transform -rotate-1 pointer-events-none">
          <div className="pointer-events-auto inline-block w-full">
             <CountdownTimer />
          </div>
        </div>

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
            <img src={mascotLogo} alt="Cartoon lawn-care professional holding a weed trimmer" className="w-full object-contain relative z-10 drop-shadow-2xl max-h-[300px] mb-4 scale-125" />
            
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
               <div className="inline-block bg-accent text-accent-foreground font-bold px-4 py-1.5 rounded-full animate-pulse shadow-lg border-2 border-white/20">
                 25th Anniversary Early Bird Bonus: get up to 6 months free
               </div>
               
               <div className="flex flex-col items-center gap-4 mt-2">
                 <button 
                   onClick={() => scrollToSection('quote')} 
                   className="text-white/80 hover:text-white underline underline-offset-4 text-sm font-medium transition-colors"
                 >
                   Get your free quote below
                 </button>
               </div>
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
    
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            {/* Mission Briefing / Promotions Banner */}
            <div className="mb-10 bg-black/70 backdrop-blur-md border-2 border-accent/50 p-6 rounded-xl shadow-2xl relative overflow-hidden">
               {/* Diagonal "Ending Soon" Banner */}
               <div className="absolute top-0 right-0 bg-destructive text-white text-[10px] font-bold px-8 py-1 transform translate-x-8 translate-y-3 rotate-45 shadow-sm">
                 ENDS JAN 25TH
               </div>

               <div className="flex flex-col items-center justify-center gap-2 border-b border-accent/30 pb-4 mb-4">
                 <div className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-xl text-center">
                   <Star className="fill-accent w-6 h-6 animate-pulse" /> 
                   🎉 25th Anniversary Early Bird Bonus 🎉
                   <Star className="fill-accent w-6 h-6 animate-pulse" /> 
                 </div>
                 <p className="text-white/90 font-medium text-sm bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                   ⚠️ Lock in lowest pricing for up to 3 years - Ends Jan 25th!
                 </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                 {/* Deal 1: 25th Anniversary Early Bird Bonus */}
                 <div className="bg-accent/10 p-3 rounded border border-accent/50 hover:bg-accent/20 transition-colors relative">
                   <div className="absolute -top-2 -right-2">
                     <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">EARLY BIRD</span>
                   </div>
                   <div className="flex items-center gap-2 mb-1">
                     <Calendar className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Enroll by Jan 25</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="text-green-400 font-bold text-center py-1 bg-green-900/40 rounded">+1 Free Month</div>
                     <div className="text-white/70 text-xs mt-1 text-center">First payment by Feb 1</div>
                   </div>
                 </div>

                 {/* Deal 2: Commitment Bonus */}
                 <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-accent/50 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Zap className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Commitment Bonus</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="flex justify-between"><span>1-Year:</span> <span className="text-green-400 font-bold">+1 Month Free</span></div>
                     <div className="flex justify-between"><span>2-Year:</span> <span className="text-green-400 font-bold">+2 Months Free</span></div>
                   </div>
                 </div>

                 {/* Deal 3: Service Honors */}
                 <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-accent/50 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Shield className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Service Honors</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="flex justify-between"><span>Veterans:</span> <span className="text-green-400 font-bold">5% OFF</span></div>
                     <div className="flex justify-between"><span>Seniors:</span> <span className="text-green-400 font-bold">5% OFF</span></div>
                   </div>
                 </div>

                 {/* Deal 4: Pay-in-Full Accelerator */}
                 <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-accent/50 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Star className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Pay-in-Full Accelerator</span>
                   </div>
                   <div className="text-white text-sm font-medium leading-relaxed">
                     <span className="text-green-400 font-bold">Doubles ALL</span> earned free months
                   </div>
                 </div>
               </div>
               
               {/* Existing Customer Message */}
               <div className="mt-4 text-center space-y-2">
                  <p className="text-green-400 font-bold text-base md:text-lg bg-green-900/30 inline-block px-4 py-1 rounded-full border border-green-500/30 shadow-lg">
                    Stack all rewards for up to 6 FREE months on any plan!
                  </p>
                  <p className="text-xs text-white/60 italic block">{GLOBAL_CONSTANTS.EXISTING_CUSTOMER_LOYALTY}</p>
               </div>
            </div>

          </motion.div>
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
        <div className="absolute top-1/2 -right-8 z-0 opacity-40">
          <Mascot pose="trooper4" size="lg" hideOnMobile />
        </div>
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
        <div className="absolute top-1/4 -left-8 z-10 opacity-60">
          <Mascot pose="trooper1" size="lg" hideOnMobile />
        </div>
        <div className="absolute top-2/3 -right-8 z-10 opacity-60">
          <Mascot pose="trooper2" size="lg" hideOnMobile />
        </div>
        
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

      {/* Referral Program */}
      <section className="py-16 bg-accent text-accent-foreground text-center">
        <div className="container mx-auto px-4">
           <div className="max-w-2xl mx-auto">
             <h2 className="text-3xl font-heading font-bold mb-4">"No One Left Behind" Referral Program</h2>
             <p className="text-lg mb-8 opacity-90">Refer a Neighbor and you both get 1 month free!</p>
           </div>
        </div>
      </section>

      {/* Promos Banner */}
      <section className="relative py-12 overflow-hidden text-primary-foreground">
        {/* Background Image Matching Hero */}
        <div className="absolute inset-0 z-0">
           <img src={bgLandscape} alt="Background" className="w-full h-full object-cover brightness-[0.6]" />
           <div className="absolute inset-0 bg-primary/70 mix-blend-multiply"></div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-heading font-bold text-accent mb-2">LIMITED TIME ENLISTMENT OFFERS</h3>
              <ul className="text-sm md:text-base space-y-1 opacity-90">
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> 1-Year Commitment: <strong>1 Month FREE</strong></li>
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> 2-Year Commitment: <strong>2 Months FREE</strong></li>
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> 3-Year Commitment: <strong>3 Months FREE</strong></li>
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> Pay in Full: <strong>+1 Additional Month FREE</strong></li>
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> Refer a Neighbor: <strong>You BOTH get 1 Month FREE!</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-heading font-bold text-center text-primary mb-12">Mission Intel (FAQ)</h2>
          
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Do I have to sign a contract?",
                a: `We offer an annual subscription service designed to keep your property pristine year-round. ${GLOBAL_CONSTANTS.CONSULTATION_REFUND_POLICY} Month-to-month options are also available.`
              },
              {
                q: "How does billing work?",
                a: "We keep it simple with automated monthly billing through Jobber Payments. You'll receive an account number via email for your customer login, allowing you to view and manage your account at any time."
              },
              {
                q: "What if it rains?",
                a: "Our team closely monitors weather conditions daily. If rain prevents service on your scheduled day, we’ll reschedule as soon as conditions allow, typically within one to two days, to prevent yard damage. Schedules may adjust based on weather conditions."
              },
              {
                q: "Is the price guaranteed?",
                a: "Yes. Once you receive your quote based on your yard size, that price is locked for the season. No surprise surcharges."
              },
              {
                q: "Can I switch plans later?",
                a: "Absolutely. You can switch plans at any time, but please note that any plan change will start a new one-year subscription term at the new plan’s rate."
              },
              {
                q: "Existing Customers",
                a: GLOBAL_CONSTANTS.EXISTING_CUSTOMER_LOYALTY
              },
              {
                q: "What if I need to cancel early?",
                a: (
                  <div className="space-y-2">
                    <p>We keep it fair. Lawn Trooper plans are annual, but we understand things change.</p>
                    <p className="font-bold">If you cancel early:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>You’re only responsible for services already performed</li>
                      <li>Any remaining balance is settled at standard per-visit pricing</li>
                    </ul>
                  </div>
                )
              },
              {
                q: "Do you use robots?",
                a: GLOBAL_CONSTANTS.AI_TECH_EXPLANATION
              }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-bold text-lg hover:text-accent transition-colors">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
                src={heroDiverseCrew} 
                alt="Lawn Trooper Crew" 
                className="w-full rounded-xl shadow-2xl relative z-10 border-4 border-white object-cover h-[400px]"
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

      {/* Testimonials - Field Reports */}
      <section className="py-20 bg-background relative border-t border-border">
        <div className="absolute top-1/3 -left-8 z-10 opacity-60">
          <Mascot pose="trooper3" size="lg" hideOnMobile />
        </div>
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
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-accent">Headquarters</h4>
              <p className="text-primary-foreground/80 mb-4">Athens, AL</p>
              <div className="space-y-4 text-primary-foreground/80">
                <div className="flex items-center gap-3 mt-6">
                  <Mail className="w-5 h-5 shrink-0 text-accent" />
                  <a href="mailto:lawntrooperllc@gmail.com" className="hover:text-white transition-colors">lawntrooperllc@gmail.com</a>
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
