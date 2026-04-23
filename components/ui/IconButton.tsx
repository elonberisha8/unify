import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-unify-blue text-white hover:bg-[#0a90f3]",
        ghost: "text-unify-brown hover:bg-unify-cream",
        outline: "border border-border text-unify-brown hover:bg-unify-cream",
      },
      size: { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  "aria-label": string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(iconButtonVariants({ variant, size }), className)} {...props} />
  )
);
IconButton.displayName = "IconButton";
