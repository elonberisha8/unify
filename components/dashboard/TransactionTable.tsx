"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table";
import { Badge } from "../ui/Badge";

export interface TransactionRow {
  id: string;
  date: string;
  donor: string;
  campaign: string;
  amount: number;
  currency?: string;
  status: "completed" | "pending" | "failed" | "refunded";
}

export interface TransactionTableProps {
  transactions: TransactionRow[];
  onRowClick?: (t: TransactionRow) => void;
  className?: string;
}

const STATUS_MAP = {
  completed: { label: "Përfunduar", variant: "success" as const },
  pending: { label: "Në pritje", variant: "warning" as const },
  failed: { label: "Dështuar", variant: "destructive" as const },
  refunded: { label: "Rimbursuar", variant: "secondary" as const },
};

export function TransactionTable({ transactions, onRowClick, className }: TransactionTableProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-white overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Donatori</TableHead>
            <TableHead>Kampanja</TableHead>
            <TableHead className="text-right">Shuma</TableHead>
            <TableHead>Statusi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => {
            const s = STATUS_MAP[t.status];
            return (
              <TableRow key={t.id} onClick={() => onRowClick?.(t)} className={onRowClick ? "cursor-pointer" : undefined}>
                <TableCell className="text-muted-foreground">{t.date}</TableCell>
                <TableCell className="font-bold">{t.donor}</TableCell>
                <TableCell className="max-w-xs truncate">{t.campaign}</TableCell>
                <TableCell className="text-right font-bold text-unify-brown">
                  {t.currency ?? "€"}{formatNumber(t.amount)}
                </TableCell>
                <TableCell><Badge variant={s.variant}>{s.label}</Badge></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
