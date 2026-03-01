"use client";

import { EditorLayout } from "@/components/layout/EditorLayout";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function Home() {
  useKeyboardShortcuts();

  return <EditorLayout />;
}
