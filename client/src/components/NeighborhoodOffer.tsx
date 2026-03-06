import React, { useState } from "react";
import { Users, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function NeighborhoodOffer() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    const url = `${window.location.origin}?ref=neighbor`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link Copied!",
        description: "Share this link with your neighbors to unlock a free bundled upgrade.",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200" data-testid="neighborhood-offer">
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-blue-600 rounded-full p-2 shrink-0">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-primary text-lg" data-testid="text-neighborhood-title">Neighborhood Launch Offer</h4>
          <p className="text-sm text-muted-foreground mt-1" data-testid="text-neighborhood-desc">
            Lawn Trooper is expanding service routes in your area. When 3 homes nearby join Lawn Trooper, everyone receives an extra bundled upgrade.
          </p>
        </div>
      </div>
      <Button
        data-testid="button-invite-neighbors"
        onClick={handleCopyLink}
        className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Link Copied!" : "Invite Your Neighbors"}
      </Button>
    </div>
  );
}
