import React from "react";
import { Shield, Lock } from "lucide-react";

interface TrustBadgeProps {
  variant?: 'compact' | 'full';
  message?: string;
  className?: string;
}

export default function TrustBadge({ 
  variant = 'compact', 
  message,
  className = "" 
}: TrustBadgeProps) {
  const defaultMessage = "No payment required. This is a FREE Dream Yard Recon request.";
  const displayMessage = message || defaultMessage;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 ${className}`}>
        <Shield className="w-3.5 h-3.5" />
        <span className="font-medium">{displayMessage}</span>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="bg-green-100 rounded-full p-2 shrink-0">
          <Lock className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-green-800 font-medium">{displayMessage}</p>
          <p className="text-xs text-green-600 mt-1">Your information is secure and will never be sold.</p>
        </div>
      </div>
    </div>
  );
}
