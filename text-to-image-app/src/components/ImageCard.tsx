"use client";
import React from "react";

export type GeneratedImage = {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  model: string;
  dimensions: string;
};

export function ImageCard({ image, onOpen }: { image: GeneratedImage; onOpen: (image: GeneratedImage) => void }) {
  return (
    <div className="rounded border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-900">
      <div className="aspect-square bg-neutral-100 dark:bg-neutral-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt={image.prompt} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 space-y-2">
        <div className="text-sm line-clamp-2" title={image.prompt}>{image.prompt}</div>
        <div className="text-xs text-neutral-500">{new Date(image.createdAt).toLocaleString()}</div>
        <div className="text-xs text-neutral-500">{image.model} • {image.dimensions}</div>
        <div className="flex gap-2">
          <button
            className="text-sm px-3 py-1 border rounded border-neutral-300 dark:border-neutral-700"
            onClick={() => onOpen(image)}
          >
            Details
          </button>
          <DownloadMenu url={image.url} />
        </div>
      </div>
    </div>
  );
}

function DownloadMenu({ url }: { url: string }) {
  const download = async (size: number) => {
    const img = await fetch(url).then((r) => r.blob());
    const bitmap = await createImageBitmap(img);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(bitmap, 0, 0, size, size);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `image-${size}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };

  return (
    <div className="relative">
      <details className="group">
        <summary className="list-none cursor-pointer text-sm px-3 py-1 border rounded border-neutral-300 dark:border-neutral-700 select-none">Download</summary>
        <div className="absolute mt-2 z-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded shadow p-2 space-y-1">
          <button className="block w-full text-left text-sm px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded" onClick={() => download(512)}>512x512</button>
          <button className="block w-full text-left text-sm px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded" onClick={() => download(1024)}>1024x1024</button>
        </div>
      </details>
    </div>
  );
}


