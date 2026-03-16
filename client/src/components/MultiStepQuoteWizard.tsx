import React, { useState, useEffect, useCallback, useRef } from "react";
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
  AlertCircle,
  CheckCircle2,
  Leaf
} from "lucide-react";
import PlanBadge from "@/components/PlanBadge";
import { 
  MILITARY_RANKS, 
  LOCAL_TIPS, 
  FEATURE_FLAGS, 
  getFeatureFlag
} from "@/data/marketing";
import {
  getApplicablePromotions,
  applyPromotions,
  buildSavingsSummary,
  calculateTermFreeMonths,
  validatePromoCode,
  TRUST_MESSAGES,
  PLAN_VALUE_HIGHLIGHTS,
  RECOMMENDED_ADDONS,
  UPGRADE_CREDIT_COPY,
  type UserSelections,
} from "@/data/promotions";
import MissionAccomplished from "./MissionAccomplished";
import TrustBadge from "./TrustBadge";
import SavingsPanel from "./SavingsPanel";
import TotalSavingsBox from "./TotalSavingsBox";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { appendAttributionNotes, getAttributionContext } from "@/lib/attribution";
import { 
  PLANS, 
  BASIC_ADDONS, 
  PREMIUM_ADDONS, 
  ADDON_CATALOG,
  getPlanCredits,
  calculateUsedCredits,
  calculateCreditOverage,
  PREMIUM_CREDIT_COST,
  EXECUTIVE_PLUS,
  calculate2026Price,
  YARD_SIZES,
} from "@/data/plans";
import { PLAN_COMPARISON_ROWS } from "@/data/planComparison";
import imgMulchInstall from "@assets/stock_images/landscaper_installin_4e11602e.jpg";
import imgShrub from "@assets/stock_images/man_trimming_hedges__4f4ec72f.jpg";

const STEPS = [
  { id: 1, title: "Yard Size", icon: MapPin, rank: "Recruit", rankIcon: Shield },
  { id: 2, title: "Plan", icon: Zap, rank: "Sergeant", rankIcon: Award },
  { id: 3, title: "Upgrades", icon: Star, rank: "Commander", rankIcon: Target },
  { id: 4, title: "Contact", icon: Phone, rank: "General", rankIcon: Award },
];

const PLAN_CARD_COPY: Record<string, { valueLine: string; creditsLine: string }> = {
  basic: {
    valueLine: "Reliable essential care for clean curb appeal year-round.",
    creditsLine: "Includes 3 upgrade credits (Standard-only upgrades).",
  },
  premium: {
    valueLine: "Our most popular balance of weekly polish and flexibility.",
    creditsLine: "Includes 5 upgrade credits (Standard = 1, Premium = 2).",
  },
  executive: {
    valueLine: "Top-tier property care with priority service coverage.",
    creditsLine: "Includes 9 upgrade credits (Standard = 1, Premium = 2).",
  },
};

const getQuickAddonDescription = (description: string): string => {
  const firstSentence = description.split(".")[0]?.trim() ?? "";
  if (!firstSentence) return "Helpful add-on service for your property.";
  return `${firstSentence}.`;
};

const getPopularityBadgeClass = (popularity: "trending" | "favorite") =>
  popularity === "favorite"
    ? "bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200"
    : "bg-green-100 text-green-700 border border-green-200";

const getPopularityBadgeLabel = (popularity: "trending" | "favorite") =>
  popularity === "favorite" ? "Spring Favorite" : "Trending";

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
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showMissionAccomplished, setShowMissionAccomplished] = useState(false);
  
  const [executivePlus, setExecutivePlus] = useState(false);
  
  const [term, setTerm] = useState<'1-year' | '2-year'>('2-year');
  const [payUpfront, setPayUpfront] = useState(false);
  const [segments, setSegments] = useState<('renter' | 'veteran' | 'senior')[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeStatus, setPromoCodeStatus] = useState<{ valid: boolean; discount: number; hoaName?: string } | null>(null);
  const [mobileComparisonPlan, setMobileComparisonPlan] = useState<"basic" | "premium" | "executive">("basic");
  const [swapTarget, setSwapTarget] = useState<{ tier: "basic" | "premium"; addonId: string } | null>(null);
  
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
  const wizardRootRef = useRef<HTMLDivElement | null>(null);

  const setStepWithStableScroll = (nextStep: number | ((prevStep: number) => number)) => {
    setCurrentStep((prevStep) => {
      const resolvedStep = typeof nextStep === "function" ? nextStep(prevStep) : nextStep;
      return Math.max(1, Math.min(4, resolvedStep));
    });
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        wizardRootRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
      });
    }
  };

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
    setStepWithStableScroll((prevStep) => (prevStep < 4 ? prevStep + 1 : prevStep));
  };

  const handleBack = () => {
    setStepWithStableScroll((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
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

  useEffect(() => {
    if (plan === "basic" && premiumAddons.length > 0) {
      setPremiumAddons([]);
    }
  }, [plan, premiumAddons.length]);

  useEffect(() => {
    if (currentStep === 2 && (plan === "basic" || plan === "premium" || plan === "executive")) {
      setMobileComparisonPlan(plan);
    }
  }, [currentStep, plan]);

  const recommendedPlanKey = plan === "executive" && executivePlus ? "executive+" : plan;
  const recommendedSet = RECOMMENDED_ADDONS[recommendedPlanKey] ?? { basic: [], premium: [] };
  const recommendedSelectedBasic = basicAddons.filter((id) => recommendedSet.basic.includes(id));
  const recommendedSelectedPremium = premiumAddons.filter((id) => recommendedSet.premium.includes(id));
  const recommendedSelectedCount = recommendedSelectedBasic.length + recommendedSelectedPremium.length;

  const getAddonLabelById = (addonId: string): string => {
    const basic = BASIC_ADDONS.find((addon) => addon.id === addonId);
    if (basic) return basic.label;
    const premium = PREMIUM_ADDONS.find((addon) => addon.id === addonId);
    if (premium) return premium.label;
    const generic = ADDON_CATALOG.find((addon) => addon.id === addonId);
    return generic?.name ?? addonId;
  };

  const swapCandidates =
    swapTarget?.tier === "basic"
      ? BASIC_ADDONS.filter((addon) => !basicAddons.includes(addon.id))
      : swapTarget?.tier === "premium"
        ? PREMIUM_ADDONS.filter((addon) => !premiumAddons.includes(addon.id))
        : [];

  const applySwap = (replacementId: string) => {
    if (!swapTarget) return;
    if (swapTarget.tier === "basic") {
      setBasicAddons((prev) => prev.map((id) => (id === swapTarget.addonId ? replacementId : id)));
    } else {
      setPremiumAddons((prev) => prev.map((id) => (id === swapTarget.addonId ? replacementId : id)));
    }
    setSwapTarget(null);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const photos = selectedPhotos.length > 0 ? await filesToBase64(selectedPhotos) : [];
      const attribution = getAttributionContext();
      
      const submitData = {
        ...values,
        yardSize,
        plan,
        basicAddons,
        premiumAddons,
        notes: appendAttributionNotes(values.notes, attribution),
        source: attribution.sourceTag,
        sourceDetail: attribution.sourceDetail,
        landingPath: attribution.landingPath,
        referrer: attribution.referrer,
        utmSource: attribution.utmSource,
        utmMedium: attribution.utmMedium,
        utmCampaign: attribution.utmCampaign,
        utmContent: attribution.utmContent,
        utmTerm: attribution.utmTerm,
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
          notes: appendAttributionNotes(values.notes, attribution),
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
  const includedCredits = getPlanCredits(plan, executivePlus);
  const usedCredits = calculateUsedCredits(basicAddons.length, premiumAddons.length);
  const remainingCredits = Math.max(0, includedCredits - usedCredits);
  const canAddStandardUpgrade = remainingCredits >= 1;
  const canAddPremiumUpgrade = remainingCredits >= PREMIUM_CREDIT_COST;
  let planPrice = calculate2026Price(plan, yardSize);
  if (executivePlus && plan === 'executive') {
    const yardMultiplier = YARD_SIZES.find(y => y.id === yardSize)?.multiplier ?? 1.0;
    planPrice += Math.round(EXECUTIVE_PLUS.price * yardMultiplier);
  }
  const { extraCredits, totalOverage } = calculateCreditOverage(
    usedCredits,
    includedCredits
  );
  const baseMonthlyTotal = planPrice + totalOverage;

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
  const effectiveMonthlyTermAverage = appliedTotals.displayedEffectiveMonthly;
  const savingsSummary = buildSavingsSummary(
    appliedTotals.displayedMonthly,
    appliedTotals.monthlyDiscount,
    appliedTotals.termMonths,
    appliedTotals.freeMonthsAtEnd
  );


  // Check if add-on requirements are met
  const addonsRequirementMet = usedCredits >= includedCredits;
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
          <div className="font-bold text-primary">{usedCredits}/{includedCredits} credits used</div>
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

  const CompactPlanBanner = () => {
    if (!planData) return null;
    const yardLabel = YARD_SIZES.find((y) => y.id === yardSize)?.label ?? "Selected";
    const isExecutivePlan = plan === "executive";
    const toneClass = isExecutivePlan
      ? "border-accent/30 bg-accent/10 text-accent"
      : "border-primary/20 bg-primary/5 text-primary";
    const premiumUpgradeSummary =
      plan === "basic" ? "Standard upgrades only" : "Premium upgrades available";

    return (
      <div className={`rounded-xl border p-3 ${toneClass}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="font-bold uppercase tracking-wide">{planData.name}</div>
          <div className="text-xs font-semibold">
            {includedCredits} upgrade credits • {premiumUpgradeSummary}
          </div>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">Yard size: {yardLabel}</div>
      </div>
    );
  };

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
      if (remainingCredits === 0) {
        return "Standard credits filled. Standard upgrades only on this plan.";
      }
      return `Use ${remainingCredits} more Standard credit${remainingCredits === 1 ? "" : "s"} to unlock Mission Ready.`;
    }
    if (remainingCredits === 0) {
      return "Credit pool filled. Add more upgrades any time for overage pricing.";
    }
    return `Use ${remainingCredits} more credit${remainingCredits === 1 ? "" : "s"} to unlock Mission Ready. Standard = 1 credit, Premium = ${PREMIUM_CREDIT_COST} credits each.`;
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
    <div ref={wizardRootRef} className={`bg-card rounded-2xl shadow-2xl border-2 border-primary/30 relative ${isModal ? '' : ''}`}>
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
            <p className="mt-2 text-xs font-semibold text-primary-foreground">
              Effective monthly: ${effectiveMonthlyTermAverage}/mo
            </p>
            <p className="text-[11px] text-primary-foreground/80">
              Averages complimentary months across your full term.
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
                  onClick={() => step.id < currentStep && setStepWithStableScroll(step.id)}
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
                    <h4 className="text-2xl font-bold text-primary mb-2">Choose Your Total Maintenance Plan</h4>
                    <p className="text-muted-foreground">Simple plan tiers with clear upgrade credits and commitment rewards.</p>
                  </div>
                  <CompactPlanBanner />

                  {/* Feature comparison matrix */}
                  <div className="rounded-xl border border-border bg-muted/30 p-3 md:hidden">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">Choose a plan tab to compare feature details.</p>
                    <div className="mb-3 grid grid-cols-3 gap-1 rounded-lg border border-border/70 bg-background p-1">
                      {[
                        { id: "basic", label: "Basic" },
                        { id: "premium", label: "Premium" },
                        { id: "executive", label: "Executive" },
                      ].map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setMobileComparisonPlan(option.id as "basic" | "premium" | "executive")}
                          className={`rounded-md px-2 py-1.5 text-xs font-bold transition-colors ${
                            mobileComparisonPlan === option.id
                              ? option.id === "executive"
                                ? "bg-accent text-white"
                                : "bg-primary text-white"
                              : "text-muted-foreground"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {PLAN_COMPARISON_ROWS.map((row, i) => {
                        const selectedValue =
                          mobileComparisonPlan === "basic"
                            ? row.basic
                            : mobileComparisonPlan === "premium"
                              ? row.premium
                              : row.executive;
                        return (
                          <div key={`${row.feature}-${i}`} className="rounded-lg border border-border/60 bg-background p-2">
                            <p className="text-xs font-semibold text-primary">{row.feature}</p>
                            <p className={`mt-1 text-xs font-medium ${
                              selectedValue === "✓"
                                ? "text-green-600"
                                : mobileComparisonPlan === "executive"
                                  ? "text-accent"
                                  : "text-foreground"
                            }`}>
                              {selectedValue}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="hidden md:block bg-muted/30 rounded-xl border border-border overflow-x-auto">
                    <table className="w-full text-sm min-w-[480px]">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-3 text-muted-foreground font-medium">Feature</th>
                          <th className="text-center py-3 px-3 font-bold text-primary">Basic</th>
                          <th className="text-center py-3 px-3 font-bold text-primary">Premium</th>
                          <th className="text-center py-3 px-3 font-bold text-accent">Executive</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PLAN_COMPARISON_ROWS.map((row, i) => {
                          const basicVal = row.basic;
                          const premiumDiff = row.premium !== basicVal;
                          const execDiff = row.executive !== basicVal;
                          return (
                            <tr key={i} className="border-b border-border/50 last:border-b-0">
                              <td className="py-2.5 px-3 text-muted-foreground">{row.feature}</td>
                              <td className={`py-2.5 px-3 text-center font-medium ${basicVal === "✓" ? "text-green-600" : ""}`}>
                                {basicVal}
                              </td>
                              <td className={`py-2.5 px-3 text-center ${premiumDiff ? "bg-accent/5 font-medium text-primary" : ""} ${row.premium === "✓" ? "text-green-600" : ""}`}>
                                {row.premium}
                              </td>
                              <td className={`py-2.5 px-3 text-center ${execDiff ? "bg-accent/5 font-medium text-accent" : ""} ${row.executive === "✓" ? "text-green-600" : ""}`}>
                                {row.executive}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PLANS.map((p) => {
                      const price2026 = calculate2026Price(p.id, yardSize);
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
                            setMobileComparisonPlan(p.id as "basic" | "premium" | "executive");
                            if (p.id !== 'executive') setExecutivePlus(false);
                            setDefaultAddonsForPlan(p.id);
                          }}
                          className={`p-5 rounded-xl transition-all text-left relative flex flex-col items-start h-full justify-start ${
                            isExecutive 
                              ? `border-3 border-accent bg-gradient-to-br from-accent/10 to-accent/5 shadow-xl ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`
                              : isSelected
                                ? 'border-2 border-primary bg-primary/10 shadow-lg'
                                : 'border-2 border-border hover:border-primary/50 bg-muted/30'
                          }`}
                        >
                          {(isExecutive || p.id === 'premium') && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <PlanBadge planId={p.id} />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <h5 className={`font-bold ${isExecutive ? 'text-xl' : 'text-lg'}`}>{p.name}</h5>
                            {isExecutive && <Star className="w-5 h-5 fill-accent text-accent" />}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{cardCopy.valueLine}</p>
                          <p className="mt-1 text-xs font-semibold text-primary/90">{cardCopy.creditsLine}</p>
                          <div className="mt-2 w-full">
                            <div className={`font-bold text-primary ${isExecutive ? 'text-3xl' : 'text-2xl'}`}>
                              ${price2026}
                              <span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </div>
                            <div className="mt-2 w-full rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-center">
                              <div className="text-[10px] font-bold uppercase tracking-wide text-amber-800">
                                25-Year Anniversary Client Rewards
                              </div>
                              <div className="text-[11px] font-semibold text-primary">
                                +{calculateTermFreeMonths(term, payUpfront)} complimentary month{calculateTermFreeMonths(term, payUpfront) === 1 ? "" : "s"}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <Check className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Executive+ Toggle */}
                  {plan === 'executive' && (
                    <button
                      type="button"
                      data-testid="wizard-executive-plus-toggle"
                      onClick={() => {
                        const next = !executivePlus;
                        setExecutivePlus(next);
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
                    payUpfront={payUpfront}
                    showUnlockedAnimation={false}
                  />
                  <TotalSavingsBox summary={savingsSummary} />
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
                    <h4 className="text-2xl font-bold text-primary mb-2">Pick Your Upgrades</h4>
                    <p className="text-muted-foreground">
                      Bundling saves you money. {planData?.name} includes {includedCredits} upgrade credits.
                    </p>
                    <p className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      You have {includedCredits} upgrade credits. {UPGRADE_CREDIT_COPY.tierLegendTight}
                    </p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wide text-accent">
                      Credits remaining: {remainingCredits}
                    </p>
                    <p className="text-sm text-accent font-semibold mt-2 bg-accent/10 inline-block px-3 py-1 rounded-full">
                      {getAddOnInstructionText()}
                    </p>
                  </div>
                  <CompactPlanBanner />
                  <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary">Credit Counter</p>
                      <p className="text-xs font-semibold text-muted-foreground">Used / Included</p>
                    </div>
                    <div className="mt-1 text-3xl font-extrabold text-primary">
                      {usedCredits} / {includedCredits}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-accent">
                      {remainingCredits} credit{remainingCredits === 1 ? "" : "s"} remaining
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-primary/80">
                      Rule: {UPGRADE_CREDIT_COPY.tierLegendTight}
                    </p>
                    {extraCredits > 0 && (
                      <p className="mt-1 text-xs font-bold text-amber-700">
                        Overage: +{extraCredits} credit{extraCredits === 1 ? "" : "s"}
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-card p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-primary">Recommended Loadout</p>
                      <span className="text-xs text-muted-foreground">
                        {recommendedSelectedCount}/{recommendedSet.basic.length + (plan === "basic" ? 0 : recommendedSet.premium.length)} selected
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">All recommended upgrades are swappable.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recommendedSelectedBasic.map((addonId) => (
                        <div
                          key={`recommended-basic-${addonId}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2 py-1"
                        >
                          <span className="text-[10px] font-bold uppercase text-primary">Recommended</span>
                          <span className="text-xs font-semibold text-primary">{getAddonLabelById(addonId)}</span>
                          <button
                            type="button"
                            onClick={() => setSwapTarget({ tier: "basic", addonId })}
                            className="rounded-full border border-primary/30 px-1.5 py-0.5 text-[10px] font-bold text-primary hover:bg-primary/10"
                          >
                            Swap
                          </button>
                        </div>
                      ))}
                      {plan !== "basic" &&
                        recommendedSelectedPremium.map((addonId) => (
                          <div
                            key={`recommended-premium-${addonId}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2 py-1"
                          >
                            <span className="text-[10px] font-bold uppercase text-accent">Recommended</span>
                            <span className="text-xs font-semibold text-accent">{getAddonLabelById(addonId)}</span>
                            <button
                              type="button"
                              onClick={() => setSwapTarget({ tier: "premium", addonId })}
                              className="rounded-full border border-accent/40 px-1.5 py-0.5 text-[10px] font-bold text-accent hover:bg-accent/20"
                            >
                              Swap
                            </button>
                          </div>
                        ))}
                      {recommendedSelectedCount === 0 && (
                        <p className="text-xs text-muted-foreground">You customized away from the default loadout. Great job dialing it in.</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="overflow-hidden rounded-xl border border-border bg-card">
                      <img src={imgShrub} alt="Healthy shrubs after trimming and cleanup" className="h-28 w-full object-cover" />
                      <div className="p-2.5">
                        <p className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700">Trending</p>
                        <p className="mt-1 text-xs font-semibold text-primary">Shrub Care Package</p>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-border bg-card">
                      <img src={imgMulchInstall} alt="Fresh mulch installation in flower beds" className="h-28 w-full object-cover" />
                      <div className="p-2.5">
                        <p className="inline-block rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-bold uppercase text-fuchsia-700 border border-fuchsia-200">Spring Favorite</p>
                        <p className="mt-1 text-xs font-semibold text-primary">Seasonal Mulch Refresh</p>
                      </div>
                    </div>
                  </div>

                  {/* Standard Upgrades */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-primary">Standard Upgrades</h5>
                      <span className="text-sm text-muted-foreground">
                        {basicAddons.length} selected ({basicAddons.length} credits)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] md:max-h-none overflow-y-auto md:overflow-visible">
                      {BASIC_ADDONS.map((addon) => {
                        const isSelected = basicAddons.includes(addon.id);
                        const disableNewSelection = !isSelected && !canAddStandardUpgrade;
                        return (
                          <Label
                            key={addon.id}
                            className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2 ${
                              isSelected 
                                ? 'border-primary bg-primary/10' 
                                : disableNewSelection
                                  ? 'border-border opacity-60 cursor-not-allowed'
                                  : 'border-border hover:border-primary/50 cursor-pointer'
                            }`}
                          >
                            <Checkbox 
                              checked={isSelected} 
                              disabled={disableNewSelection}
                              onCheckedChange={() => {
                                if (disableNewSelection) return;
                                handleBasicAddonToggle(addon.id);
                              }} 
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium leading-tight">{addon.label}</span>
                              <span className="mt-0.5 block text-xs text-muted-foreground leading-tight">
                                {getQuickAddonDescription(addon.description)}
                              </span>
                            </span>
                            {addon.popularity && (
                              <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPopularityBadgeClass(addon.popularity)}`}>
                                {getPopularityBadgeLabel(addon.popularity)}
                              </span>
                            )}
                          </Label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Premium Upgrades */}
                  {plan !== "basic" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h5 className="font-bold text-accent flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent" /> Premium Upgrades
                      </h5>
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {premiumAddons.length} selected ({premiumAddons.length * PREMIUM_CREDIT_COST} credits)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] md:max-h-none overflow-y-auto md:overflow-visible">
                      {PREMIUM_ADDONS.map((addon) => {
                        const isSelected = premiumAddons.includes(addon.id);
                        const disableNewSelection = !isSelected && !canAddPremiumUpgrade;
                        return (
                          <Label
                            key={addon.id}
                            className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2 ${
                              isSelected 
                                ? 'border-accent bg-accent/10' 
                                : disableNewSelection
                                  ? 'border-border opacity-60 cursor-not-allowed'
                                  : 'border-border hover:border-accent/50 cursor-pointer'
                            }`}
                          >
                            <Checkbox 
                              checked={isSelected} 
                              disabled={disableNewSelection}
                              onCheckedChange={() => {
                                if (disableNewSelection) return;
                                handlePremiumAddonToggle(addon.id);
                              }} 
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium leading-tight">{addon.label}</span>
                              <span className="mt-0.5 block text-xs text-muted-foreground leading-tight">
                                {getQuickAddonDescription(addon.description)}
                              </span>
                            </span>
                            {addon.popularity && (
                              <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPopularityBadgeClass(addon.popularity)}`}>
                                {getPopularityBadgeLabel(addon.popularity)}
                              </span>
                            )}
                          </Label>
                        );
                      })}
                    </div>
                  </div>
                  )}

                  {/* Price Summary */}
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 text-center">
                    <div className="text-sm text-muted-foreground">Your Monthly Total</div>
                    <div className="text-4xl font-extrabold text-primary">${totalPrice}/mo</div>
                    <div className="text-xs text-muted-foreground">Includes AI savings discount</div>
                    {extraCredits > 0 && (
                      <div className="text-xs font-semibold text-amber-700 mt-1">
                        Includes {extraCredits} overage credit{extraCredits === 1 ? "" : "s"}.
                      </div>
                    )}
                  </div>
                  <TotalSavingsBox summary={savingsSummary} />

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
                    <p className="text-muted-foreground">An account manager will reach out to schedule a good time for your property walk-through.</p>
                  </div>
                  <CompactPlanBanner />

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
                      HOA Partner Code (Optional)
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
                  <TotalSavingsBox summary={savingsSummary} className="mb-6" />

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
                {isSubmitting ? "Transmitting..." : "Get Your AI Yard Quote"}
              </Button>
            )}
          </div>
        </form>
      </Form>
      <Dialog open={swapTarget !== null} onOpenChange={(open) => !open && setSwapTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Swap Recommended Upgrade</DialogTitle>
            <DialogDescription>
              Replace <span className="font-semibold text-foreground">{swapTarget ? getAddonLabelById(swapTarget.addonId) : ""}</span> with another{" "}
              {swapTarget?.tier === "premium" ? "Premium" : "Basic"} upgrade.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
            {swapCandidates.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => applySwap(candidate.id)}
                className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <p className="text-sm font-semibold text-primary">{candidate.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{getQuickAddonDescription(candidate.description)}</p>
              </button>
            ))}
            {swapCandidates.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No additional swap options are available in this tier right now.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
