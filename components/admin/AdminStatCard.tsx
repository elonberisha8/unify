import * as React from "react";
import { TrendingUpIcon, TrendingDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface AdminStatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  change?: { value: string; trend: "up" | "down" };
  sparkline?: React.ReactNode;
  className?: string;
}

export function AdminStatCard({ label, value, icon, change, sparkline, className }: AdminStatCardProps) {
  return (
    <div className={cn("bg-card rounded-[20px] p-6 border border-border", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {icon && <div className="h-10 w-10 rounded-full bg-unify-blue/10 text-unify-blue flex items-center justify-center">{icon}</div>}
          <p className="font-sans text-sm text-muted-foreground">{label}</p>
        </div>
        {change && (
          <span className={cn("inline-flex items-center gap-1 font-sans text-xs font-bold",
            change.trend === "up" ? "text-unify-green" : "text-destructive"
          )}>
            {change.trend === "up" ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
            {change.value}
          </span>
        )}
      </div>
      <p className="font-display text-3xl text-unify-brown">{value}</p>
      {sparkline && <div className="mt-3 h-10">{sparkline}</div>}
    </div>
  );
}
