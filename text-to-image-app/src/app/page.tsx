"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { PromptForm, type GenerateOptions } from "../components/PromptForm";
import { ProgressStatus } from "../components/ProgressStatus";
import { ImageCard, type GeneratedImage } from "../components/ImageCard";
import { ImageModal } from "../components/ImageModal";

type Prediction = {
  id: string;
  status: string;
  output?: string[] | string;
  error?: string | null;
  logs?: string;
  metrics?: Record<string, unknown>;
};

export default function Home() {
  const [prediction, setPrediction] = useState(null as Prediction | null);
  const [isGenerating, setIsGenerating] = useState(false as boolean);
  const [error, setError] = useState(null as string | null);
  const [gallery, setGallery] = useState([] as GeneratedImage[]);
  const [selected, setSelected] = useState(null as GeneratedImage | null);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(gallery.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return gallery.slice().reverse().slice(start, start + pageSize);
  }, [gallery, page]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("replicate:gallery");
      if (raw) setGallery(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("replicate:gallery", JSON.stringify(gallery));
    } catch {}
  }, [gallery]);

  async function createPrediction(opts: GenerateOptions) {
    setIsGenerating(true);
    setError(null);
    setPrediction(null);
    try {
      const res = await fetch("/api/replicate/generate-image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(opts),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to create prediction");
      const { id } = await res.json();
      await pollPrediction(id, opts);
    } catch (e: any) {
      setError(e?.message || "Unknown error");
      setIsGenerating(false);
    }
  }

  async function pollPrediction(id: string, opts: GenerateOptions) {
    const interval = 1500;
    while (true) {
      const res = await fetch(`/api/replicate/generate-image?id=${id}`);
      const data: Prediction = await res.json();
      setPrediction(data);
      if (data.status === "succeeded") {
        const outputs = (Array.isArray(data.output) ? data.output : [data.output])
          .filter((u): u is string => typeof u === "string" && Boolean(u));
        if (outputs.length > 0) {
          const newItems: GeneratedImage[] = outputs.map((url, i) => ({
            id: `${id}-${i}`,
            url,
            prompt: opts.prompt,
            createdAt: new Date().toISOString(),
            model: "stable-diffusion",
            dimensions: opts.image_dimensions,
          }));
          setGallery((g: GeneratedImage[]) => [...g, ...newItems]);
        }
        setIsGenerating(false);
        break;
      }
      if (data.status === "failed" || data.status === "canceled") {
        setIsGenerating(false);
        setError(data.error || "Generation failed");
        break;
      }
      await new Promise((r) => setTimeout(r, interval));
    }
  }

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1">
          <div className="border rounded p-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <h1 className="text-lg font-semibold mb-3">AI Image Generator</h1>
            <PromptForm onCreate={createPrediction} />
            <div className="mt-4 space-y-2">
              {isGenerating && <div className="text-sm text-neutral-600 dark:text-neutral-300">Generating…</div>}
              {prediction && <ProgressStatus status={prediction.status} logs={prediction.logs} />}
              {error && <div className="text-sm text-red-600">{error}</div>}
            </div>
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="border rounded p-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">Gallery</h2>
              <div className="text-sm text-neutral-600 dark:text-neutral-300">{gallery.length} images</div>
            </div>
            {gallery.length === 0 ? (
              <div className="text-sm text-neutral-600 dark:text-neutral-300">No images yet. Generate your first!</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {pageItems.map((img: GeneratedImage) => (
                  <div key={img.id}>
                    <ImageCard image={img} onOpen={setSelected as unknown as (image: GeneratedImage) => void} />
                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button className="px-3 py-1 border rounded border-neutral-300 dark:border-neutral-700" disabled={page===1} onClick={() => setPage((p: number) => Math.max(1, p-1))}>Prev</button>
                <div className="text-sm">Page {page} / {totalPages}</div>
                <button className="px-3 py-1 border rounded border-neutral-300 dark:border-neutral-700" disabled={page===totalPages} onClick={() => setPage((p: number) => Math.min(totalPages, p+1))}>Next</button>
              </div>
            )}
          </div>
        </section>
      </div>

      <ImageModal image={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
