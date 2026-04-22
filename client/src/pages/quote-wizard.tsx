import { useEffect } from "react";
import { useLocation } from "wouter";

export default function QuoteWizardPage() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/");
    setTimeout(() => {
      const el = document.getElementById("builder");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [setLocation]);
  return null;
}
