import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { 
  PLANS, 
  BASIC_ADDONS, 
  PREMIUM_ADDONS, 
  GLOBAL_CONSTANTS, 
  getPlanAllowance,
  PROMO_CONFIG,
  calculatePlanPrice,
  YARD_SIZES
} from "@/data/plans";

// Assets
import heroBg from "@assets/generated_images/manicured_lawn_with_mower_stripes.png";
import heroMascot from "@assets/generated_images/camo_soldier_mascot_weedeating.png";
import camoPattern from "@assets/generated_images/subtle_camo_texture_background.png";
import heroDiverseCrew from "@assets/generated_images/landscaping_crew_of_3:_waving,_weedeating,_and_riding_stand-on_mower.png";
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
          Anniversary Sale Ended
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

// Schema for the quote form
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Full street address is required"),
  contactMethod: z.enum(["text", "phone", "email", "either"], {
    required_error: "Please select a contact method",
  }),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email address").or(z.literal("")),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if ((data.contactMethod === "text" || data.contactMethod === "phone") && !data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Phone number is required for this contact method",
      path: ["phone"],
    });
  }
  if (data.contactMethod === "email" && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Email is required for this contact method",
      path: ["email"],
    });
  }
  if (data.contactMethod === "either" && !data.phone && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide either phone or email",
      path: ["email"],
    });
  }
});

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Plan Builder state (for interactive preview)
  const [builderYardSize, setBuilderYardSize] = useState("1/3");
  const [builderPlan, setBuilderPlan] = useState("basic");
  const [builderBasicAddons, setBuilderBasicAddons] = useState<string[]>([]);
  const [builderPremiumAddons, setBuilderPremiumAddons] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      contactMethod: "email",
      notes: "",
    },
  });

  const selectedContactMethod = form.watch("contactMethod");


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Request Sent! 🫡",
          description: `Your quote request has been sent to lawntrooperllc@gmail.com and a confirmation copy was sent to ${values.email}. We'll contact you shortly!`,
          duration: 6000,
        });
        
        form.reset({
          name: "",
          email: "",
          phone: "",
          address: "",
          contactMethod: "email",
          notes: "",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send quote request. Please try again or contact us directly.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Error",
        description: "Failed to send quote request. Please check your connection and try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }

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
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Top Announcement Banner */}
      <div className="bg-[#5D4037] text-white py-3 px-4 text-center font-bold relative z-[60]">
        <div className="container mx-auto relative flex flex-col md:flex-row items-center justify-center gap-2 text-sm md:text-base leading-tight">
           <div className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 h-10">
              <img src={heroFlag} alt="American Flag" className="h-full object-contain w-auto opacity-90 hover:opacity-100 transition-opacity" />
           </div>
           <span className="uppercase tracking-wide md:pl-16">🎉 25th Anniversary Sale + AI Cost Reductions! 🎉</span>
           <span className="hidden md:inline mx-2 text-white/50">|</span>
           <span>Act by <span className="underline decoration-white/50 underline-offset-4">January 1, 2026</span> to lock in your pricing for up to 2 years!</span>
           <span className="bg-white/20 px-2 py-0.5 rounded text-xs uppercase tracking-widest ml-1 animate-pulse">
             + Up to 3 Months Free
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
            <Button onClick={() => scrollToSection('quote')} className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider">
              Get Quote
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
                <Button onClick={() => scrollToSection('quote')} className="w-full bg-primary text-white">Get Quote</Button>
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
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full transform scale-150"></div>
            <img src={mascotLogo} alt="Lawn Trooper" className="w-full object-contain relative z-10 drop-shadow-2xl max-h-[300px] mb-4 scale-125" />
            
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
                 25th Anniversary Sale + AI Cost Reductions: get up to 3 months free
               </div>
               
               <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full max-w-md mx-auto justify-center">
                 <Button onClick={() => scrollToSection('plans')} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-wider py-6 text-lg bg-black/40 backdrop-blur-sm">
                   See What’s Included
                 </Button>
               </div>
            </div>
          </motion.div>

          
          {/* Mission Plan (Moved Up) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            id="how-it-works" className="w-full max-w-6xl mx-auto mb-12 scroll-mt-24"
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
                 ENDS JAN 1ST
               </div>

               <div className="flex flex-col items-center justify-center gap-2 border-b border-accent/30 pb-4 mb-4">
                 <div className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-xl text-center">
                   <Star className="fill-accent w-6 h-6 animate-pulse" /> 
                   🎉 25th Anniversary Sale + AI Cost Reductions 🎉
                   <Star className="fill-accent w-6 h-6 animate-pulse" /> 
                 </div>
                 <p className="text-white/90 font-medium text-sm bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                   ⚠️ Lock in lowest pricing for up to 2 years - Ends Jan 1st!
                 </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                 {/* Deal 1: Early Bird Special */}
                 <div className="bg-accent/10 p-3 rounded border border-accent/50 hover:bg-accent/20 transition-colors relative">
                   <div className="absolute -top-2 -right-2">
                     <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">EARLY BIRD ONLY</span>
                   </div>
                   <div className="flex items-center gap-2 mb-1">
                     <Calendar className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Sign Up By Jan 1st</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="flex justify-between items-center mb-1"><span>2-Year Pact:</span> <span className="text-green-400 font-bold bg-green-900/40 px-1.5 rounded">3 Months Free</span></div>
                     <div className="flex justify-between items-center mb-1"><span>1-Year Pact:</span> <span className="text-green-400 font-bold bg-green-900/40 px-1.5 rounded">1 Month Free</span></div>
                     <div className="flex justify-between items-center"><span>Renters:</span> <span className="text-green-400 font-bold bg-green-900/40 px-1.5 rounded">5% OFF</span></div>
                   </div>
                 </div>

                 {/* Deal 2: Pay Upfront */}
                 <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-accent/50 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Zap className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Pay Upfront (Full Term)</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="flex justify-between"><span>2-Year Term:</span> <span className="text-green-400 font-bold">15% OFF</span></div>
                     <div className="flex justify-between"><span>1-Year Term:</span> <span className="text-green-400 font-bold">10% OFF</span></div>
                   </div>
                 </div>

                 {/* Deal 3: Honors */}
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

                 {/* Deal 4: Stackable */}
                 <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-accent/50 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Star className="w-4 h-4 text-accent" />
                     <span className="text-accent font-bold uppercase text-xs">Total Savings</span>
                   </div>
                   <div className="text-white text-sm font-medium leading-relaxed">
                     Stack incentives for up to <span className="text-green-400 font-bold">30% OFF</span> and 3 free months.
                   </div>
                 </div>
               </div>
               
               {/* Existing Customer Message */}
               <div className="mt-4 text-center space-y-2">
                  <p className="text-green-400 font-bold text-base md:text-lg bg-green-900/30 inline-block px-4 py-1 rounded-full border border-green-500/30 shadow-lg">
                    Save up to $2,000+/year with stacked promotions on Executive plans.
                  </p>
                  <p className="text-xs text-white/60 italic block">{GLOBAL_CONSTANTS.EXISTING_CUSTOMER_LOYALTY}</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => scrollToSection('quote')} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold uppercase tracking-wider text-lg h-16 px-10 shadow-xl shadow-accent/20 transform hover:-translate-y-1 transition-all">
                Get Instant Quote
              </Button>
              <Button onClick={() => scrollToSection('plans')} variant="outline" size="lg" className="border-white/30 bg-black/30 backdrop-blur-sm text-white hover:bg-white/10 font-bold uppercase tracking-wider text-lg h-16 px-10">
                View Service Tiers
              </Button>
            </div>
          </motion.div>
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
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">
              Quietly Powerful. Environmentally Responsible.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto mb-6">
              Lawn Trooper utilizes <span className="text-green-400 font-bold" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>electric service vehicles</span>, <span className="text-green-400 font-bold" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>battery-powered mowers</span>, and <span className="text-green-400 font-bold" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>electric handheld equipment</span> across many of our crews. This means reduced emissions, quieter operation, and a smaller environmental footprint for your neighborhood.
            </p>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-6 py-3">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>So quiet, you might not even notice we just mowed your lawn.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="py-24 bg-primary/5 relative">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url(${camoPattern})`, backgroundSize: '400px' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4" 
                style={{ textShadow: '-1px -1px 0 #15803d, 1px -1px 0 #15803d, -1px 1px 0 #15803d, 1px 1px 0 #15803d, 2px 2px 4px rgba(0,0,0,0.3)' }}>
              Service Deployment Levels
            </h2>
            <p className="text-white text-lg font-bold max-w-2xl mx-auto tracking-wide"
               style={{ textShadow: '-1px -1px 0 #15803d, 1px -1px 0 #15803d, -1px 1px 0 #15803d, 1px 1px 0 #15803d' }}>
              Transparent pricing. Simple annual plans. No hidden fees.
            </p>
          </div>
          
          {/* Alabama Yards Gallery */}
          <div className="mb-16">
            <h3 className="text-center text-xl font-bold text-white mb-6" style={{ textShadow: '-1px -1px 0 #15803d, 1px -1px 0 #15803d, -1px 1px 0 #15803d, 1px 1px 0 #15803d' }}>
              Examples of Tennessee Valley Yards We Maintain
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative group overflow-hidden rounded-xl aspect-[16/10] shadow-lg border-2 border-white/20">
                <img src={imgAlabamaYard1} alt="Beautiful Alabama Home with Landscaping" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-sm font-bold">Madison, AL - Executive Plan</span>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl aspect-[16/10] shadow-lg border-2 border-white/20">
                <img src={imgAlabamaYard2} alt="Southern Home Front Yard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-sm font-bold">Huntsville, AL - Premium Plan</span>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl aspect-[16/10] shadow-lg border-2 border-white/20">
                <img src={imgAlabamaYard3} alt="Landscaped Front Yard with Flowers" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-sm font-bold">Athens, AL - Basic Plan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Builder Component */}
          {(() => {
            const builderPlanData = PLANS.find(p => p.id === builderPlan);
            const builderYardData = YARD_SIZES.find(y => y.id === builderYardSize);
            const builderPlanPrice = builderPlanData && builderYardData 
              ? calculatePlanPrice(builderPlan, builderYardData.acres) 
              : 0;
            
            const builderAllowance = getPlanAllowance(builderPlan, false);
            const builderBasicRemaining = Math.max(0, builderAllowance.basic - builderBasicAddons.length);
            const builderPremiumRemaining = Math.max(0, builderAllowance.premium - builderPremiumAddons.length);
            
            const builderExtraBasicCount = Math.max(0, builderBasicAddons.length - builderAllowance.basic);
            const builderExtraPremiumCount = Math.max(0, builderPremiumAddons.length - builderAllowance.premium);
            const builderExtraAddonsCost = (builderExtraBasicCount * 20) + (builderExtraPremiumCount * 40);
            const builderTotalPrice = builderPlanPrice + builderExtraAddonsCost;

            const handleBuilderBasicAddonToggle = (addonId: string) => {
              setBuilderBasicAddons(prev => 
                prev.includes(addonId) 
                  ? prev.filter(id => id !== addonId)
                  : [...prev, addonId]
              );
            };

            const handleBuilderPremiumAddonToggle = (addonId: string) => {
              setBuilderPremiumAddons(prev => 
                prev.includes(addonId) 
                  ? prev.filter(id => id !== addonId)
                  : [...prev, addonId]
              );
            };

            const resetBuilderAddons = () => {
              setBuilderBasicAddons([]);
              setBuilderPremiumAddons([]);
            };

            return (
              <div className="bg-card rounded-2xl shadow-2xl border-2 border-primary/30 overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-primary-foreground p-6 text-center">
                  <h3 className="text-2xl font-heading font-bold uppercase tracking-wider">Build Your Plan</h3>
                  <p className="text-sm opacity-90 mt-1">Configure your perfect lawn care package</p>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  {/* Step 1: Yard Size */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                      Select Your Yard Size
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {YARD_SIZES.map((size) => (
                        <button
                          key={size.id}
                          data-testid={`yard-size-${size.id}`}
                          onClick={() => setBuilderYardSize(size.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            builderYardSize === size.id
                              ? 'border-primary bg-primary/10 shadow-lg'
                              : 'border-border hover:border-primary/50 bg-muted/30'
                          }`}
                        >
                          <div className="text-lg font-bold">{size.label}</div>
                          <div className="text-xs text-muted-foreground">{size.acres} acres</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Plan Tier */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                      Select Your Plan Tier
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {PLANS.map((plan) => (
                        <button
                          key={plan.id}
                          data-testid={`plan-tier-${plan.id}`}
                          onClick={() => {
                            setBuilderPlan(plan.id);
                            resetBuilderAddons();
                          }}
                          className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                            builderPlan === plan.id
                              ? 'border-primary bg-primary/10 shadow-lg'
                              : 'border-border hover:border-primary/50 bg-muted/30'
                          }`}
                        >
                          {plan.id === 'executive' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                              Top Priority Scheduling
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-lg">{plan.name}</h5>
                            {plan.id === 'executive' && <Star className="w-4 h-4 fill-accent text-accent" />}
                          </div>
                          <div className="text-2xl font-bold text-primary mt-1">
                            ${calculatePlanPrice(plan.id, builderYardData?.acres || 0.33)}
                            <span className="text-sm font-normal text-muted-foreground">/mo</span>
                          </div>
                          {plan.oldPrice && (
                            <div className="text-xs text-muted-foreground line-through">Was ${plan.oldPrice}/mo</div>
                          )}
                          <div className="text-xs text-muted-foreground mt-2">{plan.allowanceLabel}</div>
                          {builderPlan === plan.id && (
                            <div className="absolute top-2 right-2">
                              <Check className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Plan Features */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
                      {builderPlanData?.name} Features
                    </h4>
                    <div className="bg-muted/30 rounded-xl p-4 border border-border">
                      {/* Key Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {builderPlanData?.keyStats?.map((stat, idx) => (
                          <div key={idx} className="bg-background rounded-lg p-3 text-center border border-border/50">
                            <div className="text-[10px] uppercase text-muted-foreground font-bold">{stat.label}</div>
                            <div className="text-sm font-bold text-primary mt-0.5">
                              {stat.value === 'Weekly' || stat.value === 'Bi-Weekly' ? (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">{stat.value}</span>
                              ) : (
                                stat.value
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <ul className="space-y-2 max-h-64 overflow-y-auto">
                        {builderPlanData?.features.map((feature, i) => {
                          const isNotIncluded = feature.includes("Not Included");
                          return (
                            <li key={i} className={`flex items-start gap-2 text-sm ${isNotIncluded ? 'opacity-50' : ''}`}>
                              {isNotIncluded ? (
                                <X className="w-4 h-4 shrink-0 text-muted-foreground mt-0.5" />
                              ) : (
                                <Check className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                              )}
                              <span dangerouslySetInnerHTML={{ __html: feature }} />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {/* Step 4: Add-ons */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-sm">4</span>
                      Select Add-ons
                    </h4>
                    
                    {/* Add-on Counters */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className={`px-4 py-2 rounded-lg border ${builderBasicRemaining > 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-muted border-border'}`}>
                        Basic add-ons remaining: <strong>{builderBasicRemaining}</strong>
                      </div>
                      {(builderPlan === 'premium' || builderPlan === 'executive') && (
                        <div className={`px-4 py-2 rounded-lg border ${builderPremiumRemaining > 0 ? 'bg-accent/20 border-accent/40 text-accent-foreground' : 'bg-muted border-border'}`}>
                          Premium add-ons remaining: <strong>{builderPremiumRemaining}</strong>
                        </div>
                      )}
                    </div>

                    {/* Basic Add-ons */}
                    <div className="space-y-3">
                      <h5 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Basic Add-ons ($20/mo each if over limit)</h5>
                      <div className="grid md:grid-cols-2 gap-2">
                        {BASIC_ADDONS.map((addon) => (
                          <label
                            key={addon.id}
                            data-testid={`addon-basic-${addon.id}`}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              builderBasicAddons.includes(addon.id)
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30'
                            }`}
                          >
                            <Checkbox
                              checked={builderBasicAddons.includes(addon.id)}
                              onCheckedChange={() => handleBuilderBasicAddonToggle(addon.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{addon.label}</div>
                              <div className="text-xs text-muted-foreground">{addon.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Premium Add-ons (only for Premium and Executive) */}
                    {(builderPlan === 'premium' || builderPlan === 'executive') && (
                      <div className="space-y-3">
                        <h5 className="font-bold text-sm uppercase tracking-wider text-accent">Premium Add-ons ($40/mo each if over limit)</h5>
                        <div className="grid md:grid-cols-2 gap-2">
                          {PREMIUM_ADDONS.map((addon) => (
                            <label
                              key={addon.id}
                              data-testid={`addon-premium-${addon.id}`}
                              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                builderPremiumAddons.includes(addon.id)
                                  ? 'border-accent bg-accent/10'
                                  : 'border-border hover:border-accent/30'
                              }`}
                            >
                              <Checkbox
                                checked={builderPremiumAddons.includes(addon.id)}
                                onCheckedChange={() => handleBuilderPremiumAddonToggle(addon.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{addon.label}</div>
                                <div className="text-xs text-muted-foreground">{addon.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="bg-muted/50 rounded-xl p-6 border border-border space-y-3">
                    <h4 className="font-bold text-lg text-primary">Price Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{builderPlanData?.name} Base Price ({builderYardData?.label})</span>
                        <span className="font-bold">${builderPlanPrice}/mo</span>
                      </div>
                      
                      {builderBasicAddons.length > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>
                            Basic Add-ons ({builderBasicAddons.length}) 
                            {builderBasicAddons.length <= builderAllowance.basic && ' - Included'}
                          </span>
                          <span className={builderBasicAddons.length <= builderAllowance.basic ? 'text-green-600' : ''}>
                            {builderBasicAddons.length <= builderAllowance.basic ? 'Free' : `+$${builderExtraBasicCount * 20}/mo`}
                          </span>
                        </div>
                      )}
                      
                      {builderPremiumAddons.length > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>
                            Premium Add-ons ({builderPremiumAddons.length})
                            {builderPremiumAddons.length <= builderAllowance.premium && ' - Included'}
                          </span>
                          <span className={builderPremiumAddons.length <= builderAllowance.premium ? 'text-green-600' : ''}>
                            {builderPremiumAddons.length <= builderAllowance.premium ? 'Free' : `+$${builderExtraPremiumCount * 40}/mo`}
                          </span>
                        </div>
                      )}
                      
                      <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                        <span>Total Monthly</span>
                        <span className="text-primary">${builderTotalPrice}/mo</span>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            );
          })()}

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
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> Sign a 1-year agreement: <strong>1 Month FREE</strong></li>
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> Sign a 2-year agreement: <strong>3 Months FREE</strong></li>
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> Pay in Full: <strong>Extra 2 Months FREE</strong></li>
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> Refer a Neighbor: <strong>You BOTH get 1 Month FREE!</strong></li>
              </ul>
            </div>
            <Button onClick={() => scrollToSection('quote')} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold whitespace-nowrap px-8">
              Claim Offer Now
            </Button>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="quote" className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block p-3 rounded-full bg-primary/10 text-primary mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">Request Your Deployment</h2>
            <p className="text-muted-foreground">Fill out the intel below. We'll analyze your property satellite data and send your custom plan.</p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-2xl border border-border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* 1. Contact Intel */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-heading uppercase text-primary border-b border-border pb-2">1. Contact Intel</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Street Address <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="123 Maple Ave, Springfield, IL 62704" {...field} />
                        </FormControl>
                        <FormDescription>Include City and Zip Code</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Contact Method <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text">Text Message</SelectItem>
                              <SelectItem value="phone">Phone Call</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="either">Either (Phone or Email)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Mobile Phone {(selectedContactMethod === "text" || selectedContactMethod === "phone") && <span className="text-red-500">*</span>}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email Address {selectedContactMethod === "email" && <span className="text-red-500">*</span>}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                    <Info className="w-3 h-3 inline mr-1" />
                    To give you a quote, all we really need is your address and a way to reach you. Photos are helpful but optional.
                  </div>
                </div>


                {/* 2. Premium Add-On Services Gallery */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-heading uppercase text-primary border-b border-border pb-2">2. Available Premium Services</h3>
                  <p className="text-sm text-muted-foreground">We offer a variety of premium add-on services. Discuss your needs during your consultation.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="relative group overflow-hidden rounded-lg aspect-[4/3]">
                      <img src={imgXmasPremium} alt="Premium Christmas Lights Installation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                        <span className="text-white text-xs font-bold">Christmas Lights</span>
                      </div>
                    </div>
                    <div className="relative group overflow-hidden rounded-lg aspect-[4/3]">
                      <img src={imgSeasonalFlowers} alt="Seasonal Flower Installation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                        <span className="text-white text-xs font-bold">Seasonal Flowers</span>
                      </div>
                    </div>
                    <div className="relative group overflow-hidden rounded-lg aspect-[4/3]">
                      <img src={imgMulchInstall} alt="Brown Mulch Installation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                        <span className="text-white text-xs font-bold">Mulch Installation</span>
                      </div>
                    </div>
                    <div className="relative group overflow-hidden rounded-lg aspect-[4/3]">
                      <img src={imgTrashBinWash} alt="Pressure Washing Trash Bins" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                        <span className="text-white text-xs font-bold">Trash Bin Cleaning</span>
                      </div>
                    </div>
                    <div className="relative group overflow-hidden rounded-lg aspect-[4/3]">
                      <img src={imgPineStrawInstall} alt="Shrub Trimming" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                        <span className="text-white text-xs font-bold">Shrub Trimming</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Optional Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-heading uppercase text-primary border-b border-border pb-2">3. Recon Data (Optional)</h3>
                  
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="photos">Yard Photos</Label>
                      <Input id="photos" type="file" accept="image/*" multiple className="cursor-pointer" disabled />
                      <p className="text-[0.8rem] text-muted-foreground">Photo upload coming soon! For now, you can text photos to us after submitting your quote request or share them during your consultation.</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions / Gate Codes / Customer Names You're Referring</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Fenced backyard, dog on property, specific gate code, etc." 
                              className="resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider py-8 text-2xl shadow-xl mt-8 flex flex-col items-center justify-center h-auto leading-tight px-4 gap-2">
                  <span>DEPLOY THE TROOPS</span>
                  <span className="text-xs font-bold normal-case text-yellow-400 max-w-md text-center leading-tight">your account commander will reach out asap<br/>to schedule a custom yard plan consultation with you.</span>
                </Button>
              </form>
            </Form>
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
                   <div className="text-xs text-muted-foreground uppercase tracking-wider">Premium Plan Members</div>
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

      {/* Referral Program */}
      <section className="py-16 bg-accent text-accent-foreground text-center">
        <div className="container mx-auto px-4">
           <div className="max-w-2xl mx-auto">
             <h2 className="text-3xl font-heading font-bold mb-4">"No One Left Behind" Referral Program</h2>
             <p className="text-lg mb-8 opacity-90">Refer a Neighbor and you both get 1 month free!</p>
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
            <p>&copy; {new Date().getFullYear()} Lawn Trooper. All rights reserved.</p>
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
