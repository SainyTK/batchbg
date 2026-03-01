"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFiles: (files: File[]) => void;
  label: string;
  accept?: string;
  compact?: boolean;
}

export function UploadDropzone({
  onFiles,
  label,
  accept,
  compact,
}: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (files.length > 0) onFiles(files);
    },
    [onFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) onFiles(files);
      e.target.value = "";
    },
    [onFiles],
  );

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-center text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
        compact ? "w-full aspect-video" : "p-2",
        dragging && "border-primary bg-primary/5 text-foreground",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept ?? "image/*"}
        className="hidden"
        onChange={handleChange}
      />
      {label}
    </div>
  );
}
