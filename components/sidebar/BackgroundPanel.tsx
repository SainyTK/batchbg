"use client";

import { useAppStore } from "@/lib/store";
import { UploadDropzone } from "./UploadDropzone";
import { ThumbnailCard } from "./ThumbnailCard";

export function BackgroundPanel() {
  const backgrounds = useAppStore((s) => s.backgrounds);
  const addBackgrounds = useAppStore((s) => s.addBackgrounds);
  const removeBackground = useAppStore((s) => s.removeBackground);

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Backgrounds
      </div>
      <UploadDropzone
        onFiles={addBackgrounds}
        label="Drop backgrounds here or click to upload"
      />
      <div className="grid grid-cols-3 gap-2">
        {backgrounds.map((bg) => (
          <ThumbnailCard
            key={bg.id}
            thumbnailUrl={bg.thumbnailUrl}
            name={bg.name}
            selected={false}
            active={false}
            onClick={() => {}}
            onRemove={() => removeBackground(bg.id)}
          />
        ))}
      </div>
    </div>
  );
}
