"use client";
import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const pages = React.useMemo(() => {
    const arr: (number | "...")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) arr.push(i);
      else if (arr[arr.length - 1] !== "...") arr.push("...");
    }
    return arr;
  }, [currentPage, totalPages]);

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-2 text-muted-foreground">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              buttonVariants({ variant: p === currentPage ? "primary" : "ghost", size: "icon" }),
              "w-10"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </nav>
  );
}
