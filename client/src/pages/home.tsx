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

// Assets
import heroBg from "@assets/generated_images/manicured_lawn_with_mower_stripes.png";
import heroMascot from "@assets/generated_images/camo_soldier_mascot_weedeating.png";
import camoPattern from "@assets/generated_images/subtle_camo_texture_background.png";
import heroDiverseCrew from "@assets/generated_images/lawn_trooper_diverse_crew_with_smart_glasses_and_camo_mower.png";

// Stock Assets
import heroLuxury from "@assets/generated_images/luxury_home_lawn_athens.png";
import imgEstateMadison from "@assets/generated_images/estate_home_lawn_madison.png";
import imgGardenHuntsville from "@assets/generated_images/manicured_garden_huntsville.png";

import imgLeaf from "@assets/stock_images/leaf_removal_lawn_ca_457548d2.jpg";
import imgMulch from "@assets/stock_images/installing_mulch_in__9ec6d6e1.jpg";
import imgXmas from "@assets/stock_images/professional_christm_4b6754bb.jpg";
import imgWash from "@assets/stock_images/pressure_washing_con_d670d4c2.jpg";
import imgSmallYard1 from "@assets/generated_images/small_yard_seasonal_color.png";
import imgSmallYard2 from "@assets/generated_images/manicured_small_garden.png";
import imgSmallYard3 from "@assets/generated_images/basic_neat_lawn_without_flowers.png";


import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Schema for the quote form
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Full street address is required"),
  contactMethod: z.enum(["text", "phone", "email", "either"], {
    required_error: "Please select a contact method",
  }),
  phone: z.string().optional(),
  email: z.string().optional(),
  yardSize: z.coerce.number().min(0.01, "Please enter a valid lot size"),
  plan: z.enum(["basic", "premium", "executive"], {
    required_error: "Please select a plan",
  }),
  addOns: z.array(z.string()).default([]),
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
      path: ["phone"],
    });
  }
});

// Pricing Constants
const PRICING = {
  basic: { base: 129 },
  premium: { base: 199 },
  executive: { base: 299 },
};

// Add-Ons Configuration
const basicAddOns = [
  { 
    id: "fall_cleanup", 
    label: "Fall Clean-Up", 
    description: "Cleanup of leaves, sticks, and debris to create clean curb appeal.",
    img: null 
  },
  {
    id: "spring_cleanup",
    label: "Spring Cleanup",
    description: "Cleanup of leaves, sticks, and debris to refresh the yard and prepare for spring growth.",
    img: null
  },
  {
    id: "weed_prevention_upgrade",
    label: "Weed Prevention & Control Upgrade",
    description: "Add three additional weed killer applications per year for total weed prevention.",
    img: null
  },
  {
    id: "trash_can_basic",
    label: "Trash Can Cleaning (Biannually)",
    description: "Professional cleaning of your trash cans twice a year.",
    img: null
  },
];

const premiumAddOns = [
  { 
    id: "mulch_install", 
    label: "Mulch Installation", 
    description: "Mulch installation in flowerbeds.",
    img: null 
  },
  { 
    id: "pine_straw_install", 
    label: "Pine Straw Installation", 
    description: "Pine straw installation in flowerbeds.",
    img: null 
  },
  { 
    id: "gutter_cleaning", 
    label: "Gutter Cleaning", 
    description: "First-level gutters only.",
    img: null 
  },
  { 
    id: "driveway_wash", 
    label: "Driveway Pressure Washing", 
    description: "Neighborhood yards only.",
    img: null 
  },
  { 
    id: "trash_can_premium", 
    label: "Trash Can Cleaning (Bi-Monthly)", 
    description: "Professional cleaning of your trash cans every other month.",
    img: null 
  },
  { 
    id: "lawn_aeration", 
    label: "Lawn Aeration", 
    description: "Professional core aeration to improve soil health.",
    img: null 
  },
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [discounts, setDiscounts] = useState({
    payFull: false, // Previously 'yearly' payment
    agreement: "none", // none, 1year, 2year
    renter: false,
    veteran: false,
    senior: false
  });
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      contactMethod: "email",
      plan: "basic", // Default to basic
      yardSize: 0.33, // Default size (Acres) - Adjusted default
      addOns: [],
      notes: "",
    },
  });

  const selectedPlan = form.watch("plan");
  const selectedYardSize = form.watch("yardSize");
  const selectedAddOns = form.watch("addOns");

  // State for new questions
  const [isUnderOneAcre, setIsUnderOneAcre] = useState<string>("yes");
  const [maintenanceFreq, setMaintenanceFreq] = useState<string>("weekly");

  // Calculate Price Effect
  useEffect(() => {
    if (selectedPlan) {
      const planData = PRICING[selectedPlan as keyof typeof PRICING];
      
      // If user says "Yes" (Under 1 Acre), we show the base price.
      // We removed the acreage math as requested.
      if (planData && isUnderOneAcre === "yes") {
         setEstimatedPrice(planData.base);
      } else {
         // If not under 1 acre or not sure, we might hide price or show "Starting at"
         // For now, if they say 'no' or 'not sure', we can reset or keep showing base with a disclaimer
         // But prompt says "Total landscape maintenance plans for under-1-acre neighborhood yards starting at $129/month"
         // Let's assume standard pricing for standard yards.
         if (isUnderOneAcre === "no" || isUnderOneAcre === "unsure") {
             setEstimatedPrice(null); // Custom quote needed
         } else {
             setEstimatedPrice(planData.base);
         }
      }
    }
  }, [selectedPlan, isUnderOneAcre]);

  // Calculate counts
  const calculateCounts = (currentAddOns: string[]) => {
    let basicCount = 0;
    let premiumCount = 0;
    currentAddOns.forEach(id => {
      if (basicAddOns.find(a => a.id === id)) basicCount += 1;
      if (premiumAddOns.find(a => a.id === id)) premiumCount += 1;
    });
    return { basicCount, premiumCount };
  };

  const getPlanLimits = (plan: string) => {
    switch(plan) {
      case "basic": return { basic: 1, premium: 0, label: "Basic Patrol includes 1 Basic add-on." };
      case "premium": return { basic: 1, premium: 2, label: "Premium includes 1 Basic and 2 Premium add-ons." };
      case "executive": return { basic: 1, premium: 5, label: "Executive includes 1 Basic and 5 Premium add-ons." };
      default: return { basic: 0, premium: 0, label: "" };
    }
  };

  const handleAddOnToggle = (id: string, isPremium: boolean) => {
    const limits = getPlanLimits(selectedPlan);
    const currentAddOns = form.getValues("addOns");
    const isCurrentlySelected = currentAddOns.includes(id);
    
    setSlotError(null);

    if (isCurrentlySelected) {
      // Removing is always allowed
      form.setValue("addOns", currentAddOns.filter(item => item !== id));
    } else {
      // Adding requires check
      const { basicCount, premiumCount } = calculateCounts(currentAddOns);
      
      if (isPremium) {
        if (premiumCount >= limits.premium) {
           setSlotError(`You’ve reached the limit of ${limits.premium} Premium add-ons for this plan.`);
           setTimeout(() => setSlotError(null), 3000);
           return;
        }
      } else {
        if (basicCount >= limits.basic) {
           setSlotError(`You’ve reached the limit of ${limits.basic} Basic add-ons for this plan.`);
           setTimeout(() => setSlotError(null), 3000);
           return;
        }
      }

      form.setValue("addOns", [...currentAddOns, id]);
    }
  };

  // Reset add-ons when plan changes
  useEffect(() => {
    const currentAddOns = form.getValues("addOns");
    const limits = getPlanLimits(selectedPlan);
    
    // Separate current add-ons
    const currentBasic = currentAddOns.filter(id => basicAddOns.find(b => b.id === id));
    const currentPremium = currentAddOns.filter(id => premiumAddOns.find(p => p.id === id));
    
    let newAddOns: string[] = [];
    
    // Trim to fit new limits
    newAddOns = [
      ...currentBasic.slice(0, limits.basic),
      ...currentPremium.slice(0, limits.premium)
    ];
    
    if (newAddOns.length !== currentAddOns.length) {
      form.setValue("addOns", newAddOns);
    }
  }, [selectedPlan, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, this would be an API call to the backend
    
    toast({
      title: "Simulation Successful! 🫡",
      description: "This is a prototype. In the live version, this data will be emailed to jclaxtonlandscapes@gmail.com and saved to the database.",
      duration: 5000,
    });
    
    form.reset({
      name: "",
      email: "",
      phone: "",
      address: "",
      contactMethod: "email",
      plan: "basic",
      addOns: [],
      notes: "",
    });
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };


  const mascotLogo = heroMascot;

  // Calculation Logic for variables used in JSX
  const termMonths = discounts.agreement === "2year" ? 24 : 12;
  let freeMonths = 0;
  if (discounts.agreement === "1year") freeMonths = 1;
  if (discounts.agreement === "2year") freeMonths = 3;
  
  const billableMonths = termMonths - freeMonths;
  const basePrice = estimatedPrice || 0;
  const billableBaseCost = basePrice * billableMonths;
  
  let percentOff = 0;
  if (discounts.payFull) {
    if (discounts.agreement === "2year") {
        percentOff += 0.15;
    } else {
        percentOff += 0.10;
    }
  }
  if (discounts.veteran) percentOff += 0.05;
  if (discounts.senior) percentOff += 0.05;
  
  const finalTotalCost = billableBaseCost * (1 - percentOff);
  const discountedMonthlyPayment = finalTotalCost / termMonths;

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
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
      <section className="relative min-h-screen flex flex-col pt-24 pb-20 overflow-hidden bg-primary/5">
        
        {/* Urgency Top Bar */}
        <div className="absolute top-16 left-0 right-0 z-20 bg-destructive/90 text-white py-2 px-4 shadow-lg text-center transform -rotate-1">
          <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs md:text-sm animate-pulse">
            <AlertCircle className="w-4 h-4" />
            Early Bird Savings — Lock in prices before the January 1st increase. Enlist now.
          </div>
        </div>

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
           <img src={heroDiverseCrew} alt="Lawn Trooper Team" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-background"></div>
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
            <img src={mascotLogo} alt="Lawn Trooper" className="w-full object-contain relative z-10 drop-shadow-2xl max-h-[300px] mb-4" />
            
            <div className="mt-4 relative z-20">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-2 leading-none" 
                  style={{ 
                    backgroundImage: `url(${camoPattern})`, 
                    backgroundSize: '200px',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'
                  }}>
                Instant Pricing in 30 Seconds
              </h1>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white/90 uppercase tracking-widest mt-2 drop-shadow-md bg-black/40 px-4 py-2 rounded inline-block backdrop-blur-sm border border-[#8B7355]/30 max-w-3xl leading-relaxed">
                Total landscape maintenance plans for under-1-acre neighborhood yards starting at $129/month
              </h2>
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-4">
               <div className="inline-block bg-accent text-accent-foreground font-bold px-4 py-1.5 rounded-full animate-pulse shadow-lg border-2 border-white/20">
                 Next 5 days only: get up to 3 months FREE
               </div>
               
               <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full max-w-md mx-auto">
                 <Button onClick={() => scrollToSection('quote')} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider py-6 text-lg shadow-xl border-2 border-white/10">
                   Get My Instant Quote
                 </Button>
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
                  desc: "Your yard stays always-ready. No scheduling calls, no equipment maintenance." 
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
                 ENDS DEC 31
               </div>

               <div className="flex flex-col items-center justify-center gap-2 border-b border-accent/30 pb-4 mb-4">
                 <div className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-xl">
                   <Star className="fill-accent w-5 h-5" /> 
                   3 Weeks of Early Bird Savings
                   <Star className="fill-accent w-5 h-5" /> 
                 </div>
                 <p className="text-white/90 font-medium text-sm bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                   ⚠️ Prices Increase Jan 1st • Lock in your price now for 2 years!
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
                     <span className="text-accent font-bold uppercase text-xs">Sign Up By Dec 31</span>
                   </div>
                   <div className="text-white text-sm font-medium">
                     <div className="flex justify-between items-center mb-1"><span>2-Year Pact:</span> <span className="text-green-400 font-bold bg-green-900/40 px-1.5 rounded">3 Months Free</span></div>
                     <div className="flex justify-between items-center"><span>1-Year Pact:</span> <span className="text-green-400 font-bold bg-green-900/40 px-1.5 rounded">1 Month Free</span></div>
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
                 <div className="bg-white/5 p-3 rounded border border-white/10 flex flex-col justify-center items-center text-center">
                   <div className="text-accent font-black text-xl mb-1">STACKABLE</div>
                   <div className="text-white/80 text-xs leading-tight">
                     Combine ALL discounts for maximum savings.
                   </div>
                   <div className="mt-2 text-[10px] text-white/50 italic">
                     *Subject to change
                   </div>
                 </div>
               </div>
               
               <div className="mt-4 text-xs text-white/50 text-center italic border-t border-white/10 pt-2 px-4">
                 * Subscription price is subject to change so lock your price in for up to 2 years with an agreement. You can always downgrade plans or upgrade at anytime but there is no guarantee the prices will stay this low for the maintenance packages.
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
            
            <p className="mt-6 text-white/60 text-sm font-medium">
              Save up to <span className="text-accent font-bold">$2,000+</span>/year with stacked promotions on Executive plans.
            </p>
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
              Lawn Trooper — 25+ years serving North Alabama. 100+ beautification awards.
            </h2>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
              Military-level reliability. Premium results.
            </p>
          </div>
        </div>
      </section>

      <section id="plans" className="py-24 bg-primary/5 relative">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url(${camoPattern})`, backgroundSize: '400px' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Service Deployment Levels</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Transparent pricing based on your yard size. <span className="text-accent font-bold">Base price covers up to 1/3 acre.</span> +25% for each additional 1/3 acre.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Basic Plan */}
            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/30">
                <h3 className="text-2xl font-heading font-bold text-primary">Basic Patrol</h3>
                <p className="text-sm text-muted-foreground mt-2">Solid biweekly protection for low-maintenance yards.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$129</span>
                  <span className="text-muted-foreground text-sm">/mo (starting)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">For up to 1/3 acre</p>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">Biweekly</span> Mowing (Year-Round)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">Biweekly</span> Leaf Control (Fall)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">3</span> Weed Killer Apps (w/ Pre-emergent)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Bush Trimming (2x/year)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">1</span> Basic Add-on Included</span>
                  </li>
                </ul>
                <Button onClick={() => scrollToSection('quote')} variant="outline" className="w-full mt-4 border-primary/20 hover:bg-primary/5 hover:text-primary">Request Basic</Button>
              </div>
            </div>

            {/* Executive Plan (Highlighted) */}
            <div className="bg-card rounded-xl shadow-xl border-2 border-primary overflow-hidden relative transform md:-translate-y-4">
              <div className="bg-primary text-primary-foreground text-center text-xs font-bold uppercase tracking-widest py-2">
                Most Popular • Best Value
              </div>
              <div className="p-6 border-b border-border bg-primary/5">
                <h3 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
                  Executive Plan <Star className="w-5 h-5 fill-accent text-accent" />
                </h3>
                <p className="text-sm text-muted-foreground mt-2">Maximum firepower. Weekly maintenance year-round.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$299</span>
                  <span className="text-muted-foreground text-sm">/mo (starting)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">For up to 1/3 acre</p>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    <span className="font-bold text-primary">Weekly Maintenance (Year-Round)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">6</span> Weed Killer & Fertilizer Apps</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Bush Trimming (2x/year)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">1 Basic + 5 Premium</span> Add-ons</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Customized Yard Plan</span>
                  </li>
                </ul>
                <Button onClick={() => scrollToSection('quote')} className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-bold tracking-wide">Select Executive</Button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/30">
                <h3 className="text-2xl font-heading font-bold text-primary">Premium Command</h3>
                <p className="text-sm text-muted-foreground mt-2">Weekly attention for a consistently sharp look.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$199</span>
                  <span className="text-muted-foreground text-sm">/mo (starting)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">For up to 1/3 acre</p>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">Weekly</span> Mowing</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">3</span> Weed Killer Apps</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Bush Trimming (2x/year)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">1 Basic + 2 Premium</span> Add-ons</span>
                  </li>
                   <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Customized Yard Plan</span>
                  </li>
                </ul>
                <Button onClick={() => scrollToSection('quote')} variant="outline" className="w-full mt-4 border-primary/20 hover:bg-primary/5 hover:text-primary">Request Premium</Button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground bg-white/50 inline-block px-4 py-2 rounded-lg border border-border">
              <strong>Note:</strong> Prices shown are for up to 1/3 acre. Larger lots are no problem — we’ll measure and send a fast custom quote.
            </p>
          </div>
        </div>
      </section>

      {/* Promos Banner */}
      <section className="bg-primary text-primary-foreground py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-heading font-bold text-accent mb-2">LIMITED TIME ENLISTMENT OFFERS</h3>
              <ul className="text-sm md:text-base space-y-1 opacity-90">
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> Sign a 1-year agreement: <strong>1 Month FREE</strong></li>
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> Sign a 2-year agreement: <strong>3 Months FREE</strong></li>
                <li className="flex items-center gap-2 md:justify-start justify-center"><Check className="w-4 h-4 text-accent" /> Pay in Full: <strong>Extra 2 Months FREE</strong></li>
              </ul>
            </div>
            <Button onClick={() => scrollToSection('quote')} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold whitespace-nowrap px-8">
              Claim Offer Now
            </Button>
          </div>
        </div>
      </section>

      {/* Why Lawn Trooper */}
      <section className="py-20 bg-background">
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
            <div className="bg-muted p-8 rounded-2xl border border-border relative">
              <div className="text-6xl text-primary/20 font-serif absolute top-4 left-6">"</div>
              <p className="text-lg italic text-foreground/80 relative z-10 pt-4 mb-6">
                I used to dread weekends because it meant mowing. Now I don't even think about it. The crew is like clockwork, and the billing is totally predictable. Best decision I made for my home.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">JD</div>
                <div>
                  <div className="font-bold">James D.</div>
                  <div className="text-xs text-muted-foreground">Premium Command Member since 2023</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      
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
                 <img src={imgSmallYard2} alt="Madison Home" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
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
                 <p className="text-muted-foreground italic mb-4 flex-1">"Finally, a service that just handles it. I signed the 2-year agreement to lock in the rate, and the 3 free months was a huge bonus."</p>
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


      {/* Quote Form Section */}
      <section id="quote" className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block p-3 rounded-full bg-primary/10 text-primary mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">Request Your Deployment</h2>
            <p className="text-muted-foreground">Fill out the intel below. We'll analyze your property satellite data and send your custom plan within 24 hours.</p>
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

                    <div className="flex flex-col space-y-2">
                       <Label>Mobile Phone</Label>
                       <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="flex flex-col space-y-2">
                       <Label>Email Address</Label>
                       <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                    <Info className="w-3 h-3 inline mr-1" />
                    To give you a quote, all we really need is your address and a way to reach you. Photos are helpful but optional.
                  </div>
                </div>

                {/* 2. Instant Quote Questions */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-heading uppercase text-primary border-b border-border pb-2">2. Property Details</h3>
                   
                   {/* Question 1: Under 1 Acre? */}
                   <div className="space-y-3">
                     <Label className="text-base font-bold text-foreground">Is your property under 1 acre?</Label>
                     <RadioGroup 
                        value={isUnderOneAcre} 
                        onValueChange={(val) => {
                            setIsUnderOneAcre(val);
                            // If they confirm yes, we can set a valid dummy yardSize for form validation if needed
                            if (val === 'yes') form.setValue('yardSize', 0.5); 
                        }}
                        className="flex gap-4"
                     >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="acre-yes" />
                          <Label htmlFor="acre-yes" className="font-medium cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="unsure" id="acre-unsure" />
                          <Label htmlFor="acre-unsure" className="font-medium cursor-pointer">Not sure (we can help)</Label>
                        </div>
                     </RadioGroup>
                   </div>

                   {/* Question 2: Maintenance Frequency */}
                   <div className="space-y-3">
                     <Label className="text-base font-bold text-foreground">Maintenance Frequency</Label>
                     <RadioGroup 
                        value={maintenanceFreq} 
                        onValueChange={setMaintenanceFreq}
                        className="flex gap-4"
                     >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="freq-weekly" />
                          <Label htmlFor="freq-weekly" className="font-medium cursor-pointer">Weekly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="biweekly" id="freq-biweekly" />
                          <Label htmlFor="freq-biweekly" className="font-medium cursor-pointer">Bi-Weekly</Label>
                        </div>
                     </RadioGroup>
                   </div>

                   {/* Hidden numeric input to satisfy schema if needed, or we just rely on default */}
                   <div className="hidden">
                     <FormField
                      control={form.control}
                      name="yardSize"
                      render={({ field }) => (
                        <Input type="number" {...field} />
                      )}
                    />
                   </div>
                </div>

                {/* 3. Plan Selection */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-heading uppercase text-primary border-b border-border pb-2">3. Pick Your Style</h3>
                  
                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid md:grid-cols-3 gap-4"
                          >
                            <div className="relative">
                              <RadioGroupItem value="basic" id="basic" className="peer sr-only" />
                              <Label
                                htmlFor="basic"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer h-full"
                              >
                                <span className="mb-2 text-lg font-bold">Basic Patrol</span>
                                <span className="text-sm text-center text-muted-foreground">Weekly mowing & edging. 2 Basic add-ons.</span>
                                <span className="mt-2 text-sm font-bold text-primary">Starts at $129/mo</span>
                              </Label>
                            </div>
                            
                            <div className="relative">
                              <RadioGroupItem value="premium" id="premium" className="peer sr-only" />
                              <Label
                                htmlFor="premium"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer h-full"
                              >
                                <span className="mb-2 text-lg font-bold">Premium Command</span>
                                <span className="text-sm text-center text-muted-foreground">Plus weed control & beds. 2 Basic + 3 Premium Add-ons.</span>
                                <span className="mt-2 text-sm font-bold text-primary">Starts at $199/mo</span>
                              </Label>
                            </div>
                            
                            <div className="relative">
                              <RadioGroupItem value="executive" id="executive" className="peer sr-only" />
                              <Label
                                htmlFor="executive"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer h-full relative overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl shadow-sm">
                                  Jan Promo: +1 Free Premium Add-on
                                </div>
                                <span className="mb-2 text-lg font-bold flex items-center gap-1 mt-2">Executive <Star className="w-3 h-3 fill-accent text-accent" /></span>
                                <span className="text-sm text-center text-muted-foreground">Weekly Main. 6 Weed Apps. 1 Basic + 5 Premium Add-ons.</span>
                                <span className="mt-2 text-sm font-bold text-primary">Starts at $299/mo</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 4. Add-ons Selection */}
                <div className="space-y-6">
                  <div className="flex flex-col gap-1 border-b border-border pb-2">
                    <h3 className="text-lg font-bold font-heading uppercase text-primary">4. Choose Your Add-Ons</h3>
                    <p className="text-sm text-muted-foreground">Included in your plan. (No images needed here, soldier.)</p>
                  </div>


                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <div className="flex items-start gap-2 text-sm text-primary font-medium mb-1">
                      <Info className="w-4 h-4 mt-0.5" />
                      <span>{getPlanLimits(selectedPlan).label}</span>
                    </div>
                    {slotError && (
                      <div className="flex items-center gap-2 mt-2 text-destructive text-sm font-bold bg-destructive/10 p-2 rounded animate-pulse">
                        <AlertCircle className="w-4 h-4" />
                        {slotError}
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Basic Add-Ons</h4>
                      <div className="grid gap-3">
                      {basicAddOns.map((addon) => (
                        <div key={addon.id} className={`
                          relative flex flex-col p-3 rounded-lg border transition-all
                          ${selectedAddOns.includes(addon.id) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                        `}>
                          <div className="flex items-center space-x-3 mb-2">
                            <Checkbox 
                              id={addon.id} 
                              checked={selectedAddOns.includes(addon.id)}
                              onCheckedChange={() => handleAddOnToggle(addon.id, false)}
                              className="z-10"
                            />
                            <Label htmlFor={addon.id} className="text-base font-bold cursor-pointer flex-1 z-10 flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                {addon.label}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-4 h-4 text-muted-foreground/70 hover:text-primary transition-colors cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs text-sm">{addon.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </span>
                            </Label>
                          </div>
                          <div className="flex gap-3 pl-7">
                            <div className="text-xs text-muted-foreground leading-relaxed flex-1">
                              {addon.description}
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Premium Add-Ons</h4>
                      <div className="grid gap-3">
                      {premiumAddOns.map((addon) => {
                        const isDisabled = getPlanLimits(selectedPlan).premium === 0;
                        const isChecked = selectedAddOns.includes(addon.id);
                        return (
                          <div key={addon.id} className={`
                            relative flex flex-col p-3 rounded-lg border transition-all
                            ${isChecked ? 'border-accent bg-accent/5' : 'border-border'}
                            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-muted/20' : 'hover:border-accent/50'}
                          `}>
                            <div className="flex items-center space-x-3 mb-2">
                              <Checkbox 
                                id={addon.id} 
                                checked={isChecked}
                                onCheckedChange={() => handleAddOnToggle(addon.id, true)}
                                disabled={isDisabled}
                                className="z-10"
                              />
                              <Label 
                                htmlFor={addon.id} 
                                className={`text-base font-bold flex-1 z-10 flex items-center justify-between ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <span className="flex items-center gap-2">
                                  {addon.label}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="w-4 h-4 text-muted-foreground/70 hover:text-accent transition-colors cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs text-sm">{addon.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                              </Label>
                            </div>
                            
                            <div className="flex gap-3 pl-7">
                              <div className="text-xs text-muted-foreground leading-relaxed flex-1">
                                {addon.description}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      </div>
                      
                      {/* Executive Benefit Note - REMOVED per user request for updated add-ons list */}
                      {/* But "No One Left Behind" Referral is needed elsewhere. */}
                    </div>
                  </div>
                </div>

                {/* 5. Optional Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-heading uppercase text-primary border-b border-border pb-2">5. Recon Data (Optional)</h3>
                  
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="photos">Yard Photos</Label>
                      <Input id="photos" type="file" accept="image/*" multiple className="cursor-pointer" />
                      <p className="text-[0.8rem] text-muted-foreground">Upload photos of your yard to help us quote faster.</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions / Gate Codes</FormLabel>
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

                {/* Price Display */}
                <AnimatePresence>
                  {estimatedPrice && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-6">
                        <div className="flex-1">
                          <h4 className="text-muted-foreground uppercase tracking-widest text-xs font-bold mb-2">Estimated Deployment Cost</h4>
                          
                          <div className="flex items-baseline gap-2">
                             <div className="text-5xl font-heading font-bold text-primary flex items-center">
                              <span className="text-2xl mt-2">$</span>
                              {(() => {
                                const basePrice = estimatedPrice || 0;
                                
                                // 1. Determine Term Length (for comparison)
                                const termMonths = discounts.agreement === "2year" ? 24 : 12;
                                
                                // 2. Calculate Free Months
                                let freeMonths = 0;
                                if (discounts.agreement === "1year") freeMonths = 1;
                                if (discounts.agreement === "2year") freeMonths = 3;
                                
                                // 3. Calculate Billable Base Amount
                                const billableMonths = termMonths - freeMonths;
                                const billableBaseCost = basePrice * billableMonths;
                                
                                // 4. Apply Stackable Percentage Discounts
                                let percentOff = 0;
                                
                                // Pay Full Discount Logic (Updated)
                                if (discounts.payFull) {
                                  if (discounts.agreement === "2year") {
                                    percentOff += 0.15; // 15% for 2-Year Paid Upfront
                                  } else {
                                    percentOff += 0.10; // 10% for 1-Year Paid Upfront (default)
                                  }
                                }
                                
                                if (discounts.veteran) percentOff += 0.05;
                                if (discounts.senior) percentOff += 0.05;
                                
                                const finalTotalCost = billableBaseCost * (1 - percentOff);
                                
                                // 5. Display Logic
                                if (discounts.payFull) {
                                  // Show Total Cost for the full term (1 or 2 years)
                                  return finalTotalCost.toFixed(0);
                                } else {
                                  // Show Effective Monthly Rate (averaged)
                                  return (finalTotalCost / termMonths).toFixed(0);
                                }
                              })()}
                              <span className="text-xl text-muted-foreground font-sans font-normal ml-1 self-end mb-2">
                                {discounts.payFull ? (discounts.agreement === "2year" ? "/2yr" : "/yr") : "/mo"}
                              </span>
                            </div>
                            
                            {/* Strikethrough Price */}
                            {(discounts.payFull || discounts.agreement !== "none" || discounts.veteran || discounts.senior) && (
                              <div className="text-sm font-bold text-muted-foreground line-through">
                                ${discounts.payFull ? (estimatedPrice * (discounts.agreement === "2year" ? 24 : 12)) : estimatedPrice}
                              </div>
                            )}
                          </div>

                          {/* Savings Badge */}
                          {(discounts.payFull || discounts.agreement !== "none" || discounts.veteran || discounts.senior) && (
                             <div className="text-sm font-bold text-green-600 mt-2 bg-green-100 dark:bg-green-900/30 inline-block px-2 py-1 rounded">
                               {(() => {
                                  const basePrice = estimatedPrice || 0;
                                  const termMonths = discounts.agreement === "2year" ? 24 : 12;
                                  const standardTotalCost = basePrice * termMonths;
                                  
                                  let freeMonths = 0;
                                  if (discounts.agreement === "1year") freeMonths = 1;
                                  if (discounts.agreement === "2year") freeMonths = 3;
                                  
                                  const billableMonths = termMonths - freeMonths;
                                  const billableBaseCost = basePrice * billableMonths;
                                  
                                  let percentOff = 0;
                                  
                                  // Pay Full Discount Logic (Updated for Savings Badge)
                                  if (discounts.payFull) {
                                    if (discounts.agreement === "2year") {
                                      percentOff += 0.15;
                                    } else {
                                      percentOff += 0.10;
                                    }
                                  }
                                  
                                  if (discounts.veteran) percentOff += 0.05;
                                  if (discounts.senior) percentOff += 0.05;
                                  if (discounts.renter) percentOff += 0.05;
                                  
                                  const finalTotalCost = billableBaseCost * (1 - percentOff);
                                  const totalSavings = standardTotalCost - finalTotalCost;
                                  const savingsPercent = (totalSavings / standardTotalCost) * 100;
                                  
                                  return (
                                    <>
                                      Total Savings: ${totalSavings.toFixed(0)}
                                      <span className="ml-1">
                                         ({savingsPercent.toFixed(0)}% OFF)
                                      </span>
                                    </>
                                  );
                               })()}
                             </div>
                          )}
                          
                            {/* Payment Explanation */}
                            {discounts.agreement !== "none" && !discounts.payFull && (
                                <div className="text-xs text-muted-foreground mt-2 italic">
                                * Monthly payment reflects the discounted rate. You pay ${discountedMonthlyPayment.toFixed(0)} for {termMonths} months. The last {freeMonths} months are $0.
                                </div>
                            )}
                        </div>

                        {/* Right Column: Stackable Discounts Controls */}
                        <div className="bg-background border border-border p-4 rounded-xl w-full md:w-80 shadow-sm">
                           <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                             <Zap className="w-4 h-4 text-accent fill-accent" />
                             Stackable Discounts
                           </h5>
                           <div className="space-y-4">
                             {/* Agreement Term */}
                             <div className="space-y-2 pb-3 border-b border-border/50">
                               <Label className="text-xs font-bold uppercase text-muted-foreground">Service Agreement</Label>
                               <RadioGroup 
                                 value={discounts.agreement} 
                                 onValueChange={(val) => setDiscounts(prev => ({ ...prev, agreement: val }))}
                                 className="flex flex-col gap-2"
                               >
                                 <div className="flex items-center space-x-2">
                                   <RadioGroupItem value="none" id="term-none" />
                                   <Label htmlFor="term-none" className="text-sm font-medium">Month-to-Month (Standard)</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                   <RadioGroupItem value="1year" id="term-1year" />
                                   <Label htmlFor="term-1year" className="text-sm font-medium flex-1 flex justify-between">
                                     <span>1-Year Agreement</span>
                                     <span className="text-green-600 font-bold text-xs bg-green-100 px-1 rounded">1 Mo. Free</span>
                                   </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                   <RadioGroupItem value="2year" id="term-2year" />
                                   <Label htmlFor="term-2year" className="text-sm font-medium flex-1 flex justify-between">
                                     <span>2-Year Agreement</span>
                                     <span className="text-green-600 font-bold text-xs bg-green-100 px-1 rounded">3 Mo. Free</span>
                                   </Label>
                                 </div>
                               </RadioGroup>
                             </div>

                             {/* Payment Method */}
                             <div className="flex items-start space-x-3 pb-3 border-b border-border/50">
                               <Checkbox 
                                 id="discount-payFull" 
                                 checked={discounts.payFull}
                                 onCheckedChange={(c) => setDiscounts(prev => ({ ...prev, payFull: !!c }))}
                               />
                               <div className="grid gap-1.5 leading-none">
                                 <label
                                   htmlFor="discount-payFull"
                                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                 >
                                   Pay Full Term Upfront
                                   <span className="block text-[10px] text-green-600 mt-1 font-bold">Extra 10-15% OFF</span>
                                 </label>
                               </div>
                             </div>

                             {/* Discounts */}
                             <div className="space-y-2">
                               <Label className="text-xs font-bold uppercase text-muted-foreground">Service Discounts (Stackable)</Label>
                               
                               <div className="flex items-center space-x-2">
                                 <Checkbox 
                                   id="discount-veteran" 
                                   checked={discounts.veteran}
                                   onCheckedChange={(c) => setDiscounts(prev => ({ ...prev, veteran: !!c }))}
                                 />
                                 <Label htmlFor="discount-veteran" className="text-sm font-medium cursor-pointer flex-1 flex justify-between">
                                   <span>Veteran / Responder</span>
                                   <span className="text-green-600 font-bold text-xs">5% OFF</span>
                                 </Label>
                               </div>

                               <div className="flex items-center space-x-2">
                                 <Checkbox 
                                   id="discount-senior" 
                                   checked={discounts.senior}
                                   onCheckedChange={(c) => setDiscounts(prev => ({ ...prev, senior: !!c }))}
                                 />
                                 <Label htmlFor="discount-senior" className="text-sm font-medium cursor-pointer flex-1 flex justify-between">
                                   <span>Senior Citizen</span>
                                   <span className="text-green-600 font-bold text-xs">5% OFF</span>
                                 </Label>
                               </div>

                               <div className="flex items-center space-x-2">
                                 <Checkbox 
                                   id="discount-renter" 
                                   checked={discounts.renter}
                                   onCheckedChange={(c) => setDiscounts(prev => ({ ...prev, renter: !!c }))}
                                 />
                                 <Label htmlFor="discount-renter" className="text-sm font-medium cursor-pointer flex-1 flex justify-between">
                                   <span>Renter</span>
                                   <span className="text-green-600 font-bold text-xs">5% OFF</span>
                                 </Label>
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider py-6 text-lg shadow-xl mt-8">
                  Submit Request
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Explainer Video Section (Placeholder) */}
      <section className="py-20 bg-background border-t border-border">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">How To Choose Your Mission</h2>
            <div className="max-w-3xl mx-auto aspect-video bg-black/5 rounded-xl border border-border flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all">
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10"></div>
               <img src={heroMascot} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" />
               <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center z-20 shadow-xl group-hover:scale-110 transition-transform">
                 <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[24px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
               </div>
               <div className="absolute bottom-6 left-6 z-20 text-left">
                  <p className="text-white font-bold text-lg">Introduction to Lawn Trooper</p>
                  <p className="text-white/80 text-sm">Consultation Process & Plan Selection</p>
               </div>
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-primary mb-12">Field Reports</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "My yard has never looked this good. The crew is incredibly professional and the camo mowers are awesome!",
                author: "James W.",
                loc: "Huntsville, AL"
              },
              {
                text: "I love the automated billing and text updates. Total set-it-and-forget-it service. Highly recommend the Executive plan.",
                author: "Sarah T.",
                loc: "Madison, AL"
              },
              {
                text: "Finally a lawn service that actually shows up when they say they will. The weed control works wonders.",
                author: "Michael R.",
                loc: "Harvest, AL"
              }
            ].map((review, i) => (
              <div key={i} className="bg-card p-6 rounded-xl shadow-md border border-border">
                <div className="flex text-accent mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-muted-foreground italic mb-6">"{review.text}"</p>
                <div>
                  <p className="font-bold text-primary">{review.author}</p>
                  <p className="text-xs text-muted-foreground">{review.loc}</p>
                </div>
              </div>
            ))}
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
                q: "Why are you lowering prices after 25+ years?",
                a: "Short answer: AI. We use AI to cut wasted time, improve routing and scheduling, and reduce overhead. Most companies keep the savings — we pass them to you. Same quality. Smarter systems. Better prices."
              },
              {
                q: "Do I have to sign a contract?",
                a: "We offer an annual subscription service designed to keep your property pristine year-round. As a thank you for your loyalty, you receive your free months after completing the full year term. Month-to-month options are also available."
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

      {/* Referral Program */}
      <section className="py-16 bg-accent text-accent-foreground text-center">
        <div className="container mx-auto px-4">
           <div className="max-w-2xl mx-auto">
             <h2 className="text-3xl font-heading font-bold mb-4">Excellent Referral Program</h2>
             <p className="text-lg mb-8 opacity-90">Refer a neighbor and get rewarded. Help us build a stronger perimeter.</p>
             <Button variant="secondary" className="bg-background text-foreground hover:bg-background/90 font-bold px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105">
               See Referral Rewards
             </Button>
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
              <div className="space-y-4 text-primary-foreground/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 shrink-0 text-accent" />
                  <p>123 Green Valley Blvd<br/>Huntsville, AL 35801</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 shrink-0 text-accent" />
                  <p>(256) 555-0123</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 shrink-0 text-accent" />
                  <p>mission@lawntrooper.com</p>
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
