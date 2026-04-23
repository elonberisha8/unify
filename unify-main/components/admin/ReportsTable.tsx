import * as React from "react";
import { cn } from "@/lib/utils";

export interface Report {
  id: string;
  targetType: string;
  targetName: string;
  reporter: string;
  reason: string;
  createdAt: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
}

export interface ReportsTableProps {
  reports: Report[];
  onSelect?: (id: string) => void;
  className?: string;
}

const statusCfg = {
  open: { label: "I hapur", color: "bg-destructive/10 text-destructive" },
  investigating: { label: "Në hetim", color: "bg-yellow-100 text-yellow-800" },
  resolved: { label: "I zgjidhur", color: "bg-unify-green/10 text-unify-green" },
  dismissed: { label: "I mbyllur", color: "bg-muted text-muted-foreground" },
};

export function ReportsTable({ reports, onSelect, className }: ReportsTableProps) {
  return (
    <div className={cn("bg-card rounded-[20px] border border-border overflow-hidden", className)}>
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            {["ID", "Objektivi", "Raportuesi", "Arsyeja", "Krijuar", "Statusi"].map((h) => (
              <th key={h} className="text-left font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} onClick={() => onSelect?.(r.id)} className="border-t border-border hover:bg-muted/30 cursor-pointer">
              <td className="px-5 py-3 font-mono text-xs text-muted-foreground">#{r.id}</td>
              <td className="px-5 py-3 font-sans text-sm text-unify-brown">
                <span className="text-muted-foreground">{r.targetType}:</span> {r.targetName}
              </td>
              <td className="px-5 py-3 font-sans text-sm text-unify-brown">{r.reporter}</td>
              <td className="px-5 py-3 font-sans text-sm text-muted-foreground">{r.reason}</td>
              <td className="px-5 py-3 font-sans text-sm text-muted-foreground whitespace-nowrap">{r.createdAt}</td>
              <td className="px-5 py-3">
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-sans font-bold", statusCfg[r.status].color)}>
                  {statusCfg[r.status].label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
