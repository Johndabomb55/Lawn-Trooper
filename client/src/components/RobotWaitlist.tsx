import React, { useState } from "react";
import { Bot, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsJoined(true);
        toast({
          title: "You're on the list!",
          description: "We'll notify you when Smart Robot Mowing is available in your area.",
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
    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200" data-testid="robot-waitlist">
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-purple-600 rounded-full p-2 shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-primary text-lg" data-testid="text-robot-title">Coming Soon: Smart Robot Mowing</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Be the first to know when autonomous mowing arrives in your neighborhood. Sign up for early access.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="robot-email">Email *</Label>
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
          <Label htmlFor="robot-neighborhood">Address / Neighborhood (optional)</Label>
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
          className="w-full bg-purple-600 text-white hover:bg-purple-700"
        >
          {isSubmitting ? "Joining..." : "Join the Waitlist"}
        </Button>
      </div>
    </div>
  );
}
