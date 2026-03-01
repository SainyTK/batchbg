"use client";

import { useAppStore } from "@/lib/store";
import { UploadDropzone } from "./UploadDropzone";
import { ThumbnailCard } from "./ThumbnailCard";

export function ScreenshotStrip() {
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
    <div className="shrink-0 border-t border-border bg-card">
      <div className="flex items-center gap-2 overflow-x-auto p-3 pb-2">
        {screenshots.map((s) => (
          <div key={s.id} className="w-[100px] shrink-0">
            <ThumbnailCard
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
          </div>
        ))}
        <div className="w-[100px] shrink-0">
          <UploadDropzone
            onFiles={addScreenshots}
            label="+"
            compact
          />
        </div>
      </div>
    </div>
  );
}
