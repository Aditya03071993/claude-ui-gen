"use client";

import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
}

function basename(path: string): string {
  return path.split("/").filter(Boolean).pop() ?? path;
}

export function getToolCallLabel(
  toolName: string,
  args: Record<string, unknown>
): string {
  const path = typeof args.path === "string" ? args.path : "";
  const filename = basename(path) || "file";

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return `Editing ${filename}`;
      case "view":
        return `Reading ${filename}`;
      case "undo_edit":
        return `Undoing edit in ${filename}`;
      default:
        return `Editing ${filename}`;
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "delete":
        return `Deleting ${filename}`;
      case "rename": {
        const newPath = typeof args.new_path === "string" ? args.new_path : "";
        const newFilename = basename(newPath) || "file";
        return `Renaming ${filename} to ${newFilename}`;
      }
      default:
        return `Managing ${filename}`;
    }
  }

  return toolName;
}

export function ToolCallBadge({ toolName, args, state }: ToolCallBadgeProps) {
  const label = getToolCallLabel(toolName, args);
  const isPending = state !== "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isPending ? (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" data-testid="spinner" />
      ) : (
        <div className="w-2 h-2 rounded-full bg-emerald-500" data-testid="done-indicator" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
