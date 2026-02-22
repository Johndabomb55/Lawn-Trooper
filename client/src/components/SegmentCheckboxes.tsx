import React from "react";
import { Heart, Shield, Users } from "lucide-react";
import { SEGMENT_OPTIONS } from "@/data/promotions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SegmentCheckboxesProps {
  segments: ('renter' | 'veteran' | 'senior')[];
  onSegmentChange: (segments: ('renter' | 'veteran' | 'senior')[]) => void;
  className?: string;
}

const segmentIcons = {
  renter: Users,
  veteran: Shield,
  senior: Heart,
};

export default function SegmentCheckboxes({
  segments,
  onSegmentChange,
  className = "",
}: SegmentCheckboxesProps) {
  const handleToggle = (segmentId: 'renter' | 'veteran' | 'senior') => {
    if (segments.includes(segmentId)) {
      onSegmentChange(segments.filter(s => s !== segmentId));
    } else {
      onSegmentChange([...segments, segmentId]);
    }
  };

  return (
    <div className={`bg-primary/5 rounded-xl p-4 border border-primary/10 ${className}`}>
      <div className="text-sm font-bold text-primary mb-3">
        Special Discounts (Select all that apply)
      </div>
      <div className="space-y-2">
        {SEGMENT_OPTIONS.map((option) => {
          const Icon = segmentIcons[option.id];
          const isChecked = segments.includes(option.id);
          
          return (
            <div 
              key={option.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isChecked ? 'bg-green-50 border border-green-200' : 'hover:bg-muted/50'
              }`}
            >
              <Checkbox
                id={`segment-${option.id}`}
                checked={isChecked}
                onCheckedChange={() => handleToggle(option.id)}
              />
              <Label 
                htmlFor={`segment-${option.id}`} 
                className="cursor-pointer flex-1 flex items-center gap-2"
              >
                <Icon className={`w-4 h-4 ${isChecked ? 'text-green-600' : 'text-muted-foreground'}`} />
                <div>
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-green-600 ml-2">({option.description})</span>
                </div>
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
