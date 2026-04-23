"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

export interface HeroSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  imageUrl?: string;
  variant?: "split" | "centered" | "fullbleed";
  className?: string;
}

export function HeroSection({
  eyebrow, title, description, primaryAction, secondaryAction,
  imageUrl, variant = "split", className,
}: HeroSectionProps) {
  if (variant === "fullbleed") {
    return (
      <section className={cn("relative min-h-[500px] overflow-hidden rounded-[24px]", className)}>
        {imageUrl && <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-unify-brown/60" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[500px] px-6 py-16 text-white">
          {eyebrow && <p className="text-sm font-bold uppercase tracking-wider mb-3 text-unify-blue">{eyebrow}</p>}
          <h1 className="font-display text-4xl md:text-6xl max-w-3xl text-balance">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-lg opacity-90">{description}</p>}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {primaryAction && <Button onClick={primaryAction.onClick} size="lg">{primaryAction.label}</Button>}
            {secondaryAction && <Button onClick={secondaryAction.onClick} size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-unify-brown">{secondaryAction.label}</Button>}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "centered") {
    return (
      <section className={cn("text-center py-16 px-6", className)}>
        {eyebrow && <p className="text-sm font-bold uppercase tracking-wider mb-3 text-unify-blue">{eyebrow}</p>}
        <h1 className="font-display text-4xl md:text-6xl text-unify-brown max-w-3xl mx-auto text-balance">{title}</h1>
        {description && <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{description}</p>}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {primaryAction && <Button onClick={primaryAction.onClick} size="lg">{primaryAction.label}</Button>}
          {secondaryAction && <Button onClick={secondaryAction.onClick} size="lg" variant="outline">{secondaryAction.label}</Button>}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("grid md:grid-cols-2 gap-8 items-center py-12", className)}>
      <div>
        {eyebrow && <p className="text-sm font-bold uppercase tracking-wider mb-3 text-unify-blue">{eyebrow}</p>}
        <h1 className="font-display text-4xl md:text-5xl text-unify-brown text-balance">{title}</h1>
        {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryAction && <Button onClick={primaryAction.onClick} size="lg">{primaryAction.label}</Button>}
          {secondaryAction && <Button onClick={secondaryAction.onClick} size="lg" variant="outline">{secondaryAction.label}</Button>}
        </div>
      </div>
      {imageUrl && (
        <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-unify-cream">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </section>
  );
}
