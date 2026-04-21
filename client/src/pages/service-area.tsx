import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import heroImage from "@assets/generated_images/huntsville_al_home_landscaping.png";
import athensImage from "@assets/generated_images/athens_al_middle_class_home_landscaping.png";
import madisonImage from "@assets/generated_images/estate_home_lawn_madison.png";

const areas = ["Athens", "Madison", "Huntsville", "Hampton Cove"];

export default function ServiceAreaPage() {
  useEffect(() => { document.title = "Service Area — North Alabama | Lawn Trooper"; }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="border-b border-border bg-primary/5">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <MapPin className="h-3.5 w-3.5" />
                Service Area
              </p>
              <h1 className="text-3xl font-heading font-bold text-primary md:text-5xl">Proudly Serving North Alabama</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Focused service areas allow us to deliver consistent, high-quality results.
              </p>
              <div className="mt-8">
                <a href="/#builder">
                  <Button className="bg-primary text-white hover:bg-primary/90">Check Availability</Button>
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
              <img src={heroImage} alt="Lawn Trooper service area neighborhood" className="h-72 w-full object-cover md:h-80" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <img src={athensImage} alt="Athens, Alabama neighborhood lawn service" className="h-44 w-full rounded-xl border border-border object-cover" loading="lazy" />
          <img src={madisonImage} alt="Madison, Alabama premium lawn service" className="h-44 w-full rounded-xl border border-border object-cover" loading="lazy" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:max-w-2xl">
          {areas.map((area) => (
            <div key={area} className="rounded-xl border border-border bg-card px-4 py-3 font-semibold text-primary">
              {area}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Lawn Trooper provides professional lawn care and landscape maintenance services across the North Alabama
            region. Our focused service areas allow us to maintain reliable scheduling, consistent quality, and strong
            customer relationships.
          </p>
        </div>
      </section>
    </div>
  );
}
