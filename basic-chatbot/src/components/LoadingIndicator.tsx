"use client";
export function LoadingIndicator({ text = "Loading…" }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span className="inline-block h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
      <span>{text}</span>
    </div>
  );
}


