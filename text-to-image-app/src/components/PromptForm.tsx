"use client";
import React, { useEffect, useMemo, useState } from "react";

export type GenerateOptions = {
  prompt: string;
  negative_prompt?: string;
  image_dimensions: string;
  num_inference_steps: number;
  guidance_scale: number;
  scheduler: string;
};

export function PromptForm({ onCreate }: { onCreate: (opts: GenerateOptions) => void }) {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [imageDimensions, setImageDimensions] = useState("512x512");
  const [steps, setSteps] = useState(50);
  const [guidance, setGuidance] = useState(7.5);
  const [scheduler, setScheduler] = useState("DPMSolverMultistep");

  const canSubmit = useMemo(() => prompt.trim().length > 0, [prompt]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onCreate({
          prompt,
          negative_prompt: negativePrompt || undefined,
          image_dimensions: imageDimensions,
          num_inference_steps: steps,
          guidance_scale: guidance,
          scheduler,
        });
      }}
      className="space-y-3"
    >
      <label className="block">
        <div className="text-sm mb-1">Prompt</div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700"
          placeholder="Describe the image you want"
        />
      </label>

      <details className="rounded border border-neutral-300 dark:border-neutral-700 p-3">
        <summary className="cursor-pointer text-sm">Advanced options</summary>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block">
            <div className="text-sm mb-1">Negative prompt</div>
            <input
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700"
              placeholder="What to avoid"
            />
          </label>

          <label className="block">
            <div className="text-sm mb-1">Dimensions</div>
            <select
              value={imageDimensions}
              onChange={(e) => setImageDimensions(e.target.value)}
              className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700"
            >
              <option>512x512</option>
              <option>768x768</option>
              <option>1024x1024</option>
            </select>
          </label>

          <label className="block">
            <div className="text-sm mb-1">Steps</div>
            <input
              type="number"
              min={10}
              max={150}
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700"
            />
          </label>

          <label className="block">
            <div className="text-sm mb-1">Guidance</div>
            <input
              type="number"
              step={0.5}
              min={1}
              max={20}
              value={guidance}
              onChange={(e) => setGuidance(Number(e.target.value))}
              className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700"
            />
          </label>

          <label className="block">
            <div className="text-sm mb-1">Scheduler</div>
            <select
              value={scheduler}
              onChange={(e) => setScheduler(e.target.value)}
              className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700"
            >
              <option>DPMSolverMultistep</option>
              <option>K_EULER</option>
              <option>K_EULER_ANCESTRAL</option>
              <option>PNDM</option>
            </select>
          </label>
        </div>
      </details>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          Generate
        </button>
      </div>
    </form>
  );
}


