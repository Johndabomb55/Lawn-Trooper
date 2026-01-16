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
import { 
  PLANS, 
  YARD_SIZES, 
  GLOBAL_CONSTANTS, 
  ADDON_CATALOG,
  BASIC_ADDONS, 
  PREMIUM_ADDONS, 
  OVERAGE_PRICES,
  SWAP_OPTIONS,
  getYardMultiplier,
  getPlanAllowance,
  calculateOverageCost,
  getAddonById
} from "@/data/plans";
import { 
  COMMITMENT_TERMS, 
  LOYALTY_DISCOUNTS,
  PAYMENT_METHODS,
  PROMO_CAPS,
  HOA_PROMO_CODES,
  validatePromoCode,
  calculateActualMonthly,
  calculateEffectiveMonthly,
  getTotalFreeMonths,
  type PaymentMethod
} from "@/data/promotions";

const STEPS = [
  { id: 1, title: "Welcome", icon: Shield },
  { id: 2, title: "Yard Size", icon: MapPin },
  { id: 3, title: "Plan", icon: Star },
  { id: 4, title: "Add-ons", icon: Gift },
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
      <DialogContent data-testid="dialog-info" className="max-w-md">
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
  const [term, setTerm] = useState<'month-to-month' | '1-year' | '2-year'>('1-year');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('monthly');
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
  
  const payInFull = paymentMethod === 'pay-in-full';
  const promoValid = validatePromoCode(promoCode);
  const promoDiscount = promoValid ? (HOA_PROMO_CODES[promoCode.toUpperCase()]?.discount || 0) : 0;
  
  const totalFreeMonths = getTotalFreeMonths(term, payInFull, false);
  
  const isExecutive = plan === 'executive';
  // Get effective allowances using the canonical function with swap adjustment
  const allowance = getPlanAllowance(plan, isExecutive ? swapCount : 0);
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
  const addonExtraCost = totalOverage;

  const calculateBasePrice = () => {
    if (!selectedPlan || !selectedYard) return 0;
    const basePrice = selectedPlan.price;
    const sizeMultiplier = getYardMultiplier(selectedYard.id);
    let price = Math.round(basePrice * sizeMultiplier);
    if (promoDiscount > 0) {
      price = Math.round(price * (1 - promoDiscount / 100));
    }
    return price;
  };

  const basePrice = calculateBasePrice();
  const actualMonthly = isHOA ? 0 : calculateActualMonthly(basePrice, term) + addonExtraCost;
  const effectiveMonthly = isHOA ? 0 : calculateEffectiveMonthly(basePrice + addonExtraCost, term, payInFull);

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
      case 4: return true;
      case 5: return true;
      case 6: return name && phone;
      default: return true;
    }
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
          paymentMethod: isHOA ? 'custom' : paymentMethod,
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
          <h2 data-testid="text-wizard-title" className="text-xl font-bold font-heading uppercase tracking-wide">Build My Plan</h2>
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
                {totalFreeMonths} Free Month{totalFreeMonths > 1 ? 's' : ''} Unlocked!
              </span>
            ) : (
              <span data-testid="text-free-months-available" className="text-sm bg-white/20 px-3 py-1 rounded-full">
                Free months available with annual plans
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

          {/* Step 3: Plan Selection */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">Choose your plan</h3>
                <p className="text-muted-foreground text-sm">All plans include mowing, edging, trimming & blowing</p>
              </div>

              <div className="space-y-3">
                {PLANS.map((p) => {
                  const isSelected = plan === p.id;
                  const isExecutive = p.id === 'executive';
                  const isPremium = p.id === 'premium';
                  return (
                    <div key={p.id} className="relative">
                      <button
                        data-testid={`plan-${p.id}`}
                        onClick={() => {
                          setPlan(p.id);
                          if (p.id !== 'executive') {
                            setSwapCount(0);
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
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {p.keyStats.slice(0, 2).map((stat, i) => (
                                <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                                  {stat.label}: {stat.value}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">${p.price}</div>
                            <div className="text-xs text-muted-foreground">/mo</div>
                          </div>
                        </div>
                        {/* Add-on breakdown line */}
                        <div className="mt-2 pt-2 border-t border-border/50 text-xs">
                          <span className="text-muted-foreground">Add-Ons Included: </span>
                          <span className="font-medium">{p.allowance.basic} Basic + {p.allowance.premium} Premium</span>
                          {p.id === 'executive' && p.allowsSwap && (
                            <span className="block text-accent mt-0.5">Swap option: 1 Premium = 2 Basic</span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <Check className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 4: Add-ons */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">Customize with add-ons</h3>
                <p className="text-muted-foreground text-sm">
                  Your plan includes {selectedPlan?.allowanceLabel || "add-ons"} at no extra cost.
                </p>
              </div>

              {/* Executive Swap Selector */}
              {isExecutive && (
                <div className="bg-accent/10 rounded-lg p-3 border border-accent/30">
                  <div className="mb-2">
                    <div className="font-medium text-sm">Swap Premium slots for additional Basic slots</div>
                    <div className="text-xs text-muted-foreground">Each swap trades 1 Premium for +2 Basic</div>
                  </div>
                  <select
                    data-testid="exec-swap-selector"
                    value={swapCount}
                    onChange={(e) => {
                      const newSwap = parseInt(e.target.value);
                      setSwapCount(newSwap);
                      // Clear premium add-ons that exceed new allowance
                      const newPremiumAllowance = 2 - newSwap;
                      if (premiumAddons.length > newPremiumAllowance) {
                        setPremiumAddons(premiumAddons.slice(0, Math.max(0, newPremiumAllowance)));
                      }
                    }}
                    className="w-full p-2 rounded-lg border bg-background text-sm font-medium"
                  >
                    {SWAP_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="mt-2 text-xs text-muted-foreground text-center">
                    Current: <span className="font-bold text-primary">{effectiveBasicAllowance} Basic</span> + <span className="font-bold text-accent">{effectivePremiumAllowance} Premium</span> included
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
                    <span>Overage:</span>
                    <span className="font-bold">
                      {extraBasicCount > 0 && `+${extraBasicCount} Basic (+$${extraBasicCount * OVERAGE_PRICES.basic}/mo)`}
                      {extraBasicCount > 0 && extraPremiumCount > 0 && ', '}
                      {extraPremiumCount > 0 && `+${extraPremiumCount} Premium (+$${extraPremiumCount * OVERAGE_PRICES.premium}/mo)`}
                    </span>
                  </div>
                )}
                {totalOverage > 0 && (
                  <div className="flex justify-between items-center font-bold text-amber-700 bg-amber-50 -mx-3 -mb-3 px-3 py-2 rounded-b-lg">
                    <span>Extra add-on cost:</span>
                    <span>+${totalOverage}/mo</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Basic Add-ons ({basicAddons.length}/{effectiveBasicAllowance} included free)
                </div>
                {BASIC_ADDONS.map((addon) => {
                  const isSelected = basicAddons.includes(addon.id);
                  return (
                    <div key={addon.id} className="flex items-center gap-2">
                      <button
                        data-testid={`addon-${addon.id}`}
                        onClick={() => {
                          if (isSelected) {
                            setBasicAddons(basicAddons.filter(id => id !== addon.id));
                          } else {
                            setBasicAddons([...basicAddons, addon.id]);
                          }
                        }}
                        className={`flex-1 p-3 rounded-lg border transition-all text-left flex items-center gap-3 ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                        }`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{addon.label}</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        data-testid={`info-addon-${addon.id}`}
                        onClick={() => showInfo(addon.label, <p>{addon.description}</p>)}
                        className="text-muted-foreground hover:text-primary p-2"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}

                {selectedPlan && effectivePremiumAllowance > 0 && (
                  <>
                    <button
                      data-testid="toggle-advanced-addons"
                      onClick={() => setShowAdvancedAddons(!showAdvancedAddons)}
                      className="w-full mt-3 py-2 text-sm text-primary font-medium flex items-center justify-center gap-1 hover:underline"
                    >
                      {showAdvancedAddons ? "Hide" : "Show"} advanced options
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedAddons ? 'rotate-180' : ''}`} />
                    </button>
                    {showAdvancedAddons && (
                      <>
                        <div className="text-xs font-bold text-accent uppercase tracking-wider mt-2 mb-2">
                          Premium Add-ons ({premiumAddons.length}/{effectivePremiumAllowance} included free)
                        </div>
                        {PREMIUM_ADDONS.map((addon) => {
                          const isSelected = premiumAddons.includes(addon.id);
                          return (
                            <div key={addon.id} className="flex items-center gap-2">
                              <button
                                data-testid={`addon-${addon.id}`}
                                onClick={() => {
                                  if (isSelected) {
                                    setPremiumAddons(premiumAddons.filter(id => id !== addon.id));
                                  } else {
                                    setPremiumAddons([...premiumAddons, addon.id]);
                                  }
                                }}
                                className={`flex-1 p-3 rounded-lg border transition-all text-left flex items-center gap-3 ${
                                  isSelected
                                    ? 'border-accent bg-accent/10'
                                    : 'border-border hover:border-accent/50'
                                }`}
                              >
                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                                  isSelected ? 'bg-accent border-accent' : 'border-muted-foreground'
                                }`}>
                                  {isSelected && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{addon.label}</div>
                                </div>
                                <Star className="w-4 h-4 text-accent" />
                              </button>
                              <button
                                type="button"
                                data-testid={`info-addon-${addon.id}`}
                                onClick={() => showInfo(addon.label, <p>{addon.description}</p>)}
                                className="text-muted-foreground hover:text-accent p-2"
                              >
                                <Info className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Tap the info icon for details. You can always adjust add-ons later.
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
                <p className="text-muted-foreground text-sm">Longer commitment = more free months</p>
              </div>

              <div className="space-y-3">
                {COMMITMENT_TERMS.map((t) => {
                  const isSelected = term === t.id;
                  const isBestValue = t.id === '2-year';
                  return (
                    <button
                      key={t.id}
                      data-testid={`term-${t.id}`}
                      onClick={() => setTerm(t.id)}
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
                        <div className="text-sm text-muted-foreground">{t.description}</div>
                        {t.hasPremium && (
                          <div className="text-xs text-amber-600 mt-1">Includes flexibility pricing (+15%)</div>
                        )}
                      </div>
                      <div className="text-right">
                        {t.freeMonths > 0 ? (
                          <>
                            <div className="text-xl font-bold text-green-600">+{t.freeMonths} FREE</div>
                            <div className="text-xs text-muted-foreground">month{t.freeMonths > 1 ? 's' : ''}</div>
                          </>
                        ) : (
                          <div className="text-sm text-muted-foreground">{t.badge}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-center">How would you like to pay?</div>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((pm) => {
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        data-testid={`payment-${pm.id}`}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-medium text-sm">{pm.label}</div>
                        {pm.bonus && (
                          <div className="text-xs text-green-600 font-bold">{pm.bonus}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Summary */}
              {basePrice > 0 && (
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Your monthly payment:</span>
                    <span className="text-2xl font-bold text-primary">${actualMonthly}/mo</span>
                  </div>
                  {term !== 'month-to-month' && totalFreeMonths > 0 && (
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      <span>Effective monthly after free months: ${effectiveMonthly.toFixed(0)}/mo</span>
                      <button
                        type="button"
                        onClick={() => showInfo("Effective Monthly", (
                          <div className="space-y-2">
                            <p>Free months are <strong>skipped billing months</strong> at the end of your agreement.</p>
                            <p className="text-sm text-muted-foreground">Example: 2 free months on a 12-month plan = pay for first 10 months, final 2 months not billed.</p>
                          </div>
                        ))}
                        className="text-primary underline"
                      >
                        What's this?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Loyalty Preview */}
              <button
                data-testid="info-loyalty"
                onClick={() => showInfo("Operation Price Drop", (
                  <div className="space-y-3">
                    <p className="font-semibold">Future loyalty benefits on renewal:</p>
                    {LOYALTY_DISCOUNTS.map((l, i) => (
                      <div key={i} className="flex justify-between bg-green-50 p-2 rounded">
                        <span>{l.label}</span>
                        <span className="font-bold text-green-600">{l.discount}% off</span>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground">
                      Loyalty discounts apply automatically when you renew your contract.
                    </p>
                  </div>
                ))}
                className="text-sm text-primary underline mx-auto block"
              >
                See future loyalty savings
              </button>
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
                        {totalFreeMonths} Free Month{totalFreeMonths > 1 ? 's' : ''}
                      </span>
                    )}
                    <span data-testid="text-yard-size" className="bg-muted px-2 py-0.5 rounded">{selectedYard?.label}</span>
                    <span data-testid="text-term" className="bg-muted px-2 py-0.5 rounded">{selectedTerm?.label}</span>
                  </div>
                  {/* Add-ons summary */}
                  <div className="text-xs border-t border-border/50 pt-2 mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Add-ons:</span>
                      <span>{basicAddons.length} Basic, {premiumAddons.length} Premium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Included:</span>
                      <span>{effectiveBasicAllowance} Basic + {effectivePremiumAllowance} Premium</span>
                    </div>
                    {totalOverage > 0 && (
                      <div className="flex justify-between text-amber-600 font-medium">
                        <span>Add-on overages:</span>
                        <span>+${totalOverage}/mo</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Free months = skipped billing at end of term. You pay for fewer months, not a discount.</p>
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
                      <span className="text-xs text-muted-foreground block">Free Months</span>
                      <span data-testid="text-confirm-free-months" className="font-bold text-green-600">{totalFreeMonths}</span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground block">Add-ons</span>
                      <span data-testid="text-confirm-addons" className="font-bold">
                        {basicAddons.length} Basic, {premiumAddons.length} Premium
                        {totalOverage > 0 && <span className="text-amber-600"> (+${totalOverage}/mo overages)</span>}
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
                  <p>Month-to-month plans may be canceled anytime with 30 days notice. Term plans may be canceled early at any time; free months and unused credits are forfeited if canceled before the term ends.</p>
                </div>
              )}

              {/* Future Loyalty - Residential only */}
              {!isHOA && (
                <div className="text-left">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Future Loyalty Benefits</p>
                  <div className="flex gap-2 text-xs">
                    {LOYALTY_DISCOUNTS.map((l, i) => (
                      <span key={i} className="bg-green-50 text-green-700 px-2 py-1 rounded">
                        {l.label}: {l.discount}% off
                      </span>
                    ))}
                  </div>
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
              {step === 1 ? "Start My Free Quote" : "Continue"}
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
                setTerm('1-year');
                setPaymentMethod('monthly');
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
