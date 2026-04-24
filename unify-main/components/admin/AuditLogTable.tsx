import * as React from "react";
import { cn } from "@/lib/utils";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target?: string;
  ip?: string;
  severity?: "info" | "warning" | "critical";
}

export interface AuditLogTableProps {
  entries: AuditLogEntry[];
  className?: string;
}

const severity = {
  info: "bg-unify-blue/10 text-unify-blue",
  warning: "bg-yellow-100 text-yellow-800",
  critical: "bg-destructive/10 text-destructive",
};

export function AuditLogTable({ entries, className }: AuditLogTableProps) {
  return (
    <div className={cn("bg-card rounded-[20px] border border-border overflow-hidden", className)}>
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground px-5 py-3">Koha</th>
            <th className="text-left font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground px-5 py-3">Përdoruesi</th>
            <th className="text-left font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground px-5 py-3">Veprimi</th>
            <th className="text-left font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground px-5 py-3">Objektivi</th>
            <th className="text-left font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground px-5 py-3">IP</th>
            <th className="text-left font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground px-5 py-3">Niveli</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-t border-border hover:bg-muted/30">
              <td className="px-5 py-3 font-sans text-sm text-muted-foreground whitespace-nowrap">{e.timestamp}</td>
              <td className="px-5 py-3 font-sans text-sm text-unify-brown">{e.actor}</td>
              <td className="px-5 py-3 font-sans text-sm text-unify-brown">{e.action}</td>
              <td className="px-5 py-3 font-sans text-sm text-muted-foreground">{e.target ?? "—"}</td>
              <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{e.ip ?? "—"}</td>
              <td className="px-5 py-3">
                {e.severity && (
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-sans font-bold", severity[e.severity])}>
                    {e.severity}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
