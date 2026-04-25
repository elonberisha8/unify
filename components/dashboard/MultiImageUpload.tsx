"use client";

import * as React from "react";
import { PlusIcon, TrashIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
  className?: string;
}

/**
 * Multi-image uploader — allows up to `max` images (default 10).
 * In a real app, files would be uploaded to Cloudinary and the returned
 * URL stored. Here we use blob URLs for preview; backend should accept
 * uploaded file references and convert to permanent URLs.
 */
export function MultiImageUpload({ images, onChange, max = 10, className }: MultiImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = max - images.length;
    const take = Array.from(files).slice(0, remaining);
    const urls = take.map((f) => URL.createObjectURL(f));
    onChange([...images, ...urls]);
  }

  function removeAt(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {images.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition shadow"
              aria-label="Hiq fotonë"
            >
              <TrashIcon className="h-3 w-3" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-unify-blue text-white text-[10px] font-bold">
                Kryesore
              </span>
            )}
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-unify-blue hover:bg-blue-50/50 flex flex-col items-center justify-center text-gray-500 transition"
          >
            <PlusIcon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Shto foto</span>
            <span className="text-[10px] text-gray-400">{images.length}/{max}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          Foto e parë do të jetë <strong>kryesore</strong> (në cards, OG image, etj.).
        </p>
      )}
    </div>
  );
}
