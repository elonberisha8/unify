import * as React from "react";
import { cn } from "@/lib/utils";

export interface MessageBubbleProps {
  content: string;
  time?: string;
  self?: boolean;
  avatar?: string;
  className?: string;
}

export function MessageBubble({ content, time, self, avatar, className }: MessageBubbleProps) {
  return (
    <div className={cn("flex gap-2 max-w-[80%]", self ? "ml-auto flex-row-reverse" : "mr-auto", className)}>
      {avatar && !self && <img src={avatar} alt="" className="h-8 w-8 rounded-full object-cover flex-shrink-0" />}
      <div className={cn(
        "px-4 py-2.5 rounded-2xl font-sans text-sm",
        self ? "bg-unify-blue text-white rounded-br-md" : "bg-unify-cream text-unify-brown rounded-bl-md"
      )}>
        <p>{content}</p>
        {time && <p className={cn("text-xs mt-1", self ? "text-white/70" : "text-muted-foreground")}>{time}</p>}
      </div>
    </div>
  );
}
