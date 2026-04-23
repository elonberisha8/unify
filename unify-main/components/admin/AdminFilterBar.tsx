"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";
import { SearchIcon } from "@/components/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";

export interface AdminFilterBarProps {
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  filters?: { key: string; label: string; options: { label: string; value: string }[]; value?: string; onChange?: (v: string) => void }[];
  actions?: React.ReactNode;
  className?: string;
}

export function AdminFilterBar({ searchValue, onSearchChange, searchPlaceholder = "Kërko...", filters, actions, className }: AdminFilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white border border-border", className)}>
      {onSearchChange !== undefined && (
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={searchValue} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} className="pl-10" />
        </div>
      )}
      {filters?.map((f) => (
        <Select key={f.key} value={f.value} onValueChange={f.onChange}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder={f.label} /></SelectTrigger>
          <SelectContent>
            {f.options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      ))}
      {actions && <div className="ml-auto flex gap-2">{actions}</div>}
    </div>
  );
}
