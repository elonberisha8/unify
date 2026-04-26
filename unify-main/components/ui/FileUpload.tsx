"use client";
import * as React from "react";
import { UploadIcon, CloseIcon, FileIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
  label?: string;
  hint?: string;
  className?: string;
}

export function FileUpload({
  accept,
  multiple = false,
  maxSize,
  onFilesChange,
  label = "Tërhiq file-t këtu ose kliko për të ngarkuar",
  hint,
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const updateFiles = (fl: File[]) => {
    const next = multiple ? [...files, ...fl] : fl.slice(0, 1);
    setFiles(next);
    onFilesChange?.(next);
  };

  const remove = (i: number) => {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    onFilesChange?.(next);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false);
          updateFiles(Array.from(e.dataTransfer.files));
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors",
          dragOver ? "border-unify-blue bg-unify-blue/5" : "border-border hover:border-unify-blue/50"
        )}
      >
        <UploadIcon className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-sans text-unify-brown">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && updateFiles(Array.from(e.target.files))}
        />
      </div>
      {files.map((f, i) => (
        <div key={i} className="flex items-center gap-3 bg-card p-3 rounded-xl border">
          <FileIcon className="h-5 w-5 text-unify-blue" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{f.name}</p>
            <p className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onClick={() => remove(i)} className="p-1 hover:bg-muted rounded">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
