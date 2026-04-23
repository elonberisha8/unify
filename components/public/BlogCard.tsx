"use client";
import * as React from "react";
import { CalendarIcon, ClockIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

export interface BlogCardProps {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  readTime?: string;
  variant?: "default" | "featured" | "horizontal";
  onClick?: () => void;
  className?: string;
}

export function BlogCard({
  title, excerpt, imageUrl, category, author, publishedAt,
  readTime, variant = "default", onClick, className,
}: BlogCardProps) {
  const isHorizontal = variant === "horizontal";
  return (
    <Card
      className={cn(
        "overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer",
        isHorizontal && "flex flex-row",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("relative overflow-hidden bg-muted", isHorizontal ? "w-1/3 shrink-0" : "aspect-video w-full")}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-unify-cream" />
        )}
        {category && <Badge variant="primary" className="absolute top-3 left-3">{category}</Badge>}
      </div>
      <CardContent className="p-5 flex-1 space-y-2">
        <h3 className={cn("font-display text-unify-brown line-clamp-2 group-hover:text-unify-blue transition-colors", variant === "featured" ? "text-2xl" : "text-lg")}>
          {title}
        </h3>
        {excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>}
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
          {author && <span className="font-bold text-foreground">{author}</span>}
          {publishedAt && <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{publishedAt}</span>}
          {readTime && <span className="flex items-center gap-1"><ClockIcon className="h-3 w-3" />{readTime}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
