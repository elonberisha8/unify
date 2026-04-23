import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
  className?: string;
}

export function ContactInfoCard({ icon, title, value, href, className }: ContactInfoCardProps) {
  const Comp: React.ElementType = href ? "a" : "div";
  return (
    <Comp
      href={href}
      className={cn("flex items-start gap-4 bg-card rounded-[24px] p-6 border border-border hover:shadow-md transition-shadow", className)}
    >
      <div className="h-12 w-12 rounded-full bg-unify-blue/10 text-unify-blue flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-display text-base text-unify-brown mb-1">{title}</p>
        <p className="font-sans text-sm text-muted-foreground">{value}</p>
      </div>
    </Comp>
  );
}
