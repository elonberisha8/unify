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
    <label className={cn("flex items-start justify-between gap-4 cursor-pointer", disabled && "opacity-50", className)}>
      <div className="flex-1">
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
          "relative h-6 w-11 rounded-full transition-colors flex-shrink-0",
          on ? "bg-unify-blue" : "bg-muted"
        )}
      >
        <span className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-[22px]" : "translate-x-0.5"
        )} />
      </button>
    </label>
  );
}
