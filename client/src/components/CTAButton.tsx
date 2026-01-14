import React from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface CTAButtonProps {
  onClick?: () => void;
  variant?: "primary" | "hero" | "outline";
  size?: "default" | "large" | "hero";
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
  urgentText?: string;
}

export default function CTAButton({ 
  onClick, 
  variant = "primary", 
  size = "default",
  showIcon = true,
  children = "Get Instant Quote",
  className = "",
  urgentText
}: CTAButtonProps) {
  const baseStyles = "font-bold uppercase tracking-wider transition-all";
  
  const sizeStyles = {
    default: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
    hero: "px-10 py-6 text-xl md:text-2xl"
  };
  
  const variantStyles = {
    primary: "bg-[#1a3d24] text-white hover:bg-[#234d2f] shadow-lg hover:shadow-xl",
    hero: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-2xl hover:scale-105",
    outline: "bg-transparent border-2 border-accent text-accent hover:bg-accent/10"
  };

  return (
    <Button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} flex flex-col items-center gap-1`}
      style={{ height: 'auto' }}
    >
      <span className="flex items-center gap-2">
        {showIcon && <Zap className="w-5 h-5" />}
        {children}
      </span>
      {urgentText && (
        <span className="text-[10px] md:text-xs font-bold normal-case" style={{ color: variant === 'hero' ? '#1a3d24' : '#facc15' }}>
          {urgentText}
        </span>
      )}
    </Button>
  );
}
