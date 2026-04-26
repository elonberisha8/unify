"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";

export interface AdminTableColumn<T> {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  render: (row: T) => React.ReactNode;
}

export interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: React.ReactNode;
  className?: string;
}

export function AdminTable<T>({ columns, rows, getRowId, onRowClick, empty, className }: AdminTableProps<T>) {
  if (rows.length === 0 && empty) {
    return <div className={cn("rounded-2xl border border-dashed border-border bg-white p-10 text-center shadow-sm", className)}>{empty}</div>;
  }
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow className="bg-muted/40">
            {columns.map((c) => (
              <TableHead key={c.key} className={cn("whitespace-nowrap text-xs font-bold uppercase tracking-wide text-muted-foreground", c.align === "right" && "text-right", c.align === "center" && "text-center")}>
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={getRowId(r)} onClick={() => onRowClick?.(r)} className={cn("transition-colors hover:bg-muted/30", onRowClick && "cursor-pointer")}>
              {columns.map((c) => (
                <TableCell key={c.key} className={cn("align-middle text-sm", c.align === "right" && "text-right", c.align === "center" && "text-center")}>
                  {c.render(r)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
