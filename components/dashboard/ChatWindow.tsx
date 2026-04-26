"use client";
import * as React from "react";
import { SendIcon } from "@/components/icons";
import { MessageBubble } from "./MessageBubble";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  content: string;
  time: string;
  self?: boolean;
  avatar?: string;
  senderName?: string;
}

export interface ChatWindowProps {
  peer: { name: string; avatar?: string; status?: string };
  messages: ChatMessage[];
  onSend?: (text: string) => void;
  className?: string;
}

export function ChatWindow({ peer, messages, onSend, className }: ChatWindowProps) {
  const [text, setText] = React.useState("");
  const send = () => { if (text.trim()) { onSend?.(text.trim()); setText(""); } };
  return (
    <div className={cn("flex flex-col h-full bg-card", className)}>
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
          {peer.avatar && <img src={peer.avatar} alt="" className="h-full w-full object-cover" />}
        </div>
        <div>
          <p className="font-sans font-bold text-sm text-unify-brown">{peer.name}</p>
          {peer.status && <p className="font-sans text-xs text-muted-foreground">{peer.status}</p>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <MessageBubble key={m.id} content={m.content} time={m.time} self={m.self} avatar={m.avatar} />
        ))}
      </div>
      <div className="p-4 border-t border-border flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Shkruaj një mesazh..."
          className="flex-1 h-11 px-4 rounded-full border border-border font-sans text-sm focus:outline-none focus:border-unify-blue"
        />
        <button onClick={send} className="h-11 w-11 rounded-full bg-unify-blue text-white flex items-center justify-center hover:bg-[#0a90f3]">
          <SendIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
