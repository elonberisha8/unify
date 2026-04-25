import * as React from "react";
import { SparklesIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface CreatorCTAProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
}

export function CreatorCTA({
  title = "Bëhu Krijues",
  description = "Krijo kampanjën tënde të parë dhe mblidh mbështetje nga komuniteti.",
  ctaLabel = "Fillo tani",
  onCta,
  className,
}: CreatorCTAProps) {
  return (
    <div className={cn("relative overflow-hidden bg-unify-brown text-white rounded-[24px] p-8 md:p-10", className)}>
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-unify-blue/20 text-unify-blue text-xs font-sans font-bold mb-4">
          <SparklesIcon className="h-3 w-3" />
          E RE
        </div>
        <h2 className="font-display text-3xl md:text-4xl mb-3">{title}</h2>
        <p className="font-sans text-base text-white/80 mb-6">{description}</p>
        <Button variant="primary" size="lg" onClick={onCta}>{ctaLabel}</Button>
      </div>
      <div className="absolute top-0 right-0 h-full w-1/3 bg-unify-blue/10 rounded-l-full" aria-hidden />
    </div>
  );
}
