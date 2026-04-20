"use client";
import * as React from "react";
import { FacebookIcon, TwitterIcon, LinkedinIcon, LinkIcon, CheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface ShareButtonsProps {
  url: string;
  title?: string;
  className?: string;
}

export function ShareButtons({ url, title = "", className }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);
  const enc = (s: string) => encodeURIComponent(s);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const btn = "h-10 w-10 rounded-full flex items-center justify-center bg-white border border-border hover:border-unify-brown transition-colors";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Ndaj në FacebookIcon">
        <FacebookIcon className="h-4 w-4" />
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Ndaj në X/TwitterIcon">
        <TwitterIcon className="h-4 w-4" />
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Ndaj në LinkedIn">
        <LinkedinIcon className="h-4 w-4" />
      </a>
      <button onClick={copy} className={btn} aria-label="Kopjo linkun">
        {copied ? <CheckIcon className="h-4 w-4 text-unify-green" /> : <LinkIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}
