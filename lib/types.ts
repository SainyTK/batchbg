export interface ImageAsset {
  id: string;
  name: string;
  objectUrl: string; // URL.createObjectURL for memory efficiency
  thumbnailUrl: string; // small data URL for sidebar
  width: number;
  height: number;
}

export interface BackgroundSettings {
  backgroundId: string | null; // which ImageAsset to use
  zoom: number; // 1 = 100%, range 1-3
  positionX: number; // -100 to 100 (% offset from center)
  positionY: number; // -100 to 100
}

export interface PaddingSettings {
  top: number;
  right: number;
  bottom: number;
  left: number;
  linked: boolean; // when true, all sides change together
}

export interface ShadowSettings {
  enabled: boolean;
  color: string;
  blur: number;
  spread: number;
  offsetX: number;
  offsetY: number;
}

export interface ScreenshotSettings {
  background: BackgroundSettings;
  padding: PaddingSettings;
  shadow: ShadowSettings;
  borderRadius: number;
}

export interface ScreenshotItem {
  id: string;
  asset: ImageAsset;
  settings: ScreenshotSettings;
}

export interface ExportOptions {
  format: "png" | "jpg" | "webp";
  quality: number; // 0-100 for jpg/webp
  scale: number; // 1, 2, 3
}

export interface ClipboardData {
  settings: ScreenshotSettings;
}
