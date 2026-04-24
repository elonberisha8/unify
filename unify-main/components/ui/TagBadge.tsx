"use client";
import * as React from "react";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface TagBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  removable?: boolean;
  onRemove?: () => void;
  color?: "default" | "blue" | "green" | "brown";
}

export function TagBadge({ label, removable, onRemove, color = "default", className, ...props }: TagBadgeProps) {
  const colors = {
    default: "bg-unify-cream text-unify-brown",
    blue: "bg-unify-blue/10 text-unify-blue",
    green: "bg-unify-green/10 text-unify-green",
    brown: "bg-unify-brown text-white",
  }[color];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium", colors, className)} {...props}>
      {label}
      {removable && (
        <button onClick={onRemove} className="hover:opacity-70" aria-label="Hiq">
          <CloseIcon className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
