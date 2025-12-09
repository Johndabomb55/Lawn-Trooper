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
  AlertCircle
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
import mascotLogo from "@assets/generated_images/lawn_trooper_mascot_logo.png";
import camoPattern from "@assets/generated_images/subtle_camo_texture_background.png";

// Schema for the quote form
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Full street address is required"),
  contactMethod: z.enum(["text", "phone", "email", "either"], {
    required_error: "Please select a contact method",
  }),
  phone: z.string().optional(),
  email: z.string().optional(),
  yardSize: z.string().min(1, "Please select a yard size"),
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

const basicAddOns = [
  { id: "leaf_cleanup", label: "Leaf cleanup (basic)" },
  { id: "shrub_trim", label: "Light shrub trim" },
  { id: "bed_tidy", label: "Simple bed tidy-up" },
  { id: "extra_mow", label: "One-time extra mow" },
  { id: "blow_off", label: "Simple sidewalk/driveway blow-off" },
];

const premiumAddOns = [
  { id: "deep_cleanup", label: "Deep seasonal cleanup" },
  { id: "mulch_refresh", label: "Mulch refresh (beds only)" },
  { id: "hedge_shaping", label: "Hedge shaping (front yard)" },
  { id: "heavy_leaf", label: "Heavy leaf removal" },
  { id: "flower_bed", label: "Flower bed detail service" },
];

// Pricing Constants
const PRICING = {
  basic: { base: 129, increment: 25 },
  premium: { base: 199, increment: 40 },
  executive: { base: 299, increment: 60 },
};

const YARD_SIZES = [
  { value: "up-to-1/4", label: "Up to 1/4 Acre", incrementMultiplier: 0 },
  { value: "1/4-1/2", label: "1/4 - 1/2 Acre", incrementMultiplier: 1 },
  { value: "1/2-3/4", label: "1/2 - 3/4 Acre", incrementMultiplier: 2 },
  { value: "3/4-1", label: "3/4 - 1 Acre", incrementMultiplier: 3 },
  { value: "1+", label: "1+ Acre", incrementMultiplier: 4 }, // Base + 4x for starting estimate
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [discounts, setDiscounts] = useState({
    yearly: false,
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
      yardSize: "up-to-1/4", // Default size
      addOns: [],
      notes: "",
    },
  });

  const selectedPlan = form.watch("plan");
  const selectedYardSize = form.watch("yardSize");
  const selectedAddOns = form.watch("addOns");

  // Calculate Price Effect
  useEffect(() => {
    if (selectedPlan && selectedYardSize) {
      const planData = PRICING[selectedPlan as keyof typeof PRICING];
      const sizeData = YARD_SIZES.find(s => s.value === selectedYardSize);
      
      if (planData && sizeData) {
        const price = planData.base + (planData.increment * sizeData.incrementMultiplier);
        setEstimatedPrice(price);
      }
    }
  }, [selectedPlan, selectedYardSize]);

  // Calculate slots
  const calculateSlots = (currentAddOns: string[]) => {
    let slots = 0;
    currentAddOns.forEach(id => {
      if (basicAddOns.find(a => a.id === id)) slots += 1;
      if (premiumAddOns.find(a => a.id === id)) slots += 2;
    });
    return slots;
  };

  const getPlanLimits = (plan: string) => {
    switch(plan) {
      case "basic": return { maxSlots: 2, allowPremium: false, label: "Basic Patrol includes up to 2 Basic add-ons." };
      case "premium": return { maxSlots: 8, allowPremium: true, label: "You can choose up to 8 slots worth of add-ons (Basic = 1, Premium = 2)." };
      case "executive": return { maxSlots: 14, allowPremium: true, label: "You can choose up to 14 slots worth of add-ons (Basic = 1, Premium = 2)." };
      default: return { maxSlots: 0, allowPremium: false, label: "" };
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
      if (isPremium && !limits.allowPremium) {
        return; // Should be disabled anyway
      }

      const cost = isPremium ? 2 : 1;
      const currentSlots = calculateSlots(currentAddOns);
      
      if (currentSlots + cost > limits.maxSlots) {
        setSlotError(`You’ve selected the maximum add-ons included with your plan.`);
        // Clear error after 3 seconds
        setTimeout(() => setSlotError(null), 3000);
        return;
      }

      form.setValue("addOns", [...currentAddOns, id]);
    }
  };

  // Reset add-ons when plan changes to strictly incompatible ones (like premium add-ons on basic plan)
  useEffect(() => {
    const currentAddOns = form.getValues("addOns");
    if (selectedPlan === "basic") {
      // Remove any premium add-ons if switching to basic
      const validAddOns = currentAddOns.filter(id => basicAddOns.find(b => b.id === id));
      // Also check if we exceed 2 slots (2 basics)
      if (validAddOns.length > 2) {
        // Keep only first 2
        form.setValue("addOns", validAddOns.slice(0, 2));
      } else if (validAddOns.length !== currentAddOns.length) {
        form.setValue("addOns", validAddOns);
      }
    }
  }, [selectedPlan, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Mission Received! 🫡",
      description: "Your quote request has been secured. Stand by for contact from our command center.",
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

  return (
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
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: `url(${camoPattern})`, backgroundSize: '400px' }}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/0 via-background/50 to-background"></div>
        
        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-6 border border-accent/30">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Mission Ready All Year
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight text-primary mb-6">
              Set Your Yard to <span className="text-accent-foreground bg-accent/20 px-2 italic">Mission-Ready</span> and Forget About It.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              Lawn Trooper keeps your yard trimmed, clean, and sharp all season with simple, predictable subscription plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button onClick={() => scrollToSection('quote')} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider text-base h-14 px-8 shadow-lg shadow-primary/20">
                Get My Custom Yard Quote
              </Button>
              <Button onClick={() => scrollToSection('plans')} variant="outline" size="lg" className="border-primary/20 text-primary hover:bg-primary/5 font-bold uppercase tracking-wider text-base h-14 px-8">
                See Plans & Pricing
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border">
                <Shield className="w-4 h-4 text-primary" />
                <span>Over 25 Years of Service</span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span>100+ Beautification Awards</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 aspect-video md:aspect-auto md:h-[500px]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
            <img src={heroBg} alt="Perfectly manicured lawn" className="w-full h-full object-cover" />
            <div className="absolute bottom-6 left-6 z-20 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Star className="fill-accent text-accent w-5 h-5" />
                <Star className="fill-accent text-accent w-5 h-5" />
                <Star className="fill-accent text-accent w-5 h-5" />
                <Star className="fill-accent text-accent w-5 h-5" />
                <Star className="fill-accent text-accent w-5 h-5" />
              </div>
              <p className="font-medium text-sm">"My yard has never looked this sharp."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background relative border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Your Mission Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Three simple steps to a yard that commands respect.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-8 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                  <step.icon size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                <div className="absolute -top-4 -right-4 text-6xl font-heading font-bold text-muted/20 select-none">0{i+1}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="plans" className="py-24 bg-primary/5 relative">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url(${camoPattern})`, backgroundSize: '400px' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Service Deployment Levels</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Transparent pricing based on your yard size. No hidden fees.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Basic Plan */}
            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/30">
                <h3 className="text-2xl font-heading font-bold text-primary">Basic Patrol</h3>
                <p className="text-sm text-muted-foreground mt-2">Solid weekly protection for small to medium yards.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$129</span>
                  <span className="text-muted-foreground text-sm">/mo (starting)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">For up to 1/4 acre</p>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Regular Mowing & Edging</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Clean Uniforms & Pro Techs</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">2 Free</span> Off-Season Add-ons</span>
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
                  Executive Deployment <Star className="w-5 h-5 fill-accent text-accent" />
                </h3>
                <p className="text-sm text-muted-foreground mt-2">For those who never want to think about their yard again.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$299</span>
                  <span className="text-muted-foreground text-sm">/mo (starting)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">For up to 1/4 acre</p>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    <span className="font-bold text-primary">Everything in Premium +</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Priority Service Status</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Detailed Bed Care & Mulching</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">8 Total</span> Add-ons per year</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-accent-foreground font-medium">No Install Fee on 2-Year Plan</span>
                  </li>
                </ul>
                <Button onClick={() => scrollToSection('quote')} className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-bold tracking-wide">Select Executive</Button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/30">
                <h3 className="text-2xl font-heading font-bold text-primary">Premium Command</h3>
                <p className="text-sm text-muted-foreground mt-2">Enhanced care including weed control and beds.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$199</span>
                  <span className="text-muted-foreground text-sm">/mo (starting)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">For up to 1/4 acre</p>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Everything in Basic +</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Routine Weed Control</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>Light Bed Cleanup</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span><span className="font-bold">5 Total</span> Add-ons per year</span>
                  </li>
                </ul>
                <Button onClick={() => scrollToSection('quote')} variant="outline" className="w-full mt-4 border-primary/20 hover:bg-primary/5 hover:text-primary">Request Premium</Button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground bg-white/50 inline-block px-4 py-2 rounded-lg border border-border">
              <strong>Note:</strong> Prices shown are for up to 1/4 acre. Larger lots are no problem — we’ll measure and send a fast custom quote.
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
      <section id="faq" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-heading font-bold text-primary text-center mb-10">Field Intelligence (FAQ)</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: "How does billing work?", a: "We use simple monthly billing charged to your card on file. Predictable, consistent pricing all year round." },
              { q: "What if my yard is bigger than 1/4 acre?", a: "No problem. The prices listed are starting points. Select your approximate size in the quote form, and we will give you a custom adjusted rate that is just as competitive." },
              { q: "Do you use robotic mowers?", a: "Yes! In suitable yards, we deploy advanced robotic mowers for frequent maintenance cuts, supported by our human crew for edging, trimming, and detail work." },
              { q: "What if I move or need to cancel?", a: "You can cancel any time. You’ll just forfeit the free months that were scheduled at the end of your agreement." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card px-6 rounded-lg border border-border shadow-sm">
                <AccordionTrigger className="font-bold text-left hover:text-primary hover:no-underline py-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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

                {/* 2. Yard Size Selection (New Button Group) */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-heading uppercase text-primary border-b border-border pb-2">2. Confirm Yard Size</h3>
                   <FormField
                    control={form.control}
                    name="yardSize"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 md:grid-cols-5 gap-2"
                          >
                            {YARD_SIZES.map((size) => (
                              <div key={size.value} className="relative">
                                <RadioGroupItem value={size.value} id={`size-${size.value}`} className="peer sr-only" />
                                <Label
                                  htmlFor={`size-${size.value}`}
                                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary cursor-pointer h-full text-center transition-all"
                                >
                                  <span className="text-sm font-bold">{size.label}</span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    *Double-checked during consultation. We can do a video walk-through to finalize custom details!
                  </p>
                </div>

                {/* 3. Plan Selection */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-heading uppercase text-primary border-b border-border pb-2">3. Choose Your Plan</h3>
                  
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
                                <span className="text-sm text-center text-muted-foreground">Weekly mowing & edging. 2 Free add-ons.</span>
                                <span className="mt-2 text-sm font-bold text-primary">Base: $129/mo</span>
                              </Label>
                            </div>
                            
                            <div className="relative">
                              <RadioGroupItem value="premium" id="premium" className="peer sr-only" />
                              <Label
                                htmlFor="premium"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer h-full"
                              >
                                <span className="mb-2 text-lg font-bold">Premium Command</span>
                                <span className="text-sm text-center text-muted-foreground">Plus weed control & beds. 5 Total add-ons.</span>
                                <span className="mt-2 text-sm font-bold text-primary">Base: $199/mo</span>
                              </Label>
                            </div>
                            
                            <div className="relative">
                              <RadioGroupItem value="executive" id="executive" className="peer sr-only" />
                              <Label
                                htmlFor="executive"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer h-full"
                              >
                                <span className="mb-2 text-lg font-bold flex items-center gap-1">Executive <Star className="w-3 h-3 fill-accent text-accent" /></span>
                                <span className="text-sm text-center text-muted-foreground">Full service. Priority status. 8 Total add-ons.</span>
                                <span className="mt-2 text-sm font-bold text-primary">Base: $299/mo</span>
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
                    <p className="text-sm text-muted-foreground">Included in your plan.</p>
                  </div>


                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <div className="flex items-start gap-2 text-sm text-primary font-medium mb-1">
                      <Info className="w-4 h-4 mt-0.5" />
                      {getPlanLimits(selectedPlan).label}
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">
                      Basic add-ons cost 1 slot. Premium add-ons cost 2 slots. Your plan includes a certain number of slots you can use on Basic or Premium add-ons.
                    </p>
                  </div>

                  {slotError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-sm flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {slotError}
                    </motion.div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Basic Add-ons */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Basic Add-Ons (1 Slot)</h4>
                      {basicAddOns.map((addon) => (
                        <div key={addon.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={addon.id} 
                            checked={selectedAddOns.includes(addon.id)}
                            onCheckedChange={() => handleAddOnToggle(addon.id, false)}
                          />
                          <Label 
                            htmlFor={addon.id} 
                            className="text-sm font-normal cursor-pointer"
                          >
                            {addon.label}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {/* Premium Add-ons */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Premium Add-Ons (2 Slots)</h4>
                      {premiumAddOns.map((addon) => {
                        const isDisabled = !getPlanLimits(selectedPlan).allowPremium;
                        return (
                          <div key={addon.id} className={`flex items-center space-x-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Checkbox 
                              id={addon.id} 
                              checked={selectedAddOns.includes(addon.id)}
                              onCheckedChange={() => handleAddOnToggle(addon.id, true)}
                              disabled={isDisabled}
                            />
                            <Label 
                              htmlFor={addon.id} 
                              className={`text-sm font-normal ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {addon.label}
                            </Label>
                          </div>
                        );
                      })}
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
                              {(estimatedPrice * (discounts.yearly ? 12 : 1) * (1 - ((discounts.yearly ? 0.2 : 0) + (discounts.veteran ? 0.05 : 0) + (discounts.senior ? 0.05 : 0)))).toFixed(0)}
                              <span className="text-xl text-muted-foreground font-sans font-normal ml-1 self-end mb-2">
                                {discounts.yearly ? "/yr" : "/mo"}
                              </span>
                            </div>
                            {(discounts.yearly || discounts.veteran || discounts.senior) && (
                              <div className="text-sm font-bold text-muted-foreground line-through">
                                ${estimatedPrice * (discounts.yearly ? 12 : 1)}
                              </div>
                            )}
                          </div>

                          {(discounts.yearly || discounts.veteran || discounts.senior) && (
                             <div className="text-sm font-bold text-green-600 mt-2 bg-green-100 dark:bg-green-900/30 inline-block px-2 py-1 rounded">
                               Total Savings: ${(estimatedPrice * (discounts.yearly ? 12 : 1) * ((discounts.yearly ? 0.2 : 0) + (discounts.veteran ? 0.05 : 0) + (discounts.senior ? 0.05 : 0))).toFixed(0)}
                               <span className="ml-1">
                                 ({((discounts.yearly ? 20 : 0) + (discounts.veteran ? 5 : 0) + (discounts.senior ? 5 : 0))}%) OFF
                               </span>
                             </div>
                          )}
                        </div>

                        <div className="bg-background border border-border p-4 rounded-xl w-full md:w-72 shadow-sm">
                           <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                             <Zap className="w-4 h-4 text-accent fill-accent" />
                             Stackable Discounts
                           </h5>
                           <div className="space-y-3">
                             <div className="flex items-start space-x-3">
                               <Checkbox 
                                 id="discount-yearly" 
                                 checked={discounts.yearly}
                                 onCheckedChange={(c) => setDiscounts(prev => ({ ...prev, yearly: !!c }))}
                               />
                               <div className="grid gap-1.5 leading-none">
                                 <label
                                   htmlFor="discount-yearly"
                                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                 >
                                   Annual Pre-Pay
                                 </label>
                                 <p className="text-xs text-muted-foreground">Save 20% instantly</p>
                               </div>
                             </div>

                             <div className="flex items-start space-x-3">
                               <Checkbox 
                                 id="discount-veteran" 
                                 checked={discounts.veteran}
                                 onCheckedChange={(c) => setDiscounts(prev => ({ ...prev, veteran: !!c }))}
                               />
                               <div className="grid gap-1.5 leading-none">
                                 <label
                                   htmlFor="discount-veteran"
                                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                 >
                                   Veteran / Active Duty
                                 </label>
                                 <p className="text-xs text-muted-foreground">Save an extra 5%</p>
                               </div>
                             </div>

                             <div className="flex items-start space-x-3">
                               <Checkbox 
                                 id="discount-senior" 
                                 checked={discounts.senior}
                                 onCheckedChange={(c) => setDiscounts(prev => ({ ...prev, senior: !!c }))}
                               />
                               <div className="grid gap-1.5 leading-none">
                                 <label
                                   htmlFor="discount-senior"
                                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                 >
                                   Senior / Responder
                                 </label>
                                 <p className="text-xs text-muted-foreground">Save an extra 5%</p>
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2 text-center md:text-left border-t border-primary/10 pt-4">
                        Best value pricing for 2025. Savings passed directly to you through AI-driven efficiency.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-16 text-xl shadow-lg shadow-primary/25">
                  Request Quote & Lock In Offers
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By submitting, you agree to receive text/email communications about your quote. We never sell your data.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <img src={mascotLogo} alt="Lawn Trooper" className="h-12 w-12 object-contain rounded-full bg-white/10 p-1" />
              <div className="text-left">
                <h3 className="font-heading font-bold text-xl tracking-tight">LAWN TROOPER</h3>
                <p className="text-xs text-primary-foreground/70">Your Yard, Always Mission-Ready.</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm font-medium text-primary-foreground/80">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center text-xs text-primary-foreground/40">
            &copy; {new Date().getFullYear()} Lawn Trooper Landscape Maintenance. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
