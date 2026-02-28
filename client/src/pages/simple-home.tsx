import React from "react";
import StreamlinedWizard from "@/components/StreamlinedWizard";
import { Shield, Mail, Phone, Leaf, Award, Cpu, Star, ChevronRight } from "lucide-react";
import { HERO_CONTENT, TRUST_BAR_COMPACT, WHY_LAWN_TROOPER, PLAN_SUMMARIES, TESTIMONIALS, FOOTER_CONTENT } from "@/data/content";
import { PLANS } from "@/data/plans";
import heroMascot from "@assets/Lawn_Trooper_in_front_of_luxury_home_1771794280044.png";
import companyLogo from "@assets/LT_TRANSPARENT_LOGO_1772295732190.png";

const iconMap: Record<string, React.ElementType> = {
  Leaf,
  Award,
  Cpu,
  Shield,
};

export default function SimpleHome() {
  const scrollToWizard = () => {
    const wizardEl = document.getElementById("quote-wizard");
    if (wizardEl) {
      wizardEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Minimal Header */}
      <header className="bg-primary text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={companyLogo} alt="Lawn Trooper" className="h-10 w-10 object-contain rounded-full bg-white/10" />
            <span data-testid="text-brand" className="font-heading font-bold text-xl tracking-tight">LAWN TROOPER</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <a data-testid="link-phone-header" href="tel:+12565550000" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Phone className="w-4 h-4" />
              {FOOTER_CONTENT.phone}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section with Wizard */}
      <main className="container mx-auto px-4 py-4 md:py-6">
        <div className="text-center mb-3">
          <h1 data-testid="text-main-title" className="text-2xl md:text-3xl font-heading font-bold text-primary mb-1">
            {HERO_CONTENT.title}
          </h1>
          <p data-testid="text-subtitle" className="text-muted-foreground text-sm">
            {HERO_CONTENT.subtitle}
          </p>
        </div>

        {/* Compact Trust Bar - directly under hero */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-4">
          {TRUST_BAR_COMPACT.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="hidden sm:inline">•</span>}
              <Shield className="w-3 h-3 text-primary" />
              {item}
            </span>
          ))}
        </div>

        <div id="quote-wizard">
          <StreamlinedWizard />
        </div>
      </main>

      {/* Plan Overview Section */}
      <section className="py-12 bg-muted/30" aria-labelledby="plans-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 id="plans-heading" data-testid="text-plans-title" className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">
              {PLAN_SUMMARIES.sectionTitle}
            </h2>
            <p data-testid="text-plans-subtitle" className="text-muted-foreground max-w-xl mx-auto">
              {PLAN_SUMMARIES.sectionSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLAN_SUMMARIES.plans.map((summary, index) => {
              const planData = PLANS.find(p => p.id === summary.id);
              const isExecutive = summary.id === "executive";
              return (
                <article
                  key={summary.id}
                  data-testid={`card-plan-${summary.id}`}
                  className={`relative bg-white rounded-xl p-6 shadow-md border-2 transition-all hover:shadow-lg ${
                    isExecutive ? "border-accent" : "border-border"
                  }`}
                  aria-label={`${summary.name} plan`}
                >
                  {isExecutive && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                      BEST VALUE
                    </div>
                  )}
                  <h3 className="font-heading font-bold text-xl text-primary mb-1">{summary.name}</h3>
                  <div className="text-2xl font-bold text-foreground mb-2">
                    from ${planData?.price || "---"}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    Perfect for: {summary.perfectFor}
                  </p>
                  <ul className="space-y-2 mb-6" role="list" aria-label={`${summary.name} features`}>
                    {summary.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    data-testid={`button-build-plan-${summary.id}`}
                    onClick={scrollToWizard}
                    className={`w-full py-3 rounded-lg font-bold transition-colors ${
                      isExecutive
                        ? "bg-accent text-white hover:bg-accent/90"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                    aria-label={`Build my ${summary.name} plan`}
                  >
                    Build My Plan
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Lawn Trooper Section */}
      <section className="py-12" aria-labelledby="why-heading">
        <div className="container mx-auto px-4">
          <h2 id="why-heading" data-testid="text-why-title" className="text-2xl md:text-3xl font-heading font-bold text-primary text-center mb-8">
            {WHY_LAWN_TROOPER.sectionTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {WHY_LAWN_TROOPER.bullets.map((bullet) => {
              const IconComponent = iconMap[bullet.icon] || Shield;
              return (
                <article
                  key={bullet.id}
                  data-testid={`card-why-${bullet.id}`}
                  className="bg-white rounded-xl p-5 shadow-sm border border-border text-center hover:shadow-md transition-shadow"
                  aria-label={bullet.title}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{bullet.title}</h3>
                  <p className="text-sm text-muted-foreground">{bullet.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-primary/5" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4">
          <h2 id="testimonials-heading" data-testid="text-testimonials-title" className="text-2xl md:text-3xl font-heading font-bold text-primary text-center mb-8">
            {TESTIMONIALS.sectionTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.reviews.map((review) => (
              <article
                key={review.id}
                data-testid={`card-testimonial-${review.id}`}
                className="bg-white rounded-xl p-5 shadow-sm border border-border"
                aria-label={`Review by ${review.name}`}
              >
                <div className="flex gap-0.5 mb-3" role="img" aria-label={`${review.stars} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-sm mb-3 italic">"{review.quote}"</p>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">{review.name}</span>
                  <span className="mx-1">•</span>
                  <span>Verified customer, {review.location}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 text-center">
        <div className="container mx-auto px-4">
          <h2 data-testid="text-cta-title" className="text-2xl font-heading font-bold text-primary mb-4">
            Ready for a Picture-Perfect Lawn?
          </h2>
          <button
            data-testid="button-get-started-bottom"
            onClick={scrollToWizard}
            className="bg-accent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent/90 transition-colors"
            aria-label="Get started with your free quote"
          >
            Get Your Free Quote
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a data-testid="link-email-footer" href={`mailto:${FOOTER_CONTENT.email}`} className="flex items-center gap-1 hover:text-accent transition-colors">
              <Mail className="w-4 h-4" />
              {FOOTER_CONTENT.email}
            </a>
            <a data-testid="link-phone-footer" href="tel:+12565550000" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Phone className="w-4 h-4" />
              {FOOTER_CONTENT.phone}
            </a>
          </div>
          <p data-testid="text-service-area" className="text-white/60">
            {FOOTER_CONTENT.serviceArea}
          </p>
          <p className="text-white/40 text-xs mt-2">
            © {new Date().getFullYear()} Lawn Trooper LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
