"use client";

import * as React from "react";
import { BellIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage, Input } from "@/components/ui";

export interface AdminHeaderProps {
  title: string;
  description?: string;
  user?: { name: string; avatarUrl?: string; role?: string };
  onSearch?: (q: string) => void;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminHeader({ title, description, user, onSearch, notificationCount, onNotificationsClick, actions, className }: AdminHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-white/95 px-4 py-4 shadow-sm shadow-black/[0.02] backdrop-blur sm:px-6", className)}>
      <div className="min-w-[220px] flex-1">
        <h1 className="truncate font-display text-2xl text-unify-brown">{title}</h1>
        {description && <p className="truncate text-sm text-muted-foreground">{description}</p>}
      </div>

      {onSearch && (
        <div className="relative hidden w-72 md:block">
          <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Kerko..." className="pl-10" onChange={(e) => onSearch(e.target.value)} />
        </div>
      )}

      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}

      {onNotificationsClick && (
        <button onClick={onNotificationsClick} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
          <BellIcon className="h-4 w-4" />
          {notificationCount != null && notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
      )}

      {user && (
        <div className="flex items-center gap-3 rounded-full border border-border bg-white px-2 py-1">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold">{user.name}</p>
            {user.role && <p className="text-xs text-muted-foreground">{user.role}</p>}
          </div>
          <Avatar>
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
}
