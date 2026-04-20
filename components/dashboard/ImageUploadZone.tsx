"use client";
import * as React from "react";
import { ImagePlusIcon, CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface ImageUploadZoneProps {
  value?: string;
  onChange?: (file: File | null) => void;
  label?: string;
  hint?: string;
  aspect?: "square" | "video" | "wide";
  className?: string;
}

export function ImageUploadZone({ value, onChange, label = "Ngarko imazh", hint, aspect = "video", className }: ImageUploadZoneProps) {
  const [preview, setPreview] = React.useState<string | undefined>(value);
  const ref = React.useRef<HTMLInputElement>(null);
  const aspects = { square: "aspect-square", video: "aspect-video", wide: "aspect-[16/6]" }[aspect];
  const handle = (f: File | null) => {
    if (f) { setPreview(URL.createObjectURL(f)); onChange?.(f); }
    else { setPreview(undefined); onChange?.(null); }
  };
  return (
    <div className={cn("relative w-full rounded-2xl border-2 border-dashed border-border overflow-hidden", aspects, className)}>
      {preview ? (
        <>
          <img src={preview} alt="" className="h-full w-full object-cover" />
          <button
            onClick={() => handle(null)}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
            aria-label="Hiq"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </>
      ) : (
        <button
          onClick={() => ref.current?.click()}
          className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-unify-cream/30 transition-colors"
        >
          <ImagePlusIcon className="h-10 w-10" />
          <span className="font-sans text-sm text-unify-brown">{label}</span>
          {hint && <span className="font-sans text-xs">{hint}</span>}
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => handle(e.target.files?.[0] ?? null)} />
    </div>
  );
}
