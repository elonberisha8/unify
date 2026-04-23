import * as React from "react";
import { cn } from "@/lib/utils";

export interface BlogSidebarItem {
  title: string;
  date?: string;
  image?: string;
  href?: string;
}

export interface BlogSidebarProps {
  recent?: BlogSidebarItem[];
  categories?: { label: string; count: number }[];
  tags?: string[];
  className?: string;
}

export function BlogSidebar({ recent = [], categories = [], tags = [], className }: BlogSidebarProps) {
  return (
    <aside className={cn("space-y-6", className)}>
      {recent.length > 0 && (
        <div className="bg-card rounded-[24px] p-6 border border-border">
          <h3 className="font-display text-lg text-unify-brown mb-4">Postimet e fundit</h3>
          <ul className="space-y-3">
            {recent.map((p, i) => (
              <li key={i}>
                <a href={p.href} className="flex gap-3 hover:opacity-80">
                  {p.image && <img src={p.image} alt="" className="h-14 w-14 rounded-lg object-cover" />}
                  <div className="flex-1">
                    <p className="font-sans text-sm text-unify-brown font-medium line-clamp-2">{p.title}</p>
                    {p.date && <p className="font-sans text-xs text-muted-foreground mt-1">{p.date}</p>}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {categories.length > 0 && (
        <div className="bg-card rounded-[24px] p-6 border border-border">
          <h3 className="font-display text-lg text-unify-brown mb-4">Kategoritë</h3>
          <ul className="space-y-2">
            {categories.map((c, i) => (
              <li key={i} className="flex justify-between font-sans text-sm">
                <a href="#" className="text-unify-brown hover:text-unify-blue">{c.label}</a>
                <span className="text-muted-foreground">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tags.length > 0 && (
        <div className="bg-card rounded-[24px] p-6 border border-border">
          <h3 className="font-display text-lg text-unify-brown mb-4">Etiketat</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-unify-cream text-unify-brown text-xs font-sans">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
