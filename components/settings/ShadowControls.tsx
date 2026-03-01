"use client";

import { useAppStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MAX_BLUR, MAX_OFFSET } from "@/lib/constants";
import type { ShadowSettings } from "@/lib/types";

export function ShadowControls() {
  const activeScreenshot = useAppStore((s) => s.getActiveScreenshot());
  const updateActiveSettings = useAppStore((s) => s.updateActiveSettings);
  const applySettingsToAll = useAppStore((s) => s.applySettingsToAll);

  if (!activeScreenshot) return null;

  const shadow = activeScreenshot.settings.shadow;

  const updateShadow = (changes: Partial<ShadowSettings>) => {
    updateActiveSettings({ shadow: { ...shadow, ...changes } });
  };

  const applyToAll = () => {
    applySettingsToAll({
      shadow: { ...activeScreenshot.settings.shadow },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Shadow</span>
        <div className="flex items-center gap-2">
          <Switch
            checked={shadow.enabled}
            onCheckedChange={(checked) => updateShadow({ enabled: checked })}
            className="scale-75"
          />
          <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={applyToAll}>
            Apply to All
          </Button>
        </div>
      </div>
      {shadow.enabled && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Label className="w-10 text-[10px] shrink-0">Blur</Label>
            <Slider
              value={[shadow.blur]}
              min={0}
              max={MAX_BLUR}
              step={1}
              onValueChange={([v]) => updateShadow({ blur: v })}
              className="flex-1"
            />
            <span className="w-10 text-right text-[10px] text-muted-foreground">
              {shadow.blur}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-10 text-[10px] shrink-0">X Off</Label>
            <Slider
              value={[shadow.offsetX]}
              min={-MAX_OFFSET}
              max={MAX_OFFSET}
              step={1}
              onValueChange={([v]) => updateShadow({ offsetX: v })}
              className="flex-1"
            />
            <span className="w-10 text-right text-[10px] text-muted-foreground">
              {shadow.offsetX}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-10 text-[10px] shrink-0">Y Off</Label>
            <Slider
              value={[shadow.offsetY]}
              min={-MAX_OFFSET}
              max={MAX_OFFSET}
              step={1}
              onValueChange={([v]) => updateShadow({ offsetY: v })}
              className="flex-1"
            />
            <span className="w-10 text-right text-[10px] text-muted-foreground">
              {shadow.offsetY}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
