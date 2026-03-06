import React, { useState } from "react";
import { Bot, CheckCircle2, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const BENEFITS = [
  "Daily autonomous mowing",
  "Weekly-plan pricing",
  "Priority early access",
  "Exclusive member perks",
];

export default function RobotWaitlist() {
  const [email, setEmail] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email to join the waitlist.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, neighborhood }),
      });

      const data = await response.json();

      if (data.success) {
        setIsJoined(true);
        toast({
          title: "You're on the list!",
          description: "We'll notify you when Smart Robot Mowing launches in your area.",
        });
      } else {
        throw new Error(data.message || "Failed to join waitlist");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isJoined) {
    return (
      <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-center gap-3" data-testid="robot-waitlist-success">
        <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
        <p className="text-green-700 font-medium">You're on the Smart Robot Mowing waitlist! We'll be in touch.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 rounded-xl p-5 border border-purple-200 space-y-4" data-testid="robot-waitlist">
      <div className="flex items-start gap-3">
        <div className="bg-purple-600 rounded-xl p-2.5 shrink-0 shadow-md">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-primary text-lg" data-testid="text-robot-title">Smart Robot Mowing</h4>
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Coming Soon</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Autonomous daily mowing at weekly-plan pricing. Be first in line when we launch in your neighborhood.
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
        {BENEFITS.map((benefit, i) => (
          <li key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <div className="bg-purple-100 rounded-full p-0.5">
              <Zap className="w-3 h-3 text-purple-600" />
            </div>
            {benefit}
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <div>
          <Label htmlFor="robot-email" className="text-xs">Email *</Label>
          <Input
            id="robot-email"
            data-testid="input-robot-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="robot-neighborhood" className="text-xs">Neighborhood (optional)</Label>
          <Input
            id="robot-neighborhood"
            data-testid="input-robot-neighborhood"
            type="text"
            placeholder="e.g., Oak Valley, Madison AL"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
        </div>
        <Button
          data-testid="button-robot-waitlist"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-purple-600 text-white hover:bg-purple-700 font-bold"
        >
          {isSubmitting ? "Joining..." : "Join the Waitlist"}
        </Button>
      </div>
    </div>
  );
}
