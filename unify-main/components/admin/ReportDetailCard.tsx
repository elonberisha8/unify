import * as React from "react";
import { AlertTriangleIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface ReportDetailCardProps {
  reportId: string;
  reporter: string;
  target: { type: string; name: string };
  reason: string;
  description?: string;
  createdAt: string;
  evidence?: { label: string; url: string }[];
  className?: string;
}

export function ReportDetailCard({ reportId, reporter, target, reason, description, createdAt, evidence = [], className }: ReportDetailCardProps) {
  return (
    <div className={cn("bg-card rounded-[20px] p-6 border border-border", className)}>
      <div className="flex items-start gap-4 pb-5 border-b border-border">
        <div className="h-11 w-11 rounded-full bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0">
          <AlertTriangleIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-lg text-unify-brown">Raport #{reportId}</h3>
          <p className="font-sans text-sm text-muted-foreground mt-1">Nga {reporter} — {createdAt}</p>
        </div>
      </div>
      <dl className="py-5 space-y-3 border-b border-border">
        <div className="flex gap-4">
          <dt className="w-28 font-sans text-sm text-muted-foreground">Objektivi</dt>
          <dd className="font-sans text-sm text-unify-brown">{target.type}: <span className="font-bold">{target.name}</span></dd>
        </div>
        <div className="flex gap-4">
          <dt className="w-28 font-sans text-sm text-muted-foreground">Arsyeja</dt>
          <dd className="font-sans text-sm text-unify-brown">{reason}</dd>
        </div>
        {description && (
          <div className="flex gap-4">
            <dt className="w-28 font-sans text-sm text-muted-foreground">Përshkrimi</dt>
            <dd className="font-sans text-sm text-unify-brown">{description}</dd>
          </div>
        )}
      </dl>
      {evidence.length > 0 && (
        <div className="pt-5">
          <p className="font-sans text-sm font-bold text-unify-brown mb-2">Dëshmia</p>
          <ul className="space-y-1">
            {evidence.map((e, i) => (
              <li key={i}>
                <a href={e.url} className="font-sans text-sm text-unify-blue hover:underline">
                  {e.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
