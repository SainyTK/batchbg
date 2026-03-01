import type { ScreenshotSettings } from "@/lib/types";

export interface RenderInput {
  screenshot: HTMLImageElement;
  background: HTMLImageElement | null;
  settings: ScreenshotSettings;
  outputWidth: number;
  outputHeight: number;
}

export function getOutputSize(
  screenshotWidth: number,
  screenshotHeight: number,
  settings: ScreenshotSettings
): { width: number; height: number } {
  return {
    width: screenshotWidth + settings.padding.left + settings.padding.right,
    height: screenshotHeight + settings.padding.top + settings.padding.bottom,
  };
}

export function render(
  ctx: CanvasRenderingContext2D,
  input: RenderInput
): void {
  const { screenshot, background, settings, outputWidth, outputHeight } = input;
  const { padding, shadow } = settings;
  const bgSettings = settings.background;

  ctx.clearRect(0, 0, outputWidth, outputHeight);

  // 1. Draw background
  if (background) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, outputWidth, outputHeight);
    ctx.clip();

    const zoom = bgSettings.zoom;
    const coverScale = Math.max(
      outputWidth / background.width,
      outputHeight / background.height
    );
    const bgW = background.width * coverScale * zoom;
    const bgH = background.height * coverScale * zoom;
    const offsetX =
      (outputWidth - bgW) / 2 + (bgSettings.positionX / 100) * (outputWidth / 2);
    const offsetY =
      (outputHeight - bgH) / 2 + (bgSettings.positionY / 100) * (outputHeight / 2);
    ctx.drawImage(background, offsetX, offsetY, bgW, bgH);
    ctx.restore();
  } else {
    const grad = ctx.createLinearGradient(0, 0, outputWidth, outputHeight);
    grad.addColorStop(0, "#667eea");
    grad.addColorStop(1, "#764ba2");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, outputWidth, outputHeight);
  }

  // 2. Screenshot placement
  const sx = padding.left;
  const sy = padding.top;
  const sw = outputWidth - padding.left - padding.right;
  const sh = outputHeight - padding.top - padding.bottom;

  // 3. Drop shadow anchored to screenshot shape (respects transparency)
  if (shadow.enabled && sw > 0 && sh > 0) {
    ctx.save();
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.offsetX;
    ctx.shadowOffsetY = shadow.offsetY;
    ctx.drawImage(screenshot, sx, sy, sw, sh);
    ctx.restore();
  }

  // 4. Draw screenshot on top (no border radius - sharp corners)
  if (sw > 0 && sh > 0) {
    ctx.drawImage(screenshot, sx, sy, sw, sh);
  }
}
