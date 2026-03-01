"use client";

import { useAppStore } from "@/lib/store";
import { BackgroundSelector } from "./BackgroundSelector";
import { ZoomPositionControls } from "./ZoomPositionControls";
import { PaddingControls } from "./PaddingControls";
import { ShadowControls } from "./ShadowControls";
import { BackgroundUpload } from "./BackgroundUpload";
import { Separator } from "@/components/ui/separator";

export function SettingsPanel() {
  const activeScreenshot = useAppStore((s) => s.getActiveScreenshot());

  if (!activeScreenshot) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
        Upload screenshots to configure settings
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-4">
      <BackgroundUpload />
      <Separator className="my-2" />
      <BackgroundSelector />
      <Separator className="my-2" />
      <ZoomPositionControls />
      <Separator className="my-2" />
      <PaddingControls />
      <Separator className="my-2" />
      <ShadowControls />
    </div>
  );
}
