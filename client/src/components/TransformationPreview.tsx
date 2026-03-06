import React from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const OUTCOMES = [
  "Clean mowing lines",
  "Crisp bed edges",
  "Healthier turf",
  "More comfortable outdoor space",
];

export default function TransformationPreview() {
  return (
    <div data-testid="transformation-preview" className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4" />
          Your Results Preview
        </div>
        <h3 className="text-xl md:text-2xl font-heading font-bold text-primary">
          Your Yard Transformation
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what to expect with your Lawn Trooper plan
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
        {OUTCOMES.map((outcome, i) => (
          <motion.div
            key={outcome}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            data-testid={`outcome-${i}`}
            className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg"
          >
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm font-medium">{outcome}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowRight className="w-4 h-4" />
          Continue to finalize your plan
        </div>
      </motion.div>
    </div>
  );
}
