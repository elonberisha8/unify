import * as React from "react";
import { LoaderIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <div role="status" aria-label="Duke ngarkuar" className={cn("inline-flex", className)} {...props}>
      <LoaderIcon className={cn("animate-spin text-unify-blue", SIZE_MAP[size])} />
    </div>
  );
}
