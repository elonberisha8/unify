import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";

export interface AuthLayoutProps {
  children: React.ReactNode;
  imageUrl?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function AuthLayout({ children, imageUrl, title, description, className }: AuthLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background grid lg:grid-cols-2", className)}>
      <div className="flex items-center justify-center p-6 md:p-10">{children}</div>
      <div className="hidden lg:block relative bg-unify-brown overflow-hidden">
        {imageUrl && <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />}
        <div className="absolute inset-0 bg-gradient-to-br from-unify-brown/60 to-unify-brown/90" />
        <div className="relative z-10 h-full flex flex-col justify-end p-12 text-white">
          {title && <h2 className="font-display text-4xl max-w-md">{title}</h2>}
          {description && <p className="mt-4 max-w-md opacity-90">{description}</p>}
        </div>
      </div>
    </div>
  );
}
