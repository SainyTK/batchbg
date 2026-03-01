"use client";

import { ScreenshotPanel } from "./ScreenshotPanel";
import { BackgroundPanel } from "./BackgroundPanel";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <ScreenshotPanel />
      </div>
      <Separator />
      <div className="h-[280px] shrink-0 overflow-y-auto">
        <BackgroundPanel />
      </div>
    </div>
  );
}
