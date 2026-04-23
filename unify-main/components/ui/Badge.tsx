import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-sans font-bold transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-unify-blue/10 text-unify-blue",
        secondary: "bg-unify-cream text-unify-brown",
        success: "bg-[#e6f9ed] text-unify-green",
        warning: "bg-[#fef3c7] text-[#d97706]",
        destructive: "bg-destructive/10 text-destructive",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: { variant: "primary" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
