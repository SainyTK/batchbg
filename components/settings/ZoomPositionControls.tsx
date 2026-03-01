"use client";

import { useAppStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MAX_ZOOM } from "@/lib/constants";

export function ZoomPositionControls() {
  const activeScreenshot = useAppStore((s) => s.getActiveScreenshot());
  const updateActiveSettings = useAppStore((s) => s.updateActiveSettings);
  const applySettingsToAll = useAppStore((s) => s.applySettingsToAll);

  if (!activeScreenshot) return null;

  const bg = activeScreenshot.settings.background;

  const update = (changes: Partial<typeof bg>) => {
    updateActiveSettings({ background: { ...bg, ...changes } });
  };

  const applyToAll = () => {
    applySettingsToAll({
      background: { ...activeScreenshot.settings.background },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Zoom & Position</span>
        <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={applyToAll}>
          Apply to All
        </Button>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Label className="w-8 text-[10px] shrink-0">Zoom</Label>
          <Slider
            value={[bg.zoom]}
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            onValueChange={([v]) => update({ zoom: v })}
            className="flex-1"
          />
          <span className="w-10 text-right text-[10px] text-muted-foreground">
            {Math.round(bg.zoom * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Label className="w-8 text-[10px] shrink-0">X</Label>
          <Slider
            value={[bg.positionX]}
            min={-100}
            max={100}
            step={1}
            onValueChange={([v]) => update({ positionX: v })}
            className="flex-1"
          />
          <span className="w-10 text-right text-[10px] text-muted-foreground">
            {bg.positionX}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Label className="w-8 text-[10px] shrink-0">Y</Label>
          <Slider
            value={[bg.positionY]}
            min={-100}
            max={100}
            step={1}
            onValueChange={([v]) => update({ positionY: v })}
            className="flex-1"
          />
          <span className="w-10 text-right text-[10px] text-muted-foreground">
            {bg.positionY}
          </span>
        </div>
      </div>
    </div>
  );
}
