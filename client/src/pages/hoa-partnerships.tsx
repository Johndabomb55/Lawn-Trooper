import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import heroImage from "@assets/generated_images/athens_al_middle_class_home_landscaping.png";
import consistencyImage from "@assets/generated_images/huntsville_al_home_landscaping.png";
import approachImage from "@assets/stock_images/beautiful_green_lawn_72837635.jpg";

const handledItems = [
  "Common area mowing and maintenance",
  "Entrance and signage upkeep",
  "Shrub and landscape management",
  "Seasonal cleanup and property refreshes",
  "Turf treatments and weed control",
];

export default function HoaPartnershipsPage() {
  useEffect(() => { document.title = "HOA & Community Partnerships | Lawn Trooper"; }, []);
  const [hoaName, setHoaName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hoaAcreage, setHoaAcreage] = useState("");
  const [hoaUnits, setHoaUnits] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setStatusType(null);

    if (!contactName.trim() || !hoaName.trim()) {
      setStatusType("error");
      setStatusMessage("Please provide your name and HOA/community name.");
      return;
    }

    if (!phone.trim() && !email.trim()) {
      setStatusType("error");
      setStatusMessage("Please provide a phone or email so we can reach you.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          address: "",
          yardSize: "custom",
          plan: "custom",
          basicAddons: [],
          premiumAddons: [],
          notes: "",
          totalPrice: "custom",
          freeMonths: "0",
          term: "custom",
          payUpfront: "false",
          propertyType: "hoa",
          hoaName: hoaName.trim(),
          hoaAcreage: hoaAcreage.trim() || undefined,
          hoaUnits: hoaUnits.trim() || undefined,
          hoaNotes: notes.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setStatusType("success");
      setStatusMessage("Thanks - your HOA consultation request is in. Our team will reach out shortly.");
      setHoaName("");
      setContactName("");
      setPhone("");
      setEmail("");
      setHoaAcreage("");
      setHoaUnits("");
      setNotes("");
    } catch {
      setStatusType("error");
      setStatusMessage("We couldn't submit your request right now. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="border-b border-border bg-primary/5">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <Building2 className="h-3.5 w-3.5" />
                HOA Partnerships
              </p>
              <h1 className="text-3xl font-heading font-bold text-primary md:text-5xl">
                Reliable Lawn Care for HOAs & Communities
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Consistent service. Clean presentation. Professional results.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#hoa-form">
                  <Button className="bg-primary text-white hover:bg-primary/90">Request HOA Consultation</Button>
                </a>
                <a href="/#builder">
                  <Button variant="outline">Start Residential Plan Builder</Button>
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
              <img src={heroImage} alt="North Alabama neighborhood streetscape and homes" className="h-[320px] w-full object-cover object-[center_62%] md:h-[420px]" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20 space-y-6">
        <article className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-primary">Proven Experience</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            For over 25 years, Lawn Trooper has maintained residential communities and shared spaces across North
            Alabama.
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-primary">What We Handle</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {handledItems.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-primary">Consistency Matters</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            HOA properties require dependable service and attention to detail. Our structured approach ensures your
            community always looks its best.
          </p>
          <img src={consistencyImage} alt="Consistent HOA neighborhood presentation" className="mt-4 h-56 w-full rounded-lg border border-border object-cover object-[center_65%] md:h-64" loading="lazy" />
        </article>

        <article className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-primary">Modern Approach</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We continue to invest in efficient, lower-noise equipment and evolving systems to improve service quality
            and reduce disruption.
          </p>
          <img src={approachImage} alt="Neighborhood street and community landscaping" className="mt-4 h-56 w-full rounded-lg border border-border object-cover object-[center_64%] md:h-64" loading="lazy" />
        </article>

        <article className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6">
          <h2 className="text-xl font-bold text-primary">Long-Term Partnership Focus</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We aim to build long-term partnerships with communities that value reliability, communication, and
            results.
          </p>
        </article>

        <section id="hoa-form" className="rounded-2xl border border-primary/25 bg-primary/[0.03] p-6">
          <h2 className="text-2xl font-heading font-bold text-primary">Request HOA Consultation</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your HOA details and our team will follow up to schedule a walkthrough and discuss next steps.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="hoaName" className="mb-1 block text-sm font-medium text-muted-foreground">
                  HOA / Community Name *
                </label>
                <input
                  id="hoaName"
                  type="text"
                  value={hoaName}
                  onChange={(event) => setHoaName(event.target.value)}
                  placeholder="e.g., Oakwood Estates HOA"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactName" className="mb-1 block text-sm font-medium text-muted-foreground">
                  Contact Name *
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="(256) 795-2949"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="contact@hoa.com"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="hoaAcreage" className="mb-1 block text-sm font-medium text-muted-foreground">
                  Estimated Acreage (optional)
                </label>
                <input
                  id="hoaAcreage"
                  type="text"
                  value={hoaAcreage}
                  onChange={(event) => setHoaAcreage(event.target.value)}
                  placeholder="Approximate size"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>
              <div>
                <label htmlFor="hoaUnits" className="mb-1 block text-sm font-medium text-muted-foreground">
                  Number of Units (optional)
                </label>
                <input
                  id="hoaUnits"
                  type="text"
                  value={hoaUnits}
                  onChange={(event) => setHoaUnits(event.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>
            </div>

            <div>
              <label htmlFor="hoaNotes" className="mb-1 block text-sm font-medium text-muted-foreground">
                Notes (optional)
              </label>
              <textarea
                id="hoaNotes"
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Any timing, access, or property context we should know before outreach."
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>

            {statusMessage && (
              <p className={`text-sm font-medium ${statusType === "success" ? "text-green-700" : "text-red-700"}`}>{statusMessage}</p>
            )}

            <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Request HOA Consultation"}
            </Button>
          </form>
        </section>
      </section>
    </div>
  );
}
