import { create } from "zustand";
import { nanoid } from "nanoid";
import type {
  ScreenshotItem,
  ImageAsset,
  ScreenshotSettings,
  ClipboardData,
} from "./types";
import { DEFAULT_SETTINGS } from "./constants";
import { processImageFile, revokeObjectUrl } from "./file-utils";

interface AppState {
  // Screenshots
  screenshots: ScreenshotItem[];
  activeScreenshotId: string | null;
  selectedIds: Set<string>;

  // Backgrounds
  backgrounds: ImageAsset[];

  // Clipboard
  clipboard: ClipboardData | null;

  // Actions - Screenshots
  addScreenshots: (files: File[]) => Promise<void>;
  removeScreenshots: (ids: string[]) => void;
  setActiveScreenshot: (id: string) => void;
  toggleSelection: (id: string, shiftKey: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;

  // Actions - Backgrounds
  addBackgrounds: (files: File[]) => Promise<void>;
  removeBackground: (id: string) => void;

  // Actions - Settings
  updateSettings: (id: string, settings: Partial<ScreenshotSettings>) => void;
  updateActiveSettings: (settings: Partial<ScreenshotSettings>) => void;
  applySettingsToSelected: (settings: Partial<ScreenshotSettings>) => void;
  applySettingsToAll: (settings: Partial<ScreenshotSettings>) => void;

  // Actions - Clipboard
  copySettings: () => void;
  pasteSettings: () => void;

  // Helpers
  getActiveScreenshot: () => ScreenshotItem | undefined;
}

function deepCloneSettings(s: ScreenshotSettings): ScreenshotSettings {
  return {
    background: { ...s.background },
    padding: { ...s.padding },
    shadow: { ...s.shadow },
    borderRadius: s.borderRadius,
  };
}

function mergeSettings(
  current: ScreenshotSettings,
  partial: Partial<ScreenshotSettings>
): ScreenshotSettings {
  return {
    background: partial.background
      ? { ...current.background, ...partial.background }
      : current.background,
    padding: partial.padding
      ? { ...current.padding, ...partial.padding }
      : current.padding,
    shadow: partial.shadow
      ? { ...current.shadow, ...partial.shadow }
      : current.shadow,
    borderRadius: partial.borderRadius ?? current.borderRadius,
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  screenshots: [],
  activeScreenshotId: null,
  selectedIds: new Set(),
  backgrounds: [],
  clipboard: null,

  addScreenshots: async (files) => {
    const items: ScreenshotItem[] = [];
    for (const file of files) {
      const result = await processImageFile(file);
      const id = nanoid();
      items.push({
        id,
        asset: {
          id,
          name: file.name,
          objectUrl: result.objectUrl,
          thumbnailUrl: result.thumbnailUrl,
          width: result.width,
          height: result.height,
        },
        settings: deepCloneSettings(DEFAULT_SETTINGS),
      });
    }
    set((state) => {
      const newScreenshots = [...state.screenshots, ...items];
      return {
        screenshots: newScreenshots,
        activeScreenshotId:
          state.activeScreenshotId ?? items[0]?.id ?? null,
        selectedIds:
          state.selectedIds.size === 0 && items.length > 0
            ? new Set([items[0].id])
            : state.selectedIds,
      };
    });
  },

  removeScreenshots: (ids) => {
    set((state) => {
      const removeSet = new Set(ids);
      // Revoke object URLs
      state.screenshots
        .filter((s) => removeSet.has(s.id))
        .forEach((s) => revokeObjectUrl(s.asset.objectUrl));

      const remaining = state.screenshots.filter((s) => !removeSet.has(s.id));
      const newSelected = new Set(
        [...state.selectedIds].filter((id) => !removeSet.has(id))
      );

      let newActive = state.activeScreenshotId;
      if (newActive && removeSet.has(newActive)) {
        newActive = remaining[0]?.id ?? null;
      }
      if (newActive && newSelected.size === 0 && remaining.length > 0) {
        newSelected.add(newActive);
      }

      return {
        screenshots: remaining,
        activeScreenshotId: newActive,
        selectedIds: newSelected,
      };
    });
  },

  setActiveScreenshot: (id) => {
    set({ activeScreenshotId: id, selectedIds: new Set([id]) });
  },

  toggleSelection: (id, shiftKey) => {
    set((state) => {
      if (!shiftKey) {
        return { activeScreenshotId: id, selectedIds: new Set([id]) };
      }
      const newSelected = new Set(state.selectedIds);
      if (newSelected.has(id)) {
        newSelected.delete(id);
        if (newSelected.size === 0) {
          return { selectedIds: new Set([id]), activeScreenshotId: id };
        }
        const newActive =
          state.activeScreenshotId === id
            ? [...newSelected][0]
            : state.activeScreenshotId;
        return { selectedIds: newSelected, activeScreenshotId: newActive };
      }
      newSelected.add(id);
      return { selectedIds: newSelected, activeScreenshotId: id };
    });
  },

  selectAll: () => {
    set((state) => ({
      selectedIds: new Set(state.screenshots.map((s) => s.id)),
    }));
  },

  clearSelection: () => {
    set((state) => ({
      selectedIds: state.activeScreenshotId
        ? new Set([state.activeScreenshotId])
        : new Set(),
    }));
  },

  addBackgrounds: async (files) => {
    const items: ImageAsset[] = [];
    for (const file of files) {
      const result = await processImageFile(file);
      const id = nanoid();
      items.push({
        id,
        name: file.name,
        objectUrl: result.objectUrl,
        thumbnailUrl: result.thumbnailUrl,
        width: result.width,
        height: result.height,
      });
    }
    set((state) => ({ backgrounds: [...state.backgrounds, ...items] }));
  },

  removeBackground: (id) => {
    set((state) => {
      const bg = state.backgrounds.find((b) => b.id === id);
      if (bg) revokeObjectUrl(bg.objectUrl);
      // Remove background reference from any screenshots using it
      const screenshots = state.screenshots.map((s) =>
        s.settings.background.backgroundId === id
          ? {
              ...s,
              settings: {
                ...s.settings,
                background: { ...s.settings.background, backgroundId: null },
              },
            }
          : s
      );
      return {
        backgrounds: state.backgrounds.filter((b) => b.id !== id),
        screenshots,
      };
    });
  },

  updateSettings: (id, partial) => {
    set((state) => ({
      screenshots: state.screenshots.map((s) =>
        s.id === id
          ? { ...s, settings: mergeSettings(s.settings, partial) }
          : s
      ),
    }));
  },

  updateActiveSettings: (partial) => {
    const { selectedIds } = get();
    set((state) => ({
      screenshots: state.screenshots.map((s) =>
        selectedIds.has(s.id)
          ? { ...s, settings: mergeSettings(s.settings, partial) }
          : s
      ),
    }));
  },

  applySettingsToSelected: (partial) => {
    const { selectedIds } = get();
    set((state) => ({
      screenshots: state.screenshots.map((s) =>
        selectedIds.has(s.id)
          ? { ...s, settings: mergeSettings(s.settings, partial) }
          : s
      ),
    }));
  },

  applySettingsToAll: (partial) => {
    set((state) => ({
      screenshots: state.screenshots.map((s) => ({
        ...s,
        settings: mergeSettings(s.settings, partial),
      })),
    }));
  },

  copySettings: () => {
    const active = get().getActiveScreenshot();
    if (active) {
      set({ clipboard: { settings: deepCloneSettings(active.settings) } });
    }
  },

  pasteSettings: () => {
    const { clipboard, selectedIds } = get();
    if (!clipboard) return;
    set((state) => ({
      screenshots: state.screenshots.map((s) =>
        selectedIds.has(s.id)
          ? { ...s, settings: deepCloneSettings(clipboard.settings) }
          : s
      ),
    }));
  },

  getActiveScreenshot: () => {
    const state = get();
    return state.screenshots.find((s) => s.id === state.activeScreenshotId);
  },
}));
