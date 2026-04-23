"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, UsersIcon, MegaphoneIcon, HandHeartIcon, AlertTriangleIcon, FileTextIcon, SettingsIcon, ScrollTextIcon, ShieldIcon } from "@/components/icons";

export interface AdminNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string | number;
}

export const DEFAULT_ADMIN_NAV: AdminNavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboardIcon className="h-4 w-4" /> },
  { key: "users", label: "Përdoruesit", icon: <UsersIcon className="h-4 w-4" /> },
  { key: "campaigns", label: "Kampanjat", icon: <MegaphoneIcon className="h-4 w-4" /> },
  { key: "volunteers", label: "Vullnetarë", icon: <HandHeartIcon className="h-4 w-4" /> },
  { key: "moderation", label: "Moderim", icon: <ShieldIcon className="h-4 w-4" /> },
  { key: "reports", label: "Raportimet", icon: <AlertTriangleIcon className="h-4 w-4" /> },
  { key: "blog", label: "Blog CMS", icon: <FileTextIcon className="h-4 w-4" /> },
  { key: "audit", label: "Audit Log", icon: <ScrollTextIcon className="h-4 w-4" /> },
  { key: "settings", label: "Cilësimet", icon: <SettingsIcon className="h-4 w-4" /> },
];

export interface AdminSidebarProps {
  items?: AdminNavItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  className?: string;
}

export function AdminSidebar({ items = DEFAULT_ADMIN_NAV, activeKey, onSelect, className }: AdminSidebarProps) {
  return (
    <aside className={cn("w-64 shrink-0 bg-unify-brown text-white p-4 flex flex-col gap-1", className)}>
      <div className="px-3 py-4 mb-2">
        <p className="font-display text-xl">Unify Admin</p>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => onSelect?.(it.key)}
            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-colors",
              activeKey === it.key ? "bg-white text-unify-brown" : "text-white/80 hover:bg-white/10"
            )}
          >
            {it.icon}
            <span className="flex-1">{it.label}</span>
            {it.badge != null && (
              <span className={cn("text-xs px-2 py-0.5 rounded-full", activeKey === it.key ? "bg-unify-brown text-white" : "bg-white/20 text-white")}>
                {it.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}
