import { useEffect } from "react";
import MultiStepQuoteWizard from "@/components/MultiStepQuoteWizard";
import SiteHeader from "@/components/SiteHeader";

export default function QuoteWizardPage() {
  useEffect(() => { document.title = "Plan Builder | Lawn Trooper"; }, []);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <MultiStepQuoteWizard />
    </div>
  );
}
