import * as React from "react";
import { BadgeCheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface UserAvatarWithBadgeProps {
  src?: string;
  alt?: string;
  fallback?: string;
  verified?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function UserAvatarWithBadge({ src, alt, fallback, verified, size = "md", className }: UserAvatarWithBadgeProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-lg",
  }[size];
  const badgeSize = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5", xl: "h-6 w-6" }[size];
  return (
    <div className={cn("relative inline-block", className)}>
      <span className={cn("rounded-full overflow-hidden bg-muted flex items-center justify-center font-sans font-bold text-unify-brown", sizes)}>
        {src ? <img src={src} alt={alt ?? ""} className="h-full w-full object-cover" /> : fallback}
      </span>
      {verified && (
        <BadgeCheckIcon className={cn("absolute -bottom-0.5 -right-0.5 text-unify-blue bg-white rounded-full", badgeSize)} />
      )}
    </div>
  );
}
