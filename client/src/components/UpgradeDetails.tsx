import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getUpgradeDetail } from "@/data/upgradeDetails";
import { getAddonById } from "@/data/plans";

interface UpgradeDetailsProps {
  upgradeId: string;
}

export default function UpgradeDetails({ upgradeId }: UpgradeDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const detail = getUpgradeDetail(upgradeId);
  const addon = getAddonById(upgradeId);
  const previewText = detail?.what ?? addon?.description ?? "";

  if (!detail && !addon) return null;

  return (
    <div className="w-full">
      {previewText && (
        <p className="ml-1 mb-0.5 text-[11px] leading-tight text-muted-foreground">
          {previewText}
        </p>
      )}
      <button
        data-testid={`upgrade-detail-toggle-${upgradeId}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors py-0.5 px-1"
      >
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
        <span>{isOpen ? "Hide details" : "View details"}</span>
      </button>

      {isOpen && (
        <div
          data-testid={`upgrade-detail-content-${upgradeId}`}
          className="mt-1 ml-1 p-2.5 bg-muted/40 border border-border/50 rounded-lg text-xs space-y-1.5"
        >
          {detail ? (
            <>
              <div>
                <span className="font-semibold text-primary">What it is: </span>
                <span className="text-muted-foreground">{detail.what}</span>
              </div>
              <div>
                <span className="font-semibold text-primary">When it happens: </span>
                <span className="text-muted-foreground">{detail.when}</span>
              </div>
              <div>
                <span className="font-semibold text-primary">Why it matters: </span>
                <span className="text-muted-foreground">{detail.why}</span>
              </div>
            </>
          ) : addon ? (
            <div>
              <span className="text-muted-foreground">{addon.description}</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
