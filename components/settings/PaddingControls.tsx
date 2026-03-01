"use client";

import { useAppStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MAX_PADDING } from "@/lib/constants";
import type { PaddingSettings } from "@/lib/types";

export function PaddingControls() {
  const activeScreenshot = useAppStore((s) => s.getActiveScreenshot());
  const updateActiveSettings = useAppStore((s) => s.updateActiveSettings);
  const applySettingsToAll = useAppStore((s) => s.applySettingsToAll);

  if (!activeScreenshot) return null;

  const pad = activeScreenshot.settings.padding;

  const update = (changes: Partial<PaddingSettings>) => {
    updateActiveSettings({ padding: { ...pad, ...changes } });
  };

  const setLinkedValue = (value: number) => {
    update({ top: value, right: value, bottom: value, left: value });
  };

  const applyToAll = () => {
    applySettingsToAll({
      padding: { ...activeScreenshot.settings.padding },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Padding</span>
        <div className="flex items-center gap-2">
          <Label className="text-[10px]">Link</Label>
          <Switch
            checked={pad.linked}
            onCheckedChange={(checked) => update({ linked: checked })}
            className="scale-75"
          />
          <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={applyToAll}>
            Apply to All
          </Button>
        </div>
      </div>
      {pad.linked ? (
        <div className="flex items-center gap-2">
          <Label className="w-8 text-[10px] shrink-0">All</Label>
          <Slider
            value={[pad.top]}
            min={0}
            max={MAX_PADDING}
            step={1}
            onValueChange={([v]) => setLinkedValue(v)}
            className="flex-1"
          />
          <span className="w-10 text-right text-[10px] text-muted-foreground">
            {pad.top}px
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <div key={side} className="flex items-center gap-2">
              <Label className="w-8 text-[10px] shrink-0 capitalize">
                {side.charAt(0).toUpperCase()}
              </Label>
              <Slider
                value={[pad[side]]}
                min={0}
                max={MAX_PADDING}
                step={1}
                onValueChange={([v]) => update({ [side]: v })}
                className="flex-1"
              />
              <span className="w-10 text-right text-[10px] text-muted-foreground">
                {pad[side]}px
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
