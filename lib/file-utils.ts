import { THUMBNAIL_SIZE } from "./constants";

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function generateThumbnail(
  objectUrl: string,
  maxSize = THUMBNAIL_SIZE
): Promise<string> {
  const img = await loadImage(objectUrl);
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.7);
}

export function createObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeObjectUrl(url: string): void {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export async function processImageFile(
  file: File
): Promise<{ objectUrl: string; thumbnailUrl: string; width: number; height: number }> {
  const objectUrl = createObjectUrl(file);
  const img = await loadImage(objectUrl);
  const thumbnailUrl = await generateThumbnail(objectUrl);
  return {
    objectUrl,
    thumbnailUrl,
    width: img.width,
    height: img.height,
  };
}
