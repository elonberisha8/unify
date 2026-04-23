import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsBarProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: StatItem[];
}

export function StatsBar({ stats, className, ...props }: StatsBarProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-6 bg-card rounded-[24px] p-8 border border-border", className)} {...props}>
      {stats.map((s, i) => (
        <div key={i} className="text-center">
          <div className="font-display text-4xl text-unify-brown mb-2">{s.value}</div>
          <div className="font-sans text-sm text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
