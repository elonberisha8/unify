import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Bazë për të gjitha ikonat e Unify.
 * Të gjitha ikonat janë 24×24, stroke-based, currentColor.
 */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps & { children: React.ReactNode }>(
  ({ size = 24, strokeWidth = 2, className, children, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  )
);
Icon.displayName = "Icon";
