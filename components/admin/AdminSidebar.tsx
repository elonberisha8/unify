"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AlertTriangleIcon,
  FileTextIcon,
  HandHeartIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/icons";

export interface AdminNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string | number;
}

export const DEFAULT_ADMIN_NAV: AdminNavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboardIcon className="h-4 w-4" />, href: "/admin" },
  { key: "users", label: "Perdoruesit", icon: <UsersIcon className="h-4 w-4" />, href: "/admin/perdoruesit" },
  { key: "campaigns", label: "Kampanjat", icon: <MegaphoneIcon className="h-4 w-4" />, href: "/admin/kampanjat" },
  { key: "volunteers", label: "Vullnetare", icon: <HandHeartIcon className="h-4 w-4" />, href: "/admin/vullnetare" },
  { key: "moderation", label: "Moderim", icon: <ShieldIcon className="h-4 w-4" />, href: "/admin/moderim" },
  { key: "reports", label: "Raportimet", icon: <AlertTriangleIcon className="h-4 w-4" />, href: "/admin/raportimet" },
  { key: "blog", label: "Blog CMS", icon: <FileTextIcon className="h-4 w-4" />, href: "/admin/blog" },
  { key: "audit", label: "Audit Log", icon: <ScrollTextIcon className="h-4 w-4" />, href: "/admin/audit-log" },
  { key: "settings", label: "Cilesimet", icon: <SettingsIcon className="h-4 w-4" />, href: "/admin/cilesimet" },
];

export interface AdminSidebarProps {
  items?: AdminNavItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  className?: string;
}

export function AdminSidebar({ items = DEFAULT_ADMIN_NAV, activeKey, onSelect, className }: AdminSidebarProps) {
  return (
    <aside className={cn("z-30 flex w-full shrink-0 flex-col gap-1 overflow-hidden bg-unify-brown p-3 text-white shadow-2xl shadow-unify-brown/10 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:overflow-y-auto lg:p-4", className)}>
      <div className="mb-1 px-3 py-2 lg:mb-2 lg:py-4">
        <p className="font-display text-xl">Unify Admin</p>
        <p className="mt-1 text-xs text-white/50">Internal network only</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {items.map((it) => (
          <Link
            key={it.key}
            href={it.href ?? "#"}
            onClick={() => onSelect?.(it.key)}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors lg:shrink",
              activeKey === it.key ? "bg-white text-unify-brown shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white"
            )}
          >
            {it.icon}
            <span className="flex-1">{it.label}</span>
            {it.badge != null && (
              <span className={cn("text-xs px-2 py-0.5 rounded-full", activeKey === it.key ? "bg-unify-brown text-white" : "bg-white/20 text-white")}>
                {it.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
