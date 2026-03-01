"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Ignore if typing in an input
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const {
        selectedIds,
        screenshots,
        removeScreenshots,
        selectAll,
        clearSelection,
        copySettings,
        pasteSettings,
      } = useAppStore.getState();

      // Delete / Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        if (selectedIds.size > 0) {
          removeScreenshots([...selectedIds]);
        }
      }

      // Cmd+A / Ctrl+A - Select all
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        selectAll();
      }

      // Cmd+C / Ctrl+C - Copy settings
      if ((e.metaKey || e.ctrlKey) && e.key === "c") {
        e.preventDefault();
        copySettings();
      }

      // Cmd+V / Ctrl+V - Paste settings
      if ((e.metaKey || e.ctrlKey) && e.key === "v") {
        e.preventDefault();
        pasteSettings();
      }

      // Escape - Clear selection
      if (e.key === "Escape") {
        e.preventDefault();
        clearSelection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
