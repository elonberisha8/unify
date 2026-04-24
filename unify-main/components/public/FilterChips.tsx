"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface FilterChipsProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  multi?: boolean;
  values?: string[];
  onMultiChange?: (values: string[]) => void;
  className?: string;
}

export function FilterChips({ options, value, onChange, multi, values = [], onMultiChange, className }: FilterChipsProps) {
  const toggle = (v: string) => {
    if (multi) {
      onMultiChange?.(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
    } else {
      onChange?.(v);
    }
  };

  const active = (v: string) => (multi ? values.includes(v) : value === v);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => toggle(o.value)}
          className={cn(
            "h-9 px-4 rounded-full text-sm font-bold transition-colors border-2",
            active(o.value)
              ? "bg-unify-brown text-white border-unify-brown"
              : "bg-white text-unify-brown border-border hover:border-unify-brown"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
