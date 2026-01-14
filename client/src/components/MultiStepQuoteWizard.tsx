import React, { useState } from "react";
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
  Zap
} from "lucide-react";
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
  calculate2026Price,
  calculate2025Price,
  YARD_SIZES
} from "@/data/plans";

const STEPS = [
  { id: 1, title: "Yard Size", icon: MapPin },
  { id: 2, title: "Plan Tier", icon: Zap },
  { id: 3, title: "Add-ons", icon: Star },
  { id: 4, title: "Contact", icon: Phone },
];

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

      if (data.success) {
        toast({
          title: "Mission Received! 🫡",
          description: values.email 
            ? `Confirmation sent to ${values.email}. We'll schedule your FREE Dream Yard Recon shortly!`
            : "Request received! We'll contact you shortly to schedule your FREE Dream Yard Recon!",
          duration: 6000,
        });
        
        if (onClose) onClose();
        
        form.reset();
        setCurrentStep(1);
        setYardSize("1/3");
        setPlan("basic");
        setBasicAddons([]);
        setPremiumAddons([]);
        setSelectedPhotos([]);
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
  const allowance = getPlanAllowance(plan, false);
  const planPrice = calculate2026Price(plan, yardSize);
  const extraBasicCount = Math.max(0, basicAddons.length - allowance.basic);
  const extraPremiumCount = Math.max(0, premiumAddons.length - allowance.premium);
  const extraCost = (extraBasicCount * 20) + (extraPremiumCount * 40);
  const totalPrice = planPrice + extraCost;

  return (
    <div className={`bg-card rounded-2xl shadow-2xl border-2 border-primary/30 ${isModal ? '' : ''}`}>
      {/* Progress Header */}
      <div className="bg-primary text-primary-foreground p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-wider">Get Your Instant Quote</h3>
          {isModal && onClose && (
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">&times;</button>
          )}
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon;
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
                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] md:text-xs font-bold hidden md:block">{step.title}</span>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {YARD_SIZES.map((size) => (
                      <button
                        key={size.id}
                        type="button"
                        data-testid={`wizard-yard-${size.id}`}
                        onClick={() => setYardSize(size.id)}
                        className={`p-6 rounded-xl border-2 transition-all text-center ${
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
                    <h4 className="text-2xl font-bold text-primary mb-2">Choose Your Plan Tier</h4>
                    <p className="text-muted-foreground">All prices reflect 2026 AI-Savings discount</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {PLANS.map((p) => {
                      const price2026 = calculate2026Price(p.id, yardSize);
                      const price2025 = calculate2025Price(p.id, yardSize);
                      const isExecutive = p.id === 'executive';
                      const isSelected = plan === p.id;
                      
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
                          <div className="text-xs text-muted-foreground mt-2">{p.allowanceLabel}</div>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <Check className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Plan Features Preview */}
                  {planData && (
                    <div className="bg-muted/30 rounded-xl p-4 border border-border mt-4">
                      <h5 className="font-bold text-primary mb-2">{planData.name} Features:</h5>
                      <ul className="grid md:grid-cols-2 gap-1 text-sm">
                        {planData.features.slice(0, 6).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
                            <span dangerouslySetInnerHTML={{ __html: feature.split('<br/>')[0] }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                    <div className="text-3xl font-bold text-primary">${totalPrice}/mo</div>
                    {extraCost > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Base ${planPrice} + ${extraCost} extra add-ons
                      </div>
                    )}
                  </div>
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
                    <p className="text-muted-foreground">We'll reach out to schedule your FREE Dream Yard Recon</p>
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
                      <div className="mt-3 pt-3 border-t border-primary/10 text-xs text-muted-foreground text-center">
                        {basicAddons.length + premiumAddons.length} add-on(s) selected
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
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
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
