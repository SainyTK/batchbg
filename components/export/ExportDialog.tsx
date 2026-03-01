"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { exportAll } from "./exportRenderer";
import { DEFAULT_EXPORT } from "@/lib/constants";
import type { ExportOptions } from "@/lib/types";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const screenshots = useAppStore((s) => s.screenshots);
  const backgrounds = useAppStore((s) => s.backgrounds);

  const [options, setOptions] = useState<ExportOptions>({ ...DEFAULT_EXPORT });
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportAll(screenshots, backgrounds, options, (current, total) => {
        setProgress({ current, total });
      });
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setExporting(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Screenshots</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label className="w-20 shrink-0">Format</Label>
            <Select
              value={options.format}
              onValueChange={(v) =>
                setOptions({ ...options, format: v as ExportOptions["format"] })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPEG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {options.format !== "png" && (
            <div className="flex items-center gap-4">
              <Label className="w-20 shrink-0">Quality</Label>
              <Slider
                value={[options.quality]}
                min={10}
                max={100}
                step={5}
                onValueChange={([v]) =>
                  setOptions({ ...options, quality: v })
                }
                className="flex-1"
              />
              <span className="w-12 text-right text-sm text-muted-foreground">
                {options.quality}%
              </span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <Label className="w-20 shrink-0">Scale</Label>
            <Select
              value={String(options.scale)}
              onValueChange={(v) =>
                setOptions({ ...options, scale: Number(v) })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
                <SelectItem value="3">3x</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground">
            {screenshots.length} screenshot{screenshots.length !== 1 && "s"} will
            be exported
            {screenshots.length > 1 && " as a ZIP file"}.
          </p>

          {exporting && (
            <div className="space-y-1">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Processing {progress.current} of {progress.total}...
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={exporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
