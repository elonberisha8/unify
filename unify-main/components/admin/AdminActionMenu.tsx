"use client";
import * as React from "react";
import { MoreHorizontalIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/DropdownMenu";

export interface AdminActionMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
  divider?: boolean;
}

export interface AdminActionMenuProps {
  items: AdminActionMenuItem[];
  className?: string;
}

export function AdminActionMenu({ items, className }: AdminActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center", className)}>
          <MoreHorizontalIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {items.map((it, i) => (
          <React.Fragment key={i}>
            {it.divider && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={it.onClick}
              className={cn("gap-2", it.destructive && "text-destructive focus:text-destructive")}
            >
              {it.icon}{it.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
