"use client";

import { useAppStore } from "@/lib/store";
import { BackgroundSelector } from "./BackgroundSelector";
import { ZoomPositionControls } from "./ZoomPositionControls";
import { PaddingControls } from "./PaddingControls";
import { ShadowControls } from "./ShadowControls";
import { Separator } from "@/components/ui/separator";

export function SettingsBar() {
  const activeScreenshot = useAppStore((s) => s.getActiveScreenshot());

  if (!activeScreenshot) return null;

  return (
    <div className="shrink-0 border-t border-border bg-card p-3">
      <div className="flex gap-6 overflow-x-auto">
        <div className="min-w-[200px]">
          <BackgroundSelector />
        </div>
        <Separator orientation="vertical" className="h-auto" />
        <div className="min-w-[200px]">
          <ZoomPositionControls />
        </div>
        <Separator orientation="vertical" className="h-auto" />
        <div className="min-w-[200px]">
          <PaddingControls />
        </div>
        <Separator orientation="vertical" className="h-auto" />
        <div className="min-w-[200px]">
          <ShadowControls />
        </div>
      </div>
    </div>
  );
}
