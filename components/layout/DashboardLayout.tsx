"use client";
import * as React from "react";
import Link from "next/link";
import { LayoutDashboardIcon, MegaphoneIcon, HandHeartIcon, InboxIcon, BookmarkIcon, SettingsIcon, WalletIcon, ScrollTextIcon, UserIcon, LogOutIcon, FileTextIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

export interface DashboardNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string | number;
}

export const DEFAULT_DASHBOARD_NAV: DashboardNavItem[] = [
  { key: "home", label: "Dashboard", icon: <LayoutDashboardIcon className="h-4 w-4" />, href: "/dashboard" },
  { key: "campaigns", label: "Kampanjat", icon: <MegaphoneIcon className="h-4 w-4" />, href: "/dashboard/kampanjat" },
  { key: "volunteer", label: "Shpalljet", icon: <HandHeartIcon className="h-4 w-4" />, href: "/dashboard/shpalljet" },
  { key: "blog", label: "Blog", icon: <FileTextIcon className="h-4 w-4" />, href: "/blog" },
  { key: "inbox", label: "Inbox", icon: <InboxIcon className="h-4 w-4" />, href: "/dashboard/inbox" },
  { key: "bookmarks", label: "Ruajtura", icon: <BookmarkIcon className="h-4 w-4" />, href: "/dashboard/te-ruajtura" },
  { key: "transactions", label: "Transaksionet", icon: <WalletIcon className="h-4 w-4" />, href: "/dashboard/transaksionet" },
  { key: "applications", label: "Aplikimet", icon: <ScrollTextIcon className="h-4 w-4" />, href: "/dashboard/aplikimet" },
  { key: "profile", label: "Profili", icon: <UserIcon className="h-4 w-4" />, href: "/dashboard/profili" },
  { key: "settings", label: "Cilësimet", icon: <SettingsIcon className="h-4 w-4" />, href: "/dashboard/profili" },
];

export interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems?: DashboardNavItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  user?: { name: string; email?: string; avatarUrl?: string };
  onLogout?: () => void;
  className?: string;
}

export function DashboardLayout({
  children, navItems = DEFAULT_DASHBOARD_NAV, activeKey, onSelect,
  user, onLogout, className,
}: DashboardLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background flex", className)}>
      <aside className="w-64 shrink-0 bg-white border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <p className="font-display text-2xl text-unify-brown">Unify</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((it) =>
            it.href ? (
              <Link
                key={it.key}
                href={it.href}
                onClick={() => onSelect?.(it.key)}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors",
                  activeKey === it.key ? "bg-unify-blue text-white" : "text-unify-brown hover:bg-muted"
                )}
              >
                {it.icon}
                <span className="flex-1">{it.label}</span>
                {it.badge != null && (
                  <span className={cn("text-xs px-2 py-0.5 rounded-full",
                    activeKey === it.key ? "bg-white text-unify-blue" : "bg-unify-blue text-white"
                  )}>{it.badge}</span>
                )}
              </Link>
            ) : (
              <button
                key={it.key}
                onClick={() => onSelect?.(it.key)}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-colors",
                  activeKey === it.key ? "bg-unify-blue text-white" : "text-unify-brown hover:bg-muted"
                )}
              >
                {it.icon}
                <span className="flex-1">{it.label}</span>
              </button>
            )
          )}
        </nav>

        {user && (
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 p-2">
              <Avatar>
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.name}</p>
                {user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
              </div>
              {onLogout && (
                <button onClick={onLogout} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center" aria-label="Dil">
                  <LogOutIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
