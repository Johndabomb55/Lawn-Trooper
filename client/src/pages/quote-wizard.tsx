import MultiStepQuoteWizard from "@/components/MultiStepQuoteWizard";
import SiteHeader from "@/components/SiteHeader";

export default function QuoteWizardPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <MultiStepQuoteWizard />
    </div>
  );
}
