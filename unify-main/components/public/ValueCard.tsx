import * as React from "react";
import { cn } from "@/lib/utils";

export interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function ValueCard({ icon, title, description, className }: ValueCardProps) {
  return (
    <div className={cn("bg-card rounded-[24px] p-8 border border-border", className)}>
      <div className="h-14 w-14 rounded-full bg-unify-blue/10 text-unify-blue flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="font-display text-xl text-unify-brown mb-3">{title}</h3>
      <p className="font-sans text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
