import React from "react";
import { Check } from "lucide-react";

interface WizardProgressProps {
  currentStep: number;
  steps: { id: number; title: string }[];
}

export default function WizardProgress({ currentStep, steps }: WizardProgressProps) {
  const visibleSteps = steps.filter(s => s.id !== steps[0].id && s.id !== steps[steps.length - 1].id);

  return (
    <div data-testid="wizard-progress" className="flex items-center justify-between w-full px-1 py-2">
      {visibleSteps.map((s, i) => {
        const isCompleted = currentStep > s.id;
        const isCurrent = currentStep === s.id;
        return (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-1 min-w-0">
              <div
                data-testid={`progress-step-${s.id}`}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                    ? "bg-accent text-white ring-2 ring-accent/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span
                className={`text-[10px] leading-tight text-center max-w-[60px] truncate ${
                  isCurrent ? "font-bold text-accent" : isCompleted ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {s.title}
              </span>
            </div>
            {i < visibleSteps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded ${
                  currentStep > s.id ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
