import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Kombinon klasa Tailwind në mënyrë të sigurt (deduplikon konfliktet). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
