"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

export interface OnboardingStepsProps {
  steps: { title: string; description?: string; content: React.ReactNode }[];
  currentStep: number;
  onNext?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
  nextLabel?: string;
  backLabel?: string;
  completeLabel?: string;
  className?: string;
}

export function OnboardingSteps({
  steps, currentStep, onNext, onBack, onComplete,
  nextLabel = "Vazhdo", backLabel = "Mbrapa", completeLabel = "Përfundo",
  className,
}: OnboardingStepsProps) {
  const s = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  return (
    <Card className={cn("w-full max-w-xl", className)}>
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors",
              i <= currentStep ? "bg-unify-blue" : "bg-muted"
            )} />
          ))}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Hapi {currentStep + 1} nga {steps.length}
          </p>
          <h2 className="font-display text-2xl text-unify-brown mt-1">{s.title}</h2>
          {s.description && <p className="text-sm text-muted-foreground mt-2">{s.description}</p>}
        </div>

        <div>{s.content}</div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={onBack} disabled={isFirst}>{backLabel}</Button>
          {isLast ? (
            <Button onClick={onComplete} size="lg">{completeLabel}</Button>
          ) : (
            <Button onClick={onNext} size="lg">{nextLabel}</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
