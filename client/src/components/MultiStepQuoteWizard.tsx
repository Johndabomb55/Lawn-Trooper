import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
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
  AlertCircle,
  CheckCircle2,
  Leaf
} from "lucide-react";
import PlanBadge from "@/components/PlanBadge";
import UpgradeDetails from "@/components/UpgradeDetails";
import { 
  MILITARY_RANKS, 
  LOCAL_TIPS, 
  FEATURE_FLAGS, 
  getFeatureFlag
} from "@/data/marketing";
import {
  getApplicablePromotions,
  applyPromotions,
  TRUST_MESSAGES,
  PLAN_VALUE_HIGHLIGHTS,
  RECOMMENDED_ADDONS,
  type UserSelections,
} from "@/data/promotions";
import MissionAccomplished from "./MissionAccomplished";
import TrustBadge from "./TrustBadge";
import SavingsPanel from "./SavingsPanel";
import TermSelector from "./TermSelector";
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
  ADDON_CATALOG,
  getPlanAllowance,
  getPlanAllowanceLabel,
  getSwapOptions,
  EXECUTIVE_PLUS,
  calculate2026Price,
  YARD_SIZES,
  calculateOverageCost
} from "@/data/plans";

const STEPS = [
  { id: 1, title: "Yard Size", icon: MapPin, rank: "Recruit", rankIcon: Shield },
  { id: 2, title: "Plan", icon: Zap, rank: "Sergeant", rankIcon: Award },
  { id: 3, title: "Upgrades", icon: Star, rank: "Commander", rankIcon: Target },
  { id: 4, title: "Contact", icon: Phone, rank: "General", rankIcon: Award },
];

const PLAN_CARD_COPY: Record<string, { description: string; included: string }> = {
  basic: {
    description: "Reliable maintenance for smaller properties.",
    included: "Includes 3 Basic upgrades",
  },
  premium: {
    description: "More complete property care.",
    included: "Includes 3 Basic upgrades + 1 Premium upgrade",
  },
  executive: {
    description: "Top-tier property care.",
    included: "Includes 3 Basic upgrades + 2 Premium upgrades",
  },
};

const getAddonName = (id: string) => ADDON_CATALOG.find((a) => a.id === id)?.name ?? id;
const formatUpgradeMix = (basic: number, premium: number): string => {
  const basicLabel = `${basic} Basic upgrade${basic === 1 ? "" : "s"}`;
  if (premium <= 0) return basicLabel;
  const premiumLabel = `${premium} Premium upgrade${premium === 1 ? "" : "s"}`;
  return `${basicLabel} and ${premiumLabel}`;
};
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

const BASIC_UPGRADE_EXAMPLES = [
  "Shrub / hedge trimming",
  "Seasonal mulch refresh",
  "Quarterly trash can cleaning",
  "Gutter cleaning",
  "Mosquito control",
  "Additional weed control & fertilization"
];

const PREMIUM_UPGRADE_EXAMPLES = [
  "Pressure-wash package",
  "House soft wash",
  "Aeration & dethatching",
  "Seasonal lighting",
  "Tree trimming",
  "Full yard cleanout"
];

function UpgradeFlexibilitySection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4" data-testid="upgrade-flexibility-section">
      <div className="text-center mb-2">
        <h5 className="text-sm font-bold text-primary">Flexible Upgrade System</h5>
        <p className="text-xs text-muted-foreground">Choose the services your yard needs most.</p>
      </div>
      <button
        type="button"
        data-testid="upgrade-examples-toggle"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mx-auto mt-1"
      >
        <Info className="w-3.5 h-3.5" />
        View upgrade examples
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-background/80 rounded-lg p-3 border border-border">
            <h6 className="text-xs font-bold text-primary mb-2">Basic upgrades may include</h6>
            <ul className="space-y-1">
              {BASIC_UPGRADE_EXAMPLES.map((ex) => (
                <li key={ex} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary/60 mt-0.5">•</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-background/80 rounded-lg p-3 border border-border">
            <h6 className="text-xs font-bold text-accent mb-2">Premium upgrades may include</h6>
            <ul className="space-y-1">
              {PREMIUM_UPGRADE_EXAMPLES.map((ex) => (
                <li key={ex} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-accent/60 mt-0.5">•</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="mt-3 text-center">
        <p className="text-xs font-medium text-primary/80">2 Basic upgrades can be exchanged for 1 Premium upgrade.</p>
      </div>
    </div>
  );
}

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
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showMissionAccomplished, setShowMissionAccomplished] = useState(false);
  
  const [swapCount, setSwapCount] = useState(0);
  const [executivePlus, setExecutivePlus] = useState(false);
  
  const [term, setTerm] = useState<'1-year' | '2-year'>('2-year');
  const [payUpfront, setPayUpfront] = useState(false);
  const [segments, setSegments] = useState<('renter' | 'veteran' | 'senior')[]>([]);
  const [clientCode, setClientCode] = useState("");
  
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
    term: '1-year' | '2-year';
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
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const setDefaultAddonsForPlan = (planId: string) => {
    const rec = RECOMMENDED_ADDONS[planId];
    if (rec) {
      setBasicAddons(rec.basic);
      setPremiumAddons(rec.premium);
    } else {
      setBasicAddons([]);
      setPremiumAddons([]);
    }
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
        clientCode: clientCode || null,
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
          promoCode: clientCode || null,
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
          promoCode: clientCode || undefined,
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
  const swapOptions = getSwapOptions(plan, new Date(), executivePlus);
  const allowance = getPlanAllowance(plan, swapCount, payUpfront, new Date(), executivePlus);
  let planPrice = calculate2026Price(plan, yardSize);
  if (executivePlus && plan === 'executive') {
    const yardMultiplier = YARD_SIZES.find(y => y.id === yardSize)?.multiplier ?? 1.0;
    planPrice += Math.round(EXECUTIVE_PLUS.price * yardMultiplier);
  }
  const extraBasicCount = Math.max(0, basicAddons.length - allowance.basic);
  const extraPremiumCount = Math.max(0, premiumAddons.length - allowance.premium);
  const { totalOverage } = calculateOverageCost(
    basicAddons.length,
    premiumAddons.length,
    allowance.basic,
    allowance.premium
  );
  const baseMonthlyTotal = planPrice + totalOverage;

  // Calculate promotions
  const userSelections: UserSelections = {
    term,
    payUpfront,
    segments,
    hasReferral: false, // Will be true when referral system is implemented
    monthlyTotal: baseMonthlyTotal,
  };
  
  const promotionResult = getApplicablePromotions(userSelections);
  const appliedTotals = applyPromotions({ monthlyTotal: baseMonthlyTotal, term }, promotionResult);
  const totalPrice = appliedTotals.displayedMonthly;


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
          <div className="text-xs text-muted-foreground uppercase font-bold">Upgrades</div>
          <div className="font-bold text-primary">{basicAddons.length}B + {premiumAddons.length}P</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase font-bold">Total</div>
          <div className="font-bold text-primary text-lg">${totalPrice}/mo</div>
        </div>
      </div>
      {showAddonsDetail && (basicAddons.length > 0 || premiumAddons.length > 0) && (
        <div className="mt-3 pt-3 border-t border-primary/10 text-sm">
          <div className="font-semibold text-primary mb-2">Selected Upgrades:</div>
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
      return "Choose your 3 Basic upgrades.";
    }
    if (plan === "premium") {
      return "Choose your 3 Basic upgrades and 1 Premium upgrade.";
    }
    return "Choose your 3 Basic upgrades and 2 Premium upgrades.";
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
      {/* Trust Badge at Top */}
      <div className="bg-green-50 px-4 py-2 border-b border-green-200">
        <TrustBadge variant="compact" message={TRUST_MESSAGES.ctaTop} />
      </div>

      {/* Progress Header with Military Ranks */}
      <div className="bg-primary text-primary-foreground p-4 md:p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-wider">See Your Instant Price</h3>
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
                    <h4 className="text-2xl font-bold text-primary mb-2">Choose Plan</h4>
                    <p className="text-muted-foreground">Select the service level that fits your property.</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Licensed • Insured • 25+ Years Serving North Alabama</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PLANS.map((p) => {
                      const startingPrice = p.price;
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
                            setSwapCount(0);
                            if (p.id !== 'executive') setExecutivePlus(false);
                            setDefaultAddonsForPlan(p.id);
                          }}
                          className={`p-5 rounded-xl transition-all text-left relative flex flex-col items-start h-full justify-start ${
                            isExecutive 
                              ? `border-3 ${isSelected ? 'border-accent ring-2 ring-accent/40 ring-offset-2 shadow-2xl bg-gradient-to-br from-accent/15 to-accent/5' : 'border-accent/60 bg-gradient-to-br from-accent/10 to-accent/5 shadow-xl hover:border-accent'}`
                              : isSelected
                                ? 'border-2 border-primary bg-primary/10 shadow-xl ring-2 ring-primary/30 ring-offset-2'
                                : 'border-2 border-border hover:border-primary/50 bg-muted/30'
                          }`}
                        >
                          {(isExecutive || p.id === 'premium') && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <PlanBadge planId={p.id} />
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Selected
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <h5 className={`font-bold ${isExecutive ? 'text-xl' : 'text-lg'}`}>{p.name}</h5>
                            {isExecutive && <Star className="w-5 h-5 fill-accent text-accent" />}
                          </div>
                          <div className="mt-1 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-accent">25-Year Client Rewards</span>
                          </div>
                          <p className="text-sm font-bold text-primary mt-2">Starting at ${startingPrice}/mo</p>
                          <p className="text-xs text-muted-foreground mt-1">{cardCopy.description}</p>
                          <div className="mt-3 text-xs text-foreground/85 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                            <span className="font-medium">{cardCopy.included}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Upgrade Flexibility Section */}
                  <UpgradeFlexibilitySection />

                  {/* Executive+ Toggle */}
                  {plan === 'executive' && (
                    <button
                      type="button"
                      data-testid="wizard-executive-plus-toggle"
                      onClick={() => {
                        const next = !executivePlus;
                        setExecutivePlus(next);
                        setSwapCount(0);
                        setDefaultAddonsForPlan(next ? "executive+" : "executive");
                      }}
                      className={`w-full mt-4 p-3 rounded-lg border-2 transition-all text-left ${
                        executivePlus
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm flex items-center gap-2">
                            <Star className="w-4 h-4 text-accent" />
                            {EXECUTIVE_PLUS.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {EXECUTIVE_PLUS.description} — +1 Basic, +1 Premium upgrade
                          </div>
                          <div className="text-xs text-accent/80 mt-1">
                            {EXECUTIVE_PLUS.perks.join(' • ')}
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          executivePlus ? 'border-accent bg-accent' : 'border-muted-foreground/30'
                        }`}>
                          {executivePlus && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Upgrade upsell for Basic only — features shown in table above */}
                  {planData && plan === 'basic' && (
                    <div className="bg-muted/30 rounded-xl p-4 border border-border mt-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                          Upgrade to <span className="font-bold text-primary">Premium</span> for about
                          <span className="font-bold text-accent"> +${calculate2026Price('premium', yardSize) - calculate2026Price('basic', yardSize)}/mo</span> more
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Savings Panel */}
                  <SavingsPanel
                    baseMonthly={baseMonthlyTotal}
                    promotionResult={promotionResult}
                    appliedTotals={appliedTotals}
                    term={term}
                    payUpfront={payUpfront}
                    showUnlockedAnimation={false}
                  />
                </motion.div>
              )}

              {/* Step 3: Upgrades */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-4">
                    <h4 className="text-2xl font-bold text-primary mb-2">Choose Your Upgrades</h4>
                    <p className="text-muted-foreground">
                      Choose the upgrades that fit your property best.
                    </p>
                    <p className="text-sm text-primary font-semibold mt-2">{getAddOnInstructionText()}</p>
                    {planData?.allowsSwap && (
                      <p className="text-xs text-muted-foreground mt-1">2 Basic upgrades can be exchanged for 1 Premium upgrade.</p>
                    )}
                  </div>

                  {/* Upgrade Conversion (Swap) - premium/executive plans */}
                  {planData?.allowsSwap && swapOptions.length > 1 && (
                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm">Upgrade Conversion</div>
                          <div className="text-xs text-muted-foreground">2 Basic upgrades can be exchanged for 1 Premium upgrade</div>
                        </div>
                        <div className="text-right text-xs">
                          <div className="font-bold text-primary">{allowance.basic}B</div>
                          <div className="font-bold text-accent">{allowance.premium}P</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {swapOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            data-testid={`wizard-swap-btn-${opt.value}`}
                            onClick={() => {
                              setSwapCount(opt.value);
                              const newAllowance = getPlanAllowance(plan, opt.value, false, new Date(), executivePlus);
                              if (premiumAddons.length > newAllowance.premium) {
                                setPremiumAddons(premiumAddons.slice(0, Math.max(0, newAllowance.premium)));
                              }
                              if (basicAddons.length > newAllowance.basic) {
                                setBasicAddons(basicAddons.slice(0, Math.max(0, newAllowance.basic)));
                              }
                            }}
                            className={`flex-1 py-2 px-2 text-xs rounded-lg border-2 transition-all font-medium ${
                              swapCount === opt.value
                                ? 'border-primary bg-primary text-white'
                                : 'border-primary/30 bg-background hover:border-primary/50'
                            }`}
                          >
                            {opt.compactLabel}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Basic Upgrades */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-primary">Basic Upgrades</h5>
                      <span className="text-sm text-muted-foreground">
                        {basicAddons.length}/{allowance.basic} included
                        {extraBasicCount > 0 && <span className="text-accent ml-1">(+{extraBasicCount} extra)</span>}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] md:max-h-none overflow-y-auto md:overflow-visible">
                      {BASIC_ADDONS.map((addon) => {
                        const isSelected = basicAddons.includes(addon.id);
                        return (
                          <div key={addon.id} className={`p-3 rounded-lg border text-left transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:border-primary/50'
                          }`}>
                            <Label className="cursor-pointer flex items-center gap-2">
                              <Checkbox 
                                checked={isSelected} 
                                onCheckedChange={() => handleBasicAddonToggle(addon.id)} 
                              />
                              <span className="text-sm font-medium">{addon.label}</span>
                            </Label>
                            <UpgradeDetails upgradeId={addon.id} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Premium Upgrades */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h5 className="font-bold text-accent flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent" /> Premium Upgrades
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
                          <div key={addon.id} className={`p-3 rounded-lg border text-left transition-all ${
                            isSelected 
                              ? 'border-accent bg-accent/10' 
                              : 'border-border hover:border-accent/50'
                          }`}>
                            <Label className="cursor-pointer flex items-center gap-2">
                              <Checkbox 
                                checked={isSelected} 
                                onCheckedChange={() => handlePremiumAddonToggle(addon.id)} 
                              />
                              <span className="text-sm font-medium">{addon.label}</span>
                            </Label>
                            <UpgradeDetails upgradeId={addon.id} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 text-center">
                    <div className="text-sm text-muted-foreground">Your Monthly Total</div>
                    <div className="text-4xl font-extrabold text-primary">${totalPrice}/mo</div>
                    <div className="text-xs text-muted-foreground">Includes AI-Savings Discount</div>
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
                    <p className="text-muted-foreground">An account manager will confirm your property details and help finalize the best fit for your yard.</p>
                  </div>

                  {/* Trust Badge */}
                  <TrustBadge variant="full" message={TRUST_MESSAGES.contactStep} />

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
                        <div className="font-semibold text-primary mb-2">Selected Upgrades:</div>
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
                            <Input placeholder="Enter full name" {...field} />
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
                            <Input placeholder="Enter full street address" {...field} />
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
                              <Input placeholder="Enter phone number" {...field} />
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
                            <Input placeholder="Enter email address" {...field} />
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
                              placeholder="Gate codes, pet information, or special requests..." 
                              className="resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-muted/30 rounded-xl p-4 border border-border">
                      <h5 className="text-lg font-bold text-primary mb-2">25-Year Anniversary Client Rewards</h5>
                      <p className="text-sm text-muted-foreground mb-3">
                        To celebrate 25 years of Lawn Trooper, we're offering commitment-based service rewards for both new and existing clients.
                      </p>

                      <TermSelector
                        term={term}
                        payUpfront={payUpfront}
                        onTermChange={setTerm}
                        onPayUpfrontChange={setPayUpfront}
                        className="mb-3"
                      />

                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex justify-between"><span>1-Year Plan</span><span className="font-semibold text-primary">Includes 1 complimentary month</span></div>
                        <div className="flex justify-between"><span>2-Year Plan</span><span className="font-semibold text-primary">Includes 3 complimentary months</span></div>
                        <div className="flex justify-between"><span>Pay in full</span><span className="font-semibold text-primary">Doubles your complimentary months</span></div>
                      </div>
                      <p className="text-sm font-semibold text-accent mt-3">
                        Up to 6 complimentary months with a 2-year paid-in-full plan.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Existing clients may qualify for additional loyalty pricing. Enter your client code if applicable.
                      </p>
                      <Input
                        className="mt-2"
                        placeholder="Client Code (Optional)"
                        value={clientCode}
                        onChange={(e) => setClientCode(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Summary + Navigation Footer */}
          <div className="sticky bottom-0 z-20 bg-card border-t-2 border-primary/20 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
            {currentStep >= 2 && (
              <div className="px-4 py-2 bg-primary/5 border-b border-primary/10">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-muted-foreground">
                      <span className="font-bold text-primary">{planData?.name}</span>
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {YARD_SIZES.find(y => y.id === yardSize)?.label} yard
                    </span>
                    {currentStep >= 3 && (
                      <span className="text-muted-foreground text-xs">
                        {basicAddons.length}B + {premiumAddons.length}P upgrades
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-primary text-lg whitespace-nowrap">
                    ${totalPrice}/mo
                  </div>
                </div>
              </div>
            )}
            <div className="p-4 md:p-6 flex items-center justify-between gap-4">
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
                  className={`flex items-center gap-2 px-6 py-3 text-base font-bold ${
                    currentStep === 3 && !canProceedFromStep3 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-6 text-lg font-bold uppercase tracking-wider"
                  style={{ backgroundColor: '#1a3d24', color: 'white' }}
                >
                  {isSubmitting ? "Transmitting..." : "See My Instant Price"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
