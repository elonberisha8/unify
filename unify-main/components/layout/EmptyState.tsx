import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("text-center py-16 px-6", className)}>
      {icon && <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-unify-cream flex items-center justify-center text-unify-blue">{icon}</div>}
      <h3 className="font-display text-xl text-unify-brown">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">{description}</p>}
      {action && <Button onClick={action.onClick} className="mt-6">{action.label}</Button>}
    </div>
  );
}
