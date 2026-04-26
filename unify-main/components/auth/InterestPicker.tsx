"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface Interest {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface InterestPickerProps {
  interests: Interest[];
  value?: string[];
  onChange?: (ids: string[]) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function InterestPicker({ interests, value = [], onChange, max, className }: InterestPickerProps) {
  const toggle = (id: string) => {
    const has = value.includes(id);
    const next = has ? value.filter((x) => x !== id) : (max && value.length >= max ? value : [...value, id]);
    onChange?.(next);
  };
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {interests.map((i) => {
        const selected = value.includes(i.id);
        return (
          <button
            key={i.id}
            onClick={() => toggle(i.id)}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 font-sans text-sm font-medium transition-colors",
              selected
                ? "border-unify-blue bg-unify-blue text-white"
                : "border-border bg-card text-unify-brown hover:border-unify-blue/50"
            )}
          >
            {i.icon}
            {i.label}
          </button>
        );
      })}
    </div>
  );
}
