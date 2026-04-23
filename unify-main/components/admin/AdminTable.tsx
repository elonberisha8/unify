"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";

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
    return <div className={cn("rounded-2xl border border-border bg-white p-12 text-center", className)}>{empty}</div>;
  }
  return (
    <div className={cn("rounded-2xl border border-border bg-white overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className={cn(c.align === "right" && "text-right", c.align === "center" && "text-center")}>
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={getRowId(r)} onClick={() => onRowClick?.(r)} className={onRowClick ? "cursor-pointer" : undefined}>
              {columns.map((c) => (
                <TableCell key={c.key} className={cn(c.align === "right" && "text-right", c.align === "center" && "text-center")}>
                  {c.render(r)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
