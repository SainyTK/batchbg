"use client";

import { Button } from "@/components/ui/button";
import { ExportDialog } from "@/components/export/ExportDialog";
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Sun, Moon } from "lucide-react";

export function TopBar() {
  const [exportOpen, setExportOpen] = useState(false);
  const screenshotCount = useAppStore((s) => s.screenshots.length);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
      <h1 className="text-sm font-semibold">BatchBG</h1>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setDark((d) => !d)}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button
          size="sm"
          onClick={() => setExportOpen(true)}
          disabled={screenshotCount === 0}
        >
          Export {screenshotCount > 0 && `(${screenshotCount})`}
        </Button>
      </div>
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
}
