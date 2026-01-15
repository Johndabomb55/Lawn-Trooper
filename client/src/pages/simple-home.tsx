import React from "react";
import StreamlinedWizard from "@/components/StreamlinedWizard";
import { Shield, Mail, Phone } from "lucide-react";
import heroMascot from "@assets/generated_images/camo_soldier_mascot_weedeating.png";

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Minimal Header */}
      <header className="bg-primary text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={heroMascot} alt="Lawn Trooper" className="h-10 w-10 object-contain rounded-full bg-white/10" />
            <span data-testid="text-brand" className="font-heading font-bold text-xl tracking-tight">LAWN TROOPER</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <a data-testid="link-phone-header" href="tel:+12565550000" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Phone className="w-4 h-4" />
              (256) 555-0000
            </a>
          </div>
        </div>
      </header>

      {/* Main Content - Just the Wizard */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 data-testid="text-main-title" className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
            Get Your Free Lawn Care Quote
          </h1>
          <p data-testid="text-subtitle" className="text-muted-foreground max-w-xl mx-auto">
            North Alabama's trusted lawn care service for 25+ years. Build your perfect plan in under 2 minutes.
          </p>
        </div>

        <StreamlinedWizard />

        {/* Trust Bar */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-primary" />
            <span>Licensed & Insured</span>
          </div>
          <div className="flex items-center gap-1">
            <span>•</span>
            <span>25+ Years in North Alabama</span>
          </div>
          <div className="flex items-center gap-1">
            <span>•</span>
            <span>100+ Beautification Awards</span>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-primary text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a data-testid="link-email-footer" href="mailto:lawntrooperllc@gmail.com" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Mail className="w-4 h-4" />
              lawntrooperllc@gmail.com
            </a>
            <a data-testid="link-phone-footer" href="tel:+12565550000" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Phone className="w-4 h-4" />
              (256) 555-0000
            </a>
          </div>
          <p data-testid="text-service-area" className="text-white/60">
            Serving Athens, Huntsville, Madison, Decatur, and all of North Alabama
          </p>
          <p className="text-white/40 text-xs mt-2">
            © {new Date().getFullYear()} Lawn Trooper LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
