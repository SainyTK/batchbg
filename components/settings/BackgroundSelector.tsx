"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function BackgroundSelector() {
  const backgrounds = useAppStore((s) => s.backgrounds);
  const activeScreenshot = useAppStore((s) => s.getActiveScreenshot());
  const updateActiveSettings = useAppStore((s) => s.updateActiveSettings);
  const applySettingsToAll = useAppStore((s) => s.applySettingsToAll);

  const currentBgId = activeScreenshot?.settings.background.backgroundId ?? null;

  const selectBg = (bgId: string | null) => {
    const current = activeScreenshot?.settings.background;
    updateActiveSettings({
      background: { ...(current ?? {}), backgroundId: bgId } as any,
    });
  };

  const applyToAll = () => {
    if (!activeScreenshot) return;
    applySettingsToAll({
      background: { ...activeScreenshot.settings.background },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Background</span>
        <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={applyToAll}>
          Apply to All
        </Button>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {/* No background / gradient option */}
        <button
          className={cn(
            "h-10 w-10 shrink-0 rounded border-2 transition-all cursor-pointer",
            currentBgId === null ? "border-primary" : "border-transparent hover:border-border"
          )}
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          onClick={() => selectBg(null)}
          title="Default gradient"
        />
        {backgrounds.map((bg) => (
          <button
            key={bg.id}
            className={cn(
              "h-10 w-10 shrink-0 overflow-hidden rounded border-2 transition-all cursor-pointer",
              currentBgId === bg.id ? "border-primary" : "border-transparent hover:border-border"
            )}
            onClick={() => selectBg(bg.id)}
            title={bg.name}
          >
            <img src={bg.thumbnailUrl} alt={bg.name} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
