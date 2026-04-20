import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminSettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function AdminSettingsCard({ title, description, children, action, className }: AdminSettingsCardProps) {
  return (
    <div className={cn("bg-card rounded-[20px] border border-border overflow-hidden", className)}>
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg text-unify-brown">{title}</h3>
            {description && <p className="font-sans text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {action}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
