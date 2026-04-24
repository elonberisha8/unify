import * as React from "react";
import { CheckCircleIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface SuccessHeroProps {
  title?: string;
  description?: string;
  amount?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SuccessHero({
  title = "Faleminderit për donacionin!",
  description = "Donacioni juaj u pranua me sukses. Ndikimi juaj është i rëndësishëm.",
  amount,
  action,
  className,
}: SuccessHeroProps) {
  return (
    <div className={cn("text-center max-w-xl mx-auto py-16 px-6", className)}>
      <div className="mx-auto h-20 w-20 rounded-full bg-unify-green/10 flex items-center justify-center mb-6">
        <CheckCircleIcon className="h-12 w-12 text-unify-green" />
      </div>
      <h1 className="font-display text-4xl text-unify-brown mb-4">{title}</h1>
      <p className="font-sans text-base text-muted-foreground mb-6">{description}</p>
      {amount && (
        <div className="font-display text-5xl text-unify-blue mb-8">{amount}</div>
      )}
      {action}
    </div>
  );
}
