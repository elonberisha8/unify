"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextType {
  value?: string;
  onChange: (v: string) => void;
  name: string;
}
const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null);

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  name?: string;
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({ value, defaultValue, onValueChange, name = "radio", children, className }: RadioGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const cur = value ?? internal;
  const change = (v: string) => { setInternal(v); onValueChange?.(v); };
  return (
    <RadioGroupContext.Provider value={{ value: cur, onChange: change, name }}>
      <div className={cn("space-y-2", className)} role="radiogroup">{children}</div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioItemProps {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function RadioItem({ value, label, disabled, className }: RadioItemProps) {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioItem must be inside RadioGroup");
  const selected = ctx.value === value;
  return (
    <label className={cn("flex items-center gap-3 cursor-pointer font-sans text-sm text-unify-brown", disabled && "opacity-50 cursor-not-allowed", className)}>
      <input
        type="radio"
        name={ctx.name}
        checked={selected}
        disabled={disabled}
        onChange={() => ctx.onChange(value)}
        className="sr-only"
      />
      <span className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
        selected ? "border-unify-blue" : "border-border")}>
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-unify-blue" />}
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
