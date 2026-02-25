import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Info,
  MapPin,
  Phone,
  Mail,
  Camera,
  Zap,
  Shield,
  Award,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Leaf
} from "lucide-react";
import { 
  MILITARY_RANKS, 
  LOCAL_TIPS, 
  FEATURE_FLAGS, 
  CELEBRATION_MESSAGES,
  getFeatureFlag
} from "@/data/marketing";
import {
  getApplicablePromotions,
  applyPromotions,
  validatePromoCode,
  TRUST_MESSAGES,
  PLAN_VALUE_HIGHLIGHTS,
  RECOMMENDED_ADDONS,
  type UserSelections,
} from "@/data/promotions";
import MissionAccomplished from "./MissionAccomplished";
import TrustBadge from "./TrustBadge";
import SavingsPanel from "./SavingsPanel";
import TermSelector from "./TermSelector";
import SegmentCheckboxes from "./SegmentCheckboxes";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  PLANS, 
  BASIC_ADDONS, 
  PREMIUM_ADDONS, 
  getPlanAllowance,
  getPlanAllowanceLabel,
  calculate2026Price,
  calculate2025Price,
  YARD_SIZES
} from "@/data/plans";

const STEPS = [
  { id: 1, title: "Yard Size", icon: MapPin, rank: "Recruit", rankIcon: Shield },
  { id: 2, title: "Plan", icon: Zap, rank: "Sergeant", rankIcon: Award },
  { id: 3, title: "Add-Ons", icon: Star, rank: "Commander", rankIcon: Target },
  { id: 4, title: "Contact", icon: Phone, rank: "General", rankIcon: Award },
];

// Safe UI copy layer for plan-card clarity (no wizard logic changes).
const PLAN_CARD_COPY: Record<string, { frequency: string; tagline: string; highlights: string[] }> = {
  basic: {
    frequency: "Bi-Weekly",
    tagline: "Entry-level maintenance for consistent curb appeal.",
    highlights: [
      "Bi-weekly mowing, edging, and blow-off",
      "Core weed-control program",
      "Included add-on coverage with plan selection"
    ],
  },
  premium: {
    frequency: "Weekly",
    tagline: "Weekly upkeep with stronger property presentation.",
    highlights: [
      "Weekly mowing with trim and edge finish",
      "Expanded treatment cadence",
      "Included add-on coverage with plan selection"
    ],
  },
  executive: {
    frequency: "Weekly Full-Service",
    tagline: "Top-tier weekly command with priority service standards.",
    highlights: [
      "Priority weekly full-service visits",
      "Enhanced treatment and cleanup coverage",
      "Maximum included add-on coverage"
    ],
  },
};

// Confetti particle component
const ConfettiParticle = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{ 
      left: `${x}%`,
      backgroundColor: ['#facc15', '#1a3d24', '#22c55e', '#f97316'][Math.floor(Math.random() * 4)]
    }}
    initial={{ y: 0, opacity: 1, scale: 1 }}
    animate={{ 
      y: [0, -100, 200], 
      opacity: [1, 1, 0],
      scale: [1, 1.2, 0.5],
      rotate: [0, 180, 360]
    }}
    transition={{ duration: 2, delay: delay * 0.1, ease: "easeOut" }}
  />
);

// Confetti burst component
const ConfettiBurst = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
    {Array.from({ length: 20 }).map((_, i) => (
      <ConfettiParticle key={i} delay={i} x={10 + Math.random() * 80} />
    ))}
  </div>
);

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().min(5, "Full address is required"),
  contactMethod: z.enum(["text", "phone", "email", "either"]),
  notes: z.string().optional(),
  yardSize: z.string(),
  plan: z.string(),
  basicAddons: z.array(z.string()),
  premiumAddons: z.array(z.string()),
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

interface MultiStepQuoteWizardProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function MultiStepQuoteWizard({ onClose, isModal = false }: MultiStepQuoteWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [yardSize, setYardSize] = useState("1/3");
  const [plan, setPlan] = useState("basic");
  const [basicAddons, setBasicAddons] = useState<string[]>([]);
  const [premiumAddons, setPremiumAddons] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showMissionAccomplished, setShowMissionAccomplished] = useState(false);
  
  // New state for promotions engine
  const [term, setTerm] = useState<'month-to-month' | '1-year' | '2-year'>('2-year');
  const [payUpfront, setPayUpfront] = useState(false);
  const [segments, setSegments] = useState<('renter' | 'veteran' | 'senior')[]>([]);
  const [showPromoUnlocked, setShowPromoUnlocked] = useState(false);
  const [previousAppliedCount, setPreviousAppliedCount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeStatus, setPromoCodeStatus] = useState<{ valid: boolean; discount: number; hoaName?: string } | null>(null);
  
  const [submittedQuoteData, setSubmittedQuoteData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    yardSize: string;
    plan: string;
    basicAddons: string[];
    premiumAddons: string[];
    totalPrice: number;
    term: 'month-to-month' | '1-year' | '2-year';
    payUpfront: boolean;
    segments: string[];
    appliedPromos: string[];
    promoCode?: string;
  } | null>(null);
  
  const { toast } = useToast();

  // Rotate local tips every 5 seconds
  useEffect(() => {
    if (getFeatureFlag('showLocalTipsBanner', true) && currentStep === 3) {
      const interval = setInterval(() => {
        setCurrentTipIndex(prev => (prev + 1) % LOCAL_TIPS.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      contactMethod: "email",
      notes: "",
      yardSize: yardSize,
      plan: plan,
      basicAddons: basicAddons,
      premiumAddons: premiumAddons,
    },
  });

  const selectedContactMethod = form.watch("contactMethod");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024;
    const maxFiles = 5;
    
    for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
      if (files[i].size <= maxSize) {
        validFiles.push(files[i]);
      }
    }
    
    if (files.length > maxFiles) {
      setPhotoError(`Maximum ${maxFiles} photos allowed.`);
    } else if (validFiles.length < files.length) {
      setPhotoError("Some files were too large (max 5MB each).");
    } else {
      setPhotoError(null);
    }
    
    setSelectedPhotos(validFiles);
  };

  const filesToBase64 = async (files: File[]): Promise<{name: string, data: string, type: string}[]> => {
    return Promise.all(files.map(file => {
      return new Promise<{name: string, data: string, type: string}>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            name: file.name,
            data: reader.result as string,
            type: file.type
          });
        };
        reader.readAsDataURL(file);
      });
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      // Trigger confetti and celebration message
      if (getFeatureFlag('showConfetti', true)) {
        setShowConfetti(true);
        const messages = [
          CELEBRATION_MESSAGES.step1Complete,
          CELEBRATION_MESSAGES.step2Complete,
          CELEBRATION_MESSAGES.step3Complete,
        ];
        setCelebrationMessage(messages[currentStep - 1] || null);
        
        setTimeout(() => {
          setShowConfetti(false);
          setCelebrationMessage(null);
        }, 2500);
      }
      
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAddons = () => {
    setBasicAddons([]);
    setPremiumAddons([]);
  };

  const handleBasicAddonToggle = (addonId: string) => {
    setBasicAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handlePremiumAddonToggle = (addonId: string) => {
    setPremiumAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const photos = selectedPhotos.length > 0 ? await filesToBase64(selectedPhotos) : [];
      
      const submitData = {
        ...values,
        yardSize,
        plan,
        basicAddons,
        premiumAddons,
        photos
      };
      
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      // Also capture lead data (fire and forget - don't block on this)
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email || null,
          phone: values.phone || null,
          address: values.address,
          contactMethod: values.contactMethod,
          yardSize,
          plan,
          basicAddons,
          premiumAddons,
          notes: values.notes || null,
          totalPrice: String(totalPrice),
          term,
          payUpfront: String(payUpfront),
          segments,
          appliedPromos: promotionResult.applied.map(p => p.title),
          promoCode: promoCodeStatus?.valid ? promoCode : null,
        }),
      }).catch(err => console.error('Lead capture error:', err));

      if (data.success) {
        // Store the quote data for the confirmation page
        setSubmittedQuoteData({
          name: values.name,
          email: values.email || "",
          phone: values.phone || "",
          address: values.address,
          yardSize,
          plan,
          basicAddons,
          premiumAddons,
          totalPrice,
          term,
          payUpfront,
          segments,
          appliedPromos: promotionResult.applied.map(p => p.title),
          promoCode: promoCodeStatus?.valid ? promoCode : undefined,
        });
        
        // Show the Mission Accomplished page
        setShowMissionAccomplished(true);
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (error) {
      toast({
        title: "Transmission Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const planData = PLANS.find(p => p.id === plan);
  const allowance = getPlanAllowance(plan, 0, payUpfront);
  const tableBasicAllowance = getPlanAllowance("basic", 0, payUpfront);
  const tablePremiumAllowance = getPlanAllowance("premium", 0, payUpfront);
  const tableExecutiveAllowance = getPlanAllowance("executive", 0, payUpfront);
  const planPrice = calculate2026Price(plan, yardSize);
  const extraBasicCount = Math.max(0, basicAddons.length - allowance.basic);
  const extraPremiumCount = Math.max(0, premiumAddons.length - allowance.premium);
  const extraCost = (extraBasicCount * 20) + (extraPremiumCount * 40);
  const baseMonthlyTotal = planPrice + extraCost;

  // Calculate promotions
  const userSelections: UserSelections = {
    term,
    payUpfront,
    segments,
    hasReferral: false, // Will be true when referral system is implemented
    monthlyTotal: baseMonthlyTotal,
    promoCode: promoCodeStatus?.valid ? promoCode : undefined,
  };
  
  const promotionResult = getApplicablePromotions(userSelections);
  const appliedTotals = applyPromotions({ monthlyTotal: baseMonthlyTotal, term }, promotionResult);
  const totalPrice = appliedTotals.displayedMonthly;

  // Detect when a new promo is unlocked for animation
  useEffect(() => {
    if (promotionResult.applied.length > previousAppliedCount) {
      setShowPromoUnlocked(true);
      if (getFeatureFlag('showConfetti', true)) {
        setShowConfetti(true);
        toast({
          title: "Discount Unlocked!",
          description: promotionResult.applied[promotionResult.applied.length - 1]?.title,
        });
        setTimeout(() => setShowConfetti(false), 2000);
      }
      setTimeout(() => setShowPromoUnlocked(false), 1500);
    }
    setPreviousAppliedCount(promotionResult.applied.length);
  }, [promotionResult.applied.length]);

  // Check if add-on requirements are met
  const addonsRequirementMet = basicAddons.length >= allowance.basic && premiumAddons.length >= allowance.premium;
  const canProceedFromStep3 = !getFeatureFlag('requireAddons', true) || addonsRequirementMet;

  // Summary card component for reuse
  const SelectionSummaryCard = ({ showAddonsDetail = false }: { showAddonsDetail?: boolean }) => (
    <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
        <div>
          <div className="text-xs text-muted-foreground uppercase font-bold">Yard</div>
          <div className="font-bold text-primary">{YARD_SIZES.find(y => y.id === yardSize)?.label}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase font-bold">Plan</div>
          <div className="font-bold text-primary">{planData?.name}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase font-bold">Add-ons</div>
          <div className="font-bold text-primary">{basicAddons.length}B + {premiumAddons.length}P</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase font-bold">Total</div>
          <div className="font-bold text-primary text-lg">${totalPrice}/mo</div>
        </div>
      </div>
      {showAddonsDetail && (basicAddons.length > 0 || premiumAddons.length > 0) && (
        <div className="mt-3 pt-3 border-t border-primary/10 text-sm">
          <div className="font-semibold text-primary mb-2">Selected Add-ons:</div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {basicAddons.map(id => {
              const addon = BASIC_ADDONS.find(a => a.id === id);
              return addon ? (
                <span key={id} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {addon.label}
                </span>
              ) : null;
            })}
            {premiumAddons.map(id => {
              const addon = PREMIUM_ADDONS.find(a => a.id === id);
              return addon ? (
                <span key={id} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-accent" />{addon.label}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );

  // Reset function for after submission
  const resetForm = () => {
    form.reset();
    setCurrentStep(1);
    setYardSize("1/3");
    setPlan("basic");
    setBasicAddons([]);
    setPremiumAddons([]);
    setSelectedPhotos([]);
    setSubmittedQuoteData(null);
    setShowMissionAccomplished(false);
    setTerm('2-year');
    setPayUpfront(false);
    setSegments([]);
    setPreviousAppliedCount(0);
  };

  // If showing Mission Accomplished, render that instead
  if (showMissionAccomplished && submittedQuoteData) {
    return (
      <MissionAccomplished
        quoteData={submittedQuoteData}
        onClose={() => {
          setShowMissionAccomplished(false);
          if (onClose) onClose();
        }}
        onReset={resetForm}
      />
    );
  }

  // Mission Ready indicator
  const getAddOnInstructionText = () => {
    if (plan === "basic") {
      return "Basic Plan includes 1 included add-on. Choose your included service below.";
    }
    if (plan === "premium") {
      return `Premium Plan includes ${allowance.basic} Basic and ${allowance.premium} Premium included add-ons.`;
    }
    return `Executive Command includes ${allowance.basic} Basic and ${allowance.premium} Premium included add-ons.`;
  };

  const MissionReadyIndicator = () => (
    <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-bold ${
      addonsRequirementMet 
        ? 'bg-green-100 text-green-700 border border-green-300' 
        : 'bg-amber-50 text-amber-700 border border-amber-200'
    }`}>
      {addonsRequirementMet ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>Mission Ready</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4" />
          <span>{getAddOnInstructionText()}</span>
        </>
      )}
    </div>
  );

  return (
    <div className={`bg-card rounded-2xl shadow-2xl border-2 border-primary/30 relative ${isModal ? '' : ''}`}>
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && <ConfettiBurst />}
      </AnimatePresence>

      {/* Celebration Message */}
      <AnimatePresence>
        {celebrationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-40 bg-accent text-accent-foreground text-center py-2 px-4 text-sm font-bold rounded-t-2xl flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {celebrationMessage}
            <Sparkles className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Badge at Top */}
      <div className="bg-green-50 px-4 py-2 border-b border-green-200">
        <TrustBadge variant="compact" message={TRUST_MESSAGES.ctaTop} />
      </div>

      {/* Progress Header with Military Ranks */}
      <div className="bg-primary text-primary-foreground p-4 md:p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-wider">Get Your Instant Quote</h3>
            <p className="text-xs text-primary-foreground/70 mt-1">
              Rank: <span className="font-bold text-accent">{STEPS[currentStep - 1]?.rank}</span>
            </p>
          </div>
          {isModal && onClose && (
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">&times;</button>
          )}
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  disabled={step.id > currentStep}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    isCompleted ? 'opacity-100 cursor-pointer' : 
                    isCurrent ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-accent text-accent-foreground' : 'bg-white/20'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-sm font-extrabold">{step.id}</span>}
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-center leading-tight">
                    {`Step ${step.id}: ${step.title}`}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-white/20'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-4 md:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Yard Size */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-primary mb-2">Select Your Yard Size</h4>
                    <p className="text-muted-foreground">Choose the option that best matches your property</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
                    {YARD_SIZES.map((size) => (
                      <button
                        key={size.id}
                        type="button"
                        data-testid={`wizard-yard-${size.id}`}
                        onClick={() => setYardSize(size.id)}
                        className={`p-6 rounded-xl border-2 transition-all text-center w-full max-w-xs ${
                          yardSize === size.id
                            ? 'border-primary bg-primary/10 shadow-lg scale-105'
                            : 'border-border hover:border-primary/50 bg-muted/30 hover:scale-102'
                        }`}
                      >
                        <div className="text-2xl font-bold text-primary">{size.label}</div>
                        <div className="text-lg text-muted-foreground">{size.subtitle}</div>
                        <div className="text-xs text-muted-foreground mt-2">{size.id} Acre</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Plan Tier */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-primary mb-2">Choose Your Total Maintenance Plan</h4>
                    <p className="text-muted-foreground">One-stop exterior maintenance with full lawn coverage.</p>
                  </div>

                  {/* Compact Plan Comparison */}
                  <div className="bg-muted/30 rounded-xl p-4 border border-border mb-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-2 text-muted-foreground font-medium">Feature</th>
                          <th className="text-center py-2 px-2 font-bold text-primary">Basic</th>
                          <th className="text-center py-2 px-2 font-bold text-primary">Premium</th>
                          <th className="text-center py-2 px-2 font-bold text-accent">Executive</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2 pr-2 text-muted-foreground">Mowing</td>
                          <td className="py-2 px-2 text-center">Bi-Weekly</td>
                          <td className="py-2 px-2 text-center font-medium text-primary">Weekly</td>
                          <td className="py-2 px-2 text-center font-bold text-accent">Weekly</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 pr-2 text-muted-foreground">Weed Control</td>
                          <td className="py-2 px-2 text-center">2 Apps</td>
                          <td className="py-2 px-2 text-center font-medium text-primary">4 Apps</td>
                          <td className="py-2 px-2 text-center font-bold text-accent">6 Apps</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 pr-2 text-muted-foreground">Flower Bed Weed Control</td>
                          <td className="py-2 px-2 text-center">Included</td>
                          <td className="py-2 px-2 text-center font-medium text-primary">Included</td>
                          <td className="py-2 px-2 text-center font-bold text-accent">Included</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 pr-2 text-muted-foreground">Bush Trimming</td>
                          <td className="py-2 px-2 text-center">1x/Year</td>
                          <td className="py-2 px-2 text-center">2x/Year</td>
                          <td className="py-2 px-2 text-center font-bold text-accent">3x/Year</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2 text-muted-foreground">Add-ons Included</td>
                          <td className="py-2 px-2 text-center">{tableBasicAllowance.basic + tableBasicAllowance.premium}</td>
                          <td className="py-2 px-2 text-center font-medium text-primary">{tablePremiumAllowance.basic + tablePremiumAllowance.premium}</td>
                          <td className="py-2 px-2 text-center font-bold text-accent">{tableExecutiveAllowance.basic + tableExecutiveAllowance.premium}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PLANS.map((p) => {
                      const price2026 = calculate2026Price(p.id, yardSize);
                      const price2025 = calculate2025Price(p.id, yardSize);
                      const isExecutive = p.id === 'executive';
                      const isSelected = plan === p.id;
                      const cardCopy = PLAN_CARD_COPY[p.id] || PLAN_CARD_COPY.basic;
                      
                      return (
                        <button
                          key={p.id}
                          type="button"
                          data-testid={`wizard-plan-${p.id}`}
                          onClick={() => {
                            setPlan(p.id);
                            resetAddons();
                          }}
                          className={`p-5 rounded-xl transition-all text-left relative ${
                            isExecutive 
                              ? `border-3 border-accent bg-gradient-to-br from-accent/10 to-accent/5 shadow-xl ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`
                              : isSelected
                                ? 'border-2 border-primary bg-primary/10 shadow-lg'
                                : 'border-2 border-border hover:border-primary/50 bg-muted/30'
                          }`}
                        >
                          {isExecutive && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                              Command Tier
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <h5 className={`font-bold ${isExecutive ? 'text-xl' : 'text-lg'}`}>{p.name}</h5>
                            {isExecutive && <Star className="w-5 h-5 fill-accent text-accent" />}
                          </div>
                          <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-primary/90">
                            {cardCopy.frequency}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{cardCopy.tagline}</p>
                          <div className="mt-2">
                            <div className="text-xs text-muted-foreground line-through">
                              2025: ${price2025}/mo
                            </div>
                            <div className={`font-bold text-primary ${isExecutive ? 'text-3xl' : 'text-2xl'}`}>
                              ${price2026}
                              <span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </div>
                            <div className="text-xs text-green-600 font-semibold">2026 AI-Savings</div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">{getPlanAllowanceLabel(p.id, 0, payUpfront)}</div>
                          <ul className="mt-3 space-y-1">
                            {cardCopy.highlights.map((highlight) => (
                              <li key={highlight} className="text-xs text-foreground/85 flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-[1px]" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <Check className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Plan Features Preview with Value Highlights */}
                  {planData && (
                    <div className="bg-muted/30 rounded-xl p-4 border border-border mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-primary">{planData.name} Features:</h5>
                        {plan === 'premium' && (
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <ul className="grid md:grid-cols-2 gap-1 text-sm">
                        {planData.features.slice(0, 6).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
                            <span dangerouslySetInnerHTML={{ __html: feature.split('<br/>')[0] }} />
                          </li>
                        ))}
                      </ul>
                      {/* Value Highlights for Premium/Executive */}
                      {(plan === 'premium' || plan === 'executive') && PLAN_VALUE_HIGHLIGHTS[plan] && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="text-xs font-bold text-accent mb-1">Value Highlights:</div>
                          <ul className="text-xs space-y-1">
                            {PLAN_VALUE_HIGHLIGHTS[plan].map((highlight, i) => (
                              <li key={i} className="flex items-center gap-1 text-green-700">
                                <Sparkles className="w-3 h-3" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* Upgrade Impact for Basic */}
                      {plan === 'basic' && (
                        <div className="mt-3 pt-3 border-t border-border text-center">
                          <p className="text-xs text-muted-foreground">
                            Upgrade to <span className="font-bold text-primary">Premium</span> for about 
                            <span className="font-bold text-accent"> +${calculate2026Price('premium', yardSize) - calculate2026Price('basic', yardSize)}/mo</span> more
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Term Selector */}
                  <TermSelector
                    term={term}
                    payUpfront={payUpfront}
                    onTermChange={setTerm}
                    onPayUpfrontChange={setPayUpfront}
                  />

                  {/* Savings Panel */}
                  <SavingsPanel
                    baseMonthly={baseMonthlyTotal}
                    promotionResult={promotionResult}
                    appliedTotals={appliedTotals}
                    term={term}
                    showUnlockedAnimation={showPromoUnlocked}
                  />
                </motion.div>
              )}

              {/* Step 3: Add-ons */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-4">
                    <h4 className="text-2xl font-bold text-primary mb-2">Select Add-on Services</h4>
                    <p className="text-muted-foreground">
                      {planData?.name} includes {allowance.basic} Basic + {allowance.premium} Premium add-ons
                    </p>
                    <p className="text-sm text-accent font-semibold mt-2 bg-accent/10 inline-block px-3 py-1 rounded-full">
                      {getAddOnInstructionText()}
                    </p>
                  </div>

                  {/* Basic Add-ons */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-primary">Basic Add-ons</h5>
                      <span className="text-sm text-muted-foreground">
                        {basicAddons.length}/{allowance.basic} included
                        {extraBasicCount > 0 && <span className="text-accent ml-1">(+{extraBasicCount} extra @ $20/mo each)</span>}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] md:max-h-none overflow-y-auto md:overflow-visible">
                      {BASIC_ADDONS.map((addon) => {
                        const isSelected = basicAddons.includes(addon.id);
                        return (
                          <Label
                            key={addon.id}
                            className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                              isSelected 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <Checkbox 
                              checked={isSelected} 
                              onCheckedChange={() => handleBasicAddonToggle(addon.id)} 
                            />
                            <span className="text-sm font-medium">{addon.label}</span>
                          </Label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Premium Add-ons */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h5 className="font-bold text-accent flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent" /> Premium Add-ons
                      </h5>
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {premiumAddons.length}/{allowance.premium} included
                        {extraPremiumCount > 0 && <span className="text-accent ml-1">(+{extraPremiumCount} extra)</span>}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] md:max-h-none overflow-y-auto md:overflow-visible">
                      {PREMIUM_ADDONS.map((addon) => {
                        const isSelected = premiumAddons.includes(addon.id);
                        return (
                          <Label
                            key={addon.id}
                            className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                              isSelected 
                                ? 'border-accent bg-accent/10' 
                                : 'border-border hover:border-accent/50'
                            }`}
                          >
                            <Checkbox 
                              checked={isSelected} 
                              onCheckedChange={() => handlePremiumAddonToggle(addon.id)} 
                            />
                            <span className="text-sm font-medium">{addon.label}</span>
                          </Label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 text-center">
                    <div className="text-sm text-muted-foreground">Your Monthly Total</div>
                    <div className="text-4xl font-extrabold text-primary">${totalPrice}/mo</div>
                    <div className="text-xs text-muted-foreground">Includes AI-Savings Discount</div>
                    {extraCost > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Base ${planPrice} + ${extraCost} extra add-ons
                      </div>
                    )}
                  </div>

                  {/* Mission Ready Indicator */}
                  <div className="flex justify-center">
                    <MissionReadyIndicator />
                  </div>

                  {/* Selection Summary Card */}
                  <SelectionSummaryCard showAddonsDetail={true} />

                  {/* Local Tips Banner */}
                  {getFeatureFlag('showLocalTipsBanner', true) && (
                    <motion.div 
                      key={currentTipIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-full p-2 shrink-0">
                          <Leaf className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-green-800 font-medium">
                            {LOCAL_TIPS[currentTipIndex]?.tip}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            — {LOCAL_TIPS[currentTipIndex]?.source}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Contact Info */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-4">
                    <h4 className="text-2xl font-bold text-primary mb-2">Your Contact Details</h4>
                    <p className="text-muted-foreground">An account manager will reach out to schedule a good time for your FREE property walk-through.</p>
                  </div>

                  {/* Trust Badge */}
                  <TrustBadge variant="full" message={TRUST_MESSAGES.contactStep} />

                  {/* Segment Checkboxes for Discounts */}
                  <SegmentCheckboxes
                    segments={segments}
                    onSegmentChange={setSegments}
                  />

                  {/* Promo Code Field */}
                  <div className="bg-muted/30 rounded-xl p-4 border border-border">
                    <div className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      HOA Partner Code (optional)
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Reminder: partnered HOA residents receive <span className="font-bold text-primary">10% off</span>. If your HOA is not partnered yet,{" "}
                      <a href="#hoa-partnership" className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80">
                        open the HOA partner form
                      </a>.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoCodeStatus(null);
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (promoCode.trim()) {
                            const result = validatePromoCode(promoCode);
                            setPromoCodeStatus(result);
                            if (result.valid) {
                              toast({
                                title: "Code Applied!",
                                description: `${result.hoaName} partner discount: ${result.discount}% off`,
                              });
                            } else {
                              toast({
                                title: "Invalid Code",
                                description: "This promo code is not recognized.",
                                variant: "destructive",
                              });
                            }
                          }
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                    {promoCodeStatus && (
                      <div className={`mt-2 text-xs flex items-center gap-1 ${promoCodeStatus.valid ? 'text-green-600' : 'text-red-500'}`}>
                        {promoCodeStatus.valid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            {promoCodeStatus.hoaName} partner discount applied: {promoCodeStatus.discount}% off
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            Invalid promo code
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Summary Card */}
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 mb-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-bold">Yard</div>
                        <div className="font-bold text-primary">{YARD_SIZES.find(y => y.id === yardSize)?.label}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-bold">Plan</div>
                        <div className="font-bold text-primary">{planData?.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-bold">Total</div>
                        <div className="font-bold text-primary text-xl">${totalPrice}/mo</div>
                      </div>
                    </div>
                    {(basicAddons.length > 0 || premiumAddons.length > 0) && (
                      <div className="mt-3 pt-3 border-t border-primary/10 text-sm">
                        <div className="font-semibold text-primary mb-2">Selected Add-ons:</div>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {basicAddons.map(id => {
                            const addon = BASIC_ADDONS.find(a => a.id === id);
                            return addon ? (
                              <span key={id} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                {addon.label}
                              </span>
                            ) : null;
                          })}
                          {premiumAddons.map(id => {
                            const addon = PREMIUM_ADDONS.find(a => a.id === id);
                            return addon ? (
                              <span key={id} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3 fill-accent" />{addon.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
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
                            <Input placeholder="123 Maple Ave, Huntsville, AL 35801" {...field} />
                          </FormControl>
                          <FormDescription>Include City and Zip Code</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contactMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Contact <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white border-2 border-border">
                                  <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                <SelectItem value="text">Text Message</SelectItem>
                                <SelectItem value="phone">Phone Call</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="either">Either</SelectItem>
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
                              Phone {(selectedContactMethod === "text" || selectedContactMethod === "phone") && <span className="text-red-500">*</span>}
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email {selectedContactMethod === "email" && <span className="text-red-500">*</span>}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Photo Upload */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Yard Photos (Optional)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        For the fastest estimate, upload 4 photos: front, back, left side, and right side of the property.
                      </p>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="cursor-pointer bg-white border-2 border-border" 
                        onChange={handlePhotoChange}
                      />
                      {selectedPhotos.length > 0 && (
                        <p className="text-xs text-green-600 font-medium">
                          {selectedPhotos.length} photo(s) selected
                        </p>
                      )}
                      {photoError && <p className="text-xs text-amber-600">{photoError}</p>}
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Gate codes, pet info, special requests..." 
                              className="resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          <div className="border-t border-border p-4 md:p-6 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 3 && !canProceedFromStep3}
                className={`flex items-center gap-2 ${
                  currentStep === 3 && !canProceedFromStep3 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-6 text-lg font-bold uppercase tracking-wider"
                style={{ backgroundColor: '#1a3d24', color: 'white' }}
              >
                {isSubmitting ? "Transmitting..." : "Get Instant Quote"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
