"use client";
import * as React from "react";
import { BookmarkIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface BookmarkButtonProps {
  bookmarked?: boolean;
  onToggle?: (next: boolean) => void;
  size?: "sm" | "md";
  variant?: "icon" | "text";
  className?: string;
}

export function BookmarkButton({ bookmarked = false, onToggle, size = "md", variant = "icon", className }: BookmarkButtonProps) {
  const h = size === "sm" ? "h-8" : "h-10";

  if (variant === "text") {
    return (
      <button
        onClick={() => onToggle?.(!bookmarked)}
        className={cn("inline-flex items-center gap-2 px-4 rounded-full border-2 text-sm font-bold transition-colors", h,
          bookmarked ? "bg-unify-brown text-white border-unify-brown" : "border-border hover:border-unify-brown",
          className
        )}
      >
        <BookmarkIcon className={cn("h-4 w-4", bookmarked && "fill-current")} />
        {bookmarked ? "Ruajtur" : "Ruaj"}
      </button>
    );
  }

  return (
    <button
      onClick={() => onToggle?.(!bookmarked)}
      className={cn("rounded-full flex items-center justify-center bg-white border border-border hover:border-unify-brown transition-colors",
        size === "sm" ? "h-8 w-8" : "h-10 w-10", className
      )}
      aria-label={bookmarked ? "Hiq nga të ruajturat" : "Ruaj"}
    >
      <BookmarkIcon className={cn("h-4 w-4", bookmarked && "fill-unify-blue text-unify-blue")} />
    </button>
  );
}
