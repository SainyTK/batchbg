import type {
  BackgroundSettings,
  PaddingSettings,
  ShadowSettings,
  ScreenshotSettings,
  ExportOptions,
} from "./types";

export const DEFAULT_BACKGROUND: BackgroundSettings = {
  backgroundId: null,
  zoom: 1,
  positionX: 0,
  positionY: 0,
};

export const DEFAULT_PADDING: PaddingSettings = {
  top: 64,
  right: 64,
  bottom: 64,
  left: 64,
  linked: true,
};

export const DEFAULT_SHADOW: ShadowSettings = {
  enabled: true,
  color: "rgba(0, 0, 0, 0.3)",
  blur: 40,
  spread: 0,
  offsetX: 0,
  offsetY: 20,
};

export const DEFAULT_SETTINGS: ScreenshotSettings = {
  background: { ...DEFAULT_BACKGROUND },
  padding: { ...DEFAULT_PADDING },
  shadow: { ...DEFAULT_SHADOW },
  borderRadius: 0,
};

export const DEFAULT_EXPORT: ExportOptions = {
  format: "png",
  quality: 90,
  scale: 2,
};

export const THUMBNAIL_SIZE = 200;
export const MAX_PADDING = 200;
export const MAX_BLUR = 100;
export const MAX_SPREAD = 50;
export const MAX_OFFSET = 100;
export const MAX_ZOOM = 3;
export const MAX_BORDER_RADIUS = 48;
