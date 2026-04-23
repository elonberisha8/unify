"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

export interface CallToActionSectionProps {
  title: string;
  description?: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  variant?: "default" | "inverse";
  className?: string;
}

export function CallToActionSection({
  title, description, primaryAction, secondaryAction, variant = "default", className,
}: CallToActionSectionProps) {
  const inverse = variant === "inverse";
  return (
    <section className={cn("rounded-[32px] p-8 md:p-12 text-center", inverse ? "bg-unify-brown text-white" : "bg-unify-cream text-unify-brown", className)}>
      <h2 className="font-display text-3xl md:text-4xl text-balance max-w-2xl mx-auto">{title}</h2>
      {description && <p className={cn("mt-3 max-w-xl mx-auto", inverse ? "opacity-80" : "text-muted-foreground")}>{description}</p>}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {primaryAction && <Button onClick={primaryAction.onClick} size="lg">{primaryAction.label}</Button>}
        {secondaryAction && (
          <Button onClick={secondaryAction.onClick} size="lg" variant="outline" className={inverse ? "bg-white/10 border-white text-white hover:bg-white hover:text-unify-brown" : ""}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </section>
  );
}
