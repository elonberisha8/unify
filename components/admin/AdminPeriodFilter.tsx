"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export type Period = "today" | "week" | "month" | "quarter" | "year";

export interface AdminPeriodFilterProps {
  value?: Period;
  onChange?: (p: Period) => void;
  className?: string;
}

const periods: { id: Period; label: string }[] = [
  { id: "today", label: "Sot" },
  { id: "week", label: "Javë" },
  { id: "month", label: "Muaj" },
  { id: "quarter", label: "Tremujor" },
  { id: "year", label: "Vit" },
];

export function AdminPeriodFilter({ value = "month", onChange, className }: AdminPeriodFilterProps) {
  return (
    <div className={cn("inline-flex items-center bg-muted rounded-full p-1", className)}>
      {periods.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange?.(p.id)}
          className={cn(
            "px-4 h-9 rounded-full font-sans text-sm font-medium transition-colors",
            value === p.id ? "bg-white text-unify-brown shadow-sm" : "text-muted-foreground hover:text-unify-brown"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
