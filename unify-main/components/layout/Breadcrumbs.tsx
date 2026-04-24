import * as React from "react";
import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center gap-1.5 text-sm", className)}>
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {it.href && !isLast ? (
              <a href={it.href} className="text-muted-foreground hover:text-unify-brown">{it.label}</a>
            ) : (
              <span className={isLast ? "font-bold text-unify-brown" : "text-muted-foreground"}>{it.label}</span>
            )}
            {!isLast && <ChevronRightIcon className="h-3.5 w-3.5 text-muted-foreground" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
