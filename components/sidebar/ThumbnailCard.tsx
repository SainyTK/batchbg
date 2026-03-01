"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

interface ThumbnailCardProps {
  thumbnailUrl: string;
  name: string;
  selected: boolean;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  onRemove: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  hasClipboard?: boolean;
}

export function ThumbnailCard({
  thumbnailUrl,
  name,
  selected,
  active,
  onClick,
  onRemove,
  onCopy,
  onPaste,
  hasClipboard,
}: ThumbnailCardProps) {
  const card = (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
        active
          ? "border-primary ring-1 ring-primary"
          : selected
            ? "border-primary/50"
            : "border-transparent hover:border-border"
      )}
      onClick={onClick}
    >
      <img
        src={thumbnailUrl}
        alt={name}
        className="h-auto w-full object-cover"
        draggable={false}
      />
      <button
        className="cursor-pointer absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 truncate bg-black/50 px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100">
        {name}
      </div>
    </div>
  );

  if (onCopy) {
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>{card}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onCopy}>
            Copy Settings (Cmd+C)
          </ContextMenuItem>
          {hasClipboard && (
            <ContextMenuItem onClick={onPaste}>
              Paste Settings (Cmd+V)
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  return card;
}
