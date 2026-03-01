import React, { useState } from "react";
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
import PlanDetailsPanel from "@/components/PlanDetailsPanel";
import { 
  PLANS, 
  YARD_SIZES, 
  GLOBAL_CONSTANTS, 
  ADDON_CATALOG,
  BASIC_ADDONS, 
  PREMIUM_ADDONS, 
  getYardMultiplier,
  getPlanAllowance,
  getPlanAllowanceLabel,
  getSwapOptions,
  EXECUTIVE_PLUS,
  calculateOverageCost,
  getAddonById,
  calculate2026Price
} from "@/data/plans";
import { PLAN_COMPARISON_ROWS } from "@/data/planComparison";
import { 
  COMMITMENT_TERMS, 
  HOA_PROMO_CODES,
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
  { id: 5, title: "Commitment", icon: Calendar },
  { id: 6, title: "Contact", icon: User },
  { id: 7, title: "Complete", icon: Trophy },
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

export type PropertyType = 'residential' | 'hoa';

export default function StreamlinedWizard() {
  const [step, setStep] = useState(1);
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
  const [swapCount, setSwapCount] = useState(0);
  const [executivePlus, setExecutivePlus] = useState(false);
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
  // Birthday Bonus terminology maps to commitment months (no extra stacking)
  const freeMonthsBreakdown = getFreeMonthsBreakdown(term, payInFull);
  const totalFreeMonths = freeMonthsBreakdown.total;
  
  const isExecutive = plan === 'executive';
  const swapOptions = getSwapOptions(plan, new Date(), executivePlus);
  const planBaseAllowance = getPlanAllowance(plan, 0, false, new Date(), executivePlus);
  const allowance = getPlanAllowance(plan, swapCount, false, new Date(), executivePlus);
  const effectiveBasicAllowance = allowance.basic;
  const effectivePremiumAllowance = allowance.premium;
  
  // Calculate overages
  const { basicOverage, premiumOverage, totalOverage } = calculateOverageCost(
    basicAddons.length,
    premiumAddons.length,
    effectiveBasicAllowance,
    effectivePremiumAllowance
  );
  const extraBasicCount = basicOverage;
  const extraPremiumCount = premiumOverage;
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

  const handleNext = () => {
    if (isHOA && step === 1) {
      setStep(6);
    } else if (step < 7) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (isHOA && step === 6) {
      setStep(1);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

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
        return basicAddons.length >= effectiveBasicAllowance && premiumAddons.length >= effectivePremiumAllowance;
      case 5: return true;
      case 6: return name && phone;
      default: return true;
    }
  };

  const getSlotRequirementMessage = () => {
    if (plan === "basic") return `Select ${effectiveBasicAllowance} Basic upgrade${effectiveBasicAllowance === 1 ? "" : "s"} to proceed.`;
    if (plan === "premium") return `Select ${effectiveBasicAllowance} Basic and ${effectivePremiumAllowance} Premium upgrade${effectivePremiumAllowance === 1 ? "" : "s"} to proceed. Conversion available.`;
    return `Select ${effectiveBasicAllowance} Basic and ${effectivePremiumAllowance} Premium upgrade${effectivePremiumAllowance === 1 ? "" : "s"} to proceed. Conversion available.`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
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
          propertyType,
          hoaName: isHOA ? hoaName : undefined,
          hoaAcreage: isHOA ? hoaAcreage : undefined,
          hoaUnits: isHOA ? hoaUnits : undefined,
          hoaNotes: isHOA ? hoaNotes : undefined,
        }),
      });
      
      if (response.ok) {
        setIsComplete(true);
        setStep(7);
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

  const progressPercent = ((step - 1) / 6) * 100;

  return (
    <div className="bg-card rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden max-w-2xl mx-auto">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-primary to-green-700 p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <h2 data-testid="text-wizard-title" className="text-xl font-bold font-heading uppercase tracking-wide">Build My Subscription</h2>
          <span data-testid="text-step-badge" className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Step {step} of 7
          </span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {!isHOA && step > 1 && step < 7 && (
          <div className="mt-2 text-center">
            {step >= 5 && totalFreeMonths > 0 ? (
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
        {isHOA && step > 1 && step < 7 && (
          <div className="mt-2 text-center">
            <span data-testid="text-custom-quote" className="text-sm bg-accent/30 px-3 py-1 rounded-full">
              Custom Quote Request
            </span>
          </div>
        )}
      </div>

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
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">Choose your Total Maintenance Plan</h3>
                <p className="text-muted-foreground text-sm">All plans include mowing, edging, trimming, and blowing.</p>
              </div>

              {/* Feature comparison matrix */}
              <div className="bg-muted/30 rounded-xl border border-border overflow-x-auto">
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
                          setSwapCount(0);
                          if (p.id !== 'executive') {
                            setExecutivePlus(false);
                          }
                          if (p.id === 'basic' && previousPlan !== 'basic') {
                            setPremiumAddons([]);
                          }
                        }}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left relative ${
                          isPremium
                            ? `border-primary ${isSelected ? 'bg-primary/10 shadow-lg ring-2 ring-primary/30' : 'bg-primary/5'}`
                            : isExecutive 
                              ? `border-accent ${isSelected ? 'bg-accent/10 shadow-lg' : 'bg-accent/5'}`
                              : isSelected
                                ? 'border-primary bg-primary/10 shadow-lg'
                                : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {isPremium && (
                          <div className="absolute -top-2 left-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            MOST POPULAR
                          </div>
                        )}
                        {isExecutive && (
                          <div className="absolute -top-2 right-4 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            BEST VALUE
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-lg">{p.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">${calculate2026Price(p.id, yardSize || "1/3")}</div>
                            <div className="text-xs text-muted-foreground">/mo</div>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-muted-foreground">Slots: </span>
                            <span className="font-bold text-primary">{p.allowance.basic}B</span>
                            {p.allowance.premium > 0 && (
                              <span className="font-bold text-accent"> + {p.allowance.premium}P</span>
                            )}
                          </div>
                          {p.allowsSwap && (
                            <span className="text-primary/70">Swap: 2B → 1P</span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <Check className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </button>

                      {isSelected && (
                        <div className="mt-3">
                          <PlanDetailsPanel
                            plan={plan as any}
                            executivePlus={executivePlus}
                            setExecutivePlus={setExecutivePlus}
                            swapCount={swapCount}
                            setSwapCount={setSwapCount}
                            basicAddons={basicAddons}
                            setBasicAddons={setBasicAddons}
                            premiumAddons={premiumAddons}
                            setPremiumAddons={setPremiumAddons}
                            effectiveBasicAllowance={effectiveBasicAllowance}
                            effectivePremiumAllowance={effectivePremiumAllowance}
                            showInfo={showInfo}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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
                <h3 className="text-2xl font-bold text-primary mb-2">Customize with upgrades</h3>
                <p className="text-muted-foreground text-sm">
                  Your plan includes {selectedPlan ? getPlanAllowanceLabel(selectedPlan.id, swapCount, false, new Date(), executivePlus) : "upgrades"} at no extra cost.
                </p>
              </div>

              {!isHOA && !canProceed() && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 font-medium" data-testid="slot-requirement-message">
                  {getSlotRequirementMessage()}
                </div>
              )}

              {/* Swap Toggle - Available for all plans with allowsSwap */}
              {selectedPlan?.allowsSwap && swapOptions.length > 1 && (
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">Upgrade Conversion</div>
                      <div className="text-xs text-muted-foreground">Convert 2 Basic → 1 Premium</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-bold text-primary">{effectiveBasicAllowance}B</div>
                      <div className="font-bold text-accent">{effectivePremiumAllowance}P</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {swapOptions.map((opt) => (
                      <button
                        key={opt.value}
                        data-testid={`swap-btn-${opt.value}`}
                        onClick={() => {
                          setSwapCount(opt.value);
                          const newAllowance = getPlanAllowance(plan, opt.value, false, new Date(), executivePlus);
                          if (premiumAddons.length > newAllowance.premium) {
                            setPremiumAddons(premiumAddons.slice(0, Math.max(0, newAllowance.premium)));
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

              {/* Selection Counter with Live Pricing */}
              <div data-testid="addon-counter" className="bg-muted rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Selected:</span>
                  <span>
                    <span className={`font-bold ${extraBasicCount > 0 ? 'text-amber-600' : 'text-primary'}`}>
                      {basicAddons.length} Basic
                    </span>
                    <span>, </span>
                    <span className={`font-bold ${extraPremiumCount > 0 ? 'text-amber-600' : 'text-accent'}`}>
                      {premiumAddons.length} Premium
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Included:</span>
                  <span>
                    <span className="font-bold text-primary">{effectiveBasicAllowance} Basic</span>
                    <span> + </span>
                    <span className="font-bold text-accent">{effectivePremiumAllowance} Premium</span>
                  </span>
                </div>
                {(extraBasicCount > 0 || extraPremiumCount > 0) && (
                  <div className="flex justify-between items-center pt-1 border-t border-border/50 text-amber-600">
                    <span>Extra:</span>
                    <span className="font-bold">
                      {extraBasicCount > 0 && `+${extraBasicCount} Basic`}
                      {extraBasicCount > 0 && extraPremiumCount > 0 && ', '}
                      {extraPremiumCount > 0 && `+${extraPremiumCount} Premium`}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto scroll-smooth pr-1">
                {/* BASIC ADD-ONS - Always visible for all plans */}
                <div>
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2 sticky top-0 bg-background py-1">
                    Basic Upgrades ({basicAddons.length}/{effectiveBasicAllowance} included free)
                  </div>
                  
                  {/* Landscaping */}
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-2">Landscaping</div>
                  {ADDON_CATALOG.filter(a => a.tier === 'basic' && a.category === 'landscaping').map((addon) => {
                    const isSelected = basicAddons.includes(addon.id);
                    return (
                      <div key={addon.id} className="flex items-center gap-2 mb-1">
                        <button
                          data-testid={`addon-${addon.id}`}
                          onClick={() => {
                            if (isSelected) {
                              setBasicAddons(basicAddons.filter(id => id !== addon.id));
                            } else {
                              setBasicAddons([...basicAddons, addon.id]);
                            }
                          }}
                          className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                            isSelected
                              ? 'border-primary bg-primary/10'
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
                    );
                  })}
                  
                  {/* Cleaning & Wash */}
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-3">Cleaning & Wash</div>
                  {ADDON_CATALOG.filter(a => a.tier === 'basic' && a.category === 'cleaning').map((addon) => {
                    const isSelected = basicAddons.includes(addon.id);
                    return (
                      <div key={addon.id} className="flex items-center gap-2 mb-1">
                        <button
                          data-testid={`addon-${addon.id}`}
                          onClick={() => {
                            if (isSelected) {
                              setBasicAddons(basicAddons.filter(id => id !== addon.id));
                            } else {
                              setBasicAddons([...basicAddons, addon.id]);
                            }
                          }}
                          className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                            isSelected
                              ? 'border-primary bg-primary/10'
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
                    );
                  })}
                  
                  {/* Trash Can Cleaning */}
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-3">Trash Can Cleaning</div>
                  {ADDON_CATALOG.filter(a => a.tier === 'basic' && a.category === 'trash').map((addon) => {
                    const isSelected = basicAddons.includes(addon.id);
                    return (
                      <div key={addon.id} className="flex items-center gap-2 mb-1">
                        <button
                          data-testid={`addon-${addon.id}`}
                          onClick={() => {
                            if (isSelected) {
                              setBasicAddons(basicAddons.filter(id => id !== addon.id));
                            } else {
                              setBasicAddons([...basicAddons, addon.id]);
                            }
                          }}
                          className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                            isSelected
                              ? 'border-primary bg-primary/10'
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
                    );
                  })}
                  
                  {/* Seasonal / Christmas Lights (Basic) */}
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-3">Seasonal / Christmas Lights</div>
                  {ADDON_CATALOG.filter(a => a.tier === 'basic' && a.category === 'seasonal').map((addon) => {
                    const isSelected = basicAddons.includes(addon.id);
                    return (
                      <div key={addon.id} className="flex items-center gap-2 mb-1">
                        <button
                          data-testid={`addon-${addon.id}`}
                          onClick={() => {
                            if (isSelected) {
                              setBasicAddons(basicAddons.filter(id => id !== addon.id));
                            } else {
                              setBasicAddons([...basicAddons, addon.id]);
                            }
                          }}
                          className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                            isSelected
                              ? 'border-primary bg-primary/10'
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
                    );
                  })}
                </div>

                {/* PREMIUM ADD-ONS - Only for Premium and Executive plans */}
                {(plan === 'premium' || plan === 'executive') && (
                  <div className="pt-3 border-t border-accent/30">
                    <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2 sticky top-0 bg-background py-1">
                      Premium Upgrades ({premiumAddons.length}/{effectivePremiumAllowance} included free)
                    </div>
                    
                    {/* Premium Landscaping */}
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Landscaping</div>
                    {ADDON_CATALOG.filter(a => a.tier === 'premium' && a.category === 'landscaping').map((addon) => {
                      const isSelected = premiumAddons.includes(addon.id);
                      return (
                        <div key={addon.id} className="flex items-center gap-2 mb-1">
                          <button
                            data-testid={`addon-${addon.id}`}
                            onClick={() => {
                              if (isSelected) {
                                setPremiumAddons(premiumAddons.filter(id => id !== addon.id));
                              } else {
                                setPremiumAddons([...premiumAddons, addon.id]);
                              }
                            }}
                            className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                              isSelected
                                ? 'border-accent bg-accent/10'
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
                      );
                    })}
                    
                    {/* Premium Cleaning */}
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-3">Cleaning & Wash</div>
                    {ADDON_CATALOG.filter(a => a.tier === 'premium' && a.category === 'cleaning').map((addon) => {
                      const isSelected = premiumAddons.includes(addon.id);
                      return (
                        <div key={addon.id} className="flex items-center gap-2 mb-1">
                          <button
                            data-testid={`addon-${addon.id}`}
                            onClick={() => {
                              if (isSelected) {
                                setPremiumAddons(premiumAddons.filter(id => id !== addon.id));
                              } else {
                                setPremiumAddons([...premiumAddons, addon.id]);
                              }
                            }}
                            className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                              isSelected
                                ? 'border-accent bg-accent/10'
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
                      );
                    })}
                    
                    {/* Premium Seasonal */}
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-3">Seasonal / Christmas Lights</div>
                    {ADDON_CATALOG.filter(a => a.tier === 'premium' && a.category === 'seasonal').map((addon) => {
                      const isSelected = premiumAddons.includes(addon.id);
                      return (
                        <div key={addon.id} className="flex items-center gap-2 mb-1">
                          <button
                            data-testid={`addon-${addon.id}`}
                            onClick={() => {
                              if (isSelected) {
                                setPremiumAddons(premiumAddons.filter(id => id !== addon.id));
                              } else {
                                setPremiumAddons([...premiumAddons, addon.id]);
                              }
                            }}
                            className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center gap-2 ${
                              isSelected
                                ? 'border-accent bg-accent/10'
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

          {/* Step 5: Commitment */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">Choose your commitment</h3>
                <p className="text-muted-foreground text-sm">We reward loyalty — longer commitment = more complimentary billing months</p>
              </div>

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
                            BEST VALUE
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
                          {/* Birthday Bonus Section */}
                          <div className="p-2 bg-primary/5 border border-primary/20 rounded-lg">
                            <div className="text-xs font-bold text-primary mb-1">Birthday Bonus</div>
                            <div className="text-[10px] text-muted-foreground space-y-0.5">
                              <div className="flex justify-between"><span>1-Year:</span><span>+1 month</span></div>
                              <div className="flex justify-between"><span>2-Year:</span><span>+3 months</span></div>
                              <div className="flex justify-between text-green-600 font-medium"><span>Pay in full:</span><span>doubles birthday bonus</span></div>
                            </div>
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
                                <div className="font-medium">Pay-in-Full Option</div>
                                <div className="text-xs text-muted-foreground">Doubles birthday bonus months.</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                ×2 BONUS
                              </div>
                              <div className="text-xs text-green-600 font-bold mt-1">
                                {t.id === '1-year' ? '1 → 2 + bonus' : '3 → 6 + bonus'}
                              </div>
                            </div>
                          </button>
                          
                          <p className="text-[10px] text-center text-muted-foreground">
                            Pay monthly is always available. Pay in full to double your birthday bonus months.
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
                        <span>• Birthday Bonus:</span>
                        <span>{payInFull ? `${freeMonthsBreakdown.commitmentBase} × 2 = ${freeMonthsBreakdown.commitmentMonths}` : `+${freeMonthsBreakdown.commitmentBase}`} mo</span>
                      </div>
                      {freeMonthsBreakdown.anniversaryBonus > 0 && (
                        <div className="flex justify-between">
                          <span>• Birthday Bonus (fixed):</span>
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
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-700">Pay in Full Total</div>
                        <div className="text-2xl font-bold text-green-800">
                          ${(monthlySubscription * billedMonths).toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600">
                          You'll receive {termMonths} months of service while paying for {billedMonths}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          )}

          {/* Step 6: Contact */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">Almost there!</h3>
                <p className="text-muted-foreground text-sm">Enter your info to receive your free quote</p>
              </div>

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
                      <span>{basicAddons.length} Basic, {premiumAddons.length} Premium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Included:</span>
                      <span>{effectiveBasicAllowance} Basic + {effectivePremiumAllowance} Premium</span>
                    </div>
                  </div>
                </div>
              )}

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
                    placeholder="(256) 555-0000"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
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
                  No payment required. We never sell your info.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 7: Complete */}
          {step === 7 && (
            <motion.div
              key="step7"
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
                  {isHOA ? "Your custom quote request has been submitted." : "Your quote has been submitted, General."}
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
                        {basicAddons.length} Basic, {premiumAddons.length} Premium
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-accent/10 rounded-xl p-4 border border-accent/30">
                <p className="font-bold text-primary">No payment required. No obligation.</p>
                <p className="text-sm text-accent">{isHOA ? "Free Property Consultation" : "Free Quote"}</p>
              </div>

              <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>What's next?</strong> We'll reach out within 1 business day to {isHOA ? "discuss your custom quote" : "schedule your free consultation"}.
                </p>
              </div>

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

      {/* Footer Navigation */}
      <div className="border-t border-border p-4 bg-muted/30">
        <div className="flex gap-3">
          {step > 1 && step < 7 && (
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
          
          {step < 6 && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-primary hover:bg-primary/90"
              data-testid="button-next"
            >
              {step === 1 ? "Build My Subscription" : "Continue"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {step === 6 && (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="flex-1 bg-accent hover:bg-accent/90 text-white"
              data-testid="button-submit"
            >
              {isSubmitting ? "Submitting..." : (isHOA ? "Request Custom Quote" : "Get My Free Quote")}
            </Button>
          )}

          {step === 7 && (
            <Button
              onClick={() => {
                setStep(1);
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
