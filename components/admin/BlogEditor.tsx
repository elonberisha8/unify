"use client";

import * as React from "react";
import { BoldIcon, HeadingIcon, ImageIcon, ItalicIcon, LinkIcon, ListIcon } from "@/components/icons";
import { Button } from "@/components/ui";
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
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: [],
    ...initialData,
  });

  React.useEffect(() => {
    setData({ title: "", slug: "", excerpt: "", content: "", tags: [], ...initialData });
  }, [initialData]);

  const upd = (k: keyof BlogEditorData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData({ ...data, [k]: e.target.value });

  const insertContent = (before: string, after = "", placeholder = "tekst") => {
    const snippet = `${before}${placeholder}${after}`;
    setData({ ...data, content: data.content ? `${data.content}\n${snippet}` : snippet });
  };

  const toolbar = [
    { icon: HeadingIcon, label: "Heading", onClick: () => insertContent("## ") },
    { icon: BoldIcon, label: "Bold", onClick: () => insertContent("**", "**") },
    { icon: ItalicIcon, label: "Italic", onClick: () => insertContent("_", "_") },
    { icon: LinkIcon, label: "Link", onClick: () => insertContent("[", "](https://unify.al)", "link") },
    { icon: ListIcon, label: "Liste", onClick: () => insertContent("- ") },
    { icon: ImageIcon, label: "Imazh", onClick: () => insertContent("![", "](/placeholder-blog-cover.jpg)", "pershkrim") },
  ];

  return (
    <div className={cn("overflow-hidden rounded-[20px] border border-border bg-card", className)}>
      <div className="border-b border-border p-6">
        <input
          value={data.title}
          onChange={upd("title")}
          placeholder="Titulli i postimit..."
          className="w-full bg-transparent font-display text-3xl text-unify-brown placeholder:text-muted-foreground/50 focus:outline-none"
        />
        <input
          value={data.slug}
          onChange={upd("slug")}
          placeholder="slug-i-postimit"
          className="mt-2 w-full bg-transparent font-mono text-sm text-muted-foreground focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-1 border-b border-border p-3">
        {toolbar.map((item) => (
          <button
            key={item.label}
            type="button"
            title={item.label}
            aria-label={item.label}
            onClick={item.onClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-unify-brown hover:bg-muted"
          >
            <item.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <div className="space-y-4 p-6">
        <textarea
          value={data.excerpt}
          onChange={upd("excerpt")}
          rows={2}
          placeholder="Pershkrimi i shkurter..."
          className="w-full resize-none border-b border-border bg-transparent pb-3 font-sans text-sm text-unify-brown focus:outline-none"
        />
        <textarea
          value={data.content}
          onChange={upd("content")}
          rows={16}
          placeholder="Fillo te shkruash..."
          className="w-full resize-none bg-transparent font-sans text-base leading-relaxed text-unify-brown focus:outline-none"
        />
      </div>
      <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/30 p-4">
        <Button variant="outline" onClick={() => onSave?.(data)}>Ruaj draftin</Button>
        <Button onClick={() => onPublish?.(data)}>Publiko</Button>
      </div>
    </div>
  );
}
