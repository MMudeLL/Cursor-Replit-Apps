"use client";
import React from "react";
import type { GeneratedImage } from "./ImageCard";

export function ImageModal({ image, onClose }: { image: GeneratedImage | null; onClose: () => void }) {
  if (!image) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-3xl w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded" onClick={(e) => e.stopPropagation()}>
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
          <div className="text-sm font-medium">Image details</div>
          <button className="text-sm px-3 py-1 border rounded border-neutral-300 dark:border-neutral-700" onClick={onClose}>Close</button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt={image.prompt} className="w-full object-contain max-h-[60vh] bg-black" />
        <div className="p-4 text-sm space-y-1">
          <div><span className="text-neutral-500">Prompt:</span> {image.prompt}</div>
          <div className="text-neutral-500">{new Date(image.createdAt).toLocaleString()}</div>
          <div className="text-neutral-500">{image.model} • {image.dimensions}</div>
        </div>
      </div>
    </div>
  );
}


