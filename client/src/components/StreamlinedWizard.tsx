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
import { PLANS, YARD_SIZES, GLOBAL_CONSTANTS, BASIC_ADDONS, PREMIUM_ADDONS } from "@/data/plans";
import { 
  COMMITMENT_TERMS, 
  LOYALTY_DISCOUNTS,
  getEarlyBirdFreeMonths,
  PROMO_CAPS,
  HOA_PROMO_CODES,
  validatePromoCode
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

export default function StreamlinedWizard() {
  const [step, setStep] = useState(1);
  const [yardSize, setYardSize] = useState("");
  const [plan, setPlan] = useState("premium");
  const [basicAddons, setBasicAddons] = useState<string[]>([]);
  const [premiumAddons, setPremiumAddons] = useState<string[]>([]);
  const [showAdvancedAddons, setShowAdvancedAddons] = useState(false);
  const [term, setTerm] = useState<'1-year' | '2-year' | '3-year'>('1-year');
  const [payUpfront, setPayUpfront] = useState(false);
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
  
  const { toast } = useToast();

  const selectedPlan = PLANS.find(p => p.id === plan);
  const selectedYard = YARD_SIZES.find(y => y.id === yardSize);
  const selectedTerm = COMMITMENT_TERMS.find(t => t.id === term);
  
  const earlyBirdMonths = getEarlyBirdFreeMonths();
  const commitmentMonths = selectedTerm?.freeMonths || 0;
  const payFullBonus = payUpfront ? 1 : 0;
  const promoValid = validatePromoCode(promoCode);
  const promoDiscount = promoValid ? (HOA_PROMO_CODES[promoCode.toUpperCase()]?.discount || 0) : 0;
  
  const totalFreeMonths = Math.min(
    earlyBirdMonths + commitmentMonths + payFullBonus,
    PROMO_CAPS.maxFreeMonths
  );

  const calculatePrice = () => {
    if (!selectedPlan || !selectedYard) return 0;
    const basePrice = selectedPlan.price;
    const sizeMultiplier = selectedYard.id === "0.25" ? 1 : 
                          selectedYard.id === "0.5" ? 1.15 : 
                          selectedYard.id === "0.75" ? 1.30 : 1.45;
    let price = Math.round(basePrice * sizeMultiplier);
    if (promoDiscount > 0) {
      price = Math.round(price * (1 - promoDiscount / 100));
    }
    return price;
  };

  const monthlyPrice = calculatePrice();

  const handleNext = () => {
    if (step < 7) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true;
      case 2: return !!yardSize;
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
          yardSize,
          plan,
          basicAddons,
          premiumAddons,
          term,
          payUpfront: String(payUpfront),
          promoCode,
          totalPrice: String(monthlyPrice),
          freeMonths: String(totalFreeMonths),
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
          <h2 data-testid="text-wizard-title" className="text-xl font-bold font-heading uppercase tracking-wide">Dream Yard Recon</h2>
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
        {totalFreeMonths > 0 && step > 1 && step < 7 && (
          <div className="mt-2 text-center">
            <span data-testid="text-free-months-unlocked" className="text-sm bg-accent/30 px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3 inline mr-1" />
              {totalFreeMonths} Free Month{totalFreeMonths > 1 ? 's' : ''} Unlocked!
            </span>
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">Welcome to Lawn Trooper</h3>
                <p className="text-muted-foreground">Let's build your perfect lawn care plan in just a few taps.</p>
              </div>
              
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

              <button
                data-testid="info-about"
                onClick={() => showInfo("About Lawn Trooper", (
                  <div className="space-y-3">
                    <p>Lawn Trooper is built on commitment, efficiency, and loyalty. We've spent decades putting relationships before scale.</p>
                    <p>As we adopt new automation, technology, and processes, we're passing those savings back to our customers.</p>
                    <p className="font-semibold text-primary">Commit to us, and we commit to you.</p>
                  </div>
                ))}
                className="text-sm text-primary underline"
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
                      <li><strong>1/4 acre:</strong> Typical small suburban lot</li>
                      <li><strong>1/2 acre:</strong> Average neighborhood home</li>
                      <li><strong>3/4 acre:</strong> Larger lot with more lawn</li>
                      <li><strong>1+ acre:</strong> Estate or rural property</li>
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
                        onClick={() => setPlan(p.id)}
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
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <Check className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </button>
                      <button
                        type="button"
                        data-testid={`info-plan-${p.id}`}
                        onClick={() => showInfo(p.name, (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              {p.keyStats.map((stat, i) => (
                                <div key={i} className="bg-muted/50 p-2 rounded text-center">
                                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                                  <div className="font-bold text-sm">{stat.value}</div>
                                </div>
                              ))}
                            </div>
                            <p className="text-sm">{p.allowanceLabel}</p>
                          </div>
                        ))}
                        className="text-xs text-primary underline mt-1 ml-4"
                      >
                        View details
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

              {/* Selection Counter */}
              <div data-testid="addon-counter" className="bg-primary/10 rounded-lg p-3 text-center text-sm">
                <span className="font-medium">Selected: </span>
                <span className="font-bold text-primary">{basicAddons.length} basic</span>
                {selectedPlan && selectedPlan.allowance.premium > 0 && (
                  <span>, <span className="font-bold text-accent">{premiumAddons.length} premium</span></span>
                )}
                <span className="text-muted-foreground"> • Extra add-ons: $20-40/mo each</span>
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Basic Add-ons ({basicAddons.length}/{selectedPlan?.allowance.basic || 1} included free)
                </div>
                {BASIC_ADDONS.slice(0, 6).map((addon) => {
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

                {selectedPlan && selectedPlan.allowance.premium > 0 && (
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
                          Premium Add-ons ({premiumAddons.length}/{selectedPlan.allowance.premium} included free)
                        </div>
                        {PREMIUM_ADDONS.slice(0, 4).map((addon) => {
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
                  return (
                    <button
                      key={t.id}
                      data-testid={`term-${t.id}`}
                      onClick={() => setTerm(t.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-lg">{t.label}</div>
                        <div className="text-sm text-muted-foreground">{t.badge}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">+{t.freeMonths} FREE</div>
                        <div className="text-xs text-muted-foreground">month{t.freeMonths > 1 ? 's' : ''}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pay Upfront Toggle */}
              <button
                data-testid="pay-upfront-toggle"
                onClick={() => setPayUpfront(!payUpfront)}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  payUpfront
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    payUpfront ? 'bg-accent border-accent' : 'border-muted-foreground'
                  }`}>
                    {payUpfront && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <div className="font-bold">Pay in Full</div>
                    <div className="text-xs text-muted-foreground">Get +1 extra free month</div>
                  </div>
                </div>
                <div className="text-green-600 font-bold">+1 FREE</div>
              </button>

              {/* Early Bird Banner */}
              {earlyBirdMonths > 0 && (
                <div data-testid="banner-early-bird" className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <div data-testid="text-early-bird-bonus" className="text-green-800 font-bold flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Early Bird Bonus: +{earlyBirdMonths} FREE months!
                  </div>
                  <div className="text-xs text-green-600">Sign up before April 25 to lock in this bonus</div>
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

              {/* Summary Card */}
              <div data-testid="card-summary" className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                <div className="flex justify-between items-center mb-2">
                  <span data-testid="text-selected-plan" className="font-bold">{selectedPlan?.name}</span>
                  <span data-testid="text-monthly-price" className="text-xl font-bold text-primary">${monthlyPrice}/mo</span>
                </div>
                <div className="flex gap-2 flex-wrap text-xs">
                  <span data-testid="text-free-months-summary" className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {totalFreeMonths} Free Months
                  </span>
                  <span data-testid="text-yard-size" className="bg-muted px-2 py-0.5 rounded">{selectedYard?.label}</span>
                  <span data-testid="text-term" className="bg-muted px-2 py-0.5 rounded">{selectedTerm?.label}</span>
                </div>
              </div>

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
                <p data-testid="text-complete-subtitle" className="text-muted-foreground">Your quote has been submitted, General.</p>
              </div>

              <div data-testid="card-confirmation" className="bg-primary/5 rounded-xl p-4 border border-primary/20 text-left">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Plan</span>
                    <span data-testid="text-confirm-plan" className="font-bold">{selectedPlan?.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Monthly</span>
                    <span data-testid="text-confirm-price" className="font-bold text-primary">${monthlyPrice}/mo</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Commitment</span>
                    <span data-testid="text-confirm-term" className="font-bold">{selectedTerm?.label}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Free Months</span>
                    <span data-testid="text-confirm-free-months" className="font-bold text-green-600">{totalFreeMonths}</span>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 rounded-xl p-4 border border-accent/30">
                <p className="font-bold text-primary">No payment required. No obligation.</p>
                <p className="text-sm text-accent">Free Dream Yard Recon</p>
              </div>

              <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>What's next?</strong> We'll reach out within 1 business day to schedule your free consultation.
                </p>
              </div>

              {/* Future Loyalty */}
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
              {isSubmitting ? "Submitting..." : "Get My Free Quote"}
            </Button>
          )}

          {step === 7 && (
            <Button
              onClick={() => {
                setStep(1);
                setYardSize("");
                setPlan("");
                setBasicAddons([]);
                setPremiumAddons([]);
                setTerm('1-year');
                setPayUpfront(false);
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
