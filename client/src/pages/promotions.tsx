import { Link } from "wouter";
import { ArrowLeft, Check, Sparkles, Calculator, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PLANS, YARD_SIZES, getYardMultiplier } from "@/data/plans";
import { 
  COMMITMENT_TERMS, 
  PAYMENT_METHODS,
  MONTH_TO_MONTH_PREMIUM,
  calculateActualMonthly,
  calculateEffectiveMonthly,
  getTotalFreeMonths
} from "@/data/promotions";

export default function PromotionsPage() {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [selectedYardSize, setSelectedYardSize] = useState("1/3");
  const [selectedTerm, setSelectedTerm] = useState<'month-to-month' | '1-year' | '2-year'>('1-year');
  const [payInFull, setPayInFull] = useState(false);

  const plan = PLANS.find(p => p.id === selectedPlan);
  const yardSize = YARD_SIZES.find(y => y.id === selectedYardSize);
  const term = COMMITMENT_TERMS.find(t => t.id === selectedTerm);

  const basePrice = plan && yardSize 
    ? Math.round(plan.price * getYardMultiplier(yardSize.id))
    : 0;

  const actualMonthly = calculateActualMonthly(basePrice, selectedTerm);
  const effectiveMonthly = calculateEffectiveMonthly(basePrice, selectedTerm, payInFull);
  const freeMonths = getTotalFreeMonths(selectedTerm, payInFull, false);
  
  const termMonths = term?.months || 12;
  const paidMonths = Math.max(termMonths - freeMonths, 1);
  const totalCost = actualMonthly * paidMonths;
  const fullCost = actualMonthly * termMonths;
  const savings = fullCost - totalCost;

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
                  onClick={() => setSelectedTerm(t.id)}
                  className={`w-full p-3 rounded-lg border-2 text-left flex justify-between items-center transition-all ${
                    selectedTerm === t.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div>
                    <div className="font-medium">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.description}</div>
                  </div>
                  {t.freeMonths > 0 && (
                    <span className="text-green-600 font-bold">+{t.freeMonths} free</span>
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
              <h2 className="font-bold text-lg">Payment Method</h2>
            </div>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  data-testid={`promo-payment-${pm.id}`}
                  onClick={() => setPayInFull(pm.id === 'pay-in-full')}
                  className={`w-full p-3 rounded-lg border-2 text-left flex justify-between items-center transition-all ${
                    (pm.id === 'pay-in-full' ? payInFull : !payInFull && pm.id === 'monthly')
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div>
                    <div className="font-medium">{pm.label}</div>
                    <div className="text-xs text-muted-foreground">{pm.description}</div>
                  </div>
                  {pm.bonus && <span className="text-green-600 font-bold">{pm.bonus}</span>}
                </button>
              ))}
            </div>
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
              <div className="text-xs text-muted-foreground">Free Months</div>
            </div>
            <div className="bg-accent/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-accent">{paidMonths}</div>
              <div className="text-xs text-muted-foreground">Months Billed</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700">${savings}</div>
              <div className="text-xs text-muted-foreground">Total Savings</div>
            </div>
          </div>

          {freeMonths > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 text-sm text-green-800">
              <strong>How it works:</strong> With {freeMonths} free month{freeMonths > 1 ? 's' : ''} on a {termMonths}-month plan, 
              you pay for the first {paidMonths} months. Your final {freeMonths} month{freeMonths > 1 ? 's are' : ' is'} not billed.
            </div>
          )}
        </div>

        <div className="bg-primary/5 rounded-xl p-6 border border-primary/20 mb-8">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Understanding Free Months
          </h2>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Free months are skipped billing months at the END of your agreement.</strong>
            </p>
            <p className="text-muted-foreground">
              This is NOT a discount or credit. Your service continues at full quality, but your final months are simply not billed.
            </p>
            <div className="bg-white rounded-lg p-4 border">
              <p className="font-medium mb-2">Example: 2-Year Commitment + Pay in Full</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Term: 24 months of service</li>
                <li>• Free months earned: 2 (from term) + 1 (pay in full) = 3</li>
                <li>• Months billed: 21</li>
                <li>• Final 3 months: Not billed</li>
              </ul>
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
