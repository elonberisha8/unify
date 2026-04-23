"use client";
import * as React from "react";
import { BoldIcon, ItalicIcon, LinkIcon, ListIcon, ImageIcon, HeadingIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface BlogEditorData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
}

export interface BlogEditorProps {
  initialData?: Partial<BlogEditorData>;
  onSave?: (d: BlogEditorData) => void;
  onPublish?: (d: BlogEditorData) => void;
  className?: string;
}

export function BlogEditor({ initialData, onSave, onPublish, className }: BlogEditorProps) {
  const [data, setData] = React.useState<BlogEditorData>({
    title: "", slug: "", excerpt: "", content: "", tags: [], ...initialData,
  });
  const upd = (k: keyof BlogEditorData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData({ ...data, [k]: e.target.value });
  return (
    <div className={cn("bg-card rounded-[20px] border border-border overflow-hidden", className)}>
      <div className="p-6 border-b border-border">
        <input
          value={data.title}
          onChange={upd("title")}
          placeholder="Titulli i postimit..."
          className="w-full font-display text-3xl text-unify-brown bg-transparent focus:outline-none placeholder:text-muted-foreground/50"
        />
        <input
          value={data.slug}
          onChange={upd("slug")}
          placeholder="slug-i-postimit"
          className="mt-2 w-full font-mono text-sm text-muted-foreground bg-transparent focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-1 p-3 border-b border-border">
        {[HeadingIcon, BoldIcon, ItalicIcon, LinkIcon, ListIcon, ImageIcon].map((Icon, i) => (
          <button key={i} className="h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center text-unify-brown">
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <div className="p-6 space-y-4">
        <textarea
          value={data.excerpt}
          onChange={upd("excerpt")}
          rows={2}
          placeholder="Përshkrimi i shkurtër..."
          className="w-full font-sans text-sm text-unify-brown bg-transparent border-b border-border pb-3 focus:outline-none resize-none"
        />
        <textarea
          value={data.content}
          onChange={upd("content")}
          rows={16}
          placeholder="Fillo të shkruash..."
          className="w-full font-sans text-base text-unify-brown bg-transparent focus:outline-none resize-none leading-relaxed"
        />
      </div>
      <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-muted/30">
        <Button variant="outline" onClick={() => onSave?.(data)}>Ruaj draftin</Button>
        <Button onClick={() => onPublish?.(data)}>Publiko</Button>
      </div>
    </div>
  );
}
