"use client";
import * as React from "react";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="bg-card rounded-[20px] border border-border overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-display text-base text-unify-brown pr-4">{item.question}</span>
              <ChevronDownIcon className={cn("h-5 w-5 text-unify-brown transition-transform flex-shrink-0", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 font-sans text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
