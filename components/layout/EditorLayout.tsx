"use client";

import { PreviewCanvas } from "@/components/canvas/PreviewCanvas";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { ScreenshotStrip } from "@/components/sidebar/ScreenshotStrip";
import { TopBar } from "@/components/layout/TopBar";

export function EditorLayout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TopBar />

      {/* Main area: Preview (3/4) | Settings (1/4) */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-[3] overflow-hidden">
          <PreviewCanvas />
        </div>
        <div className="w-[300px] shrink-0 overflow-y-auto border-l border-border bg-card">
          <SettingsPanel />
        </div>
      </div>

      {/* Bottom screenshot strip */}
      <ScreenshotStrip />
    </div>
  );
}
