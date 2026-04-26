"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";

export interface OnboardingStepperProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export function OnboardingStepper({ steps, currentStep, className }: OnboardingStepperProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-5">
        <ol className="space-y-4">
          {steps.map((s, i) => {
            const state = i < currentStep ? "done" : i === currentStep ? "active" : "todo";
            return (
              <li key={i} className="flex items-start gap-3">
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  state === "done" && "bg-unify-green text-white",
                  state === "active" && "bg-unify-blue text-white",
                  state === "todo" && "bg-muted text-muted-foreground"
                )}>
                  {state === "done" ? "✓" : i + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className={cn("text-sm font-bold", state === "todo" && "text-muted-foreground")}>{s.label}</p>
                  {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
