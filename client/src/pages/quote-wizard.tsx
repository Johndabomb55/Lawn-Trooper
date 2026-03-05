import MultiStepQuoteWizard from "@/components/MultiStepQuoteWizard";
import companyLogo from "@assets/LT_TRANSPARENT_LOGO_1772295732190.png";

export default function QuoteWizardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <header className="bg-primary text-primary-foreground py-3 px-4 flex items-center justify-center">
        <a href="/" className="flex items-center gap-3">
          <img src={companyLogo} alt="Lawn Trooper" className="h-10 w-auto" />
          <span className="text-lg font-heading font-bold uppercase tracking-wider hidden sm:inline">
            Lawn Trooper
          </span>
        </a>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 md:py-10">
        <MultiStepQuoteWizard />
      </main>

      <footer className="bg-primary text-primary-foreground/70 text-center text-xs py-4 px-4">
        <p>&copy; {new Date().getFullYear()} Lawn Trooper. All rights reserved.</p>
        <p className="mt-1">John@lawn-trooper.com</p>
      </footer>
    </div>
  );
}
