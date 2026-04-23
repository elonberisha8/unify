"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InboxThread {
  id: string;
  name: string;
  preview: string;
  time: string;
  avatar?: string;
  unread?: number;
}

export interface InboxSidebarProps {
  threads: InboxThread[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function InboxSidebar({ threads, activeId, onSelect, className }: InboxSidebarProps) {
  return (
    <div className={cn("bg-card border-r border-border w-full md:w-80 flex-shrink-0 overflow-y-auto", className)}>
      <div className="p-4 border-b border-border">
        <h2 className="font-display text-xl text-unify-brown">Mesazhet</h2>
      </div>
      <ul>
        {threads.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => onSelect?.(t.id)}
              className={cn(
                "w-full flex gap-3 p-4 text-left hover:bg-unify-cream/50 border-b border-border transition-colors",
                activeId === t.id && "bg-unify-cream"
              )}
            >
              <div className="h-11 w-11 rounded-full bg-muted overflow-hidden flex-shrink-0">
                {t.avatar && <img src={t.avatar} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <p className="font-sans font-bold text-sm text-unify-brown truncate">{t.name}</p>
                  <span className="font-sans text-xs text-muted-foreground flex-shrink-0">{t.time}</span>
                </div>
                <p className="font-sans text-xs text-muted-foreground truncate mt-0.5">{t.preview}</p>
              </div>
              {t.unread && t.unread > 0 && (
                <span className="h-5 min-w-[20px] px-1 rounded-full bg-unify-blue text-white text-[10px] font-bold flex items-center justify-center self-center">
                  {t.unread}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
