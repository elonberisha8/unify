"use client";
import * as React from "react";
import { MoreHorizontalIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui";

export interface AdminActionMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
  divider?: boolean;
  confirmLabel?: string;
}

export interface AdminActionMenuProps {
  items: AdminActionMenuItem[];
  className?: string;
}

export function AdminActionMenu({ items, className }: AdminActionMenuProps) {
  const runAction = (item: AdminActionMenuItem) => {
    const message = item.confirmLabel ?? (item.destructive ? `Konfirmo veprimin: ${item.label}` : undefined);
    if (message && !window.confirm(message)) return;
    item.onClick();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Hap veprimet"
          className={cn("h-9 w-9 rounded-full border border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-unify-brown flex items-center justify-center transition-colors", className)}
        >
          <MoreHorizontalIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {items.map((it, i) => (
          <React.Fragment key={i}>
            {it.divider && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => runAction(it)}
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
