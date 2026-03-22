import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import heroImage from "@assets/generated_images/landscaping_crew_working_at_southern_home_with_customer_interaction.png";
import teamImage from "@assets/generated_images/landscaping_crew_with_older_woman_waving_from_porch.png";
import visionImage from "@assets/generated_images/estate_home_lawn_madison.png";
import techImage from "@assets/generated_images/lawn_trooper_diverse_crew_with_smart_glasses_and_camo_mower.png";
import positioningImage from "@assets/generated_images/huntsville_al_home_landscaping.png";

export default function DreamYardReconPage() {
  useEffect(() => { document.title = "Dream Yard Recon™ | Lawn Trooper"; }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="border-b border-border bg-primary/5">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Dream Yard Recon
              </p>
              <h1 className="text-3xl font-heading font-bold text-primary md:text-5xl">Your Yard. Upgraded.</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                See what your property could become with Lawn Trooper's Dream Yard Recon.
              </p>
              <div className="mt-8">
                <a href="/quote-wizard">
                  <Button className="bg-primary text-white hover:bg-primary/90">Unlock Your Dream Yard</Button>
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
              <img src={heroImage} alt="Lawn consultation and planning in a homeowner yard" className="h-[320px] w-full object-cover md:h-[420px]" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <img
              src={teamImage}
              alt="Lawn Trooper walkthrough consultation"
              className="h-44 w-full object-cover object-[center_45%] md:h-52"
              loading="lazy"
            />
            <div className="p-5">
            <h2 className="text-xl font-bold text-primary">What It Is</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A guided, professional evaluation of your property focused on unlocking its full potential.
            </p>
            </div>
          </article>
          <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <img src={visionImage} alt="Lawn vision and premium curb appeal" className="h-40 w-full object-cover" loading="lazy" />
            <div className="p-5">
            <h2 className="text-xl font-bold text-primary">What You Get</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Clear recommendations, upgrade options, and a vision tailored specifically to your property.
            </p>
            </div>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-xl font-bold text-primary">Why It Matters</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Most customers don’t realize what’s possible until they see it mapped out.
            </p>
            <img src={techImage} alt="Technology-forward lawn planning workflow" className="mt-4 h-44 w-full rounded-lg border border-border object-cover md:h-52" loading="lazy" />
          </article>
          <article className="rounded-2xl border border-primary/25 bg-primary/[0.03] p-5 shadow-sm">
            <h2 className="text-xl font-bold text-primary">Positioning</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This is where your yard goes from maintained… to exceptional.
            </p>
            <img
              src={positioningImage}
              alt="Beautiful Alabama-style yard transformation inspiration"
              className="mt-4 h-44 w-full rounded-lg border border-border object-cover object-[center_62%] md:h-52"
              loading="lazy"
            />
          </article>
        </div>

        <div className="mt-10">
          <a href="/quote-wizard">
            <Button variant="outline">Reserve My Plan</Button>
          </a>
        </div>
      </section>
    </div>
  );
}
