import type { ScreenshotItem, ExportOptions, ImageAsset } from "@/lib/types";
import { render, getOutputSize } from "@/components/canvas/CanvasRenderer";
import { loadImage } from "@/lib/file-utils";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function renderSingle(
  item: ScreenshotItem,
  backgrounds: ImageAsset[],
  options: ExportOptions
): Promise<Blob> {
  const screenshotImg = await loadImage(item.asset.objectUrl);
  const settings = item.settings;

  let backgroundImg: HTMLImageElement | null = null;
  if (settings.background.backgroundId) {
    const bg = backgrounds.find(
      (b) => b.id === settings.background.backgroundId
    );
    if (bg) {
      backgroundImg = await loadImage(bg.objectUrl);
    }
  }

  const outputSize = getOutputSize(
    screenshotImg.width,
    screenshotImg.height,
    settings
  );

  const scale = options.scale;
  const canvas = document.createElement("canvas");
  canvas.width = outputSize.width * scale;
  canvas.height = outputSize.height * scale;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  render(ctx, {
    screenshot: screenshotImg,
    background: backgroundImg,
    settings,
    outputWidth: outputSize.width,
    outputHeight: outputSize.height,
  });

  return new Promise((resolve, reject) => {
    const mimeType =
      options.format === "jpg"
        ? "image/jpeg"
        : options.format === "webp"
          ? "image/webp"
          : "image/png";
    const quality = options.format === "png" ? undefined : options.quality / 100;

    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob"));
      },
      mimeType,
      quality
    );
  });
}

export async function exportAll(
  items: ScreenshotItem[],
  backgrounds: ImageAsset[],
  options: ExportOptions,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  if (items.length === 1) {
    onProgress?.(0, 1);
    const blob = await renderSingle(items[0], backgrounds, options);
    const ext = options.format === "jpg" ? "jpg" : options.format;
    const name = items[0].asset.name.replace(/\.[^.]+$/, "");
    saveAs(blob, `${name}.${ext}`);
    onProgress?.(1, 1);
    return;
  }

  // Multiple items: zip
  const zip = new JSZip();
  for (let i = 0; i < items.length; i++) {
    onProgress?.(i, items.length);
    const blob = await renderSingle(items[i], backgrounds, options);
    const ext = options.format === "jpg" ? "jpg" : options.format;
    const name = items[i].asset.name.replace(/\.[^.]+$/, "");
    zip.file(`${name}.${ext}`, blob);
  }
  onProgress?.(items.length, items.length);
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "batchbg-export.zip");
}
