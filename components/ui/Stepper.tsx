import * as React from "react";
import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface StepperProps {
  steps: string[];
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <div className={cn("flex items-center w-full", className)}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-2 min-w-[4rem]">
              <div className={cn(
                "h-9 w-9 rounded-full flex items-center justify-center font-sans font-bold text-sm transition-colors",
                done && "bg-unify-blue text-white",
                active && "bg-unify-blue text-white ring-4 ring-unify-blue/20",
                !done && !active && "bg-muted text-muted-foreground"
              )}>
                {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("text-xs font-sans text-center", active ? "text-unify-brown font-bold" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-2 mb-6", done ? "bg-unify-blue" : "bg-muted")} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
