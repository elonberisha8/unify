"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface DonationAmountPickerProps {
  presets?: number[];
  value?: number;
  onChange?: (v: number) => void;
  currency?: string;
  className?: string;
}

export function DonationAmountPicker({
  presets = [10, 25, 50, 100, 250],
  value,
  onChange,
  currency = "€",
  className,
}: DonationAmountPickerProps) {
  const [custom, setCustom] = React.useState(value && !presets.includes(value) ? String(value) : "");
  const select = (v: number) => { setCustom(""); onChange?.(v); };
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-3 gap-3">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => select(p)}
            className={cn(
              "h-14 rounded-2xl border-2 font-display text-lg transition-colors",
              value === p && !custom
                ? "border-unify-blue bg-unify-blue/5 text-unify-blue"
                : "border-border text-unify-brown hover:border-unify-blue/50"
            )}
          >
            {currency}{p}
          </button>
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans text-muted-foreground">{currency}</span>
        <input
          type="number"
          value={custom}
          onChange={(e) => { setCustom(e.target.value); onChange?.(Number(e.target.value)); }}
          placeholder="Shuma tjetër"
          className="w-full h-14 pl-10 pr-4 rounded-2xl border-2 border-border font-sans text-base focus:outline-none focus:border-unify-blue"
        />
      </div>
    </div>
  );
}
