"use client";

import { useAppStore } from "@/lib/store";
import { UploadDropzone } from "@/components/sidebar/UploadDropzone";
import { X } from "lucide-react";

export function BackgroundUpload() {
  const backgrounds = useAppStore((s) => s.backgrounds);
  const addBackgrounds = useAppStore((s) => s.addBackgrounds);
  const removeBackground = useAppStore((s) => s.removeBackground);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        Background Images
      </span>
      <UploadDropzone
        onFiles={addBackgrounds}
        label="Drop backgrounds or click to upload"
      />
      {backgrounds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {backgrounds.map((bg) => (
            <div
              key={bg.id}
              className="group relative h-10 w-10 shrink-0 overflow-hidden rounded"
            >
              <img
                src={bg.thumbnailUrl}
                alt={bg.name}
                className="h-full w-full object-cover"
              />
              <button
                className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                onClick={() => removeBackground(bg.id)}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
