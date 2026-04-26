import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: "blue" | "green" | "brown";
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, max = 100, showLabel, color = "blue", className, ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const fill = {
      blue: "bg-unify-blue",
      green: "bg-unify-green",
      brown: "bg-unify-brown",
    }[color];
    return (
      <div ref={ref} className={cn("space-y-1.5", className)} {...props}>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className={cn("h-full rounded-full transition-all", fill)} style={{ width: `${pct}%` }} />
        </div>
        {showLabel && (
          <div className="flex justify-between text-xs font-sans text-muted-foreground">
            <span>{value}</span>
            <span>{max}</span>
          </div>
        )}
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";
