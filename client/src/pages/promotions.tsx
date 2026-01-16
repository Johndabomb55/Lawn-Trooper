import { Link } from "wouter";
import { ArrowLeft, Check, Sparkles, Calculator, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PLANS, YARD_SIZES, getYardMultiplier } from "@/data/plans";
import { 
  COMMITMENT_TERMS, 
  MONTH_TO_MONTH_PREMIUM,
  calculateActualMonthly,
  calculateTermFreeMonths,
  getFreeMonthsBreakdown,
  getEarlyBirdBonus
} from "@/data/promotions";
import { Switch } from "@/components/ui/switch";

export default function PromotionsPage() {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [selectedYardSize, setSelectedYardSize] = useState("1/3");
  const [selectedTerm, setSelectedTerm] = useState<'month-to-month' | '1-year' | '2-year'>('2-year');
  const [payInFull, setPayInFull] = useState(false);

  const plan = PLANS.find(p => p.id === selectedPlan);
  const yardSize = YARD_SIZES.find(y => y.id === selectedYardSize);
  const term = COMMITMENT_TERMS.find(t => t.id === selectedTerm);

  const basePrice = plan && yardSize 
    ? Math.round(plan.price * getYardMultiplier(yardSize.id))
    : 0;

  const actualMonthly = calculateActualMonthly(basePrice, selectedTerm);
  
  // Calculate free months based on term and pay-in-full
  const freeMonths = calculateTermFreeMonths(selectedTerm, payInFull);
  const freeMonthsBreakdown = getFreeMonthsBreakdown(selectedTerm, payInFull);
  const earlyBirdBonus = getEarlyBirdBonus();
  
  const termMonths = term?.months || 1;
  const billedMonths = Math.max(termMonths - freeMonths, 1);
  const effectiveMonthly = selectedTerm !== 'month-to-month'
    ? Math.round((actualMonthly * billedMonths) / termMonths)
    : actualMonthly;
  // Savings compared to M2M baseline (15% premium) for the same period
  const m2mMonthly = Math.round(basePrice * 1.15);
  const savings = selectedTerm !== 'month-to-month'
    ? (m2mMonthly * termMonths) - (actualMonthly * billedMonths)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quote Builder
          </Button>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Ways to Save</h1>
          <p className="text-muted-foreground text-lg">Commit to us, and we commit to you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Term Commitment</h2>
            </div>
            <div className="space-y-3">
              {COMMITMENT_TERMS.map((t) => (
                <button
                  key={t.id}
                  data-testid={`promo-term-${t.id}`}
                  onClick={() => {
                    setSelectedTerm(t.id as 'month-to-month' | '1-year' | '2-year');
                    if (t.id === 'month-to-month') setPayInFull(false);
                  }}
                  className={`w-full p-3 rounded-lg border-2 text-left flex justify-between items-center transition-all ${
                    selectedTerm === t.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div>
                    <div className="font-medium">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{(t as any).shortDescription || t.description}</div>
                  </div>
                  {t.freeMonths > 0 && (
                    <span className="text-green-600 font-bold">+{t.freeMonths} complimentary</span>
                  )}
                  {t.hasPremium && (
                    <span className="text-amber-600 text-sm">+15%</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-accent" />
              <h2 className="font-bold text-lg">Payment Option</h2>
            </div>
            {selectedTerm !== 'month-to-month' ? (
              <div className="space-y-4">
                {/* 25th Anniversary Enrollment Bonus */}
                {earlyBirdBonus.isActive && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
                    <strong>25th Anniversary Enrollment Bonus:</strong> +{earlyBirdBonus.months} complimentary month{earlyBirdBonus.months > 1 ? 's' : ''} included!
                    <div className="text-xs text-amber-600 mt-1">
                      Enroll by {earlyBirdBonus.enrollBy} • First payment by {earlyBirdBonus.payBy}
                    </div>
                  </div>
                )}
                {!earlyBirdBonus.isActive && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-muted-foreground">
                    <span className="line-through">25th Anniversary Enrollment Bonus</span> (expired)
                  </div>
                )}
                
                {/* Pay-in-Full Option */}
                <div className="p-4 rounded-lg border-2 border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Pay-in-Full Option</div>
                      <div className="text-sm text-muted-foreground">
                        Doubles commitment months ({selectedTerm === '1-year' ? '1 → 2' : '2 → 4'} + bonus)
                      </div>
                    </div>
                    <Switch
                      data-testid="promo-pay-in-full-toggle"
                      checked={payInFull}
                      onCheckedChange={setPayInFull}
                    />
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Pay monthly is always available. Pay in full to double your commitment months.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-lg border-2 border-border bg-muted/30 text-center text-muted-foreground">
                Pay-in-Full Accelerator only available with 1-Year or 2-Year subscription
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">Savings Calculator</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Plan</label>
              <select
                data-testid="promo-plan-select"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full p-2 rounded-lg border bg-background"
              >
                {PLANS.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - ${p.price}/mo base</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Yard Size</label>
              <select
                data-testid="promo-yard-select"
                value={selectedYardSize}
                onChange={(e) => setSelectedYardSize(e.target.value)}
                className="w-full p-2 rounded-lg border bg-background"
              >
                {YARD_SIZES.map(y => (
                  <option key={y.id} value={y.id}>{y.label} ({y.subtitle})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 text-center">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">${actualMonthly}</div>
              <div className="text-xs text-muted-foreground">Monthly Payment</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{freeMonths}</div>
              <div className="text-xs text-muted-foreground">Complimentary</div>
            </div>
            <div className="bg-accent/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-accent">{billedMonths}</div>
              <div className="text-xs text-muted-foreground">Months Billed</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700">${savings}</div>
              <div className="text-xs text-muted-foreground">Total Savings</div>
            </div>
          </div>

          {freeMonths > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 text-sm text-green-800">
              <strong>How it works:</strong> You'll receive {termMonths} months of service while paying for {billedMonths}. 
              Your final {freeMonths} month{freeMonths > 1 ? 's are' : ' is'} complimentary (skipped billing).
            </div>
          )}
        </div>

        <div className="bg-primary/5 rounded-xl p-6 border border-primary/20 mb-8">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Understanding Complimentary Months
          </h2>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Complimentary months are skipped billing months applied at the end of your term.</strong>
            </p>
            <p className="text-muted-foreground">
              Your subscription still ends on your 12-month or 24-month anniversary date. You receive the same term length—you simply pay for fewer months.
            </p>
            <div className="bg-white rounded-lg p-4 border">
              <p className="font-medium mb-2">Example: 2-Year + Pay-in-Full (Dec-Jan enrollment)</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Commitment (2-year): 2 months</li>
                <li>• Pay-in-Full doubles commitment: 2 × 2 = 4 months</li>
                <li>• 25th Anniversary Bonus: +2 months (not doubled)</li>
                <li>• Total: 6 complimentary months</li>
                <li>• Term: 24 months of service</li>
                <li>• Months billed: 18</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border mt-3">
              <p className="font-medium mb-2">Example: 1-Year + Pay-in-Full (Jan-Feb enrollment)</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Commitment (1-year): 1 month</li>
                <li>• Pay-in-Full doubles commitment: 1 × 2 = 2 months</li>
                <li>• 25th Anniversary Bonus: +1 month (not doubled)</li>
                <li>• Total: 3 complimentary months</li>
                <li>• Term: 12 months of service</li>
                <li>• Months billed: 9</li>
              </ul>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mt-3">
              <p className="font-medium text-amber-800 mb-1">Important:</p>
              <p className="text-amber-700 text-xs">
                Complimentary months are skipped billing months applied at the end of your term. Your subscription still ends on your 12-month or 24-month anniversary date.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
              Start My Free Quote
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
