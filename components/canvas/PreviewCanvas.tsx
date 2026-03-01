"use client";

import { useRef, useEffect, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { render, getOutputSize } from "./CanvasRenderer";
import { loadImage } from "@/lib/file-utils";

export function PreviewCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const rafRef = useRef<number>(0);

  const getActiveScreenshot = useAppStore((s) => s.getActiveScreenshot);
  const backgrounds = useAppStore((s) => s.backgrounds);
  const activeScreenshotId = useAppStore((s) => s.activeScreenshotId);
  // Subscribe to screenshots array to trigger re-renders on settings changes
  const screenshots = useAppStore((s) => s.screenshots);

  const activeScreenshot = screenshots.find((s) => s.id === activeScreenshotId);

  const getOrLoadImage = useCallback(
    async (url: string): Promise<HTMLImageElement> => {
      if (imageCache.current.has(url)) {
        return imageCache.current.get(url)!;
      }
      const img = await loadImage(url);
      imageCache.current.set(url, img);
      return img;
    },
    []
  );

  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !activeScreenshot) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const settings = activeScreenshot.settings;

    try {
      const screenshotImg = await getOrLoadImage(
        activeScreenshot.asset.objectUrl
      );

      let backgroundImg: HTMLImageElement | null = null;
      if (settings.background.backgroundId) {
        const bg = backgrounds.find(
          (b) => b.id === settings.background.backgroundId
        );
        if (bg) {
          backgroundImg = await getOrLoadImage(bg.objectUrl);
        }
      }

      const outputSize = getOutputSize(
        screenshotImg.width,
        screenshotImg.height,
        settings
      );

      // Fit canvas to container while maintaining aspect ratio
      const containerRect = container.getBoundingClientRect();
      const containerW = containerRect.width - 32; // padding
      const containerH = containerRect.height - 32;
      const scale = Math.min(
        containerW / outputSize.width,
        containerH / outputSize.height,
        1
      );

      const displayW = Math.round(outputSize.width * scale);
      const displayH = Math.round(outputSize.height * scale);

      // Use device pixel ratio for sharp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      canvas.style.width = `${displayW}px`;
      canvas.style.height = `${displayH}px`;
      ctx.scale(dpr * scale, dpr * scale);

      render(ctx, {
        screenshot: screenshotImg,
        background: backgroundImg,
        settings,
        outputWidth: outputSize.width,
        outputHeight: outputSize.height,
      });
    } catch {
      // Image loading failed, ignore
    }
  }, [activeScreenshot, backgrounds, getOrLoadImage]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      renderCanvas();
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [renderCanvas]);

  // Also re-render on container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        renderCanvas();
      });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [renderCanvas]);

  if (!activeScreenshot) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p className="text-sm">Upload screenshots to get started</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center justify-center overflow-hidden p-4"
      style={{ background: "repeating-conic-gradient(#e5e5e5 0% 25%, #f5f5f5 0% 50%) 0 0 / 16px 16px" }}
    >
      <canvas ref={canvasRef} className="rounded shadow-lg" />
    </div>
  );
}
