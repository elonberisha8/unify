import * as React from "react";
import { cn } from "@/lib/utils";

export interface QuickStat {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "flat";
}

export interface AdminQuickStatsProps {
  stats: QuickStat[];
  className?: string;
}

export function AdminQuickStats({ stats, className }: AdminQuickStatsProps) {
  const trendColor = { up: "text-unify-green", down: "text-destructive", flat: "text-muted-foreground" };
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {stats.map((s, i) => (
        <div key={i} className="bg-card rounded-[16px] p-5 border border-border">
          <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide">{s.label}</p>
          <p className="font-display text-2xl text-unify-brown mt-2">{s.value}</p>
          {s.change && <p className={cn("font-sans text-xs mt-1", trendColor[s.trend ?? "flat"])}>{s.change}</p>}
        </div>
      ))}
    </div>
  );
}
