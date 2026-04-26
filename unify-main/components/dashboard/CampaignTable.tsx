"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { MoreHorizontalIcon } from "@/components/icons";

export interface CampaignRow {
  id: string;
  title: string;
  status: "active" | "draft" | "completed" | "paused";
  raised: number;
  goal: number;
  currency?: string;
  donorCount: number;
  createdAt: string;
}

export interface CampaignTableProps {
  campaigns: CampaignRow[];
  onRowClick?: (c: CampaignRow) => void;
  onMenuClick?: (c: CampaignRow) => void;
  className?: string;
}

const STATUS_MAP = {
  active: { label: "Aktive", variant: "success" as const },
  draft: { label: "Draft", variant: "secondary" as const },
  completed: { label: "Përfunduar", variant: "primary" as const },
  paused: { label: "Pauzuar", variant: "warning" as const },
};

export function CampaignTable({ campaigns, onRowClick, onMenuClick, className }: CampaignTableProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-white overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kampanja</TableHead>
            <TableHead>Statusi</TableHead>
            <TableHead className="text-right">Mbledhur</TableHead>
            <TableHead className="text-right">Donatorë</TableHead>
            <TableHead>Krijuar</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((c) => {
            const s = STATUS_MAP[c.status];
            const pct = Math.round((c.raised / c.goal) * 100);
            return (
              <TableRow key={c.id} onClick={() => onRowClick?.(c)} className={onRowClick ? "cursor-pointer" : undefined}>
                <TableCell className="font-bold max-w-xs truncate">{c.title}</TableCell>
                <TableCell><Badge variant={s.variant}>{s.label}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="font-bold text-unify-brown">{c.currency ?? "€"}{formatNumber(c.raised)}</div>
                  <div className="text-xs text-muted-foreground">{pct}%</div>
                </TableCell>
                <TableCell className="text-right">{c.donorCount}</TableCell>
                <TableCell className="text-muted-foreground">{c.createdAt}</TableCell>
                <TableCell>
                  {onMenuClick && (
                    <button onClick={(e) => { e.stopPropagation(); onMenuClick(c); }} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
