"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminToggleSwitchProps {
  label?: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function AdminToggleSwitch({ label, description, checked, defaultChecked, onCheckedChange, disabled, className }: AdminToggleSwitchProps) {
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = checked ?? internal;
  const toggle = () => {
    const next = !on;
    setInternal(next);
    onCheckedChange?.(next);
  };
  return (
    <label className={cn("flex cursor-pointer items-center justify-between gap-4 rounded-xl px-1 py-1", disabled && "opacity-50", className)}>
      <div className="min-w-0 flex-1">
        {label && <p className="font-sans font-medium text-sm text-unify-brown">{label}</p>}
        {description && <p className="font-sans text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative h-7 w-12 flex-shrink-0 rounded-full border transition-colors",
          on ? "border-unify-blue bg-unify-blue" : "border-border bg-muted"
        )}
      >
        <span className={cn(
          "absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
          on ? "translate-x-5" : "translate-x-0"
        )} />
      </button>
    </label>
  );
}
