"use client";
import * as React from "react";
import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface RoleSelectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function RoleSelectionCard({ icon, title, description, selected, onClick, className }: RoleSelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative text-left w-full p-6 rounded-[24px] border-2 transition-colors",
        selected ? "border-unify-blue bg-unify-blue/5" : "border-border bg-card hover:border-unify-blue/50",
        className
      )}
    >
      {selected && (
        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-unify-blue text-white flex items-center justify-center">
          <CheckIcon className="h-4 w-4" />
        </div>
      )}
      <div className={cn(
        "h-14 w-14 rounded-full flex items-center justify-center mb-4",
        selected ? "bg-unify-blue text-white" : "bg-unify-cream text-unify-brown"
      )}>
        {icon}
      </div>
      <h3 className="font-display text-lg text-unify-brown mb-2">{title}</h3>
      <p className="font-sans text-sm text-muted-foreground">{description}</p>
    </button>
  );
}
