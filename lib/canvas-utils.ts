import type { ScreenshotSettings } from "./types";

export interface RenderParams {
  screenshot: HTMLImageElement;
  background: HTMLImageElement | null;
  settings: ScreenshotSettings;
  canvasWidth: number;
  canvasHeight: number;
}

export function calculateOutputSize(
  screenshotWidth: number,
  screenshotHeight: number,
  settings: ScreenshotSettings
): { width: number; height: number } {
  const { padding } = settings;
  return {
    width: screenshotWidth + padding.left + padding.right,
    height: screenshotHeight + padding.top + padding.bottom,
  };
}

export function renderToCanvas(
  ctx: CanvasRenderingContext2D,
  params: RenderParams
): void {
  const { screenshot, background, settings, canvasWidth, canvasHeight } = params;
  const { padding, shadow } = settings;
  const bgSettings = settings.background;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw background
  if (background) {
    const zoom = bgSettings.zoom;
    const coverScale = Math.max(
      canvasWidth / background.width,
      canvasHeight / background.height
    );
    const bgW = background.width * coverScale * zoom;
    const bgH = background.height * coverScale * zoom;
    const offsetX =
      (canvasWidth - bgW) / 2 + (bgSettings.positionX / 100) * (canvasWidth / 2);
    const offsetY =
      (canvasHeight - bgH) / 2 + (bgSettings.positionY / 100) * (canvasHeight / 2);
    ctx.drawImage(background, offsetX, offsetY, bgW, bgH);
  } else {
    const grad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    grad.addColorStop(0, "#667eea");
    grad.addColorStop(1, "#764ba2");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Screenshot position
  const sx = padding.left;
  const sy = padding.top;
  const sw = canvasWidth - padding.left - padding.right;
  const sh = canvasHeight - padding.top - padding.bottom;

  // Draw shadow anchored to screenshot shape (respects transparency)
  if (shadow.enabled && sw > 0 && sh > 0) {
    ctx.save();
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.offsetX;
    ctx.shadowOffsetY = shadow.offsetY;
    ctx.drawImage(screenshot, sx, sy, sw, sh);
    ctx.restore();
  }

  // Draw screenshot on top (no border radius)
  if (sw > 0 && sh > 0) {
    ctx.drawImage(screenshot, sx, sy, sw, sh);
  }
}
