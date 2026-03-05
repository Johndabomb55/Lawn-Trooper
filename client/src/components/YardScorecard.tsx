import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Loader2, TrendingUp } from "lucide-react";

const ANALYSIS_STEPS = [
  "Analyzing yard size",
  "Checking seasonal needs",
  "Building your plan",
];

const SCORECARD_CATEGORIES = [
  { label: "Grass Health", score: 52 },
  { label: "Bed Condition", score: 45 },
  { label: "Edge Definition", score: 58 },
  { label: "Outdoor Comfort", score: 48 },
  { label: "Seasonal Readiness", score: 42 },
];

function getScoreColor(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-orange-500";
}

export default function YardScorecard() {
  const [phase, setPhase] = useState<"loading" | "reveal">("loading");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const stepTimers = ANALYSIS_STEPS.map((_, i) =>
      setTimeout(() => setActiveStep(i), i * 800)
    );
    const revealTimer = setTimeout(() => setPhase("reveal"), ANALYSIS_STEPS.length * 800 + 400);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(revealTimer);
    };
  }, []);

  return (
    <div data-testid="yard-scorecard" className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4" />
          AI Yard Analysis
        </div>
        <h3 className="text-xl md:text-2xl font-heading font-bold text-primary">
          Your Property Scorecard
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Based on your yard size and regional data
        </p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-muted/50 rounded-xl p-6 space-y-4"
          >
            {ANALYSIS_STEPS.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.8 }}
                className="flex items-center gap-3"
              >
                {i <= activeStep ? (
                  i < activeStep ? (
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-accent animate-spin flex-shrink-0" />
                  )
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                )}
                <span className={`text-sm ${i <= activeStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-3">
              {SCORECARD_CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  data-testid={`score-${cat.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{cat.label}</span>
                    <span className="text-sm font-bold">{cat.score}/100</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${getScoreColor(cat.score)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 flex items-center gap-3"
            >
              <TrendingUp className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-primary">
                  Estimated Score After Lawn Trooper Care
                </div>
                <div data-testid="score-projected" className="text-2xl font-heading font-bold text-accent">
                  90+
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
