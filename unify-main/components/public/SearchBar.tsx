"use client";
import * as React from "react";
import { SearchIcon, CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SearchBar({
  value: controlled, onChange, onSubmit,
  placeholder = "Kërko kampanja, vullnetarë, blog...",
  size = "md", className,
}: SearchBarProps) {
  const [internal, setInternal] = React.useState("");
  const value = controlled ?? internal;

  const setValue = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onChange?.(v);
  };

  const h = size === "sm" ? "h-10" : size === "lg" ? "h-14" : "h-12";

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(value); }}
      className={cn("relative flex items-center rounded-full bg-white border border-border focus-within:border-unify-blue transition-colors", h, className)}
    >
      <SearchIcon className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent pl-11 pr-10 text-sm outline-none"
      />
      {value && (
        <button type="button" onClick={() => setValue("")} className="absolute right-3 p-1 rounded-full hover:bg-muted">
          <CloseIcon className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      )}
    </form>
  );
}
