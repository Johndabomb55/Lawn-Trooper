import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import companyLogo from "@assets/lawn-trooper-logo-badge-2026-transparent.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Dream Yard Recon", href: "/dream-yard-recon", featured: true },
  { label: "Service Area", href: "/service-area" },
  { label: "HOA", href: "/hoa-partnerships" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src={companyLogo} alt="Lawn Trooper" className="h-10 w-10 object-contain" />
          <span className="font-heading text-xl font-bold tracking-tight text-primary">LAWN TROOPER</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.featured
                  ? "rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-amber-900 transition-colors hover:bg-amber-100"
                  : "text-sm font-medium text-foreground transition-colors hover:text-primary"
              }
            >
              {item.label}
            </Link>
          ))}
          <a href="/quote-wizard">
            <Button className="bg-primary text-white hover:bg-primary/90">Reserve My Plan</Button>
          </a>
        </nav>

        <button className="p-2 md:hidden" onClick={() => setIsMenuOpen((prev) => !prev)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-3 px-4 py-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={`${item.href}-mobile`}
                href={item.href}
                onClick={closeMenu}
                className={
                  item.featured
                    ? "rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-extrabold uppercase tracking-wide text-amber-900"
                    : "py-1 text-sm font-medium text-foreground"
                }
              >
                {item.label}
              </Link>
            ))}
            <a href="/quote-wizard" onClick={closeMenu}>
              <Button className="mt-1 w-full bg-primary text-white hover:bg-primary/90">Reserve My Plan</Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
