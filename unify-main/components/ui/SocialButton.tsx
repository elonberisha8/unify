import * as React from "react";
import { cn } from "@/lib/utils";

export interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: "google" | "facebook" | "apple" | "twitter" | "linkedin";
  label?: string;
  icon?: React.ReactNode;
}

const labels: Record<SocialButtonProps["provider"], string> = {
  google: "Vazhdo me Google",
  facebook: "Vazhdo me Facebook",
  apple: "Vazhdo me Apple",
  twitter: "Vazhdo me Twitter",
  linkedin: "Vazhdo me LinkedIn",
};

export const SocialButton = React.forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ provider, label, icon, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-3 w-full h-11 px-6 rounded-full border border-border bg-white text-unify-brown font-sans text-sm font-bold hover:bg-unify-cream transition-colors",
        className
      )}
      {...props}
    >
      {icon}
      {label ?? labels[provider]}
    </button>
  )
);
SocialButton.displayName = "SocialButton";
