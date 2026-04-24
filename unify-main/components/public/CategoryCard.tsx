import * as React from "react";
import { cn } from "@/lib/utils";

export interface CategoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  count?: number;
  icon?: React.ReactNode;
  image?: string;
  onClick?: () => void;
}

export function CategoryCard({ title, count, icon, image, onClick, className, ...props }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn("bg-card rounded-[24px] p-6 cursor-pointer hover:shadow-lg transition-shadow border border-border", className)}
      {...props}
    >
      {image && (
        <div className="h-32 w-full rounded-2xl overflow-hidden mb-4 bg-muted">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
      )}
      {icon && <div className="h-12 w-12 rounded-full bg-unify-blue/10 text-unify-blue flex items-center justify-center mb-3">{icon}</div>}
      <h3 className="font-display text-lg text-unify-brown">{title}</h3>
      {count !== undefined && <p className="text-sm font-sans text-muted-foreground mt-1">{count} kampanja</p>}
    </div>
  );
}
