import React from "react";

type MascotPose = "sprayer" | "sprayer-action" | "blower" | "logo";
type MascotSize = "sm" | "md" | "lg" | "xl";
type MascotAlign = "left" | "right" | "center";

interface MascotProps {
  pose?: MascotPose;
  size?: MascotSize;
  align?: MascotAlign;
  className?: string;
  hideOnMobile?: boolean;
}

const POSE_IMAGES: Record<MascotPose, string> = {
  sprayer: "/mascot/sprayer.png",
  "sprayer-action": "/mascot/sprayer-action.png",
  blower: "/mascot/blower.png",
  logo: "/mascot/logo.png",
};

const SIZE_CLASSES: Record<MascotSize, string> = {
  sm: "w-16 h-auto md:w-20",
  md: "w-24 h-auto md:w-32",
  lg: "w-32 h-auto md:w-44",
  xl: "w-44 h-auto md:w-56",
};

const ALIGN_CLASSES: Record<MascotAlign, string> = {
  left: "mr-auto",
  right: "ml-auto",
  center: "mx-auto",
};

export function Mascot({
  pose = "sprayer",
  size = "md",
  align = "center",
  className = "",
  hideOnMobile = false,
}: MascotProps) {
  const imageSrc = POSE_IMAGES[pose];
  const sizeClass = SIZE_CLASSES[size];
  const alignClass = ALIGN_CLASSES[align];
  const mobileClass = hideOnMobile ? "hidden md:block" : "";

  return (
    <img
      src={imageSrc}
      alt="Lawn Trooper Mascot"
      loading="lazy"
      className={`${sizeClass} ${alignClass} ${mobileClass} ${className} object-contain drop-shadow-lg`}
      data-testid={`mascot-${pose}`}
    />
  );
}

export default Mascot;
