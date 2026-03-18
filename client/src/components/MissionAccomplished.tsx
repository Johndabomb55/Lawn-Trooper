import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  Download, 
  Share2, 
  Mail,
  Trophy,
  Users,
  Facebook,
  Twitter,
  Copy,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  PLANS, 
  BASIC_ADDONS, 
  PREMIUM_ADDONS, 
  YARD_SIZES 
} from "@/data/plans";
import { 
  SOCIAL_SHARING,
  PDF_QUOTE_CONFIG,
  getFeatureFlag
} from "@/data/marketing";
import { TRUST_MESSAGES } from "@/data/promotions";
import NeighborhoodOffer from "@/components/NeighborhoodOffer";
import RobotWaitlist from "@/components/RobotWaitlist";
import PromoBanner from "@/components/PromoBanner";

interface MissionAccomplishedProps {
  quoteData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    yardSize: string;
    plan: string;
    basicAddons: string[];
    premiumAddons: string[];
    totalPrice: number;
    term?: '1-year' | '2-year';
    payUpfront?: boolean;
    segments?: string[];
    appliedPromos?: string[];
  };
  onClose: () => void;
  onReset: () => void;
}

export default function MissionAccomplished({ quoteData, onClose, onReset }: MissionAccomplishedProps) {
  const BUSINESS_FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61588087766755";
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();

  const planData = PLANS.find(p => p.id === quoteData.plan);
  const yardData = YARD_SIZES.find(y => y.id === quoteData.yardSize);
  const selectedStandardAddons = quoteData.basicAddons
    .map((id) => BASIC_ADDONS.find((a) => a.id === id)?.label)
    .filter((label): label is string => Boolean(label));
  const selectedPremiumAddons = quoteData.premiumAddons
    .map((id) => PREMIUM_ADDONS.find((a) => a.id === id)?.label)
    .filter((label): label is string => Boolean(label));


  const handleDownloadPDF = () => {
    const quoteContent = `
${PDF_QUOTE_CONFIG.companyName}
${PDF_QUOTE_CONFIG.tagline}
${'='.repeat(50)}

QUOTE SUMMARY
Generated: ${new Date().toLocaleDateString()}
Valid for: ${PDF_QUOTE_CONFIG.validityDays} days

CUSTOMER INFORMATION
---------------------
Name: ${quoteData.name}
Address: ${quoteData.address}
Contact: ${quoteData.email || quoteData.phone}

SERVICE DETAILS
---------------
Yard Size: ${yardData?.label} (${quoteData.yardSize} Acre)
Service Plan: ${planData?.name}

SELECTED UPGRADES
----------------
Standard Upgrades (${quoteData.basicAddons.length}):
${quoteData.basicAddons.map(id => {
  const addon = BASIC_ADDONS.find(a => a.id === id);
  return addon ? `  • ${addon.label}` : '';
}).filter(Boolean).join('\n')}

Premium Upgrades (${quoteData.premiumAddons.length}):
${quoteData.premiumAddons.map(id => {
  const addon = PREMIUM_ADDONS.find(a => a.id === id);
  return addon ? `  • ${addon.label}` : '';
}).filter(Boolean).join('\n')}

MONTHLY TOTAL: $${quoteData.totalPrice}/month
${'='.repeat(50)}

${PDF_QUOTE_CONFIG.footerText}

Contact: John@lawn-trooper.com | (256) 795-2949
    `.trim();

    const blob = new Blob([quoteContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LawnTrooper_Quote_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Quote Downloaded",
      description: "Your quote summary has been downloaded.",
    });
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'copy') => {
    const shareUrl = window.location.origin;
    
    if (platform === 'twitter') {
      const text = encodeURIComponent(SOCIAL_SHARING.twitter.text);
      const hashtags = SOCIAL_SHARING.twitter.hashtags.join(',');
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(BUSINESS_FACEBOOK_URL, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${SOCIAL_SHARING.referralMessage} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link Copied!",
        description: "Share it with your neighbors!",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card rounded-2xl shadow-2xl border-2 border-primary/30 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-green-700 text-primary-foreground p-6 md:p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute bottom-4 right-4 animate-pulse delay-300">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full mb-4 shadow-lg"
        >
          <Trophy className="w-10 h-10 text-accent-foreground" />
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase tracking-wider mb-2">
          Mission Accomplished!
        </h2>
        <p className="text-lg opacity-90">Your plan has been successfully reserved, General.</p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Quote Summary Card */}
        <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
          <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            Your Reserved Plan Summary
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-bold">Yard Size</span>
              <p className="font-bold text-primary">{yardData?.label}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase font-bold">Service Plan</span>
              <p className="font-bold text-primary">{planData?.name}</p>
            </div>
          </div>

          {/* Selected Upgrades */}
          <div className="border-t border-primary/10 pt-4 mb-4">
            <span className="text-xs text-muted-foreground uppercase font-bold block mb-2">Selected Upgrades</span>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-primary/15 bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  Standard Upgrades ({selectedStandardAddons.length})
                </p>
                {selectedStandardAddons.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {selectedStandardAddons.map((label) => (
                      <li key={`mission-standard-${label}`} className="flex items-start gap-2 text-foreground/90">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">No Standard upgrades selected.</p>
                )}
              </div>
              <div className="rounded-lg border border-accent/20 bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-accent">
                  Premium Upgrades ({selectedPremiumAddons.length})
                </p>
                {selectedPremiumAddons.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {selectedPremiumAddons.map((label) => (
                      <li key={`mission-premium-${label}`} className="flex items-start gap-2 text-foreground/90">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/80" aria-hidden />
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">No Premium upgrades selected.</p>
                )}
              </div>
            </div>
          </div>

          {/* Applied Promotions */}
          {quoteData.appliedPromos && quoteData.appliedPromos.length > 0 && (
            <div className="border-t border-primary/10 pt-4 mb-4">
              <span className="text-xs text-muted-foreground uppercase font-bold block mb-2">Applied Promotions</span>
              <div className="flex flex-wrap gap-1.5">
                {quoteData.appliedPromos.map((promo, i) => (
                  <span key={i} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {promo}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contract Term & Payment */}
          {quoteData.term && (
            <div className="border-t border-primary/10 pt-4 mb-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold">Contract Term</span>
                <p className="font-bold text-primary">
                  {quoteData.term === '2-year' ? '2-Year Pact' : quoteData.term === '1-year' ? '1-Year Pact' : 'Month-to-Month'}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold">Payment</span>
                <p className="font-bold text-primary">{quoteData.payUpfront ? 'Paid Upfront' : 'Monthly'}</p>
              </div>
            </div>
          )}

          {/* Operation Price Drop - Loyalty Benefits */}
          <div className="border-t border-primary/10 pt-4 mb-4">
            <span className="text-xs text-muted-foreground uppercase font-bold block mb-2">Future Loyalty Benefits</span>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
              <p className="text-xs font-bold text-green-800 mb-2">Operation Price Drop - Your Future Savings:</p>
              <div className="flex gap-4 text-xs text-green-700">
                <span>After Year 1: <strong>5% off</strong></span>
                <span>After Year 2: <strong>10% off</strong></span>
                <span>After Year 3: <strong>15% off</strong></span>
              </div>
              <p className="text-xs text-green-600 mt-2 italic">Loyalty rewarded automatically on renewal.</p>
            </div>
          </div>

          <div className="border-t border-primary/10 pt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Total</span>
            <span className="text-2xl font-bold text-primary">${quoteData.totalPrice}/mo</span>
          </div>
        </div>

        {/* Anniversary Promo Reminder */}
        <PromoBanner />

        {/* Neighborhood Offer */}
        <NeighborhoodOffer />

        {/* Robot Mowing Waitlist */}
        <RobotWaitlist />

        {/* No Obligation Message */}
        <div className="bg-accent/10 rounded-xl p-4 border border-accent/30 text-center">
          <p className="text-lg font-bold text-primary mb-1">No payment collected today. No obligation.</p>
          <p className="text-sm text-accent font-medium">Free Dream Yard Recon.</p>
          <p className="text-xs text-primary mt-1">Full refund if you decide not to enlist during consultation.</p>
        </div>

        {/* Trust & Privacy Message */}
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-800">{TRUST_MESSAGES.confirmation}</p>
        </div>

        {/* Scheduling Follow-up Note */}
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
          <p className="text-sm text-muted-foreground">{TRUST_MESSAGES.miguelNote}</p>
        </div>

        {/* Referral Nudge */}
        <div className="bg-accent/10 rounded-xl p-4 border border-accent/20 text-center">
          <p className="text-sm text-accent font-medium flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            {TRUST_MESSAGES.referralNudge}
          </p>
        </div>

        {/* Download Button */}
        {getFeatureFlag('showPdfDownload', true) && (
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Quote Summary
          </Button>
        )}


        {/* Social Sharing */}
        {getFeatureFlag('showSocialSharing', true) && (
          <div className="border-t border-border pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary text-sm">
                {SOCIAL_SHARING.referralMessage.split(' ').slice(0, 5).join(' ')}...
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{SOCIAL_SHARING.referralMessage}</p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('twitter')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Twitter className="w-4 h-4" /> Twitter
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('facebook')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Facebook className="w-4 h-4" /> Facebook
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('copy')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
          >
            Close & Start New Quote
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
