import * as React from "react";
import { cn } from "@/lib/utils";

export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive";
}

export interface ActionButtonGroupProps {
  actions: ActionItem[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function ActionButtonGroup({ actions, orientation = "horizontal", className }: ActionButtonGroupProps) {
  return (
    <div className={cn("inline-flex bg-card rounded-full border border-border overflow-hidden",
      orientation === "vertical" && "flex-col rounded-2xl",
      className
    )}>
      {actions.map((a, i) => (
        <button
          key={i}
          onClick={a.onClick}
          className={cn(
            "inline-flex items-center gap-2 px-4 h-10 font-sans text-sm font-medium transition-colors",
            a.variant === "destructive" ? "text-destructive hover:bg-destructive/10" : "text-unify-brown hover:bg-unify-cream",
            i > 0 && orientation === "horizontal" && "border-l border-border",
            i > 0 && orientation === "vertical" && "border-t border-border"
          )}
        >
          {a.icon}
          {a.label}
        </button>
      ))}
    </div>
  );
}
