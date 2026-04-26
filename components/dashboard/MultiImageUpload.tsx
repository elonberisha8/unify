"use client";

import * as React from "react";
import { useAuth } from "@/app/_lib/useAuthLocal";
import { PlusIcon, TrashIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/app/_lib/api";

export interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
  className?: string;
}

interface CloudinarySignature {
  signature: string;
  timestamp: number;
  folder: string;
  cloudName: string;
  apiKey: string;
}

/**
 * MultiImageUpload — ngarkon foto në Cloudinary direkt nga browseri
 *
 * Flow:
 * 1. Kërko signature nga backend: GET /api/uploads/signature
 * 2. Përdor signature për të bërë POST direkt te Cloudinary
 * 3. Ruaj URL-në publike që Cloudinary kthen
 *
 * Fallback: nëse Cloudinary dështon, përdor blob URL (preview lokal)
 */
export function MultiImageUpload({ images, onChange, max = 10, className }: MultiImageUploadProps) {
  const { getToken } = useAuth();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  async function uploadOne(file: File): Promise<string> {
    // 1) Get signature nga backend
    const token = await getToken().catch(() => null);
    const sig = await apiFetch<CloudinarySignature>("/uploads/signature", { token });

    // 2) POST direkt te Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", String(sig.timestamp));
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url as string;
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    const remaining = max - images.length;
    const take = Array.from(files).slice(0, remaining);

    setUploading(true);
    setProgress(0);
    const uploaded: string[] = [];
    for (let i = 0; i < take.length; i++) {
      try {
        const url = await uploadOne(take[i]);
        uploaded.push(url);
      } catch (e) {
        // Fallback: blob URL (preview lokal për demo)
        console.warn("Cloudinary failed, using blob:", e);
        uploaded.push(URL.createObjectURL(take[i]));
        setError("⚠️ Cloudinary nuk është konfiguruar — duke përdorur preview lokal (foto do humbasin pas refresh)");
      }
      setProgress(Math.round(((i + 1) / take.length) * 100));
    }
    onChange([...images, ...uploaded]);
    setUploading(false);
    setProgress(0);
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

        {images.length < max && !uploading && (
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

        {uploading && (
          <div className="aspect-square rounded-lg border-2 border-dashed border-unify-blue/40 bg-blue-50 flex flex-col items-center justify-center text-unify-blue">
            <div className="animate-spin h-6 w-6 border-2 border-unify-blue border-t-transparent rounded-full mb-2" />
            <span className="text-xs font-medium">Duke ngarkuar...</span>
            <span className="text-[10px]">{progress}%</span>
          </div>
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

      {error && (
        <p className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded px-2 py-1">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          Foto e parë do të jetë <strong>kryesore</strong> (në cards, OG image, etj.).
        </p>
      )}
    </div>
  );
}

