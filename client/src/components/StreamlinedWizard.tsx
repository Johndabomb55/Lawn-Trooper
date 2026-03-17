import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Info,
  X,
  Star,
  Shield,
  Zap,
  Gift,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Sparkles,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { appendAttributionNotes, getAttributionContext } from "@/lib/attribution";
import WizardProgress from "@/components/WizardProgress";
import YardScorecard from "@/components/YardScorecard";
import TransformationPreview from "@/components/TransformationPreview";
import UpgradeDetails from "@/components/UpgradeDetails";
import PromoBanner from "@/components/PromoBanner";
import TotalSavingsBox from "@/components/TotalSavingsBox";
import imgMulchInstall from "@assets/mulch-brown-refresh-alabama.jpg";
import imgShrub from "@assets/alabama-shrub-care-commercial-tools.jpg";
import NeighborhoodOffer from "@/components/NeighborhoodOffer";
import RobotWaitlist from "@/components/RobotWaitlist";
import PlanBadge from "@/components/PlanBadge";
import { 
  PLANS, 
  YARD_SIZES, 
  GLOBAL_CONSTANTS, 
  ADDON_CATALOG,
  BASIC_ADDONS, 
  PREMIUM_ADDONS, 
  getYardMultiplier,
  getPlanCredits,
  calculateUsedCredits,
  calculateCreditOverage,
  PREMIUM_CREDIT_COST,
  EXECUTIVE_PLUS,
  getAddonById,
  calculate2026Price
} from "@/data/plans";
import { PLAN_COMPARISON_ROWS } from "@/data/planComparison";
import { 
  COMMITMENT_TERMS, 
  HOA_PROMO_CODES,
  COMMITMENT_COPY,
  ANNIVERSARY_DEADLINE_LINE,
  UPGRADE_CREDIT_COPY,
  buildSavingsSummary,
  validatePromoCode,
  calculateActualMonthly,
  calculateTermFreeMonths,
  getFreeMonthsBreakdown,
} from "@/data/promotions";

const STEPS = [
  { id: 1, title: "Welcome", icon: Shield },
  { id: 2, title: "Yard Size", icon: MapPin },
  { id: 3, title: "Plan", icon: Star },
  { id: 4, title: "Upgrades", icon: Gift },
  { id: 5, title: "Yard Analysis", icon: Sparkles },
  { id: 6, title: "Transformation", icon: Zap },
  { id: 7, title: "Commitment", icon: Calendar },
  { id: 8, title: "Contact", icon: User },
  { id: 9, title: "Complete", icon: Trophy },
];

interface InfoPopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

function InfoPopup({ open, onClose, title, content }: InfoPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent data-testid="dialog-info" className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="dialog-title" className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div data-testid="dialog-content" className="text-sm text-foreground">{content}</div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

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

const formatIncludedUpgradeCopy = (basic: number, premium: number): string => {
  const totalCredits = basic + (premium * PREMIUM_CREDIT_COST);
  return `Includes ${totalCredits} upgrade credits`;
};

const getPopularityBadgeClass = (popularity: "trending" | "favorite") =>
  popularity === "favorite"
    ? "bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200"
    : "bg-green-100 text-green-700 border border-green-200";

const getPopularityBadgeLabel = (popularity: "trending" | "favorite") =>
  popularity === "favorite" ? "Spring Favorite" : "Trending";

const MOBILE_PLAN_CARDS_SW = [
  {
    id: "basic" as const,
    name: "Standard Patrol",
    badge: null,
    careLevel: "Essential Care",
    mowing: "Bi-weekly in growing season, monthly off-season check",
    treatments: "2 lawn treatments",
    totalUpgrades: 3,
    breakdown: "Includes 3 upgrade credits",
    bonus: COMMITMENT_COPY.twoYearBonus,
  },
  {
    id: "premium" as const,
    name: "Premium Patrol",
    badge: "Most Popular",
    careLevel: "Complete Care",
    mowing: "Weekly in growing season, bi-weekly off-season",
    treatments: "4 lawn treatments",
    totalUpgrades: 5,
    breakdown: "Includes 5 upgrade credits",
    bonus: COMMITMENT_COPY.twoYearBonus,
  },
  {
    id: "executive" as const,
    name: "Executive Command",
    badge: "Best Value",
    careLevel: "Total Care",
    mowing: "Weekly in growing season, bi-weekly off-season",
    treatments: "7 lawn treatments",
    totalUpgrades: 9,
    breakdown: "Includes 9 upgrade credits",
    bonus: COMMITMENT_COPY.twoYearBonus,
  },
];

const PLAN_VALUE_LINES_SW: Record<string, string> = {
  basic: "Reliable essential care for clean curb appeal year-round.",
  premium: "Our most popular balance of weekly polish and flexibility.",
  executive: "Top-tier property care with priority service coverage.",
};

function MobileComparisonCards() {
  return (
    <div className="space-y-3 md:hidden" data-testid="mobile-comparison-cards">
      {MOBILE_PLAN_CARDS_SW.map((p) => (
        <div key={p.id} className={`rounded-xl border-2 p-4 ${p.id === 'executive' ? 'border-accent/60 bg-accent/5' : p.id === 'premium' ? 'border-primary/60 bg-primary/5' : 'border-border bg-muted/20'}`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-bold text-base ${p.id === 'executive' ? 'text-accent' : 'text-primary'}`}>{p.name}</h4>
            {p.badge && (
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.id === 'executive' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                {p.badge}
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 shrink-0" />
              <span>{p.careLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 shrink-0" />
              <span>{p.mowing}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 shrink-0" />
              <span>{p.treatments}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 shrink-0" />
              <span className="font-medium">{p.breakdown}</span>
            </div>
          </div>
          <div className={`mt-2 px-2.5 py-1.5 rounded-lg border text-center ${p.id === 'executive' ? 'bg-accent/10 border-accent/30' : 'bg-amber-50 border-amber-200'}`}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">25-Year Anniversary Client Rewards</div>
            <div className={`text-xs font-bold ${p.id === 'executive' ? 'text-accent' : 'text-primary'}`}>{p.bonus}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function UpgradeFlexibilitySection() {
  const [open, setOpen] = React.useState(false);
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
            <h6 className="text-xs font-bold text-primary mb-2">Standard upgrades may include</h6>
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
        <p className="text-xs font-medium text-primary/80">Credit rule: {UPGRADE_CREDIT_COPY.tierLegend}</p>
      </div>
    </div>
  );
}

export type PropertyType = 'residential' | 'hoa';

export default function StreamlinedWizard() {
  const [step, setStep] = useState(1);
  const wizardRootRef = useRef<HTMLDivElement | null>(null);
  const [propertyType, setPropertyType] = useState<PropertyType>('residential');
  const [hoaName, setHoaName] = useState("");
  const [hoaAcreage, setHoaAcreage] = useState("");
  const [hoaUnits, setHoaUnits] = useState("");
  const [hoaNotes, setHoaNotes] = useState("");
  const [yardSize, setYardSize] = useState("");
  const [plan, setPlan] = useState("premium");
  const [basicAddons, setBasicAddons] = useState<string[]>([]);
  const [premiumAddons, setPremiumAddons] = useState<string[]>([]);
  const [showAdvancedAddons, setShowAdvancedAddons] = useState(false);
  const [executivePlus, setExecutivePlus] = useState(false);
  const [showPayInFullTotal, setShowPayInFullTotal] = useState(false);
  const [term, setTerm] = useState<'1-year' | '2-year'>('2-year');
  const [payInFull, setPayInFull] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [infoPopup, setInfoPopup] = useState<{ open: boolean; title: string; content: React.ReactNode }>({
    open: false,
    title: "",
    content: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const isHOA = propertyType === 'hoa';
  
  const { toast } = useToast();

  const selectedPlan = PLANS.find(p => p.id === plan);
  const selectedYard = YARD_SIZES.find(y => y.id === yardSize);
  const selectedTerm = COMMITMENT_TERMS.find(t => t.id === term);
  
  const promoValid = validatePromoCode(promoCode);
  const promoDiscount = promoValid ? (HOA_PROMO_CODES[promoCode.toUpperCase()]?.discount || 0) : 0;
  
  // Calculate complimentary service months based on commitment model
  // Commitment months: 1 (1-year) or 3 (2-year) — doubled if pay-in-full
  // Anniversary sale month is handled in shared commitment/free-month logic.
  const freeMonthsBreakdown = getFreeMonthsBreakdown(term, payInFull);
  const totalFreeMonths = freeMonthsBreakdown.total;
  
  const isExecutive = plan === 'executive';
  const includedCredits = getPlanCredits(plan, executivePlus);
  const usedCredits = calculateUsedCredits(basicAddons.length, premiumAddons.length);
  const remainingCredits = Math.max(0, includedCredits - usedCredits);
  const canAddStandardUpgrade = remainingCredits >= 1;
  const canAddPremiumUpgrade = remainingCredits >= PREMIUM_CREDIT_COST;
  
  // Calculate overages
  const { extraCredits, totalOverage } = calculateCreditOverage(usedCredits, includedCredits);
  const calculateBasePrice = () => {
    if (!selectedPlan || !selectedYard) return 0;
    let basePrice = selectedPlan.price;
    if (executivePlus && plan === 'executive') {
      basePrice += EXECUTIVE_PLUS.price;
    }
    const sizeMultiplier = getYardMultiplier(selectedYard.id);
    let price = Math.round(basePrice * sizeMultiplier);
    if (promoDiscount > 0) {
      price = Math.round(price * (1 - promoDiscount / 100));
    }
    return price;
  };

  const basePrice = calculateBasePrice();
  const monthlySubscription = isHOA ? 0 : calculateActualMonthly(basePrice + totalOverage, term);
  const termMonths = selectedTerm?.months || 12;
  const billedMonths = termMonths - totalFreeMonths;
  const actualMonthly = monthlySubscription;
  const totalCommitmentSavings = monthlySubscription * totalFreeMonths;
  const payInFullExtraMonths = Math.max(
    0,
    freeMonthsBreakdown.commitmentMonths - freeMonthsBreakdown.commitmentBase
  );
  const payInFullExtraSavings = monthlySubscription * payInFullExtraMonths;
  const savingsSummary = buildSavingsSummary(actualMonthly, 0, termMonths, totalFreeMonths);

  const setStepWithStableScroll = (nextStep: number | ((prevStep: number) => number)) => {
    setStep((prevStep) => {
      const resolvedStep = typeof nextStep === "function" ? nextStep(prevStep) : nextStep;
      return Math.max(1, Math.min(9, resolvedStep));
    });
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        wizardRootRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
      });
    }
  };

  const handleNext = () => {
    setStepWithStableScroll((prevStep) => {
      if (isHOA && prevStep === 1) return 8;
      return prevStep < 9 ? prevStep + 1 : prevStep;
    });
  };

  const handleBack = () => {
    setStepWithStableScroll((prevStep) => {
      if (isHOA && prevStep === 8) return 1;
      return prevStep > 1 ? prevStep - 1 : prevStep;
    });
  };

  useLayoutEffect(() => {
    if (plan === "basic" && premiumAddons.length > 0) {
      setPremiumAddons([]);
    }
  }, [plan, premiumAddons.length]);

  const canProceed = () => {
    switch (step) {
      case 1: 
        if (isHOA) {
          return hoaName.trim() !== '' && hoaAcreage.trim() !== '';
        }
        return true;
      case 2: return !!yardSize || isHOA;
      case 3: return !!plan;
      case 4:
        if (isHOA) return true;
        return usedCredits >= includedCredits;
      case 5: return true;
      case 6: return true;
      case 7: return true;
      case 8: return name && phone;
      default: return true;
    }
  };

  const getCreditRequirementMessage = () => {
    if (plan === "basic") {
      return `Use ${remainingCredits} more Standard credit${remainingCredits === 1 ? "" : "s"} to finish this step. Premium upgrades are unavailable on this plan.`;
    }
    return `Use ${remainingCredits} more credit${remainingCredits === 1 ? "" : "s"} to finish this step. ${UPGRADE_CREDIT_COPY.tierLegendTight}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const attribution = getAttributionContext();
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          yardSize: isHOA ? 'custom' : yardSize,
          plan: isHOA ? 'custom' : plan,
          basicAddons: isHOA ? [] : basicAddons,
          premiumAddons: isHOA ? [] : premiumAddons,
          term: isHOA ? 'custom' : term,
          payUpfront: String(isHOA ? false : payInFull),
          promoCode,
          totalPrice: isHOA ? 'custom' : String(actualMonthly),
          freeMonths: isHOA ? '0' : String(totalFreeMonths),
          notes: appendAttributionNotes(undefined, attribution),
          propertyType,
          hoaName: isHOA ? hoaName : undefined,
          hoaAcreage: isHOA ? hoaAcreage : undefined,
          hoaUnits: isHOA ? hoaUnits : undefined,
          hoaNotes: isHOA ? hoaNotes : undefined,
        }),
      });
      
      if (response.ok) {
        setIsComplete(true);
        setStepWithStableScroll(9);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showInfo = (title: string, content: React.ReactNode) => {
    setInfoPopup({ open: true, title, content });
  };

  const progressPercent = ((step - 1) / 8) * 100;

  const CompactPlanBanner = () => {
    if (isHOA) {
      return (
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="font-bold uppercase tracking-wide text-accent">HOA Custom Quote</div>
            <div className="text-xs font-semibold text-accent">Dedicated consultation flow</div>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Property type: HOA / Community</div>
        </div>
      );
    }

    if (!selectedPlan) return null;
    const isExecutivePlan = selectedPlan.id === "executive";
    const toneClass = isExecutivePlan
      ? "border-accent/30 bg-accent/10 text-accent"
      : "border-primary/20 bg-primary/5 text-primary";
    const premiumUpgradeSummary = selectedPlan.id === "basic" ? "Standard upgrades only" : "Premium upgrades available";

    return (
      <div className={`rounded-xl border p-3 ${toneClass}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="font-bold uppercase tracking-wide">{selectedPlan.name}</div>
          <div className="text-xs font-semibold">
            {includedCredits} upgrade credits • {premiumUpgradeSummary}
          </div>
        </div>
        {selectedYard && <div className="mt-1 text-xs text-muted-foreground">Yard size: {selectedYard.label}</div>}
      </div>
    );
  };

  return (
    <div ref={wizardRootRef} className="bg-card rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden max-w-2xl mx-auto">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-primary to-green-700 p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <h2 data-testid="text-wizard-title" className="text-xl font-bold font-heading uppercase tracking-wide">Reserve Your Plan</h2>
          <span data-testid="text-step-badge" className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Step {step} of 9
          </span>
        </div>
        <div className="mb-2 text-center text-[11px] text-white/80">
          Savings totals update as you build and reserve your plan.
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {!isHOA && step > 1 && step < 9 && (
          <div className="mt-2 text-center">
            {step >= 7 && totalFreeMonths > 0 ? (
              <span data-testid="text-free-months-unlocked" className="text-sm bg-accent/30 px-3 py-1 rounded-full">
                <Sparkles className="w-3 h-3 inline mr-1" />
                {totalFreeMonths} Complimentary Month{totalFreeMonths > 1 ? 's' : ''} Earned!
              </span>
            ) : (
              <span data-testid="text-free-months-available" className="text-sm bg-white/20 px-3 py-1 rounded-full">
                Complimentary months may apply based on commitment
              </span>
            )}
          </div>
        )}
        {isHOA && step > 1 && step < 9 && (
          <div className="mt-2 text-center">
            <span data-testid="text-custom-quote" className="text-sm bg-accent/30 px-3 py-1 rounded-full">
              Custom Quote Request
            </span>
          </div>
        )}
      </div>

      {/* Step Progress Labels */}
      {!isHOA && step > 1 && step < 9 && (
        <div className="px-4 pt-2 bg-muted/20">
          <WizardProgress currentStep={step} steps={STEPS} />
        </div>
      )}

      {/* Step Content */}
      <div className="p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* Step 1: Property Type Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">What are you servicing?</h3>
                <p className="text-muted-foreground">Select your property type to get started.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  data-testid="property-residential"
                  onClick={() => setPropertyType('residential')}
                  className={`p-6 rounded-xl border-2 transition-all text-center ${
                    propertyType === 'residential'
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-4xl mb-2">🏠</div>
                  <div className="font-bold text-lg">Residential</div>
                  <div className="text-xs text-muted-foreground">Single family home</div>
                </button>
                <button
                  data-testid="property-hoa"
                  onClick={() => setPropertyType('hoa')}
                  className={`p-6 rounded-xl border-2 transition-all text-center ${
                    propertyType === 'hoa'
                      ? 'border-accent bg-accent/10 shadow-lg'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div className="text-4xl mb-2">🏘️</div>
                  <div className="font-bold text-lg">Multi-Home Community</div>
                  <div className="text-xs text-muted-foreground">Or properties over 1 acre</div>
                </button>
              </div>

              {/* HOA-specific fields */}
              {isHOA && (
                <div className="space-y-3 bg-accent/5 rounded-xl p-4 border border-accent/20">
                  <div>
                    <Label htmlFor="hoaName">Community / Property Name *</Label>
                    <Input
                      id="hoaName"
                      data-testid="input-hoa-name"
                      value={hoaName}
                      onChange={(e) => setHoaName(e.target.value)}
                      placeholder="e.g., Oak Valley HOA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hoaAcreage">Estimated Acreage *</Label>
                    <Input
                      id="hoaAcreage"
                      data-testid="input-hoa-acreage"
                      value={hoaAcreage}
                      onChange={(e) => setHoaAcreage(e.target.value)}
                      placeholder="e.g., 5 acres"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hoaUnits">Number of Units (optional)</Label>
                    <Input
                      id="hoaUnits"
                      data-testid="input-hoa-units"
                      value={hoaUnits}
                      onChange={(e) => setHoaUnits(e.target.value)}
                      placeholder="e.g., 50 homes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hoaNotes">Additional Notes (optional)</Label>
                    <Input
                      id="hoaNotes"
                      data-testid="input-hoa-notes"
                      value={hoaNotes}
                      onChange={(e) => setHoaNotes(e.target.value)}
                      placeholder="Any special requirements..."
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We can service any residential property. Larger properties and communities receive a custom quote within 1 business day.
                  </p>
                </div>
              )}

              {/* Trust badges for residential */}
              {!isHOA && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>25+ Years Experience</span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>100+ Awards</span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>AI-Powered Savings</span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>No Obligation Quote</span>
                  </div>
                </div>
              )}

              <button
                data-testid="info-about"
                onClick={() => showInfo("About Lawn Trooper", (
                  <div className="space-y-3">
                    <p>Lawn Trooper is built on commitment, efficiency, and loyalty. We've spent decades putting relationships before scale.</p>
                    <p>As we adopt new automation, technology, and processes, we're passing those savings back to our customers.</p>
                    <p className="font-semibold text-primary">Commit to us, and we commit to you.</p>
                  </div>
                ))}
                className="text-sm text-primary underline mx-auto block"
              >
                Learn more about us
              </button>
            </motion.div>
          )}

          {/* Step 2: Yard Size */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">How big is your yard?</h3>
                <p className="text-muted-foreground text-sm">Select the size closest to your property</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {YARD_SIZES.map((size) => (
                  <button
                    key={size.id}
                    data-testid={`yard-${size.id}`}
                    onClick={() => setYardSize(size.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      yardSize === size.id
                        ? 'border-primary bg-primary/10 shadow-lg scale-105'
                        : 'border-border hover:border-primary/50 bg-muted/30'
                    }`}
                  >
                    <div className="text-3xl mb-1">🏡</div>
                    <div className="text-lg font-bold text-primary">{size.label}</div>
                    <div className="text-xs text-muted-foreground">{size.subtitle}</div>
                  </button>
                ))}
              </div>

              <button
                data-testid="info-yard-size"
                onClick={() => showInfo("Yard Size Info", (
                  <div className="space-y-2">
                    <p>Not sure of your yard size? Here's a quick guide:</p>
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      <li><strong>Up to 1/3 acre:</strong> Typical small suburban lot</li>
                      <li><strong>1/3 - 2/3 acre:</strong> Average neighborhood home</li>
                      <li><strong>2/3 - 1 acre:</strong> Larger lot with more lawn</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">{GLOBAL_CONSTANTS.YARD_ELIGIBILITY}</p>
                  </div>
                ))}
                className="text-sm text-primary underline mx-auto block"
              >
                Not sure? Tap here for help
              </button>
            </motion.div>
          )}

          {/* Step 3: Plan Selection + Details Panel */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <PromoBanner />

              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">Choose the Best Fit for Your Yard</h3>
                <p className="text-muted-foreground text-sm">Simple plan tiers with clear upgrade credits and commitment rewards.</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Licensed • Insured • Satisfaction Guaranteed</p>
              </div>
              <CompactPlanBanner />

              {/* Mobile comparison cards */}
              <MobileComparisonCards />

              {/* Desktop comparison table */}
              <div className="hidden md:block bg-muted/30 rounded-xl border border-border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 text-muted-foreground font-medium">Feature</th>
                      <th className="text-center py-3 px-3 font-bold text-primary">Standard</th>
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

              <div className="space-y-3">
                {PLANS.map((p) => {
                  const isSelected = plan === p.id;
                  const isExecutive = p.id === 'executive';
                  const isPremium = p.id === 'premium';
                  return (
                    <div key={p.id}>
                      <button
                        data-testid={`plan-${p.id}`}
                        onClick={() => {
                          const previousPlan = plan;
                          setPlan(p.id);
                          if (p.id !== 'executive') {
                            setExecutivePlus(false);
                          }
                          if (p.id === 'basic' && previousPlan !== 'basic') {
                            setPremiumAddons([]);
                          }
                        }}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left relative ${
                          isPremium
                            ? `border-primary ${isSelected ? 'bg-primary/10 shadow-xl ring-2 ring-primary/30 ring-offset-2' : 'bg-primary/5 hover:border-primary'}`
                            : isExecutive 
                              ? `border-accent ${isSelected ? 'bg-accent/10 shadow-xl ring-2 ring-accent/30 ring-offset-2' : 'bg-accent/5 hover:border-accent'}`
                              : isSelected
                                ? 'border-primary bg-primary/10 shadow-xl ring-2 ring-primary/30 ring-offset-2'
                                : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {(isPremium || isExecutive) && (
                          <div className="absolute -top-3 left-4">
                            <PlanBadge planId={p.id} />
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-lg">{p.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{PLAN_VALUE_LINES_SW[p.id] || PLAN_VALUE_LINES_SW.basic}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">${calculate2026Price(p.id, yardSize || "1/3")}</div>
                            <div className="text-xs text-muted-foreground">/mo</div>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                          <div className="text-xs text-foreground/85 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                            <span className="font-medium">{formatIncludedUpgradeCopy(p.allowance.basic, p.allowance.premium)}</span>
                          </div>
                          <div className={`mt-1.5 px-2.5 py-1.5 rounded-lg border text-center ${isExecutive ? 'bg-accent/10 border-accent/30' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">25-Year Anniversary Client Rewards</div>
                            <div className={`text-xs font-bold ${isExecutive ? 'text-accent' : 'text-primary'}`}>
                              {COMMITMENT_COPY.twoYearBonus}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Selected
                          </div>
                        )}
                      </button>

                    </div>
                  );
                })}
              </div>

              {/* View Upgrade Examples */}
              <UpgradeFlexibilitySection />
              <TotalSavingsBox summary={savingsSummary} />
            </motion.div>
          )}

          {/* Step 4: Upgrades */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">Choose Your Upgrades</h3>
                <p className="text-muted-foreground text-sm">
                  Pick the upgrades that fit your property best. Your plan includes {includedCredits} upgrade credits.
                </p>
                <p className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  You have {includedCredits} upgrade credits. {UPGRADE_CREDIT_COPY.tierLegend}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{UPGRADE_CREDIT_COPY.mixLine}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-accent">
                  Credits remaining: {remainingCredits}
                </p>
              </div>
              <CompactPlanBanner />

              {!isHOA && !canProceed() && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 font-medium" data-testid="credit-requirement-message">
                  {getCreditRequirementMessage()}
                </div>
              )}
              {!isHOA && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <img src={imgShrub} alt="Healthy shrubs after professional care" className="h-28 w-full object-cover" />
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
              )}

              {/* Selection Counter with Live Pricing */}
              <div data-testid="addon-counter" className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4 text-sm space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wide text-primary">Credit Counter</div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Selected:</span>
                  <span>
                    <span className="font-bold text-primary">
                      {basicAddons.length} Standard
                    </span>
                    <span>, </span>
                    <span className="font-bold text-accent">
                      {premiumAddons.length} Premium
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Used / Included:</span>
                  <span className="text-xl font-extrabold text-primary">{usedCredits} / {includedCredits}</span>
                </div>
                <div className="flex justify-between items-center text-accent font-semibold">
                  <span>Remaining:</span>
                  <span>{Math.max(0, includedCredits - usedCredits)} credit{Math.max(0, includedCredits - usedCredits) === 1 ? "" : "s"}</span>
                </div>
                <div className="text-[11px] font-semibold text-primary/80">
                  Rule: {UPGRADE_CREDIT_COPY.tierLegendTight}
                </div>
                {extraCredits > 0 && (
                  <div className="flex justify-between items-center pt-1 border-t border-border/50 text-amber-600">
                    <span>Extra:</span>
                    <span className="font-bold">+{extraCredits} credit{extraCredits === 1 ? "" : "s"}</span>
                  </div>
                )}
              </div>
              {!isHOA && canProceed() && (
                <div className="rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-center text-sm font-semibold text-green-700">
                  <Sparkles className="mr-1 inline h-4 w-4" />
                  Mission bonus unlocked: your selections are dialed in.
                </div>
              )}

              <div className="space-y-3 max-h-[320px] overflow-y-auto scroll-smooth pr-1">
                {/* BASIC ADD-ONS - Always visible for all plans */}
                <div>
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2 sticky top-0 bg-background py-1">
                    Standard Upgrades ({basicAddons.length} selected, {basicAddons.length} credits)
                  </div>
                  
                  {/* Landscaping */}
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-2">Landscaping</div>
                  {ADDON_CATALOG.filter(a => a.tier === 'basic' && a.category === 'landscaping').map((addon) => {
                    const isSelected = basicAddons.includes(addon.id);
                    const disableNewSelection = !isSelected && !canAddStandardUpgrade;
                    return (
                      <div key={addon.id} className="mb-1.5">
                        <div className="flex items-center gap-2">
                          <button
                            data-testid={`addon-${addon.id}`}
                            onClick={() => {
                              if (disableNewSelection) return;
                              if (isSelected) {
                                setBasicAddons(basicAddons.filter(id => id !== addon.id));
                              } else {
                                setBasicAddons([...basicAddons, addon.id]);
                              }
                            }}
                            disabled={disableNewSelection}
                            className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : disableNewSelection
                                  ? 'border-border opacity-60 cursor-not-allowed'
                                  : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="font-medium text-sm">{addon.name}</span>
                            {addon.popularity && (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPopularityBadgeClass(addon.popularity)}`}>
                                {getPopularityBadgeLabel(addon.popularity)}
                              </span>
                            )}
                          </button>
                          <button
                            type="button"
                            data-testid={`info-addon-${addon.id}`}
                            onClick={() => showInfo(addon.name, <p>{addon.description}</p>)}
                            className="text-muted-foreground hover:text-primary p-1"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                        <UpgradeDetails upgradeId={addon.id} />
                      </div>
                    );
                  })}
                  
                  {/* Cleaning & Wash */}
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-3">Cleaning & Wash</div>
                  {ADDON_CATALOG.filter(a => a.tier === 'basic' && a.category === 'cleaning').map((addon) => {
                    const isSelected = basicAddons.includes(addon.id);
                    const disableNewSelection = !isSelected && !canAddStandardUpgrade;
                    return (
                      <div key={addon.id} className="mb-1.5">
                        <div className="flex items-center gap-2">
                          <button
                            data-testid={`addon-${addon.id}`}
                            onClick={() => {
                              if (disableNewSelection) return;
                              if (isSelected) {
                                setBasicAddons(basicAddons.filter(id => id !== addon.id));
                              } else {
                                setBasicAddons([...basicAddons, addon.id]);
                              }
                            }}
                            disabled={disableNewSelection}
                            className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : disableNewSelection
                                  ? 'border-border opacity-60 cursor-not-allowed'
                                  : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="font-medium text-sm">{addon.name}</span>
                            {addon.popularity && (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPopularityBadgeClass(addon.popularity)}`}>
                                {getPopularityBadgeLabel(addon.popularity)}
                              </span>
                            )}
                          </button>
                          <button
                            type="button"
                            data-testid={`info-addon-${addon.id}`}
                            onClick={() => showInfo(addon.name, <p>{addon.description}</p>)}
                            className="text-muted-foreground hover:text-primary p-1"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                        <UpgradeDetails upgradeId={addon.id} />
                      </div>
                    );
                  })}
                  
                  {/* Trash Can Cleaning */}
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-3">Trash Can Cleaning</div>
                  {ADDON_CATALOG.filter(a => a.tier === 'basic' && a.category === 'trash').map((addon) => {
                    const isSelected = basicAddons.includes(addon.id);
                    const disableNewSelection = !isSelected && !canAddStandardUpgrade;
                    return (
                      <div key={addon.id} className="mb-1.5">
                        <div className="flex items-center gap-2">
                          <button
                            data-testid={`addon-${addon.id}`}
                            onClick={() => {
                              if (disableNewSelection) return;
                              if (isSelected) {
                                setBasicAddons(basicAddons.filter(id => id !== addon.id));
                              } else {
                                setBasicAddons([...basicAddons, addon.id]);
                              }
                            }}
                            disabled={disableNewSelection}
                            className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : disableNewSelection
                                  ? 'border-border opacity-60 cursor-not-allowed'
                                  : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="font-medium text-sm">{addon.name}</span>
                            {addon.popularity && (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPopularityBadgeClass(addon.popularity)}`}>
                                {getPopularityBadgeLabel(addon.popularity)}
                              </span>
                            )}
                          </button>
                          <button
                            type="button"
                            data-testid={`info-addon-${addon.id}`}
                            onClick={() => showInfo(addon.name, <p>{addon.description}</p>)}
                            className="text-muted-foreground hover:text-primary p-1"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                        <UpgradeDetails upgradeId={addon.id} />
                      </div>
                    );
                  })}
                  
                  {/* Seasonal / Christmas Lights (Basic) */}
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-3">Seasonal / Christmas Lights</div>
                  {ADDON_CATALOG.filter(a => a.tier === 'basic' && a.category === 'seasonal').map((addon) => {
                    const isSelected = basicAddons.includes(addon.id);
                    const disableNewSelection = !isSelected && !canAddStandardUpgrade;
                    return (
                      <div key={addon.id} className="mb-1.5">
                        <div className="flex items-center gap-2">
                          <button
                            data-testid={`addon-${addon.id}`}
                            onClick={() => {
                              if (disableNewSelection) return;
                              if (isSelected) {
                                setBasicAddons(basicAddons.filter(id => id !== addon.id));
                              } else {
                                setBasicAddons([...basicAddons, addon.id]);
                              }
                            }}
                            disabled={disableNewSelection}
                            className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : disableNewSelection
                                  ? 'border-border opacity-60 cursor-not-allowed'
                                  : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="font-medium text-sm">{addon.name}</span>
                          </button>
                          <button
                            type="button"
                            data-testid={`info-addon-${addon.id}`}
                            onClick={() => showInfo(addon.name, <p>{addon.description}</p>)}
                            className="text-muted-foreground hover:text-primary p-1"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                        <UpgradeDetails upgradeId={addon.id} />
                      </div>
                    );
                  })}
                </div>

                {/* PREMIUM ADD-ONS - Only for Premium and Executive plans */}
                {(plan === 'premium' || plan === 'executive') && (
                  <div className="pt-3 border-t border-accent/30">
                    <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2 sticky top-0 bg-background py-1">
                      Premium Upgrades ({premiumAddons.length} selected, {premiumAddons.length * PREMIUM_CREDIT_COST} credits)
                    </div>
                    
                    {/* Premium Landscaping */}
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Landscaping</div>
                    {ADDON_CATALOG.filter(a => a.tier === 'premium' && a.category === 'landscaping').map((addon) => {
                      const isSelected = premiumAddons.includes(addon.id);
                      const disableNewSelection = !isSelected && !canAddPremiumUpgrade;
                      return (
                        <div key={addon.id} className="mb-1.5">
                          <div className="flex items-center gap-2">
                            <button
                              data-testid={`addon-${addon.id}`}
                              onClick={() => {
                                if (disableNewSelection) return;
                                if (isSelected) {
                                  setPremiumAddons(premiumAddons.filter(id => id !== addon.id));
                                } else {
                                  setPremiumAddons([...premiumAddons, addon.id]);
                                }
                              }}
                              disabled={disableNewSelection}
                              className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                                isSelected
                                  ? 'border-accent bg-accent/10'
                                  : disableNewSelection
                                    ? 'border-border opacity-60 cursor-not-allowed'
                                    : 'border-border hover:border-accent/50'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-accent border-accent' : 'border-muted-foreground'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="font-medium text-sm">{addon.name}</span>
                              <Star className="w-3 h-3 text-accent ml-auto flex-shrink-0" />
                            {addon.popularity && (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPopularityBadgeClass(addon.popularity)}`}>
                                {getPopularityBadgeLabel(addon.popularity)}
                              </span>
                            )}
                            </button>
                            <button
                              type="button"
                              data-testid={`info-addon-${addon.id}`}
                              onClick={() => showInfo(addon.name, <p>{addon.description}</p>)}
                              className="text-muted-foreground hover:text-accent p-1"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </div>
                          <UpgradeDetails upgradeId={addon.id} />
                        </div>
                      );
                    })}
                    
                    {/* Premium Cleaning */}
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-3">Cleaning & Wash</div>
                    {ADDON_CATALOG.filter(a => a.tier === 'premium' && a.category === 'cleaning').map((addon) => {
                      const isSelected = premiumAddons.includes(addon.id);
                      const disableNewSelection = !isSelected && !canAddPremiumUpgrade;
                      return (
                        <div key={addon.id} className="mb-1.5">
                          <div className="flex items-center gap-2">
                            <button
                              data-testid={`addon-${addon.id}`}
                              onClick={() => {
                                if (disableNewSelection) return;
                                if (isSelected) {
                                  setPremiumAddons(premiumAddons.filter(id => id !== addon.id));
                                } else {
                                  setPremiumAddons([...premiumAddons, addon.id]);
                                }
                              }}
                              disabled={disableNewSelection}
                              className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                                isSelected
                                  ? 'border-accent bg-accent/10'
                                  : disableNewSelection
                                    ? 'border-border opacity-60 cursor-not-allowed'
                                    : 'border-border hover:border-accent/50'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-accent border-accent' : 'border-muted-foreground'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="font-medium text-sm">{addon.name}</span>
                              <Star className="w-3 h-3 text-accent ml-auto flex-shrink-0" />
                            {addon.popularity && (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPopularityBadgeClass(addon.popularity)}`}>
                                {getPopularityBadgeLabel(addon.popularity)}
                              </span>
                            )}
                            </button>
                            <button
                              type="button"
                              data-testid={`info-addon-${addon.id}`}
                              onClick={() => showInfo(addon.name, <p>{addon.description}</p>)}
                              className="text-muted-foreground hover:text-accent p-1"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </div>
                          <UpgradeDetails upgradeId={addon.id} />
                        </div>
                      );
                    })}
                    
                    {/* Premium Seasonal */}
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-3">Seasonal / Christmas Lights</div>
                    {ADDON_CATALOG.filter(a => a.tier === 'premium' && a.category === 'seasonal').map((addon) => {
                      const isSelected = premiumAddons.includes(addon.id);
                      const disableNewSelection = !isSelected && !canAddPremiumUpgrade;
                      return (
                        <div key={addon.id} className="mb-1.5">
                          <div className="flex items-center gap-2">
                            <button
                              data-testid={`addon-${addon.id}`}
                              onClick={() => {
                                if (disableNewSelection) return;
                                if (isSelected) {
                                  setPremiumAddons(premiumAddons.filter(id => id !== addon.id));
                                } else {
                                  setPremiumAddons([...premiumAddons, addon.id]);
                                }
                              }}
                              disabled={disableNewSelection}
                              className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                                isSelected
                                  ? 'border-accent bg-accent/10'
                                  : disableNewSelection
                                    ? 'border-border opacity-60 cursor-not-allowed'
                                    : 'border-border hover:border-accent/50'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-accent border-accent' : 'border-muted-foreground'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="font-medium text-sm">{addon.name}</span>
                              <Star className="w-3 h-3 text-accent ml-auto flex-shrink-0" />
                            {addon.popularity && (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPopularityBadgeClass(addon.popularity)}`}>
                                {getPopularityBadgeLabel(addon.popularity)}
                              </span>
                            )}
                            </button>
                            <button
                              type="button"
                              data-testid={`info-addon-${addon.id}`}
                              onClick={() => showInfo(addon.name, <p>{addon.description}</p>)}
                              className="text-muted-foreground hover:text-accent p-1"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </div>
                          <UpgradeDetails upgradeId={addon.id} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* EXECUTIVE EXCLUSIVES - Only for Executive plan */}
                {plan === 'executive' && selectedPlan?.executiveExtras && (
                  <div className="pt-3 border-t border-accent/30">
                    <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                      Executive Exclusives (Included)
                    </div>
                    <div className="space-y-1">
                      {selectedPlan.executiveExtras.map((extra, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-accent/5 rounded-lg border border-accent/20">
                          <div className="w-5 h-5 rounded bg-accent flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium text-sm text-accent">{extra}</span>
                          <Trophy className="w-3 h-3 text-accent ml-auto flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Tap the info icon for details. You can always adjust upgrades later.
              </p>
              
              {/* Seasonal Scheduling Disclaimer */}
              <p className="text-[10px] text-center text-muted-foreground/70 mt-2">
                Some upgrade services are seasonal and may be scheduled during appropriate times of the year or during off-season periods when our schedule allows.
              </p>
            </motion.div>
          )}

          {/* Step 5: Yard Analysis */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <YardScorecard />
            </motion.div>
          )}

          {/* Step 6: Transformation Preview */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TransformationPreview />
            </motion.div>
          )}

          {/* Step 7: Commitment */}
          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">Choose your commitment</h3>
                <p className="text-muted-foreground text-sm">{COMMITMENT_COPY.promoIntro}</p>
              </div>
              <CompactPlanBanner />

              <div className="space-y-3">
                {COMMITMENT_TERMS.map((t) => {
                  const isSelected = term === t.id;
                  const isBestValue = t.id === '2-year';
                  const optionPayInFull = isSelected ? payInFull : false;
                  const displayFreeMonths = calculateTermFreeMonths(t.id as '1-year' | '2-year', optionPayInFull);
                  const optionMonthly = isHOA ? 0 : calculateActualMonthly(basePrice + totalOverage, t.id as '1-year' | '2-year');
                  const optionSavings = optionMonthly * displayFreeMonths;
                  return (
                    <div key={t.id}>
                      <button
                        data-testid={`term-${t.id}`}
                        onClick={() => {
                          setTerm(t.id as '1-year' | '2-year');
                        }}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between relative ${
                          isBestValue
                            ? `border-accent ${isSelected ? 'bg-accent/10 shadow-lg' : 'bg-accent/5'}`
                            : isSelected
                              ? 'border-primary bg-primary/10 shadow-lg'
                              : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {isBestValue && (
                          <div className="absolute -top-2 left-4 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            RECOMMENDED
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-lg">{t.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {t.shortDescription || t.description}
                          </div>
                        </div>
                        <div className="text-right">
                          {displayFreeMonths > 0 ? (
                            <>
                              <div className="text-xl font-bold text-green-600">+{displayFreeMonths}</div>
                              <div className="text-xs text-muted-foreground">complimentary</div>
                              {optionSavings > 0 && (
                                <div className="text-[11px] text-green-700 font-semibold">
                                  Save ${optionSavings.toLocaleString()}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-muted-foreground">{t.badge}</div>
                          )}
                        </div>
                      </button>
                      
                      {/* Pay-in-Full Accelerator Toggle - Optional for 1-year and 2-year */}
                      {t.allowsPayInFull && isSelected && (
                        <div className="mt-3 ml-4 space-y-2">
                          {/* Anniversary Commitment Bonus Section */}
                          <div className="p-2 bg-primary/5 border border-primary/20 rounded-lg">
                            <div className="text-xs font-bold text-primary mb-1">Commitment Savings</div>
                            <div className="text-[10px] text-muted-foreground space-y-0.5">
                              <div className="flex justify-between"><span>{COMMITMENT_COPY.oneYearLine}</span></div>
                              <div className="flex justify-between"><span>{COMMITMENT_COPY.twoYearLine}</span></div>
                              <div className="flex justify-between text-green-600 font-medium"><span>{COMMITMENT_COPY.payInFullBonus}</span></div>
                            </div>
                            <div className="mt-1 text-[10px] text-muted-foreground">
                              Monthly pricing is primary for launch. Your account manager confirms payment options after quote submission.
                            </div>
                            <div className="mt-1 text-[10px] text-muted-foreground">{COMMITMENT_COPY.maxLine}</div>
                            <div className="mt-0.5 text-[10px] text-muted-foreground">{COMMITMENT_COPY.loyaltyLine}</div>
                          </div>
                          
                          <button
                            data-testid="toggle-pay-in-full"
                            onClick={() => setPayInFull(!payInFull)}
                            className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                              payInFull
                                ? 'border-green-500 bg-green-50'
                                : 'border-border hover:border-green-500/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                payInFull ? 'border-green-500 bg-green-500' : 'border-gray-300'
                              }`}>
                                {payInFull && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <div className="text-left">
                                <div className="font-medium">See Pay-in-Full Savings (Optional)</div>
                                <div className="text-xs text-muted-foreground">{COMMITMENT_COPY.payInFullBonus}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                ×2 MONTHS
                              </div>
                              <div className="text-xs text-green-600 font-bold mt-1">
                                {t.id === '1-year' ? '1 → 2 months' : '3 → 6 months'}
                              </div>
                            </div>
                          </button>
                          
                          <p className="text-[10px] text-center text-muted-foreground">
                            Monthly pricing is primary for launch. Your account manager confirms payment options after quote submission.
                          </p>
                          {payInFull && payInFullExtraSavings > 0 && (
                            <p className="text-[11px] text-center text-green-700 font-semibold">
                              Pay-in-full adds +{payInFullExtraMonths} month{payInFullExtraMonths === 1 ? '' : 's'} = +${payInFullExtraSavings.toLocaleString()} savings
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pricing Summary */}
              {basePrice > 0 && (
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 space-y-3">
                  {totalFreeMonths > 0 && (
                    <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-center">
                      <div className="text-xs uppercase tracking-wide text-green-700 font-bold">Complimentary Months Earned</div>
                      <div className="text-lg font-extrabold text-green-700">
                        {totalFreeMonths} complimentary month{totalFreeMonths === 1 ? '' : 's'}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Monthly subscription:</span>
                    <span className="text-2xl font-bold text-primary">${monthlySubscription}/mo</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Complimentary months:</span>
                      <span className="font-bold text-green-600">{totalFreeMonths} month{totalFreeMonths !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5 ml-2">
                      <div className="flex justify-between">
                        <span>• Commitment Bonus:</span>
                        <span>{payInFull ? `${freeMonthsBreakdown.commitmentBase} × 2 = ${freeMonthsBreakdown.commitmentMonths}` : `+${freeMonthsBreakdown.commitmentBase}`} mo</span>
                      </div>
                      {freeMonthsBreakdown.anniversaryBonus > 0 && (
                        <div className="flex justify-between">
                          <span>• Anniversary Sale Bonus:</span>
                          <span>+{freeMonthsBreakdown.anniversaryBonus} mo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span>Billed months:</span>
                      <span className="font-medium">{billedMonths} of {termMonths}</span>
                    </div>
                    {totalCommitmentSavings > 0 && (
                      <div className="flex justify-between text-green-700 font-semibold">
                        <span>Total commitment savings:</span>
                        <span>${totalCommitmentSavings.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {payInFull && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                      <button
                        type="button"
                        onClick={() => setShowPayInFullTotal((prev) => !prev)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-bold text-green-700">See pay-in-full estimate</div>
                          <ChevronDown className={`h-4 w-4 text-green-700 transition-transform ${showPayInFullTotal ? "rotate-180" : ""}`} />
                        </div>
                      </button>
                      {showPayInFullTotal && (
                        <div className="mt-2 border-t border-green-200 pt-2 text-center">
                          <div className="text-2xl font-bold text-green-800">
                            ${(monthlySubscription * billedMonths).toLocaleString()}
                          </div>
                          <div className="text-sm text-green-600">
                            Estimated total if approved with your account manager. You still receive {termMonths} months while paying for {billedMonths}.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <TotalSavingsBox summary={savingsSummary} />

            </motion.div>
          )}

          {/* Step 8: Contact */}
          {step === 8 && (
            <motion.div
              key="step8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">Almost there!</h3>
                <p className="text-muted-foreground text-sm">Enter your info to reserve your plan</p>
              </div>
              <CompactPlanBanner />

              {/* Summary Card - Different for HOA vs Residential */}
              {isHOA ? (
                <div data-testid="card-hoa-summary" className="bg-accent/5 rounded-xl p-4 border border-accent/20">
                  <div className="text-center space-y-2">
                    <div className="text-xl font-bold text-accent">Custom Quote Request</div>
                    <div className="text-sm text-muted-foreground">
                      <strong>{hoaName}</strong> - {hoaAcreage}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We'll review your property details and provide a custom quote within 1 business day.
                    </p>
                  </div>
                </div>
              ) : (
                <div data-testid="card-summary" className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="flex justify-between items-center mb-2">
                    <span data-testid="text-selected-plan" className="font-bold">{selectedPlan?.name}</span>
                    <span data-testid="text-monthly-price" className="text-xl font-bold text-primary">${actualMonthly}/mo</span>
                  </div>
                  <div className="flex gap-2 flex-wrap text-xs mb-2">
                    {totalFreeMonths > 0 && (
                      <span data-testid="text-free-months-summary" className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {totalFreeMonths} Complimentary Month{totalFreeMonths > 1 ? 's' : ''}
                      </span>
                    )}
                    <span data-testid="text-yard-size" className="bg-muted px-2 py-0.5 rounded">{selectedYard?.label}</span>
                    <span data-testid="text-term" className="bg-muted px-2 py-0.5 rounded">{selectedTerm?.label}</span>
                  </div>
                  {/* Upgrades summary */}
                  <div className="text-xs border-t border-border/50 pt-2 mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Upgrades:</span>
                      <span>{basicAddons.length} Standard, {premiumAddons.length} Premium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Included:</span>
                      <span>{includedCredits} total credits</span>
                    </div>
                  </div>
                </div>
              )}
              {!isHOA && <TotalSavingsBox summary={savingsSummary} />}

              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    data-testid="input-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    data-testid="input-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(256) 795-2949"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    data-testid="input-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              {/* Privacy Reassurance */}
              <div data-testid="text-privacy" className="text-center bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium">
                  No payment today. We never sell your info.
                </p>
                <p className="text-xs text-green-700 mt-1">{ANNIVERSARY_DEADLINE_LINE}</p>
              </div>
            </motion.div>
          )}

          {/* Step 9: Complete */}
          {step === 9 && (
            <motion.div
              key="step9"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-10 h-10 text-green-600" />
              </div>
              
              <div>
                <h3 data-testid="text-complete-title" className="text-2xl font-bold text-primary mb-2">Mission Accomplished!</h3>
                <p data-testid="text-complete-subtitle" className="text-muted-foreground">
                  {isHOA ? "Your custom quote request is reserved." : "Your plan is reserved, General."}
                </p>
              </div>

              {/* HOA Confirmation */}
              {isHOA ? (
                <div data-testid="card-hoa-confirmation" className="bg-accent/5 rounded-xl p-4 border border-accent/20 text-left">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block">Property</span>
                      <span className="font-bold">{hoaName}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Acreage</span>
                      <span className="font-bold">{hoaAcreage}</span>
                    </div>
                    {hoaUnits && (
                      <div>
                        <span className="text-xs text-muted-foreground block">Units</span>
                        <span className="font-bold">{hoaUnits}</span>
                      </div>
                    )}
                    <div className="pt-2 text-center">
                      <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-bold">
                        Custom Quote Pending
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div data-testid="card-confirmation" className="bg-primary/5 rounded-xl p-4 border border-primary/20 text-left">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block">Plan</span>
                      <span data-testid="text-confirm-plan" className="font-bold">{selectedPlan?.name}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Monthly</span>
                      <span data-testid="text-confirm-price" className="font-bold text-primary">${actualMonthly}/mo</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Commitment</span>
                      <span data-testid="text-confirm-term" className="font-bold">{selectedTerm?.label}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Complimentary</span>
                      <span data-testid="text-confirm-free-months" className="font-bold text-green-600">{totalFreeMonths} mo</span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground block">Upgrades</span>
                      <span data-testid="text-confirm-addons" className="font-bold">
                        {basicAddons.length} Standard, {premiumAddons.length} Premium
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-accent/10 rounded-xl p-4 border border-accent/30">
                <p className="font-bold text-primary">No payment collected today. No obligation.</p>
                <p className="text-sm text-accent">{isHOA ? "Free Property Consultation" : "Reserved Plan Confirmation"}</p>
                {!isHOA && (
                  <p className="text-xs text-primary mt-1">Full refund if you decide not to enlist during consultation.</p>
                )}
              </div>

              <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>What's next?</strong> We'll reach out within 1 business day to {isHOA ? "discuss your custom quote" : "schedule your free consultation"}.
                </p>
              </div>

              {/* Anniversary Promo Reminder */}
              <PromoBanner />

              {/* Neighborhood Offer */}
              {!isHOA && <NeighborhoodOffer />}

              {/* Robot Mowing Waitlist */}
              {!isHOA && <RobotWaitlist />}

              {/* Cancellation Policy - Residential only */}
              {!isHOA && (
                <div className="text-left text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  <p className="font-medium mb-1">Cancellation Policy:</p>
                  <p>Subscriptions may be canceled early at any time; complimentary months and unused credits are forfeited if canceled before the term ends.</p>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Footer Navigation */}
      <div className="sticky bottom-0 z-20 border-t-2 border-primary/20 bg-card shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        {step >= 3 && step < 9 && !isHOA && selectedPlan && (
          <div className="px-4 py-2 bg-primary/5 border-b border-primary/10">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-primary">{selectedPlan.name}</span>
                {yardSize && (
                  <span className="text-muted-foreground text-xs">
                    {YARD_SIZES.find(y => y.id === yardSize)?.label} yard
                  </span>
                )}
              </div>
              <div className="font-bold text-primary text-lg whitespace-nowrap">
                ${actualMonthly}/mo
              </div>
            </div>
          </div>
        )}
        <div className="p-4 flex gap-3">
          {step > 1 && step < 9 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
              data-testid="button-back"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          
          {step < 8 && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-primary hover:bg-primary/90"
              data-testid="button-next"
            >
              {step === 1 ? "Reserve My Plan" : "Continue"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {step === 8 && (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="flex-1 bg-accent hover:bg-accent/90 text-white"
              data-testid="button-submit"
            >
              {isSubmitting ? "Submitting..." : (isHOA ? "Request Custom Quote" : "Reserve My Plan")}
            </Button>
          )}

          {step === 9 && (
            <Button
              onClick={() => {
                setStepWithStableScroll(1);
                setPropertyType('residential');
                setHoaName("");
                setHoaAcreage("");
                setHoaUnits("");
                setHoaNotes("");
                setYardSize("");
                setPlan("premium");
                setBasicAddons([]);
                setPremiumAddons([]);
                setTerm('2-year');
                setPayInFull(false);
                setName("");
                setEmail("");
                setPhone("");
                setAddress("");
                setPromoCode("");
                setIsComplete(false);
              }}
              variant="outline"
              className="flex-1"
              data-testid="button-restart"
            >
              Start New Quote
            </Button>
          )}
        </div>
      </div>

      {/* Info Popup */}
      <InfoPopup
        open={infoPopup.open}
        onClose={() => setInfoPopup({ ...infoPopup, open: false })}
        title={infoPopup.title}
        content={infoPopup.content}
      />
    </div>
  );
}
