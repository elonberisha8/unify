"use client";
import * as React from "react";
import { ChevronRightIcon, HomeIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator, showHome = true, className, ...props }, ref) => {
    const sep = separator ?? <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />;
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn("flex items-center gap-2 text-sm font-sans text-muted-foreground", className)}
        {...props}
      >
        {showHome && (
          <a href="/" className="hover:text-unify-brown transition-colors">
            <HomeIcon className="h-4 w-4" />
          </a>
        )}
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {(showHome || i > 0) && sep}
            {item.href && i < items.length - 1 ? (
              <a href={item.href} className="hover:text-unify-brown transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-unify-brown font-medium">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";
