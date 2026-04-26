"use client";

import * as React from "react";
import { SearchIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

export interface AdminFilterBarProps {
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  filters?: { key: string; label: string; options: { label: string; value: string }[]; value?: string; onChange?: (v: string) => void }[];
  actions?: React.ReactNode;
  className?: string;
}

export function AdminFilterBar({ searchValue, onSearchChange, searchPlaceholder = "Kerko...", filters, actions, className }: AdminFilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4", className)}>
      {onSearchChange !== undefined && (
        <div className="relative min-w-[220px] flex-1">
          <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchValue} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} className="pl-10" />
        </div>
      )}
      {filters?.map((filter) => (
        <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {actions && <div className="flex w-full flex-wrap gap-2 sm:ml-auto sm:w-auto">{actions}</div>}
    </div>
  );
}
