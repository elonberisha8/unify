import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AdminChartCard({ title, subtitle, action, children, className }: AdminChartCardProps) {
  return (
    <div className={cn("bg-card rounded-[20px] p-6 border border-border", className)}>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="font-display text-lg text-unify-brown">{title}</h3>
          {subtitle && <p className="font-sans text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}
