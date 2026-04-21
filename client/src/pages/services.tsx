import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import heroImage from "@assets/generated_images/southern_home_with_wrap-around_porch_and_fall_flowers.png";
import lawnMaintenanceImg from "@assets/stock_images/manicured_lawn_curb__ee49a3f0.jpg";
import turfHealthImg from "@assets/weed-control-fertilizer-upgrade.png";
import flowerBedsImg from "@assets/generated_images/tidy_front_yard_landscaping.png";
import shrubManagementImg from "@assets/stock_images/man_trimming_hedges__92159ffe.jpg";
import seasonalServicesImg from "@assets/Holiday_lights_on_a_festive_home_1771794249376.png";
import mulchEnhancementsImg from "@assets/stock_images/brown_pine_straw_mul_b3cac663.jpg";
import hoaMaintenanceImg from "@assets/stock_images/landscaped_front_yar_ab31baff.jpg";

const serviceCards = [
  {
    title: "Lawn Maintenance",
    body: "Routine mowing, edging, trimming, and cleanup to maintain a consistently sharp appearance.",
    image: lawnMaintenanceImg,
  },
  {
    title: "Turf Health & Weed Control",
    body: "Year-round treatment programs designed to promote healthy growth and reduce unwanted weeds.",
    image: turfHealthImg,
  },
  {
    title: "Flower Beds & Landscape Care",
    body: "Professional upkeep and enhancement of landscape areas for a clean, polished look.",
    image: flowerBedsImg,
  },
  {
    title: "Shrub & Plant Management",
    body: "Scheduled trimming and shaping to maintain structure and plant health.",
    image: shrubManagementImg,
  },
  {
    title: "Seasonal Services",
    body: "Leaf cleanup, seasonal transitions, holiday season house and yard lighting, and property refreshes throughout the year.",
    image: seasonalServicesImg,
    imageClassName: "object-[center_72%]",
  },
  {
    title: "Mulch & Enhancements",
    body: "Visual and functional upgrades to improve curb appeal and landscape performance.",
    image: mulchEnhancementsImg,
  },
  {
    title: "HOA & Community Maintenance",
    body: "Reliable, consistent service for shared spaces and neighborhood entrances.",
    image: hoaMaintenanceImg,
  },
];

export default function ServicesPage() {
  useEffect(() => { document.title = "Lawn Care Services | Lawn Trooper"; }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="border-b border-border bg-primary/5">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                Services
              </p>
              <h1 className="text-3xl font-heading font-bold text-primary md:text-5xl">
                Full-Service Lawn Care. Done Right.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                We handle everything your property needs-so you don't have to.
              </p>
              <div className="mt-8">
                <a href="/#builder">
                  <Button className="bg-primary text-white hover:bg-primary/90">Get Your Instant Quote</Button>
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
              <img src={heroImage} alt="Beautiful North Alabama lawn and home" className="h-72 w-full object-cover md:h-80" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceCards.map((card) => (
            <article key={card.title} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <img
                src={card.image}
                alt={card.title}
                className={`h-40 w-full object-cover ${card.imageClassName ?? ""}`}
                loading="lazy"
              />
              <div className="p-5">
              <h2 className="text-xl font-bold text-primary">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 text-center">
          <p className="text-base font-medium text-primary">
            Every Lawn Trooper property receives a customized service plan. Final recommendations and enhancements are
            reviewed during your in-person walkthrough to ensure the best possible results.
          </p>
          <div className="mt-5 flex justify-center">
            <a href="/#builder">
              <Button className="bg-primary text-white hover:bg-primary/90">Schedule Your Walkthrough</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
