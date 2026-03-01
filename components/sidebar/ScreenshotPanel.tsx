"use client";

import { useAppStore } from "@/lib/store";
import { UploadDropzone } from "./UploadDropzone";
import { ThumbnailCard } from "./ThumbnailCard";

export function ScreenshotPanel() {
  const screenshots = useAppStore((s) => s.screenshots);
  const selectedIds = useAppStore((s) => s.selectedIds);
  const activeId = useAppStore((s) => s.activeScreenshotId);
  const clipboard = useAppStore((s) => s.clipboard);
  const addScreenshots = useAppStore((s) => s.addScreenshots);
  const removeScreenshots = useAppStore((s) => s.removeScreenshots);
  const toggleSelection = useAppStore((s) => s.toggleSelection);
  const copySettings = useAppStore((s) => s.copySettings);
  const pasteSettings = useAppStore((s) => s.pasteSettings);

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Screenshots
      </div>
      <UploadDropzone
        onFiles={addScreenshots}
        label="Drop screenshots here or click to upload"
      />
      <div className="grid grid-cols-2 gap-2">
        {screenshots.map((s) => (
          <ThumbnailCard
            key={s.id}
            thumbnailUrl={s.asset.thumbnailUrl}
            name={s.asset.name}
            selected={selectedIds.has(s.id)}
            active={s.id === activeId}
            onClick={(e) => toggleSelection(s.id, e.shiftKey)}
            onRemove={() => removeScreenshots([s.id])}
            onCopy={copySettings}
            onPaste={pasteSettings}
            hasClipboard={!!clipboard}
          />
        ))}
      </div>
    </div>
  );
}
